'use client';
import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Checkbox, Select, MenuItem, FormControl, InputLabel,
  TextField, InputAdornment, Button, Rating, TablePagination, Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Image from 'next/image';

const MOCK_PRODUCTS = [
  { id: 1, name: 'Surf Excel Matic Front Load Liquid Detergent 2 L', brand: 'Surf Excel', category: 'Groceries', subCategory: 'Detergent', price: 390, discountedPrice: 230, sales: 5, stock: 7488, rating: 4, image: null },
  { id: 2, name: 'Gaffco Gold Pro Healthy Lifestyle Nutritious Blend...', brand: 'Gaffco', category: 'Groceries', subCategory: 'Health', price: 320, discountedPrice: 245, sales: 2, stock: 14583, rating: 4, image: null },
  { id: 3, name: 'Good Life Refined Rice Bran Oil 1 L', brand: 'Good Life', category: 'Groceries', subCategory: 'Oil', price: 180, discountedPrice: 160, sales: 2, stock: 47852, rating: 2.5, image: null },
  { id: 4, name: "Lay's American Style Cream & Onion Potato Chips 26g...", brand: "Lay's", category: 'Groceries', subCategory: 'Snacks', price: 80, discountedPrice: 55, sales: 15, stock: 74852, rating: 4.5, image: null },
  { id: 5, name: 'Gemini Refined Sunflower Oil 1 L', brand: 'Gemini', category: 'Groceries', subCategory: 'Oil', price: 180, discountedPrice: 199, sales: 27, stock: 6778, rating: 4.5, image: null },
];

const CATEGORIES = ['All', 'Groceries', 'Electronics', 'Clothing', 'Beauty'];
const SUB_CATEGORIES = ['All', 'Detergent', 'Health', 'Oil', 'Snacks'];

export default function ProductsTable() {
  const [category, setCategory] = useState('All');
  const [subCategory, setSubCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const filtered = MOCK_PRODUCTS.filter(p =>
    (category === 'All' || p.category === category) &&
    (subCategory === 'All' || p.subCategory === subCategory) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelected(filtered.map(p => p.id));
    else setSelected([]);
  };

  const handleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <Paper elevation={0} className="rounded-xl border border-gray-200">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-800">Products</h2>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          sx={{ bgcolor: '#14b8a6', '&:hover': { bgcolor: '#0d9488' }, textTransform: 'none', borderRadius: '8px' }}
        >
          ADD PRODUCT
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 px-5 py-3 border-b border-gray-100">
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>Category By</InputLabel>
          <Select value={category} label="Category By" onChange={e => setCategory(e.target.value)}>
            {CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Sub Category By</InputLabel>
          <Select value={subCategory} label="Sub Category By" onChange={e => setSubCategory(e.target.value)}>
            {SUB_CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </Select>
        </FormControl>
        <TextField
          size="small"
          placeholder="Search here..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
          sx={{ ml: 'auto', width: 200 }}
        />
      </div>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f9fafb' }}>
              <TableCell padding="checkbox">
                <Checkbox
                  size="small"
                  checked={selected.length === filtered.length && filtered.length > 0}
                  onChange={handleSelectAll}
                />
              </TableCell>
              {['PRODUCT', 'CATEGORY', 'SUB CATEGORY', 'PRICE', 'SALES', 'STOCK', 'RATING', 'ACTION'].map(h => (
                <TableCell key={h} sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#6b7280', py: 1.5 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(product => (
              <TableRow key={product.id} hover selected={selected.includes(product.id)}>
                <TableCell padding="checkbox">
                  <Checkbox size="small" checked={selected.includes(product.id)} onChange={() => handleSelect(product.id)} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center shrink-0 text-xs text-gray-400">IMG</div>
                    <div>
                      <p className="text-xs font-medium text-gray-800 line-clamp-2 max-w-37.5">{product.name}</p>
                      <p className="text-xs text-gray-400">{product.brand}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{product.category}</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{product.subCategory}</TableCell>
                <TableCell>
                  <div>
                    <p className="text-xs line-through text-gray-400">₹{product.price}.00</p>
                    <p className="text-xs font-semibold text-teal-600">₹{product.discountedPrice}.99</p>
                  </div>
                </TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{product.sales} sale</TableCell>
                <TableCell sx={{ fontSize: '0.75rem' }}>{product.stock.toLocaleString()}</TableCell>
                <TableCell>
                  <Rating value={product.rating} precision={0.5} size="small" readOnly />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <button className="p-1 rounded hover:bg-gray-100 text-gray-500"><EditIcon fontSize="small" /></button>
                    <button className="p-1 rounded hover:bg-gray-100 text-gray-500"><VisibilityIcon fontSize="small" /></button>
                    <button className="p-1 rounded hover:bg-red-50 text-red-400"><DeleteIcon fontSize="small" /></button>
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
        rowsPerPageOptions={[5, 10, 25, 50]}
        sx={{ borderTop: '1px solid #f3f4f6' }}
      />
    </Paper>
  );
}
