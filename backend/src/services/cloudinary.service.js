import cloudinary from '../config/cloudinary.js';
import { ApiError } from '../utils/ApiError.js';
import logger from '../config/logger.js';

/**
 * Service method to upload image file buffer directly to Cloudinary
 * @param {Buffer} fileBuffer - Image buffer from Multer memory storage
 * @param {string} folder - Target folder inside Cloudinary
 * @returns {Promise<Object>} Formatted image upload result
 */
export const uploadToCloudinary = async (fileBuffer, folder = 'KrishiMitraAI/leaf-images') => {
  return new Promise((resolve, reject) => {
    if (!fileBuffer || fileBuffer.length === 0) {
      return reject(new ApiError(400, 'Image buffer is empty or invalid'));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          logger.error(`Cloudinary Upload Stream Error: ${error.message}`);
          return reject(
            new ApiError(500, `Failed to upload image to Cloudinary: ${error.message}`)
          );
        }

        resolve({
          publicId: result.public_id,
          imageUrl: result.secure_url,
          format: result.format,
          width: result.width,
          height: result.height,
          bytes: result.bytes,
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Service method to delete image from Cloudinary by public ID
 * @param {string} publicId - Cloudinary public ID of the resource
 * @returns {Promise<Object>} Deletion result confirmation
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) {
      throw new ApiError(400, 'Public ID is required to delete image from Cloudinary');
    }

    const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });

    if (result.result !== 'ok' && result.result !== 'not found') {
      logger.warn(`Cloudinary Deletion Status for ${publicId}: ${result.result}`);
    }

    return result;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    logger.error(`Cloudinary Delete Error for ${publicId}: ${error.message}`);
    throw new ApiError(500, `Cloudinary deletion failed: ${error.message}`);
  }
};
