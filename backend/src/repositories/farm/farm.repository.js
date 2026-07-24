import Farm from '../../models/Farm.js';
import User from '../../models/User.js';

class FarmRepository {
  async createFarm(farmData) {
    const farm = new Farm(farmData);
    return await farm.save();
  }

  async findFarmById(id) {
    return await Farm.findById(id).populate('userId', 'name email phone role');
  }

  async findFarms({
    userId,
    isSuperAdmin = false,
    search = '',
    crop,
    state,
    district,
    status,
    sort = 'newest',
    page = 1,
    limit = 10,
  }) {
    const query = {};

    // SUPER_ADMIN can view all farms; Farmers view their own farms only
    if (!isSuperAdmin) {
      query.userId = userId;
    }

    // Search rule: Farm Name, Crop, Village, District, State
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { farmName: searchRegex },
        { cropName: searchRegex },
        { 'address.village': searchRegex },
        { 'address.district': searchRegex },
        { 'address.state': searchRegex },
      ];
    }

    // Filters: Crop, State, District, Status
    if (crop) {
      query.cropName = new RegExp(crop, 'i');
    }
    if (state) {
      query['address.state'] = new RegExp(state, 'i');
    }
    if (district) {
      query['address.district'] = new RegExp(district, 'i');
    }
    if (status) {
      query.status = status;
    }

    // Sorting rule: Newest, Oldest, Farm Name, Crop, Area
    let sortOptions = { createdAt: -1 };
    switch (sort) {
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'farmName':
        sortOptions = { farmName: 1 };
        break;
      case 'cropName':
        sortOptions = { cropName: 1 };
        break;
      case 'area':
        sortOptions = { area: -1 };
        break;
      case 'newest':
      default:
        sortOptions = { createdAt: -1 };
        break;
    }

    const skip = (page - 1) * limit;

    const [farms, total] = await Promise.all([
      Farm.find(query).sort(sortOptions).skip(skip).limit(limit).exec(),
      Farm.countDocuments(query),
    ]);

    return {
      farms,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async updateFarm(id, updateData) {
    return await Farm.findByIdAndUpdate(id, updateData, { returnDocument: 'after' });
  }

  async deleteFarm(id) {
    return await Farm.findByIdAndDelete(id);
  }

  async setUserActiveFarm(userId, farmId) {
    return await User.findByIdAndUpdate(userId, { activeFarm: farmId }, { returnDocument: 'after' });
  }

  async countUserFarms(userId) {
    return await Farm.countDocuments({ userId });
  }

  async findFirstUserFarm(userId) {
    const query = userId ? { userId } : {};
    return await Farm.findOne(query).sort({ createdAt: -1 });
  }

  async checkUserFarmStatus(userId) {
    const user = await User.findById(userId).select('activeFarm');
    const farmCount = await Farm.countDocuments({ userId });
    const hasFarm = farmCount > 0;

    let activeFarm = null;
    if (hasFarm) {
      if (user?.activeFarm) {
        activeFarm = await Farm.findOne({ _id: user.activeFarm, userId });
      }
      if (!activeFarm) {
        activeFarm = await Farm.findOne({ userId }).sort({ createdAt: -1 });
        if (activeFarm) {
          await this.setUserActiveFarm(userId, activeFarm._id);
        }
      }
    }

    return {
      hasFarm,
      farmCount,
      activeFarm,
    };
  }
}

export default new FarmRepository();
