'use client';
import React, { useState, useRef } from 'react';
import {
  TextField, Button, FormControl, InputLabel, Select, MenuItem,
  Switch, FormControlLabel, CircularProgress, Alert, Chip
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

const PARENT_CATEGORIES = ['None (Top Level)', 'Groceries', 'Electronics', 'Clothing', 'Beauty', 'Home & Garden'];
const ICON_OPTIONS = ['🛒', '🍎', '🥦', '🥩', '🍞', '📱', '👕', '💄', '🏠', '🌿', '⚡', '🎁'];

const initialForm = {
  name: '',
  slug: '',
  parentCategory: 'None (Top Level)',
  description: '',
  icon: '',
  displayOrder: '',
  metaTitle: '',
  metaDescription: '',
  isActive: true,
  image: null,
};

function toSlug(str) {
  return str.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export default function AddCategoryForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');
  const fileInputRef = useRef(null);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm(prev => {
      const next = { ...prev, [field]: value };
      // Auto-generate slug from name
      if (field === 'name') next.slug = toSlug(value);
      return next;
    });
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    setSubmitMessage('');
    setSubmitError('');
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
    setForm(prev => ({ ...prev, image: file }));
    if (errors.image) setErrors(prev => ({ ...prev, image: '' }));
  };

  const removeImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setForm(prev => ({ ...prev, image: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Category name is required.';
    if (!form.slug.trim()) errs.slug = 'Slug is required.';
    else if (!/^[a-z0-9-]+$/.test(form.slug)) errs.slug = 'Slug must be lowercase letters, numbers and hyphens only.';
    if (form.displayOrder !== '' && isNaN(Number(form.displayOrder)))
      errs.displayOrder = 'Must be a number.';
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (key === 'image' && val) formData.append('image', val);
        else if (key !== 'image') formData.append(key, String(val));
      });
      // TODO: replace with actual API call e.g. await api.post('/api/categories', formData)
      await new Promise(r => setTimeout(r, 1000));
      setSubmitMessage('Category created successfully!');
      setForm(initialForm);
      removeImage();
    } catch {
      setSubmitError('Failed to create category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-3xl">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Add Category</h2>

      {submitMessage && <Alert severity="success" sx={{ mb: 3 }}>{submitMessage}</Alert>}
      {submitError && <Alert severity="error" sx={{ mb: 3 }}>{submitError}</Alert>}

      <div className="space-y-6">
        {/* Name & Slug */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <TextField
            label="Category Name"
            fullWidth
            size="small"
            value={form.name}
            onChange={handleChange('name')}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            label="Slug (auto-generated)"
            fullWidth
            size="small"
            value={form.slug}
            onChange={handleChange('slug')}
            error={!!errors.slug}
            helperText={errors.slug || 'Used in URL: /category/slug'}
            inputProps={{ pattern: '[a-z0-9-]+' }}
          />
        </div>

        {/* Parent Category & Display Order */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormControl size="small" fullWidth>
            <InputLabel>Parent Category</InputLabel>
            <Select value={form.parentCategory} label="Parent Category" onChange={handleChange('parentCategory')}>
              {PARENT_CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </Select>
          </FormControl>

          <TextField
            label="Display Order"
            size="small"
            fullWidth
            type="number"
            inputProps={{ min: 1 }}
            value={form.displayOrder}
            onChange={handleChange('displayOrder')}
            error={!!errors.displayOrder}
            helperText={errors.displayOrder || 'Lower = shown first'}
          />
        </div>

        {/* Description */}
        <TextField
          label="Description"
          fullWidth
          multiline
          rows={3}
          value={form.description}
          onChange={handleChange('description')}
        />

        {/* Icon Picker */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Category Icon</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {ICON_OPTIONS.map(icon => (
              <button
                key={icon}
                type="button"
                onClick={() => setForm(prev => ({ ...prev, icon: prev.icon === icon ? '' : icon }))}
                className={`w-10 h-10 text-xl rounded-lg border-2 transition-all
                  ${form.icon === icon ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-teal-300'}`}
              >
                {icon}
              </button>
            ))}
          </div>
          <TextField
            label="Or enter custom icon / emoji"
            size="small"
            value={form.icon}
            onChange={handleChange('icon')}
            sx={{ width: 220 }}
          />
        </div>

        {/* Category Image */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">Category Image</p>
          <div className="flex items-start gap-4">
            {preview ? (
              <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-gray-200 group shrink-0">
                <img src={preview} alt="Category preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <CloseIcon sx={{ fontSize: 14 }} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-28 h-28 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-teal-400 hover:text-teal-500 transition-colors shrink-0"
              >
                <ImageIcon sx={{ fontSize: 28 }} />
                <span className="text-xs text-center leading-tight">Upload Image</span>
              </button>
            )}
            <div className="text-xs text-gray-400 mt-2 leading-relaxed">
              <p>Recommended: <strong>400×400px</strong></p>
              <p>Formats: PNG, JPG, WEBP</p>
              <p>Max size: 2MB</p>
              {preview && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 text-teal-600 font-medium hover:underline"
                >
                  Change image
                </button>
              )}
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
          />
        </div>

        {/* SEO Fields */}
        <div className="border-t border-gray-100 pt-5">
          <p className="text-sm font-semibold text-gray-700 mb-4">SEO (optional)</p>
          <div className="space-y-4">
            <TextField
              label="Meta Title"
              fullWidth
              size="small"
              value={form.metaTitle}
              onChange={handleChange('metaTitle')}
              inputProps={{ maxLength: 60 }}
              helperText={`${form.metaTitle.length}/60`}
            />
            <TextField
              label="Meta Description"
              fullWidth
              size="small"
              multiline
              rows={2}
              value={form.metaDescription}
              onChange={handleChange('metaDescription')}
              inputProps={{ maxLength: 160 }}
              helperText={`${form.metaDescription.length}/160`}
            />
          </div>
        </div>

        {/* Active Toggle */}
        <FormControlLabel
          control={
            <Switch
              checked={form.isActive}
              onChange={(e) => setForm(prev => ({ ...prev, isActive: e.target.checked }))}
              sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#14b8a6' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#14b8a6' } }}
            />
          }
          label={<span className="text-sm text-gray-700">Active (visible on site)</span>}
        />

        {/* Submit */}
        <div className="pt-1">
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <AddIcon />}
            sx={{
              bgcolor: '#14b8a6', '&:hover': { bgcolor: '#0d9488' },
              textTransform: 'none', borderRadius: '8px',
              px: 4, py: 1.5, fontSize: '0.95rem', fontWeight: 600,
            }}
          >
            {loading ? 'Creating...' : 'Create Category'}
          </Button>
        </div>
      </div>
    </div>
  );
}
