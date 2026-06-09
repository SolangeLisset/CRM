import { ListPlus, Pencil, Trash2 } from "lucide-react";
import IconButton from "./IconButton.jsx";

export default function Tareas({ tasks, onCreate, onEdit, onDelete, onToggle }) {
  return (
    <>
      <div className="section-toolbar">
        <h2>Tareas</h2>
        <button className="primary-button" type="button" onClick={onCreate}><ListPlus />Nueva tarea</button>
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
