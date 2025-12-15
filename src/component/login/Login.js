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

    // ================= LOGIN API =================
    const loginApi = async (email, password) => {
        try {
            const res = await userApi.login({ email, password });

            if (res?.data?.data) {
                return {
                    success: true,
                    user: res.data.data,
                    message: res.data.message
                };
            }

            return { success: false, message: 'Login failed.' };
        } catch (err) {
            return {
                success: false,
                message: err?.response?.data?.message || 'Login failed.'
            };
        }
    };

    // ================= SUBMIT =================
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setNotice('');
        setLoading(true);

        const result = await loginApi(email, password);
        setLoading(false);

        if (!result.success) {
            setError(result.message);
            return;
        }

        // 🔥 ROLE LẤY TRỰC TIẾP TỪ API 🔥
        const apiRole = result.user.role; // admin | student | company | staff

        // ===== AUTH USER =====
        const authUser = {
            id: result.user.userId,
            fullname: result.user.fullname,
            email: result.user.email,
            role: apiRole
        };

        // ===== SAVE LOCAL STORAGE =====
        localStorage.setItem('authUser', JSON.stringify(authUser));
        localStorage.setItem('userRole', apiRole);

        setNotice(`🎉 Chào mừng, ${authUser.fullname}!`);

        setTimeout(() => navigate('/'), 1200);
    };

    // ================= LOAD CONFIG =================
    useEffect(() => {
        let cancelled = false;

        const loadConfig = async () => {
            try {
                const res = await fetch('/app-config.json', { cache: 'no-store' });
                if (!res.ok) return;
                const json = await res.json();
                if (!cancelled) setAppConfig(json);
            } catch {}
        };

        loadConfig();
        return () => { cancelled = true; };
    }, []);

    // ================= GOOGLE CALLBACK =================
    useEffect(() => {
        const hash = window.location.hash || '';
        const idx = hash.indexOf('?');
        if (idx === -1) return;

        const params = new URLSearchParams(hash.substring(idx + 1));

        if (params.get('oauth') === 'google') {
            const status = params.get('status');
            const msg = params.get('message');

            if (status === 'success') {
                // ⚠️ GOOGLE: backend nên trả role
                const roleFromApi = params.get('role') || 'student';

                localStorage.setItem('authUser', JSON.stringify({
                    fullname: 'Google User',
                    role: roleFromApi
                }));
                localStorage.setItem('userRole', roleFromApi);

                setNotice(t('login_google_success'));
            } else {
                setError(msg ? decodeURIComponent(msg) : t('login_google_failed'));
            }

            navigate('/login', { replace: true });
        }
    }, [navigate, t]);

    // ================= GOOGLE LOGIN =================
    const handleGoogleLogin = () => {
        const clientId =
            process.env.REACT_APP_GOOGLE_CLIENT_ID ||
            appConfig?.googleClientId ||
            '';

        const redirectUri =
            process.env.REACT_APP_GOOGLE_REDIRECT_URI ||
            appConfig?.googleRedirectUri ||
            'https://localhost:7031/auth/google/callback';

        if (!clientId) {
            setError('Missing Google Client ID.');
            return;
        }

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
            <div
                className="fpt-uni-logo"
                role="button"
                tabIndex={0}
                onClick={() => navigate('/')}
            >
                FPT UNIVERSITY
            </div>

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

                <div className="helper-text">{t('password_helper')}</div>

                <button type="submit" disabled={loading}>
                    {loading ? <span className="spinner"></span> : t('login')}
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
