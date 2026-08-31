'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Checkbox, Select, MenuItem, FormControl, InputLabel,
  TextField, InputAdornment, Button, Rating, TablePagination,
  Tooltip, IconButton, CircularProgress, Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useRouter } from 'next/navigation';
import { getAllProducts, deleteProduct } from '@/src/APIFunctions/API_function_product';

const headerSx = { fontSize: '0.72rem', fontWeight: 700, color: '#6b7280', py: 1.5, letterSpacing: '0.05em' };

const formatINR = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount ?? 0);

export default function ProductListTable() {
  const router = useRouter();

  const [products, setProducts]         = useState([]);
  const [totalCount, setTotalCount]     = useState(0);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError]     = useState('');
  const [deletingId, setDeletingId]     = useState(null);
  const [deleteError, setDeleteError]   = useState('');

  const [page, setPage]               = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [categoryFilter, setCategoryFilter]       = useState('All');
  const [subCategoryFilter, setSubCategoryFilter] = useState('All');
  const [search, setSearch]                       = useState('');
  const [selected, setSelected]                   = useState([]);

  const fetchProducts = useCallback(async (p, limit) => {
    setFetchLoading(true);
    setFetchError('');
    try {
      const res = await getAllProducts({ page: p + 1, limit });
      if (res?.success) {
        setProducts(res.data || []);
        setTotalCount(res.pagination?.total ?? 0);
      } else {
        setFetchError(res?.message || 'Failed to fetch products.');
      }
    } catch (err) {
      setFetchError(err?.response?.data?.message || err?.message || 'Failed to fetch products.');
    } finally {
      setFetchLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(page, rowsPerPage); }, [page, rowsPerPage, fetchProducts]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setDeletingId(id);
    setDeleteError('');
    try {
      const res = await deleteProduct(id);
      if (res?.success) {
        setProducts(prev => prev.filter(p => p._id !== id));
        setTotalCount(prev => Math.max(0, prev - 1));
        setSelected(prev => prev.filter(i => i !== id));
      } else {
        setDeleteError(res?.message || 'Delete failed.');
      }
    } catch (err) {
      setDeleteError(err?.response?.data?.message || err?.message || 'Delete failed.');
    } finally {
      setDeletingId(null);
    }
  };

  const categories    = useMemo(() => ['All', ...new Set(products.map(p => p.category).filter(Boolean))], [products]);
  const subCategories = useMemo(() => ['All', ...new Set(products.map(p => p.subCategory).filter(Boolean))], [products]);

  const visible = products.filter(p =>
    (categoryFilter    === 'All' || p.category    === categoryFilter) &&
    (subCategoryFilter === 'All' || p.subCategory === subCategoryFilter) &&
    (p.title || '').toLowerCase().includes(search.toLowerCase())
  );

  const allSelected = visible.length > 0 && visible.every(p => selected.includes(p._id));

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelected(prev => [...new Set([...prev, ...visible.map(p => p._id)])]);
    else setSelected(prev => prev.filter(id => !visible.map(p => p._id).includes(id)));
  };

  return (
    <Paper elevation={0} className="rounded-xl border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Products</h2>
          <p className="text-xs text-gray-400 mt-0.5">{totalCount} total products</p>
        </div>
        <div className="flex items-center gap-2">
          <Tooltip title="Refresh">
            <IconButton size="small" onClick={() => fetchProducts(page, rowsPerPage)} disabled={fetchLoading}>
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push('/admin/add-product')}
            sx={{ bgcolor: '#14b8a6', '&:hover': { bgcolor: '#0d9488' }, textTransform: 'none', borderRadius: '8px', fontWeight: 600, px: 2.5 }}
          >
            ADD PRODUCT
          </Button>
        </div>
      </div>

      {fetchError  && <Alert severity="error" sx={{ mx: 3, mb: 2 }} onClose={() => setFetchError('')}>{fetchError}</Alert>}
      {deleteError && <Alert severity="error" sx={{ mx: 3, mb: 2 }} onClose={() => setDeleteError('')}>{deleteError}</Alert>}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 px-6 pb-4">
        <FormControl size="small" variant="outlined" sx={{ minWidth: 140 }}>
          <InputLabel>Category By</InputLabel>
          <Select value={categoryFilter} label="Category By" onChange={e => setCategoryFilter(e.target.value)}>
            {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" variant="outlined" sx={{ minWidth: 160 }}>
          <InputLabel>Sub Category By</InputLabel>
          <Select value={subCategoryFilter} label="Sub Category By" onChange={e => setSubCategoryFilter(e.target.value)}>
            {subCategories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </Select>
        </FormControl>
        <TextField
          size="small"
          placeholder="Search here..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" sx={{ color: '#9ca3af' }} /></InputAdornment> }}
          sx={{ ml: 'auto', width: 220 }}
        />
      </div>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f9fafb', borderTop: '1px solid #f3f4f6' }}>
              <TableCell padding="checkbox" sx={{ pl: 2 }}>
                <Checkbox size="small" checked={allSelected} onChange={handleSelectAll} disabled={fetchLoading} />
              </TableCell>
              {['PRODUCT', 'CATEGORY', 'SUB CATEGORY', 'PRICE', 'STOCK', 'RATING', 'ACTION'].map(h => (
                <TableCell key={h} sx={headerSx}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {fetchLoading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <CircularProgress size={32} sx={{ color: '#14b8a6' }} />
                </TableCell>
              </TableRow>
            ) : visible.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6, color: '#9ca3af' }}>
                  {totalCount === 0 ? 'No products yet. Add your first product.' : 'No products match the current filter.'}
                </TableCell>
              </TableRow>
            ) : visible.map(p => (
              <TableRow key={p._id} hover selected={selected.includes(p._id)}>
                <TableCell padding="checkbox" sx={{ pl: 2 }}>
                  <Checkbox size="small" checked={selected.includes(p._id)}
                    onChange={() => setSelected(prev =>
                      prev.includes(p._id) ? prev.filter(i => i !== p._id) : [...prev, p._id]
                    )} />
                </TableCell>

                {/* Product */}
                <TableCell sx={{ py: 2 }}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400 font-medium shrink-0 overflow-hidden">
                      {p.images?.[0]?.url
                        ? <img src={p.images[0].url} alt={p.title || 'Product'} className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none'; }} />
                        : 'IMG'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 max-w-48 line-clamp-2 leading-snug">
                        {p.title || <span className="text-gray-300 italic">No title</span>}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{p.brand || <span className="text-gray-300">—</span>}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell sx={{ fontSize: '0.82rem', color: '#374151' }}>
                  {p.category || <span className="text-gray-300">—</span>}
                </TableCell>
                <TableCell sx={{ fontSize: '0.82rem', color: '#374151' }}>
                  {p.subCategory || <span className="text-gray-300">—</span>}
                </TableCell>

                {/* Price in INR */}
                <TableCell>
                  {(p.discount ?? 0) > 0 && (
                    <p className="text-xs line-through text-gray-400">{formatINR(p.price)}</p>
                  )}
                  <p className="text-sm font-semibold text-teal-600">
                    {formatINR(p.discountedPrice ?? p.price)}
                  </p>
                  {(p.discount ?? 0) > 0 && (
                    <span className="text-xs bg-green-50 text-green-600 px-1 rounded">{p.discount}% off</span>
                  )}
                </TableCell>

                <TableCell sx={{ fontSize: '0.82rem', color: '#374151' }}>
                  {p.stock != null ? (p.stock).toLocaleString('en-IN') : <span className="text-gray-300">—</span>}
                </TableCell>

                {/* Rating — stars filled based on average, count shown */}
                <TableCell>
                  {(p.rating?.count ?? 0) > 0 ? (
                    <div>
                      <Rating
                        value={p.rating.average ?? 0}
                        precision={0.5}
                        size="small"
                        readOnly
                        sx={{ color: '#f59e0b' }}
                      />
                      <p className="text-xs text-gray-400 mt-0.5">
                        {p.rating.average?.toFixed(1)} ({p.rating.count} reviews)
                      </p>
                    </div>
                  ) : (
                    <div>
                      <Rating value={0} precision={0.5} size="small" readOnly sx={{ color: '#d1d5db' }} />
                      <p className="text-xs text-gray-300 mt-0.5">No reviews</p>
                    </div>
                  )}
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <div className="flex items-center gap-0.5">
                    <Tooltip title="Edit">
                      <IconButton size="small" sx={{ color: '#6b7280', '&:hover': { color: '#14b8a6' } }}
                        onClick={() => router.push(`/admin/edit-product/${p._id}`)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="View">
                      <IconButton size="small" sx={{ color: '#6b7280', '&:hover': { color: '#3b82f6' } }}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" disabled={deletingId === p._id}
                        sx={{ color: '#ef4444', '&:hover': { bgcolor: '#fee2e2' } }}
                        onClick={() => handleDelete(p._id)}>
                        {deletingId === p._id
                          ? <CircularProgress size={14} sx={{ color: '#ef4444' }} />
                          : <DeleteIcon fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={(_, newPage) => { setPage(newPage); setSelected([]); }}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={e => { setRowsPerPage(parseInt(e.target.value)); setPage(0); setSelected([]); }}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
        sx={{ borderTop: '1px solid #f3f4f6' }}
      />
    </Paper>
  );
}