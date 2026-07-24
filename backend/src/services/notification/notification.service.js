import Notification from '../../models/Notification.js';
import Farm from '../../models/Farm.js';
import weatherService from '../weather/weather.service.js';
import advisoryService from '../advisory/advisory.service.js';
import logger from '../../config/logger.js';

class NotificationService {
  /**
   * Evaluate live telemetry and seed real notifications automatically
   */
  async generateTelemetryNotifications(user, lang = 'en') {
    let farm = null;
    if (user.activeFarm) {
      farm = await Farm.findById(user.activeFarm).lean();
    }
    if (!farm) {
      farm = await Farm.findOne({ userId: user._id, status: 'ACTIVE' }).lean();
    }

    if (!farm) return;

    try {
      const weather = await weatherService.getWeatherForActiveFarm(user, lang);
      const current = weather?.current || {};
      const agriculture = weather?.agriculture || {};

      // 1. Check Rain Probability Alert
      if (current.rainProbability >= 70) {
        await this.createIfNotExists({
          userId: user._id,
          farmId: farm._id,
          type: 'rain',
          priority: 'high',
          language: lang,
          title: lang === 'hi' ? 'उच्च बारिश की चेतावनी' : lang === 'gu' ? 'વરસાદની ઉચ્ચ આગાહી' : 'Heavy Rain Probability Alert',
          message: lang === 'hi'
            ? `${farm.farmName} के लिए ${current.rainProbability}% बारिश की संभावना। कीटनाशक छिड़काव टालें।`
            : lang === 'gu'
            ? `${farm.farmName} માટે ${current.rainProbability}% વરસાદની સંભાવના. છંટકાવ ટાળો.`
            : `Rain probability is ${current.rainProbability}% for ${farm.farmName}. Postpone chemical spraying.`,
        });
      }

      // 2. Check Fungal Disease Risk Alert
      if (agriculture.diseaseRisk?.includes('High') || current.humidity >= 85) {
        await this.createIfNotExists({
          userId: user._id,
          farmId: farm._id,
          type: 'disease',
          priority: 'critical',
          language: lang,
          title: lang === 'hi' ? 'उच्च फफूंद रोग जोखिम' : lang === 'gu' ? 'ઉચ્ચ ફૂગ રોગ જોખમ' : 'High Fungal Disease Risk',
          message: lang === 'hi'
            ? `नमी ${current.humidity}% होने से फफूंद बीजाणु बढ़ने की संभावना। निचले पत्तों का निरीक्षण करें।`
            : lang === 'gu'
            ? `ભેજ ${current.humidity}% હોવાથી ફૂગ રોગનું જોખમ. પાંદડા ચકાસો.`
            : `Relative humidity at ${current.humidity}%. Inspect lower leaves for early blight spots.`,
        });
      }

      // 3. Heat Stress Alert
      if (current.temperature >= 38) {
        await this.createIfNotExists({
          userId: user._id,
          farmId: farm._id,
          type: 'heat',
          priority: 'high',
          language: lang,
          title: lang === 'hi' ? 'अत्यधिक तापीय तनाव' : lang === 'gu' ? 'અતિશય તાપમાન તણાવ' : 'Extreme Thermal Heat Alert',
          message: lang === 'hi'
            ? `तापमान ${current.temperature}°C पर पहुंचा। वाष्पीकरण रोकने के लिए शाम को सिंचाई दें।`
            : lang === 'gu'
            ? `તાપમાન ${current.temperature}°C પર પહોંચ્યું. સાંજે પિયત આપો.`
            : `Ambient temperature reached ${current.temperature}°C. Schedule evening irrigation.`,
        });
      }

      // 4. Irrigation Advisory Notification
      const advisoryData = await advisoryService.getLatestAdvisory(user, false, lang);
      const adv = advisoryData?.advisory;

      if (adv?.nextAction) {
        await this.createIfNotExists({
          userId: user._id,
          farmId: farm._id,
          type: 'ai',
          priority: 'medium',
          language: lang,
          title: lang === 'hi' ? 'AI फसल सलाह अपडेट' : lang === 'gu' ? 'AI પાક સલાહ અપડેટ' : 'AI Agronomist Action Item',
          message: adv.nextAction,
        });
      }
    } catch (e) {
      logger.warn(`Telemetry Notification Generation Warning: ${e.message}`);
    }
  }

  /**
   * Create notification if duplicate has not been created within last 6 hours
   */
  async createIfNotExists(payload) {
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
    const existing = await Notification.findOne({
      userId: payload.userId,
      type: payload.type,
      createdAt: { $gte: sixHoursAgo },
    });

    if (!existing) {
      return await Notification.create(payload);
    }
    return existing;
  }

  /**
   * Get user notifications
   */
  async getUserNotifications(user, lang = 'en') {
    // Generate fresh alerts based on live telemetry first
    await this.generateTelemetryNotifications(user, lang);

    const notifications = await Notification.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    const unreadCount = await Notification.countDocuments({ userId: user._id, read: false });

    return { notifications, unreadCount };
  }

  /**
   * Mark single notification as read
   */
  async markAsRead(userId, notificationId) {
    await Notification.updateOne({ _id: notificationId, userId }, { $set: { read: true } });
    return true;
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId) {
    await Notification.updateMany({ userId, read: false }, { $set: { read: true } });
    return true;
  }

  /**
   * Delete notification or clear all
   */
  async deleteNotification(userId, notificationId = null) {
    if (notificationId) {
      await Notification.deleteOne({ _id: notificationId, userId });
    } else {
      await Notification.deleteMany({ userId });
    }
    return true;
  }
}

export default new NotificationService();
