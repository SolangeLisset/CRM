import { activity, clients, companies, followups, pipeline, quotes, tasks } from "./data.js";

const pageTitle = document.querySelector("#page-title");
const navLinks = document.querySelectorAll(".nav-link");
const views = document.querySelectorAll(".view");
const searchInput = document.querySelector("#global-search");

const moneyColor = {
  Alta: "success",
  Media: "warning",
  Baja: "danger"
};

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

function renderClients(list = clients) {
  const table = document.querySelector("#clients-table");
  table.innerHTML = list
    .map(
      (client) => `
        <tr>
          <td><strong>${client.name}</strong></td>
          <td>${client.company}</td>
          <td>${client.email}</td>
          <td><span class="status-pill">${client.status}</span></td>
          <td>${client.value}</td>
        </tr>
      `
    )
    .join("");
}

function renderCompanies() {
  const grid = document.querySelector("#company-grid");
  grid.innerHTML = companies
    .map(
      (company) => `
        <article class="company-card">
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
  grid.innerHTML = quotes
    .map(
      (quote) => `
        <article class="quote-card">
          <span>${quote.id}</span>
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
  list.innerHTML = tasks
    .map(
      (task) => `
        <label class="task-item">
          <input type="checkbox" ${task.done ? "checked" : ""} />
          <span>
            <strong>${task.text}</strong>
            <small>${task.owner} - Prioridad ${task.priority}</small>
          </span>
        </label>
      `
    )
    .join("");
}

function renderPipeline() {
  const board = document.querySelector("#pipeline-board");
  board.innerHTML = pipeline
    .map(
      (column) => `
        <section class="kanban-column">
          <header>
            <h3>${column.stage}</h3>
            <span>${column.deals.length}</span>
          </header>
          ${column.deals
            .map(
              (deal) => `
                <article class="deal-card">
                  <strong>${deal.name}</strong>
                  <span>${deal.amount}</span>
                  <small>${deal.owner}</small>
                </article>
              `
            )
            .join("")}
        </section>
      `
    )
    .join("");
}

function renderActivity() {
  const list = document.querySelector("#activity-list");
  list.innerHTML = activity.map((item) => `<li>${item}</li>`).join("");
}

function handleSearch(event) {
  const query = event.target.value.toLowerCase().trim();
  const filteredClients = clients.filter((client) =>
    [client.name, client.company, client.email, client.status].some((value) =>
      value.toLowerCase().includes(query)
    )
  );
  renderClients(filteredClients);
}

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const sectionId = link.dataset.section;
    history.replaceState(null, "", `#${sectionId}`);
    setActiveSection(sectionId);
  });
});

searchInput.addEventListener("input", handleSearch);

renderActivity();
renderClients();
renderCompanies();
renderFollowups();
renderQuotes();
renderTasks();
renderPipeline();

const initialSection = location.hash.replace("#", "") || "dashboard";
setActiveSection(initialSection);

lucide.createIcons();
