import { Router } from 'express';
import { uploadImage, deleteImage } from '../controllers/upload.controller.js';
import { uploadSingleImage } from '../middleware/upload.middleware.js';

const router = Router();

/**
 * Upload Image Routes
 * POST /api/upload/image
 * POST /api/v1/upload
 */
router.post('/image', uploadSingleImage('image'), uploadImage);
router.post('/', uploadSingleImage('image'), uploadImage);

/**
 * Delete Image Routes (Express 5 path-to-regexp v8 compatible)
 * DELETE /api/upload/:publicId
 * DELETE /api/v1/upload/:publicId
 */
router.delete('/:publicId', deleteImage);
router.delete('/*publicId', deleteImage);
router.delete('/', deleteImage);

export default router;
