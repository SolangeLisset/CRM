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
