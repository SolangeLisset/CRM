import { Save, X } from "lucide-react";
import IconButton from "./IconButton.jsx";

const fieldMap = {
  client: [
    ["name", "Nombre", "text"],
    ["company", "Empresa", "text"],
    ["email", "Email", "email"],
    ["status", "Estado", "select", ["Prospecto", "Negociacion", "Cliente activo", "Seguimiento"]],
    ["value", "Valor potencial", "text"]
  ],
  company: [
    ["name", "Empresa", "text"],
    ["industry", "Industria", "text"],
    ["contacts", "Contactos", "number"],
    ["revenue", "Ingresos", "text"],
    ["health", "Salud comercial", "select", ["Alta", "Media", "Baja"]]
  ],
  quote: [
    ["code", "Codigo", "text"],
    ["client", "Cliente o empresa", "text"],
    ["amount", "Monto", "text"],
    ["status", "Estado", "select", ["Borrador", "Enviada", "Revision", "Aprobada", "Rechazada"]],
    ["expires", "Vencimiento", "text"]
  ],
  task: [
    ["text", "Tarea", "text"],
    ["owner", "Responsable", "text"],
    ["priority", "Prioridad", "select", ["Alta", "Media", "Baja"]]
  ],
  deal: [
    ["name", "Oportunidad", "text"],
    ["amount", "Monto", "text"],
    ["owner", "Responsable", "text"],
    ["stageId", "Etapa", "select"]
  ]
};

const labels = {
  client: "cliente",
  company: "empresa",
  quote: "cotizacion",
  task: "tarea",
  deal: "oportunidad"
};

export default function ModalForm({ modal, pipeline, onClose, onSubmit }) {
  if (!modal) return null;

  const fields = fieldMap[modal.type];
  const record = modal.record || {};

  function getDefaultValue(name) {
    if (name === "stageId") return modal.stageId || pipeline[0]?.id || "";
    return record[name] || "";
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(Object.fromEntries(new FormData(event.currentTarget).entries()));
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <form className="modal-card" onSubmit={handleSubmit}>
        <header>
          <h2>{modal.record ? "Editar" : "Nuevo"} {labels[modal.type]}</h2>
          <IconButton onClick={onClose} aria-label="Cerrar" title="Cerrar">
            <X />
          </IconButton>
        </header>

        <div className="form-grid">
          {fields.map(([name, label, type, options]) => {
            const choices = name === "stageId" ? pipeline.map((stage) => [stage.id, stage.stage]) : options;
            return (
              <label key={name}>
                <span>{label}</span>
                {type === "select" ? (
                  <select name={name} defaultValue={getDefaultValue(name)} required>
                    {choices.map((option) => {
                      const value = Array.isArray(option) ? option[0] : option;
                      const optionLabel = Array.isArray(option) ? option[1] : option;
                      return <option key={value} value={value}>{optionLabel}</option>;
                    })}
                  </select>
                ) : (
                  <input name={name} type={type} defaultValue={getDefaultValue(name)} required />
                )}
              </label>
            );
          })}
        </div>

        <footer>
          <button className="text-button" type="button" onClick={onClose}>Cancelar</button>
          <button className="primary-button" type="submit"><Save />Guardar</button>
        </footer>
      </form>
    </div>
  );
}
