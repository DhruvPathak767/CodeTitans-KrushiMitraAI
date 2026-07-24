import weatherService from '../../services/weather/weather.service.js';

class WeatherController {
  getWeather = async (req, res, next) => {
    try {
      const data = await weatherService.getWeatherForActiveFarm(req.user);
      res.status(200).json({
        success: true,
        message: 'Live OpenWeather data fetched successfully',
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
      const data = await weatherService.getWeatherForActiveFarm(req.user);
      res.status(200).json({
        success: true,
        message: 'Live OpenWeather forecast fetched successfully',
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
      const data = await weatherService.getDebugWeatherData(req.user);
      res.status(200).json({
        success: true,
        message: 'OpenWeather Debug Pipeline Audit Output',
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new WeatherController();
