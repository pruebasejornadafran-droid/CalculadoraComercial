const OPPORTUNITY_PIPELINE_STATES = [
  "Nuevo", "Contactado", "Demo realizada", "Propuesta enviada",
  "Negociación", "Ganado", "Perdido"
];

let opportunitiesCache = [];
let salesEntityMode = "customers";
let draggedOpportunityId = "";
let editingOpportunityId = "";

const originalLoadCustomers = loadCustomers;
const originalRenderCustomersList = renderCustomersList;
const originalOpenCustomerDetail = openCustomerDetail;
const originalSetCustomerViewMode = setCustomerViewMode;

function opportunityValue(opportunity, key, fallback = "—") {
  const value = opportunity?.[key];
  return value === null || value === undefined || String(value).trim() === "" ? fallback : String(value).trim();
}

function parseOpportunityAmount(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const normalized = String(value || "").replace(/\s/g, "").replace(/\./g, "").replace(",", ".").replace(/[^0-9.-]/g, "");
  const number = Number(normalized);
  return Number.isFinite(number) ? number : 0;
}

function formatOpportunityMoney(value) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(parseOpportunityAmount(value));
}

function injectOpportunityInterface() {
  const toolbar = document.querySelector(".customers-toolbar");
  if (toolbar && !document.getElementById("salesEntitySwitch")) {
    const entitySwitch = document.createElement("div");
    entitySwitch.id = "salesEntitySwitch";
    entitySwitch.className = "sales-entity-switch";
    entitySwitch.setAttribute("role", "group");
    entitySwitch.setAttribute("aria-label", "Contenido del Sales Hub");
    entitySwitch.innerHTML = `
      <button type="button" class="active" data-sales-entity="customers">Clientes</button>
      <button type="button" data-sales-entity="opportunities">Oportunidades</button>`;
    toolbar.prepend(entitySwitch);
    entitySwitch.querySelectorAll("[data-sales-entity]").forEach(button => {
      button.addEventListener("click", () => setSalesEntityMode(button.dataset.salesEntity));
    });
  }

  const headerActions = document.querySelector("#customersView .portal-header-actions");
  if (headerActions && !document.getElementById("newOpportunityButton")) {
    const button = document.createElement("button");
    button.id = "newOpportunityButton";
    button.type = "button";
    button.className = "portal-primary-button hidden";
    button.textContent = "＋ Nueva oportunidad";
    button.addEventListener("click", () => openOpportunityEditor());
    headerActions.prepend(button);
  }

  // El formulario de oportunidades se renderiza dentro del SidePanel al abrirlo.

}

async function loadOpportunities() {
  const response = await ApiClient.call("opportunity.list", {
    search: customerSearchInput?.value?.trim() || "",
    estado: customerPipelineFilter?.value || "",
    responsable: isManagerUser() ? customerCommercialFilter?.value || "" : ""
  }, { method: "GET" });
  if (!response?.success || !Array.isArray(response.oportunidades)) {
    throw new Error(response?.message || "No se han podido cargar las oportunidades.");
  }
  opportunitiesCache = response.oportunidades;
  return opportunitiesCache;
}

async function setSalesEntityMode(mode) {
  salesEntityMode = mode === "opportunities" ? "opportunities" : "customers";
  document.querySelectorAll("[data-sales-entity]").forEach(button => button.classList.toggle("active", button.dataset.salesEntity === salesEntityMode));
  document.getElementById("newCustomerButton")?.classList.toggle("hidden", salesEntityMode === "opportunities");
  document.getElementById("newOpportunityButton")?.classList.toggle("hidden", salesEntityMode !== "opportunities");
  document.getElementById("customerStatusFilter")?.closest("label")?.classList.toggle("hidden", salesEntityMode === "opportunities");
  document.querySelector(".customers-view-switch")?.classList.toggle("hidden", salesEntityMode === "opportunities");
  customerSearchInput.placeholder = salesEntityMode === "opportunities" ? "Cliente, oportunidad, producto o responsable…" : "Nombre, CIF, email, teléfono o comercial…";

  if (salesEntityMode === "opportunities") {
    customersListLayout.classList.add("hidden");
    customersKanbanShell.classList.remove("hidden");
    document.body.classList.add("customer-kanban-mode");
    setPortalMessage("customersMessage", "Cargando oportunidades…", "loading");
    try {
      await loadOpportunities();
      renderOpportunitiesWorkspace();
      setPortalMessage("customersMessage", "", "");
    } catch (error) {
      setPortalMessage("customersMessage", error.message, "error");
    }
  } else {
    originalSetCustomerViewMode(customerViewMode);
    originalRenderCustomersList();
  }
}

function renderOpportunityKpis(opportunities) {
  const open = opportunities.filter(item => !["Ganado", "Perdido"].includes(opportunityValue(item, "Estado", "Nuevo")));
  const won = opportunities.filter(item => opportunityValue(item, "Estado", "Nuevo") === "Ganado");
  const openValue = open.reduce((sum, item) => sum + parseOpportunityAmount(item.ImporteMensual), 0);
  const weighted = open.reduce((sum, item) => sum + parseOpportunityAmount(item.ImporteMensual) * (Number(item.Probabilidad || 0) / 100), 0);

  document.querySelector("#pipelineTotalCustomers")?.closest("article")?.querySelector("span").replaceChildren("Oportunidades");
  document.querySelector("#pipelineOpenCustomers")?.closest("article")?.querySelector("span").replaceChildren("Pipeline mensual");
  document.querySelector("#pipelineWonCustomers")?.closest("article")?.querySelector("span").replaceChildren("Previsión ponderada");
  document.querySelector("#pipelineConversionRate")?.closest("article")?.querySelector("span").replaceChildren("Ganadas");
  pipelineTotalCustomers.textContent = opportunities.length;
  pipelineOpenCustomers.textContent = formatOpportunityMoney(openValue);
  pipelineWonCustomers.textContent = formatOpportunityMoney(weighted);
  pipelineConversionRate.textContent = won.length;
}

function renderOpportunitiesWorkspace() {
  const filtered = opportunitiesCache.filter(item => {
    const phase = customerPipelineFilter?.value || "";
    return !phase || opportunityValue(item, "Estado", "Nuevo") === phase;
  });
  renderOpportunityKpis(filtered);
  document.getElementById("customersCountText").textContent = `${filtered.length} ${filtered.length === 1 ? "oportunidad" : "oportunidades"}`;
  customersKanban.innerHTML = OPPORTUNITY_PIPELINE_STATES.map(state => {
    const items = filtered.filter(item => opportunityValue(item, "Estado", "Nuevo") === state);
    const columnValue = items.reduce((sum, item) => sum + parseOpportunityAmount(item.ImporteMensual), 0);
    const slug = state.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
    return `<section class="customer-kanban-column opportunity-kanban-column stage-${slug}" data-opportunity-state="${escapeHtml(state)}">
      <header class="customer-kanban-column-header"><div><span class="customer-kanban-dot">●</span><h2>${escapeHtml(state)}</h2></div><span class="customer-kanban-count">${items.length}</span></header>
      <div class="opportunity-column-value">${escapeHtml(formatOpportunityMoney(columnValue))}/mes</div>
      <div class="customer-kanban-cards" data-opportunity-drop-state="${escapeHtml(state)}">
        ${items.length ? items.map(renderOpportunityCard).join("") : '<div class="customer-kanban-empty"><span>＋</span><p>Sin oportunidades</p></div>'}
      </div>
    </section>`;
  }).join("");

  customersKanban.querySelectorAll("[data-opportunity-id]").forEach(card => {
    card.addEventListener("click", () => openOpportunityEditor(opportunitiesCache.find(item => item.IdOportunidad === card.dataset.opportunityId)));
    card.addEventListener("dragstart", event => {
      draggedOpportunityId = card.dataset.opportunityId;
      card.classList.add("dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", draggedOpportunityId);
    });
    card.addEventListener("dragend", () => {
      draggedOpportunityId = "";
      card.classList.remove("dragging");
      customersKanban.querySelectorAll(".drag-over").forEach(element => element.classList.remove("drag-over"));
    });
  });

  customersKanban.querySelectorAll("[data-opportunity-drop-state]").forEach(zone => {
    zone.addEventListener("dragover", event => { event.preventDefault(); zone.classList.add("drag-over"); });
    zone.addEventListener("dragleave", event => { if (!zone.contains(event.relatedTarget)) zone.classList.remove("drag-over"); });
    zone.addEventListener("drop", async event => {
      event.preventDefault();
      zone.classList.remove("drag-over");
      const id = event.dataTransfer.getData("text/plain") || draggedOpportunityId;
      const opportunity = opportunitiesCache.find(item => item.IdOportunidad === id);
      const newStatus = zone.dataset.opportunityDropState;
      if (!opportunity || opportunity.Estado === newStatus) return;
      await changeOpportunityStatus(opportunity, newStatus);
    });
  });
}

function renderOpportunityCard(opportunity) {
  const nextAction = opportunityValue(opportunity, "ProximaAccion", "Sin próxima acción");
  const closeDate = opportunityValue(opportunity, "FechaPrevistaCierre", "Sin fecha");
  return `<article class="customer-kanban-card opportunity-kanban-card" draggable="true" tabindex="0" data-opportunity-id="${escapeHtml(opportunity.IdOportunidad)}">
    <div class="opportunity-card-topline"><span>${escapeHtml(opportunityValue(opportunity, "IdOportunidad"))}</span><strong>${escapeHtml(String(opportunity.Probabilidad || 0))}%</strong></div>
    <h3>${escapeHtml(opportunityValue(opportunity, "Nombre"))}</h3>
    <p class="opportunity-card-customer">${escapeHtml(opportunityValue(opportunity, "NombreCliente", opportunity.IdCliente))}</p>
    <div class="opportunity-card-product">${escapeHtml(opportunityValue(opportunity, "Producto", "Sin producto"))}</div>
    <div class="opportunity-card-value">${escapeHtml(formatOpportunityMoney(opportunity.ImporteMensual))}<small>/mes</small></div>
    <div class="customer-kanban-card-meta"><span>👤 ${escapeHtml(opportunityValue(opportunity, "Responsable"))}</span><span>📅 ${escapeHtml(formatCustomerDate(closeDate))}</span><span>✓ ${escapeHtml(nextAction)}</span></div>
  </article>`;
}

async function changeOpportunityStatus(opportunity, newStatus) {
  setPortalMessage("customersMessage", "Actualizando oportunidad…", "loading");
  try {
    const response = await ApiClient.call("opportunity.updateStatus", { id: opportunity.IdOportunidad, estado: newStatus });
    if (!response?.success) throw new Error(response?.message || "No se ha podido actualizar la oportunidad.");
    opportunity.Estado = newStatus;
    opportunity.Probabilidad = newStatus === "Ganado" ? 100 : newStatus === "Perdido" ? 0 : opportunity.Probabilidad;
    opportunity.UltimaActividad = new Date().toISOString();
    renderOpportunitiesWorkspace();
    setPortalMessage("customersMessage", response.message, "success");
  } catch (error) {
    setPortalMessage("customersMessage", error.message, "error");
    await loadOpportunities();
    renderOpportunitiesWorkspace();
  }
}

function populateOpportunityCustomers(selectedId = "") {
  const select = document.getElementById("opportunityCustomerId");
  select.innerHTML = '<option value="">Selecciona un cliente…</option>' + customersCache
    .slice().sort((a, b) => String(a.Nombre || "").localeCompare(String(b.Nombre || ""), "es"))
    .map(customer => `<option value="${escapeHtml(customer.IdCliente)}" ${customer.IdCliente === selectedId ? "selected" : ""}>${escapeHtml(customer.Nombre)} · ${escapeHtml(customer.CIF || customer.IdCliente)}</option>`).join("");
}

function toDateInput(value) {
  const date = parsePortalDate(value);
  return date ? date.toISOString().slice(0, 10) : "";
}

function buildOpportunityEditor(opportunity = null, customerId = "") {
  editingOpportunityId = opportunity?.IdOportunidad || "";

  const form = document.createElement("form");
  form.id = "opportunityEditorForm";
  form.className = "side-panel-form";
  form.innerHTML = `
    <input id="opportunityEditorId" type="hidden" value="${escapeHtml(editingOpportunityId)}">
    <div class="side-panel-form-grid">
      <label class="side-panel-field side-panel-field-wide"><span>Cliente *</span><select id="opportunityCustomerId" required></select></label>
      <label class="side-panel-field"><span>Nombre de la oportunidad *</span><input id="opportunityName" maxlength="180" required placeholder="Ej.: Implantación ERP 2026"></label>
      <label class="side-panel-field"><span>Producto</span><input id="opportunityProduct" maxlength="120" placeholder="ERP, eJornada, Firma digital…"></label>
      <label class="side-panel-field"><span>Fase</span><select id="opportunityStatus">${OPPORTUNITY_PIPELINE_STATES.map(state => `<option value="${state}">${state}</option>`).join("")}</select></label>
      <label class="side-panel-field"><span>Probabilidad (%)</span><input id="opportunityProbability" type="number" min="0" max="100" step="1"></label>
      <label class="side-panel-field"><span>Importe mensual</span><input id="opportunityMonthlyAmount" type="number" min="0" step="0.01"></label>
      <label class="side-panel-field"><span>Importe inicial</span><input id="opportunityInitialAmount" type="number" min="0" step="0.01"></label>
      <label class="side-panel-field"><span>Cierre previsto</span><input id="opportunityExpectedClose" type="date"></label>
      <label class="side-panel-field"><span>Responsable</span><input id="opportunityResponsible" maxlength="120"></label>
      <label class="side-panel-field side-panel-field-wide"><span>Próxima acción</span><input id="opportunityNextAction" maxlength="250" placeholder="Llamar, preparar demo, enviar propuesta…"></label>
      <label class="side-panel-field"><span>Fecha próxima acción</span><input id="opportunityNextActionDate" type="date"></label>
      <label class="side-panel-field side-panel-field-wide"><span>Notas</span><textarea id="opportunityNotes" rows="4" maxlength="2000"></textarea></label>
    </div>
    <div id="opportunityEditorMessage" class="portal-message side-panel-message" aria-live="polite"></div>`;

  const footer = document.createElement("div");
  footer.className = "side-panel-footer-actions";
  footer.style.display = "contents";
  footer.innerHTML = `
    <button id="deleteOpportunityButton" class="portal-danger-button ${editingOpportunityId ? "" : "hidden"}" type="button">Eliminar</button>
    <span class="side-panel-spacer"></span>
    <button id="cancelOpportunityButton" class="portal-secondary-button" type="button">Cancelar</button>
    <button id="saveOpportunityButton" class="portal-primary-button" type="submit" form="opportunityEditorForm">Guardar oportunidad</button>`;

  SidePanel.open({
    title: editingOpportunityId ? "Editar oportunidad" : "Nueva oportunidad",
    subtitle: editingOpportunityId ? "Actualiza la previsión y la próxima acción comercial." : "Registra una venta potencial asociada a un cliente.",
    content: form,
    footer
  });

  populateOpportunityCustomers(opportunity?.IdCliente || customerId || selectedCustomerId || "");
  document.getElementById("opportunityName").value = opportunity?.Nombre || "";
  document.getElementById("opportunityProduct").value = opportunity?.Producto || "";
  document.getElementById("opportunityStatus").value = opportunity?.Estado || "Nuevo";
  document.getElementById("opportunityProbability").value = opportunity?.Probabilidad ?? 10;
  document.getElementById("opportunityMonthlyAmount").value = opportunity?.ImporteMensual ?? "";
  document.getElementById("opportunityInitialAmount").value = opportunity?.ImporteInicial ?? "";
  document.getElementById("opportunityExpectedClose").value = toDateInput(opportunity?.FechaPrevistaCierre);
  document.getElementById("opportunityResponsible").value = opportunity?.Responsable || currentSession?.user?.commercial || currentSession?.commercial || "";
  document.getElementById("opportunityResponsible").disabled = !isManagerUser();
  document.getElementById("opportunityNextAction").value = opportunity?.ProximaAccion || "";
  document.getElementById("opportunityNextActionDate").value = toDateInput(opportunity?.FechaProximaAccion);
  document.getElementById("opportunityNotes").value = opportunity?.Notas || "";

  form.addEventListener("submit", saveOpportunity);
  document.getElementById("cancelOpportunityButton").addEventListener("click", closeOpportunityEditor);
  document.getElementById("deleteOpportunityButton").addEventListener("click", deleteOpportunityFromEditor);
  document.getElementById("opportunityStatus").addEventListener("change", event => {
    const defaults = { "Nuevo": 10, "Contactado": 20, "Demo realizada": 40, "Propuesta enviada": 60, "Negociación": 80, "Ganado": 100, "Perdido": 0 };
    document.getElementById("opportunityProbability").value = defaults[event.target.value] ?? "";
  });
}

function openOpportunityEditor(opportunity = null, customerId = "") {
  if (!window.SidePanel) {
    setPortalMessage("customersMessage", "No se ha podido cargar el panel lateral.", "error");
    return;
  }
  buildOpportunityEditor(opportunity, customerId);
}

function closeOpportunityEditor() {
  SidePanel.close();
  editingOpportunityId = "";
}

async function saveOpportunity(event) {
  event.preventDefault();
  const id = editingOpportunityId;
  const data = {
    IdCliente: document.getElementById("opportunityCustomerId").value,
    Nombre: document.getElementById("opportunityName").value.trim(),
    Producto: document.getElementById("opportunityProduct").value.trim(),
    Estado: document.getElementById("opportunityStatus").value,
    Probabilidad: document.getElementById("opportunityProbability").value,
    ImporteMensual: document.getElementById("opportunityMonthlyAmount").value,
    ImporteInicial: document.getElementById("opportunityInitialAmount").value,
    FechaPrevistaCierre: document.getElementById("opportunityExpectedClose").value,
    Responsable: document.getElementById("opportunityResponsible").value.trim(),
    ProximaAccion: document.getElementById("opportunityNextAction").value.trim(),
    FechaProximaAccion: document.getElementById("opportunityNextActionDate").value,
    Notas: document.getElementById("opportunityNotes").value.trim()
  };
  const button = document.getElementById("saveOpportunityButton");
  button.disabled = true;
  setPortalMessage("opportunityEditorMessage", "Guardando…", "loading");
  try {
    const response = await ApiClient.call(id ? "opportunity.update" : "opportunity.create", id ? { id, data } : { data });
    if (!response?.success) throw new Error(response?.message || "No se ha podido guardar la oportunidad.");
    closeOpportunityEditor();
    await loadOpportunities();
    if (salesEntityMode === "opportunities") renderOpportunitiesWorkspace();
    if (selectedCustomerId) await openCustomerDetail(selectedCustomerId, false);
    setPortalMessage("customersMessage", response.message, "success");
  } catch (error) {
    setPortalMessage("opportunityEditorMessage", error.message, "error");
  } finally {
    button.disabled = false;
  }
}

async function deleteOpportunityFromEditor() {
  if (!editingOpportunityId || !window.confirm("¿Eliminar esta oportunidad? Esta acción no se puede deshacer.")) return;
  try {
    const response = await ApiClient.call("opportunity.delete", { id: editingOpportunityId });
    if (!response?.success) throw new Error(response?.message || "No se ha podido eliminar la oportunidad.");
    closeOpportunityEditor();
    await loadOpportunities();
    if (salesEntityMode === "opportunities") renderOpportunitiesWorkspace();
    if (selectedCustomerId) await openCustomerDetail(selectedCustomerId, false);
    setPortalMessage("customersMessage", response.message, "success");
  } catch (error) {
    setPortalMessage("opportunityEditorMessage", error.message, "error");
  }
}

function renderCustomerOpportunities(opportunities) {
  if (!opportunities.length) return '<div class="customers-empty">Todavía no hay oportunidades para este cliente.</div>';
  return opportunities.map(item => `<article class="customer-opportunity-item">
    <div><span class="customer-pipeline-badge">${escapeHtml(opportunityValue(item, "Estado", "Nuevo"))}</span><h4>${escapeHtml(opportunityValue(item, "Nombre"))}</h4><p>${escapeHtml(opportunityValue(item, "Producto", "Sin producto"))}</p></div>
    <div class="customer-opportunity-side"><strong>${escapeHtml(formatOpportunityMoney(item.ImporteMensual))}/mes</strong><small>${escapeHtml(String(item.Probabilidad || 0))}% · ${escapeHtml(opportunityValue(item, "Responsable"))}</small><button type="button" class="customer-link-button" data-edit-opportunity="${escapeHtml(item.IdOportunidad)}">Editar</button></div>
  </article>`).join("");
}

openCustomerDetail = async function(customerId, reloadList = true) {
  await originalOpenCustomerDetail(customerId, reloadList);
  if (selectedCustomerId !== customerId || customerDetailContent.querySelector(".customers-empty")?.textContent.includes("no encontrado")) return;
  try {
    const response = await ApiClient.call("opportunity.list", { idCliente: customerId }, { method: "GET" });
    const opportunities = Array.isArray(response?.oportunidades) ? response.oportunidades : [];
    const futureTab = customerDetailContent.querySelector('[data-customer-tab="future"]');
    if (!customerDetailContent.querySelector('[data-customer-tab="opportunities"]')) {
      futureTab?.insertAdjacentHTML("beforebegin", `<button type="button" class="customer-detail-tab" data-customer-tab="opportunities">Oportunidades <span>${opportunities.length}</span></button>`);
      customerDetailContent.querySelector('[data-customer-panel="future"]')?.insertAdjacentHTML("beforebegin", `
        <div class="customer-tab-panel hidden" data-customer-panel="opportunities">
          <section class="customer-detail-section customer-detail-section-first">
            <div class="customer-section-heading"><h3>Oportunidades comerciales</h3><button type="button" class="portal-primary-button portal-small-button" data-new-customer-opportunity>＋ Nueva</button></div>
            <div class="customer-opportunity-list">${renderCustomerOpportunities(opportunities)}</div>
          </section>
        </div>`);
      customerDetailContent.querySelector('[data-customer-tab="opportunities"]')?.addEventListener("click", () => activateCustomerDetailTab("opportunities"));
      customerDetailContent.querySelector("[data-new-customer-opportunity]")?.addEventListener("click", () => openOpportunityEditor(null, customerId));
      customerDetailContent.querySelectorAll("[data-edit-opportunity]").forEach(button => {
        button.addEventListener("click", () => openOpportunityEditor(opportunities.find(item => item.IdOportunidad === button.dataset.editOpportunity)));
      });
    }
  } catch (error) {
    console.error("No se han podido cargar las oportunidades del cliente", error);
  }
};

loadCustomers = async function(force = false) {
  await originalLoadCustomers(force);
  if (salesEntityMode === "opportunities") {
    try { await loadOpportunities(); renderOpportunitiesWorkspace(); } catch (error) { setPortalMessage("customersMessage", error.message, "error"); }
  }
};

renderCustomersList = function() {
  if (salesEntityMode === "opportunities") return renderOpportunitiesWorkspace();
  return originalRenderCustomersList();
};

customerSearchInput?.addEventListener("input", () => {
  if (salesEntityMode === "opportunities") {
    clearTimeout(window.__opportunitySearchTimer);
    window.__opportunitySearchTimer = setTimeout(async () => {
      try { await loadOpportunities(); renderOpportunitiesWorkspace(); } catch (error) { setPortalMessage("customersMessage", error.message, "error"); }
    }, 300);
  }
});
customerPipelineFilter?.addEventListener("change", () => { if (salesEntityMode === "opportunities") renderOpportunitiesWorkspace(); });
customerCommercialFilter?.addEventListener("change", async () => {
  if (salesEntityMode === "opportunities") {
    try { await loadOpportunities(); renderOpportunitiesWorkspace(); } catch (error) { setPortalMessage("customersMessage", error.message, "error"); }
  }
});
refreshCustomersButton?.addEventListener("click", async () => {
  if (salesEntityMode === "opportunities") {
    try { await loadOpportunities(); renderOpportunitiesWorkspace(); setPortalMessage("customersMessage", "Oportunidades actualizadas.", "success"); } catch (error) { setPortalMessage("customersMessage", error.message, "error"); }
  }
});

injectOpportunityInterface();
