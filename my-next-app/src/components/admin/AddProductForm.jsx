'use client';
import React, { useState, useRef } from 'react';
import {
  TextField, Select, MenuItem, FormControl, InputLabel,
  Button, Rating, CircularProgress, Alert
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageIcon from '@mui/icons-material/Image';
import CloseIcon from '@mui/icons-material/Close';
import { createProduct } from '@/src/APIFunctions/API_function_product';

const CATEGORIES = ['Groceries', 'Electronics', 'Clothing', 'Beauty', 'Home & Garden'];

const initialForm = {
  name: '',
  description: '',
  category: '',
  price: '',
  oldPrice: '',
  isFeatured: '',
  stock: '',
  brand: '',
  discount: '',
  rating: 1,
  images: [],
};

export default function AddProductForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');
  const fileInputRef = useRef(null);

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    setSubmitMessage('');
    setSubmitError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Product name is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.category) newErrors.category = 'Category is required';
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0)
      newErrors.price = 'Valid price is required';
    if (!form.stock || isNaN(form.stock) || Number(form.stock) < 0)
      newErrors.stock = 'Valid stock is required';
    if (!form.brand.trim()) newErrors.brand = 'Brand is required';
    return newErrors;
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setPreviews(prev => [...prev, ...newPreviews]);
    setForm(prev => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previews[index].url);
    setPreviews(prev => prev.filter((_, i) => i !== index));
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    setSubmitMessage('');
    setSubmitError('');
    try {
      // Build the payload matching the API contract
      const payload = {
        title:       form.name.trim(),
        description: form.description.trim(),
        price:       Number(form.price),
        discount:    Number(form.discount || 0),
        stock:       Number(form.stock),
        category:    form.category,
        subCategory: form.subCategory || '',
        brand:       form.brand.trim(),
        isFeatured:  form.isFeatured === 'yes',
        rating: {
          count: Number(form.rating || 0),
        },
        // For uploaded files, pass a temporary object URL; replace with
        // a real upload service (e.g. Cloudinary) to get permanent URLs.
        images: previews.map(p => ({ url: p.url })),
      };

      const res = await createProduct(payload);

      if (res && res.success) {
        setSubmitMessage('Product published successfully!');
        setForm(initialForm);
        setPreviews([]);
      } else {
        setSubmitError(res?.message || 'Failed to publish product.');
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to publish product. Please try again.';
      setSubmitError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-4xl">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Add Product</h2>

      {submitMessage && <Alert severity="success" sx={{ mb: 3 }}>{submitMessage}</Alert>}
      {submitError   && <Alert severity="error"   sx={{ mb: 3 }}>{submitError}</Alert>}

      <div className="space-y-7!">
        {/* Product Name */}
        <TextField
          label="Product Name"
          fullWidth
          size="small"
          value={form.name}
          onChange={handleChange('name')}
          error={!!errors.name}
          helperText={errors.name}
        />

        {/* Product Description */}
        <TextField
          label="Product Description"
          fullWidth
          multiline
          rows={5}
          value={form.description}
          onChange={handleChange('description')}
          error={!!errors.description}
          helperText={errors.description}
        />

        {/* Row: Category, Price, Old Price, Is Featured */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormControl size="small" fullWidth error={!!errors.category}>
            <InputLabel>Product Category</InputLabel>
            <Select
              value={form.category}
              label="Product Category"
              onChange={handleChange('category')}
            >
              {CATEGORIES.map(c => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
            {errors.category && (
              <p className="text-red-500 text-xs mt-1 ml-3">{errors.category}</p>
            )}
          </FormControl>

          <TextField
            label="Product Price"
            size="small"
            fullWidth
            type="number"
            inputProps={{ min: 0 }}
            value={form.price}
            onChange={handleChange('price')}
            error={!!errors.price}
            helperText={errors.price}
          />

          <TextField
            label="Product Old Price"
            size="small"
            fullWidth
            type="number"
            inputProps={{ min: 0 }}
            value={form.oldPrice}
            onChange={handleChange('oldPrice')}
          />

          <FormControl size="small" fullWidth>
            <InputLabel>Is Featured?</InputLabel>
            <Select
              value={form.isFeatured}
              label="Is Featured?"
              onChange={handleChange('isFeatured')}
            >
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Row: Stock, Brand, Discount */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <TextField
            label="Product Stock"
            size="small"
            fullWidth
            type="number"
            inputProps={{ min: 0 }}
            value={form.stock}
            onChange={handleChange('stock')}
            error={!!errors.stock}
            helperText={errors.stock}
          />
          <TextField
            label="Product Brand"
            size="small"
            fullWidth
            value={form.brand}
            onChange={handleChange('brand')}
            error={!!errors.brand}
            helperText={errors.brand}
          />
          <TextField
            label="Product Discount (%)"
            size="small"
            fullWidth
            type="number"
            inputProps={{ min: 0, max: 100 }}
            value={form.discount}
            onChange={handleChange('discount')}
          />
        </div>

        {/* Product Rating */}
        <div>
          <p className="text-sm text-gray-600 mb-1">Product Rating</p>
          <Rating
            value={form.rating}
            onChange={(_, val) => setForm(prev => ({ ...prev, rating: val }))}
            size="large"
          />
        </div>

        {/* Media & Images */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">Media &amp; Images</p>
          <div className="flex flex-wrap gap-3">
            {/* Upload box */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-teal-400 hover:text-teal-500 transition-colors cursor-pointer"
            >
              <ImageIcon sx={{ fontSize: 32 }} />
              <span className="text-xs">Image Upload</span>
            </button>

            {/* Previews */}
            {previews.map((img, idx) => (
              <div key={idx} className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200 group">
                <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <CloseIcon sx={{ fontSize: 14 }} />
                </button>
              </div>
            ))}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageSelect}
          />
        </div>

        {/* Submit */}
        <div className="pt-2">
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
            sx={{
              bgcolor: '#14b8a6',
              '&:hover': { bgcolor: '#0d9488' },
              textTransform: 'none',
              borderRadius: '8px',
              px: 4,
              py: 1.5,
              fontSize: '0.95rem',
              fontWeight: 600,
            }}
          >
            {loading ? 'Publishing...' : 'Publish and view'}
          </Button>
        </div>
      </div>
    </div>
  );
}
