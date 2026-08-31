'use client';
import React, { useState, useRef, useEffect } from 'react';
import {
  TextField, Select, MenuItem, FormControl, InputLabel,
  Button, Rating, CircularProgress, Alert, Skeleton
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import { getProductById, updateProduct } from '@/src/APIFunctions/API_function_product';

const CATEGORIES = ['Groceries', 'Electronics', 'Clothing', 'Beauty', 'Home & Garden', 'Milk', 'Dairy'];

const emptyForm = {
  title: '', description: '', category: '', subCategory: '',
  price: '', discount: '', stock: '', brand: '',
  isFeatured: '', rating: 0, images: [],
};

export default function EditProductForm({ productId }) {
  const [form, setForm]               = useState(emptyForm);
  const [errors, setErrors]           = useState({});
  const [loading, setLoading]         = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError]   = useState('');
  const [previews, setPreviews]       = useState([]);   // { url, isExisting, public_id? }
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');
  const fileInputRef = useRef(null);

  // ── Load product on mount ──────────────────────────────────────────────────
  useEffect(() => {
    if (!productId) return;
    (async () => {
      setFetchLoading(true);
      setFetchError('');
      try {
        const res = await getProductById(productId);
        if (res?.success && res.data) {
          const p = res.data;
          setForm({
            title:       p.title        ?? '',
            description: p.description  ?? '',
            category:    p.category     ?? '',
            subCategory: p.subCategory  ?? '',
            price:       p.price        ?? '',
            discount:    p.discount     ?? '',
            stock:       p.stock        ?? '',
            brand:       p.brand        ?? '',
            isFeatured:  p.isFeatured   ? 'yes' : 'no',
            rating:      p.rating?.average ?? 0,
            images:      [],   // new files only
          });
          // Pre-populate existing image previews
          if (p.images?.length) {
            setPreviews(p.images.map(img => ({
              url:        img.url,
              public_id:  img.public_id,
              isExisting: true,
            })));
          }
        } else {
          setFetchError(res?.message || 'Failed to load product.');
        }
      } catch (err) {
        setFetchError(err?.response?.data?.message || err?.message || 'Failed to load product.');
      } finally {
        setFetchLoading(false);
      }
    })();
  }, [productId]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    setSubmitMessage(''); setSubmitError('');
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map(file => ({
      url: URL.createObjectURL(file),
      file,
      isExisting: false,
    }));
    setPreviews(prev => [...prev, ...newPreviews]);
    setForm(prev => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const removeImage = (index) => {
    const p = previews[index];
    if (!p.isExisting) URL.revokeObjectURL(p.url);
    setPreviews(prev => prev.filter((_, i) => i !== index));
    if (!p.isExisting) {
      setForm(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => {
          // count only non-existing previews before this index
          const newIdx = previews.slice(0, index).filter(x => !x.isExisting).length;
          return i !== newIdx;
        }),
      }));
    }
  };

  // ── Validate ───────────────────────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!form.title.trim())        errs.title       = 'Title is required.';
    if (!form.description.trim())  errs.description = 'Description is required.';
    if (!form.category)            errs.category    = 'Category is required.';
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0)
      errs.price = 'Valid price is required.';
    if (form.stock === '' || isNaN(form.stock) || Number(form.stock) < 0)
      errs.stock = 'Valid stock is required.';
    if (!form.brand.trim())        errs.brand       = 'Brand is required.';
    return errs;
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true); setSubmitMessage(''); setSubmitError('');
    try {
      // Keep existing image URLs + append new blob URLs as placeholders
      const existingImages = previews
        .filter(p => p.isExisting)
        .map(p => ({ url: p.url, public_id: p.public_id || '' }));

      const newImageUrls = previews
        .filter(p => !p.isExisting)
        .map(p => ({ url: p.url }));

      const payload = {
        title:       form.title.trim(),
        description: form.description.trim(),
        price:       Number(form.price),
        discount:    Number(form.discount || 0),
        stock:       Number(form.stock),
        category:    form.category,
        subCategory: form.subCategory || '',
        brand:       form.brand.trim(),
        isFeatured:  form.isFeatured === 'yes',
        images:      [...existingImages, ...newImageUrls],
      };

      const res = await updateProduct(productId, payload);
      if (res?.success) {
        setSubmitMessage('Product updated successfully!');
      } else {
        setSubmitError(res?.message || 'Update failed.');
      }
    } catch (err) {
      setSubmitError(err?.response?.data?.message || err?.message || 'Update failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  if (fetchLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-4xl space-y-5">
        <Skeleton variant="text" width={160} height={32} />
        {[...Array(6)].map((_, i) => <Skeleton key={i} variant="rounded" height={40} />)}
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-4xl">
        <Alert severity="error">{fetchError}</Alert>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-4xl">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Edit Product</h2>

      {submitMessage && <Alert severity="success" sx={{ mb: 3 }}>{submitMessage}</Alert>}
      {submitError   && <Alert severity="error"   sx={{ mb: 3 }}>{submitError}</Alert>}

      <div className="space-y-6!">
        {/* Title */}
        <TextField label="Product Name" fullWidth size="small"
          value={form.title} onChange={handleChange('title')}
          error={!!errors.title} helperText={errors.title} />

        {/* Description */}
        <TextField label="Product Description" fullWidth multiline rows={4}
          value={form.description} onChange={handleChange('description')}
          error={!!errors.description} helperText={errors.description} />

        {/* Row 1: Category, Price, Old Price, Is Featured */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <FormControl size="small" fullWidth error={!!errors.category}>
            <InputLabel>Product Category</InputLabel>
            <Select value={form.category} label="Product Category" onChange={handleChange('category')}>
              {CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </Select>
            {errors.category && <p className="text-red-500 text-xs mt-1 ml-3">{errors.category}</p>}
          </FormControl>

          <TextField label="Product Price (₹)" size="small" fullWidth type="number"
            inputProps={{ min: 0 }} value={form.price} onChange={handleChange('price')}
            error={!!errors.price} helperText={errors.price} />

          <TextField label="Discount (%)" size="small" fullWidth type="number"
            inputProps={{ min: 0, max: 100 }} value={form.discount} onChange={handleChange('discount')} />

          <FormControl size="small" fullWidth>
            <InputLabel>Is Featured?</InputLabel>
            <Select value={form.isFeatured} label="Is Featured?" onChange={handleChange('isFeatured')}>
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Row 2: Stock, Brand, SubCategory */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <TextField label="Product Stock" size="small" fullWidth type="number"
            inputProps={{ min: 0 }} value={form.stock} onChange={handleChange('stock')}
            error={!!errors.stock} helperText={errors.stock} />

          <TextField label="Product Brand" size="small" fullWidth
            value={form.brand} onChange={handleChange('brand')}
            error={!!errors.brand} helperText={errors.brand} />

          <TextField label="Sub Category" size="small" fullWidth
            value={form.subCategory} onChange={handleChange('subCategory')} />
        </div>

        {/* Rating */}
        <div>
          <p className="text-sm text-gray-600 mb-1">Product Rating</p>
          <Rating value={Number(form.rating)} onChange={(_, val) => setForm(prev => ({ ...prev, rating: val ?? 0 }))} size="large" sx={{ color: '#f59e0b' }} />
        </div>

        {/* Images */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">Media &amp; Images</p>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => fileInputRef.current?.click()}
              className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-teal-400 hover:text-teal-500 transition-colors">
              <ImageIcon sx={{ fontSize: 32 }} />
              <span className="text-xs">Add Image</span>
            </button>

            {previews.map((img, idx) => (
              <div key={idx} className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200 group">
                <img src={img.url} alt="" className="w-full h-full object-cover"
                  onError={e => { e.target.src = ''; }} />
                {img.isExisting && (
                  <span className="absolute bottom-0 left-0 right-0 text-center text-white text-xs bg-black/40 py-0.5">saved</span>
                )}
                <button type="button" onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <CloseIcon sx={{ fontSize: 14 }} />
                </button>
              </div>
            ))}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageSelect} />
        </div>

        {/* Submit */}
        <div className="pt-1">
          <Button variant="contained" size="large" onClick={handleSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
            sx={{ bgcolor: '#14b8a6', '&:hover': { bgcolor: '#0d9488' }, textTransform: 'none', borderRadius: '8px', px: 4, py: 1.5, fontSize: '0.95rem', fontWeight: 600 }}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
