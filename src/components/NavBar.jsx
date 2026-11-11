import { Link, NavLink } from 'react-router';
import useAuth from '../hooks/useAuth.js';
import LogoutButton from './LogoutButton.jsx';
import Icon from './Icon.jsx';

export default function NavBar() {
  const { user, loading } = useAuth();
  const links = [
    ['/', 'grid', 'Home'],
    ['/assignments', 'book', 'Assignments'],
    ['/dashboard', 'tune', 'Dashboard'],
    ['/about', 'cap', 'About'],
  ];
  return <aside className="sidebar">
    <Link className="brand" to="/"><span className="brand-mark"><Icon name="book" size={24} /></span>studyflow<span className="brand-dot">.</span></Link>
    <p className="sidebar-label">YOUR WORKSPACE</p>
    <nav aria-label="Main navigation">{links.map(([to, icon, label]) =>
      <NavLink end={to === '/'} className="nav-link" key={to} to={to}><Icon name={icon} size={19} /><span className="nav-text">{label}</span></NavLink>)}</nav>
    <div className="sidebar-account" aria-label="Account navigation">
      {loading ? <span className="account-loading">Checking session…</span> : user ? <>
        <NavLink to="/profile" className="nav-link"><Icon name="cap" size={19} /><span className="nav-text">Profile</span></NavLink>
        <LogoutButton className="nav-link logout-link" />
      </> : <><NavLink to="/login" className="nav-link">Log in</NavLink><NavLink to="/signup" className="nav-link">Sign up</NavLink></>}
    </div>
    <div className="sidebar-note"><span className="note-spark">✳</span><h3>One task at a time.</h3><p>A little structure makes space for your best work.</p><Link to="/assignments">Find your next step <Icon name="arrow" size={15} /></Link></div>
    <Link className="profile" to={user ? '/profile' : '/about'}><div className="avatar">{user ? (user.email || 'SF').slice(0, 2).toUpperCase() : 'KY'}</div><div><strong>{user?.email || 'Karas Yerassyl'}</strong><span>{user ? 'Your StudyFlow account' : 'Information Systems · KBTU'}</span></div></Link>
  </aside>;
}
