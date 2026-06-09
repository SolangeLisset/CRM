import { Mail, X } from "lucide-react";
import IconButton from "./IconButton.jsx";

export default function ClientDetail({ client, quotes, tasks, followups, history, onClose }) {
  if (!client) return null;

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="detail-drawer" aria-label={`Ficha de ${client.name}`}>
        <header>
          <div>
            <p className="eyebrow">Ficha de cliente</p>
            <h2>{client.name}</h2>
            <span className="status-pill">{client.status}</span>
          </div>
          <IconButton onClick={onClose} aria-label="Cerrar ficha" title="Cerrar">
            <X />
          </IconButton>
        </header>

        <div className="detail-grid">
          <article className="detail-card">
            <h3>Datos comerciales</h3>
            <p><strong>Empresa:</strong> {client.company}</p>
            <p><strong>Email:</strong> {client.email}</p>
            <p><strong>Valor potencial:</strong> {client.value}</p>
            <a className="text-link" href={`mailto:${client.email}`}><Mail />Enviar correo</a>
          </article>

          <article className="detail-card">
            <h3>Cotizaciones</h3>
            {quotes.length ? quotes.map((quote) => (
              <p key={quote.id}><strong>{quote.code || quote.id}</strong> {quote.amount} - {quote.status}</p>
            )) : <p>No hay cotizaciones relacionadas.</p>}
          </article>

          <article className="detail-card">
            <h3>Tareas</h3>
            {tasks.length ? tasks.map((task) => (
              <p key={task.id}>{task.done ? "Completada" : "Pendiente"} - {task.text}</p>
            )) : <p>No hay tareas relacionadas.</p>}
          </article>

          <article className="detail-card">
            <h3>Seguimientos</h3>
            {followups.length ? followups.map((item) => (
              <p key={`${item.title}-${item.date}`}><strong>{item.date}</strong> {item.title}</p>
            )) : <p>No hay seguimientos relacionados.</p>}
          </article>
        </div>

        <article className="detail-card">
          <h3>Historial</h3>
          <ul className="activity-list">
            {history.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
          </ul>
        </article>
      </section>
    </div>
  );
}
