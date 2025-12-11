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

    // -------------------- LOGIN API --------------------
    const loginApi = async (email, password) => {
        try {
            const response = await userApi.login({ email, password });

            if (response?.data?.data) {
                return {
                    success: true,
                    message: response.data.message,
                    user: response.data.data
                };
            }

            return { success: false, message: "Login failed: no user data." };

        } catch (err) {
            return {
                success: false,
                message: err?.response?.data?.message || "Login failed."
            };
        }
    };

    // -------------------- HANDLE FORM SUBMIT --------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setNotice('');
        setLoading(true);

        const result = await loginApi(email, password);

        setLoading(false);

        if (result.success) {

            // ---------------------- LƯU USER ----------------------
            const user = {
                fullname: result.user.fullname,
                email: result.user.email,
                role: result.user.role || "students"
            };

            localStorage.setItem("authUser", JSON.stringify(user));

            // ---------------------- CHÀO MỪNG ----------------------
            setNotice(`🎉 Chào mừng, ${user.fullname}!`);

            // Redirect để user kịp nhìn thông báo
            setTimeout(() => navigate('/'), 1200);

        } else {
            setError(result.message);
        }
    };

    // -------------------- LOAD APP CONFIG --------------------
    useEffect(() => {
        let cancelled = false;

        async function loadConfig() {
            try {
                const res = await fetch('/app-config.json', { cache: 'no-store' });
                if (!res.ok) return;
                const json = await res.json();
                if (!cancelled) setAppConfig(json || {});
            } catch {}
        }

        loadConfig();
        return () => { cancelled = true; };
    }, []);

    // -------------------- PARSE GOOGLE OAUTH CALLBACK --------------------
    useEffect(() => {
        const hash = window.location.hash || '';
        const idx = hash.indexOf('?');
        if (idx === -1) return;

        const params = new URLSearchParams(hash.substring(idx + 1));

        if (params.get('oauth') === 'google') {
            const status = params.get('status');
            const msg = params.get('message');

            if (status === "success") {
                // Lưu user google tạm thời
                localStorage.setItem("authUser", JSON.stringify({
                    fullname: "Google User",
                    role: "students"
                }));

                setNotice(t("login_google_success"));
            } else {
                const m = msg ? decodeURIComponent(msg) : t("login_google_failed");
                setError(m);
                console.error("Google login error:", m);
            }

            navigate("/login", { replace: true });
        }
    }, []); // ⛔ không warning vì navigate & t không cần thiết trong deps

    // -------------------- GOOGLE LOGIN --------------------
    const handleGoogleLogin = () => {
        const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || appConfig?.googleClientId || '';
        const redirectUri = process.env.REACT_APP_GOOGLE_REDIRECT_URI || appConfig?.googleRedirectUri || 'https://localhost:7031/auth/google/callback';

        if (!clientId) {
            const msg = 'Missing Google Client ID.';
            setError(msg);
            return;
        }

        const scope = encodeURIComponent('openid email profile');
        const state = encodeURIComponent(Math.random().toString(36).slice(2));

        const params = [
            `client_id=${encodeURIComponent(clientId)}`,
            `redirect_uri=${encodeURIComponent(redirectUri)}`,
            `response_type=code`,
            `scope=${scope}`,
            `access_type=offline`,
            `include_granted_scopes=true`,
            `prompt=consent`,
            `state=${state}`
        ].join('&');

        window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    };

    // -------------------- HANDLE CLICK LOGO --------------------
    const handleLogoHome = () => navigate('/');

    // -------------------- UI --------------------
    return (
        <div className="login-container">
            <div
                className="fpt-uni-logo"
                role="button"
                tabIndex={0}
                onClick={handleLogoHome}
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
                    <button type="button" className="google-btn" onClick={handleGoogleLogin}>
                        {t('login_with_google')}
                    </button>
                </div>

                {error && <div className="error">{error}</div>}
                {notice && <div className="success">{notice}</div>}

                <div className="secondary-actions">
                    <button type="button" className="link-btn" onClick={() => navigate('/forgot')}>
                        {t('forgot_password')}
                    </button>
                    <button type="button" className="link-btn" onClick={() => navigate('/signup')}>
                        {t('create_account')}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Login;
