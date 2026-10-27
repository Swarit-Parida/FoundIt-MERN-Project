import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, PlusCircle, PackageSearch, LogOut, UserRound, Leaf } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
export default function Layout({ children }) {
  const { user, logout } = useAuth(); const navigate = useNavigate();
  const signOut = () => { logout(); navigate('/'); };
  return <div className="app-shell"><header className="topbar"><Link to="/" className="brand"><span className="brand-mark"><Leaf size={21}/></span><span>found<span className="brand-accent">it</span><small>CAMPUS COMMUNITY</small></span></Link><nav className="nav-links"><NavLink to="/">Discover</NavLink>{user && <NavLink to="/my-items">My listings</NavLink>}</nav><div className="nav-actions">{user ? <><span className="user-chip"><UserRound size={16}/>{user.name.split(' ')[0]}</span><Link className="button button-primary button-small" to="/report"><PlusCircle size={16}/> Report item</Link><button className="icon-button" title="Log out" onClick={signOut}><LogOut size={17}/></button></> : <><Link className="button button-quiet button-small" to="/login">Log in</Link><Link className="button button-primary button-small" to="/register">Get started</Link></>}</div></header><main>{children}</main><footer className="footer"><div className="footer-brand">foundit<span> / good things find their way back.</span></div><span>Built for campus communities · Be kind, return what isn't yours.</span></footer></div>;
}
