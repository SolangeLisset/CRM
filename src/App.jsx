import { useEffect, useMemo, useState } from "react";
import Clientes from "./components/Clientes.jsx";
import ClientDetail from "./components/ClientDetail.jsx";
import Cotizaciones from "./components/Cotizaciones.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Empresas from "./components/Empresas.jsx";
import Login from "./components/Login.jsx";
import ModalForm from "./components/ModalForm.jsx";
import Pipeline from "./components/Pipeline.jsx";
import Seguimientos from "./components/Seguimientos.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Tareas from "./components/Tareas.jsx";
import Topbar from "./components/Topbar.jsx";
import { followups } from "./data.js";
import { exportCsv } from "./utils/exportCsv.js";
import { parseMoney } from "./utils/money.js";
import { createInitialState, loadState, saveState, storageKey } from "./utils/storage.js";

const titles = {
  dashboard: "Dashboard",
  clientes: "Clientes",
  empresas: "Empresas",
  seguimientos: "Seguimientos",
  cotizaciones: "Cotizaciones",
  tareas: "Tareas",
  pipeline: "Pipeline"
};

const collectionKeys = {
  client: "clients",
  company: "companies",
  quote: "quotes",
  task: "tasks"
};

export default function App() {
  const [activeSection, setActiveSection] = useState(location.hash.replace("#", "") || "dashboard");
  const [search, setSearch] = useState("");
  const [clientStatus, setClientStatus] = useState("Todos");
  const [quoteStatus, setQuoteStatus] = useState("Todos");
  const [taskPriority, setTaskPriority] = useState("Todas");
  const [taskStatus, setTaskStatus] = useState("Todas");
  const [pipelineOwner, setPipelineOwner] = useState("Todos");
  const [state, setState] = useState(loadState);
  const [modal, setModal] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("crm-theme") || "light");
  const [session, setSession] = useState(() => {
    const stored = localStorage.getItem("crm-session");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("crm-theme", theme);
  }, [theme]);

  function changeSection(section) {
    setActiveSection(section);
    history.replaceState(null, "", `#${section}`);
  }

  const filteredClients = useMemo(() => {
    const query = search.toLowerCase().trim();
    return state.clients.filter((client) => {
      const matchesSearch = [client.name, client.company, client.email, client.status].some((value) =>
        String(value).toLowerCase().includes(query)
      );
      const matchesStatus = clientStatus === "Todos" || client.status === clientStatus;
      return matchesSearch && matchesStatus;
    });
  }, [clientStatus, search, state.clients]);

  const filteredCompanies = useMemo(() => {
    const query = search.toLowerCase().trim();
    return state.companies.filter((company) =>
      [company.name, company.industry, company.health].some((value) => String(value).toLowerCase().includes(query))
    );
  }, [search, state.companies]);

  const filteredQuotes = useMemo(() => {
    const query = search.toLowerCase().trim();
    return state.quotes.filter((quote) => {
      const matchesSearch = [quote.code, quote.client, quote.amount, quote.status, quote.expires].some((value) =>
        String(value || "").toLowerCase().includes(query)
      );
      const matchesStatus = quoteStatus === "Todos" || quote.status === quoteStatus;
      return matchesSearch && matchesStatus;
    });
  }, [quoteStatus, search, state.quotes]);

  const filteredTasks = useMemo(() => {
    const query = search.toLowerCase().trim();
    return state.tasks.filter((task) => {
      const matchesSearch = [task.text, task.owner, task.priority].some((value) => String(value).toLowerCase().includes(query));
      const matchesPriority = taskPriority === "Todas" || task.priority === taskPriority;
      const matchesStatus =
        taskStatus === "Todas" ||
        (taskStatus === "Pendientes" && !task.done) ||
        (taskStatus === "Completadas" && task.done);
      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [search, state.tasks, taskPriority, taskStatus]);

  const ownerOptions = useMemo(() => {
    const owners = state.pipeline.flatMap((stage) => stage.deals.map((deal) => deal.owner));
    return ["Todos", ...new Set(owners)];
  }, [state.pipeline]);

  const filteredPipeline = useMemo(() => {
    const query = search.toLowerCase().trim();
    return state.pipeline.map((stage) => ({
      ...stage,
      deals: stage.deals.filter((deal) => {
        const matchesSearch = [deal.name, deal.amount, deal.owner, stage.stage].some((value) =>
          String(value).toLowerCase().includes(query)
        );
        const matchesOwner = pipelineOwner === "Todos" || deal.owner === pipelineOwner;
        return matchesSearch && matchesOwner;
      })
    }));
  }, [pipelineOwner, search, state.pipeline]);

  const globalResults = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return [];

    const results = [
      ...state.clients.map((client) => ({
        id: client.id,
        section: "clientes",
        title: client.name,
        detail: `${client.company} - ${client.status}`,
        haystack: [client.name, client.company, client.email, client.status]
      })),
      ...state.companies.map((company) => ({
        id: company.id,
        section: "empresas",
        title: company.name,
        detail: `${company.industry} - Salud ${company.health}`,
        haystack: [company.name, company.industry, company.health]
      })),
      ...state.quotes.map((quote) => ({
        id: quote.id,
        section: "cotizaciones",
        title: quote.code || quote.id,
        detail: `${quote.client} - ${quote.status}`,
        haystack: [quote.code, quote.client, quote.amount, quote.status]
      })),
      ...state.tasks.map((task) => ({
        id: task.id,
        section: "tareas",
        title: task.text,
        detail: `${task.owner} - ${task.priority}`,
        haystack: [task.text, task.owner, task.priority]
      })),
      ...state.pipeline.flatMap((stage) =>
        stage.deals.map((deal) => ({
          id: deal.id,
          section: "pipeline",
          title: deal.name,
          detail: `${stage.stage} - ${deal.owner}`,
          haystack: [deal.name, deal.amount, deal.owner, stage.stage]
        }))
      )
    ];

    return results
      .filter((result) => result.haystack.some((value) => String(value || "").toLowerCase().includes(query)))
      .slice(0, 8);
  }, [search, state]);

  function addActivity(draft, text) {
    return {
      ...draft,
      activity: [text, ...draft.activity].slice(0, 8)
    };
  }

  function openCreate(type) {
    setModal({ type, record: null });
  }

  function openEdit(type, record, stageId = null) {
    setModal({ type, record, stageId });
  }

  function closeModal() {
    setModal(null);
  }

  function login(user) {
    localStorage.setItem("crm-session", JSON.stringify(user));
    setSession(user);
  }

  function logout() {
    localStorage.removeItem("crm-session");
    setSession(null);
  }

  function resetDemo() {
    if (!confirm("Esto restaurara los datos demo y borrara los cambios locales. Continuar?")) return;
    localStorage.removeItem(storageKey);
    setState(createInitialState());
    setSearch("");
    setSelectedClient(null);
  }

  function selectGlobalResult(result) {
    changeSection(result.section);
    if (result.section === "clientes") {
      const client = state.clients.find((item) => item.id === result.id);
      if (client) setSelectedClient(client);
    }
  }

  function getClientRelations(client) {
    const token = client.company.toLowerCase();
    return {
      quotes: state.quotes.filter((quote) => String(quote.client).toLowerCase().includes(token)),
      tasks: state.tasks.filter((task) => String(task.text).toLowerCase().includes(token)),
      followups: followups.filter((item) => String(item.detail).toLowerCase().includes(token)),
      history: state.activity.filter((item) => String(item).toLowerCase().includes(token)).slice(0, 5)
    };
  }

  function validateRecord(type, data) {
    if (type === "client" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      alert("Ingresa un email valido.");
      return false;
    }

    if ((type === "quote" || type === "deal" || type === "client") && parseMoney(data.amount || data.value) <= 0) {
      alert("Ingresa un monto valido con al menos un numero.");
      return false;
    }

    if (type === "quote" && !String(data.expires || "").trim()) {
      alert("Ingresa una fecha de vencimiento para la cotizacion.");
      return false;
    }

    return true;
  }

  function upsertRecord(data) {
    const type = modal.type;
    if (!validateRecord(type, data)) return;

    setState((current) => {
      if (type === "deal") return upsertDeal(current, data);

      const key = collectionKeys[type];
      const nextRecord = {
        id: modal.record?.id || `${type}-${Date.now()}`,
        ...modal.record,
        ...data
      };

      if (type === "company") nextRecord.contacts = Number(nextRecord.contacts);
      if (type === "task") nextRecord.done = modal.record?.done || false;

      const exists = current[key].some((item) => item.id === nextRecord.id);
      const records = exists
        ? current[key].map((item) => (item.id === nextRecord.id ? nextRecord : item))
        : [nextRecord, ...current[key]];

      return addActivity(
        { ...current, [key]: records },
        `${exists ? "Registro editado" : "Registro creado"}: ${nextRecord.name || nextRecord.text || nextRecord.code || nextRecord.client}`
      );
    });

    closeModal();
  }

  function upsertDeal(current, data) {
    const dealId = modal.record?.id || `deal-${Date.now()}`;
    const targetStageId = data.stageId || modal.stageId || current.pipeline[0].id;
    const nextDeal = { id: dealId, name: data.name, amount: data.amount, owner: data.owner };
    const exists = current.pipeline.some((stage) => stage.deals.some((deal) => deal.id === dealId));

    const pipeline = current.pipeline.map((stage) => {
      const withoutDeal = stage.deals.filter((deal) => deal.id !== dealId);
      return stage.id === targetStageId ? { ...stage, deals: [nextDeal, ...withoutDeal] } : { ...stage, deals: withoutDeal };
    });

    return addActivity(
      { ...current, pipeline },
      `${exists ? "Oportunidad editada" : "Oportunidad creada"}: ${nextDeal.name}`
    );
  }

  function deleteRecord(type, id) {
    if (!confirm("Esta accion eliminara el registro. Continuar?")) return;

    setState((current) => {
      if (type === "deal") {
        const pipeline = current.pipeline.map((stage) => ({
          ...stage,
          deals: stage.deals.filter((deal) => deal.id !== id)
        }));
        return addActivity({ ...current, pipeline }, "Oportunidad eliminada");
      }

      const key = collectionKeys[type];
      return addActivity(
        { ...current, [key]: current[key].filter((item) => item.id !== id) },
        "Registro eliminado"
      );
    });
  }

  function toggleTask(id, done) {
    setState((current) => ({
      ...current,
      tasks: current.tasks.map((task) => (task.id === id ? { ...task, done } : task))
    }));
  }

  function moveDeal(dealId, targetStageId) {
    setState((current) => {
      const sourceStage = current.pipeline.find((stage) => stage.deals.some((deal) => deal.id === dealId));
      const deal = sourceStage?.deals.find((item) => item.id === dealId);
      if (!sourceStage || !deal || sourceStage.id === targetStageId) return current;

      const targetStage = current.pipeline.find((stage) => stage.id === targetStageId);
      const pipeline = current.pipeline.map((stage) => {
        if (stage.id === sourceStage.id) {
          return { ...stage, deals: stage.deals.filter((item) => item.id !== dealId) };
        }
        if (stage.id === targetStageId) {
          return { ...stage, deals: [deal, ...stage.deals] };
        }
        return stage;
      });

      return addActivity({ ...current, pipeline }, `${deal.name} movida a ${targetStage.stage}`);
    });
  }

  function renderSection() {
    if (activeSection === "clientes") {
      return (
        <Clientes
          clients={filteredClients}
          filter={clientStatus}
          onFilterChange={setClientStatus}
          onCreate={() => openCreate("client")}
          onEdit={(record) => openEdit("client", record)}
          onDelete={(id) => deleteRecord("client", id)}
          onSelect={setSelectedClient}
          onExport={() => exportCsv("clientes-crm.csv", state.clients)}
        />
      );
    }

    if (activeSection === "empresas") {
      return (
        <Empresas
          companies={filteredCompanies}
          onCreate={() => openCreate("company")}
          onEdit={(record) => openEdit("company", record)}
          onDelete={(id) => deleteRecord("company", id)}
        />
      );
    }

    if (activeSection === "seguimientos") return <Seguimientos />;

    if (activeSection === "cotizaciones") {
      return (
        <Cotizaciones
          quotes={filteredQuotes}
          filter={quoteStatus}
          onFilterChange={setQuoteStatus}
          onCreate={() => openCreate("quote")}
          onEdit={(record) => openEdit("quote", record)}
          onDelete={(id) => deleteRecord("quote", id)}
          onExport={() => exportCsv("cotizaciones-crm.csv", state.quotes)}
        />
      );
    }

    if (activeSection === "tareas") {
      return (
        <Tareas
          tasks={filteredTasks}
          priorityFilter={taskPriority}
          statusFilter={taskStatus}
          onPriorityFilterChange={setTaskPriority}
          onStatusFilterChange={setTaskStatus}
          onCreate={() => openCreate("task")}
          onEdit={(record) => openEdit("task", record)}
          onDelete={(id) => deleteRecord("task", id)}
          onToggle={toggleTask}
        />
      );
    }

    if (activeSection === "pipeline") {
      return (
        <Pipeline
          pipeline={filteredPipeline}
          ownerFilter={pipelineOwner}
          ownerOptions={ownerOptions}
          onOwnerFilterChange={setPipelineOwner}
          onCreate={() => openCreate("deal")}
          onEdit={(record, stageId) => openEdit("deal", record, stageId)}
          onDelete={(id) => deleteRecord("deal", id)}
          onMoveDeal={moveDeal}
        />
      );
    }

    return <Dashboard state={state} />;
  }

  if (!session) return <Login onLogin={login} />;

  const clientRelations = selectedClient ? getClientRelations(selectedClient) : null;

  return (
    <div className="app-shell">
      <Sidebar activeSection={activeSection} onSectionChange={changeSection} />
      <main className="content">
        <Topbar
          title={titles[activeSection] || "Dashboard"}
          search={search}
          onSearchChange={setSearch}
          results={globalResults}
          onResultSelect={selectGlobalResult}
          theme={theme}
          onToggleTheme={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
          onResetDemo={resetDemo}
          user={session}
          onLogout={logout}
        />
        <section className="view active-view">{renderSection()}</section>
      </main>
      <ModalForm modal={modal} pipeline={state.pipeline} onClose={closeModal} onSubmit={upsertRecord} />
      <ClientDetail
        client={selectedClient}
        quotes={clientRelations?.quotes || []}
        tasks={clientRelations?.tasks || []}
        followups={clientRelations?.followups || []}
        history={clientRelations?.history || state.activity.slice(0, 5)}
        onClose={() => setSelectedClient(null)}
      />
    </div>
  );
}
