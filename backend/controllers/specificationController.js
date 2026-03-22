const SpecificationTemplate = require('../models/SpecificationTemplate');

// Get all specification templates
exports.getAllTemplates = async (req, res) => {
  try {
    const templates = await SpecificationTemplate.find().sort({ category: 1 });
    res.status(200).json({
      success: true,
      templates,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching templates', error: error.message });
  }
};

// Get specific template by category
exports.getTemplateByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const template = await SpecificationTemplate.findOne({
      category: category.toLowerCase(),
    });

    if (!template) {
      return res.status(404).json({
        message: 'Specification template not found for this category',
      });
    }

    res.status(200).json({
      success: true,
      template,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching template', error: error.message });
  }
};

// Create new specification template (admin only)
exports.createTemplate = async (req, res) => {
  try {
    const { category, specs } = req.body;

    // Check if template already exists
    const existing = await SpecificationTemplate.findOne({
      category: category.toLowerCase(),
    });
    if (existing) {
      return res.status(400).json({ message: 'Template already exists for this category' });
    }

    const template = new SpecificationTemplate({
      category: category.toLowerCase(),
      specs: specs || [],
    });

    await template.save();
    res.status(201).json({
      success: true,
      message: 'Template created successfully',
      template,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating template', error: error.message });
  }
};

// Update specification template (admin only)
exports.updateTemplate = async (req, res) => {
  try {
    const { category } = req.params;
    const { specs } = req.body;

    const template = await SpecificationTemplate.findOneAndUpdate(
      { category: category.toLowerCase() },
      { specs, updatedAt: Date.now() },
      { new: true }
    );

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Template updated successfully',
      template,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating template', error: error.message });
  }
};

// Delete specification template (admin only)
exports.deleteTemplate = async (req, res) => {
  try {
    const { category } = req.params;

    const template = await SpecificationTemplate.findOneAndDelete({
      category: category.toLowerCase(),
    });

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Template deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting template', error: error.message });
  }
};

// Get categories that have templates
exports.getCategories = async (req, res) => {
  try {
    const templates = await SpecificationTemplate.find().select('category');
    const categories = templates.map(t => t.category);
    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};
