import { memo } from 'react';
import { Chip, TableCell, TableRow } from '@mui/material';
import { Order } from '../types/order';

interface OrderRowProps {
  order: Order;
}

const statusColorMap: Record<Order['status'], 'success' | 'warning' | 'error' | 'default'> = {
  'Hoàn thành': 'success',
  'Đang xử lý': 'warning',
  'Đã hủy': 'error',
  'Chờ xác nhận': 'default',
};

function OrderRow({ order }: OrderRowProps) {
  return (
    <TableRow hover>
      <TableCell>{order.id}</TableCell>
      <TableCell>{order.customerName}</TableCell>
      <TableCell>{order.productName}</TableCell>
      <TableCell>{order.orderDate}</TableCell>
      <TableCell align="right">{order.totalAmount.toLocaleString('vi-VN')} đ</TableCell>
      <TableCell>
        <Chip color={statusColorMap[order.status]} label={order.status} size="small" />
      </TableCell>
    </TableRow>
  );
}

export default memo(OrderRow);
