import {
  predictDiseaseService,
  getDiseaseHistoryService,
  getDiseaseReportByIdService,
  deleteDiseaseReportService,
  clearAllDiseaseHistoryService,
} from '../services/disease.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Controller to handle leaf disease prediction via TensorFlow CNN
 * POST /api/disease/predict
 */
export const predictDisease = async (req, res, next) => {
  try {
    const { imageUrl, publicId, crop, farmId } = req.body;

    if (!imageUrl) {
      throw new ApiError(400, 'imageUrl is required in request body');
    }

    const farmerId = req.user?._id || req.user?.id || null;

    const predictionData = await predictDiseaseService({
      imageUrl,
      publicId,
      crop: crop || 'Tomato',
      farmId: farmId || 'default_farm',
      farmerId,
    });

    const responsePayload = {
      prediction: {
        disease: predictionData.disease,
        confidence: predictionData.confidence,
        severity: predictionData.severity,
        treatment: predictionData.treatment,
        fungicide: predictionData.fungicide,
        organicAlternative: predictionData.organicAlternative,
        prevention: predictionData.prevention,
        predictionTime: predictionData.predictionTime,
        reportId: predictionData.reportId,
        imageUrl: predictionData.imageUrl,
        publicId: predictionData.publicId,
        crop: predictionData.crop,
        createdAt: predictionData.createdAt,
      },
    };

    return res
      .status(200)
      .json(new ApiResponse(200, 'Disease detected successfully', responsePayload));
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to fetch disease prediction history for logged in user/farmer
 * GET /api/disease/history
 */
export const getDiseaseHistory = async (req, res, next) => {
  try {
    const farmerId = req.user?._id || req.user?.id || null;
    const limit = parseInt(req.query.limit, 10) || 20;

    const reports = await getDiseaseHistoryService(farmerId, limit);

    return res
      .status(200)
      .json(new ApiResponse(200, 'Disease history fetched successfully', reports));
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to fetch single disease report by ID
 * GET /api/disease/:id
 */
export const getDiseaseReportById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const report = await getDiseaseReportByIdService(id);

    return res
      .status(200)
      .json(new ApiResponse(200, 'Disease report fetched successfully', report));
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to delete single disease report by ID or Public ID
 * DELETE /api/disease/:id
 */
export const deleteDiseaseReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const farmerId = req.user?._id || req.user?.id || null;
    const result = await deleteDiseaseReportService(id, farmerId);

    return res
      .status(200)
      .json(new ApiResponse(200, 'Disease report deleted successfully', result));
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to clear all disease reports for user
 * DELETE /api/disease/history/all
 */
export const clearAllDiseaseHistory = async (req, res, next) => {
  try {
    const farmerId = req.user?._id || req.user?.id || null;
    const result = await clearAllDiseaseHistoryService(farmerId);

    return res
      .status(200)
      .json(new ApiResponse(200, 'All disease history cleared successfully', result));
  } catch (error) {
    next(error);
  }
};
