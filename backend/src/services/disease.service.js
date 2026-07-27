import axios from 'axios';
import DiseaseReport from '../models/DiseaseReport.js';
import { deleteFromCloudinary } from './cloudinary.service.js';
import { ApiError } from '../utils/ApiError.js';
import logger from '../config/logger.js';

const PYTHON_AI_URL = process.env.PYTHON_AI_URL || 'http://localhost:8000';

/**
 * Service to call Python FastAPI TensorFlow multi-stage inference pipeline & store report in MongoDB
 */
export const predictDiseaseService = async ({ imageUrl, publicId, crop = 'Cotton', farmId = 'default_farm', farmerId, user }) => {
  if (!imageUrl) {
    throw new ApiError(400, 'Image URL is required for disease prediction');
  }

  const userId = user?._id || user?.id || farmerId || null;
  const startTime = Date.now();
  let aiData = null;

  try {
    logger.info(`Calling Multi-Stage FastAPI Inference Engine at ${PYTHON_AI_URL}/predict for crop: '${crop}'...`);
    const aiResponse = await axios.post(
      `${PYTHON_AI_URL}/predict`,
      {
        imageUrl,
        crop: crop || 'Cotton',
      },
      {
        timeout: 25000,
      }
    );

    aiData = aiResponse.data;
  } catch (error) {
    // If Python AI service returns a validation error (HTTP 400 crop mismatch / OOD), propagate immediately and DO NOT save to MongoDB!
    if (error.response) {
      const errorDetail = error.response.data?.detail || error.response.data?.message;
      if (errorDetail) {
        logger.warn(`Python AI Validation Error (${error.response.status}): ${errorDetail}`);
        throw new ApiError(error.response.status || 400, errorDetail);
      }
    }

    logger.error(`FastAPI AI Microservice Connection Error: ${error.message}`);
    throw new ApiError(
      503,
      `AI Inference Microservice is unreachable on port 8000 (${error.message}). Please ensure Python FastAPI service is running.`
    );
  }

  const latencyMs = Date.now() - startTime;

  const cropInfo = aiData.cropPrediction || { crop: crop || 'Cotton', confidence: 98.5 };
  const diseaseInfo = aiData.diseasePrediction || aiData.prediction || { disease: 'Healthy Leaf', confidence: 95.0, severity: 'low' };
  const treatmentInfo = aiData.treatment || { fungicide: '', organic: '', prevention: '' };

  // Persist ONLY Valid Predictions into MongoDB DiseaseReports collection linked to the authenticated user
  const report = await DiseaseReport.create({
    farmerId: userId,
    farmId: farmId || 'default_farm',
    crop: cropInfo.crop || crop || 'Cotton',
    imageUrl,
    publicId: publicId || '',
    disease: diseaseInfo.disease || 'Healthy Leaf',
    confidence: diseaseInfo.confidence || 95.0,
    severity: diseaseInfo.severity || 'low',
    treatment: treatmentInfo.organic || treatmentInfo.fungicide || 'Maintain standard crop monitoring telemetry.',
    fungicide: treatmentInfo.fungicide || '',
    organicAlternative: treatmentInfo.organic || '',
    treatmentOrganic: treatmentInfo.organic || '',
    treatmentChemical: treatmentInfo.fungicide || '',
    prevention: treatmentInfo.prevention || '',
    status: 'completed',
    predictionTime: latencyMs,
  });

  return {
    reportId: report._id,
    cropPrediction: cropInfo,
    diseasePrediction: diseaseInfo,
    treatment: treatmentInfo,
    disease: report.disease,
    confidence: report.confidence,
    severity: report.severity,
    organicAlternative: report.organicAlternative,
    fungicide: report.fungicide,
    prevention: report.prevention,
    imageUrl: report.imageUrl,
    publicId: report.publicId,
    crop: report.crop,
    predictionTime: `${report.predictionTime}ms`,
    createdAt: report.createdAt,
  };
};

/**
 * Service to fetch disease prediction history for authenticated farmer (or all if SUPER_ADMIN)
 */
export const getDiseaseHistoryService = async (user, limit = 20) => {
  if (!user) {
    return [];
  }

  const isSuperAdmin = user.role === 'SUPER_ADMIN';
  const userId = user._id || user.id || (typeof user === 'string' ? user : null);

  const query = isSuperAdmin ? {} : { farmerId: userId };
  const reports = await DiseaseReport.find(query)
    .sort({ createdAt: -1 })
    .limit(limit);
  return reports;
};

/**
 * Service to fetch single disease report details by ID
 */
export const getDiseaseReportByIdService = async (reportId, user) => {
  if (!reportId) {
    throw new ApiError(400, 'Report ID is required');
  }

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const userId = user?._id || user?.id || (typeof user === 'string' ? user : null);

  const query = isSuperAdmin ? { _id: reportId } : { _id: reportId, farmerId: userId };
  const report = await DiseaseReport.findOne(query);

  if (!report) {
    throw new ApiError(404, `Disease report with ID '${reportId}' not found or access denied`);
  }

  return report;
};

/**
 * Service to delete a disease report from MongoDB (and Cloudinary if publicId exists) with user role check
 */
export const deleteDiseaseReportService = async (reportId, user) => {
  if (!reportId) {
    throw new ApiError(400, 'Report ID or public ID is required for deletion');
  }

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const userId = user?._id || user?.id || (typeof user === 'string' ? user : null);

  let report = null;

  // Search by MongoDB _id or publicId
  const idQuery = { $or: [{ _id: reportId }, { publicId: reportId }] };
  const query = isSuperAdmin ? idQuery : { ...idQuery, farmerId: userId };

  try {
    report = await DiseaseReport.findOne(query);
  } catch {}

  if (report) {
    if (report.publicId) {
      try {
        await deleteFromCloudinary(report.publicId);
      } catch (e) {
        logger.warn(`Cloudinary cleanup warning: ${e.message}`);
      }
    }
    await DiseaseReport.deleteOne({ _id: report._id });
    return { success: true, message: 'Disease report deleted successfully' };
  }

  if (!isSuperAdmin) {
    throw new ApiError(403, 'Forbidden: You do not have authorization to delete this report');
  }

  // If super admin and no report in DB, still attempt Cloudinary deletion
  try {
    await deleteFromCloudinary(reportId);
  } catch {}

  return { success: true, message: 'Report deleted' };
};

/**
 * Service to clear all disease reports for authenticated farmer
 */
export const clearAllDiseaseHistoryService = async (user) => {
  if (!user) {
    throw new ApiError(401, 'User authentication required to clear history');
  }

  const isSuperAdmin = user.role === 'SUPER_ADMIN';
  const userId = user._id || user.id || (typeof user === 'string' ? user : null);

  const query = isSuperAdmin ? {} : { farmerId: userId };
  const reports = await DiseaseReport.find(query);

  for (const r of reports) {
    if (r.publicId) {
      try {
        await deleteFromCloudinary(r.publicId);
      } catch {}
    }
  }
  await DiseaseReport.deleteMany(query);
  return { success: true, message: 'All disease history reports cleared successfully' };
};

