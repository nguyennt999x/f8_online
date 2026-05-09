import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const routes = [
  {
    title: 'Ôn thi GPLX',
    description: 'Làm đề thi ngẫu nhiên với timer và trạng thái trả lời.',
    path: '/gplx-exam',
  },
  {
    title: 'Orders Dashboard',
    description: 'Xem thống kê và danh sách đơn hàng.',
    path: '/orders-dashboard',
  },
  {
    title: 'Products',
    description: 'Quản lý sản phẩm sau khi đăng nhập.',
    path: '/products',
  },
];

function HomePage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: '#f6f8fb',
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={4} sx={{ textAlign: 'center' }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#182334' }}>
              Màn hình chính
            </Typography>
            <Typography sx={{ mt: 1, color: '#667085' }}>
              Chọn một mục bên dưới để chuyển tới page tương ứng.
            </Typography>
          </Box>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ justifyContent: 'center', alignItems: 'stretch' }}
          >
            {routes.map((route) => (
              <Button
                key={route.path}
                component={RouterLink}
                to={route.path}
                variant="contained"
                sx={{
                  width: { xs: '100%', sm: 210 },
                  minHeight: 116,
                  borderRadius: 2,
                  backgroundColor: '#2563eb',
                  boxShadow: '0 14px 30px rgba(37, 99, 235, 0.2)',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#1d4ed8',
                  },
                }}
              >
                <Stack spacing={0.75}>
                  <Typography sx={{ fontWeight: 800 }}>{route.title}</Typography>
                  <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.78)' }}>
                    {route.description}
                  </Typography>
                </Stack>
              </Button>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

export default HomePage;
