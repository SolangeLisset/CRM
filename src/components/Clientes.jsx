import { Download, Pencil, Trash2, UserPlus } from "lucide-react";
import IconButton from "./IconButton.jsx";

export default function Clientes({ clients, filter, onFilterChange, onCreate, onEdit, onDelete, onSelect, onExport }) {
  return (
    <>
      <div className="section-toolbar">
        <h2>Clientes</h2>
        <div className="toolbar-actions">
          <select className="select-control" value={filter} onChange={(event) => onFilterChange(event.target.value)}>
            <option value="Todos">Todos los estados</option>
            <option value="Prospecto">Prospecto</option>
            <option value="Negociacion">Negociacion</option>
            <option value="Cliente activo">Cliente activo</option>
            <option value="Seguimiento">Seguimiento</option>
          </select>
          <button className="secondary-button" type="button" onClick={onExport}><Download />Exportar CSV</button>
          <button className="primary-button" type="button" onClick={onCreate}><UserPlus />Nuevo cliente</button>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Empresa</th>
              <th>Email</th>
              <th>Estado</th>
              <th>Valor potencial</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr className="clickable-row" key={client.id} onClick={() => onSelect(client)}>
                <td><strong>{client.name}</strong></td>
                <td>{client.company}</td>
                <td>{client.email}</td>
                <td><span className="status-pill">{client.status}</span></td>
                <td>{client.value}</td>
                <td className="row-actions" onClick={(event) => event.stopPropagation()}>
                  <IconButton onClick={() => onEdit(client)} aria-label={`Editar ${client.name}`} title="Editar"><Pencil /></IconButton>
                  <IconButton danger onClick={() => onDelete(client.id)} aria-label={`Eliminar ${client.name}`} title="Eliminar"><Trash2 /></IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
