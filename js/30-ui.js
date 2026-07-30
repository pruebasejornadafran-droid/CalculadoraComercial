/* Shine Sales Workspace - inicialización central de interfaz */
(() => {
  "use strict";

  const bound = new WeakSet();

  function on(id, eventName, handler) {
    const element = document.getElementById(id);
    if (!element || bound.has(element)) return false;
    element.addEventListener(eventName, handler);
    bound.add(element);
    return true;
  }

  function safeCall(callback) {
    return (...args) => {
      try {
        return callback(...args);
      } catch (error) {
        console.error("Error de interfaz:", error);
      }
    };
  }

  function initNavigation() {
    const navigation = window.Navigation;
    if (!navigation) {
      console.error("Navigation no está disponible.");
      return;
    }

    on("showDashboardButton", "click", safeCall(() => navigation.open("dashboard")));
    on("showCalculatorButton", "click", safeCall(() => navigation.open("calculator")));
    on("showHistoryButton", "click", safeCall(() => navigation.open("history")));
    on("showStatisticsButton", "click", safeCall(() => navigation.open("statistics")));
    on("showAdminButton", "click", safeCall(() => navigation.open("admin")));
    on("showCustomersButton", "click", safeCall(() => navigation.open("customers")));

    on("dashboardNewBudgetButton", "click", safeCall(() => navigation.open("calculator")));
    on("dashboardOpenHistoryButton", "click", safeCall(() => navigation.open("history")));
    on("refreshDashboardButton", "click", safeCall(() => navigation.refreshDashboard()));
    on("refreshStatisticsButton", "click", safeCall(() => navigation.refreshStatistics()));
    on("statisticsPeriodFilter", "change", safeCall(() => navigation.refreshStatistics()));
    on("refreshAdminButton", "click", safeCall(() => navigation.refreshAdmin()));
    on("clearCatalogCacheButton", "click", safeCall(() => navigation.clearCatalogCache()));
  }

  function initModules() {
    const modules = [
      window.Dashboard,
      window.Customers,
      window.Opportunities,
      window.Actions,
      window.SidePanel
    ];

    modules.forEach((module) => {
      if (module && typeof module.init === "function") {
        safeCall(() => module.init())();
      }
    });
  }

  function init() {
    initNavigation();
    initModules();
    document.documentElement.dataset.uiReady = "true";
  }

  window.UI = Object.freeze({ init });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
