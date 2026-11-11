import { useState } from 'react';
import { Link, useOutletContext } from 'react-router';
import { getDashboardData, STATUSES } from '../services/service.js';
import useApi from '../hooks/useApi.js';
import { isOverdue } from '../format.js';
import Icon from '../components/Icon.jsx';
import { ErrorView, Loading } from '../components/StateViews.jsx';

function Breakdown({ title, groups, total, parameter, course }) {
  return <section className="panel breakdown"><h2>{title}</h2><p>A clearer picture of your workload.</p><div className="breakdown-rows">{groups.map(([name, count]) => {
    const params = new URLSearchParams({ [parameter]: name });
    if (course) params.set('course', course);
    return <Link key={name} to={`/assignments?${params}`} className="breakdown-row"><span>{name}</span><strong>{count}</strong><div className="breakdown-track"><span style={{ width: `${total ? count / total * 100 : 0}%` }} /></div></Link>;
  })}</div></section>;
}

export default function Dashboard() {
  const { revision } = useOutletContext();
  const result = useApi(getDashboardData, '{}', revision);
  const [course, setCourse] = useState('');
  if (result.status === 'loading') return <Loading text="Calculating your dashboard…" />;
  if (result.status === 'error') return <ErrorView message={result.error.message} onRetry={result.retry} />;
  const all = result.data;
  const courses = [...new Set(all.map((task) => task.course))].sort();
  const tasks = all.filter((task) => !course || task.course === course);
  const completed = tasks.filter((task) => task.status === 'Completed').length;
  const open = tasks.length - completed;
  const hours = tasks.filter((task) => task.status !== 'Completed').reduce((sum, task) => sum + task.estimatedHours, 0);
  const overdue = tasks.filter(isOverdue).length;
  const progress = tasks.length ? Math.round(completed / tasks.length * 100) : 0;
  const stats = [['Open assignments', open, 'book', 'On your radar'], ['Focus time', `${hours} hrs`, 'clock', 'For open assignments'], ['Completed', completed, 'check', `${progress}% of selected tasks`], ['Overdue', overdue, 'calendar', 'Open tasks past their due date']];
  return <>
    <section className="page-heading"><div><p className="eyebrow">SEE THE BIGGER PICTURE</p><h1>A little perspective<span>.</span></h1><p>Your workload and progress, in one clear view.</p></div><Link to="/assignments" className="button secondary">View assignments <Icon name="arrow" size={16} /></Link></section>
    <div className="dashboard-controls"><label>Filter dashboard by course<select value={course} onChange={(event) => setCourse(event.target.value)}><option value="">All courses</option>{courses.map((name) => <option key={name}>{name}</option>)}</select></label><p>{tasks.length} assignments in this view</p><button className="button reload-button" onClick={result.retry}>Reload</button></div>
    <section className="stats dashboard-stats" aria-label="Dashboard statistics">{stats.map(([label, value, icon, note], i) => <article className="stat-card" key={label}><span className={`stat-icon ${i === 1 ? 'warm' : i === 2 ? 'lilac' : ''}`}><Icon name={icon} /></span><div><p>{label}</p><strong>{value}</strong></div><span className="stat-note">{note}</span></article>)}</section>
    {!tasks.length && <p className="notice info" role="status">No assignments in this view. Select another course or add an assignment.</p>}
    <div className="breakdowns"><Breakdown title="By status" total={tasks.length} parameter="status" course={course} groups={STATUSES.map((status) => [status, tasks.filter((task) => task.status === status).length])} /><Breakdown title="By course" total={tasks.length} parameter="course" groups={(course ? [course] : courses).map((name) => [name, tasks.filter((task) => task.course === name).length])} /></div>
  </>;
}
