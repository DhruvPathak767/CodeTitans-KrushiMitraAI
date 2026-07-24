import farmRepository from '../../repositories/farm/farm.repository.js';
import { USER_ROLES } from '../../models/User.js';

class FarmService {
  /**
   * Create Farm Flow
   */
  async createFarm(userId, farmData) {
    const { latitude = 22.3039, longitude = 70.8022, address = {}, ...rest } = farmData;

    const formattedLocation = {
      type: 'Point',
      coordinates: [Number(longitude), Number(latitude)],
    };

    const formattedAddress = {
      formattedAddress: address.formattedAddress || `${address.village || ''}, ${address.district || ''}, ${address.state || ''}`.replace(/^, |, $/g, ''),
      country: address.country || 'India',
      state: address.state || '',
      district: address.district || '',
      taluka: address.taluka || '',
      village: address.village || '',
      pincode: address.pincode || '',
      latitude: Number(latitude),
      longitude: Number(longitude),
    };

    const newFarm = await farmRepository.createFarm({
      ...rest,
      userId,
      location: formattedLocation,
      address: formattedAddress,
    });

    // Automatically set this farm as activeFarm in User collection
    await farmRepository.setUserActiveFarm(userId, newFarm._id);

    return newFarm;
  }

  /**
   * Check Farm Status (First time onboarding guard)
   */
  async checkFarmStatus(userId) {
    return await farmRepository.checkUserFarmStatus(userId);
  }

  /**
   * Get All Farms with Search, Filter, Sort, Pagination
   */
  async getFarms(user, queryParams) {
    const isSuperAdmin = user.role === USER_ROLES.SUPER_ADMIN;
    return await farmRepository.findFarms({
      userId: user._id,
      isSuperAdmin,
      ...queryParams,
    });
  }

  /**
   * Get Single Farm by ID
   */
  async getFarmById(id, user) {
    const farm = await farmRepository.findFarmById(id);
    if (!farm) {
      const error = new Error('Farm not found');
      error.statusCode = 404;
      throw error;
    }

    // Owner or Super Admin access check
    if (user.role !== USER_ROLES.SUPER_ADMIN && farm.userId._id.toString() !== user._id.toString()) {
      const error = new Error('Forbidden. You do not have permission to view this farm.');
      error.statusCode = 403;
      throw error;
    }

    return farm;
  }

  /**
   * Update Farm
   */
  async updateFarm(id, user, updateData) {
    const farm = await farmRepository.findFarmById(id);
    if (!farm) {
      const error = new Error('Farm not found');
      error.statusCode = 404;
      throw error;
    }

    // Only owner can update farm
    if (farm.userId._id.toString() !== user._id.toString()) {
      const error = new Error('Forbidden. Only the farm owner can update farm details.');
      error.statusCode = 403;
      throw error;
    }

    const { latitude, longitude, address, ...rest } = updateData;

    const updatePayload = { ...rest };

    if (latitude !== undefined && longitude !== undefined) {
      updatePayload.location = {
        type: 'Point',
        coordinates: [Number(longitude), Number(latitude)],
      };
    }

    if (address || latitude !== undefined || longitude !== undefined) {
      const currentAddress = farm.address || {};
      const newLat = latitude !== undefined ? Number(latitude) : currentAddress.latitude;
      const newLng = longitude !== undefined ? Number(longitude) : currentAddress.longitude;

      updatePayload.address = {
        formattedAddress: address?.formattedAddress || currentAddress.formattedAddress || '',
        country: address?.country || currentAddress.country || 'India',
        state: address?.state || currentAddress.state || '',
        district: address?.district || currentAddress.district || '',
        taluka: address?.taluka || currentAddress.taluka || '',
        village: address?.village || currentAddress.village || '',
        pincode: address?.pincode || currentAddress.pincode || '',
        latitude: newLat,
        longitude: newLng,
      };
    }

    return await farmRepository.updateFarm(id, updatePayload);
  }

  /**
   * Delete Farm
   */
  async deleteFarm(id, user) {
    const farm = await farmRepository.findFarmById(id);
    if (!farm) {
      const error = new Error('Farm not found');
      error.statusCode = 404;
      throw error;
    }

    // Only owner can delete farm
    if (farm.userId._id.toString() !== user._id.toString()) {
      const error = new Error('Forbidden. Only the farm owner can delete this farm.');
      error.statusCode = 403;
      throw error;
    }

    await farmRepository.deleteFarm(id);

    // Check remaining farms and update activeFarm
    const remainingCount = await farmRepository.countUserFarms(user._id);
    if (remainingCount > 0) {
      const nextFarm = await farmRepository.findFirstUserFarm(user._id);
      await farmRepository.setUserActiveFarm(user._id, nextFarm._id);
    } else {
      await farmRepository.setUserActiveFarm(user._id, null);
    }

    return {
      message: 'Farm deleted successfully',
      remainingCount,
    };
  }

  /**
   * Select Active Farm
   */
  async selectActiveFarm(id, user) {
    const farm = await farmRepository.findFarmById(id);
    if (!farm) {
      const error = new Error('Farm not found');
      error.statusCode = 404;
      throw error;
    }

    // Ownership check
    if (farm.userId._id.toString() !== user._id.toString()) {
      const error = new Error('Forbidden. You can only set your own farm as active.');
      error.statusCode = 403;
      throw error;
    }

    const updatedUser = await farmRepository.setUserActiveFarm(user._id, farm._id);
    return {
      message: `Farm '${farm.farmName}' set as active farm`,
      activeFarm: farm,
    };
  }
}

export default new FarmService();
