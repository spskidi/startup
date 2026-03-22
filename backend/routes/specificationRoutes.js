const express = require('express');
const specificationController = require('../controllers/specificationController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/all', specificationController.getAllTemplates);
router.get('/categories', specificationController.getCategories);
router.get('/:category', specificationController.getTemplateByCategory);

// Admin only routes
router.post('/', authenticate, authorize(['admin']), specificationController.createTemplate);
router.put('/:category', authenticate, authorize(['admin']), specificationController.updateTemplate);
router.delete('/:category', authenticate, authorize(['admin']), specificationController.deleteTemplate);

module.exports = router;
