import { Link } from 'react-router';
import useAuth from '../hooks/useAuth.js';
import LogoutButton from '../components/LogoutButton.jsx';
import Icon from '../components/Icon.jsx';

export default function Profile() {
  const { user } = useAuth();
  if (!user) return null;
  return <>
    <section className="page-heading"><div><p className="eyebrow">YOUR ACCOUNT. YOUR SPACE.</p><h1>A place to call yours<span>.</span></h1><p>You’re signed in and ready for your next step.</p></div></section>
    <section className="panel profile-card">
      <div className="profile-identity"><div className="profile-avatar"><Icon name="cap" size={35} /></div><div><span className="profile-status"><span className="status-dot" />Signed in</span><h2>{user.displayName || 'Your StudyFlow account'}</h2><p>{user.email}</p></div></div>
      <dl className="profile-fields"><div><dt>Email address</dt><dd>{user.email || 'Email unavailable'}</dd></div><div><dt>Firebase UID</dt><dd className="user-uid">{user.uid}</dd></div><div><dt>Sign-in method</dt><dd>{user.providerData.some((provider) => provider.providerId === 'google.com') ? 'Google' : 'Email and password'}</dd></div></dl>
      <div className="profile-actions"><Link className="button primary" to="/assignments">Your assignments <Icon name="arrow" size={17} /></Link><LogoutButton /></div>
    </section>
  </>;
}
