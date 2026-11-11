import { Link } from 'react-router';
import Icon from '../components/Icon.jsx';

export default function Home() {
  return <>
    <section className="home-hero">
      <div className="hero-copy"><p className="eyebrow"><span className="status-dot" />YOUR SPACE TO MAKE PROGRESS</p><h1>A clear plan.<br />A calmer mind<span>.</span></h1><p>Make room for what matters. Keep your assignments organized, find your next step, and see how far you’ve come.</p><div className="hero-actions"><Link className="button primary" to="/assignments">Explore assignments <Icon name="arrow" size={17} /></Link><Link className="button secondary" to="/dashboard">View dashboard</Link></div><div className="hero-footnote"><span className="tiny-check">✓</span> A little structure for your student life.</div></div>
      <div className="hero-art"><img src={`${import.meta.env.BASE_URL}study-space.svg`} alt="Illustration of a tidy study desk with books, a plant, and a checked assignment list" /><span className="art-caption">ONE TASK AT A TIME.</span></div>
    </section>
    <div className="home-section-heading"><div><p className="eyebrow">LESS CLUTTER. MORE CLARITY.</p><h2>A place for your next step.</h2></div><Link to="/about">About StudyFlow <Icon name="arrow" size={16} /></Link></div>
    <section className="home-features">{[['01', 'book', 'Keep it together', 'Your assignments, deadlines, and notes in one thoughtful workspace.', '/assignments', 'Find an assignment'], ['02', 'tune', 'See your progress', 'A simple overview of your workload, by course and status.', '/dashboard', 'Open your dashboard'], ['03', 'cap', 'Built for student life', 'A focused project by Karas Yerassyl, Information Systems at KBTU.', '/about', 'Meet the project']].map(([n, icon, title, text, to, label]) => <article className="feature-card" key={n}><div><span className="stat-icon"><Icon name={icon} /></span><span className="feature-number">{n}</span></div><h3>{title}</h3><p>{text}</p><Link to={to}>{label} <Icon name="arrow" size={16} /></Link></article>)}</section>
  </>;
}
