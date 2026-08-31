'use client';
import React, { useState, useRef } from 'react';
import {
  TextField, Button, FormControl, InputLabel, Select, MenuItem,
  Switch, FormControlLabel, CircularProgress, Alert
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import CloseIcon from '@mui/icons-material/Close';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

const SLIDE_TYPES = ['Home Banner', 'Promotional', 'Category Highlight', 'Sale'];

const initialForm = {
  title: '',
  subtitle: '',
  buttonText: '',
  buttonLink: '',
  backgroundColor: '#14b8a6',
  slideType: '',
  displayOrder: '',
  isActive: true,
  image: null,
};

export default function AddBannerSlideForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');
  const fileInputRef = useRef(null);

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(prev => ({ ...prev, [field]: value }));
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
    if (!form.title.trim()) errs.title = 'Title is required.';
    if (!form.slideType) errs.slideType = 'Slide type is required.';
    if (!form.buttonLink.trim()) errs.buttonLink = 'Button link is required.';
    if (form.displayOrder !== '' && isNaN(Number(form.displayOrder)))
      errs.displayOrder = 'Must be a number.';
    if (!form.image) errs.image = 'Banner image is required.';
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
        else if (key !== 'image') formData.append(key, val);
      });
      // TODO: replace with actual API call e.g. await api.post('/api/banners', formData)
      await new Promise(r => setTimeout(r, 1000));
      setSubmitMessage('Banner slide published successfully!');
      setForm(initialForm);
      removeImage();
    } catch {
      setSubmitError('Failed to publish. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-3xl">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Add Banner Slide</h2>

      {submitMessage && <Alert severity="success" sx={{ mb: 3 }}>{submitMessage}</Alert>}
      {submitError && <Alert severity="error" sx={{ mb: 3 }}>{submitError}</Alert>}

      <div className="space-y-6">
        {/* Title & Subtitle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <TextField
            label="Slide Title"
            fullWidth
            size="small"
            value={form.title}
            onChange={handleChange('title')}
            error={!!errors.title}
            helperText={errors.title}
          />
          <TextField
            label="Slide Subtitle"
            fullWidth
            size="small"
            value={form.subtitle}
            onChange={handleChange('subtitle')}
          />
        </div>

        {/* Button Text & Link */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <TextField
            label="Button Text"
            fullWidth
            size="small"
            value={form.buttonText}
            onChange={handleChange('buttonText')}
            placeholder="e.g. Shop Now"
          />
          <TextField
            label="Button Link / URL"
            fullWidth
            size="small"
            value={form.buttonLink}
            onChange={handleChange('buttonLink')}
            error={!!errors.buttonLink}
            helperText={errors.buttonLink}
            placeholder="e.g. /category/groceries"
          />
        </div>

        {/* Slide Type, Display Order, Background Color */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <FormControl size="small" fullWidth error={!!errors.slideType}>
            <InputLabel>Slide Type</InputLabel>
            <Select value={form.slideType} label="Slide Type" onChange={handleChange('slideType')}>
              {SLIDE_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </Select>
            {errors.slideType && <p className="text-red-500 text-xs mt-1 ml-3">{errors.slideType}</p>}
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
            helperText={errors.displayOrder}
          />

          <div>
            <p className="text-xs text-gray-600 mb-1 font-medium">Background Color</p>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={form.backgroundColor}
                onChange={handleChange('backgroundColor')}
                className="w-10 h-9 rounded border border-gray-300 cursor-pointer p-0.5"
              />
              <TextField
                size="small"
                value={form.backgroundColor}
                onChange={handleChange('backgroundColor')}
                inputProps={{ maxLength: 7 }}
                sx={{ width: 120 }}
              />
            </div>
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

        {/* Banner Image Upload */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">
            Banner Image <span className="text-red-500">*</span>
          </p>
          {errors.image && <p className="text-red-500 text-xs mb-2">{errors.image}</p>}

          {preview ? (
            <div className="relative w-full max-w-lg h-40 rounded-xl overflow-hidden border border-gray-200 group">
              <img src={preview} alt="Banner preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white text-gray-800 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={removeImage}
                  className="bg-red-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full max-w-lg h-40 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-teal-400 hover:text-teal-500 transition-colors"
            >
              <ImageIcon sx={{ fontSize: 36 }} />
              <span className="text-sm font-medium">Click to upload banner image</span>
              <span className="text-xs text-gray-400">PNG, JPG, WEBP — recommended 1200×400px</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
          />
        </div>

        {/* Preview Card */}
        {(form.title || preview) && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Live Preview</p>
            <div
              className="relative w-full max-w-lg h-36 rounded-xl overflow-hidden flex items-center px-8"
              style={{ backgroundColor: form.backgroundColor }}
            >
              {preview && (
                <img src={preview} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
              )}
              <div className="relative z-10 text-white">
                <p className="text-xl font-bold leading-tight">{form.title || 'Slide Title'}</p>
                {form.subtitle && <p className="text-sm mt-1 opacity-90">{form.subtitle}</p>}
                {form.buttonText && (
                  <span className="inline-block mt-2 bg-white text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">
                    {form.buttonText}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="pt-1">
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
            sx={{
              bgcolor: '#14b8a6', '&:hover': { bgcolor: '#0d9488' },
              textTransform: 'none', borderRadius: '8px',
              px: 4, py: 1.5, fontSize: '0.95rem', fontWeight: 600,
            }}
          >
            {loading ? 'Publishing...' : 'Publish Slide'}
          </Button>
        </div>
      </div>
    </div>
  );
}
