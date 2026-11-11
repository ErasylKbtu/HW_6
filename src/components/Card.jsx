import { Link } from 'react-router';
import Icon from './Icon.jsx';
import { Badge } from './StateViews.jsx';
import { formatDate, isOverdue } from '../format.js';

export default function Card({ task, search = '' }) {
  return <article className="assignment-card">
    <div className="card-top"><span className="task-symbol"><Icon name={task.status === 'Completed' ? 'check' : 'book'} size={23} /></span><Badge>{task.status}</Badge></div>
    <p className="task-course">{task.course}</p>
    <h2><Link to={`/assignments/${task.id}`} state={{ from: `/assignments${search}` }}>{task.title}</Link></h2>
    <div className="card-bottom"><span className={isOverdue(task) ? 'overdue' : ''}><Icon name="calendar" size={15} />{formatDate(task.dueDate)}</span><span>{task.estimatedHours} hrs</span></div>
    <div className="card-last"><span className={`priority priority-${task.priority.toLowerCase()}`}><span />{task.priority} priority</span><Link aria-label={`View ${task.title}`} to={`/assignments/${task.id}`} state={{ from: `/assignments${search}` }}><Icon name="arrow" size={19} /></Link></div>
  </article>;
}
