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

let customersCache = [];
let selectedCustomerId = "";
let customerSearchTimer = null;
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

function getVisibleCustomers() {
  const status = String(customerStatusFilter?.value || "").trim().toLowerCase();
  return status
    ? customersCache.filter(customer => String(customer.Estado || "Activo").trim().toLowerCase() === status)
    : customersCache;
}

function renderCustomersList() {
  const customers = getVisibleCustomers();
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
        <span class="customer-status-badge ${inactive ? "inactive" : ""}">${escapeHtml(customerValue(customer, "Estado", "Activo"))}</span>
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
    const [customerResponse, budgetResponse] = await Promise.all([
      ApiClient.call("customer.get", { id: customerId }, { method: "GET" }),
      ApiClient.call("budget.list", {}, { method: "GET" })
    ]);
    if (!customerResponse?.success || !customerResponse.cliente) throw new Error(customerResponse?.message || "Cliente no encontrado.");
    const customer = customerResponse.cliente;
    const budgets = Array.isArray(budgetResponse?.presupuestos)
      ? budgetResponse.presupuestos.filter(budget => String(budget.IdCliente || "").trim() === customerId)
      : [];
    renderCustomerDetail(customer, budgets);
  } catch (error) {
    console.error(error);
    customerDetailContent.innerHTML = `<div class="customers-empty">${escapeHtml(error.message)}</div>`;
  }
}

function renderCustomerDetail(customer, budgets) {
  const monthlyTotal = budgets.reduce((sum, budget) => sum + parsePortalMoney(budget["Total Mensual"]), 0);
  customerDetailContent.innerHTML = `
    <div class="customer-detail-header">
      <div><p class="eyebrow">${escapeHtml(customerValue(customer, "IdCliente"))}</p><h2>${escapeHtml(customerValue(customer, "Nombre"))}</h2><span class="customer-status-badge ${String(customer.Estado || "Activo").toLowerCase() !== "activo" ? "inactive" : ""}">${escapeHtml(customerValue(customer, "Estado", "Activo"))}</span></div>
      <div class="customer-detail-actions">
        <button id="customerNewBudgetAction" type="button" class="portal-primary-button">Nuevo presupuesto</button>
        <button id="customerEditAction" type="button" class="portal-secondary-button">Editar</button>
      </div>
    </div>
    <div class="customer-data-grid">
      ${renderCustomerDataItem("CIF / NIF", customerValue(customer, "CIF"))}
      ${renderCustomerDataItem("Comercial", customerValue(customer, "Comercial"))}
      ${renderCustomerDataItem("Teléfono", customerValue(customer, "Teléfono"))}
      ${renderCustomerDataItem("Email", customerValue(customer, "Email"))}
      ${renderCustomerDataItem("Dirección", customerValue(customer, "Dirección"))}
      ${renderCustomerDataItem("Localidad", [customerValue(customer, "Ciudad", ""), customerValue(customer, "Provincia", "")].filter(Boolean).join(", ") || "—")}
      ${renderCustomerDataItem("Fecha de alta", formatCustomerDate(customer.FechaAlta))}
      ${renderCustomerDataItem("Última actividad", formatCustomerDate(customer["ÚltimaActividad"]))}
    </div>
    <div class="kpi-grid">
      <article class="kpi-card"><span>Presupuestos</span><strong>${budgets.length}</strong></article>
      <article class="kpi-card"><span>Importe mensual</span><strong>${formatPortalMoney(monthlyTotal)}</strong></article>
    </div>
    <section class="customer-detail-section"><h3>Presupuestos vinculados</h3><div class="customer-budget-list">${renderCustomerBudgets(budgets)}</div></section>
    <section class="customer-detail-section"><h3>Próximos módulos</h3><p class="portal-subtitle">Seguimientos, actividad, documentos y comentarios quedarán vinculados a este cliente.</p></section>`;

  document.getElementById("customerEditAction").addEventListener("click", () => openCustomerEditor(customer));
  document.getElementById("customerNewBudgetAction").addEventListener("click", () => startBudgetForCustomer(customer));
  customerDetailContent.querySelectorAll("[data-open-budget]").forEach(button => button.addEventListener("click", async () => {
    await openPortalView("history");
    const row = document.querySelector(`[data-budget-id="${CSS.escape(button.dataset.openBudget)}"]`);
    row?.scrollIntoView({ behavior: "smooth", block: "center" });
  }));
}

function renderCustomerDataItem(label, value) {
  return `<div class="customer-data-item"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`;
}

function renderCustomerBudgets(budgets) {
  if (!budgets.length) return '<div class="customers-empty">Todavía no hay presupuestos vinculados mediante IdCliente.</div>';
  return budgets.slice().reverse().map(budget => `<div class="customer-budget-item"><div><strong>${escapeHtml(String(budget["ID Presupuesto"] || "Presupuesto"))}</strong><small>${escapeHtml(String(budget.Solución || ""))} · ${escapeHtml(String(budget.Fecha || ""))}</small></div><div class="customer-budget-amount">${escapeHtml(String(budget["Total Mensual"] || "—"))}</div></div>`).join("");
}

function closeCustomerDetail() {
  selectedCustomerId = "";
  customerDetailContent.classList.add("hidden");
  customerDetailEmpty.classList.remove("hidden");
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
}

showCustomersButton.addEventListener("click", () => openPortalView("customers"));
document.getElementById("newCustomerButton").addEventListener("click", () => openCustomerEditor());
document.getElementById("refreshCustomersButton").addEventListener("click", () => loadCustomers(true));
document.getElementById("closeCustomerEditorButton").addEventListener("click", closeCustomerEditor);
document.getElementById("cancelCustomerEditorButton").addEventListener("click", closeCustomerEditor);
document.getElementById("customerEditorForm").addEventListener("submit", saveCustomerFromEditor);
document.getElementById("unlinkCustomerButton").addEventListener("click", unlinkCustomerFromBudget);
customerStatusFilter.addEventListener("change", renderCustomersList);
customerCommercialFilter.addEventListener("change", () => loadCustomers(true));
customerSearchInput.addEventListener("input", () => {
  clearTimeout(customerSearchTimer);
  customerSearchTimer = setTimeout(() => loadCustomers(true), 350);
});
customerCommercialFilterWrap.classList.toggle("hidden", !isManagerUser());
