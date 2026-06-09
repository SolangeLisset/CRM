import { Pencil, Plus, Trash2 } from "lucide-react";
import IconButton from "./IconButton.jsx";

const moneyColor = { Alta: "success", Media: "warning", Baja: "danger" };

export default function Empresas({ companies, onCreate, onEdit, onDelete }) {
  return (
    <>
      <div className="section-toolbar">
        <h2>Empresas</h2>
        <button className="primary-button" type="button" onClick={onCreate}><Plus />Nueva empresa</button>
      </div>
      <div className="company-grid">
        {companies.map((company) => (
          <article className="company-card" key={company.id}>
            <div className="card-actions">
              <IconButton onClick={() => onEdit(company)} aria-label={`Editar ${company.name}`} title="Editar"><Pencil /></IconButton>
              <IconButton danger onClick={() => onDelete(company.id)} aria-label={`Eliminar ${company.name}`} title="Eliminar"><Trash2 /></IconButton>
            </div>
            <div className="company-avatar">{company.name.slice(0, 2).toUpperCase()}</div>
            <h3>{company.name}</h3>
            <p>{company.industry}</p>
            <div className="company-stats">
              <span>{company.contacts} contactos</span>
              <span>{company.revenue}</span>
            </div>
            <span className={`health ${moneyColor[company.health]}`}>Salud {company.health}</span>
          </article>
        ))}
      </div>
    </>
  );
}
