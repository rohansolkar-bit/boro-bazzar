'use client';
import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Checkbox, TextField, InputAdornment, Button, TablePagination,
  Tooltip, IconButton, Chip, Switch, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';

const MOCK_CATEGORIES = [
  { id: 1, name: 'Groceries', slug: 'groceries', icon: '🛒', parent: '—', products: 124, order: 1, isActive: true },
  { id: 2, name: 'Fruits & Vegetables', slug: 'fruits-vegetables', icon: '🍎', parent: 'Groceries', products: 48, order: 2, isActive: true },
  { id: 3, name: 'Meats & Seafood', slug: 'meats-seafood', icon: '🥩', parent: 'Groceries', products: 36, order: 3, isActive: true },
  { id: 4, name: 'Breads & Bakery', slug: 'breads-bakery', icon: '🍞', parent: 'Groceries', products: 22, order: 4, isActive: true },
  { id: 5, name: 'Electronics', slug: 'electronics', icon: '📱', parent: '—', products: 87, order: 5, isActive: true },
  { id: 6, name: 'Clothing', slug: 'clothing', icon: '👕', parent: '—', products: 63, order: 6, isActive: false },
  { id: 7, name: 'Beauty', slug: 'beauty', icon: '💄', parent: '—', products: 45, order: 7, isActive: true },
  { id: 8, name: 'Home & Garden', slug: 'home-garden', icon: '🏠', parent: '—', products: 31, order: 8, isActive: false },
];

const PARENT_FILTER = ['All', 'Top Level', 'Groceries', 'Electronics', 'Clothing'];
const headerSx = { fontSize: '0.72rem', fontWeight: 700, color: '#6b7280', py: 1.5, letterSpacing: '0.05em' };

export default function CategoriesListTable() {
  const router = useRouter();
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [parentFilter, setParentFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const filtered = categories.filter(c =>
    (parentFilter === 'All' || (parentFilter === 'Top Level' ? c.parent === '—' : c.parent === parentFilter)) &&
    c.name.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const allSelected = paginated.length > 0 && paginated.every(c => selected.includes(c.id));

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelected(prev => [...new Set([...prev, ...paginated.map(c => c.id)])]);
    else setSelected(prev => prev.filter(id => !paginated.map(c => c.id).includes(id)));
  };

  const toggleActive = (id) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
  };

  const handleDelete = (id) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    setSelected(prev => prev.filter(i => i !== id));
  };

  return (
    <Paper elevation={0} className="rounded-xl border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/admin/add-categories')}
          sx={{ bgcolor: '#14b8a6', '&:hover': { bgcolor: '#0d9488' }, textTransform: 'none', borderRadius: '8px', fontWeight: 600, px: 2.5 }}
        >
          ADD CATEGORY
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 px-6 pb-4">
        <FormControl size="small" sx={{ minWidth: 170 }}>
          <InputLabel>Filter by Parent</InputLabel>
          <Select value={parentFilter} label="Filter by Parent" onChange={e => { setParentFilter(e.target.value); setPage(0); }}>
            {PARENT_FILTER.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
          </Select>
        </FormControl>
        <TextField
          size="small"
          placeholder="Search categories..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(0); }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" sx={{ color: '#9ca3af' }} /></InputAdornment> }}
          sx={{ ml: 'auto', width: 220 }}
        />
      </div>

      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f9fafb', borderTop: '1px solid #f3f4f6' }}>
              <TableCell padding="checkbox" sx={{ pl: 2 }}>
                <Checkbox size="small" checked={allSelected} onChange={handleSelectAll} />
              </TableCell>
              {['CATEGORY', 'SLUG', 'PARENT', 'PRODUCTS', 'ORDER', 'STATUS', 'ACTION'].map(h => (
                <TableCell key={h} sx={headerSx}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6, color: '#9ca3af' }}>No categories found</TableCell>
              </TableRow>
            ) : paginated.map(c => (
              <TableRow key={c.id} hover selected={selected.includes(c.id)}>
                <TableCell padding="checkbox" sx={{ pl: 2 }}>
                  <Checkbox size="small" checked={selected.includes(c.id)}
                    onChange={() => setSelected(prev => prev.includes(c.id) ? prev.filter(i => i !== c.id) : [...prev, c.id])} />
                </TableCell>
                <TableCell sx={{ py: 2 }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center text-xl shrink-0">
                      {c.icon}
                    </div>
                    <p className="text-sm font-medium text-gray-800">{c.name}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <code className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">{c.slug}</code>
                </TableCell>
                <TableCell>
                  {c.parent === '—'
                    ? <Chip label="Top Level" size="small" sx={{ fontSize: '0.7rem', bgcolor: '#f0fdf4', color: '#16a34a', fontWeight: 600 }} />
                    : <span className="text-sm text-gray-600">{c.parent}</span>
                  }
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">
                    {c.products}
                  </span>
                </TableCell>
                <TableCell sx={{ fontSize: '0.82rem', color: '#374151', fontWeight: 600 }}>#{c.order}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Switch
                      size="small"
                      checked={c.isActive}
                      onChange={() => toggleActive(c.id)}
                      sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#14b8a6' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#14b8a6' } }}
                    />
                    <span className={`text-xs font-medium ${c.isActive ? 'text-teal-600' : 'text-gray-400'}`}>
                      {c.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-0.5">
                    <Tooltip title="Edit">
                      <IconButton size="small" sx={{ color: '#6b7280', '&:hover': { color: '#14b8a6' } }}
                        onClick={() => router.push(`/admin/edit-category/${c.id}`)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="View">
                      <IconButton size="small" sx={{ color: '#6b7280', '&:hover': { color: '#3b82f6' } }}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" sx={{ color: '#ef4444', '&:hover': { bgcolor: '#fee2e2' } }}
                        onClick={() => handleDelete(c.id)}>
                        <DeleteIcon fontSize="small" />
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
        count={filtered.length}
        page={page}
        onPageChange={(_, p) => setPage(p)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={e => { setRowsPerPage(parseInt(e.target.value)); setPage(0); }}
        rowsPerPageOptions={[5, 10, 25]}
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} of ${count}`}
        sx={{ borderTop: '1px solid #f3f4f6' }}
      />
    </Paper>
  );
}
