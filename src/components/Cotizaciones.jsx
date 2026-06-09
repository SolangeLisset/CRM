import { FilePlus2, Pencil, Trash2 } from "lucide-react";
import IconButton from "./IconButton.jsx";

export default function Cotizaciones({ quotes, onCreate, onEdit, onDelete }) {
  return (
    <>
      <div className="section-toolbar">
        <h2>Cotizaciones</h2>
        <button className="primary-button" type="button" onClick={onCreate}><FilePlus2 />Nueva cotizacion</button>
      </div>
      <div className="quote-grid">
        {quotes.map((quote) => (
          <article className="quote-card" key={quote.id}>
            <div className="card-actions">
              <IconButton onClick={() => onEdit(quote)} aria-label={`Editar ${quote.code || quote.id}`} title="Editar"><Pencil /></IconButton>
              <IconButton danger onClick={() => onDelete(quote.id)} aria-label={`Eliminar ${quote.code || quote.id}`} title="Eliminar"><Trash2 /></IconButton>
            </div>
            <span>{quote.code || quote.id}</span>
            <h3>{quote.client}</h3>
            <strong>{quote.amount}</strong>
            <div>
              <span className="status-pill">{quote.status}</span>
              <small>Vence {quote.expires}</small>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
