import { body, param, query } from 'express-validator';
import { AREA_UNITS, FARM_STATUS } from '../models/Farm.js';

export const createFarmRules = [
  body('farmName')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Farm name must be between 3 and 100 characters'),
  body('cropName').trim().notEmpty().withMessage('Crop name is required'),
  body('area').isFloat({ gt: 0 }).withMessage('Area must be a number greater than zero'),
  body('areaUnit')
    .optional()
    .isIn(Object.values(AREA_UNITS))
    .withMessage(`Area unit must be one of: ${Object.values(AREA_UNITS).join(', ')}`),
  body('sowingDate')
    .isISO8601()
    .withMessage('Please provide a valid sowing date')
    .custom((value) => {
      if (new Date(value) > new Date()) {
        throw new Error('Sowing date cannot be in the future');
      }
      return true;
    }),
  body('soilType').optional().trim().isString(),
  body('irrigationType').optional().trim().isString(),
  body('latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  body('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  body('status')
    .optional()
    .isIn(Object.values(FARM_STATUS))
    .withMessage(`Status must be one of: ${Object.values(FARM_STATUS).join(', ')}`),
];

export const updateFarmRules = [
  param('id').isMongoId().withMessage('Invalid Farm ID'),
  body('farmName')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Farm name must be between 3 and 100 characters'),
  body('cropName').optional().trim().notEmpty().withMessage('Crop name cannot be empty'),
  body('area').optional().isFloat({ gt: 0 }).withMessage('Area must be a number greater than zero'),
  body('areaUnit')
    .optional()
    .isIn(Object.values(AREA_UNITS))
    .withMessage(`Area unit must be one of: ${Object.values(AREA_UNITS).join(', ')}`),
  body('sowingDate')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid sowing date')
    .custom((value) => {
      if (new Date(value) > new Date()) {
        throw new Error('Sowing date cannot be in the future');
      }
      return true;
    }),
  body('latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  body('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  body('status')
    .optional()
    .isIn(Object.values(FARM_STATUS))
    .withMessage(`Status must be one of: ${Object.values(FARM_STATUS).join(', ')}`),
];

export const farmIdRule = [param('id').isMongoId().withMessage('Invalid Farm ID')];

export const farmQueryRules = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().trim(),
  query('crop').optional().trim(),
  query('state').optional().trim(),
  query('district').optional().trim(),
  query('status').optional().isIn(Object.values(FARM_STATUS)),
  query('sort').optional().isIn(['newest', 'oldest', 'farmName', 'cropName', 'area']),
];
