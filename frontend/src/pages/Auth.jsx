import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../services/api";
import { useAuth } from "../context/AuthContext";
export default function Auth({ mode }) {
  const isRegister = mode === "register"; const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  const { login } = useAuth(); const navigate = useNavigate(); const location = useLocation();
  const destination = location.state?.from || "/";
  const update = e => setForm({ ...form, [e.target.name]: e.target.value });
  async function submit(e) { e.preventDefault(); setError(""); setBusy(true); try { const data = isRegister ? await registerUser(form) : await loginUser({ email: form.email, password: form.password }); login(data); navigate(destination, { replace: true }); } catch (e) { setError(e.message); } finally { setBusy(false); } }
  return <main className="form-page auth-page"><div className="form-intro"><p className="eyebrow">CAMPUS COMMUNITY</p><h1>{isRegister ? "Create your account" : "Welcome back"}</h1><p>{isRegister ? "Join the campus lost and found community." : "Log in to report or claim an item."}</p></div>
    <form className="report-form" onSubmit={submit}>{isRegister && <label>Full name<input name="name" value={form.name} onChange={update} required autoComplete="name" /></label>}
      <label>Email address<input type="email" name="email" value={form.email} onChange={update} required autoComplete="email" /></label>
      <label>Password<input type="password" name="password" value={form.password} onChange={update} required minLength="6" autoComplete={isRegister ? "new-password" : "current-password"} /></label>
      {error && <p className="error">{error}</p>}<button className="primary-button" disabled={busy}>{busy ? "Please wait..." : isRegister ? "Create account" : "Log in"}</button>
      <p className="auth-switch">{isRegister ? "Already have an account? " : "New to CampusConnect? "}<Link to={isRegister ? "/login" : "/register"}>{isRegister ? "Log in" : "Create an account"}</Link></p>
    </form></main>;
}
