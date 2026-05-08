const ServiceCategory = require("../models/ServiceCategory");

exports.getCategories = async (req, res) => {
  try {
    const categories = await ServiceCategory.find().sort({ sortOrder: 1 });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const category = await ServiceCategory.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await ServiceCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await ServiceCategory.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.toggleCategoryStatus = async (req, res) => {
  try {
    const category = await ServiceCategory.findById(req.params.id);
    category.isActive = !category.isActive;
    await category.save();
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCategoryOrder = async (req, res) => {
  try {
    const { order } = req.body;
    await Promise.all(order.map((id, index) => 
      ServiceCategory.findByIdAndUpdate(id, { sortOrder: index })
    ));
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
