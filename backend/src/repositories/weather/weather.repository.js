import WeatherCache from '../../models/WeatherCache.js';

class WeatherRepository {
  async findValidCacheByFarmId(farmId) {
    return await WeatherCache.findOne({
      farmId,
      expiresAt: { $gt: new Date() },
    });
  }

  async saveOrUpdateCache(farmId, latitude, longitude, payload = {}, ttlMinutes = 30) {
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);

    return await WeatherCache.findOneAndUpdate(
      { farmId },
      {
        farmId,
        latitude,
        longitude,
        location: payload.location,
        current: payload.current,
        hourly: payload.hourly || [],
        daily: payload.daily || [],
        airQuality: payload.airQuality || {},
        agriculture: payload.agriculture || {},
        alerts: payload.alerts || [],
        lastUpdated: new Date(),
        expiresAt,
      },
      { upsert: true, returnDocument: 'after' }
    );
  }
}

export default new WeatherRepository();
