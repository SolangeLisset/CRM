import { useEffect, useMemo, useState } from "react";
import Clientes from "./components/Clientes.jsx";
import Cotizaciones from "./components/Cotizaciones.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Empresas from "./components/Empresas.jsx";
import ModalForm from "./components/ModalForm.jsx";
import Pipeline from "./components/Pipeline.jsx";
import Seguimientos from "./components/Seguimientos.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Tareas from "./components/Tareas.jsx";
import Topbar from "./components/Topbar.jsx";
import { loadState, saveState } from "./utils/storage.js";

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
  const [state, setState] = useState(loadState);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    saveState(state);
  }, [state]);

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

  function upsertRecord(data) {
    const type = modal.type;

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
    if (!confirm("Esta accion eliminara el registro. ¿Continuar?")) return;

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
        />
      );
    }

    if (activeSection === "empresas") {
      return (
        <Empresas
          companies={state.companies}
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
          quotes={state.quotes}
          onCreate={() => openCreate("quote")}
          onEdit={(record) => openEdit("quote", record)}
          onDelete={(id) => deleteRecord("quote", id)}
        />
      );
    }

    if (activeSection === "tareas") {
      return (
        <Tareas
          tasks={state.tasks}
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
          pipeline={state.pipeline}
          onCreate={() => openCreate("deal")}
          onEdit={(record, stageId) => openEdit("deal", record, stageId)}
          onDelete={(id) => deleteRecord("deal", id)}
          onMoveDeal={moveDeal}
        />
      );
    }

    return <Dashboard state={state} />;
  }

  return (
    <div className="app-shell">
      <Sidebar activeSection={activeSection} onSectionChange={changeSection} />
      <main className="content">
        <Topbar title={titles[activeSection] || "Dashboard"} search={search} onSearchChange={setSearch} />
        <section className="view active-view">{renderSection()}</section>
      </main>
      <ModalForm modal={modal} pipeline={state.pipeline} onClose={closeModal} onSubmit={upsertRecord} />
    </div>
  );
}
