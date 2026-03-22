import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { FaPlus, FaTrash, FaCheck } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function ShopkeeperAddProductPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [specifications, setSpecifications] = useState([]);
  const [specificationTemplate, setSpecificationTemplate] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    originalPrice: '',
    quantity: '',
    sku: '',
    tags: '',
    warranty: '1 Year Warranty',
    returnable: true,
    returnDays: '30',
    specifications: {},
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/products/categories');
      setCategories(response.data.categories || []);
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

  const fetchSpecificationTemplate = async (category) => {
    try {
      const response = await api.get(`/specifications/template/${category}`);
      if (response.data.template) {
        setSpecificationTemplate(response.data.template);
        setSpecifications(response.data.template.specs || []);
        // Initialize specification form fields
        const newSpecs = {};
        (response.data.template.specs || []).forEach((spec) => {
          newSpecs[spec.name] = '';
        });
        setFormData((prev) => ({
          ...prev,
          specifications: newSpecs,
        }));
      }
    } catch (error) {
      console.log('No specification template found for this category');
      setSpecificationTemplate(null);
      setSpecifications([]);
      setFormData((prev) => ({
        ...prev,
        specifications: {},
      }));
    }
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setFormData((prev) => ({
      ...prev,
      category: selectedCategory,
    }));
    if (selectedCategory) {
      fetchSpecificationTemplate(selectedCategory);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSpecificationChange = (specName, value) => {
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [specName]: value,
      },
    }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (imageFiles.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    setImageFiles((prev) => [...prev, ...files]);

    // Create previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.price || !formData.quantity) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (imageFiles.length === 0) {
      toast.error('Please add at least one image');
      return;
    }

    setLoading(true);

    try {
      const submitFormData = new FormData();
      submitFormData.append('name', formData.name);
      submitFormData.append('description', formData.description);
      submitFormData.append('category', formData.category);
      submitFormData.append('price', parseFloat(formData.price));
      submitFormData.append('originalPrice', formData.originalPrice ? parseFloat(formData.originalPrice) : parseFloat(formData.price));
      submitFormData.append('quantity', parseInt(formData.quantity));
      submitFormData.append('sku', formData.sku || `SKU-${Date.now()}`);
      submitFormData.append('tags', formData.tags);
      submitFormData.append('warranty', formData.warranty);
      submitFormData.append('returnable', formData.returnable);
      submitFormData.append('returnDays', parseInt(formData.returnDays));

      // Add specifications as JSON
      submitFormData.append('specifications', JSON.stringify(formData.specifications));

      // Add images
      imageFiles.forEach((file, index) => {
        submitFormData.append('images', file);
      });

      const response = await api.post('/products', submitFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Product created successfully!');
      navigate('/shopkeeper-dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Add New Product</h1>
          <p className="text-gray-600">Create and list a new product with detailed specifications</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm">
          {/* Basic Information */}
          <div className="border-b p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={handleCategoryChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* SKU */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">SKU (Optional)</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  placeholder="e.g., SKU-12345"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="border-b p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Pricing & Inventory</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              {/* Original Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Original Price (₹)
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  placeholder="For discount display"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Quantity in Stock <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="e.g., new, bestseller, trending"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Warranty & Returns */}
          <div className="border-b p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Warranty & Returns</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Warranty */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Warranty</label>
                <input
                  type="text"
                  name="warranty"
                  value={formData.warranty}
                  onChange={handleInputChange}
                  placeholder="e.g., 2 Year Warranty"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Return Days */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Return Days</label>
                <input
                  type="number"
                  name="returnDays"
                  value={formData.returnDays}
                  onChange={handleInputChange}
                  min="0"
                  max="365"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Returnable */}
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="returnable"
                    checked={formData.returnable}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-semibold text-gray-900">Product is returnable</span>
                </label>
              </div>
            </div>
          </div>

          {/* Product Specifications */}
          {specifications.length > 0 && (
            <div className="border-b p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Product Specifications ({formData.category})
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {specifications.map((spec) => (
                  <div key={spec.name}>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      {spec.name}
                      {spec.required && <span className="text-red-500">*</span>}
                    </label>

                    {spec.type === 'dropdown' ? (
                      <select
                        value={formData.specifications[spec.name] || ''}
                        onChange={(e) => handleSpecificationChange(spec.name, e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        required={spec.required}
                      >
                        <option value="">Select {spec.name}</option>
                        {(spec.options || []).map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : spec.type === 'number' ? (
                      <input
                        type="number"
                        value={formData.specifications[spec.name] || ''}
                        onChange={(e) => handleSpecificationChange(spec.name, e.target.value)}
                        placeholder={spec.name}
                        step="0.01"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        required={spec.required}
                      />
                    ) : spec.type === 'boolean' ? (
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.specifications[spec.name] === 'true' || false}
                          onChange={(e) =>
                            handleSpecificationChange(spec.name, e.target.checked ? 'true' : 'false')
                          }
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{spec.name}</span>
                      </label>
                    ) : (
                      <input
                        type="text"
                        value={formData.specifications[spec.name] || ''}
                        onChange={(e) => handleSpecificationChange(spec.name, e.target.value)}
                        placeholder={spec.name}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        required={spec.required}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Product Images */}
          <div className="border-b p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Product Images <span className="text-red-500">*</span>
            </h2>

            {/* Image Upload Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center cursor-pointer hover:bg-blue-50 transition mb-6"
            >
              <div className="flex flex-col items-center gap-3">
                <FaPlus className="text-3xl text-blue-600" />
                <div>
                  <p className="text-lg font-semibold text-gray-900">Click to upload images</p>
                  <p className="text-sm text-gray-600">PNG, JPG, GIF up to 5 images</p>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-4">
                  Selected images ({imagePreviews.length}/5)
                </p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="p-6 bg-gray-50">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? 'Creating Product...' : (
                <>
                  <FaCheck /> Create Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
