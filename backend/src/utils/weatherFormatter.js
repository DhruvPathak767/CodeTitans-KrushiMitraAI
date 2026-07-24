/**
 * Map WeatherAPI condition text / code into internal frontend icon identifier
 */
export const mapWeatherIcon = (conditionText = '', conditionCode = 1000) => {
  const text = (conditionText || '').toLowerCase();
  if (text.includes('sunny') || text.includes('clear') || conditionCode === 1000) {
    return 'sun';
  }
  if (text.includes('partly cloudy') || conditionCode === 1003) {
    return 'cloud-sun';
  }
  if (text.includes('cloud') || text.includes('overcast') || conditionCode === 1006 || conditionCode === 1009) {
    return 'cloud';
  }
  if (text.includes('thunder') || text.includes('lightning') || conditionCode >= 1273) {
    return 'cloud-lightning';
  }
  if (text.includes('rain') || text.includes('drizzle') || text.includes('shower') || (conditionCode >= 1180 && conditionCode <= 1246)) {
    return 'cloud-rain';
  }
  if (text.includes('snow') || text.includes('ice') || text.includes('sleet') || conditionCode >= 1210) {
    return 'snowflake';
  }
  if (text.includes('mist') || text.includes('fog')) {
    return 'cloud-fog';
  }
  return 'cloud-sun';
};

/**
 * Format Location Object strictly from active farm database record (NEVER WeatherAPI station name)
 */
export const formatLocationObject = (farm = {}, lat, lng) => {
  const addr = farm.address || {};
  const village = addr.village || null;
  const taluka = addr.taluka || null;
  const district = addr.district || null;
  const state = addr.state || null;
  const country = addr.country || 'India';
  const pincode = addr.pincode || null;

  // Build display location strictly from Farm Database fields: village, district, state, country
  const locParts = [village, district, state, country].filter(Boolean);
  const weatherLocationName = locParts.join(', ') || addr.formattedAddress || `Lat: ${lat}, Lng: ${lng}`;

  return {
    farmName: farm.farmName || 'My Farm',
    village,
    taluka,
    district,
    state,
    country,
    pincode,
    latitude: Number(lat),
    longitude: Number(lng),
    formattedAddress: addr.formattedAddress || weatherLocationName,
    weatherLocationName,
  };
};

/**
 * Format Current Weather strictly from WeatherAPI JSON (weather values only)
 */
export const formatCurrentWeatherObject = (rawCurrent = {}, firstForecastDay = {}) => {
  if (!rawCurrent || Object.keys(rawCurrent).length === 0) {
    return null;
  }

  const dayObj = firstForecastDay.day || {};
  const astroObj = firstForecastDay.astro || {};
  const cond = rawCurrent.condition || {};

  const temp = rawCurrent.temp_c !== undefined ? rawCurrent.temp_c : null;
  const feelsLike = rawCurrent.feelslike_c !== undefined ? rawCurrent.feelslike_c : null;
  const minTemp = dayObj.mintemp_c !== undefined ? dayObj.mintemp_c : temp;
  const maxTemp = dayObj.maxtemp_c !== undefined ? dayObj.maxtemp_c : temp;
  const humidity = rawCurrent.humidity !== undefined ? rawCurrent.humidity : null;
  const pressure = rawCurrent.pressure_mb !== undefined ? rawCurrent.pressure_mb : null;
  const visibility = rawCurrent.vis_km !== undefined ? rawCurrent.vis_km : null;
  const cloudCoverage = rawCurrent.cloud !== undefined ? rawCurrent.cloud : null;

  const windSpeed = rawCurrent.wind_kph !== undefined ? rawCurrent.wind_kph : null;
  const windDirection = rawCurrent.wind_degree !== undefined ? rawCurrent.wind_degree : null;
  const windGust = rawCurrent.gust_kph !== undefined ? rawCurrent.gust_kph : windSpeed;

  const rainProb = dayObj.daily_chance_of_rain !== undefined ? dayObj.daily_chance_of_rain : (cloudCoverage > 75 ? 60 : 10);
  const rainVol = rawCurrent.precip_mm !== undefined ? rawCurrent.precip_mm : 0;
  const snowVol = 0;

  const condition = cond.text || null;
  const description = cond.text || null;
  const icon = mapWeatherIcon(cond.text, cond.code);

  const sunrise = astroObj.sunrise || null;
  const sunset = astroObj.sunset || null;

  const dewPoint = rawCurrent.dewpoint_c !== undefined ? rawCurrent.dewpoint_c : (temp !== null && humidity !== null ? temp - ((100 - humidity) / 5) : null);
  const uvIndex = rawCurrent.uv !== undefined ? rawCurrent.uv : null;

  return {
    temperature: temp,
    feelsLike,
    minimumTemperature: minTemp,
    maximumTemperature: maxTemp,
    humidity,
    pressure,
    visibility,
    cloudCoverage,
    windSpeed,
    windDirection,
    windGust,
    rainProbability: rainProb,
    rainVolume: rainVol,
    snowVolume: snowVol,
    uvIndex,
    dewPoint,
    sunrise,
    sunset,
    weatherCondition: condition,
    weatherDescription: description,
    weatherIcon: icon,
    lastUpdated: rawCurrent.last_updated || new Date().toISOString(),
  };
};

/**
 * Format 24-Hour (8 x 3-Hour slots) Hourly Forecast from WeatherAPI forecastday[0].hour
 */
export const formatHourlyForecastList = (hoursList = []) => {
  if (!Array.isArray(hoursList) || hoursList.length === 0) return [];

  const indices = [0, 3, 6, 9, 12, 15, 18, 21];
  const items = indices.map((i) => hoursList[i] || hoursList[0]);

  return items.map((item) => {
    let timeStr = item.time ? item.time.split(' ')[1] : '';
    if (item.time) {
      const dt = new Date(item.time.replace(' ', 'T'));
      if (!isNaN(dt.getTime())) {
        timeStr = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    }

    return {
      time: timeStr || '12:00 PM',
      temperature: item.temp_c !== undefined ? item.temp_c : null,
      feelsLike: item.feelslike_c !== undefined ? item.feelslike_c : null,
      humidity: item.humidity !== undefined ? item.humidity : null,
      rainChance: item.chance_of_rain !== undefined ? item.chance_of_rain : 0,
      windSpeed: item.wind_kph !== undefined ? item.wind_kph : null,
      pressure: item.pressure_mb !== undefined ? item.pressure_mb : null,
      cloudCoverage: item.cloud !== undefined ? item.cloud : null,
    };
  });
};

/**
 * Format 7-Day Daily Forecast from WeatherAPI forecastday
 */
export const formatDailyForecastList = (forecastDays = []) => {
  if (!Array.isArray(forecastDays) || forecastDays.length === 0) return [];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return forecastDays.slice(0, 7).map((item, idx) => {
    const d = new Date(item.date);
    const dayName = idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : daysOfWeek[d.getDay()];
    const day = item.day || {};
    const astro = item.astro || {};
    const cond = day.condition || {};

    return {
      date: item.date,
      dayName,
      maximumTemperature: day.maxtemp_c !== undefined ? day.maxtemp_c : null,
      minimumTemperature: day.mintemp_c !== undefined ? day.mintemp_c : null,
      humidity: day.avghumidity !== undefined ? day.avghumidity : null,
      rainChance: day.daily_chance_of_rain !== undefined ? day.daily_chance_of_rain : 0,
      wind: day.maxwind_kph !== undefined ? day.maxwind_kph : null,
      pressure: day.totalprecip_mm !== undefined ? day.totalprecip_mm : null,
      clouds: cond.text || null,
      sunrise: astro.sunrise || '06:12 AM',
      sunset: astro.sunset || '07:15 PM',
      condition: cond.text || null,
      icon: mapWeatherIcon(cond.text, cond.code),
    };
  });
};

/**
 * Format WeatherAPI Air Quality Object (aqi 1-6)
 */
export const formatAirQualityObject = (airQualityRaw = {}) => {
  if (!airQualityRaw || Object.keys(airQualityRaw).length === 0) {
    return null;
  }

  const epaIndex = airQualityRaw['us-epa-index'] ?? 1;
  const statusMap = {
    1: 'Good',
    2: 'Moderate',
    3: 'Unhealthy for Sensitive Groups',
    4: 'Unhealthy',
    5: 'Very Unhealthy',
    6: 'Hazardous',
  };

  return {
    aqi: epaIndex,
    aqiStatus: statusMap[epaIndex] || 'Good',
    pm25: airQualityRaw.pm2_5 !== undefined ? Number(airQualityRaw.pm2_5.toFixed(1)) : null,
    pm10: airQualityRaw.pm10 !== undefined ? Number(airQualityRaw.pm10.toFixed(1)) : null,
    co: airQualityRaw.co !== undefined ? Number(airQualityRaw.co.toFixed(1)) : null,
    no2: airQualityRaw.no2 !== undefined ? Number(airQualityRaw.no2.toFixed(1)) : null,
    so2: airQualityRaw.so2 !== undefined ? Number(airQualityRaw.so2.toFixed(1)) : null,
    o3: airQualityRaw.o3 !== undefined ? Number(airQualityRaw.o3.toFixed(1)) : null,
    nh3: airQualityRaw.nh3 !== undefined ? Number(airQualityRaw.nh3.toFixed(1)) : null,
  };
};

/**
 * Map WeatherAPI alerts into standardized alerts list
 */
export const formatAlertsList = (rawAlerts = [], current = {}) => {
  const alerts = [];

  if (Array.isArray(rawAlerts?.alert)) {
    rawAlerts.alert.forEach((a) => {
      alerts.push({
        type: a.event || 'WEATHER_ALERT',
        title: a.event || 'Weather Alert',
        severity: a.severity || 'MEDIUM',
        message: a.headline || a.desc || 'Weather advisory issued for area.',
      });
    });
  }

  if (current.rainProbability && current.rainProbability >= 60) {
    alerts.push({
      type: 'HEAVY_RAIN',
      title: 'Heavy Rain Alert',
      severity: 'HIGH',
      message: `High rain probability (${current.rainProbability}%). Delay chemical spraying & check farm drainage.`,
    });
  }
  if (current.temperature && current.temperature >= 38) {
    alerts.push({
      type: 'EXTREME_HEAT',
      title: 'Extreme Heat Warning',
      severity: 'HIGH',
      message: `Extreme heat (${current.temperature}°C) detected. Ensure extra crop irrigation.`,
    });
  }
  if (current.windSpeed && current.windSpeed >= 25) {
    alerts.push({
      type: 'STRONG_WIND',
      title: 'Strong Wind Warning',
      severity: 'MEDIUM',
      message: `High wind speed of ${current.windSpeed} km/h detected. Avoid pesticide spraying.`,
    });
  }

  return alerts;
};
