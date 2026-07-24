import weatherService from '../../services/weather/weather.service.js';
import resolveLang from '../../utils/resolveLang.js';

class WeatherController {
  getWeather = async (req, res, next) => {
    try {
      const lang = resolveLang(req);
      const data = await weatherService.getWeatherForActiveFarm(req.user, lang);
      res.status(200).json({
        success: true,
        message: 'Live weather data fetched successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  getDashboardWeather = async (req, res, next) => {
    return this.getWeather(req, res, next);
  };

  getCurrentWeather = async (req, res, next) => {
    return this.getWeather(req, res, next);
  };

  getForecast = async (req, res, next) => {
    try {
      const lang = resolveLang(req);
      const data = await weatherService.getWeatherForActiveFarm(req.user, lang);
      res.status(200).json({
        success: true,
        message: 'Live forecast fetched successfully',
        data: {
          location: data.location,
          hourly: data.hourly,
          daily: data.daily,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  getDebugWeather = async (req, res, next) => {
    try {
      const lang = resolveLang(req);
      const data = await weatherService.getDebugWeatherData(req.user, lang);
      res.status(200).json({
        success: true,
        message: 'Weather debug pipeline output',
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new WeatherController();
