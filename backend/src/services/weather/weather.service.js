import axios from 'axios';
import farmRepository from '../../repositories/farm/farm.repository.js';
import Notification, { NOTIFICATION_TYPES, NOTIFICATION_PRIORITY } from '../../models/Notification.js';
import logger from '../../config/logger.js';
import { evaluateAgricultureRules } from '../../utils/agricultureRuleEngine.js';
import {
  formatLocationObject,
  formatCurrentWeatherObject,
  formatHourlyForecastList,
  formatDailyForecastList,
  formatAirQualityObject,
  formatAlertsList,
} from '../../utils/weatherFormatter.js';

class WeatherService {
  /**
   * Resolve user's active farm and coordinates strictly from DB
   */
  async resolveActiveFarm(user) {
    let farm = null;
    if (user && user.activeFarm) {
      const farmId = typeof user.activeFarm === 'string' ? user.activeFarm : user.activeFarm._id;
      farm = await farmRepository.findFarmById(farmId);
    }
    if (!farm && user && user._id) {
      farm = await farmRepository.findFirstUserFarm(user._id);
    }
    if (!farm) {
      farm = await farmRepository.findFirstUserFarm();
    }
    if (!farm) {
      const error = new Error('No active farm found in database. Please register a farm first.');
      error.statusCode = 400;
      throw error;
    }

    const coords = farm.location?.coordinates || [];
    const lng = Number(coords[0]);
    const lat = Number(coords[1]);

    if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
      const error = new Error('No coordinates found for active farm.');
      error.statusCode = 400;
      throw error;
    }

    return { farm, lat, lng };
  }

  /**
   * Single WeatherAPI request call with strict coordinate verification and logging
   */
  async fetchWeatherApiData(farm, lat, lng) {
    const apiKey = process.env.WEATHERAPI_KEY || process.env.WEATHER_API_KEY;
    const baseUrl = process.env.WEATHERAPI_BASE_URL || 'https://api.weatherapi.com/v1';

    if (!apiKey || apiKey === 'your_weatherapi_key_here') {
      logger.error('WEATHERAPI_KEY is missing or unconfigured in environment variables.');
      const error = new Error('Weather Service Unavailable (Invalid WeatherAPI Key)');
      error.statusCode = 503;
      throw error;
    }

    const queryCoords = `${lat},${lng}`;
    const requestUrl = `${baseUrl}/forecast.json?key=${apiKey}&q=${queryCoords}&days=7&aqi=yes&alerts=yes`;

    // Verify coordinate equality
    const requestLat = Number(lat);
    const requestLng = Number(lng);
    const farmLat = Number(farm.location?.coordinates?.[1]);
    const farmLng = Number(farm.location?.coordinates?.[0]);

    if (Math.abs(requestLat - farmLat) > 0.0001 || Math.abs(requestLng - farmLng) > 0.0001) {
      throw new Error(`Coordinate Mismatch Error: Farm coords (${farmLat}, ${farmLng}) !== Request coords (${requestLat}, ${requestLng})`);
    }

    const executeCall = async () => {
      const res = await axios.get(requestUrl, { timeout: 8000 });
      const raw = res.data || {};

      const firstForecastDay = raw.forecast?.forecastday?.[0] || {};
      const forecastDays = raw.forecast?.forecastday || [];
      const hoursList = firstForecastDay.hour || [];

      // Format location strictly using Active Farm DB data (NEVER WeatherAPI station name)
      const location = formatLocationObject(farm, lat, lng);
      const current = formatCurrentWeatherObject(raw.current, firstForecastDay);
      const hourly = formatHourlyForecastList(hoursList);
      const daily = formatDailyForecastList(forecastDays);
      const airQuality = formatAirQualityObject(raw.current?.air_quality);
      const agriculture = evaluateAgricultureRules(current || {});
      const alerts = formatAlertsList(raw.alerts, current || {});

      if (!current) {
        throw new Error('Failed to parse WeatherAPI response.');
      }

      const formattedResponse = {
        location,
        current,
        hourly,
        daily,
        airQuality,
        agriculture,
        alerts,
        lastUpdated: new Date().toISOString(),
      };

      // STEP 7: PRINT SEPARATED USER FARM LOCATION VS WEATHER API STATION LOCATION LOGS
      const addr = farm.address || {};
      console.log('\n====================================');
      console.log('USER FARM LOCATION (DB):');
      console.log(`village:   ${addr.village || 'N/A'}`);
      console.log(`district:  ${addr.district || 'N/A'}`);
      console.log(`state:     ${addr.state || 'N/A'}`);
      console.log(`country:   ${addr.country || 'India'}`);
      console.log(`display:   ${location.weatherLocationName}`);
      console.log('\nWEATHER API STATION LOCATION (IGNORED FOR DISPLAY):');
      console.log(`name:      ${raw.location?.name}`);
      console.log(`region:    ${raw.location?.region}`);
      console.log(`country:   ${raw.location?.country}`);
      console.log('====================================\n');

      return {
        rawResponse: raw,
        requestUrl,
        queryCoords,
        apiKeyLoaded: Boolean(apiKey),
        formattedResponse,
      };
    };

    try {
      return await executeCall();
    } catch (err) {
      logger.warn(`First WeatherAPI call attempt failed: ${err.message}. Retrying once...`);
      try {
        return await executeCall();
      } catch (retryErr) {
        logger.error(`WeatherAPI call failed after retry: ${retryErr.message}`);
        const error = new Error('Weather Service Unavailable');
        error.statusCode = 503;
        throw error;
      }
    }
  }

  /**
   * Save notifications
   */
  async saveWeatherNotifications(userId, farmId, farmName, alerts = []) {
    if (!userId || !alerts || alerts.length === 0) return;
    try {
      const notifications = alerts.map((a) => ({
        userId,
        farmId,
        type: NOTIFICATION_TYPES.WEATHER || 'WEATHER',
        priority: a.severity === 'HIGH' ? NOTIFICATION_PRIORITY.HIGH : NOTIFICATION_PRIORITY.MEDIUM,
        title: `🌧️ ${a.title}`,
        message: `${a.message} (${farmName})`,
      }));

      await Notification.insertMany(notifications);
      logger.info(`Stored ${notifications.length} weather notifications for user ${userId}`);
    } catch (err) {
      logger.warn(`Failed to store notifications: ${err.message}`);
    }
  }

  /**
   * Get Live WeatherAPI Data for Active Farm (Cache completely disabled)
   */
  async getWeatherForActiveFarm(user) {
    const startTime = Date.now();
    const { farm, lat, lng } = await this.resolveActiveFarm(user);

    logger.info(`Fetching live WeatherAPI data for user [${user?._id || 'guest'}] farmId [${farm._id}] at lat:${lat}, lng:${lng}`);
    const payload = await this.fetchWeatherApiData(farm, lat, lng);

    if (user?._id) {
      await this.saveWeatherNotifications(user._id, farm._id, farm.farmName, payload.formattedResponse.alerts);
    }

    const responseTime = Date.now() - startTime;
    logger.info(`Live WeatherAPI call completed in ${responseTime}ms`);

    return {
      isCached: false,
      ...payload.formattedResponse,
    };
  }

  /**
   * Debug Weather Endpoint (GET /api/weather/debug)
   */
  async getDebugWeatherData(user) {
    const { farm, lat, lng } = await this.resolveActiveFarm(user);
    const payload = await this.fetchWeatherApiData(farm, lat, lng);

    return {
      farm: {
        id: farm._id,
        name: farm.farmName,
        latitude: lat,
        longitude: lng,
      },
      request: {
        url: payload.requestUrl,
        query: payload.queryCoords,
        apiKeyLoaded: payload.apiKeyLoaded,
      },
      weatherApiRaw: payload.rawResponse,
      formattedResponse: payload.formattedResponse,
    };
  }

  /**
   * Standardized AI Weather Context Object
   */
  async getWeatherContext(user) {
    try {
      const data = await this.getWeatherForActiveFarm(user);
      const c = data.current || {};
      const f = (data.daily && data.daily[1]) || {};

      return {
        temperature: c.temperature ?? 30,
        humidity: c.humidity ?? 65,
        wind: c.windSpeed ?? 12,
        condition: c.weatherCondition ?? 'Clear',
        rainChance: c.rainProbability ?? 20,
        forecast: `Tomorrow: ${f.condition || 'clear sky'} with max ${f.maximumTemperature || 32}°C and ${f.rainChance || 15}% rain chance.`,
      };
    } catch (err) {
      return {
        temperature: 30,
        humidity: 65,
        wind: 12,
        condition: 'Clear',
        rainChance: 20,
        forecast: 'Clear sky expected.',
      };
    }
  }
}

export default new WeatherService();
