import farmService from '../../services/farm/farm.service.js';

class FarmController {
  createFarm = async (req, res, next) => {
    try {
      const farm = await farmService.createFarm(req.user._id, req.body);
      res.status(201).json({
        success: true,
        message: 'Farm created successfully',
        data: { farm },
      });
    } catch (error) {
      next(error);
    }
  };

  checkFarmStatus = async (req, res, next) => {
    try {
      const result = await farmService.checkFarmStatus(req.user._id);
      res.status(200).json({
        success: true,
        message: 'Farm status checked',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getFarms = async (req, res, next) => {
    try {
      const result = await farmService.getFarms(req.user, req.query);
      res.status(200).json({
        success: true,
        message: 'Farms retrieved successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getFarmById = async (req, res, next) => {
    try {
      const farm = await farmService.getFarmById(req.params.id, req.user);
      res.status(200).json({
        success: true,
        message: 'Farm retrieved successfully',
        data: { farm },
      });
    } catch (error) {
      next(error);
    }
  };

  updateFarm = async (req, res, next) => {
    try {
      const farm = await farmService.updateFarm(req.params.id, req.user, req.body);
      res.status(200).json({
        success: true,
        message: 'Farm updated successfully',
        data: { farm },
      });
    } catch (error) {
      next(error);
    }
  };

  deleteFarm = async (req, res, next) => {
    try {
      const result = await farmService.deleteFarm(req.params.id, req.user);
      res.status(200).json({
        success: true,
        message: result.message,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  selectActiveFarm = async (req, res, next) => {
    try {
      const result = await farmService.selectActiveFarm(req.params.id, req.user);
      res.status(200).json({
        success: true,
        message: result.message,
        data: { activeFarm: result.activeFarm },
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new FarmController();
