import { ChangeEvent, FormEvent, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { Location, useLocation, useNavigate } from 'react-router-dom';
import { AuthCredentials } from '../interface';
import { signIn } from '../plugins/api';
import { getErrorMessage } from '../utils/api';

interface LocationState {
    from?: Location;
}

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState<AuthCredentials>({
        email: 'sonnv@test.com',
        password: '12345678',
    });

    const redirectTo = (location.state as LocationState | null)?.from?.pathname || '/products';

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            setLoading(true);
            setError('');
            await signIn(formData);
            navigate(redirectTo, { replace: true });
        } catch (submitError) {
            setError(getErrorMessage(submitError, 'Dang nhap that bai. Vui long thu lai.'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                py: 4,
            }}
        >
            <Container maxWidth="sm">
                <Card
                    elevation={0}
                    sx={{
                        borderRadius: 4,
                        border: '1px solid rgba(18, 48, 71, 0.08)',
                        boxShadow: '0 24px 60px rgba(15, 23, 42, 0.12)',
                    }}
                >
                    <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
                        <Stack spacing={3}>
                            <Box>
                                <Typography variant="overline" sx={{ letterSpacing: '0.12em' }}>
                                   Admin
                                </Typography>
                            </Box>

                            {error ? <Alert severity="error">{error}</Alert> : null}

                            <Box component="form" onSubmit={handleSubmit}>
                                <Stack spacing={2.5}>
                                    <TextField
                                        required
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                    <TextField
                                        required
                                        label="Password"
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                    <Button type="submit" variant="contained" size="large" disabled={loading}>
                                        {loading ? 'Signing in...' : 'Login'}
                                    </Button>
                                </Stack>
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default LoginPage;
