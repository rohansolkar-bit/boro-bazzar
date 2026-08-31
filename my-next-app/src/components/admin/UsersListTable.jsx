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
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EmailIcon from '@mui/icons-material/Email';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const MOCK_USERS = [
  { id: 1, name: 'Grajender Diliv', email: 'grajender@email.com', phone: '+91 98765 43210', role: 'Customer', orders: 12, spent: 4820, joined: '2023-09-24', isActive: true, color: '#e91e63' },
  { id: 2, name: 'Sufyan Malik', email: 'sufyan@email.com', phone: '+91 87654 32109', role: 'Customer', orders: 5, spent: 1250, joined: '2023-09-24', isActive: true, color: '#4caf50' },
  { id: 3, name: 'abdulal', email: 'abdulal@email.com', phone: '+91 76543 21098', role: 'Customer', orders: 2, spent: 440, joined: '2023-09-24', isActive: false, color: '#9e9e9e' },
  { id: 4, name: 'Areeba', email: 'areeba@email.com', phone: '+91 65432 10987', role: 'Admin', orders: 0, spent: 0, joined: '2023-09-24', isActive: true, color: '#795548' },
  { id: 5, name: 'rafial', email: 'rafial@email.com', phone: '+91 54321 09876', role: 'Customer', orders: 8, spent: 3100, joined: '2023-09-24', isActive: true, color: '#607d8b' },
  { id: 6, name: 'David', email: 'david@email.com', phone: '+91 43210 98765', role: 'Customer', orders: 21, spent: 9800, joined: '2023-09-24', isActive: true, color: '#3f51b5' },
  { id: 7, name: 'tianasanal', email: 'tiana@email.com', phone: '+91 32109 87654', role: 'Customer', orders: 3, spent: 650, joined: '2023-09-24', isActive: false, color: '#00bcd4' },
  { id: 8, name: 'Priya Sharma', email: 'priya@email.com', phone: '+91 21098 76543', role: 'Customer', orders: 16, spent: 6200, joined: '2023-10-01', isActive: true, color: '#ff7043' },
];

const ROLES = ['All', 'Customer', 'Admin'];
const STATUS = ['All', 'Active', 'Inactive'];
const headerSx = { fontSize: '0.72rem', fontWeight: 700, color: '#6b7280', py: 1.5, letterSpacing: '0.05em' };

export default function UsersListTable() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const filtered = users.filter(u =>
    (roleFilter === 'All' || u.role === roleFilter) &&
    (statusFilter === 'All' || (statusFilter === 'Active' ? u.isActive : !u.isActive)) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const allSelected = paginated.length > 0 && paginated.every(u => selected.includes(u.id));

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelected(prev => [...new Set([...prev, ...paginated.map(u => u.id)])]);
    else setSelected(prev => prev.filter(id => !paginated.map(u => u.id).includes(id)));
  };

  const handleDelete = (id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    setSelected(prev => prev.filter(i => i !== id));
  };

  const toggleStatus = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));
  };

  return (
    <Paper elevation={0} className="rounded-xl border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Users List</h2>
          <p className="text-xs text-gray-400 mt-0.5">{users.length} total users</p>
        </div>
        <div className="flex items-center gap-2">
          {selected.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={() => { setUsers(prev => prev.filter(u => !selected.includes(u.id))); setSelected([]); }}
              sx={{ textTransform: 'none', borderRadius: '8px' }}
            >
              Delete ({selected.length})
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 px-6 pb-4">
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>Role</InputLabel>
          <Select value={roleFilter} label="Role" onChange={e => { setRoleFilter(e.target.value); setPage(0); }}>
            {ROLES.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>Status</InputLabel>
          <Select value={statusFilter} label="Status" onChange={e => { setStatusFilter(e.target.value); setPage(0); }}>
            {STATUS.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </Select>
        </FormControl>
        <TextField
          size="small"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(0); }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" sx={{ color: '#9ca3af' }} /></InputAdornment> }}
          sx={{ ml: 'auto', width: 240 }}
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
              {['USER', 'USER PHONE NO', 'ROLE', 'ORDERS', 'TOTAL SPENT', 'CREATED', 'STATUS', 'ACTION'].map(h => (
                <TableCell key={h} sx={headerSx}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 6, color: '#9ca3af' }}>No users found</TableCell>
              </TableRow>
            ) : paginated.map(u => (
              <TableRow key={u.id} hover selected={selected.includes(u.id)}>
                <TableCell padding="checkbox" sx={{ pl: 2 }}>
                  <Checkbox size="small" checked={selected.includes(u.id)}
                    onChange={() => setSelected(prev => prev.includes(u.id) ? prev.filter(i => i !== u.id) : [...prev, u.id])} />
                </TableCell>
                <TableCell sx={{ py: 2 }}>
                  <div className="flex items-center gap-3">
                    <Avatar sx={{ bgcolor: u.color, width: 38, height: 38, fontSize: '0.9rem' }}>
                      {u.name[0].toUpperCase()}
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{u.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <EmailIcon sx={{ fontSize: 11, color: '#9ca3af' }} />
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <PhoneIcon sx={{ fontSize: 14 }} />
                    <span className="text-sm">{u.phone}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Chip
                    label={u.role}
                    size="small"
                    sx={{
                      fontSize: '0.7rem', fontWeight: 600,
                      bgcolor: u.role === 'Admin' ? '#eff6ff' : '#f0fdf4',
                      color: u.role === 'Admin' ? '#2563eb' : '#16a34a',
                    }}
                  />
                </TableCell>
                <TableCell sx={{ fontSize: '0.82rem', color: '#374151', fontWeight: 500 }}>
                  {u.orders}
                </TableCell>
                <TableCell sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#14b8a6' }}>
                  ₹{u.spent.toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-gray-500">
                    <CalendarTodayIcon sx={{ fontSize: 13 }} />
                    <span className="text-xs">{u.joined}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Chip
                    icon={u.isActive ? <CheckCircleIcon sx={{ fontSize: '14px !important' }} /> : <BlockIcon sx={{ fontSize: '14px !important' }} />}
                    label={u.isActive ? 'Active' : 'Inactive'}
                    size="small"
                    sx={{
                      fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer',
                      bgcolor: u.isActive ? '#ecfdf5' : '#fef2f2',
                      color: u.isActive ? '#059669' : '#dc2626',
                      '& .MuiChip-icon': { color: 'inherit' },
                    }}
                    onClick={() => toggleStatus(u.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-0.5">
                    <Tooltip title="View Profile">
                      <IconButton size="small" sx={{ color: '#6b7280', '&:hover': { color: '#3b82f6' } }}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete User">
                      <IconButton size="small" sx={{ color: '#ef4444', '&:hover': { bgcolor: '#fee2e2' } }}
                        onClick={() => handleDelete(u.id)}>
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
  );
}
