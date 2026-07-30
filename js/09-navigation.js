/* ==================================================
   PORTAL COMERCIAL
================================================== */
const dashboardSection = document.getElementById("dashboardView");
const statisticsSection = document.getElementById("statisticsView");
const adminSection = document.getElementById("adminView");
const customersSectionPortal = document.getElementById("customersView");
const showDashboardButton = document.getElementById("showDashboardButton");
const showStatisticsButton = document.getElementById("showStatisticsButton");
const showAdminButton = document.getElementById("showAdminButton");
const showCustomersButtonPortal = document.getElementById("showCustomersButton");
const portalSections = [dashboardSection, calculatorSection, historySection, customersSectionPortal, statisticsSection, adminSection];
const portalNavigationButtons = [showDashboardButton, showCalculatorButton, showCustomersButtonPortal, showHistoryButton, showStatisticsButton, showAdminButton];
let portalCurrentView = "dashboard";
let dashboardLoaded = false;
let adminUsers = [];

function isManagerUser() {
  const role = String(currentSession?.user?.role || "").trim().toLowerCase();
  return role === "manager" || role === "admin";
}

function updatePortalPermissions() {
  const manager = isManagerUser();
  showAdminButton?.classList.toggle("hidden", !manager);
  document.getElementById("statisticsCommercialCard")?.classList.toggle("hidden", !manager);
  const roleElement = document.getElementById("loggedUserRole");
  if (roleElement) roleElement.textContent = currentSession?.user?.role || "Comercial";
}

function activatePortalView(viewName) {
  const views = {
    dashboard: dashboardSection,
    calculator: calculatorSection,
    history: historySection,
    customers: customersSectionPortal,
    statistics: statisticsSection,
    admin: adminSection
  };
  if (viewName === "admin" && !isManagerUser()) viewName = "dashboard";
  portalSections.forEach(section => section?.classList.add("hidden"));
  portalNavigationButtons.forEach(button => button?.classList.remove("active"));
  views[viewName]?.classList.remove("hidden");
  document.querySelector(`[data-view="${viewName}"]`)?.classList.add("active");
  portalCurrentView = viewName;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setPortalMessage(elementId, message = "", type = "") {
  const element = document.getElementById(elementId);
  if (!element) return;
  element.textContent = message;
  element.className = `portal-message${message ? ` visible ${type}` : ""}`;
}

function parsePortalMoney(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  let text = String(value ?? "").trim().replace(/[^0-9,.-]/g, "");
  if (!text) return 0;
  if (text.includes(",") && text.includes(".")) text = text.replace(/\./g, "").replace(",", ".");
  else if (text.includes(",")) text = text.replace(",", ".");
  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parsePortalDate(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  const text = String(value || "").trim();
  const spanish = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+.*)?$/);
  if (spanish) return new Date(Number(spanish[3]), Number(spanish[2]) - 1, Number(spanish[1]));
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(date) {
  return new Intl.DateTimeFormat("es-ES", { month: "short" }).format(date).replace(".", "");
}

function getRecentMonthBuckets(numberOfMonths = 6) {
  const now = new Date();
  return Array.from({ length: numberOfMonths }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (numberOfMonths - 1 - index), 1);
    return { key: monthKey(date), label: monthLabel(date), date, count: 0, amount: 0 };
  });
}

async function ensurePortalBudgetData(force = false) {
  if (force || !budgetHistory.length) await loadBudgetHistory();
  return budgetHistory;
}

function renderVerticalBars(elementId, buckets, valueProperty = "count", formatter = value => String(value)) {
  const element = document.getElementById(elementId);
  if (!element) return;
  const maximum = Math.max(...buckets.map(item => Number(item[valueProperty]) || 0), 1);
  element.innerHTML = buckets.map(item => {
    const value = Number(item[valueProperty]) || 0;
    const height = value ? Math.max(5, Math.round((value / maximum) * 100)) : 2;
    return `<div class="chart-column"><span class="chart-value">${escapeHtml(formatter(value))}</span><div class="chart-bar-track"><i class="chart-bar" style="height:${height}%"></i></div><span class="chart-label">${escapeHtml(item.label)}</span></div>`;
  }).join("");
}

function countBy(items, getter) {
  return items.reduce((accumulator, item) => {
    const key = String(getter(item) || "Sin especificar").trim() || "Sin especificar";
    accumulator[key] = (accumulator[key] || 0) + 1;
    return accumulator;
  }, {});
}

function renderStatusSummary(budgets) {
  const element = document.getElementById("dashboardStatusList");
  const counts = countBy(budgets, budget => budget["Estado"] || "Generado");
  const total = Math.max(budgets.length, 1);
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  element.innerHTML = entries.length ? entries.map(([status, count]) => `<div class="status-summary-item"><span>${escapeHtml(status)}</span><div class="status-progress"><i style="width:${Math.round(count / total * 100)}%"></i></div><strong>${count}</strong></div>`).join("") : '<div class="empty-panel">Todavía no hay presupuestos.</div>';
}

function renderRecentBudgets(budgets) {
  const element = document.getElementById("dashboardRecentBudgets");
  const recent = [...budgets].sort((a, b) => (parsePortalDate(b["Fecha"])?.getTime() || 0) - (parsePortalDate(a["Fecha"])?.getTime() || 0)).slice(0, 6);
  element.innerHTML = recent.length ? recent.map((budget, index) => `<button class="recent-budget-item" type="button" data-recent-index="${index}"><span class="recent-budget-main"><strong>${escapeHtml(budget["Cliente"] || "Cliente sin nombre")}</strong><span>${escapeHtml(budget["ID Presupuesto"] || "—")} · ${escapeHtml(budget["Solución"] || "Sin solución")}</span></span><span class="recent-budget-amount">${euros(parsePortalMoney(budget["Total Mensual"]))}</span><span class="status-pill">${escapeHtml(budget["Estado"] || "Generado")}</span></button>`).join("") : '<div class="empty-panel">Todavía no hay actividad reciente.</div>';
  element.querySelectorAll("[data-recent-index]").forEach(button => button.addEventListener("click", () => openBudgetDetail(recent[Number(button.dataset.recentIndex)])));
}

function renderTopProducts(budgets) {
  const element = document.getElementById("dashboardTopProducts");
  const counts = countBy(budgets, budget => budget["Solución"]);
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
  element.innerHTML = entries.length ? entries.map(([product, count], index) => `<div class="ranking-item"><span class="ranking-position">${index + 1}</span><span>${escapeHtml(product)}</span><strong>${count}</strong></div>`).join("") : '<div class="empty-panel">No hay productos que mostrar.</div>';
}

async function loadDashboard(force = false) {
  setPortalMessage("dashboardMessage", "Actualizando dashboard...", "loading");
  try {
    const budgets = await ensurePortalBudgetData(force);
    const now = new Date();
    const currentKey = monthKey(now);
    const previousKey = monthKey(new Date(now.getFullYear(), now.getMonth() - 1, 1));
    const current = budgets.filter(budget => { const date = parsePortalDate(budget["Fecha"]); return date && monthKey(date) === currentKey; });
    const previous = budgets.filter(budget => { const date = parsePortalDate(budget["Fecha"]); return date && monthKey(date) === previousKey; });
    const accepted = budgets.filter(budget => String(budget["Estado"] || "").toLowerCase() === "aceptado").length;
    const clients = new Set(budgets.map(budget => String(budget["CIF"] || budget["Cliente"] || "").trim().toLowerCase()).filter(Boolean));
    const currentAmount = current.reduce((sum, budget) => sum + parsePortalMoney(budget["Total Mensual"]), 0);
    document.getElementById("kpiMonthlyBudgets").textContent = current.length;
    document.getElementById("kpiMonthlyAmount").textContent = euros(currentAmount);
    document.getElementById("kpiAccepted").textContent = accepted;
    document.getElementById("kpiConversion").textContent = `Conversión ${budgets.length ? Math.round(accepted / budgets.length * 100) : 0} %`;
    document.getElementById("kpiClients").textContent = clients.size;
    const variation = previous.length ? Math.round((current.length - previous.length) / previous.length * 100) : null;
    document.getElementById("kpiMonthlyVariation").textContent = variation === null ? "Sin datos del mes anterior" : `${variation >= 0 ? "+" : ""}${variation} % frente al mes anterior`;
    document.getElementById("dashboardWelcome").textContent = `Hola, ${currentSession?.user?.commercial || currentSession?.user?.username || ""}. Este es tu resumen comercial.`;
    const buckets = getRecentMonthBuckets(6);
    budgets.forEach(budget => { const date = parsePortalDate(budget["Fecha"]); const bucket = date && buckets.find(item => item.key === monthKey(date)); if (bucket) bucket.count += 1; });
    renderVerticalBars("dashboardMonthlyChart", buckets);
    renderStatusSummary(budgets);
    renderRecentBudgets(budgets);
    renderTopProducts(budgets);
    dashboardLoaded = true;
    setPortalMessage("dashboardMessage", "", "");
  } catch (error) {
    console.error(error);
    setPortalMessage("dashboardMessage", `No se ha podido cargar el dashboard: ${error.message}`, "error");
  }
}

function getStatisticsBudgets() {
  const value = document.getElementById("statisticsPeriodFilter")?.value || "6";
  if (value === "all") return [...budgetHistory];
  const months = Number(value) || 6;
  const limit = new Date();
  limit.setMonth(limit.getMonth() - months + 1, 1);
  limit.setHours(0, 0, 0, 0);
  return budgetHistory.filter(budget => { const date = parsePortalDate(budget["Fecha"]); return date && date >= limit; });
}

function renderHorizontalStatusChart(budgets) {
  const element = document.getElementById("statisticsStatusChart");
  const counts = countBy(budgets, budget => budget["Estado"] || "Generado");
  const max = Math.max(...Object.values(counts), 1);
  element.innerHTML = Object.entries(counts).sort((a,b) => b[1]-a[1]).map(([label,value]) => `<div class="horizontal-chart-row"><span class="horizontal-chart-label">${escapeHtml(label)}</span><div class="horizontal-chart-track"><i style="width:${Math.round(value/max*100)}%"></i></div><span class="horizontal-chart-value">${value}</span></div>`).join("") || '<div class="empty-panel">No hay datos para el periodo.</div>';
}

function renderProductStatistics(budgets) {
  const grouped = {};
  budgets.forEach(budget => { const name = String(budget["Solución"] || "Sin especificar"); grouped[name] ||= { count:0, monthly:0, annual:0 }; grouped[name].count++; grouped[name].monthly += parsePortalMoney(budget["Total Mensual"]); grouped[name].annual += parsePortalMoney(budget["Total Anual"]); });
  const rows = Object.entries(grouped).sort((a,b) => b[1].count-a[1].count);
  document.getElementById("statisticsProductTable").innerHTML = rows.length ? `<table class="portal-data-table"><thead><tr><th>Solución</th><th>Presupuestos</th><th>Mensual</th><th>Anual</th></tr></thead><tbody>${rows.map(([name,data]) => `<tr><td>${escapeHtml(name)}</td><td class="table-number">${data.count}</td><td class="table-number">${euros(data.monthly)}</td><td class="table-number">${euros(data.annual)}</td></tr>`).join("")}</tbody></table>` : '<div class="empty-panel">No hay datos para el periodo.</div>';
}

function renderCommercialStatistics(budgets) {
  const grouped = {};
  budgets.forEach(budget => { const name = String(budget["Comercial"] || "Sin especificar"); grouped[name] ||= { count:0, monthly:0, accepted:0 }; grouped[name].count++; grouped[name].monthly += parsePortalMoney(budget["Total Mensual"]); if (String(budget["Estado"]||"").toLowerCase()==="aceptado") grouped[name].accepted++; });
  const rows = Object.entries(grouped).sort((a,b) => b[1].monthly-a[1].monthly);
  document.getElementById("statisticsCommercialTable").innerHTML = rows.length ? `<table class="portal-data-table"><thead><tr><th>Comercial</th><th>Presupuestos</th><th>Aceptados</th><th>Conversión</th><th>Importe mensual</th></tr></thead><tbody>${rows.map(([name,data]) => `<tr><td>${escapeHtml(name)}</td><td class="table-number">${data.count}</td><td class="table-number">${data.accepted}</td><td class="table-number">${Math.round(data.accepted/data.count*100)} %</td><td class="table-number">${euros(data.monthly)}</td></tr>`).join("")}</tbody></table>` : '<div class="empty-panel">No hay datos para el periodo.</div>';
}

async function loadStatistics(force = false) {
  setPortalMessage("statisticsMessage", "Actualizando estadísticas...", "loading");
  try {
    await ensurePortalBudgetData(force);
    const budgets = getStatisticsBudgets();
    const monthly = budgets.reduce((sum,budget) => sum + parsePortalMoney(budget["Total Mensual"]),0);
    const annual = budgets.reduce((sum,budget) => sum + parsePortalMoney(budget["Total Anual"]),0);
    document.getElementById("statsTotalBudgets").textContent = budgets.length;
    document.getElementById("statsMonthlyAmount").textContent = euros(monthly);
    document.getElementById("statsAnnualAmount").textContent = euros(annual);
    document.getElementById("statsAverageTicket").textContent = euros(budgets.length ? monthly/budgets.length : 0);
    const period = document.getElementById("statisticsPeriodFilter").value;
    const bucketCount = period === "all" ? 12 : Number(period);
    const buckets = getRecentMonthBuckets(Math.min(Math.max(bucketCount,3),12));
    budgets.forEach(budget => { const date=parsePortalDate(budget["Fecha"]); const bucket=date&&buckets.find(item=>item.key===monthKey(date)); if(bucket) bucket.amount += parsePortalMoney(budget["Total Mensual"]); });
    renderVerticalBars("statisticsAmountChart", buckets, "amount", value => value >= 1000 ? `${(value/1000).toLocaleString("es-ES",{maximumFractionDigits:1})}k €` : `${Math.round(value)} €`);
    renderHorizontalStatusChart(budgets);
    renderProductStatistics(budgets);
    if (isManagerUser()) renderCommercialStatistics(budgets);
    setPortalMessage("statisticsMessage", "", "");
  } catch(error) {
    console.error(error);
    setPortalMessage("statisticsMessage", `No se han podido cargar las estadísticas: ${error.message}`, "error");
  }
}

function renderAdminCatalogSummary() {
  const microProducts = Object.keys(apps || {}).length;
  const erpFamilies = Object.keys(erpPlans || {}).length;
  const erpPlanCount = Object.values(erpPlans || {}).reduce((sum,family) => sum + Object.keys(family?.plans || {}).length,0);
  const extras = Object.keys(erpExtras || {}).length;
  document.getElementById("adminCatalogSummary").innerHTML = `<div class="catalog-stat"><span>Productos Microdata</span><strong>${microProducts}</strong></div><div class="catalog-stat"><span>Familias ERP</span><strong>${erpFamilies}</strong></div><div class="catalog-stat"><span>Planes ERP</span><strong>${erpPlanCount}</strong></div><div class="catalog-stat"><span>Extras ERP</span><strong>${extras}</strong></div>`;
  document.getElementById("adminSystemStatus").innerHTML = `<div><dt>Sesión</dt><dd>Activa</dd></div><div><dt>Rol</dt><dd>${escapeHtml(currentSession?.user?.role || "Comercial")}</dd></div><div><dt>Catálogo</dt><dd>${applicationInitialized ? "Cargado" : "Pendiente"}</dd></div><div><dt>Presupuestos visibles</dt><dd>${budgetHistory.length}</dd></div><div><dt>Versión</dt><dd>2.0 Portal</dd></div>`;
}

function renderAdminUsers() {
  const element = document.getElementById("adminUsersTable");
  element.innerHTML = adminUsers.length ? `<table class="portal-data-table"><thead><tr><th>Usuario</th><th>Nombre</th><th>Rol</th><th>Activo</th><th></th></tr></thead><tbody>${adminUsers.map((user,index) => `<tr><td>${escapeHtml(user.username)}</td><td>${escapeHtml(user.commercial)}</td><td><select data-user-role="${index}"><option value="Comercial" ${user.role==="Comercial"?"selected":""}>Comercial</option><option value="Manager" ${user.role==="Manager"?"selected":""}>Manager</option><option value="Admin" ${user.role==="Admin"?"selected":""}>Admin</option></select></td><td><input data-user-active="${index}" type="checkbox" ${user.active?"checked":""} ${user.username===currentSession?.user?.username?"disabled title=\"No puedes desactivarte a ti mismo\"":""}></td><td><button class="portal-secondary-button" data-save-user="${index}" type="button">Guardar</button></td></tr>`).join("")}</tbody></table>` : '<div class="empty-panel">No se han encontrado usuarios.</div>';
  element.querySelectorAll("[data-save-user]").forEach(button => button.addEventListener("click", async () => {
    const index=Number(button.dataset.saveUser); const user=adminUsers[index];
    const role=element.querySelector(`[data-user-role="${index}"]`).value;
    const active=element.querySelector(`[data-user-active="${index}"]`).checked;
    button.disabled=true;
    try { const response=await postBudgetAction("updateUser",{ username:user.username, role, active }); if(!response?.success) throw new Error(response?.message||"No se pudo actualizar el usuario."); user.role=role; user.active=active; setPortalMessage("adminMessage",`Usuario ${user.username} actualizado.`,"success"); }
    catch(error){ setPortalMessage("adminMessage",error.message,"error"); }
    finally{ button.disabled=false; }
  }));
}

async function loadAdmin(force = false) {
  if (!isManagerUser()) return;
  setPortalMessage("adminMessage", "Cargando administración...", "loading");
  try {
    if (force || !adminUsers.length) {
      const response = await jsonpRequest("listUsers", { token: currentSession.token });
      if (!response?.success || !Array.isArray(response.users)) throw new Error(response?.message || "No se pudieron cargar los usuarios.");
      adminUsers = response.users;
    }
    renderAdminUsers();
    renderAdminCatalogSummary();
    setPortalMessage("adminMessage", "", "");
  } catch(error) {
    console.error(error);
    setPortalMessage("adminMessage", `No se ha podido cargar la administración: ${error.message}`, "error");
  }
}

function refreshPortalCatalogControls() {
  els.appSelect.innerHTML = "";
  Object.entries(apps)
    .filter(([, app]) => (app.type || "main") === "main")
    .sort(([, first], [, second]) => Number(first.order || 0) - Number(second.order || 0))
    .forEach(([key, app]) => {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = app.name;
      els.appSelect.appendChild(option);
    });
  refreshPlans();
  calculate();
  refreshErpPlans();
}

async function clearCatalogCacheFromPortal() {
  const button=document.getElementById("clearCatalogCacheButton"); button.disabled=true;
  try { const response=await postBudgetAction("clearCatalogCache"); if(!response?.success) throw new Error(response?.message||"No se pudo vaciar la caché."); await loadApplicationCatalog(); refreshPortalCatalogControls(); renderAdminCatalogSummary(); setPortalMessage("adminMessage","Caché vaciada y catálogo recargado.","success"); }
  catch(error){ setPortalMessage("adminMessage",error.message,"error"); }
  finally{ button.disabled=false; }
}

async function openPortalView(viewName, options = {}) {
  activatePortalView(viewName);
  if (viewName === "dashboard") await loadDashboard(Boolean(options.force));
  if (viewName === "history") await loadBudgetHistory();
  if (viewName === "statistics") await loadStatistics(Boolean(options.force));
  if (viewName === "customers" && typeof loadCustomers === "function") await loadCustomers(Boolean(options.force));
  if (viewName === "admin") await loadAdmin(Boolean(options.force));
}

// API pública del módulo de navegación. Los listeners se registran en 30-ui.js.
window.Navigation = Object.freeze({
  open: openPortalView,
  activate: activatePortalView,
  refreshDashboard: () => loadDashboard(true),
  refreshStatistics: () => loadStatistics(true),
  refreshAdmin: () => loadAdmin(true),
  clearCatalogCache: clearCatalogCacheFromPortal,
  updatePermissions: updatePortalPermissions
});

const originalShowApplication = showApplication;
showApplication = function() {
  originalShowApplication();
  updatePortalPermissions();
  openPortalView("dashboard");
};

const originalClearLocalSession = clearLocalSession;
clearLocalSession = function() {
  dashboardLoaded = false;
  adminUsers = [];
  originalClearLocalSession();
};
