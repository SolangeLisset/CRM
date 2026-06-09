import {
  activity as defaultActivity,
  clients as defaultClients,
  companies as defaultCompanies,
  followups,
  pipeline as defaultPipeline,
  quotes as defaultQuotes,
  tasks as defaultTasks
} from "./data.js";

const pageTitle = document.querySelector("#page-title");
const navLinks = document.querySelectorAll(".nav-link");
const views = document.querySelectorAll(".view");
const searchInput = document.querySelector("#global-search");
const statusFilter = document.querySelector("#client-status-filter");
const modal = document.querySelector("#record-modal");
const modalTitle = document.querySelector("#modal-title");
const modalFields = document.querySelector("#modal-fields");
const recordForm = document.querySelector("#record-form");

const storageKey = "crm-comercial-state";
const moneyColor = { Alta: "success", Media: "warning", Baja: "danger" };
const quoteOpenStatuses = ["Borrador", "Enviada", "Revision"];

let editing = null;
let state = loadState();
const collectionKeys = {
  client: "clients",
  company: "companies",
  quote: "quotes",
  task: "tasks"
};

function withIds(list, prefix) {
  return list.map((item, index) => ({
    id: item.id || `${prefix}-${Date.now()}-${index}`,
    ...item
  }));
}

function normalizePipeline(columns) {
  return columns.map((column, columnIndex) => ({
    ...column,
    id: column.id || `stage-${columnIndex}`,
    deals: withIds(column.deals || [], `deal-${columnIndex}`)
  }));
}

function loadState() {
  const stored = localStorage.getItem(storageKey);
  if (stored) {
    return JSON.parse(stored);
  }

  return {
    clients: withIds(defaultClients, "client"),
    companies: withIds(defaultCompanies, "company"),
    quotes: withIds(defaultQuotes, "quote"),
    tasks: withIds(defaultTasks, "task"),
    pipeline: normalizePipeline(defaultPipeline),
    activity: defaultActivity
  };
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function formatCurrency(value) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0
  }).format(value);
}

function parseMoney(value) {
  if (typeof value === "number") return value;
  const normalized = String(value).toLowerCase().replace(",", ".");
  const number = Number(normalized.replace(/[^0-9.]/g, ""));
  if (normalized.includes("m")) return Math.round(number * 1000000);
  return Number(String(value).replace(/\D/g, "")) || 0;
}

function addActivity(text) {
  state.activity = [text, ...state.activity].slice(0, 8);
}

function setActiveSection(sectionId) {
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.section === sectionId);
  });

  views.forEach((view) => {
    view.classList.toggle("active-view", view.id === sectionId);
  });

  const selected = document.querySelector(`[data-section="${sectionId}"]`);
  pageTitle.textContent = selected ? selected.textContent.trim() : "Dashboard";
}

function getVisibleClients() {
  const query = searchInput.value.toLowerCase().trim();
  const selectedStatus = statusFilter.value;

  return state.clients.filter((client) => {
    const matchesSearch = [client.name, client.company, client.email, client.status].some((value) =>
      String(value).toLowerCase().includes(query)
    );
    const matchesStatus = selectedStatus === "Todos" || client.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });
}

function renderDashboard() {
  const totalPipeline = state.pipeline
    .flatMap((column) => column.deals)
    .reduce((total, deal) => total + parseMoney(deal.amount), 0);
  const prospects = state.clients.filter((client) => client.status === "Prospecto").length;
  const openQuotes = state.quotes.filter((quote) => quoteOpenStatuses.includes(quote.status)).length;
  const highTasks = state.tasks.filter((task) => !task.done && task.priority === "Alta").length;
  const pendingTasks = state.tasks.filter((task) => !task.done).length;

  document.querySelector("#metric-sales").textContent = formatCurrency(totalPipeline);
  document.querySelector("#metric-sales-note").textContent = `${state.pipeline.flatMap((column) => column.deals).length} oportunidades`;
  document.querySelector("#metric-clients").textContent = state.clients.length;
  document.querySelector("#metric-prospects").textContent = `${prospects} prospectos`;
  document.querySelector("#metric-quotes").textContent = state.quotes.length;
  document.querySelector("#metric-open-quotes").textContent = `${openQuotes} abiertas`;
  document.querySelector("#metric-tasks").textContent = pendingTasks;
  document.querySelector("#metric-high-tasks").textContent = `${highTasks} de alta prioridad`;
}

function renderClients() {
  const table = document.querySelector("#clients-table");
  table.innerHTML = getVisibleClients()
    .map(
      (client) => `
        <tr>
          <td><strong>${client.name}</strong></td>
          <td>${client.company}</td>
          <td>${client.email}</td>
          <td><span class="status-pill">${client.status}</span></td>
          <td>${client.value}</td>
          <td class="row-actions">
            <button class="icon-button small" type="button" data-edit="client" data-id="${client.id}" aria-label="Editar ${client.name}" title="Editar"><i data-lucide="pencil"></i></button>
            <button class="icon-button small danger-button" type="button" data-delete="client" data-id="${client.id}" aria-label="Eliminar ${client.name}" title="Eliminar"><i data-lucide="trash-2"></i></button>
          </td>
        </tr>
      `
    )
    .join("");
}

function renderCompanies() {
  const grid = document.querySelector("#company-grid");
  grid.innerHTML = state.companies
    .map(
      (company) => `
        <article class="company-card">
          <div class="card-actions">
            <button class="icon-button small" type="button" data-edit="company" data-id="${company.id}" aria-label="Editar ${company.name}" title="Editar"><i data-lucide="pencil"></i></button>
            <button class="icon-button small danger-button" type="button" data-delete="company" data-id="${company.id}" aria-label="Eliminar ${company.name}" title="Eliminar"><i data-lucide="trash-2"></i></button>
          </div>
          <div class="company-avatar">${company.name.slice(0, 2).toUpperCase()}</div>
          <h3>${company.name}</h3>
          <p>${company.industry}</p>
          <div class="company-stats">
            <span>${company.contacts} contactos</span>
            <span>${company.revenue}</span>
          </div>
          <span class="health ${moneyColor[company.health]}">Salud ${company.health}</span>
        </article>
      `
    )
    .join("");
}

function renderFollowups() {
  const timeline = document.querySelector("#followups-list");
  timeline.innerHTML = followups
    .map(
      (item) => `
        <article class="timeline-item">
          <time>${item.date}</time>
          <div>
            <h3>${item.title}</h3>
            <p>${item.detail}</p>
          </div>
        </article>
      `
    )
    .join("");
}

function renderQuotes() {
  const grid = document.querySelector("#quotes-grid");
  grid.innerHTML = state.quotes
    .map(
      (quote) => `
        <article class="quote-card">
          <div class="card-actions">
            <button class="icon-button small" type="button" data-edit="quote" data-id="${quote.id}" aria-label="Editar ${quote.id}" title="Editar"><i data-lucide="pencil"></i></button>
            <button class="icon-button small danger-button" type="button" data-delete="quote" data-id="${quote.id}" aria-label="Eliminar ${quote.id}" title="Eliminar"><i data-lucide="trash-2"></i></button>
          </div>
          <span>${quote.code || quote.id}</span>
          <h3>${quote.client}</h3>
          <strong>${quote.amount}</strong>
          <div>
            <span class="status-pill">${quote.status}</span>
            <small>Vence ${quote.expires}</small>
          </div>
        </article>
      `
    )
    .join("");
}

function renderTasks() {
  const list = document.querySelector("#task-list");
  list.innerHTML = state.tasks
    .map(
      (task) => `
        <article class="task-item">
          <input type="checkbox" data-toggle-task="${task.id}" ${task.done ? "checked" : ""} aria-label="Completar tarea" />
          <span>
            <strong>${task.text}</strong>
            <small>${task.owner} - Prioridad ${task.priority}</small>
          </span>
          <div class="row-actions">
            <button class="icon-button small" type="button" data-edit="task" data-id="${task.id}" aria-label="Editar tarea" title="Editar"><i data-lucide="pencil"></i></button>
            <button class="icon-button small danger-button" type="button" data-delete="task" data-id="${task.id}" aria-label="Eliminar tarea" title="Eliminar"><i data-lucide="trash-2"></i></button>
          </div>
        </article>
      `
    )
    .join("");
}

function renderPipeline() {
  const board = document.querySelector("#pipeline-board");
  board.innerHTML = state.pipeline
    .map(
      (column) => `
        <section class="kanban-column" data-stage-id="${column.id}">
          <header>
            <h3>${column.stage}</h3>
            <span>${column.deals.length}</span>
          </header>
          <div class="drop-zone">
            ${column.deals
              .map(
                (deal) => `
                  <article class="deal-card" draggable="true" data-deal-id="${deal.id}" data-stage-id="${column.id}">
                    <div class="card-actions">
                      <button class="icon-button small" type="button" data-edit="deal" data-id="${deal.id}" aria-label="Editar ${deal.name}" title="Editar"><i data-lucide="pencil"></i></button>
                      <button class="icon-button small danger-button" type="button" data-delete="deal" data-id="${deal.id}" aria-label="Eliminar ${deal.name}" title="Eliminar"><i data-lucide="trash-2"></i></button>
                    </div>
                    <strong>${deal.name}</strong>
                    <span>${deal.amount}</span>
                    <small>${deal.owner}</small>
                  </article>
                `
              )
              .join("")}
          </div>
        </section>
      `
    )
    .join("");
}

function renderActivity() {
  const list = document.querySelector("#activity-list");
  list.innerHTML = state.activity.map((item) => `<li>${item}</li>`).join("");
}

function renderAll() {
  renderDashboard();
  renderActivity();
  renderClients();
  renderCompanies();
  renderFollowups();
  renderQuotes();
  renderTasks();
  renderPipeline();
  lucide.createIcons();
}

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

function getCollection(type) {
  if (type === "deal") return state.pipeline.flatMap((column) => column.deals);
  return state[collectionKeys[type]];
}

function findRecord(type, id) {
  return getCollection(type).find((item) => item.id === id);
}

function buildField([name, label, type, options], record = {}) {
  const value = name === "stageId" ? getDealStage(record.id) : record[name] || "";
  const optionList = name === "stageId" ? state.pipeline.map((column) => [column.id, column.stage]) : options;

  if (type === "select") {
    return `
      <label>
        <span>${label}</span>
        <select name="${name}" required>
          ${optionList
            .map((option) => {
              const optionValue = Array.isArray(option) ? option[0] : option;
              const optionLabel = Array.isArray(option) ? option[1] : option;
              return `<option value="${optionValue}" ${value === optionValue ? "selected" : ""}>${optionLabel}</option>`;
            })
            .join("")}
        </select>
      </label>
    `;
  }

  return `
    <label>
      <span>${label}</span>
      <input name="${name}" type="${type}" value="${value}" required />
    </label>
  `;
}

function openModal(type, id = null) {
  const record = id ? findRecord(type, id) : {};
  editing = { type, id };
  modalTitle.textContent = `${id ? "Editar" : "Nuevo"} ${getTypeLabel(type)}`;
  modalFields.innerHTML = fieldMap[type].map((field) => buildField(field, record)).join("");
  modal.showModal();
}

function closeModal() {
  modal.close();
  editing = null;
  recordForm.reset();
}

function getTypeLabel(type) {
  return {
    client: "cliente",
    company: "empresa",
    quote: "cotizacion",
    task: "tarea",
    deal: "oportunidad"
  }[type];
}

function getDealStage(dealId) {
  return state.pipeline.find((column) => column.deals.some((deal) => deal.id === dealId))?.id || state.pipeline[0].id;
}

function upsertRecord(type, data) {
  if (type === "deal") {
    upsertDeal(data);
    return;
  }

  const collection = state[collectionKeys[type]];
  if (editing.id) {
    const index = collection.findIndex((item) => item.id === editing.id);
    collection[index] = { ...collection[index], ...data };
    addActivity(`Registro editado: ${data.name || data.text || data.code || data.client}`);
  } else {
    collection.unshift({ id: `${type}-${Date.now()}`, ...data, done: false });
    addActivity(`Registro creado: ${data.name || data.text || data.code || data.client}`);
  }
}

function upsertDeal(data) {
  const { stageId, ...dealData } = data;
  state.pipeline.forEach((column) => {
    column.deals = column.deals.filter((deal) => deal.id !== editing.id);
  });

  const targetColumn = state.pipeline.find((column) => column.id === stageId) || state.pipeline[0];
  const nextDeal = { id: editing.id || `deal-${Date.now()}`, ...dealData };
  targetColumn.deals.unshift(nextDeal);
  addActivity(`${editing.id ? "Oportunidad editada" : "Oportunidad creada"}: ${nextDeal.name}`);
}

function deleteRecord(type, id) {
  if (!confirm("Esta accion eliminara el registro. ¿Continuar?")) return;

  if (type === "deal") {
    state.pipeline.forEach((column) => {
      column.deals = column.deals.filter((deal) => deal.id !== id);
    });
  } else {
    state[collectionKeys[type]] = state[collectionKeys[type]].filter((item) => item.id !== id);
  }

  addActivity(`Registro eliminado de ${getTypeLabel(type)}`);
  saveState();
  renderAll();
}

function handleFormSubmit(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(recordForm).entries());
  if (editing.type === "company") data.contacts = Number(data.contacts);
  upsertRecord(editing.type, data);
  saveState();
  closeModal();
  renderAll();
}

function handleBoardDrop(event) {
  const targetColumn = event.target.closest(".kanban-column");
  const dealId = event.dataTransfer.getData("text/plain");
  if (!targetColumn || !dealId) return;

  const sourceColumn = state.pipeline.find((column) => column.deals.some((deal) => deal.id === dealId));
  const deal = sourceColumn?.deals.find((item) => item.id === dealId);
  const nextColumn = state.pipeline.find((column) => column.id === targetColumn.dataset.stageId);

  if (!sourceColumn || !deal || !nextColumn || sourceColumn.id === nextColumn.id) return;

  sourceColumn.deals = sourceColumn.deals.filter((item) => item.id !== dealId);
  nextColumn.deals.unshift(deal);
  addActivity(`${deal.name} movida a ${nextColumn.stage}`);
  saveState();
  renderAll();
}

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const sectionId = link.dataset.section;
    history.replaceState(null, "", `#${sectionId}`);
    setActiveSection(sectionId);
  });
});

document.addEventListener("click", (event) => {
  const createButton = event.target.closest("[data-create]");
  const editButton = event.target.closest("[data-edit]");
  const deleteButton = event.target.closest("[data-delete]");
  const closeButton = event.target.closest("[data-close-modal]");

  if (createButton) openModal(createButton.dataset.create);
  if (editButton) openModal(editButton.dataset.edit, editButton.dataset.id);
  if (deleteButton) deleteRecord(deleteButton.dataset.delete, deleteButton.dataset.id);
  if (closeButton) closeModal();
});

document.addEventListener("change", (event) => {
  const taskId = event.target.dataset.toggleTask;
  if (!taskId) return;

  const task = state.tasks.find((item) => item.id === taskId);
  task.done = event.target.checked;
  saveState();
  renderAll();
});

document.addEventListener("dragstart", (event) => {
  const card = event.target.closest(".deal-card");
  if (!card) return;

  event.dataTransfer.setData("text/plain", card.dataset.dealId);
  card.classList.add("dragging");
});

document.addEventListener("dragend", (event) => {
  event.target.closest(".deal-card")?.classList.remove("dragging");
});

document.addEventListener("dragover", (event) => {
  if (event.target.closest(".kanban-column")) event.preventDefault();
});

document.addEventListener("drop", handleBoardDrop);
recordForm.addEventListener("submit", handleFormSubmit);
searchInput.addEventListener("input", renderClients);
statusFilter.addEventListener("change", renderClients);

renderAll();

const initialSection = location.hash.replace("#", "") || "dashboard";
setActiveSection(initialSection);
