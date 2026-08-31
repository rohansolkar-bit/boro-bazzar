'use client';
import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Checkbox, TextField, InputAdornment, Button, Avatar,
  TablePagination, Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';

const MOCK_USERS = [
  { id: 1, name: 'Grajender Diliv 2', email: '••••••••••', phone: '••••••••••', created: '2023-09-24', avatar: null, color: '#e91e63' },
  { id: 2, name: 'Sufyan Malik', email: '••••••••••', phone: '••••••••••', created: '2023-09-24', avatar: 'S', color: '#4caf50' },
  { id: 3, name: 'abdulal', email: '••••••••••', phone: '••••••••••', created: '2023-09-24', avatar: null, color: '#9e9e9e' },
  { id: 4, name: 'Areeba', email: '••••••••••', phone: '••••••••••', created: '2023-09-24', avatar: null, color: '#795548' },
  { id: 5, name: 'rafial', email: '••••••••••', phone: '••••••••••', created: '2023-09-24', avatar: null, color: '#607d8b' },
  { id: 6, name: 'David', email: '••••••••••', phone: '••••••••••', created: '2023-09-24', avatar: 'D', color: '#3f51b5' },
  { id: 7, name: 'tianasanal', email: '••••••••••', phone: '••••••••••', created: '2023-09-24', avatar: null, color: '#00bcd4' },
];

export default function UsersTable() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const filtered = MOCK_USERS.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelected(filtered.map(u => u.id));
    else setSelected([]);
  };

  const handleDelete = (id) => {
    // In real app: call API to delete user
    console.log('Delete user', id);
  };

  return (
    <Paper elevation={0} className="rounded-xl border border-gray-200">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-800">Users List</h2>
        <TextField
          size="small"
          placeholder="Search here..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
          sx={{ width: 200 }}
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
              {['USER', 'USER PHONE NO', 'CREATED', 'ACTION'].map(h => (
                <TableCell key={h} sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#6b7280', py: 1.5 }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(user => (
              <TableRow key={user.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox size="small" checked={selected.includes(user.id)} onChange={() =>
                    setSelected(prev => prev.includes(user.id) ? prev.filter(i => i !== user.id) : [...prev, user.id])
                  } />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar sx={{ bgcolor: user.color, width: 36, height: 36, fontSize: '0.85rem' }}>
                      {user.avatar || user.name[0]}
                    </Avatar>
                    <div>
                      <p className="text-xs font-medium text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-gray-500">
                    <PhoneIcon sx={{ fontSize: 14 }} />
                    <span className="text-xs">{user.phone}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-gray-500">
                    <CalendarTodayIcon sx={{ fontSize: 14 }} />
                    <span className="text-xs">{user.created}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteOutlineIcon />}
                    onClick={() => handleDelete(user.id)}
                    sx={{ textTransform: 'none', borderRadius: '8px', fontSize: '0.75rem', py: 0.5 }}
                  >
                    DELETE
                  </Button>
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
        rowsPerPageOptions={[10, 25, 50]}
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} of ${count}`}
        sx={{ borderTop: '1px solid #f3f4f6' }}
      />
    </Paper>
  );
}
