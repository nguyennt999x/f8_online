import { memo } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer as MuiTableContainer,
  Typography,
} from '@mui/material';
import OrderRow from './OrderRow';
import { Order } from '../types/order';

interface TableContainerProps {
  orders: Order[];
}

function TableContainer({ orders }: TableContainerProps) {
  return (
    <MuiTableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Mã đơn</TableCell>
            <TableCell>Khách hàng</TableCell>
            <TableCell>Sản phẩm</TableCell>
            <TableCell>Ngày đặt</TableCell>
            <TableCell align="right">Giá trị</TableCell>
            <TableCell>Trạng thái</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.length > 0 ? (
            orders.map((order) => <OrderRow key={order.id} order={order} />)
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <Typography color="text.secondary" sx={{ py: 2 }}>
                  Không có đơn hàng trong khoảng thời gian đã chọn.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </MuiTableContainer>
  );
}

export default memo(TableContainer);
