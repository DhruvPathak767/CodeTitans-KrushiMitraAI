import multer from 'multer';
import path from 'path';
import { ApiError } from '../utils/ApiError.js';

// Multer memory storage configuration (buffers file in RAM for stream upload)
const storage = multer.memoryStorage();

// Allowed file extensions and MIME types
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

/**
 * Multer file filter function for leaf image validation
 */
const fileFilter = (req, file, cb) => {
  if (!file) {
    return cb(new ApiError(400, 'No file provided in request field'), false);
  }

  const ext = path.extname(file.originalname).toLowerCase();
  const mimeType = file.mimetype.toLowerCase();

  // Validate Extension
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return cb(
      new ApiError(
        400,
        `Invalid file extension '${ext}'. Allowed formats: JPG, JPEG, PNG, WEBP. (GIF, SVG, PDF, TXT, EXE, ZIP are strictly rejected)`
      ),
      false
    );
  }

  // Validate MIME Type
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    return cb(
      new ApiError(
        400,
        `Invalid image MIME type '${file.mimetype}'. Allowed types: image/jpeg, image/png, image/webp`
      ),
      false
    );
  }

  cb(null, true);
};

const multerUpload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB maximum limit
  },
  fileFilter,
});

/**
 * Reusable Express middleware for single image upload with error handling
 * @param {string} fieldName - Form data field name (e.g. 'image')
 */
export const uploadSingleImage = (fieldName = 'image') => {
  return (req, res, next) => {
    const upload = multerUpload.single(fieldName);

    upload(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return next(new ApiError(400, 'File size exceeds maximum allowed limit of 5 MB'));
          }
          return next(new ApiError(400, `File upload error: ${err.message}`));
        }
        return next(err);
      }

      if (!req.file) {
        return next(new ApiError(400, `Image file is required under field '${fieldName}'`));
      }

      next();
    });
  };
};

export default uploadSingleImage;
