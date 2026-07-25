import farmRepository from '../../repositories/farm/farm.repository.js';
import { USER_ROLES } from '../../models/User.js';

function cleanAdminName(name, districtName) {
  if (!name) return '';
  let cleaned = name.replace(/\s*(taluka|tehsil|subdistrict|block)\b/gi, '').trim();
  if (districtName) {
    const stripped = cleaned.replace(/\s*(rural|city)\b/gi, '').trim();
    if (stripped.toLowerCase() === districtName.toLowerCase()) {
      return districtName;
    }
  }
  return cleaned;
}

function dedupeAddressParts(parts) {
  const seen = new Set();
  const result = [];
  for (const p of parts) {
    if (!p || typeof p !== 'string') continue;
    const trimmed = p.trim();
    if (!trimmed) continue;
    const lower = trimmed.toLowerCase();
    if (!seen.has(lower)) {
      seen.add(lower);
      result.push(trimmed);
    }
  }
  return result;
}

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

    const district = address.district || '';
    const taluka = cleanAdminName(address.taluka || '', district);
    const village = address.village || '';
    const state = address.state || '';
    const pincode = address.pincode || '';
    const country = address.country || 'India';

    const cleanParts = dedupeAddressParts([village, taluka, district, state, pincode, country]);
    const computedFormattedAddress = cleanParts.join(', ');

    const formattedAddress = {
      formattedAddress:
        address.formattedAddress && !address.formattedAddress.includes('Taluka')
          ? address.formattedAddress
          : computedFormattedAddress,
      country,
      state,
      district,
      taluka,
      village,
      pincode,
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

      const district = address?.district !== undefined ? address.district : currentAddress.district || '';
      const rawTaluka = address?.taluka !== undefined ? address.taluka : currentAddress.taluka || '';
      const taluka = cleanAdminName(rawTaluka, district);
      const village = address?.village !== undefined ? address.village : currentAddress.village || '';
      const state = address?.state !== undefined ? address.state : currentAddress.state || '';
      const pincode = address?.pincode !== undefined ? address.pincode : currentAddress.pincode || '';
      const country = address?.country || currentAddress.country || 'India';

      const cleanParts = dedupeAddressParts([village, taluka, district, state, pincode, country]);
      const computedFormattedAddress = cleanParts.join(', ');

      updatePayload.address = {
        formattedAddress:
          address?.formattedAddress && !address.formattedAddress.includes('Taluka')
            ? address.formattedAddress
            : computedFormattedAddress,
        country,
        state,
        district,
        taluka,
        village,
        pincode,
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
