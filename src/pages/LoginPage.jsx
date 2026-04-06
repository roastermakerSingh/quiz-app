import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useToast } from "../context/ToastContext";
import { ADMIN_CREDS } from "../utils/storage";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

export default function LoginPage() {
  const { admin, setAdmin } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [creds, setCreds] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Already logged in
  if (admin) {
    navigate("/admin", { replace: true });
    return null;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate slight network delay for UX
    await new Promise((r) => setTimeout(r, 400));

    if (
      creds.username === ADMIN_CREDS.username &&
      creds.password === ADMIN_CREDS.password
    ) {
      setAdmin(true);
      toast("लॉगिन सफल! स्वागत है।", "success");
      navigate("/admin", { replace: true });
    } else {
      setError("गलत यूज़रनेम या पासवर्ड। कृपया पुनः प्रयास करें।");
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__header">
          <div className="login-card__icon">🔐</div>
          <h2 className="login-card__title">Admin Login</h2>
          <p className="login-card__sub">बजरंग दल एकसर — Admin Panel</p>
        </div>

        <form onSubmit={handleLogin} noValidate>
          <Input
            label="Username"
            placeholder="admin"
            value={creds.username}
            onChange={(e) => setCreds({ ...creds, username: e.target.value })}
            autoFocus
            autoComplete="username"
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={creds.password}
            onChange={(e) => setCreds({ ...creds, password: e.target.value })}
            autoComplete="current-password"
          />

          {error && <p className="login-card__error">{error}</p>}

          <Button type="submit" fullWidth size="lg" loading={loading}>
            {loading ? "जाँच हो रही है..." : "Login →"}
          </Button>
        </form>

        <p className="login-card__hint">
          This is only Authorized for Admin
          <br />
        </p>
      </div>
    </div>
  );
}
