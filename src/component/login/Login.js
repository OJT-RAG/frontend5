import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n/i18n.jsx';
import './Login.scss';
import userApi from '../API/UserAPI.js';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    const [appConfig, setAppConfig] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { t } = useI18n();

    // ================= LOAD CONFIG =================
    useEffect(() => {
        fetch('/app-config.json', { cache: 'no-store' })
            .then(res => res.json())
            .then(setAppConfig)
            .catch(() => {});
    }, []);

    // ================= GOOGLE CALLBACK (QUERY STRING) =================
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        const token = params.get('token');
        const role = params.get('role');
        const fullname = params.get('fullname');
        const emailFromGoogle = params.get('email');

        // 👉 chỉ chạy khi backend redirect về có token
        if (!token) return;

        const authUser = {
            fullname: fullname || 'Google User',
            email: emailFromGoogle,
            role: role || 'student'
        };

        localStorage.setItem('token', token);
        localStorage.setItem('authUser', JSON.stringify(authUser));
        localStorage.setItem('userRole', authUser.role);

        setNotice('🎉 Đăng nhập Google thành công');
        navigate('/', { replace: true });
    }, [navigate]);

    // ================= LOGIN API =================
    const loginApi = async (email, password) => {
        try {
            const res = await userApi.login({ email, password });

            if (res?.data?.data) {
                return {
                    success: true,
                    user: res.data.data
                };
            }

            return { success: false, message: 'Login failed' };
        } catch (err) {
            return {
                success: false,
                message: err?.response?.data?.message || 'Login failed'
            };
        }
    };

    // ================= SUBMIT EMAIL LOGIN =================
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await loginApi(email, password);
        setLoading(false);

        if (!result.success) {
            setError(result.message);
            return;
        }

        const apiRole = result.user.role;

        const authUser = {
            id: result.user.userId,
            fullname: result.user.fullname,
            email: result.user.email,
            role: apiRole
        };

        localStorage.setItem('authUser', JSON.stringify(authUser));
        localStorage.setItem('userRole', apiRole);

        setNotice(`🎉 Chào mừng, ${authUser.fullname}`);
        setTimeout(() => navigate('/'), 1000);
    };

    // ================= GOOGLE LOGIN =================
    const handleGoogleLogin = () => {
        const clientId =
            process.env.REACT_APP_GOOGLE_CLIENT_ID ||
            appConfig?.googleClientId;

        if (!clientId) {
            setError('Missing Google Client ID');
            return;
        }

        // ⚠️ Redirect URI PHẢI LÀ BACKEND
        const redirectUri = 'https://localhost:7031/auth/google/callback';

        const params = [
            `client_id=${encodeURIComponent(clientId)}`,
            `redirect_uri=${encodeURIComponent(redirectUri)}`,
            `response_type=code`,
            `scope=openid email profile`,
            `access_type=offline`,
            `prompt=consent`
        ].join('&');

        window.location.href =
            `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    };

    // ================= UI =================
    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="login-logo">FPT</div>
                <h2>{t('login_title')}</h2>

                <input
                    type="email"
                    placeholder={t('email')}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder={t('password_placeholder')}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? 'Loading...' : t('login')}
                </button>

                <div className="social-login">
                    <button
                        type="button"
                        className="google-btn"
                        onClick={handleGoogleLogin}
                    >
                        {t('login_with_google')}
                    </button>
                </div>

                {error && <div className="error">{error}</div>}
                {notice && <div className="success">{notice}</div>}
            </form>
        </div>
    );
}

export default Login;
