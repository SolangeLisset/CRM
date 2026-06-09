export const clients = [
  {
    name: "Camila Rojas",
    company: "Andes Digital",
    email: "camila@andesdigital.cl",
    status: "Cliente activo",
    value: "$12.400.000"
  },
  {
    name: "Mateo Fuentes",
    company: "Norte Energia",
    email: "mateo@norteenergia.cl",
    status: "Prospecto",
    value: "$8.900.000"
  },
  {
    name: "Valentina Soto",
    company: "Logistica Sur",
    email: "valentina@logisticasur.cl",
    status: "Negociacion",
    value: "$15.700.000"
  },
  {
    name: "Ignacio Herrera",
    company: "Retail Nova",
    email: "ignacio@retailnova.cl",
    status: "Seguimiento",
    value: "$6.300.000"
  }
];

export const companies = [
  { name: "Andes Digital", industry: "Software B2B", contacts: 8, revenue: "$24.5M", health: "Alta" },
  { name: "Norte Energia", industry: "Energia", contacts: 5, revenue: "$18.9M", health: "Media" },
  { name: "Logistica Sur", industry: "Transporte", contacts: 11, revenue: "$31.2M", health: "Alta" },
  { name: "Retail Nova", industry: "Retail", contacts: 4, revenue: "$9.8M", health: "Baja" }
];

export const followups = [
  { title: "Llamada de descubrimiento", detail: "Norte Energia quiere revisar integraciones.", date: "Hoy, 10:30" },
  { title: "Enviar propuesta ajustada", detail: "Logistica Sur solicito plan por sucursales.", date: "Hoy, 15:00" },
  { title: "Demo comercial", detail: "Andes Digital evaluara modulo de reportes.", date: "Manana, 11:00" },
  { title: "Reunion de cierre", detail: "Retail Nova pidio terminos finales.", date: "Viernes, 09:00" }
];

export const quotes = [
  { id: "COT-1048", client: "Andes Digital", amount: "$12.400.000", status: "Enviada", expires: "18 Jun" },
  { id: "COT-1049", client: "Logistica Sur", amount: "$15.700.000", status: "Revision", expires: "20 Jun" },
  { id: "COT-1050", client: "Norte Energia", amount: "$8.900.000", status: "Borrador", expires: "24 Jun" },
  { id: "COT-1051", client: "Retail Nova", amount: "$6.300.000", status: "Aprobada", expires: "28 Jun" }
];

export const tasks = [
  { text: "Preparar propuesta para Norte Energia", owner: "Solange", priority: "Alta", done: false },
  { text: "Actualizar datos de contacto de Retail Nova", owner: "Ventas", priority: "Media", done: true },
  { text: "Enviar resumen de demo a Andes Digital", owner: "Solange", priority: "Alta", done: false },
  { text: "Revisar vencimientos de cotizaciones", owner: "Finanzas", priority: "Baja", done: false }
];

export const pipeline = [
  {
    stage: "Prospectos",
    deals: [
      { name: "Norte Energia", amount: "$8.9M", owner: "Solange" },
      { name: "Clinica Central", amount: "$5.4M", owner: "Ventas" }
    ]
  },
  {
    stage: "Calificados",
    deals: [
      { name: "AgroValle", amount: "$7.2M", owner: "Solange" },
      { name: "Tech Studio", amount: "$4.8M", owner: "Ventas" }
    ]
  },
  {
    stage: "Negociacion",
    deals: [
      { name: "Logistica Sur", amount: "$15.7M", owner: "Solange" },
      { name: "Retail Nova", amount: "$6.3M", owner: "Ventas" }
    ]
  },
  {
    stage: "Ganados",
    deals: [
      { name: "Andes Digital", amount: "$12.4M", owner: "Solange" }
    ]
  }
];

export const activity = [
  "Nueva cotizacion enviada a Andes Digital",
  "Seguimiento agendado con Logistica Sur",
  "Tarea completada para Retail Nova",
  "Prospecto agregado: Clinica Central"
];
