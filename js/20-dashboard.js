/* ==================================================
   DASHBOARD V2 · WIDGET FRAMEWORK + ACTIONS
================================================== */
const DashboardWorkspace = (() => {
  const STORAGE_KEY = "shine.dashboard.widgetOrder.v1";
  let summary = null;
  let dashboardCustomers = [];
  let dashboardOpportunities = [];
  let editingAction = null;

  const money = value => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(Number(value || 0));
  const escape = value => typeof escapeHtml === "function" ? escapeHtml(String(value ?? "")) : String(value ?? "");

  function dateKey(value) {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  function formatDate(value, options = { day: "2-digit", month: "short" }) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "Sin fecha" : new Intl.DateTimeFormat("es-ES", options).format(date);
  }

  function greeting() {
    const hour = new Date().getHours();
    if (hour < 13) return "Buenos días";
    if (hour < 20) return "Buenas tardes";
    return "Buenas noches";
  }

  function userName() {
    return currentSession?.user?.commercial || currentSession?.commercial || currentSession?.user?.username || "";
  }

  async function load(force = false) {
    const message = document.getElementById("dashboardMessage");
    if (message) setPortalMessage("dashboardMessage", "Actualizando tu espacio de trabajo…", "loading");
    try {
      const response = await ApiClient.call("dashboard.summary", { refresh: force ? "1" : "0" }, { method: "GET" });
      if (!response?.success || !response.summary) throw new Error(response?.message || "No se ha podido cargar el dashboard.");
      summary = response.summary;
      render();
      if (message) setPortalMessage("dashboardMessage", "", "");
      dashboardLoaded = true;
    } catch (error) {
      console.error(error);
      if (message) setPortalMessage("dashboardMessage", error.message, "error");
    }
  }

  function render() {
    const welcome = document.getElementById("dashboardV2Welcome");
    const date = document.getElementById("dashboardV2Date");
    if (welcome) welcome.textContent = `${greeting()}, ${userName()}`;
    if (date) date.textContent = new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date());

    const kpis = summary?.kpis || {};
    setText("dashboardPipelineValue", money(kpis.pipeline));
    setText("dashboardForecastValue", money(kpis.weighted));
    setText("dashboardWonValue", String(kpis.won || 0));
    setText("dashboardPendingValue", String(kpis.pending || 0));

    renderAgenda();
    renderPriorityOpportunities();
    renderRecentActivity();
    renderAttentionWidget();
    restoreWidgetOrder();
    enableWidgetSorting();
  }

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  }

  function actionIcon(type) {
    const icons = { Llamada: "☎", Email: "✉", Demo: "▣", Reunión: "◉", Seguimiento: "↗", Tarea: "✓" };
    return icons[type] || "•";
  }

  function renderAgenda() {
    const element = document.getElementById("dashboardTodayActions");
    if (!element) return;
    const items = summary?.todayActions || [];
    element.innerHTML = items.length ? items.map(action => `
      <button class="dashboard-action-row" type="button" data-dashboard-action="${escape(action.IdAccion)}">
        <span class="dashboard-action-time">${escape(action.Hora || "Todo el día")}</span>
        <span class="dashboard-action-icon">${actionIcon(action.Tipo)}</span>
        <span class="dashboard-action-copy"><strong>${escape(action.Tipo)}</strong><small>${escape(action.Notas || action.IdCliente || "Acción comercial")}</small></span>
        <span class="dashboard-priority priority-${escape(String(action.Prioridad || "Media").toLowerCase())}">${escape(action.Prioridad || "Media")}</span>
      </button>`).join("") : '<div class="dashboard-empty"><span>✓</span><strong>Agenda despejada</strong><p>No tienes acciones pendientes para hoy.</p></div>';

    element.querySelectorAll("[data-dashboard-action]").forEach(button => {
      button.addEventListener("click", () => openActionEditor(items.find(item => item.IdAccion === button.dataset.dashboardAction)));
    });
  }

  function renderPriorityOpportunities() {
    const element = document.getElementById("dashboardPriorityOpportunities");
    if (!element) return;
    const items = summary?.priorityOpportunities || [];
    element.innerHTML = items.length ? items.map(item => `
      <button class="dashboard-opportunity-row" type="button" data-dashboard-opportunity="${escape(item.IdOportunidad)}">
        <span class="dashboard-opportunity-main"><strong>${escape(item.NombreCliente || item.Nombre || "Oportunidad")}</strong><small>${escape(item.Producto || item.Nombre || "Sin producto")}</small></span>
        <span class="dashboard-opportunity-stage">${escape(item.Estado || "Nuevo")}</span>
        <span class="dashboard-opportunity-value"><strong>${escape(money(item.ImporteMensual))}</strong><small>${escape(item.Probabilidad || 0)} %</small></span>
      </button>`).join("") : '<div class="dashboard-empty"><span>◇</span><strong>Sin oportunidades abiertas</strong><p>Crea una oportunidad desde el Sales Hub.</p></div>';

    element.querySelectorAll("[data-dashboard-opportunity]").forEach(button => {
      button.addEventListener("click", async () => {
        try {
          const response = await ApiClient.call("opportunity.get", { id: button.dataset.dashboardOpportunity }, { method: "GET" });
          if (response?.oportunidad && typeof openOpportunityEditor === "function") openOpportunityEditor(response.oportunidad);
        } catch (error) { setPortalMessage("dashboardMessage", error.message, "error"); }
      });
    });
  }

  function activityIcon(type) {
    const value = String(type || "");
    if (value.includes("ganad") || value.includes("creada")) return "✓";
    if (value.includes("estado")) return "↗";
    if (value.includes("elimin")) return "×";
    return "•";
  }

  function renderRecentActivity() {
    const element = document.getElementById("dashboardRecentActivityV2");
    if (!element) return;
    const items = summary?.recentActivity || [];
    element.innerHTML = items.length ? items.map(item => `
      <div class="dashboard-activity-row">
        <span class="dashboard-activity-icon">${activityIcon(item.Tipo)}</span>
        <span><strong>${escape(item.Descripcion || item.Tipo || "Actividad")}</strong><small>${escape(item.Usuario || "Sistema")} · ${escape(formatDate(item.Fecha, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }))}</small></span>
      </div>`).join("") : '<div class="dashboard-empty"><span>◷</span><strong>Sin actividad reciente</strong><p>Los cambios del equipo aparecerán aquí.</p></div>';
  }

  function renderAttentionWidget() {
    const element = document.getElementById("dashboardAttentionList");
    if (!element) return;
    const overdue = summary?.overdueActions || [];
    element.innerHTML = overdue.length ? overdue.slice(0, 6).map(item => `
      <button class="dashboard-attention-row" type="button" data-dashboard-overdue="${escape(item.IdAccion)}">
        <span class="attention-marker"></span>
        <span><strong>${escape(item.Tipo)} · ${escape(item.IdCliente)}</strong><small>Vencida ${escape(formatDate(item.Fecha))} · ${escape(item.Notas || "Sin notas")}</small></span>
      </button>`).join("") : '<div class="dashboard-empty compact"><span>✓</span><strong>Todo al día</strong><p>No hay acciones vencidas.</p></div>';
    element.querySelectorAll("[data-dashboard-overdue]").forEach(button => button.addEventListener("click", () => openActionEditor(overdue.find(item => item.IdAccion === button.dataset.dashboardOverdue))));
  }

  async function ensureActionReferences() {
    if (!dashboardCustomers.length) {
      const response = await ApiClient.call("customer.list", {}, { method: "GET" });
      dashboardCustomers = response?.clientes || [];
    }
    if (!dashboardOpportunities.length) {
      const response = await ApiClient.call("opportunity.list", {}, { method: "GET" });
      dashboardOpportunities = response?.oportunidades || [];
    }
  }

  async function openActionEditor(action = null, defaults = {}) {
    editingAction = action;
    await ensureActionReferences();
    const form = document.createElement("form");
    form.id = "dashboardActionForm";
    form.className = "side-panel-form";
    form.innerHTML = `
      <div class="side-panel-form-grid">
        <label class="side-panel-field side-panel-field-wide"><span>Cliente *</span><select id="dashboardActionCustomer" required><option value="">Selecciona un cliente…</option>${dashboardCustomers.map(customer => `<option value="${escape(customer.IdCliente)}">${escape(customer.Nombre)} · ${escape(customer.CIF || customer.IdCliente)}</option>`).join("")}</select></label>
        <label class="side-panel-field side-panel-field-wide"><span>Oportunidad</span><select id="dashboardActionOpportunity"><option value="">Sin oportunidad vinculada</option></select></label>
        <label class="side-panel-field"><span>Tipo</span><select id="dashboardActionType">${["Llamada","Email","Demo","Reunión","Seguimiento","Tarea"].map(item => `<option>${item}</option>`).join("")}</select></label>
        <label class="side-panel-field"><span>Prioridad</span><select id="dashboardActionPriority">${["Baja","Media","Alta","Urgente"].map(item => `<option>${item}</option>`).join("")}</select></label>
        <label class="side-panel-field"><span>Fecha *</span><input id="dashboardActionDate" type="date" required></label>
        <label class="side-panel-field"><span>Hora</span><input id="dashboardActionTime" type="time"></label>
        <label class="side-panel-field"><span>Estado</span><select id="dashboardActionStatus">${["Pendiente","Completada","Cancelada"].map(item => `<option>${item}</option>`).join("")}</select></label>
        <label class="side-panel-field"><span>Responsable</span><input id="dashboardActionResponsible" maxlength="120"></label>
        <label class="side-panel-field side-panel-field-wide"><span>Notas</span><textarea id="dashboardActionNotes" rows="5" maxlength="2000" placeholder="Objetivo, contexto y siguiente paso…"></textarea></label>
      </div>
      <div id="dashboardActionMessage" class="portal-message side-panel-message" aria-live="polite"></div>`;

    const footer = document.createElement("div");
    footer.className = "side-panel-footer-actions";
    footer.style.display = "contents";
    footer.innerHTML = `<button id="dashboardDeleteAction" class="portal-danger-button ${action ? "" : "hidden"}" type="button">Eliminar</button><span class="side-panel-spacer"></span><button id="dashboardCancelAction" class="portal-secondary-button" type="button">Cancelar</button><button class="portal-primary-button" type="submit" form="dashboardActionForm">Guardar acción</button>`;

    SidePanel.open({
      title: action ? "Editar acción" : "Nueva acción",
      subtitle: action ? "Actualiza el seguimiento y su estado." : "Planifica el siguiente paso comercial.",
      content: form,
      footer
    });

    const customerSelect = document.getElementById("dashboardActionCustomer");
    const opportunitySelect = document.getElementById("dashboardActionOpportunity");
    const selectedCustomer = action?.IdCliente || defaults.IdCliente || "";
    customerSelect.value = selectedCustomer;

    const refreshOpportunities = () => {
      const items = dashboardOpportunities.filter(item => !customerSelect.value || item.IdCliente === customerSelect.value);
      opportunitySelect.innerHTML = '<option value="">Sin oportunidad vinculada</option>' + items.map(item => `<option value="${escape(item.IdOportunidad)}">${escape(item.Nombre)} · ${escape(item.Estado)}</option>`).join("");
      opportunitySelect.value = action?.IdOportunidad || defaults.IdOportunidad || "";
    };
    customerSelect.addEventListener("change", refreshOpportunities);
    refreshOpportunities();

    document.getElementById("dashboardActionType").value = action?.Tipo || "Seguimiento";
    document.getElementById("dashboardActionPriority").value = action?.Prioridad || "Media";
    document.getElementById("dashboardActionDate").value = dateKey(action?.Fecha || defaults.Fecha || new Date());
    document.getElementById("dashboardActionTime").value = action?.Hora || "";
    document.getElementById("dashboardActionStatus").value = action?.Estado || "Pendiente";
    document.getElementById("dashboardActionResponsible").value = action?.Responsable || userName();
    document.getElementById("dashboardActionNotes").value = action?.Notas || "";

    document.getElementById("dashboardCancelAction").addEventListener("click", () => SidePanel.close());
    document.getElementById("dashboardDeleteAction")?.addEventListener("click", deleteCurrentAction);
    form.addEventListener("submit", saveCurrentAction);
  }

  async function saveCurrentAction(event) {
    event.preventDefault();
    const payload = {
      IdCliente: document.getElementById("dashboardActionCustomer").value,
      IdOportunidad: document.getElementById("dashboardActionOpportunity").value,
      Tipo: document.getElementById("dashboardActionType").value,
      Prioridad: document.getElementById("dashboardActionPriority").value,
      Fecha: document.getElementById("dashboardActionDate").value,
      Hora: document.getElementById("dashboardActionTime").value,
      Estado: document.getElementById("dashboardActionStatus").value,
      Responsable: document.getElementById("dashboardActionResponsible").value,
      Notas: document.getElementById("dashboardActionNotes").value
    };
    const button = document.querySelector('[form="dashboardActionForm"]');
    if (button) button.disabled = true;
    try {
      const response = await ApiClient.call(editingAction ? "action.update" : "action.create", editingAction ? { id: editingAction.IdAccion, data: payload } : { data: payload });
      if (!response?.success) throw new Error(response?.message || "No se ha podido guardar la acción.");
      SidePanel.close();
      await load(true);
    } catch (error) {
      setPortalMessage("dashboardActionMessage", error.message, "error");
    } finally { if (button) button.disabled = false; }
  }

  async function deleteCurrentAction() {
    if (!editingAction || !confirm("¿Eliminar esta acción?")) return;
    try {
      const response = await ApiClient.call("action.delete", { id: editingAction.IdAccion });
      if (!response?.success) throw new Error(response?.message || "No se ha podido eliminar la acción.");
      SidePanel.close();
      await load(true);
    } catch (error) { setPortalMessage("dashboardActionMessage", error.message, "error"); }
  }

  function restoreWidgetOrder() {
    const grid = document.getElementById("dashboardWidgetGrid");
    if (!grid) return;
    let order = [];
    try { order = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch (_) {}
    order.forEach(id => {
      const widget = grid.querySelector(`[data-widget-id="${CSS.escape(id)}"]`);
      if (widget) grid.appendChild(widget);
    });
  }

  function enableWidgetSorting() {
    const grid = document.getElementById("dashboardWidgetGrid");
    if (!grid || grid.dataset.sortReady === "true") return;
    grid.dataset.sortReady = "true";
    let dragged = null;
    grid.querySelectorAll("[data-widget-id]").forEach(widget => {
      widget.setAttribute("draggable", "true");
      widget.addEventListener("dragstart", event => { dragged = widget; widget.classList.add("is-dragging"); event.dataTransfer.effectAllowed = "move"; });
      widget.addEventListener("dragend", () => { widget.classList.remove("is-dragging"); dragged = null; saveWidgetOrder(); });
      widget.addEventListener("dragover", event => {
        event.preventDefault();
        if (!dragged || dragged === widget) return;
        const rect = widget.getBoundingClientRect();
        const after = event.clientY > rect.top + rect.height / 2 || event.clientX > rect.left + rect.width / 2;
        grid.insertBefore(dragged, after ? widget.nextSibling : widget);
      });
    });
  }

  function saveWidgetOrder() {
    const ids = [...document.querySelectorAll("#dashboardWidgetGrid [data-widget-id]")].map(item => item.dataset.widgetId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }

  function init() {
    document.getElementById("dashboardNewActionButton")?.addEventListener("click", () => openActionEditor());
  }

  return { init, load, openActionEditor };
})();

// Sustituye el cargador antiguo sin modificar el módulo del portal.
window.loadDashboard = DashboardWorkspace.load;
window.openDashboardActionEditor = DashboardWorkspace.openActionEditor;

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", DashboardWorkspace.init, { once: true });
else DashboardWorkspace.init();
