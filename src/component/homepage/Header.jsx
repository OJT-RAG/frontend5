import React, { useState, useEffect } from "react";
import { Languages, User, MessageSquare, BookOpen, Home, Shield } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useI18n } from "../../i18n/i18n.jsx";
import "./Header.css";

const Header = () => {
 
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [role, setRole] = useState(localStorage.getItem("userRole") || "guest");
  const { lang, setLang, t } = useI18n();
  const languageCode = (lang || "en").toUpperCase().slice(0, 2);

  // Cập nhật khi login/logout thay đổi localStorage
  useEffect(() => {
    const handleStorage = () => {
      setRole(localStorage.getItem("userRole") || "guest");
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <header className="header-root">
      <div className="header-container">
        <div className="brand">
          <Link to="/" className={`home-chip ${isActive('/') ? 'active' : ''}`} aria-label={t('home')}>
            <Home size={14} />
            <span className="label">{t('home')}</span>
          </Link>
          {/* Removed brand text/logo per request */}
        </div>

        <nav className="nav" aria-label="Main navigation">
          <Link to='/knowledge' className={`nav-btn ${isActive('/knowledge') ? 'active' : ''}`}>
            <BookOpen /> <span>{t("nav_knowledge")}</span>
            <span className="line" aria-hidden="true"></span>
          </Link>
          <Link to='/qa' className={`nav-btn ${isActive('/qa') ? 'active' : ''}`}>
            <MessageSquare /> <span>{t("nav_qa")}</span>
            <span className="line" aria-hidden="true"></span>
          </Link>
          <Link to='/ragdocs' className={`nav-btn ${isActive('/ragdocs') ? 'active' : ''}`}>
            <BookOpen /> <span>{t('nav_rag_docs') || 'RAGdocs-Manage'}</span>
            <span className="line" aria-hidden="true"></span>
          </Link>
          <Link to='/ojt' className={`nav-btn ${isActive('/ojt') ? 'active' : ''}`}>
            <BookOpen /> <span>{t('nav_ojt_docs') || 'OJT Docs'}</span>
            <span className="line" aria-hidden="true"></span>
          </Link>
          <Link to='/dashboard' className={`nav-btn ${isActive('/dashboard') ? 'active' : ''}`}>
            <User /> <span>{t("nav_dashboard")}</span>
            <span className="line" aria-hidden="true"></span>
          </Link>
          <Link to='/admin' className={`nav-btn ${isActive('/admin') ? 'active' : ''}`}>
            <Shield /> <span>{t('nav_admin') || 'Admin'}</span>
            <span className="line" aria-hidden="true"></span>
          </Link>
          <Link to='/company' className={`nav-btn ${isActive('/company') ? 'active' : ''}`}>
            <Shield /> <span>{t('Company') || 'Company'}</span>
            <span className="line" aria-hidden="true"></span>
          </Link>
        </nav>

        <div className="actions">
          {/* Ngôn ngữ */}
          <div className="lang">
            <button
              className="btn btn-outline lang-trigger"
              onClick={() => setIsLangOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={isLangOpen}
              aria-label={t("language")}
            >
              <Languages /> <span>{languageCode}</span>
            </button>
            {isLangOpen && (
              <div className="lang-menu" role="menu">
                <button
                  className="lang-item"
                  role="menuitem"
                  onClick={() => {
                    setLang("en");
                    setIsLangOpen(false);
                  }}
                >
                  🇬🇧 {t("lang_en")}
                </button>
                <button
                  className="lang-item"
                  role="menuitem"
                  onClick={() => {
                    setLang("vi");
                    setIsLangOpen(false);
                  }}
                >
                  🇻🇳 {t("lang_vi")}
                </button>
                <button
                  className="lang-item"
                  role="menuitem"
                  onClick={() => {
                    setLang("ja");
                    setIsLangOpen(false);
                  }}
                >
                  🇯🇵 {t("lang_ja")}
                </button>
              </div>
            )}
          </div>

          {/* Badge */}
          <span className="badge">
            {role === "students" ? (t('role_student') || 'Student') : (t('role_guest') || 'Guest')}
          </span>

          {/* Nút login/logout */}
          {role === "students" ? (
            <button
              className="btn btn-card"
              onClick={() => {
                localStorage.removeItem("userRole");
                setRole("guest");
              }}
            >
              <User /> <span>{t("logout")}</span>
            </button>
          ) : (
            <Link to="/login" className="login-link">
              <button className="btn btn-card">
                <User /> <span>{t("login")}</span>
              </button>
            </Link>
          )}
          {/* Profile avatar (placeholder) - navigates to CV/profile */}
          <Link to="/profile/cv" className="avatar-link" aria-label={t('cv_title')}>
            <div className="avatar" role="img" aria-hidden="true">
              <User />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
