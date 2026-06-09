import { ListPlus, Pencil, Trash2 } from "lucide-react";
import IconButton from "./IconButton.jsx";

export default function Tareas({
  tasks,
  priorityFilter,
  statusFilter,
  onPriorityFilterChange,
  onStatusFilterChange,
  onCreate,
  onEdit,
  onDelete,
  onToggle
}) {
  return (
    <>
      <div className="section-toolbar">
        <h2>Tareas</h2>
        <div className="toolbar-actions">
          <select className="select-control" value={priorityFilter} onChange={(event) => onPriorityFilterChange(event.target.value)}>
            <option value="Todas">Todas las prioridades</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
          <select className="select-control" value={statusFilter} onChange={(event) => onStatusFilterChange(event.target.value)}>
            <option value="Todas">Todas las tareas</option>
            <option value="Pendientes">Pendientes</option>
            <option value="Completadas">Completadas</option>
          </select>
          <button className="primary-button" type="button" onClick={onCreate}><ListPlus />Nueva tarea</button>
        </div>
      </div>
      <div className="task-list">
        {tasks.map((task) => (
          <article className="task-item" key={task.id}>
            <input
              type="checkbox"
              checked={task.done}
              onChange={(event) => onToggle(task.id, event.target.checked)}
              aria-label="Completar tarea"
            />
            <span>
              <strong>{task.text}</strong>
              <small>{task.owner} - Prioridad {task.priority}</small>
            </span>
            <div className="row-actions">
              <IconButton onClick={() => onEdit(task)} aria-label="Editar tarea" title="Editar"><Pencil /></IconButton>
              <IconButton danger onClick={() => onDelete(task.id)} aria-label="Eliminar tarea" title="Eliminar"><Trash2 /></IconButton>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
