/* ==================================================
   CUSTOMER HUB
================================================== */
const customersSection = document.getElementById("customersView");
const showCustomersButton = document.getElementById("showCustomersButton");
const customersListElement = document.getElementById("customersList");
const customerDetailEmpty = document.getElementById("customerDetailEmpty");
const customerDetailContent = document.getElementById("customerDetailContent");
const customerSearchInput = document.getElementById("customerSearchInput");
const customerCommercialFilter = document.getElementById("customerCommercialFilter");
const customerStatusFilter = document.getElementById("customerStatusFilter");
const customerCommercialFilterWrap = document.getElementById("customerCommercialFilterWrap");
const customerPipelineFilter = document.getElementById("customerPipelineFilter");
const customersKanban = document.getElementById("customersKanban");
const customersKanbanShell = document.getElementById("customersKanbanShell");
const customerDrawerBackdrop = document.getElementById("customerDrawerBackdrop");
const customersListLayout = document.getElementById("customersListLayout");
const customersListViewButton = document.getElementById("customersListViewButton");
const customersKanbanViewButton = document.getElementById("customersKanbanViewButton");

const CUSTOMER_PIPELINE_STATES = [
  "Nuevo", "Contactado", "Demo realizada", "Propuesta enviada",
  "Negociación", "Ganado", "Perdido"
];

let customersCache = [];
let selectedCustomerId = "";
let customerSearchTimer = null;
let customerViewMode = "list";
let draggedCustomerId = "";
window.selectedCustomerId = "";

function customerValue(customer, key, fallback = "—") {
  const value = customer?.[key];
  return value === undefined || value === null || String(value).trim() === "" ? fallback : String(value);
}

function formatPortalMoney(value) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(Number(value || 0));
}

function formatCustomerDate(value) {
  const date = parsePortalDate(value);
  return date ? new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date) : "—";
}


function formatCustomerDateTime(value) {
  const date = parsePortalDate(value);
  return date ? new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date) : "—";
}

function getActivityLabel(type) {
  const labels = {
    "cliente.creado": "Cliente creado",
    "cliente.actualizado": "Cliente actualizado",
    "cliente.estadoComercial": "Cambio de fase comercial",
    "presupuesto.creado": "Presupuesto creado",
    "presupuesto.eliminado": "Presupuesto eliminado",
    "presupuesto.estado": "Estado de presupuesto",
    "oportunidad.creada": "Oportunidad creada",
    "oportunidad.actualizada": "Oportunidad actualizada",
    "oportunidad.estado": "Cambio de fase de oportunidad",
    "oportunidad.eliminada": "Oportunidad eliminada"
  };
  return labels[type] || type || "Actividad";
}

function getVisibleCustomers() {
  const status = String(customerStatusFilter?.value || "").trim().toLowerCase();
  const pipeline = String(customerPipelineFilter?.value || "").trim().toLowerCase();

  return customersCache.filter(customer => {
    const matchesStatus = !status || String(customer.Estado || "Activo").trim().toLowerCase() === status;
    const matchesPipeline = !pipeline || String(customer.EstadoComercial || "Nuevo").trim().toLowerCase() === pipeline;
    return matchesStatus && matchesPipeline;
  });
}

function renderPipelineKpis(customers) {
  const total = customers.length;
  const won = customers.filter(customer => String(customer.EstadoComercial || "Nuevo") === "Ganado").length;
  const lost = customers.filter(customer => String(customer.EstadoComercial || "Nuevo") === "Perdido").length;
  const open = total - won - lost;
  const closed = won + lost;
  const conversion = closed ? Math.round((won / closed) * 100) : 0;

  document.getElementById("pipelineTotalCustomers").textContent = total;
  document.getElementById("pipelineOpenCustomers").textContent = open;
  document.getElementById("pipelineWonCustomers").textContent = won;
  document.getElementById("pipelineConversionRate").textContent = `${conversion}%`;
}

function setCustomerViewMode(mode) {
  customerViewMode = mode === "kanban" ? "kanban" : "list";
  customersKanbanShell.classList.toggle("hidden", customerViewMode !== "kanban");
  customersListLayout.classList.toggle("kanban-drawer-host", customerViewMode === "kanban");
  customersListLayout.classList.toggle("hidden", customerViewMode === "kanban" && !selectedCustomerId);
  customersListViewButton.classList.toggle("active", customerViewMode === "list");
  customersKanbanViewButton.classList.toggle("active", customerViewMode === "kanban");
  document.body.classList.toggle("customer-kanban-mode", customerViewMode === "kanban");
  if (customerViewMode === "list") closeKanbanDrawer(false);
  renderCustomersList();
}

function openKanbanDrawer() {
  if (customerViewMode !== "kanban") return;
  customersListLayout.classList.remove("hidden");
  customersListLayout.classList.add("kanban-drawer-host", "drawer-open");
  customerDrawerBackdrop?.classList.remove("hidden");
  document.body.classList.add("customer-drawer-open");
}

function closeKanbanDrawer(clearSelection = true) {
  if (customerViewMode !== "kanban") return;
  customersListLayout.classList.remove("drawer-open");
  customersListLayout.classList.add("hidden");
  customerDrawerBackdrop?.classList.add("hidden");
  document.body.classList.remove("customer-drawer-open");
  if (clearSelection) selectedCustomerId = "";
}

function formatRelativeCustomerActivity(value) {
  const date = parsePortalDate(value);
  if (!date) return "Sin actividad";
  const diff = Date.now() - date.getTime();
  const minutes = Math.max(0, Math.floor(diff / 60000));
  if (minutes < 1) return "Ahora";
  if (minutes < 60) return `Hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Ayer";
  if (days < 30) return `Hace ${days} días`;
  return formatCustomerDate(value);
}

function renderCustomersKanban(customers) {
  const stateIcons = {
    "Nuevo": "●", "Contactado": "●", "Demo realizada": "●",
    "Propuesta enviada": "●", "Negociación": "●", "Ganado": "●", "Perdido": "●"
  };

  customersKanban.innerHTML = CUSTOMER_PIPELINE_STATES.map(state => {
    const stateCustomers = customers.filter(customer => String(customer.EstadoComercial || "Nuevo") === state);
    return `<section class="customer-kanban-column stage-${state.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-")}" data-pipeline-state="${escapeHtml(state)}">
      <header class="customer-kanban-column-header">
        <div><span class="customer-kanban-dot">${stateIcons[state]}</span><h2>${escapeHtml(state)}</h2></div>
        <span class="customer-kanban-count">${stateCustomers.length}</span>
      </header>
      <div class="customer-kanban-cards" data-drop-state="${escapeHtml(state)}">
        ${stateCustomers.length ? stateCustomers.map(customer => `
          <article class="customer-kanban-card" draggable="true" tabindex="0" role="button" data-customer-id="${escapeHtml(customer.IdCliente)}">
            <div class="customer-kanban-card-head">
              <div class="customer-kanban-avatar">${escapeHtml(customerValue(customer, "Nombre", "C").charAt(0).toUpperCase())}</div>
              <div><strong>${escapeHtml(customerValue(customer, "Nombre"))}</strong><small>${escapeHtml(customerValue(customer, "CIF"))}</small></div>
            </div>
            <div class="customer-kanban-card-meta">
              <span>👤 ${escapeHtml(customerValue(customer, "Comercial"))}</span>
              <span>☎ ${escapeHtml(customerValue(customer, "Teléfono"))}</span>
              <span>✉ ${escapeHtml(customerValue(customer, "Email"))}</span>
            </div>
            <footer><time>${escapeHtml(formatRelativeCustomerActivity(customer["ÚltimaActividad"]))}</time><span>Ver ficha →</span></footer>
          </article>`).join("") : '<div class="customer-kanban-empty"><span>＋</span><p>Sin clientes</p></div>'}
      </div>
    </section>`;
  }).join("");

  customersKanban.querySelectorAll("[data-customer-id]").forEach(card => {
    const openCard = () => {
      openCustomerDetail(card.dataset.customerId);
      openKanbanDrawer();
    };
    card.addEventListener("click", openCard);
    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openCard(); }
    });
    card.addEventListener("dragstart", event => {
      draggedCustomerId = card.dataset.customerId;
      card.classList.add("dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", draggedCustomerId);
    });
    card.addEventListener("dragend", () => {
      draggedCustomerId = "";
      card.classList.remove("dragging");
      customersKanban.querySelectorAll(".drag-over").forEach(el => el.classList.remove("drag-over"));
    });
  });

  customersKanban.querySelectorAll("[data-drop-state]").forEach(zone => {
    zone.addEventListener("dragover", event => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      zone.classList.add("drag-over");
    });
    zone.addEventListener("dragleave", event => {
      if (!zone.contains(event.relatedTarget)) zone.classList.remove("drag-over");
    });
    zone.addEventListener("drop", async event => {
      event.preventDefault();
      zone.classList.remove("drag-over");
      const id = event.dataTransfer.getData("text/plain") || draggedCustomerId;
      const customer = customersCache.find(item => item.IdCliente === id);
      const newStatus = zone.dataset.dropState;
      if (!customer || !newStatus || String(customer.EstadoComercial || "Nuevo") === newStatus) return;
      await updateCustomerCommercialStatus(customer, newStatus, { fromKanban: true });
    });
  });
}

function renderCustomersList() {
  const customers = getVisibleCustomers();
  renderPipelineKpis(customers);
  renderCustomersKanban(customers);
  document.getElementById("customersCountText").textContent = `${customers.length} ${customers.length === 1 ? "cliente" : "clientes"}`;

  if (!customers.length) {
    customersListElement.innerHTML = '<div class="customers-empty">No se han encontrado clientes con los filtros actuales.</div>';
    return;
  }

  customersListElement.innerHTML = customers.map(customer => {
    const inactive = String(customer.Estado || "Activo").toLowerCase() !== "activo";
    return `<button type="button" class="customer-list-item ${customer.IdCliente === selectedCustomerId ? "active" : ""}" data-customer-id="${escapeHtml(customer.IdCliente)}">
      <div class="customer-list-item-head">
        <div><h3>${escapeHtml(customerValue(customer, "Nombre"))}</h3><span class="customer-list-id">${escapeHtml(customerValue(customer, "IdCliente"))}</span></div>
        <div class="customer-card-badges">
          <span class="customer-pipeline-badge">${escapeHtml(customerValue(customer, "EstadoComercial", "Nuevo"))}</span>
          <span class="customer-status-badge ${inactive ? "inactive" : ""}">${escapeHtml(customerValue(customer, "Estado", "Activo"))}</span>
        </div>
      </div>
      <div class="customer-list-meta">
        <span>🏷 ${escapeHtml(customerValue(customer, "CIF"))}</span>
        <span>👤 ${escapeHtml(customerValue(customer, "Comercial"))}</span>
        <span>✉ ${escapeHtml(customerValue(customer, "Email"))}</span>
      </div>
    </button>`;
  }).join("");

  customersListElement.querySelectorAll("[data-customer-id]").forEach(button => {
    button.addEventListener("click", () => openCustomerDetail(button.dataset.customerId));
  });
}

async function loadCustomers(force = false) {
  customerPipelineFilter.innerHTML = '<option value="">Todas las fases</option>' + CUSTOMER_PIPELINE_STATES.map(state => `<option value="${escapeHtml(state)}">${escapeHtml(state)}</option>`).join("");
customerCommercialFilterWrap.classList.toggle("hidden", !isManagerUser());
  setPortalMessage("customersMessage", "Cargando clientes...", "loading");
  customersListElement.innerHTML = '<div class="customers-loading">Cargando cartera comercial…</div>';
  try {
    const response = await ApiClient.call("customer.list", {
      search: customerSearchInput?.value?.trim() || "",
      commercial: isManagerUser() ? customerCommercialFilter?.value || "" : ""
    }, { method: "GET" });

    if (!response?.success || !Array.isArray(response.clientes)) {
      throw new Error(response?.message || "No se han podido cargar los clientes.");
    }

    customersCache = response.clientes;
    refreshCustomerCommercialFilter();
    renderCustomersList();
    setPortalMessage("customersMessage", "", "");

    if (selectedCustomerId && !customersCache.some(customer => customer.IdCliente === selectedCustomerId)) {
      closeCustomerDetail();
    } else if (selectedCustomerId) {
      await openCustomerDetail(selectedCustomerId, false);
    }
  } catch (error) {
    console.error(error);
    customersListElement.innerHTML = '<div class="customers-empty">No se ha podido cargar la cartera de clientes.</div>';
    setPortalMessage("customersMessage", error.message, "error");
  }
}

function refreshCustomerCommercialFilter() {
  if (!customerCommercialFilter || !isManagerUser()) return;
  const current = customerCommercialFilter.value;
  const commercials = [...new Set(customersCache.map(customer => String(customer.Comercial || "").trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b, "es"));
  customerCommercialFilter.innerHTML = '<option value="">Todos los comerciales</option>' + commercials.map(name => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join("");
  if (commercials.includes(current)) customerCommercialFilter.value = current;
}

async function openCustomerDetail(customerId, reloadList = true) {
  selectedCustomerId = customerId;
  if (reloadList) renderCustomersList();
  customerDetailEmpty.classList.add("hidden");
  customerDetailContent.classList.remove("hidden");
  customerDetailContent.innerHTML = '<div class="customers-loading">Cargando ficha del cliente…</div>';

  try {
    const [customerResponse, budgetResponse, activityResponse] = await Promise.all([
      ApiClient.call("customer.get", { id: customerId }, { method: "GET" }),
      ApiClient.call("budget.list", {}, { method: "GET" }),
      ApiClient.call("activity.customer.list", { idCliente: customerId, limit: 100 }, { method: "GET" })
    ]);

    if (!customerResponse?.success || !customerResponse.cliente) {
      throw new Error(customerResponse?.message || "Cliente no encontrado.");
    }

    const customer = customerResponse.cliente;
    const budgets = Array.isArray(budgetResponse?.presupuestos)
      ? budgetResponse.presupuestos.filter(budget => String(budget.IdCliente || "").trim() === customerId)
      : [];
    const activities = Array.isArray(activityResponse?.actividades)
      ? activityResponse.actividades
      : [];

    renderCustomerDetail(customer, budgets, activities);
  } catch (error) {
    console.error(error);
    customerDetailContent.innerHTML = `<div class="customers-empty">${escapeHtml(error.message)}</div>`;
  }
}

function renderCustomerDetail(customer, budgets, activities = []) {
  const monthlyTotal = budgets.reduce((sum, budget) => sum + parsePortalMoney(budget["Total Mensual"]), 0);
  const acceptedBudgets = budgets.filter(budget => String(budget.Estado || "").trim().toLowerCase() === "aceptado").length;

  customerDetailContent.innerHTML = `
    <div class="customer-detail-header">
      <div>
        <p class="eyebrow">${escapeHtml(customerValue(customer, "IdCliente"))}</p>
        <h2>${escapeHtml(customerValue(customer, "Nombre"))}</h2>
        <span class="customer-status-badge ${String(customer.Estado || "Activo").toLowerCase() !== "activo" ? "inactive" : ""}">${escapeHtml(customerValue(customer, "Estado", "Activo"))}</span>
        <label class="customer-stage-control">
          <span>Fase comercial</span>
          <select id="customerCommercialStatusSelect">
            ${CUSTOMER_PIPELINE_STATES.map(state => `<option value="${escapeHtml(state)}" ${state === (customer.EstadoComercial || "Nuevo") ? "selected" : ""}>${escapeHtml(state)}</option>`).join("")}
          </select>
        </label>
      </div>
      <div class="customer-detail-actions">
        <button id="customerNewBudgetAction" type="button" class="portal-primary-button">Nueva simulación</button>
        <button id="customerEditAction" type="button" class="portal-secondary-button">Editar cliente</button>
      </div>
    </div>

    <nav class="customer-detail-tabs" aria-label="Secciones del cliente">
      <button type="button" class="customer-detail-tab active" data-customer-tab="summary">Resumen</button>
      <button type="button" class="customer-detail-tab" data-customer-tab="budgets">Presupuestos <span>${budgets.length}</span></button>
      <button type="button" class="customer-detail-tab" data-customer-tab="activity">Actividad <span>${activities.length}</span></button>
      <button type="button" class="customer-detail-tab" data-customer-tab="future">Más</button>
    </nav>

    <div class="customer-tab-panel" data-customer-panel="summary">
      <div class="customer-data-grid">
        ${renderCustomerDataItem("CIF / NIF", customerValue(customer, "CIF"))}
        ${renderCustomerDataItem("Comercial", customerValue(customer, "Comercial"))}
        ${renderCustomerDataItem("Teléfono", customerValue(customer, "Teléfono"))}
        ${renderCustomerDataItem("Email", customerValue(customer, "Email"))}
        ${renderCustomerDataItem("Dirección", customerValue(customer, "Dirección"))}
        ${renderCustomerDataItem("Localidad", [customerValue(customer, "Ciudad", ""), customerValue(customer, "Provincia", "")].filter(Boolean).join(", ") || "—")}
        ${renderCustomerDataItem("Fecha de alta", formatCustomerDate(customer.FechaAlta))}
        ${renderCustomerDataItem("Última actividad", formatCustomerDateTime(customer["ÚltimaActividad"]))}
      </div>
      <div class="kpi-grid customer-kpi-grid">
        <article class="kpi-card"><span>Presupuestos</span><strong>${budgets.length}</strong></article>
        <article class="kpi-card"><span>Importe mensual</span><strong>${formatPortalMoney(monthlyTotal)}</strong></article>
        <article class="kpi-card"><span>Aceptados</span><strong>${acceptedBudgets}</strong></article>
      </div>
      <section class="customer-detail-section">
        <div class="customer-section-heading"><h3>Últimos presupuestos</h3><button type="button" class="customer-link-button" data-open-customer-tab="budgets">Ver todos</button></div>
        <div class="customer-budget-list">${renderCustomerBudgets(budgets.slice(-4))}</div>
      </section>
    </div>

    <div class="customer-tab-panel hidden" data-customer-panel="budgets">
      <section class="customer-detail-section customer-detail-section-first">
        <div class="customer-section-heading"><h3>Presupuestos vinculados</h3><span>${budgets.length} registro${budgets.length === 1 ? "" : "s"}</span></div>
        <div class="customer-budget-list">${renderCustomerBudgets(budgets)}</div>
      </section>
    </div>

    <div class="customer-tab-panel hidden" data-customer-panel="activity">
      <section class="customer-detail-section customer-detail-section-first">
        <div class="customer-section-heading"><h3>Timeline del cliente</h3><span>${activities.length} evento${activities.length === 1 ? "" : "s"}</span></div>
        <div class="customer-activity-list">${renderCustomerActivity(activities)}</div>
      </section>
    </div>

    <div class="customer-tab-panel hidden" data-customer-panel="future">
      <div class="customer-future-grid">
        ${renderFutureModule("Seguimientos", "Tareas, llamadas y próximas acciones comerciales.")}
        ${renderFutureModule("Documentos", "Archivos y documentación asociados al cliente.")}
        ${renderFutureModule("Comentarios", "Notas internas del equipo comercial.")}
        ${renderFutureModule("Estadísticas", "Evolución e indicadores del cliente.")}
      </div>
    </div>`;

  document.getElementById("customerEditAction").addEventListener("click", () => openCustomerEditor(customer));
  document.getElementById("customerNewBudgetAction").addEventListener("click", () => startBudgetForCustomer(customer));
  document.getElementById("customerCommercialStatusSelect").addEventListener("change", event => {
    updateCustomerCommercialStatus(customer, event.target.value);
  });

  customerDetailContent.querySelectorAll("[data-customer-tab]").forEach(button => {
    button.addEventListener("click", () => activateCustomerDetailTab(button.dataset.customerTab));
  });
  customerDetailContent.querySelectorAll("[data-open-customer-tab]").forEach(button => {
    button.addEventListener("click", () => activateCustomerDetailTab(button.dataset.openCustomerTab));
  });
  customerDetailContent.querySelectorAll("[data-open-budget]").forEach(button => button.addEventListener("click", async () => {
    await openPortalView("history");
    const row = document.querySelector(`[data-budget-id="${CSS.escape(button.dataset.openBudget)}"]`);
    row?.scrollIntoView({ behavior: "smooth", block: "center" });
  }));
}

async function updateCustomerCommercialStatus(customer, newStatus, options = {}) {
  const select = document.getElementById("customerCommercialStatusSelect");
  const previousStatus = customer.EstadoComercial || "Nuevo";
  if (newStatus === previousStatus) return;

  if (select) select.disabled = true;
  setPortalMessage("customersMessage", "Actualizando fase comercial...", "loading");
  try {
    const response = await ApiClient.call("customer.updateCommercialStatus", {
      id: customer.IdCliente,
      estadoComercial: newStatus
    });
    if (!response?.success) throw new Error(response?.message || "No se ha podido actualizar la fase comercial.");

    customer.EstadoComercial = newStatus;
    const cachedCustomer = customersCache.find(item => item.IdCliente === customer.IdCliente);
    if (cachedCustomer) {
      cachedCustomer.EstadoComercial = newStatus;
      cachedCustomer["ÚltimaActividad"] = new Date().toISOString();
    }
    renderCustomersList();
    if (!options.fromKanban || selectedCustomerId === customer.IdCliente) await openCustomerDetail(customer.IdCliente, false);
    setPortalMessage("customersMessage", response.message || "Fase comercial actualizada.", "success");
  } catch (error) {
    console.error(error);
    if (select) select.value = previousStatus;
    setPortalMessage("customersMessage", error.message, "error");
  } finally {
    if (select) select.disabled = false;
  }
}

function activateCustomerDetailTab(tabName) {
  customerDetailContent.querySelectorAll("[data-customer-tab]").forEach(button => {
    button.classList.toggle("active", button.dataset.customerTab === tabName);
  });
  customerDetailContent.querySelectorAll("[data-customer-panel]").forEach(panel => {
    panel.classList.toggle("hidden", panel.dataset.customerPanel !== tabName);
  });
}

function renderFutureModule(title, description) {
  return `<article class="customer-future-card"><span>Próximamente</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(description)}</p></article>`;
}

function renderCustomerActivity(activities) {
  if (!activities.length) {
    return '<div class="customers-empty">Todavía no hay actividad registrada para este cliente.</div>';
  }

  return activities.map(activity => `
    <article class="customer-activity-item">
      <div class="customer-activity-marker"></div>
      <div class="customer-activity-content">
        <div class="customer-activity-heading">
          <strong>${escapeHtml(getActivityLabel(String(activity.Tipo || "")))}</strong>
          <time>${escapeHtml(formatCustomerDateTime(activity.Fecha))}</time>
        </div>
        <p>${escapeHtml(String(activity.Descripcion || "Sin descripción"))}</p>
        <small>${escapeHtml(String(activity.Usuario || "Sistema"))}${activity.IdPresupuesto ? ` · ${escapeHtml(String(activity.IdPresupuesto))}` : ""}</small>
      </div>
    </article>`).join("");
}

function renderCustomerDataItem(label, value) {
  return `<div class="customer-data-item"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`;
}

function renderCustomerBudgets(budgets) {
  if (!budgets.length) return '<div class="customers-empty">Todavía no hay presupuestos vinculados mediante IdCliente.</div>';

  return budgets.slice().reverse().map(budget => {
    const id = String(budget["ID Presupuesto"] || "").trim();
    return `<button type="button" class="customer-budget-item" data-open-budget="${escapeHtml(id)}">
      <div>
        <strong>${escapeHtml(id || "Presupuesto")}</strong>
        <small>${escapeHtml(String(budget.Solución || ""))} · ${escapeHtml(formatCustomerDate(budget.Fecha))}</small>
      </div>
      <div class="customer-budget-side">
        <span class="customer-budget-status">${escapeHtml(String(budget.Estado || "Generado"))}</span>
        <strong class="customer-budget-amount">${escapeHtml(String(budget["Total Mensual"] || "—"))}</strong>
      </div>
    </button>`;
  }).join("");
}

function closeCustomerDetail() {
  selectedCustomerId = "";
  customerDetailContent.classList.add("hidden");
  customerDetailEmpty.classList.remove("hidden");
  if (customerViewMode === "kanban") closeKanbanDrawer(false);
  renderCustomersList();
}

function openCustomerEditor(customer = null) {
  const editing = Boolean(customer?.IdCliente);
  document.getElementById("customerEditorTitle").textContent = editing ? "Editar cliente" : "Nuevo cliente";
  document.getElementById("customerEditorSubtitle").textContent = editing ? "Actualiza la información de la ficha comercial." : "Añade los datos principales del cliente.";
  document.getElementById("customerEditorId").value = customer?.IdCliente || "";
  document.getElementById("customerEditorName").value = customer?.Nombre || "";
  document.getElementById("customerEditorTaxId").value = customer?.CIF || "";
  document.getElementById("customerEditorCommercial").value = customer?.Comercial || currentSession?.user?.commercial || "";
  document.getElementById("customerEditorPhone").value = customer?.["Teléfono"] || "";
  document.getElementById("customerEditorEmail").value = customer?.Email || "";
  document.getElementById("customerEditorAddress").value = customer?.["Dirección"] || "";
  document.getElementById("customerEditorCity").value = customer?.Ciudad || "";
  document.getElementById("customerEditorProvince").value = customer?.Provincia || "";
  document.getElementById("customerEditorStatus").value = customer?.Estado || "Activo";
  document.getElementById("customerEditorCommercial").disabled = !isManagerUser();
  document.getElementById("customerEditorModal").classList.remove("hidden");
  setPortalMessage("customerEditorMessage", "", "");
}

function closeCustomerEditor() {
  document.getElementById("customerEditorModal").classList.add("hidden");
}

async function saveCustomerFromEditor(event) {
  event.preventDefault();
  const id = document.getElementById("customerEditorId").value.trim();
  const button = document.getElementById("saveCustomerButton");
  const data = {
    Nombre: document.getElementById("customerEditorName").value.trim(),
    CIF: document.getElementById("customerEditorTaxId").value.trim(),
    Comercial: document.getElementById("customerEditorCommercial").value.trim(),
    "Teléfono": document.getElementById("customerEditorPhone").value.trim(),
    Email: document.getElementById("customerEditorEmail").value.trim(),
    "Dirección": document.getElementById("customerEditorAddress").value.trim(),
    Ciudad: document.getElementById("customerEditorCity").value.trim(),
    Provincia: document.getElementById("customerEditorProvince").value.trim(),
    Estado: document.getElementById("customerEditorStatus").value
  };
  button.disabled = true;
  setPortalMessage("customerEditorMessage", "Guardando cliente...", "loading");
  try {
    const response = await ApiClient.call(id ? "customer.update" : "customer.create", id ? { id, data } : { data });
    if (!response?.success) throw new Error(response?.message || "No se ha podido guardar el cliente.");
    closeCustomerEditor();
    selectedCustomerId = response.id || id;
    await loadCustomers(true);
    await openCustomerDetail(selectedCustomerId);
    setPortalMessage("customersMessage", response.message || "Cliente guardado correctamente.", "success");
  } catch (error) {
    console.error(error);
    setPortalMessage("customerEditorMessage", error.message, "error");
  } finally {
    button.disabled = false;
  }
}

function startBudgetForCustomer(customer) {
  window.selectedCustomerId = customer.IdCliente || "";
  document.getElementById("clientName").value = customer.Nombre || "";
  document.getElementById("clientTaxId").value = customer.CIF || "";
  document.getElementById("clientAddress").value = customer["Dirección"] || "";
  document.getElementById("clientCity").value = customer.Ciudad || "";
  document.getElementById("clientProvince").value = customer.Provincia || "";
  document.getElementById("clientEmail").value = customer.Email || "";
  document.getElementById("clientPhone").value = customer["Teléfono"] || "";
  updateLinkedCustomerNotice(customer.Nombre || customer.IdCliente);
  openPortalView("calculator");
  setPortalMessage("customersMessage", "Cliente preparado para el próximo presupuesto.", "success");
}

function updateLinkedCustomerNotice(name = "") {
  const notice = document.getElementById("linkedCustomerNotice");
  const label = document.getElementById("linkedCustomerName");
  if (!notice || !label) return;
  notice.classList.toggle("hidden", !window.selectedCustomerId);
  label.textContent = name || window.selectedCustomerId || "—";
}

function unlinkCustomerFromBudget() {
  window.selectedCustomerId = "";
  updateLinkedCustomerNotice("");
  if (budgetCustomerSearchInput) budgetCustomerSearchInput.value = "";
  hideBudgetCustomerResults();
  setBudgetCustomerSearchMessage("Cliente desvinculado. Puedes buscar otro o utilizar los datos actuales.", "");
}


/* ==================================================
   SELECTOR DE CLIENTE EN GENERACION DE PRESUPUESTO
================================================== */
const budgetCustomerSearchInput = document.getElementById("budgetCustomerSearchInput");
const budgetCustomerSearchResults = document.getElementById("budgetCustomerSearchResults");
const budgetCustomerSearchMessage = document.getElementById("budgetCustomerSearchMessage");
let budgetCustomerPickerCache = [];
let budgetCustomerSearchTimer = null;
let budgetCustomerSearchRequest = 0;

function setBudgetCustomerSearchMessage(message = "", type = "") {
  if (!budgetCustomerSearchMessage) return;
  budgetCustomerSearchMessage.textContent = message;
  budgetCustomerSearchMessage.dataset.type = type;
}

function hideBudgetCustomerResults() {
  if (!budgetCustomerSearchResults) return;
  budgetCustomerSearchResults.classList.add("hidden");
  budgetCustomerSearchResults.innerHTML = "";
}

function fillBudgetCustomerFields(customer) {
  const values = {
    clientName: customer.Nombre || "",
    clientTaxId: customer.CIF || "",
    clientAddress: customer["Dirección"] || "",
    clientCity: customer.Ciudad || "",
    clientProvince: customer.Provincia || "",
    clientEmail: customer.Email || "",
    clientPhone: customer["Teléfono"] || ""
  };

  Object.entries(values).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) element.value = value;
  });
}

function selectCustomerForBudget(customer) {
  if (!customer?.IdCliente) return;
  window.selectedCustomerId = customer.IdCliente;
  fillBudgetCustomerFields(customer);
  updateLinkedCustomerNotice(customer.Nombre || customer.IdCliente);
  if (budgetCustomerSearchInput) budgetCustomerSearchInput.value = "";
  hideBudgetCustomerResults();
  setBudgetCustomerSearchMessage("Cliente seleccionado y datos completados.", "success");
}

function renderBudgetCustomerResults(customers) {
  if (!budgetCustomerSearchResults) return;

  if (!customers.length) {
    budgetCustomerSearchResults.innerHTML = '<div class="budget-customer-result-empty">No se han encontrado clientes. Puedes rellenar los datos y se creará automáticamente al guardar.</div>';
    budgetCustomerSearchResults.classList.remove("hidden");
    return;
  }

  budgetCustomerSearchResults.innerHTML = customers.map(customer => `
    <button type="button" class="budget-customer-result" role="option" data-budget-customer-id="${escapeHtml(customer.IdCliente)}">
      <span class="budget-customer-result-main">
        <strong>${escapeHtml(customerValue(customer, "Nombre"))}</strong>
        <small>${escapeHtml(customerValue(customer, "IdCliente"))}</small>
      </span>
      <span class="budget-customer-result-meta">
        <span>${escapeHtml(customerValue(customer, "CIF"))}</span>
        <span>${escapeHtml(customerValue(customer, "Email"))}</span>
        <span>${escapeHtml(customerValue(customer, "Teléfono"))}</span>
      </span>
    </button>`).join("");

  budgetCustomerSearchResults.classList.remove("hidden");
  budgetCustomerSearchResults.querySelectorAll("[data-budget-customer-id]").forEach(button => {
    button.addEventListener("click", () => {
      const customer = budgetCustomerPickerCache.find(item => item.IdCliente === button.dataset.budgetCustomerId);
      if (customer) selectCustomerForBudget(customer);
    });
  });
}

async function searchCustomersForBudget(search = "") {
  const requestId = ++budgetCustomerSearchRequest;
  setBudgetCustomerSearchMessage("Buscando clientes...", "loading");

  try {
    const response = await ApiClient.call("customer.list", { search: search.trim() }, { method: "GET" });
    if (requestId !== budgetCustomerSearchRequest) return;
    if (!response?.success || !Array.isArray(response.clientes)) {
      throw new Error(response?.message || "No se han podido consultar los clientes.");
    }

    budgetCustomerPickerCache = response.clientes.slice(0, 12);
    renderBudgetCustomerResults(budgetCustomerPickerCache);
    setBudgetCustomerSearchMessage(
      budgetCustomerPickerCache.length ? `${budgetCustomerPickerCache.length} resultado${budgetCustomerPickerCache.length === 1 ? "" : "s"}` : "",
      ""
    );
  } catch (error) {
    if (requestId !== budgetCustomerSearchRequest) return;
    console.error(error);
    hideBudgetCustomerResults();
    setBudgetCustomerSearchMessage(error.message, "error");
  }
}

async function prepareCustomerPickerForBudget() {
  if (!budgetCustomerSearchInput) return;
  budgetCustomerSearchInput.value = "";
  hideBudgetCustomerResults();
  setBudgetCustomerSearchMessage("Escribe al menos 2 caracteres para buscar.", "");

  if (window.selectedCustomerId) {
    const knownCustomer = customersCache.find(customer => customer.IdCliente === window.selectedCustomerId);
    updateLinkedCustomerNotice(knownCustomer?.Nombre || document.getElementById("clientName")?.value || window.selectedCustomerId);
  } else {
    updateLinkedCustomerNotice("");
  }
}

budgetCustomerSearchInput?.addEventListener("input", () => {
  clearTimeout(budgetCustomerSearchTimer);
  const search = budgetCustomerSearchInput.value.trim();
  if (search.length < 2) {
    budgetCustomerSearchRequest += 1;
    hideBudgetCustomerResults();
    setBudgetCustomerSearchMessage("Escribe al menos 2 caracteres para buscar.", "");
    return;
  }
  budgetCustomerSearchTimer = setTimeout(() => searchCustomersForBudget(search), 280);
});

budgetCustomerSearchInput?.addEventListener("keydown", event => {
  if (event.key === "Escape") hideBudgetCustomerResults();
});

showCustomersButton.addEventListener("click", () => openPortalView("customers"));
document.getElementById("newCustomerButton").addEventListener("click", () => openCustomerEditor());
document.getElementById("refreshCustomersButton").addEventListener("click", () => loadCustomers(true));
document.getElementById("closeCustomerEditorButton").addEventListener("click", closeCustomerEditor);
document.getElementById("cancelCustomerEditorButton").addEventListener("click", closeCustomerEditor);
document.getElementById("customerEditorForm").addEventListener("submit", saveCustomerFromEditor);
document.getElementById("unlinkCustomerButton").addEventListener("click", unlinkCustomerFromBudget);
customerStatusFilter.addEventListener("change", renderCustomersList);
customerPipelineFilter.addEventListener("change", renderCustomersList);
customersListViewButton.addEventListener("click", () => setCustomerViewMode("list"));
customersKanbanViewButton.addEventListener("click", () => setCustomerViewMode("kanban"));
customerDrawerBackdrop?.addEventListener("click", () => closeCustomerDetail());
document.addEventListener("keydown", event => { if (event.key === "Escape" && customerViewMode === "kanban" && selectedCustomerId) closeCustomerDetail(); });
customerCommercialFilter.addEventListener("change", () => loadCustomers(true));
customerSearchInput.addEventListener("input", () => {
  clearTimeout(customerSearchTimer);
  customerSearchTimer = setTimeout(() => loadCustomers(true), 350);
});
customerPipelineFilter.innerHTML = '<option value="">Todas las fases</option>' + CUSTOMER_PIPELINE_STATES.map(state => `<option value="${escapeHtml(state)}">${escapeHtml(state)}</option>`).join("");
customerCommercialFilterWrap.classList.toggle("hidden", !isManagerUser());
