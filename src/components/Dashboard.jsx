import { RefreshCw } from "lucide-react";
import { formatCurrency, parseMoney } from "../utils/money.js";
import IconButton from "./IconButton.jsx";

const quoteOpenStatuses = ["Borrador", "Enviada", "Revision"];

export default function Dashboard({ state }) {
  const deals = state.pipeline.flatMap((stage) => stage.deals);
  const totalPipeline = deals.reduce((total, deal) => total + parseMoney(deal.amount), 0);
  const prospects = state.clients.filter((client) => client.status === "Prospecto").length;
  const openQuotes = state.quotes.filter((quote) => quoteOpenStatuses.includes(quote.status)).length;
  const pendingTasks = state.tasks.filter((task) => !task.done).length;
  const highTasks = state.tasks.filter((task) => !task.done && task.priority === "Alta").length;
  const approvedQuotes = state.quotes.filter((quote) => quote.status === "Aprobada").length;
  const completedTasks = state.tasks.filter((task) => task.done).length;
  const totalTasks = state.tasks.length || 1;
  const maxStageValue = Math.max(
    1,
    ...state.pipeline.map((stage) => stage.deals.reduce((total, deal) => total + parseMoney(deal.amount), 0))
  );

  return (
    <>
      <div className="metric-grid">
        <Metric title="Ventas estimadas" value={formatCurrency(totalPipeline)} note={`${deals.length} oportunidades`} />
        <Metric title="Clientes activos" value={state.clients.length} note={`${prospects} prospectos`} />
        <Metric title="Cotizaciones abiertas" value={state.quotes.length} note={`${openQuotes} abiertas`} />
        <Metric title="Tareas de hoy" value={pendingTasks} note={`${highTasks} de alta prioridad`} />
      </div>

      <div className="dashboard-layout">
        <section className="panel">
          <div className="panel-header">
            <h2>Pipeline de ventas</h2>
            <button className="text-button" type="button">Ver detalle</button>
          </div>
          <div className="pipeline-summary">
            {state.pipeline.map((stage) => (
              <div key={stage.id}>
                <span style={{ "--width": `${Math.min(100, stage.deals.length * 32 + 24)}%` }} />
                <p>{stage.stage}</p>
                <strong>{stage.deals.length}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2>Actividad reciente</h2>
            <IconButton aria-label="Actualizar" title="Actualizar">
              <RefreshCw />
            </IconButton>
          </div>
          <ul className="activity-list">
            {state.activity.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
          </ul>
        </section>
      </div>

      <div className="chart-grid">
        <section className="panel">
          <div className="panel-header">
            <h2>Ventas por etapa</h2>
          </div>
          <div className="bar-chart">
            {state.pipeline.map((stage) => {
              const value = stage.deals.reduce((total, deal) => total + parseMoney(deal.amount), 0);
              return (
                <div className="bar-row" key={stage.id}>
                  <span>{stage.stage}</span>
                  <div><i style={{ width: `${(value / maxStageValue) * 100}%` }} /></div>
                  <strong>{formatCurrency(value)}</strong>
                </div>
              );
            })}
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2>Cotizaciones</h2>
          </div>
          <div className="donut-row">
            <div
              className="donut"
              style={{ "--approved": `${state.quotes.length ? (approvedQuotes / state.quotes.length) * 100 : 0}%` }}
            >
              <strong>{approvedQuotes}</strong>
              <span>aprobadas</span>
            </div>
            <div className="chart-notes">
              <p><strong>{openQuotes}</strong> abiertas</p>
              <p><strong>{state.quotes.length - approvedQuotes - openQuotes}</strong> cerradas sin aprobar</p>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2>Tareas completadas</h2>
          </div>
          <div className="progress-card">
            <strong>{Math.round((completedTasks / totalTasks) * 100)}%</strong>
            <span><i style={{ width: `${(completedTasks / totalTasks) * 100}%` }} /></span>
            <p>{completedTasks} de {state.tasks.length} tareas listas</p>
          </div>
        </section>
      </div>
    </>
  );
}

function Metric({ title, value, note }) {
  return (
    <article className="metric-card">
      <span>{title}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </article>
  );
}
