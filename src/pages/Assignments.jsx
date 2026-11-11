import { useLocation, useOutletContext, useSearchParams } from 'react-router';
import { getAssignments, PRIORITIES, STATUSES } from '../services/service.js';
import useApi from '../hooks/useApi.js';
import Card from '../components/Card.jsx';
import Icon from '../components/Icon.jsx';
import { ErrorView, Loading } from '../components/StateViews.jsx';

export default function Assignments() {
  const [params, setParams] = useSearchParams();
  const { revision, busy, openEditor } = useOutletContext();
  const location = useLocation();
  const filters = Object.fromEntries(params);
  const result = useApi(getAssignments, JSON.stringify(filters), revision);
  function change(name, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(name, value); else next.delete(name);
    if (name !== 'page') next.delete('page');
    setParams(next);
  }
  return <>
    <section className="page-heading"><div><p className="eyebrow">SMALL STEPS. MEANINGFUL PROGRESS.</p><h1>Your assignments<span>.</span></h1><p>Find your next step and give it your focus.</p></div><button className="button primary" disabled={busy} onClick={() => openEditor()}><Icon name="plus" size={18} />New assignment</button></section>
    <section className="panel filters-panel" aria-label="Assignment filters">
      <label className="search-field"><Icon name="search" size={18} /><input aria-label="Search assignments" placeholder="Search assignments or courses…" value={filters.q || ''} onChange={(event) => change('q', event.target.value)} /></label>
      <div className="filter-row">
        <label>Status<select value={filters.status || ''} onChange={(event) => change('status', event.target.value)}><option value="">All statuses</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></label>
        <label>Priority<select value={filters.priority || ''} onChange={(event) => change('priority', event.target.value)}><option value="">All priorities</option>{PRIORITIES.map((p) => <option key={p}>{p}</option>)}</select></label>
        <label>Course<select value={filters.course || ''} onChange={(event) => change('course', event.target.value)}><option value="">All courses</option>{[...new Set([...(result.data?.courses || []), ...(filters.course ? [filters.course] : [])])].map((c) => <option key={c}>{c}</option>)}</select></label>
        <label>Sort by<select value={filters.sort || 'due'} onChange={(event) => change('sort', event.target.value)}><option value="due">Due date</option><option value="title">Title A–Z</option><option value="priority">Priority</option></select></label>
      </div>
      <div className="filter-bottom"><button className="text-button" onClick={() => setParams({})}>Clear filters</button><button className="button reload-button" onClick={result.retry} disabled={result.status === 'loading'}><Icon name="reload" size={15} />Reload</button></div>
    </section>
    {result.status === 'loading' ? <Loading /> : result.status === 'error' ? <ErrorView message={result.error.message} onRetry={result.retry} /> : <>
      <div className="results-heading"><p><strong>{result.data.total}</strong> assignments found</p><span>Page {result.data.page} of {result.data.pages}</span></div>
      {result.data.items.length ? <div className="cards-grid">{result.data.items.map((task) => <Card key={task.id} task={task} search={location.search} />)}</div> : <div className="state-view panel"><span className="state-icon"><Icon name="search" size={28} /></span><h3>No assignments found</h3><p>Try different filters or create your first assignment.</p><button className="button secondary" onClick={() => setParams({})}>Clear filters</button></div>}
      <nav className="pagination" aria-label="Assignment pages"><button className="button secondary" disabled={result.data.page === 1} onClick={() => change('page', String(result.data.page - 1))}>Previous</button><span>{result.data.page} / {result.data.pages}</span><button className="button secondary" disabled={result.data.page === result.data.pages} onClick={() => change('page', String(result.data.page + 1))}>Next</button></nav>
    </>}
  </>;
}
