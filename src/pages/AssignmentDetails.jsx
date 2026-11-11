import { Link, useLocation, useOutletContext, useParams } from 'react-router';
import TaskDetails from '../components/TaskDetails.jsx';
import NotFound from './NotFound.jsx';

export default function AssignmentDetails() {
  const { id } = useParams();
  const context = useOutletContext();
  const location = useLocation();
  const back = location.state?.from || '/assignments';
  if (!/^[a-zA-Z0-9-]{1,80}$/.test(id)) return <NotFound item />;
  return <>
    <div className="detail-navigation"><Link to={back}>← Back</Link><Link to="/assignments">All assignments ↗</Link></div>
    <section className="panel detail-page"><TaskDetails key={id} id={id} revision={context.revision} locked={context.busy} onEdit={context.openEditor} onRemove={context.openRemove} onComplete={context.complete} /></section>
  </>;
}
