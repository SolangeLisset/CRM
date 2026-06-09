import { LogOut, Moon, RotateCcw, Search, Sun } from "lucide-react";
import GlobalSearchResults from "./GlobalSearchResults.jsx";
import IconButton from "./IconButton.jsx";

export default function Topbar({
  title,
  search,
  onSearchChange,
  results,
  onResultSelect,
  theme,
  onToggleTheme,
  onResetDemo,
  user,
  onLogout
}) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">CRM para equipos comerciales</p>
        <h1>{title}</h1>
      </div>
      <div className="topbar-actions">
        <div className="search-shell">
          <label className="search-box" htmlFor="global-search">
            <Search />
            <input
              id="global-search"
              type="search"
              placeholder="Buscar en todo el CRM"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </label>
          <GlobalSearchResults query={search} results={results} onSelect={onResultSelect} />
        </div>
        <IconButton small={false} onClick={onToggleTheme} aria-label="Cambiar tema" title="Cambiar tema">
          {theme === "light" ? <Moon /> : <Sun />}
        </IconButton>
        <IconButton small={false} onClick={onResetDemo} aria-label="Restaurar demo" title="Restaurar demo">
          <RotateCcw />
        </IconButton>
        <div className="user-chip">
          <strong>{user.name}</strong>
          <span>{user.role}</span>
        </div>
        <IconButton small={false} onClick={onLogout} aria-label="Salir" title="Salir">
          <LogOut />
        </IconButton>
      </div>
    </header>
  );
}
