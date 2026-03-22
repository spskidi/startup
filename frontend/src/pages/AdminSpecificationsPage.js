import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function AdminSpecificationsPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    specs: [],
  });

  const [currentSpec, setCurrentSpec] = useState({
    name: '',
    type: 'text',
    options: [],
    required: false,
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const response = await api.get('/specifications');
      setTemplates(response.data.templates || []);
    } catch (error) {
      toast.error('Failed to fetch templates');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSpec = () => {
    if (!currentSpec.name) {
      toast.error('Specification name is required');
      return;
    }

    if (
      currentSpec.type === 'dropdown' &&
      (!currentSpec.options || currentSpec.options.length === 0)
    ) {
      toast.error('Please add at least one option for dropdown type');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      specs: [...prev.specs, currentSpec],
    }));

    setCurrentSpec({
      name: '',
      type: 'text',
      options: [],
      required: false,
    });
    toast.success('Specification added');
  };

  const handleRemoveSpec = (index) => {
    setFormData((prev) => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index),
    }));
  };

  const handleAddOption = () => {
    const option = prompt('Enter option name:');
    if (option) {
      setCurrentSpec((prev) => ({
        ...prev,
        options: [...prev.options, option],
      }));
    }
  };

  const handleRemoveOption = (index) => {
    setCurrentSpec((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category || formData.specs.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingId) {
        await api.put(`/specifications/${editingId}`, formData);
        toast.success('Template updated successfully!');
      } else {
        await api.post('/specifications', formData);
        toast.success('Template created successfully!');
      }

      setFormData({ category: '', specs: [] });
      setEditingId(null);
      setShowForm(false);
      setCurrentSpec({
        name: '',
        type: 'text',
        options: [],
        required: false,
      });
      fetchTemplates();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save template');
    }
  };

  const handleEdit = (template) => {
    setFormData(template);
    setEditingId(template._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await api.delete(`/specifications/${id}`);
        toast.success('Template deleted');
        fetchTemplates();
      } catch (error) {
        toast.error('Failed to delete template');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ category: '', specs: [] });
    setCurrentSpec({
      name: '',
      type: 'text',
      options: [],
      required: false,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading templates...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Product Specifications</h1>
          <p className="text-gray-600">Manage category-specific product specifications</p>
        </div>

        {/* Add Template Button */}
        <div className="mb-8">
          <button
            onClick={() => {
              if (!showForm) {
                setShowForm(true);
              } else {
                handleCancel();
              }
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            <FaPlus /> {showForm ? 'Cancel' : 'New Template'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingId ? 'Edit Template' : 'Create New Template'}
            </h2>

            <form onSubmit={handleSubmit}>
              {/* Category Selection */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Category <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., computers, mobiles, clothing"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  disabled={editingId !== null}
                />
                {editingId && (
                  <p className="text-xs text-gray-600 mt-2">Category cannot be changed for existing templates</p>
                )}
              </div>

              {/* Add Specifications */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Add Specifications</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-6 bg-gray-50 rounded-lg">
                  {/* Spec Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Specification Name
                    </label>
                    <input
                      type="text"
                      value={currentSpec.name}
                      onChange={(e) => setCurrentSpec({ ...currentSpec, name: e.target.value })}
                      placeholder="e.g., Processor"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  {/* Spec Type */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Type</label>
                    <select
                      value={currentSpec.type}
                      onChange={(e) =>
                        setCurrentSpec({
                          ...currentSpec,
                          type: e.target.value,
                          options: e.target.value === 'dropdown' ? currentSpec.options : [],
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="text">Text</option>
                      <option value="dropdown">Dropdown</option>
                      <option value="number">Number</option>
                      <option value="boolean">Boolean (Yes/No)</option>
                    </select>
                  </div>

                  {/* Dropdown Options */}
                  {currentSpec.type === 'dropdown' && (
                    <div className="md:col-span-2">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-semibold text-gray-900">Options</label>
                        <button
                          type="button"
                          onClick={handleAddOption}
                          className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
                        >
                          Add Option
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {currentSpec.options.map((option, idx) => (
                          <div
                            key={idx}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                          >
                            {option}
                            <button
                              type="button"
                              onClick={() => handleRemoveOption(idx)}
                              className="hover:bg-blue-200 rounded-full p-1"
                            >
                              <FaTimes size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Required Checkbox */}
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentSpec.required}
                        onChange={(e) =>
                          setCurrentSpec({ ...currentSpec, required: e.target.checked })
                        }
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm font-semibold text-gray-900">
                        This specification is required
                      </span>
                    </label>
                  </div>

                  {/* Add Button */}
                  <div className="md:col-span-2">
                    <button
                      type="button"
                      onClick={handleAddSpec}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2"
                    >
                      <FaPlus size={14} /> Add to Template
                    </button>
                  </div>
                </div>

                {/* Specifications List */}
                {formData.specs.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      Added Specifications ({formData.specs.length})
                    </h4>
                    <div className="space-y-2">
                      {formData.specs.map((spec, idx) => (
                        <div
                          key={idx}
                          className="flex items-start justify-between p-3 bg-gray-100 rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{spec.name}</p>
                            <p className="text-xs text-gray-600">
                              Type: {spec.type} {spec.required && '(Required)'}
                            </p>
                            {spec.options && spec.options.length > 0 && (
                              <p className="text-xs text-gray-600 mt-1">
                                Options: {spec.options.join(', ')}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveSpec(idx)}
                            className="text-red-600 hover:text-red-800 transition ml-4"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                  <FaCheck size={16} /> {editingId ? 'Update Template' : 'Create Template'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Templates Grid */}
        {templates.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-xl text-gray-600 mb-4">No specification templates yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              <FaPlus /> Create First Template
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div key={template._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
                {/* Header */}
                <div className="bg-blue-50 p-4 border-b">
                  <h3 className="text-lg font-bold text-gray-900 capitalize">{template.category}</h3>
                  <p className="text-sm text-gray-600">{template.specs.length} specifications</p>
                </div>

                {/* Specifications List */}
                <div className="p-4 max-h-64 overflow-y-auto">
                  <div className="space-y-3">
                    {template.specs.map((spec, idx) => (
                      <div key={idx} className="text-sm">
                        <div className="flex items-start gap-2">
                          <span className="text-blue-600 font-semibold">•</span>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{spec.name}</p>
                            <p className="text-xs text-gray-600">
                              {spec.type}
                              {spec.required && ' • Required'}
                            </p>
                            {spec.options && spec.options.length > 0 && (
                              <p className="text-xs text-gray-500 mt-1">
                                {spec.options.slice(0, 3).join(', ')}
                                {spec.options.length > 3 && `... +${spec.options.length - 3}`}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 bg-gray-50 border-t flex gap-2">
                  <button
                    onClick={() => handleEdit(template)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
                  >
                    <FaEdit size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(template._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm"
                  >
                    <FaTrash size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
