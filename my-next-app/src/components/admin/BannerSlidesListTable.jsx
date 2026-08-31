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
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useRouter } from 'next/navigation';

const MOCK_SLIDES = [
  { id: 1, title: 'Summer Sale — Up to 50% Off', subtitle: 'Shop fresh produce & daily essentials', buttonText: 'Shop Now', buttonLink: '/category/groceries', type: 'Home Banner', order: 1, isActive: true, bgColor: '#14b8a6' },
  { id: 2, title: 'Weekend Special Offers', subtitle: 'Exclusive deals every Saturday & Sunday', buttonText: 'Explore', buttonLink: '/offers', type: 'Promotional', order: 2, isActive: true, bgColor: '#3b82f6' },
  { id: 3, title: 'New Arrivals — Electronics', subtitle: 'Latest gadgets at best prices', buttonText: 'View All', buttonLink: '/category/electronics', type: 'Category Highlight', order: 3, isActive: false, bgColor: '#8b5cf6' },
  { id: 4, title: 'Flash Sale — Today Only!', subtitle: 'Grab the best deals before they run out', buttonText: 'Buy Now', buttonLink: '/flash-sale', type: 'Sale', order: 4, isActive: true, bgColor: '#ef4444' },
  { id: 5, title: 'Festive Season Specials', subtitle: 'Celebrate with exclusive discounts', buttonText: 'Discover', buttonLink: '/festive', type: 'Promotional', order: 5, isActive: false, bgColor: '#f59e0b' },
];

const SLIDE_TYPES = ['All', 'Home Banner', 'Promotional', 'Category Highlight', 'Sale'];
const headerSx = { fontSize: '0.72rem', fontWeight: 700, color: '#6b7280', py: 1.5, letterSpacing: '0.05em' };

export default function BannerSlidesListTable() {
  const router = useRouter();
  const [slides, setSlides] = useState(MOCK_SLIDES);
  const [typeFilter, setTypeFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const filtered = slides.filter(s =>
    (typeFilter === 'All' || s.type === typeFilter) &&
    s.title.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const allSelected = paginated.length > 0 && paginated.every(s => selected.includes(s.id));

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelected(prev => [...new Set([...prev, ...paginated.map(s => s.id)])]);
    else setSelected(prev => prev.filter(id => !paginated.map(s => s.id).includes(id)));
  };

  const toggleActive = (id) => {
    setSlides(prev => prev.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
  };

  const handleDelete = (id) => {
    setSlides(prev => prev.filter(s => s.id !== id));
    setSelected(prev => prev.filter(i => i !== id));
  };

  return (
    <Paper elevation={0} className="rounded-xl border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">Banner Slides</h2>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/admin/add-banner-slides')}
          sx={{ bgcolor: '#14b8a6', '&:hover': { bgcolor: '#0d9488' }, textTransform: 'none', borderRadius: '8px', fontWeight: 600, px: 2.5 }}
        >
          ADD SLIDE
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 px-6 pb-4">
        <FormControl size="small" sx={{ minWidth: 170 }}>
          <InputLabel>Filter by Type</InputLabel>
          <Select value={typeFilter} label="Filter by Type" onChange={e => { setTypeFilter(e.target.value); setPage(0); }}>
            {SLIDE_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </Select>
        </FormControl>
        <TextField
          size="small"
          placeholder="Search slides..."
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
              {['SLIDE', 'BUTTON', 'TYPE', 'ORDER', 'STATUS', 'ACTION'].map(h => (
                <TableCell key={h} sx={headerSx}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6, color: '#9ca3af' }}>No slides found</TableCell>
              </TableRow>
            ) : paginated.map((s, idx) => (
              <TableRow key={s.id} hover selected={selected.includes(s.id)}>
                <TableCell padding="checkbox" sx={{ pl: 2 }}>
                  <Checkbox size="small" checked={selected.includes(s.id)}
                    onChange={() => setSelected(prev => prev.includes(s.id) ? prev.filter(i => i !== s.id) : [...prev, s.id])} />
                </TableCell>
                <TableCell sx={{ py: 2 }}>
                  <div className="flex items-center gap-3">
                    {/* Color preview */}
                    <div className="w-14 h-10 rounded-lg flex items-center justify-center shrink-0 text-white text-xs font-bold" style={{ backgroundColor: s.bgColor }}>
                      BG
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 max-w-[220px] line-clamp-1">{s.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5 max-w-[220px] line-clamp-1">{s.subtitle}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm font-medium text-teal-600">{s.buttonText}</p>
                    <p className="text-xs text-gray-400 max-w-[140px] truncate">{s.buttonLink}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Chip label={s.type} size="small" sx={{ fontSize: '0.72rem', fontWeight: 600,
                    bgcolor: s.type === 'Home Banner' ? '#ecfdf5' : s.type === 'Sale' ? '#fef2f2' : s.type === 'Promotional' ? '#eff6ff' : '#f5f3ff',
                    color: s.type === 'Home Banner' ? '#059669' : s.type === 'Sale' ? '#dc2626' : s.type === 'Promotional' ? '#2563eb' : '#7c3aed',
                  }} />
                </TableCell>
                <TableCell sx={{ fontSize: '0.82rem', color: '#374151', fontWeight: 600 }}>#{s.order}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Switch
                      size="small"
                      checked={s.isActive}
                      onChange={() => toggleActive(s.id)}
                      sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#14b8a6' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#14b8a6' } }}
                    />
                    <span className={`text-xs font-medium ${s.isActive ? 'text-teal-600' : 'text-gray-400'}`}>
                      {s.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-0.5">
                    <Tooltip title="Edit">
                      <IconButton size="small" sx={{ color: '#6b7280', '&:hover': { color: '#14b8a6' } }}
                        onClick={() => router.push(`/admin/edit-banner-slide/${s.id}`)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Preview">
                      <IconButton size="small" sx={{ color: '#6b7280', '&:hover': { color: '#3b82f6' } }}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" sx={{ color: '#ef4444', '&:hover': { bgcolor: '#fee2e2' } }}
                        onClick={() => handleDelete(s.id)}>
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
