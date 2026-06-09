const sectionLabels = {
  clientes: "Cliente",
  empresas: "Empresa",
  cotizaciones: "Cotizacion",
  tareas: "Tarea",
  pipeline: "Oportunidad"
};

export default function GlobalSearchResults({ query, results, onSelect }) {
  if (!query.trim()) return null;

  return (
    <div className="global-results">
      {results.length ? (
        results.map((result) => (
          <button key={`${result.section}-${result.id}`} type="button" onClick={() => onSelect(result)}>
            <span>{sectionLabels[result.section]}</span>
            <strong>{result.title}</strong>
            <small>{result.detail}</small>
          </button>
        ))
      ) : (
        <p>No hay resultados para "{query}".</p>
      )}
    </div>
  );
}
