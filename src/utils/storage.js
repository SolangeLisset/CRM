import {
  activity as defaultActivity,
  clients as defaultClients,
  companies as defaultCompanies,
  pipeline as defaultPipeline,
  quotes as defaultQuotes,
  tasks as defaultTasks
} from "../data.js";

export const storageKey = "crm-comercial-react-state";

export function withIds(list, prefix) {
  return list.map((item, index) => ({
    id: item.id || `${prefix}-${Date.now()}-${index}`,
    ...item
  }));
}

export function normalizePipeline(columns) {
  return columns.map((column, index) => ({
    ...column,
    id: column.id || `stage-${index}`,
    deals: withIds(column.deals || [], `deal-${index}`)
  }));
}

export function createInitialState() {
  return {
    clients: withIds(defaultClients, "client"),
    companies: withIds(defaultCompanies, "company"),
    quotes: withIds(defaultQuotes, "quote"),
    tasks: withIds(defaultTasks, "task"),
    pipeline: normalizePipeline(defaultPipeline),
    activity: defaultActivity
  };
}

export function loadState() {
  const stored = localStorage.getItem(storageKey);
  return stored ? JSON.parse(stored) : createInitialState();
}

export function saveState(state) {
  localStorage.setItem(storageKey, JSON.stringify(state));
}
