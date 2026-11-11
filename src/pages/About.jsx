import { Link } from 'react-router';
import Icon from '../components/Icon.jsx';
export default function About() {
  return <>
    <section className="page-heading"><div><p className="eyebrow">A LITTLE MORE ABOUT THIS SPACE</p><h1>Made for clearer days<span>.</span></h1><p>A simple assignment planner for a busy student life.</p></div></section>
    <section className="about-grid"><article className="panel about-copy"><span className="stat-icon"><Icon name="book" /></span><h2>Meet StudyFlow</h2><p>StudyFlow brings assignments, course information, due dates, and personal notes into one place. Search your work, make a change, or check your progress without losing sight of the next step.</p><p>This project extends the previous Async React homework with nested routes, shareable filters, a dashboard, Firebase Authentication, and cached API reads.</p><Link className="button primary" to="/assignments">Explore the workspace <Icon name="arrow" size={16} /></Link></article><article className="panel about-author"><div className="large-avatar">KY</div><p className="eyebrow">ABOUT THE AUTHOR</p><h2>Karas Yerassyl</h2><p>Information Systems student<br />Kazakh-British Technical University</p><div className="author-tags"><span>React</span><span>JavaScript</span><span>CSS</span></div><p className="about-caption">Routing & Application Architecture<br />React Homework 06</p></article></section>
    <p className="storage-note">Assignments use a simulated asynchronous API and are saved in this browser. Different browsers have separate data.</p>
  </>;
}
