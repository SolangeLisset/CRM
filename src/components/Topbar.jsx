import { Bell, Search } from "lucide-react";
import IconButton from "./IconButton.jsx";

export default function Topbar({ title, search, onSearchChange }) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">CRM para equipos comerciales</p>
        <h1>{title}</h1>
      </div>
      <div className="topbar-actions">
        <label className="search-box" htmlFor="global-search">
          <Search />
          <input
            id="global-search"
            type="search"
            placeholder="Buscar clientes, empresas o tareas"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>
        <IconButton small={false} aria-label="Notificaciones" title="Notificaciones">
          <Bell />
        </IconButton>
      </div>
    </header>
  );
}
