import {
  Building2,
  CheckSquare,
  FileText,
  KanbanSquare,
  LayoutDashboard,
  MessagesSquare,
  Users
} from "lucide-react";

const links = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "clientes", label: "Clientes", icon: Users },
  { id: "empresas", label: "Empresas", icon: Building2 },
  { id: "seguimientos", label: "Seguimientos", icon: MessagesSquare },
  { id: "cotizaciones", label: "Cotizaciones", icon: FileText },
  { id: "tareas", label: "Tareas", icon: CheckSquare },
  { id: "pipeline", label: "Pipeline", icon: KanbanSquare }
];

export default function Sidebar({ activeSection, onSectionChange }) {
  return (
    <aside className="sidebar" aria-label="Navegacion principal">
      <div className="brand">
        <div className="brand-mark">SC</div>
        <div>
          <strong>CRM Comercial</strong>
          <span>SolangeLisset</span>
        </div>
      </div>

      <nav className="main-nav" aria-label="Modulos">
        {links.map(({ id, label, icon: Icon }) => (
          <button
            className={`nav-link ${activeSection === id ? "active" : ""}`}
            key={id}
            type="button"
            onClick={() => onSectionChange(id)}
          >
            <Icon />
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
