import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Typography,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  Grid,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#4791db',
      dark: '#115293',
    },
    secondary: {
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162',
    },
    background: {
      default: '#f5f5f7',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '10px 20px',
          boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.2s',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&.Mui-focused fieldset': {
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 10px 30px 0 rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          backgroundColor: '#f5f5f7',
        },
      },
    },
  },
});

// Styled components
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  transition: 'background-color 0.2s',
  '&:hover': {
    backgroundColor: 'rgba(25, 118, 210, 0.08)',
  },
}));

function App() {
  // State for form data
  const [formData, setFormData] = useState({
    qty: '',
    price: '',
    discountPercentage: '',
    discount: '',
    taxPercentage: '',
    tax: '',
    totalPrice: ''
  });

  // State for invoice list
  const [invoices, setInvoices] = useState([]);

  // State for tracking which invoice is being edited
  const [editingId, setEditingId] = useState(null);

  const calculateValues = (newData) => {
    const qty = parseFloat(newData.qty) || 0;
    const price = parseFloat(newData.price) || 0;
    const discountPercentage = parseFloat(newData.discountPercentage) || 0;
    const taxPercentage = parseFloat(newData.taxPercentage) || 0;

    const subtotal = qty * price;
    const discount = (subtotal * discountPercentage) / 100;
    const afterDiscount = subtotal - discount;
    const tax = (afterDiscount * taxPercentage) / 100;
    const totalPrice = afterDiscount + tax;

    return {
      ...newData,
      discount: discount.toFixed(2),
      tax: tax.toFixed(2),
      totalPrice: totalPrice.toFixed(2)
    };
  };

  const handleInputChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(calculateValues(newData));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId !== null) {
      setInvoices(invoices.map(invoice =>
        invoice.id === editingId ? { ...formData, id: editingId } : invoice
      ));
      setEditingId(null);
    } else {
      setInvoices([...invoices, { ...formData, id: Date.now() }]);
    }
    setFormData({
      qty: '',
      price: '',
      discountPercentage: '',
      discount: '',
      taxPercentage: '',
      tax: '',
      totalPrice: ''
    });
  };

  const handleEdit = (invoice) => {
    setFormData(invoice);
    setEditingId(invoice.id);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh', pb: 6 }}>
        <AppBar position="static" elevation={0} sx={{ mb: 4, bgcolor: 'white', color: 'primary.main' }}>
          <Toolbar>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              Invoice Generator
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Container maxWidth="lg">
          <Card elevation={3} sx={{ mb: 5, overflow: 'hidden' }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
                <Typography variant="h6" gutterBottom>
                  Create New Invoice
                </Typography>
                <Typography variant="body2">
                  Fill in the details below to generate a new invoice entry
                </Typography>
              </Box>
              
              <Box sx={{ p: 3 }}>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={3}>
                      <TextField
                        label="Quantity"
                        type="number"
                        value={formData.qty}
                        onChange={(e) => handleInputChange('qty', e.target.value)}
                        fullWidth
                        variant="outlined"
                        InputProps={{ inputProps: { min: 0 } }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                      <TextField
                        label="Price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        fullWidth
                        variant="outlined"
                        InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                      <TextField
                        label="Discount %"
                        type="number"
                        value={formData.discountPercentage}
                        onChange={(e) => handleInputChange('discountPercentage', e.target.value)}
                        fullWidth
                        variant="outlined"
                        InputProps={{ inputProps: { min: 0, max: 100 } }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                      <TextField
                        label="Discount"
                        type="number"
                        value={formData.discount}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        variant="outlined"
                        sx={{ bgcolor: 'rgba(0, 0, 0, 0.02)' }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <TextField
                        label="Tax %"
                        type="number"
                        value={formData.taxPercentage}
                        onChange={(e) => handleInputChange('taxPercentage', e.target.value)}
                        fullWidth
                        variant="outlined"
                        InputProps={{ inputProps: { min: 0, max: 100 } }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <TextField
                        label="Tax"
                        type="number"
                        value={formData.tax}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        variant="outlined"
                        sx={{ bgcolor: 'rgba(0, 0, 0, 0.02)' }}
                      />
                    </Grid>
                    <Grid item xs={12} md={12} lg={4}>
                      <TextField
                        label="Total Price"
                        type="number"
                        value={formData.totalPrice}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        variant="outlined"
                        sx={{ bgcolor: 'rgba(0, 0, 0, 0.02)' }}
                      />
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                    >
                      {editingId !== null ? 'Update Invoice' : 'Create Invoice'}
                    </Button>
                  </Box>
                </form>
              </Box>
            </CardContent>
          </Card>

          <Card elevation={3}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
                <Typography variant="h6">
                  Invoice Records
                </Typography>
                <Typography variant="body2">
                  Manage your existing invoice entries
                </Typography>
              </Box>
              
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Discount %</TableCell>
                      <TableCell>Discount</TableCell>
                      <TableCell>Tax %</TableCell>
                      <TableCell>Tax</TableCell>
                      <TableCell>Total Price</TableCell>
                      <TableCell align="center">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoices.length > 0 ? (
                      invoices.map((invoice) => (
                        <StyledTableRow key={invoice.id}>
                          <TableCell>{invoice.qty}</TableCell>
                          <TableCell>{invoice.price}</TableCell>
                          <TableCell>{invoice.discountPercentage}</TableCell>
                          <TableCell>{invoice.discount}</TableCell>
                          <TableCell>{invoice.taxPercentage}</TableCell>
                          <TableCell>{invoice.tax}</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>{invoice.totalPrice}</TableCell>
                          <TableCell align="center">
                            <Button
                              variant="outlined"
                              size="small"
                              color="primary"
                              onClick={() => handleEdit(invoice)}
                              sx={{ minWidth: '80px' }}
                            >
                              Edit
                            </Button>
                          </TableCell>
                        </StyledTableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                          <Typography variant="body1" color="text.secondary">
                            No invoices created yet. Use the form above to create your first invoice.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
