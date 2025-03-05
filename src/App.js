import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box
} from '@mui/material';

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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
            <TextField
              label="Quantity"
              type="number"
              value={formData.qty}
              onChange={(e) => handleInputChange('qty', e.target.value)}
              fullWidth
            />
            <TextField
              label="Price"
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              fullWidth
            />
            <TextField
              label="Discount %"
              type="number"
              value={formData.discountPercentage}
              onChange={(e) => handleInputChange('discountPercentage', e.target.value)}
              fullWidth
            />
            <TextField
              label="Discount"
              type="number"
              value={formData.discount}
              InputProps={{ readOnly: true }}
              fullWidth
            />
            <TextField
              label="Tax %"
              type="number"
              value={formData.taxPercentage}
              onChange={(e) => handleInputChange('taxPercentage', e.target.value)}
              fullWidth
            />
            <TextField
              label="Tax"
              type="number"
              value={formData.tax}
              InputProps={{ readOnly: true }}
              fullWidth
            />
            <TextField
              label="Total Price"
              type="number"
              value={formData.totalPrice}
              InputProps={{ readOnly: true }}
              fullWidth
            />
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            {editingId !== null ? 'Update Invoice' : 'Create Invoice'}
          </Button>
        </form>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Quantity</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Discount %</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Tax %</TableCell>
              <TableCell>Tax</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.qty}</TableCell>
                <TableCell>{invoice.price}</TableCell>
                <TableCell>{invoice.discountPercentage}</TableCell>
                <TableCell>{invoice.discount}</TableCell>
                <TableCell>{invoice.taxPercentage}</TableCell>
                <TableCell>{invoice.tax}</TableCell>
                <TableCell>{invoice.totalPrice}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleEdit(invoice)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default App;
