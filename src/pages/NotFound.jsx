import { Link } from 'react-router';
export default function NotFound({ item = false }) {
  return <section className="not-found"><span className="error-number">404</span><p className="eyebrow">A LITTLE DETOUR</p><h1>{item ? 'Assignment not found.' : 'This page took a study break.'}</h1><p>{item ? 'The assignment URL is invalid or the item has been removed.' : 'The page you’re looking for doesn’t exist. Let’s get you back to your workspace.'}</p><div className="hero-actions"><Link className="button primary" to="/">Back to Home</Link><Link className="button secondary" to="/assignments">All assignments</Link></div></section>;
}
