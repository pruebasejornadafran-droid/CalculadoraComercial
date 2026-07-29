/**
 * Cliente unico de comunicacion con Apps Script.
 * Los modulos de interfaz no deben construir peticiones directamente.
 */
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyVZBXBRiJ2TnMmoYyTf-GGc8q6bYGfakYph1oXveLO7met5nLxDLbSgGVHKI70_Ts/exec";

const ApiClient = (() => {
  const DEFAULT_TIMEOUT = 30000;

  function getToken() {
    return currentSession?.token || "";
  }

  function assertResponse(result) {
    if (!result || typeof result !== "object") {
      throw new Error("La respuesta del servidor no es valida.");
    }
    return result;
  }

  function get(action, parameters = {}, options = {}) {
    return new Promise((resolve, reject) => {
      const callbackName = `jsonpCallback_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
      const script = document.createElement("script");
      const timeout = Number(options.timeout || DEFAULT_TIMEOUT);

      const cleanup = () => {
        script.remove();
        delete window[callbackName];
      };

      const timeoutId = setTimeout(() => {
        cleanup();
        reject(new Error("Apps Script no ha respondido en 30 segundos."));
      }, timeout);

      window[callbackName] = result => {
        clearTimeout(timeoutId);
        cleanup();
        try {
          resolve(assertResponse(result));
        } catch (error) {
          reject(error);
        }
      };

      script.onerror = () => {
        clearTimeout(timeoutId);
        console.error("URL JSONP que ha fallado:", script.src);
        cleanup();
        reject(new Error("No se ha podido cargar la respuesta de Apps Script."));
      };

      const query = new URLSearchParams({
        action,
        ...parameters,
        callback: callbackName,
        _: Date.now()
      });

      script.src = `${APPS_SCRIPT_URL}?${query.toString()}`;
      document.body.appendChild(script);
    });
  }

  async function post(action, payload = {}, options = {}) {
    const timeout = Number(options.timeout || DEFAULT_TIMEOUT);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action, ...payload }),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}.`);
      }

      return assertResponse(await response.json());
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("Apps Script no ha respondido en 30 segundos.");
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  function call(action, payload = {}, options = {}) {
    const method = String(options.method || "POST").toUpperCase();
    const includeToken = options.auth !== false;
    const requestPayload = includeToken && !payload.token
      ? { ...payload, token: getToken() }
      : { ...payload };

    return method === "GET"
      ? get(action, requestPayload, options)
      : post(action, requestPayload, options);
  }

  return Object.freeze({ get, post, call });
})();

// Estado compartido por Historial, documentos y Portal.
let budgetHistory = [];
let currentLoadedBudget = null;

const BudgetManager = {
  clone(value) {
    return JSON.parse(JSON.stringify(value));
  },

  replaceMicrodataItems(items) {
    microdataBudgetItems = this.clone(Array.isArray(items) ? items : []);
    microdataEditingItemId = null;
    microdataOpenItemId = microdataBudgetItems.find(
      item => item.itemType !== "addon" && !item.parentItemId
    )?.id || null;
    resetMicrodataEditMode();
    renderMicrodataBudget();
  },

  clearLoadedBudget() {
    currentLoadedBudget = null;
  }
};

// Funciones publicas de compatibilidad usadas por Historial y Portal.
function showCalculator() {
  if (typeof activatePortalView === "function") {
    activatePortalView("calculator");
    return;
  }

  calculatorSection.classList.remove("hidden");
  historySection.classList.add("hidden");
  showCalculatorButton.classList.add("active");
  showHistoryButton.classList.remove("active");
}

async function showHistory() {
  if (typeof openPortalView === "function") {
    await openPortalView("history");
    return;
  }

  calculatorSection.classList.add("hidden");
  historySection.classList.remove("hidden");
  showCalculatorButton.classList.remove("active");
  showHistoryButton.classList.add("active");
  await loadBudgetHistory();
}

showCalculatorButton.addEventListener("click", showCalculator);
showHistoryButton.addEventListener("click", showHistory);

// Compatibilidad temporal con los modulos existentes.
function jsonpRequest(action, parameters = {}) {
  return ApiClient.get(action, parameters);
}
