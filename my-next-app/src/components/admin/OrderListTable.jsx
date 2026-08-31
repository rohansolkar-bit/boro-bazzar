'use client';
import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Checkbox, TextField, InputAdornment, Button, TablePagination,
  Tooltip, IconButton, Chip, Avatar, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReceiptIcon from '@mui/icons-material/Receipt';

const MOCK_ORDERS = [
  { id: 'ORD-1001', customer: 'Grajender Diliv', email: 'grajender@email.com', items: 3, total: 820, payment: 'Paid', status: 'Delivered', date: '2023-09-24', color: '#e91e63' },
  { id: 'ORD-1002', customer: 'Sufyan Malik', email: 'sufyan@email.com', items: 1, total: 245, payment: 'Paid', status: 'Shipped', date: '2023-09-23', color: '#4caf50' },
  { id: 'ORD-1003', customer: 'abdulal', email: 'abdulal@email.com', items: 5, total: 1480, payment: 'Pending', status: 'Processing', date: '2023-09-22', color: '#9e9e9e' },
  { id: 'ORD-1004', customer: 'Areeba', email: 'areeba@email.com', items: 2, total: 560, payment: 'Paid', status: 'Delivered', date: '2023-09-21', color: '#795548' },
  { id: 'ORD-1005', customer: 'rafial', email: 'rafial@email.com', items: 4, total: 1200, payment: 'Failed', status: 'Cancelled', date: '2023-09-20', color: '#607d8b' },
  { id: 'ORD-1006', customer: 'David', email: 'david@email.com', items: 7, total: 3400, payment: 'Paid', status: 'Shipped', date: '2023-09-19', color: '#3f51b5' },
  { id: 'ORD-1007', customer: 'tianasanal', email: 'tiana@email.com', items: 2, total: 430, payment: 'Pending', status: 'Processing', date: '2023-09-18', color: '#00bcd4' },
  { id: 'ORD-1008', customer: 'Priya Sharma', email: 'priya@email.com', items: 6, total: 2100, payment: 'Paid', status: 'Delivered', date: '2023-09-17', color: '#ff7043' },
  { id: 'ORD-1009', customer: 'Sufyan Malik', email: 'sufyan@email.com', items: 3, total: 890, payment: 'Paid', status: 'Delivered', date: '2023-09-16', color: '#4caf50' },
  { id: 'ORD-1010', customer: 'Grajender Diliv', email: 'grajender@email.com', items: 1, total: 199, payment: 'Pending', status: 'Processing', date: '2023-09-15', color: '#e91e63' },
];

const ORDER_STATUSES = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const PAYMENT_STATUSES = ['All', 'Paid', 'Pending', 'Failed'];

const headerSx = { fontSize: '0.72rem', fontWeight: 700, color: '#6b7280', py: 1.5, letterSpacing: '0.05em' };

const statusColors = {
  Delivered:   { bg: '#ecfdf5', color: '#059669' },
  Shipped:     { bg: '#eff6ff', color: '#2563eb' },
  Processing:  { bg: '#fff7ed', color: '#ea580c' },
  Cancelled:   { bg: '#fef2f2', color: '#dc2626' },
};

const paymentColors = {
  Paid:    { bg: '#ecfdf5', color: '#059669' },
  Pending: { bg: '#fefce8', color: '#ca8a04' },
  Failed:  { bg: '#fef2f2', color: '#dc2626' },
};

export default function OrderListTable() {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const filtered = orders.filter(o =>
    (statusFilter === 'All' || o.status === statusFilter) &&
    (paymentFilter === 'All' || o.payment === paymentFilter) &&
    (o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase()))
  );

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const allSelected = paginated.length > 0 && paginated.every(o => selected.includes(o.id));

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelected(prev => [...new Set([...prev, ...paginated.map(o => o.id)])]);
    else setSelected(prev => prev.filter(id => !paginated.map(o => o.id).includes(id)));
  };

  const handleDelete = (id) => {
    setOrders(prev => prev.filter(o => o.id !== id));
    setSelected(prev => prev.filter(i => i !== id));
  };

  // Summary counts
  const totalRevenue = orders.filter(o => o.payment === 'Paid').reduce((s, o) => s + o.total, 0);
  const pendingCount = orders.filter(o => o.status === 'Processing').length;
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length;

  return (
    <div className="space-y-4">
      {/* Summary chips row */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: 'Total Orders', value: orders.length, bg: '#eff6ff', color: '#2563eb' },
          { label: 'Revenue', value: `₹${totalRevenue.toLocaleString()}`, bg: '#ecfdf5', color: '#059669' },
          { label: 'Processing', value: pendingCount, bg: '#fff7ed', color: '#ea580c' },
          { label: 'Delivered', value: deliveredCount, bg: '#f0fdf4', color: '#16a34a' },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white">
            <span className="text-xs text-gray-500">{s.label}:</span>
            <span className="text-sm font-bold" style={{ color: s.color }}>{s.value}</span>
          </div>
        ))}
      </div>

      <Paper elevation={0} className="rounded-xl border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Orders</h2>
            <p className="text-xs text-gray-400 mt-0.5">{orders.length} total orders</p>
          </div>
          {selected.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={() => { setOrders(prev => prev.filter(o => !selected.includes(o.id))); setSelected([]); }}
              sx={{ textTransform: 'none', borderRadius: '8px' }}
            >
              Delete ({selected.length})
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 px-6 pb-4">
          <FormControl size="small" sx={{ minWidth: 155 }}>
            <InputLabel>Order Status</InputLabel>
            <Select value={statusFilter} label="Order Status" onChange={e => { setStatusFilter(e.target.value); setPage(0); }}>
              {ORDER_STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 155 }}>
            <InputLabel>Payment Status</InputLabel>
            <Select value={paymentFilter} label="Payment Status" onChange={e => { setPaymentFilter(e.target.value); setPage(0); }}>
              {PAYMENT_STATUSES.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField
            size="small"
            placeholder="Search by order ID or customer..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" sx={{ color: '#9ca3af' }} /></InputAdornment> }}
            sx={{ ml: 'auto', width: 260 }}
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
                {['ORDER ID', 'CUSTOMER', 'ITEMS', 'TOTAL', 'PAYMENT', 'ORDER STATUS', 'DATE', 'ACTION'].map(h => (
                  <TableCell key={h} sx={headerSx}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6, color: '#9ca3af' }}>No orders found</TableCell>
                </TableRow>
              ) : paginated.map(o => (
                <TableRow key={o.id} hover selected={selected.includes(o.id)}>
                  <TableCell padding="checkbox" sx={{ pl: 2 }}>
                    <Checkbox size="small" checked={selected.includes(o.id)}
                      onChange={() => setSelected(prev => prev.includes(o.id) ? prev.filter(i => i !== o.id) : [...prev, o.id])} />
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                        <ReceiptIcon sx={{ fontSize: 16, color: '#9ca3af' }} />
                      </div>
                      <span className="text-sm font-mono font-semibold text-teal-700">{o.id}</span>
                    </div>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <div className="flex items-center gap-3">
                      <Avatar sx={{ bgcolor: o.color, width: 34, height: 34, fontSize: '0.8rem' }}>
                        {o.customer[0].toUpperCase()}
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{o.customer}</p>
                        <p className="text-xs text-gray-400">{o.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">
                      {o.items}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-bold text-gray-800">₹{o.total.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={o.payment}
                      size="small"
                      sx={{
                        fontSize: '0.7rem', fontWeight: 600,
                        bgcolor: paymentColors[o.payment]?.bg,
                        color: paymentColors[o.payment]?.color,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={<LocalShippingIcon sx={{ fontSize: '14px !important' }} />}
                      label={o.status}
                      size="small"
                      sx={{
                        fontSize: '0.7rem', fontWeight: 600,
                        bgcolor: statusColors[o.status]?.bg,
                        color: statusColors[o.status]?.color,
                        '& .MuiChip-icon': { color: 'inherit' },
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.82rem', color: '#6b7280' }}>{o.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-0.5">
                      <Tooltip title="View Order">
                        <IconButton size="small" sx={{ color: '#6b7280', '&:hover': { color: '#3b82f6' } }}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Order">
                        <IconButton size="small" sx={{ color: '#ef4444', '&:hover': { bgcolor: '#fee2e2' } }}
                          onClick={() => handleDelete(o.id)}>
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
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} of ${count}`}
          sx={{ borderTop: '1px solid #f3f4f6' }}
        />
      </Paper>
    </div>
  );
}
