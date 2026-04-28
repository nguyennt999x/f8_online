import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { orders } from '../data/orders';
import TableContainer from '../components/TableContainer';

function OrdersDashboardPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [counter, setCounter] = useState(0);

  const filteredOrders = useMemo(() => {
    const startTime = startDate ? new Date(startDate).getTime() : null;
    const endTime = endDate ? new Date(endDate).getTime() : null;

    return orders.filter((order) => {
      const orderTime = new Date(order.orderDate).getTime();

      if (startTime !== null && orderTime < startTime) {
        return false;
      }

      if (endTime !== null && orderTime > endTime) {
        return false;
      }

      return true;
    });
  }, [startDate, endDate]);

  const completedRevenue = useMemo(() => {
    return filteredOrders.reduce((total, order) => {
      if (order.status !== 'Hoàn thành') {
        return total;
      }

      return total + order.totalAmount;
    }, 0);
  }, [filteredOrders]);

  return (
    <Box sx={{ backgroundColor: '#f4f6f8', minHeight: '100vh', py: 5 }}>
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              Orders Dashboard
            </Typography>
            <Typography color="text.secondary">
              Thống kê doanh thu và theo dõi danh sách đơn hàng với bộ lọc ngày.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                <Typography color="text.secondary" gutterBottom>
                  Tổng doanh thu đơn hoàn thành
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {completedRevenue.toLocaleString('vi-VN')} đ
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  sx={{ alignItems: { xs: 'stretch', sm: 'center' } }}
                >
                  <TextField
                    label="Từ ngày"
                    type="date"
                    value={startDate}
                    onChange={(event) => setStartDate(event.target.value)}
                    slotProps={{ inputLabel: { shrink: true } }}
                    fullWidth
                  />
                  <TextField
                    label="Đến ngày"
                    type="date"
                    value={endDate}
                    onChange={(event) => setEndDate(event.target.value)}
                    slotProps={{ inputLabel: { shrink: true } }}
                    fullWidth
                  />
                  <Button
                    variant="contained"
                    sx={{ minWidth: 160, alignSelf: { xs: 'stretch', sm: 'center' } }}
                    onClick={() => setCounter((value) => value + 1)}
                  >
                    Counter: {counter}
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1}
              sx={{ justifyContent: 'space-between', mb: 2 }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Danh sách đơn hàng
              </Typography>
              <Typography color="text.secondary">
                Hiển thị {filteredOrders.length} / {orders.length} đơn hàng
              </Typography>
            </Stack>

            <TableContainer orders={filteredOrders} />
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}

export default OrdersDashboardPage;
