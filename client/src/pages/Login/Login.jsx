import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsLock, BsPerson } from "react-icons/bs";
import { AiFillCloseCircle } from "react-icons/ai";
import { MdEmail } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

const Login = ({ onClose }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const update = (field, value) => { setError(""); setForm((current) => ({ ...current, [field]: value })); };
  const submit = async (event) => {
    event.preventDefault(); setIsSubmitting(true); setError("");
    try { if (isRegister) await register(form); else await login({ email: form.email, password: form.password }); onClose(); navigate(isRegister ? "/dashboard/user-preference-form" : "/dashboard"); }
    catch (requestError) { setError(requestError.response?.data?.error || "Unable to reach the API. Confirm the backend is running."); }
    finally { setIsSubmitting(false); }
  };
  const switchMode = () => { setIsRegister((current) => !current); setError(""); };

  return <div className="login_container"><button type="button" className="close_btn" onClick={onClose} aria-label="Close sign in"><AiFillCloseCircle /></button><form onSubmit={submit}><div className="login_header"><h1>{isRegister ? "Create your account" : "Welcome back"}</h1><p>{isRegister ? "Save research and access your workspace from any device." : "Sign in to continue to your research workspace."}</p></div><div className="login_inputs">{isRegister && <label className="label"><span className="icon"><BsPerson /></span><input required type="text" className="input" value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Your name" autoComplete="name" /></label>}<label className="label"><span className="icon"><MdEmail /></span><input required type="email" className="input" value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="Email address" autoComplete="email" /></label><label className="label"><span className="icon"><BsLock /></span><input required minLength="8" type="password" className="input" value={form.password} onChange={(event) => update("password", event.target.value)} placeholder="Password" autoComplete={isRegister ? "new-password" : "current-password"} /></label></div>{error && <p className="auth-error" role="alert">{error}</p>}<div className="login_submit"><span>{isRegister ? "Already have an account?" : "New to IntelliPaper?"} <button type="button" onClick={switchMode} className="toggle_link">{isRegister ? "Sign in" : "Create one"}</button></span><button type="submit" disabled={isSubmitting}>{isSubmitting ? "Please wait…" : isRegister ? "Create account" : "Sign in"}</button></div></form></div>;
};

export default Login;
