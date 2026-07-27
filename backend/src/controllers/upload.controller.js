import { uploadToCloudinary, deleteFromCloudinary } from '../services/cloudinary.service.js';
import DiseaseReport from '../models/DiseaseReport.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Controller to handle leaf image upload to Cloudinary
 * POST /api/upload/image & /api/v1/upload
 */
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ApiError(400, 'Image file missing from form-data (field name: image)');
    }

    if (!req.file.buffer || req.file.buffer.length === 0) {
      throw new ApiError(400, 'Uploaded image buffer is empty or corrupted');
    }

    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      'KrishiMitraAI/leaf-images'
    );

    return res
      .status(201)
      .json(new ApiResponse(201, 'Image uploaded successfully', uploadResult));
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to handle image deletion from Cloudinary & MongoDB
 * DELETE /api/upload/:publicId* & /api/v1/upload/:publicId*
 */
export const deleteImage = async (req, res, next) => {
  try {
    let publicId = req.params.publicId || req.params[0] || req.query.publicId;

    if (!publicId) {
      throw new ApiError(400, 'Public ID parameter is required for image deletion');
    }

    // Decode publicId if URL encoded (e.g. KrishiMitraAI%2Fleaf-images%2Fsample_leaf)
    publicId = decodeURIComponent(publicId);

    const isSuperAdmin = req.user?.role === 'SUPER_ADMIN';
    const userId = req.user?._id || req.user?.id;

    // Verify ownership of the report associated with this Cloudinary image
    const matchingReport = await DiseaseReport.findOne({
      $or: [
        { publicId: publicId },
        { imageUrl: { $regex: publicId, $options: 'i' } },
      ],
    });

    if (matchingReport && !isSuperAdmin) {
      if (matchingReport.farmerId && matchingReport.farmerId.toString() !== userId?.toString()) {
        throw new ApiError(403, 'Forbidden: You can only delete your own uploaded images');
      }
    }

    try {
      await deleteFromCloudinary(publicId);
    } catch (err) {
      console.warn('Cloudinary image delete error:', err.message);
    }

    // Purge matching DiseaseReport entries from MongoDB for this user (or all if SUPER_ADMIN)
    const deleteQuery = isSuperAdmin
      ? {
          $or: [
            { publicId: publicId },
            { imageUrl: { $regex: publicId, $options: 'i' } },
          ],
        }
      : {
          farmerId: userId,
          $or: [
            { publicId: publicId },
            { imageUrl: { $regex: publicId, $options: 'i' } },
          ],
        };

    await DiseaseReport.deleteMany(deleteQuery);

    return res
      .status(200)
      .json(new ApiResponse(200, 'Image and associated disease report deleted successfully', null));
  } catch (error) {
    next(error);
  }
};

