import { CircleDollarSign, Pencil, Trash2 } from "lucide-react";
import IconButton from "./IconButton.jsx";

export default function Pipeline({ pipeline, onCreate, onEdit, onDelete, onMoveDeal }) {
  function handleDragStart(event, dealId) {
    event.dataTransfer.setData("text/plain", dealId);
  }

  function handleDrop(event, stageId) {
    event.preventDefault();
    onMoveDeal(event.dataTransfer.getData("text/plain"), stageId);
  }

  return (
    <>
      <div className="section-toolbar">
        <h2>Pipeline de ventas</h2>
        <button className="primary-button" type="button" onClick={onCreate}><CircleDollarSign />Nueva oportunidad</button>
      </div>
      <div className="kanban">
        {pipeline.map((column) => (
          <section
            className="kanban-column"
            key={column.id}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => handleDrop(event, column.id)}
          >
            <header>
              <h3>{column.stage}</h3>
              <span>{column.deals.length}</span>
            </header>
            <div className="drop-zone">
              {column.deals.map((deal) => (
                <article
                  className="deal-card"
                  key={deal.id}
                  draggable
                  onDragStart={(event) => handleDragStart(event, deal.id)}
                >
                  <div className="card-actions">
                    <IconButton onClick={() => onEdit(deal, column.id)} aria-label={`Editar ${deal.name}`} title="Editar"><Pencil /></IconButton>
                    <IconButton danger onClick={() => onDelete(deal.id)} aria-label={`Eliminar ${deal.name}`} title="Eliminar"><Trash2 /></IconButton>
                  </div>
                  <strong>{deal.name}</strong>
                  <span>{deal.amount}</span>
                  <small>{deal.owner}</small>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
