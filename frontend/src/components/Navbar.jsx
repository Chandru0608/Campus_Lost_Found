import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Navbar() {
  const { user, logout } = useAuth();
  return <header className="navbar"><Link to="/" className="brand">Campus<span>Connect</span></Link>
    <nav><NavLink to="/">Browse items</NavLink>{user ? <><NavLink className="report-link" to="/report">+ Report an item</NavLink><span className="nav-user">Hi, {user.name.split(" ")[0]}</span><button className="logout-button" onClick={logout}>Log out</button></> : <><NavLink to="/login">Log in</NavLink><NavLink className="report-link" to="/register">Sign up</NavLink></>}</nav></header>;
}
