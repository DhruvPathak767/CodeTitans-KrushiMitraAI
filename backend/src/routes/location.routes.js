import express from 'express';
import locationController from '../controllers/location/location.controller.js';

const router = express.Router();

// POST /api/location/reverse - Reverse Geocode Lat/Lng
router.post('/reverse', locationController.reverseGeocode);

// GET /api/location/search?q= - Search locations in India
router.get('/search', locationController.search);

export default router;
