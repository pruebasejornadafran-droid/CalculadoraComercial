/* ==================================================
   PRESUPUESTO MICRODATA
================================================== */

let microdataBudgetItems = [];

let microdataEditingItemId = null;
let microdataOpenItemId = null;
let currentMicrodataPreview = null;

let apps = {};
let erpPlans = {};
let erpExtras = {};

const els = {
  appSelect: document.getElementById("appSelect"),
  planSelect: document.getElementById("planSelect"),
  quantityInput: document.getElementById("quantityInput"),
  quantityLabel: document.getElementById("quantityLabel"),
  billingSelect: document.getElementById("billingSelect"),
  billingField: document.getElementById("billingField"),
  noticeBox: document.getElementById("noticeBox"),
  mainResult: document.getElementById("mainResult"),
  resultSubtitle: document.getElementById("resultSubtitle"),
  copyButton: document.getElementById("copyButton"),
  extraUsersInput: document.getElementById("usersInput"),
  selectBuzones: document.getElementById("selectBuzones"),
  selectMdlGest: document.getElementById("gestModules"),
  trfVrb: document.getElementById("trfVrb"),
  gestFiscal: document.getElementById("gestFiscal"),
  gestLaboral: document.getElementById("gestLaboral"),
  porEmp: document.getElementById("porEmp"),
  porTbj: document.getElementById("porTbj"),
  empMdl: document.getElementById("empMdl"),
  empDrct: document.getElementById("empDrct"),
  empScds: document.getElementById("empScds"),
  totalFiscal: document.getElementById("ttlFiscal"),
  totalLaboral: document.getElementById("ttlLaboral"),
  erpFamilySelect: document.getElementById("erpFamilySelect"),
  erpPlanSelect: document.getElementById("erpPlanSelect"),
  erpBasePrice: document.getElementById("erpBasePrice"),
  erpIncludedUsers: document.getElementById("erpIncludedUsers"),
  erpMaxUsers: document.getElementById("erpMaxUsers"),
  erpFeaturesTable: document.getElementById("erpFeaturesTable"),
  erpSummaryBase: document.getElementById("erpSummaryBase"),
  erpSummaryExtras: document.getElementById("erpSummaryExtras"),
  erpTotal: document.getElementById("erpTotal"),
  erpExtrasList: document.getElementById("erpExtrasList"),
  erpAnnualTotal: document.getElementById("erpAnnualTotal"),
  erpBaseDiscountType: document.getElementById("erpBaseDiscountType"),
  erpBaseDiscountValue: document.getElementById("erpBaseDiscountValue"),
  erpBaseFinalPrice: document.getElementById("erpBaseFinalPrice"),
  erpExtraUsersBlock: document.getElementById("erpExtraUsersBlock"),
  erpExtraUsersDescription: document.getElementById("erpExtraUsersDescription"),
  erpExtraUsersInput: document.getElementById("erpExtraUsersInput"),
  erpExtraUsersPrice: document.getElementById("erpExtraUsersPrice"),
  addMicrodataItemButton: document.getElementById("addMicrodataItemButton"),
  cancelMicrodataEditButton: document.getElementById("cancelMicrodataEditButton"),
  microdataBudgetItems: document.getElementById("microdataBudgetItems"),
  microdataEmptyState: document.getElementById("microdataEmptyState"),
  microdataBudgetTableWrapper: document.getElementById("microdataBudgetTableWrapper"),
  microdataItemCount: document.getElementById("microdataItemCount"),
  microdataTotalLicense: document.getElementById("microdataTotalLicense"),
  microdataTotalMaintenance: document.getElementById("microdataTotalMaintenance"),
  microdataTotalMonthlyFee: document.getElementById("microdataTotalMonthlyFee"),
  microdataTotalAnnualFee: document.getElementById("microdataTotalAnnualFee"),
  microdataTotal: document.getElementById("microdataTotal"),
  summaryMonthly: document.getElementById("summaryMonthly"),
  summaryAnnual: document.getElementById("summaryAnnual"),
};


const extra = document.getElementById("extraMdl");
const extraUsersLabel = document.getElementById("extraUsersLabel");
const addModl = document.getElementById("addModl");
const module = document.getElementById("modulo");
const extraModule = document.getElementById("extraModule");
const usersCFExtra = document.getElementById("usersCertiFExtra");
const moduleGestExtra = document.getElementById("moduleGestExtra");
const usersExtra = document.getElementById("userExtra");
const uExtra = document.getElementById("usersCFExtra");
const calculatorSection = document.getElementById("calculatorSection");
const historySection = document.getElementById("historyView");
const showCalculatorButton = document.getElementById("showCalculatorButton");
const showHistoryButton = document.getElementById("showHistoryButton");
const refreshHistoryButton = document.getElementById("refreshHistoryButton");
const historySearchInput = document.getElementById("historySearchInput");
const historyStatusFilter = document.getElementById("historyStatusFilter");
const historyTableBody = document.getElementById("historyTableBody");
const historyMessage = document.getElementById("historyMessage");
const budgetDetailModal = document.getElementById("budgetDetailModal");
const closeBudgetDetailModal = document.getElementById("closeBudgetDetailModal");
const budgetNotes = document.getElementById("budgetNotes");
const budgetNotesMicrodata = document.getElementById("microdataBudgetNotes");
const loginScreen = document.getElementById("loginScreen");
const appContainer = document.getElementById("app-container");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const changePasswordForm = document.getElementById("changePasswordForm");
const loginMessage = document.getElementById("loginMessage");
const registerMessage = document.getElementById("registerMessage");
const changePasswordMessage = document.getElementById("changePasswordMessage");
const accessTitle = document.getElementById("accessTitle");
const accessSubtitle = document.getElementById("accessSubtitle");
const showRegisterButton = document.getElementById("showRegisterButton");
const showChangePasswordButton = document.getElementById("showChangePasswordButton");
const backToLoginButtons = document.querySelectorAll(".back-to-login");
const registerPassword = document.getElementById("registerPassword");
const registerPasswordConfirm = document.getElementById("registerPasswordConfirm");
const registerPasswordMatch = document.getElementById("registerPasswordMatch");
const newPassword = document.getElementById("newPassword");
const newPasswordConfirm = document.getElementById("newPasswordConfirm");
const changePasswordMatch = document.getElementById("changePasswordMatch");
const logoutButton = document.getElementById("logoutButton");

/*
 * El catálogo se carga de forma unificada mediante loadApplicationCatalog().
 * Se han retirado los cargadores antiguos separados para evitar rutas de
 * inicialización duplicadas.
 */

let currentSession = null;

function saveSession(sessionData) {
  currentSession = sessionData;
  sessionStorage.setItem("budgetSession", JSON.stringify(sessionData));
}

function restoreSession() {
    const storedSession = sessionStorage.getItem("budgetSession");

    if (!storedSession) {
        return false;
    }

    try {
        currentSession = JSON.parse(storedSession);

        if (!currentSession?.token || !currentSession?.user) {
            throw new Error("La sesión almacenada no es válida.");
        }

        return true;

    } catch (error) {
      currentSession = null;
      sessionStorage.removeItem("budgetSession");
      return false;
    }
}

function showApplication() {
  loginScreen.classList.add("hidden");
  appContainer.classList.remove("hidden");
  updateLoggedUserIndicator();
}

function showLogin() {
  appContainer.classList.add("hidden");
  loginScreen.classList.remove("hidden");
  showAccessForm("login");
}

async function logout() {
  const token = currentSession?.token;

  logoutButton.disabled = true;
  logoutButton.classList.add("loading");

  try {
    if (token) {
      const response = await jsonpRequest("logout", { token });

      if (response && response.success === false) {
        console.warn("Apps Script no pudo cerrar la sesión:", response.message);
      }
    }

  } catch (error) {
    /*
     * Aunque Apps Script no responda, cerramos la
     * sesión local para que el usuario pueda salir.
     */
    console.warn("No se pudo cerrar la sesión en el servidor:", error);

  } finally {
    clearLocalSession();
    logoutButton.disabled = false;
    logoutButton.classList.remove("loading");
  }
}

function clearLocalSession() {
  currentSession = null;

  sessionStorage.removeItem("budgetSession");

  budgetHistory = [];

  const userInfo = document.getElementById("userInfo");
  const loggedUserName = document.getElementById("loggedUserName");

  if (userInfo) {
    userInfo.classList.add("hidden");
  }

  if (loggedUserName) {
    loggedUserName.textContent = "";
  }

  loginForm.reset();
  registerForm.reset();
  changePasswordForm.reset();

  clearAllAccessMessages();

  showLogin();

  setAccessMessage(loginMessage, "Sesión cerrada correctamente.", "success");
}

logoutButton.addEventListener("click", logout);

/* =========================================
   CAMBIO ENTRE FORMULARIOS
   ========================================= */

function showAccessForm(formName) {
  const forms = [loginForm, registerForm, changePasswordForm];
  forms.forEach(form => {
    form.classList.add("hidden");
    form.classList.remove("access-form-active");
  });
  clearAllAccessMessages();
  if (formName === "register") {
    registerForm.classList.remove("hidden");
    registerForm.classList.add("access-form-active");
    accessTitle.textContent = "Crear usuario";
    accessSubtitle.textContent = "Regístrate para utilizar la calculadora comercial";
    setTimeout(() => {
      document.getElementById("registerUsername")?.focus();
    }, 100);
    return;
  }
  if (formName === "changePassword") {
    changePasswordForm.classList.remove("hidden");
    changePasswordForm.classList.add("access-form-active");
    accessTitle.textContent = "Cambiar contraseña";
    accessSubtitle.textContent = "Actualiza de forma segura tus credenciales";
    setTimeout(() => {
      document.getElementById("changePasswordUsername")?.focus();
    }, 100);
    return;
  }
  loginForm.classList.remove("hidden");
  loginForm.classList.add("access-form-active");
  accessTitle.textContent = "Calculadora comercial";
  accessSubtitle.textContent = "Accede para crear y consultar tus presupuestos";
  setTimeout(() => {
    document.getElementById("loginUsername")?.focus();
  }, 100);
}

showRegisterButton.addEventListener("click",() => {
    showAccessForm("register");
  }
);

showChangePasswordButton.addEventListener("click",() => {
    showAccessForm("changePassword");
  }
);

backToLoginButtons.forEach(button => {
  button.addEventListener("click",() => {
      showAccessForm("login");
    }
  );
});

/* =========================================
   MENSAJES
   ========================================= */

function setAccessMessage(element, message, type = "info") {
  if (!element) {
    return;
  }
  element.textContent = message || "";
  element.classList.remove("message-error", "message-success", "message-info");
  if (message) {
    element.classList.add(`message-${type}`);
  }
}

function clearAllAccessMessages() {
  setAccessMessage(loginMessage,"");
  setAccessMessage(registerMessage,"");
  setAccessMessage(changePasswordMessage,"");
  clearPasswordMatchMessage(registerPasswordMatch);
  clearPasswordMatchMessage(changePasswordMatch);
}

/* =========================================
   ESTADO DE BOTONES
   ========================================= */

function setButtonLoading(button, isLoading) {
  if (!button) {
    return;
  }
  const defaultContent = button.querySelector(".button-default-content");
  const loadingContent = button.querySelector(".button-loading-content");

  button.disabled = isLoading;

  defaultContent?.classList.toggle("hidden", isLoading);
  loadingContent?.classList.toggle("hidden", !isLoading);
}

/* =========================================
   MOSTRAR / OCULTAR CONTRASEÑAS
   ========================================= */

document.querySelectorAll(".password-toggle")
  .forEach(button => {
    button.addEventListener("click", () => {
        const inputId = button.dataset.passwordTarget;
        const input = document.getElementById(inputId);

        if (!input) {
          return;
        }

        const isPassword = input.type === "password";
        input.type = isPassword ? "text" : "password";
        button.textContent = isPassword ? "🙈" : "👁";
        button.setAttribute("aria-label", isPassword ? "Ocultar contraseña" : "Mostrar contraseña");
        button.title = isPassword ? "Ocultar contraseña" : "Mostrar contraseña";
      }
    );
  });

/* =========================================
   VALIDACIÓN DE CONTRASEÑAS
   ========================================= */

function validatePasswordMatch(passwordInput, confirmationInput, messageElement) {
  const password = passwordInput.value;
  const confirmation = confirmationInput.value;
  confirmationInput.classList.remove("input-error", "input-success");
  if (!password && !confirmation) {
    clearPasswordMatchMessage(messageElement);
    return false;
  }

  if (!confirmation) {
    clearPasswordMatchMessage(messageElement);
    return false;
  }

  if (password === confirmation) {
    messageElement.textContent = "✓ Las contraseñas coinciden";
    messageElement.className = "password-match-message match-success";
    confirmationInput.classList.add("input-success");
    return true;
  }

  messageElement.textContent = "✕ Las contraseñas no coinciden";
  messageElement.className = "password-match-message match-error";
  confirmationInput.classList.add("input-error");

  return false;
}

function clearPasswordMatchMessage(messageElement) {
  if (!messageElement) {
    return;
  }

  messageElement.textContent = "";

  messageElement.className = "password-match-message";
}

registerPassword.addEventListener("input", () => {
    validatePasswordMatch(registerPassword, registerPasswordConfirm, registerPasswordMatch);
  }
);

registerPasswordConfirm.addEventListener("input", () => {
    validatePasswordMatch(registerPassword, registerPasswordConfirm, registerPasswordMatch);
  }
);

newPassword.addEventListener("input", () => {
    validatePasswordMatch(newPassword, newPasswordConfirm, changePasswordMatch);
  }
);

newPasswordConfirm.addEventListener("input", () => {
    validatePasswordMatch(newPassword, newPasswordConfirm, changePasswordMatch);
  }
);


/* =========================================
   INICIAR SESIÓN
   ========================================= */

loginForm.addEventListener("submit", async event => {
    event.preventDefault();

    const submitButton = document.getElementById("loginSubmitButton");
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;
    setAccessMessage(loginMessage, "", "info");
    setButtonLoading(submitButton, true);

    try {
      const response = await jsonpRequest("login", 
          {
            username,
            password
          }
        );

      if (!response?.success) {
        throw new Error(response?.message || "No se ha podido iniciar sesión.");
      }

      saveSession(response);
      loginForm.reset();

      await initializeApplicationData();

      showApplication();

    } catch (error) {
      setAccessMessage(loginMessage, error.message || "No se ha podido iniciar sesión.", "error");
    } finally {
      setButtonLoading(submitButton, false);
    }
  }
);

/* =========================================
   CREAR USUARIO
   ========================================= */

registerForm.addEventListener("submit", async event => {
    event.preventDefault();

    const submitButton = document.getElementById("registerSubmitButton");
    const username = document.getElementById("registerUsername").value.trim();
    const commercial = document.getElementById("registerCommercial").value.trim();
    const password = registerPassword.value;
    const passwordConfirm = registerPasswordConfirm.value;
    
    setAccessMessage(registerMessage, "", "info");

    if (username.length < 3) {
      setAccessMessage(registerMessage, "El usuario debe tener al menos 3 caracteres.", "error");
      return;
    }

    if (password.length < 4) {
      setAccessMessage(registerMessage, "La contraseña debe tener al menos 4 caracteres.", "error");
      return;
    }

    if (password !== passwordConfirm) {
      setAccessMessage(registerMessage, "Las contraseñas no coinciden.", "error");
      return;
    }

    setButtonLoading(submitButton, true);

    try {
      const response = await jsonpRequest("register", {
            username,
            commercial,
            password
          }
        );

      if (!response?.success) {
        throw new Error(response?.message || "No se ha podido crear el usuario.");
      }

      registerForm.reset();
      clearPasswordMatchMessage(registerPasswordMatch);
      showAccessForm("login");
      document.getElementById("loginUsername").value = username;
      setAccessMessage(loginMessage,"Usuario creado correctamente. Ya puedes iniciar sesión.", "success");

    } catch (error) {
      setAccessMessage(registerMessage, error.message || "No se ha podido crear el usuario.", "error");
    } finally {
      setButtonLoading(submitButton, false);
    }
  }
);

/* =========================================
   CAMBIAR CONTRASEÑA
   ========================================= */

changePasswordForm.addEventListener("submit", async event => {
    event.preventDefault();

    const submitButton = document.getElementById("changePasswordSubmitButton");
    const username = document.getElementById("changePasswordUsername").value.trim();
    const currentPassword = document.getElementById("currentPassword").value;
    const nextPassword = newPassword.value;
    const confirmation = newPasswordConfirm.value;

    setAccessMessage(changePasswordMessage, "", "info");

    if (nextPassword.length < 4) {
      setAccessMessage(changePasswordMessage, "La nueva contraseña debe tener al menos 4 caracteres.", "error");
      return;
    }

    if (nextPassword !== confirmation) {
      setAccessMessage(changePasswordMessage, "Las nuevas contraseñas no coinciden.", "error");
      return;
    }

    if (currentPassword === nextPassword) {
      setAccessMessage(changePasswordMessage, "La nueva contraseña debe ser diferente de la actual.", "error");
      return;
    }

    setButtonLoading(submitButton, true);

    try {
      const response = await jsonpRequest("changePassword", {
            username,
            currentPassword,
            newPassword:
              nextPassword
          }
        );

      if (!response?.success) {
        throw new Error(response?.message || "No se ha podido cambiar la contraseña.");
      }

      changePasswordForm.reset();
      clearPasswordMatchMessage(changePasswordMatch);
      showAccessForm("login");
      document.getElementById("loginUsername").value = username;
      setAccessMessage(loginMessage, "Contraseña actualizada. Ya puedes iniciar sesión.", "success");

    } catch (error) {
      setAccessMessage(changePasswordMessage, error.message || "No se ha podido cambiar la contraseña.", "error");

    } finally {
      setButtonLoading(submitButton, false);
    }
  }
);

function updateLoggedUserIndicator() {
  const userInfo = document.getElementById("userInfo");
  const loggedUserName = document.getElementById("loggedUserName");

  if (!userInfo || !loggedUserName) {
    return;
  }

  const userName = currentSession?.user?.commercial || currentSession?.user?.username || "";

  if (!userName) {
    userInfo.classList.add("hidden");
    loggedUserName.textContent = "";
    return;
  }

  loggedUserName.textContent = userName;
  userInfo.classList.remove("hidden");
}

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyVZBXBRiJ2TnMmoYyTf-GGc8q6bYGfakYph1oXveLO7met5nLxDLbSgGVHKI70_Ts/exec";

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

function showCalculator() {
    calculatorSection.classList.remove("hidden");
    historySection.classList.add("hidden");

    showCalculatorButton.classList.add("active");
    showHistoryButton.classList.remove("active");
}

async function showHistory() {
    calculatorSection.classList.add("hidden");
    historySection.classList.remove("hidden");

    showCalculatorButton.classList.remove("active");
    showHistoryButton.classList.add("active");

    await loadBudgetHistory();
}

showCalculatorButton.addEventListener("click",showCalculator);
showHistoryButton.addEventListener("click",showHistory);
refreshHistoryButton.addEventListener("click",loadBudgetHistory);

function jsonpRequest(action, parameters = {}) {
    return new Promise((resolve, reject) => {
        const callbackName =
            "jsonpCallback_" +
            Date.now() +
            "_" +
            Math.floor(Math.random() * 1000000);

        const script = document.createElement("script");

        const timeoutId = setTimeout(() => {
            script.remove();
            delete window[callbackName];

            reject(
                new Error(
                    "Apps Script no ha respondido en 15 segundos."
                )
            );
        }, 30000);

        window[callbackName] = function (result) {
            clearTimeout(timeoutId);

            script.remove();
            delete window[callbackName];

            resolve(result);
        };

        script.onerror = function () {
            clearTimeout(timeoutId);

            console.error(
                "URL JSONP que ha fallado:",
                script.src
            );

            script.remove();
            delete window[callbackName];

            reject(
                new Error(
                    "No se ha podido cargar la respuesta de Apps Script."
                )
            );
        };

        const query = new URLSearchParams({
            action: action,
            ...parameters,
            callback: callbackName,
            _: Date.now()
        });

        script.src =
            APPS_SCRIPT_URL +
            "?" +
            query.toString();

        document.body.appendChild(script);
    });
}

async function loadApplicationCatalog() {
  if (!currentSession?.token) {
    throw new Error("Debes iniciar sesión para cargar el catálogo.");
  }

  const response = await jsonpRequest("getApplicationCatalog", { token: currentSession.token });

  if (!response?.success || !response?.apps || !response?.plans || !response?.extras) {
    throw new Error(response?.message || "No se pudo cargar el catálogo.");
  }

  apps = response.apps;
  erpPlans = response.plans;
  erpExtras = response.extras;

  console.log(
    response.fromCache
      ? "Catálogo cargado desde caché."
      : "Catálogo cargado desde Google Sheets."
  );
}

function getBudgetValue(budget, field) {
    const value = budget[field];

    return value === null ||
        value === undefined ||
        value === ""
            ? "—"
            : String(value);
}

function setDetailText(id, value) {
    const element = document.getElementById(id);

    if (!element) {
        return;
    }

    element.textContent =
        value === null ||
        value === undefined ||
        value === ""
            ? "—"
            : String(value);
}

function openBudgetDetail(budget) {
    currentLoadedBudget = budget;
    ensureBudgetDetailActions();
    updateBudgetDetailActions(budget);
    setDetailText(
        "detailBudgetId",
        getBudgetValue(budget, "ID Presupuesto")
    );

    setDetailText(
        "detailBudgetDate",
        formatBudgetDate(budget["Fecha"])
    );

    setDetailText(
        "detailClient",
        getBudgetValue(budget, "Cliente")
    );

    setDetailText(
        "detailCif",
        getBudgetValue(budget, "CIF")
    );

    setDetailText(
        "detailAddress",
        getBudgetValue(budget, "Dirección")
    );

    const locationParts = [
        budget["C. P."],
        budget["Población"],
        budget["Provincia"]
    ].filter(Boolean);

    setDetailText(
        "detailLocation",
        locationParts.length
            ? locationParts.join(" · ")
            : "—"
    );

    setDetailText(
        "detailContact",
        getBudgetValue(budget, "Contacto")
    );

    setDetailText(
        "detailEmail",
        getBudgetValue(budget, "Email")
    );

    setDetailText(
        "detailPhone",
        getBudgetValue(budget, "Teléfono")
    );

    setDetailText(
        "detailCommercial",
        getBudgetValue(budget, "Comercial")
    );

    setDetailText(
        "detailSolution",
        getBudgetValue(budget, "Solución")
    );

    setDetailText(
        "detailPlan",
        getBudgetValue(budget, "Plan")
    );

    setDetailText(
        "detailBasePrice",
        getBudgetValue(budget, "Precio Base")
    );

    setDetailText(
        "detailDiscount",
        getBudgetValue(budget, "DescuentoBase")
    );

    setDetailText(
        "detailMonthlyTotal",
        getBudgetValue(budget, "Total Mensual")
    );

    setDetailText(
        "detailAnnualTotal",
        getBudgetValue(budget, "Total Anual")
    );

    const hasExtras = ["sí", "si", "true", "1"].includes(
        String(budget["Tiene Extras"] || "")
            .trim()
            .toLocaleLowerCase("es")
    );

    setDetailText(
        "detailExtras",
        hasExtras
            ? getBudgetValue(budget, "Extras Añadidos")
            : "Sin extras"
    );

    setDetailText(
        "detailNotes",
        budget["Notas Adicionales"] ||
        "Sin notas adicionales."
    );

    const statusElement =
        document.getElementById("detailBudgetStatus");

    statusElement.textContent =
        budget["Estado"] || "Generado";

    statusElement.className =
        "budget-detail-status history-status-select";

    statusElement.value =
        budget["Estado"] || "Generado";

    updateStatusStyle(statusElement);

    budgetDetailModal.classList.remove("hidden");
}


function ensureBudgetDetailActions() {
    if (document.getElementById("budgetRecoveryActions")) {
        return;
    }

    const modalPanel = budgetDetailModal?.querySelector(".budget-detail-modal");

    if (!modalPanel) {
        return;
    }

    const actions = document.createElement("div");
    actions.id = "budgetRecoveryActions";
    actions.style.display = "flex";
    actions.style.flexWrap = "wrap";
    actions.style.gap = "0.75rem";
    actions.style.justifyContent = "flex-end";
    actions.style.marginTop = "1rem";

    actions.innerHTML = `
        <button type="button" id="openSavedBudgetButton">📂 Abrir presupuesto</button>
        <button type="button" id="duplicateSavedBudgetButton">📄 Duplicar</button>
        <button type="button" id="deleteSavedBudgetButton">🗑 Eliminar</button>
    `;

    modalPanel.appendChild(actions);

    document
        .getElementById("openSavedBudgetButton")
        ?.addEventListener("click", () => restoreSelectedBudget("open"));

    document
        .getElementById("duplicateSavedBudgetButton")
        ?.addEventListener("click", () => restoreSelectedBudget("duplicate"));

    document
        .getElementById("deleteSavedBudgetButton")
        ?.addEventListener("click", deleteSelectedBudget);
}

function updateBudgetDetailActions(budget) {
    const hasSnapshot = Boolean(getBudgetSnapshot(budget, false));
    const openButton = document.getElementById("openSavedBudgetButton");
    const duplicateButton = document.getElementById("duplicateSavedBudgetButton");

    if (openButton) {
        openButton.disabled = !hasSnapshot;
        openButton.title = hasSnapshot
            ? "Carga el presupuesto en la calculadora"
            : "Este presupuesto antiguo no contiene datos recuperables";
    }

    if (duplicateButton) {
        duplicateButton.disabled = !hasSnapshot;
        duplicateButton.title = hasSnapshot
            ? "Carga una copia para crear un presupuesto nuevo"
            : "Este presupuesto antiguo no contiene datos recuperables";
    }
}

function getBudgetSnapshot(budget, throwOnError = true) {
    const rawData = budget?.["Datos Presupuesto"];

    if (!rawData) {
        if (throwOnError) {
            throw new Error(
                "Este presupuesto es anterior al historial recuperable y no contiene los datos necesarios para abrirlo."
            );
        }

        return null;
    }

    try {
        const snapshot = typeof rawData === "string"
            ? JSON.parse(rawData)
            : rawData;

        if (!snapshot || typeof snapshot !== "object") {
            throw new Error("El contenido guardado no es válido.");
        }

        if (!snapshot.calculatorType) {
            throw new Error("No se ha podido identificar el tipo de calculadora.");
        }

        return snapshot;
    } catch (error) {
        if (throwOnError) {
            throw new Error(
                "No se han podido interpretar los datos completos del presupuesto: " +
                error.message
            );
        }

        return null;
    }
}

function activateBudgetTab(calculatorType) {
    const button = Array.from(document.querySelectorAll(".tab-button"))
        .find(currentButton => currentButton.dataset.tab === calculatorType);

    if (!button) {
        throw new Error(`No existe la pestaña de calculadora "${calculatorType}".`);
    }

    button.click();
}

function restoreClientFormData(customerData = {}) {
    const fields = {
        clientName: "clienteNombre",
        clientTaxId: "clienteCif",
        clientAddress: "clienteDireccion",
        clientPostalCode: "clienteCodigoPostal",
        clientCity: "clientePoblacion",
        clientProvince: "provincia",
        clientEmail: "clienteEmail",
        clientPhone: "clienteTelefono",
        clientRepresentative: "clienteContacto",
        clientRepresentativeTaxId: "nifRepres"
    };

    Object.entries(fields).forEach(([elementId, propertyName]) => {
        const element = document.getElementById(elementId);

        if (element) {
            element.value = customerData[propertyName] || "";
        }
    });
}

function restoreMicrodataSnapshot(snapshot) {
    if (!Array.isArray(snapshot.items)) {
        throw new Error("El presupuesto guardado no contiene líneas de Microdata.");
    }

    BudgetManager.replaceMicrodataItems(snapshot.items);

    if (budgetNotesMicrodata) {
        budgetNotesMicrodata.value = snapshot.editorState?.notes || "";
    }
}

function restoreErpExtrasState(savedExtras = []) {
    const states = Array.isArray(savedExtras) ? savedExtras : [];

    document.querySelectorAll("#erpExtrasList .erp-extra-row").forEach(row => {
        const state = states.find(item =>
            item.extraKey === row.dataset.extraKey ||
            item.nombre === row.querySelector(".erp-extra-description strong")?.textContent?.trim()
        );

        if (!state) {
            return;
        }

        const checkbox = row.querySelector(".erp-extra-checkbox");
        const tierSelect = row.querySelector(".erp-extra-tier-select");
        const discountType = row.querySelector(".erp-extra-discount-type");
        const discountValue = row.querySelector(".erp-extra-discount-value");

        if (checkbox) {
            checkbox.checked = state.checked !== false;
            checkbox.dispatchEvent(new Event("change", { bubbles: true }));
        }

        if (tierSelect && state.tierValue !== undefined && state.tierValue !== "") {
            tierSelect.value = String(state.tierValue);
        }

        if (discountType) {
            discountType.value = state.discountType || "none";
        }

        if (discountValue) {
            discountValue.value = Number(state.discountValue) || 0;
        }
    });
}

function restoreErpSnapshot(snapshot) {
    const state = snapshot.erpState || {};

    if (!erpPlans[state.familyKey]?.plans?.[state.planKey]) {
        throw new Error(
            "El plan ERP guardado ya no existe en el catálogo actual."
        );
    }

    els.erpFamilySelect.value = state.familyKey;
    refreshErpPlans();
    els.erpPlanSelect.value = state.planKey;
    renderErpPlan();

    els.erpBaseDiscountType.value = state.baseDiscountType || "none";
    els.erpBaseDiscountValue.value = Number(state.baseDiscountValue) || 0;
    els.erpBaseDiscountValue.disabled = els.erpBaseDiscountType.value === "none";
    els.erpExtraUsersInput.value = Number(state.extraUsers) || 0;

    restoreErpExtrasState(state.extras);

    if (budgetNotes) {
        budgetNotes.value = state.notes || "";
    }

    calculateErpTotal();
}

function restoreBudgetSnapshot(snapshot) {
    activateBudgetTab(snapshot.calculatorType);

    if (snapshot.calculatorType === "microdata") {
        restoreMicrodataSnapshot(snapshot);
    } else if (snapshot.calculatorType === "erp") {
        restoreErpSnapshot(snapshot);
    } else {
        throw new Error(
            `El tipo de calculadora "${snapshot.calculatorType}" no está soportado.`
        );
    }

    restoreClientFormData(snapshot.customerData || {});
}

async function restoreSelectedBudget(mode) {
    try {
        if (!currentLoadedBudget) {
            throw new Error("No hay ningún presupuesto seleccionado.");
        }

        const snapshot = getBudgetSnapshot(currentLoadedBudget);
        restoreBudgetSnapshot(snapshot);

        currentLoadedBudget = {
            ...currentLoadedBudget,
            recoveryMode: mode,
            sourceBudgetId: currentLoadedBudget["ID Presupuesto"] || ""
        };

        closeBudgetDetail();
        showCalculator();

        const actionText = mode === "duplicate"
            ? "Copia cargada. Al generar se guardará con un número nuevo."
            : "Presupuesto cargado. Los cambios se guardarán como una nueva versión al generar.";

        alert(actionText);
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

async function deleteSelectedBudget() {
    if (!currentLoadedBudget) {
        return;
    }

    const budgetId = currentLoadedBudget["ID Presupuesto"];

    if (!budgetId) {
        alert("El presupuesto seleccionado no tiene identificador.");
        return;
    }

    const confirmed = window.confirm(
        `¿Eliminar definitivamente el presupuesto ${budgetId}? Esta acción no se puede deshacer.`
    );

    if (!confirmed) {
        return;
    }

    const deleteButton = document.getElementById("deleteSavedBudgetButton");

    if (deleteButton) {
        deleteButton.disabled = true;
    }

    try {
        const response = await jsonpRequest("delete", {
            token: currentSession.token,
            id: budgetId
        });

        if (!response?.success) {
            throw new Error(response?.message || "No se ha podido eliminar el presupuesto.");
        }

        budgetHistory = budgetHistory.filter(
            budget => String(budget["ID Presupuesto"]) !== String(budgetId)
        );

        closeBudgetDetail();
        currentLoadedBudget = null;
        applyHistoryFilters();
        setHistoryMessage(`Presupuesto ${budgetId} eliminado.`, "success");
    } catch (error) {
        console.error(error);
        alert(error.message);
    } finally {
        if (deleteButton) {
            deleteButton.disabled = false;
        }
    }
}

function postBudgetAction(action, parameters = {}) {
    if (!currentSession?.token) {
        return Promise.reject(new Error("Debes iniciar sesión."));
    }

    return fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: {
            "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify({
            action,
            token: currentSession.token,
            ...parameters
        })
    }).then(async response => {
        const text = await response.text();

        try {
            return JSON.parse(text);
        } catch (error) {
            throw new Error("Apps Script no ha devuelto una respuesta válida.");
        }
    });
}

function closeBudgetDetail() {
    budgetDetailModal.classList.add("hidden");
}

async function loadBudgetHistory() {
    if (!currentSession?.token) {
        showLogin();
        throw new Error("Debes iniciar sesión.");
    }
    setHistoryMessage("Cargando presupuestos...", "loading");
    try {
        const result = await jsonpRequest("list", {token: currentSession.token});
        if (result.success && Array.isArray(result.presupuestos)) {
            budgetHistory = result.presupuestos;
            applyHistoryFilters();
            return;
        }
        throw new Error(result.message || "Apps Script no ha devuelto los presupuestos correctamente.");

    } catch (error) {
        budgetHistory = [];
        renderBudgetHistory([]);

        setHistoryMessage("No se ha podido cargar el historial: " + error.message, "error");
    }
}

function renderBudgetHistory(budgets) {
    historyTableBody.innerHTML = "";

    if (budgets.length === 0) {
        setHistoryMessage(
            "No se han encontrado presupuestos.",
            "empty"
        );

        return;
    }

    const fragment = document.createDocumentFragment();

    budgets.forEach(budget => {
        const row = document.createElement("tr");
        row.addEventListener("click", () => {
            openBudgetDetail(budget);
        });
        row.appendChild(createTableCell(budget["ID Presupuesto"]));
        row.appendChild(createTableCell(formatBudgetDate(budget["Fecha"])));
        row.appendChild(createTableCell(budget["Cliente"]));
        row.appendChild(createTableCell(budget["Solución"]));
        row.appendChild(createTableCell(budget["Plan"]));
        row.appendChild(createTableCell(formatCurrencyValue(budget["Total Mensual"])));
        row.appendChild(createStatusCell(budget));
        fragment.appendChild(row);
    });

    historyTableBody.appendChild(fragment);

    setHistoryMessage(
        `${budgets.length} presupuesto${budgets.length === 1 ? "" : "s"}`,
        "success"
    );
}

function updateStatusStyle(select) {

    select.classList.remove(
        "status-generado",
        "status-pendiente",
        "status-aceptado",
        "status-rechazado"
    );

    switch (select.value) {

        case "Generado":
            select.classList.add("status-generado");
            break;

        case "Pendiente":
            select.classList.add("status-pendiente");
            break;

        case "Aceptado":
            select.classList.add("status-aceptado");
            break;

        case "Rechazado":
            select.classList.add("status-rechazado");
            break;
        case "Enviado":
            select.classList.add("status-enviado");
            break;

        case "Perdido":
            select.classList.add("status-perdido");
            break;

        case "Cancelado":
            select.classList.add("status-cancelado");
            break;
            }
}

function createTableCell(value) {
    const cell = document.createElement("td");

    cell.textContent =
        value === null ||
        value === undefined ||
        value === ""
            ? "—"
            : String(value);

    return cell;
}

function formatBudgetDate(value) {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "—";
    }

    let date;

    // Fecha española: dd/mm/aaaa
    if (
        typeof value === "string" &&
        /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value.trim())
    ) {
        const [day, month, year] =
            value.trim().split("/").map(Number);

        date = new Date(
            year,
            month - 1,
            day
        );
    } else {
        // ISO, timestamp u otros formatos válidos
        date = new Date(value);
    }

    if (Number.isNaN(date.getTime())) {
        console.warn(
            "Fecha no reconocida:",
            value
        );

        return String(value);
    }

    return new Intl.DateTimeFormat(
        "es-ES",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    ).format(date);
}

function formatCurrencyValue(value) {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "—";
    }

    if (typeof value === "number") {
        return new Intl.NumberFormat(
            "es-ES",
            {
                style: "currency",
                currency: "EUR"
            }
        ).format(value);
    }

    return String(value);
}

function applyHistoryFilters() {
    const searchTerm = historySearchInput.value
        .trim()
        .toLocaleLowerCase("es");

    const selectedStatus =
        historyStatusFilter.value;

    const filteredBudgets =
        budgetHistory.filter(budget => {
            const searchableValues = [
                budget["ID Presupuesto"],
                budget["Cliente"],
                budget["CIF"],
                budget["Solución"],
                budget["Plan"],
                budget["Email"],
                budget["Contacto"],
                budget["Comercial"]
            ];

            const matchesSearch =
                !searchTerm ||
                searchableValues.some(value =>
                    String(value || "")
                        .toLocaleLowerCase("es")
                        .includes(searchTerm)
                );

            const matchesStatus =
                !selectedStatus ||
                String(budget["Estado"] || "") ===
                    selectedStatus;

            return matchesSearch && matchesStatus;
        });

    renderBudgetHistory(filteredBudgets);
}

historySearchInput.addEventListener(
    "input",
    applyHistoryFilters
);

historyStatusFilter.addEventListener(
    "change",
    applyHistoryFilters
);

closeBudgetDetailModal.addEventListener(
    "click",
    closeBudgetDetail
);

budgetDetailModal.addEventListener(
    "click",
    event => {
        if (event.target === budgetDetailModal) {
            closeBudgetDetail();
        }
    }
);

document.addEventListener("keydown", event => {
    if (
        event.key === "Escape" &&
        !budgetDetailModal.classList.contains("hidden")
    ) {
        closeBudgetDetail();
    }
});

function createStatusCell(budget) {
    const cell = document.createElement("td");
    const select = document.createElement("select");

    const statuses = [
        "Generado",
        "Enviado",
        "Pendiente",
        "Aceptado",
        "Perdido",
        "Cancelado"
    ];

    const currentStatus =
        budget["Estado"] || "Generado";

    statuses.forEach(status => {
        const option =
            document.createElement("option");

        option.value = status;
        option.textContent = status;
        option.selected =
            status === currentStatus;

        select.appendChild(option);
    });

    select.className = "history-status-select";
    updateStatusStyle(select);
    select.addEventListener("click", event => {
        event.stopPropagation();
    });

    select.addEventListener(
        "change",
        async event => {
            const newStatus = event.target.value;
            const previousStatus =
                budget["Estado"] || "Generado";

            updateStatusStyle(select);

            select.disabled = true;

            try {
                await updateBudgetStatus(
                    budget["ID Presupuesto"],
                    newStatus
                );

                budget["Estado"] = newStatus;

                setHistoryMessage(
                    `Estado del presupuesto ${budget["ID Presupuesto"]} actualizado.`,
                    "success"
                );

            } catch (error) {
                select.value = previousStatus;

                updateStatusStyle(select);

                setHistoryMessage(
                    `No se ha podido actualizar el estado: ${error.message}`,
                    "error"
                );
            } finally {
                select.disabled = false;
            }
        }
    );

    cell.appendChild(select);

    return cell;
}

async function updateBudgetStatus(id, estado) {
    if (!currentSession?.token) {
        throw new Error("Debes iniciar sesión.");
    }
    if (!id) {
        throw new Error("El presupuesto no tiene ID.");
    }
    await fetch(APPS_SCRIPT_URL,{
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type":
                    "text/plain;charset=utf-8"
            },
            body: JSON.stringify({
                action: "updateStatus",
                token: currentSession.token,
                id,
                estado
            })
        }
    );
}

function setHistoryMessage(
    message,
    type = ""
) {
    historyMessage.textContent = message;
    historyMessage.className =
        `history-message ${type}`;
}

addModl.addEventListener("change", () => {
  addModulesExtraApp();
  calculate();
});

els.selectMdlGest.addEventListener ("change", () => {
  calculate();
});

usersExtra.addEventListener("change", () => {
  if (usersExtra.checked) {
    uExtra.classList.remove("hidden");
    uExtra.value = 0;
    calculate();
  } else {
    uExtra.classList.add("hidden");
    uExtra.value = 0;
    calculate();
  }
});

uExtra.addEventListener("change", () => {
  calculate();
});

els.gestLaboral.addEventListener("click", () => {
  if (!els.gestLaboral.classList.contains ("active")) {
    els.totalLaboral.textContent = euros(35);
    els.porEmp.value = 0;
    els.porTbj.value = 0;
   } 
});

els.gestFiscal.addEventListener("click", () => {
  if (!els.gestFiscal.classList.contains ("active")) {
    els.totalFiscal.textContent = euros(0)
    els.empMdl.value = 0;
    els.empDrct.value = 0;
    els.empScds.value = 0;
   } 
  });

function addModulesExtraApp() {
  switch (els.appSelect.value) {
    case "msgest":
      if (addModl.checked) {
        moduleGestExtra.classList.remove("hidden");
        cargarSelectModulos();
      } else {
        moduleGestExtra.classList.add("hidden");
      }
      break;
    case "msnotifica":
      if (addModl.checked) {
        usersCFExtra.classList.remove("hidden");
        usersCFExtra.classList.add("doble");
      } else {
          usersCFExtra.classList.add("hidden");
          usersCFExtra.classList.remove("doble");
      }
      break;
    default:
      extraModule.classList.add("hidden");
      extra.classList.add("hidden");
      break;
  }
}

function updateExtraFields() {
  cargarSelectBuzones();
  cambiarBuzonesMsNotifica();
  els.trfVrb.classList.contains("hidden") ? null : els.trfVrb.classList.add("hidden");
  els.gestLaboral.classList.contains("hidden") ? null : els.gestLaboral.classList.add("hidden");
  els.gestFiscal.classList.contains("hidden") ? null : els.gestFiscal.classList.add("hidden");
  switch (els.appSelect.value) {
    case "msnotifica":
      module.innerHTML = "Certifácil";
      moduleGestExtra.classList.add("hidden");
      extra.classList.remove("hidden");
      extraUsersLabel.classList.remove("hidden");
      break;

    case "msgest":
      module.innerHTML = "Módulos";
      extraUsersLabel.classList.add("hidden");
      extra.classList.remove("hidden");
    break;
    case "efirma":
      extraUsersLabel.classList.remove("hidden");
      break;
    case "msnomina":
      els.trfVrb.classList.remove("hidden");
      els.gestLaboral.classList.remove("hidden");
    break;
    case "paquete_fiscal":
      els.trfVrb.classList.remove("hidden");
      els.gestFiscal.classList.remove("hidden");
    break;
    default:
      extraUsersLabel.classList.add("hidden");
      extra.classList.add("hidden");
      addModl.checked = false;
      moduleGestExtra.classList.add("hidden");
      usersCFExtra.classList.add("hidden");
      break;
  }
}

const infoButton = document.getElementById("infoButton");
const infoModal = document.getElementById("infoModal");
const closeInfoModal = document.getElementById("closeInfoModal");
const infoAppButtons = document.querySelectorAll(".info-app-btn");
const infoContents = document.querySelectorAll(".info-content");

infoButton.addEventListener("click", () => {
  infoModal.classList.remove("hidden");
});

closeInfoModal.addEventListener("click", () => {
  infoModal.classList.add("hidden");
});

infoModal.addEventListener("click", (event) => {
  if (event.target === infoModal) {
    infoModal.classList.add("hidden");
  }
});

infoAppButtons.forEach(button => {
  button.addEventListener("click", () => {
    const selectedInfo = button.dataset.info;

    infoAppButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    infoContents.forEach(content => {
      content.classList.remove("active");
    });

    document.getElementById(`info-${selectedInfo}`).classList.add("active");
  });
});

function euros(value) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(value || 0);
}

function formatNumber(value) {
  return Number.isFinite(value) ? value.toLocaleString("es-ES") : "ilimitada";
}

function selectedBilling(app) {
  return (app.billingOptions || [])[els.billingSelect.selectedIndex] || (app.billingOptions || [])[0];
}

function valueToMonthlyAnnual(value = 0, period = "annual", quantity = 1) {
  const safeValue = Number(value) || 0;
  const safeQuantity = Math.max(1, Number(quantity) || 1);
  const total = safeValue * safeQuantity;

  switch (period) {
    case "monthly":
      return { monthly: total, annual: total * 12, main: total};
    case "annual":
      return { monthly: total / 12, annual: total, main: total};
    case "unitMonthly":
      return { monthly: total, annual: total * 12, main: total};
    case "unit":
      return { monthly: 0, annual: total, main: total};
    default:
      return { monthly: 0, annual: total, main: total};
  }
}

function getNumericValue(value) {
  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : 0;
}

function getMicrodataModeCode(billingOption) {
  const value = billingOption?.value || "";

  if (value === "cloud") {
    return "C";
  }

  if (value === "saas" || billingOption?.period === "monthly" || billingOption?.period === "unitMonthly") {
    return "S";
  }

  return "O";
}

function getMicrodataPeriodCode(billingOption) {
  const period = billingOption?.period || "";

  if (period === "monthly" || period === "unitMonthly") {
    return "M";
  }

  return "A";
}

function buildMicrodataEconomicAmounts({ source, billingOption, quantity = 1}) {
  const field = billingOption?.field || "";
  const period = billingOption?.period || "annual";
  const safeQuantity = Math.max(1, Number(quantity) || 1);
  const price = getNumericValue(source?.price);
  const maintenance = getNumericValue(source?.maintenance);
  const selectedValue = getNumericValue(source?.[field]);
  let licenseAmount = 0;
  let maintenanceAmount = 0;
  let monthlyFeeAmount = 0;
  /*
   * COMPRA / LICENCIA
   *
   * Solo se utiliza price como licencia.
   * El mantenimiento se guarda aparte.
   */
  if (field === "price") {
    licenseAmount = price * safeQuantity;
    maintenanceAmount = maintenance * safeQuantity;
  }
  /*
   * MANTENIMIENTO
   *
   * El valor seleccionado es exclusivamente
   * mantenimiento. No se coloca como licencia.
   */
  else if (field === "maintenance" ||field === "maintenanceMsConta") {
    maintenanceAmount = selectedValue * safeQuantity;
  }
  /*
   * SaaS o cuotas mensuales
   */
  else if (period === "monthly" || period === "unitMonthly" || field === "saas" || field === "saasMsConta" || field === "monthly") {
    monthlyFeeAmount = selectedValue * safeQuantity;
  }
  /*
   * Importes anuales distintos de licencia,
   * por ejemplo eFirma o pago por uso.
   */
  else if (period === "annual") {
    monthlyFeeAmount = selectedValue * safeQuantity;
  }
  /*
   * Importe unitario por volumen.
   */
  else if (period === "unit") {
    maintenanceAmount = selectedValue * safeQuantity;
  }
  return {
    licenseAmount,
    maintenanceAmount,
    monthlyFeeAmount
  };
}

function createMicrodataItemId() {
  return (
    "md-" +
    Date.now() +
    "-" +
    Math.random()
      .toString(36)
      .slice(2, 8)
  );
}

function getSelectedMicrodataSource(app, planName, quantity) {
  if (!app) {
    return null;
  }

  if (Array.isArray(app.items)) {
    return (
      app.items.find(
        item => item.plan === planName
      ) || null
    );
  }

  if (Array.isArray(app.tiers)) {
    if (app.mode === "capacityPlan" || app.mode === "modules") {
      return (
        app.tiers.find(
          tier => tier.plan === planName
        ) || null
      );
    }

    if (app.mode === "rangeBand") {
      return (
        app.tiers.find(
          tier =>
            quantity >= tier.min &&
            quantity <= tier.max
        ) || null
      );
    }

    const tierKey = app.tierKey;

    if (tierKey) {
      return (
        app.tiers.find(
          tier =>
            Number(quantity) <=
            Number(tier[tierKey])
        ) ||
        app.tiers[app.tiers.length - 1] ||
        null
      );
    }
  }

  return null;
}

function applyMicrodataDiscount(original, type = "none", value = 0) {
  const safeOriginal = Math.max(0, Number(original) || 0);
  const safeValue = Math.max(0, Number(value) || 0);
  if (type === "percentage") return Math.max(0, safeOriginal * (1 - Math.min(safeValue, 100) / 100));
  if (type === "fixed") return Math.max(0, safeOriginal - safeValue);
  return safeOriginal;
}

function recalculateMicrodataItem(item) {
  item.licenseFinal = applyMicrodataDiscount(item.licenseOriginal, item.licenseDiscountType, item.licenseDiscountValue);
  item.maintenanceFinal = applyMicrodataDiscount(item.maintenanceOriginal, item.maintenanceDiscountType, item.maintenanceDiscountValue);
  item.monthlyFeeFinal = applyMicrodataDiscount(item.monthlyFeeOriginal, item.monthlyFeeDiscountType, item.monthlyFeeDiscountValue);
  return item;
}

function getMicrodataSelectionCalculation() {
  const appKey = els.appSelect.value;
  const app = apps[appKey];
  if (!app) throw new Error("No se ha encontrado la aplicación seleccionada.");

  const plan = els.planSelect.value || app.plans?.[0] || "";
  const billing = selectedBilling(app);
  if (!billing) throw new Error("No se ha encontrado la modalidad seleccionada.");

  const quantity = Math.max(1, Number(els.quantityInput.value) || 1);
  let license = 0;
  let maintenance = 0;
  let fee = 0;
  let period = getMicrodataPeriodCode(billing);
  let notice = "";
  let detail = "";

  if (app.mode === "workersNumber") {
    const tier = app.tiers.find(t => quantity <= t[app.tierKey]) || app.tiers[app.tiers.length - 1];
    const amount = calcularTrabajadores(tier, quantity, plan);
    const isMonthlyPlan = /Mensual/i.test(plan);
    fee = amount;
    period = isMonthlyPlan ? "M" : "A";
    detail = `${plan} · ${quantity.toLocaleString("es-ES")} trabajadores`;
    notice = `Se ha usado el tramo de ${quantity > 100 ? quantity : formatNumber(tier[app.tierKey])} ${app.tierLabel}.`;
  } else if (app.mode === "capacityPlan") {
    const matching = app.tiers.filter(t => t.plan === plan);
    const tier = matching.find(t => quantity <= t.docsYear) || matching[matching.length - 1];
    if (!tier) throw new Error("No existe una tarifa para el plan seleccionado.");
    const result = calcDocs(quantity, plan, billing.period, tier[billing.field], tier, tier.userExtra, Number(els.extraUsersInput?.value || 0));
    fee = billing.period === "monthly" ? result.monthly : result.annual;
    period = billing.period === "monthly" ? "M" : "A";
    detail = `${plan} · ${quantity.toLocaleString("es-ES")} documentos/año`;
    notice = `Capacidad seleccionada: ${tier.docsYear.toLocaleString("es-ES")} documentos/año.`;
  } else if (app.mode === "rangeBand") {
    const tier = app.tiers.find(t => quantity >= t.min && quantity <= t.max) || app.tiers[app.tiers.length - 1];
    fee = (Number(tier[billing.field]) || 0) * (billing.period === "unitMonthly" ? quantity : 1);
    period = billing.period === "unitMonthly" ? "M" : "A";
    detail = `${plan} · ${quantity.toLocaleString("es-ES")} trabajadores`;
    notice = `Se ha usado el tramo ${formatNumber(tier.min)}-${formatNumber(tier.max)} trabajadores.`;
  } else if (app.mode === "closestBand") {
    const tier = app.tiers.find(t => quantity <= t[app.tierKey]) || app.tiers[app.tiers.length - 1];
    const selectedValue = Number(tier[billing.field] ?? tier[plan]) || 0;
    if (billing.field === "maintenance" || billing.period === "unit") maintenance = selectedValue * (billing.period === "unit" ? quantity : 1);
    else fee = selectedValue;
    period = "A";
    detail = `${plan} · ${quantity.toLocaleString("es-ES")} ${app.tierLabel || "unidades"}`;
    notice = `Se ha usado el tramo de ${tier.label || formatNumber(tier[app.tierKey])} ${app.tierLabel}.`;
  } else if (app.mode === "catalog" || app.mode === "modules") {
    const source = (app.items || app.tiers || []).find(i => i.plan === plan) || (app.items || app.tiers || [])[0];
    if (!source) throw new Error("No se ha encontrado la tarifa seleccionada.");
    const selectedValue = Number(source[billing.field]);
    if (!Number.isFinite(selectedValue)) throw new Error("Esta modalidad no está disponible para la tarifa seleccionada.");
    if (billing.field === "price") {
      license = selectedValue * quantity;
      maintenance = (Number(source.maintenance) || 0) * quantity;
    } else if (billing.field === "maintenance" || billing.field === "maintenanceMsConta") {
      maintenance = selectedValue * quantity;
    } else {
      fee = selectedValue * quantity;
      period = billing.period === "monthly" || billing.period === "unitMonthly" ? "M" : "A";
    }
    detail = `${plan}${quantity > 1 ? ` · ${quantity.toLocaleString("es-ES")} unidades` : ""}`;
    notice = `${billing.label} · ${plan}.`;
  } else if (app.mode === "msnotifica") {
    const tier = app.tiers.find(t => quantity <= t.mailboxes) || app.tiers[app.tiers.length - 1];
    const mailboxExtra = calcLicenciasExtra(quantity, tier.mailboxes, tier.mailboxExtra);
    const extraUsers = Math.max(0, Number(els.extraUsersInput?.value) || 0);
    const extraUsersAnnual = extraUsers * (Number(tier.userExtra) || 0);
    if (billing.value === "compra") {
      license = (Number(tier.price) || 0) + mailboxExtra + extraUsersAnnual;
      maintenance = Number(tier.maintenance) || 0;
      period = "A";
    } else {
      fee = (Number(tier.saas) || 0) + extraUsersAnnual / 12 + mailboxExtra;
      period = "M";
    }
    detail = `${quantity.toLocaleString("es-ES")} buzones${extraUsers ? ` · ${extraUsers} usuarios extra` : ""}`;
    notice = `Se ha usado el tramo de ${tier.mailboxes} buzones.`;
  } else if (app.mode === "msgest") {
    const tier = app.tiers.find(t => quantity <= t[app.tierKey]) || app.tiers[app.tiers.length - 1];
    const selectedValue = Number(tier[billing.field]) || 0;
    if (billing.field === "price") {
      license = selectedValue;
      maintenance = Number(tier.maintenance) || 0;
    } else if (billing.field === "maintenanceMsConta") {
      maintenance = selectedValue;
    } else {
      fee = selectedValue;
      period = "M";
    }
    detail = `${quantity.toLocaleString("es-ES")} licencias`;
    notice = `Se ha usado el tramo de ${formatNumber(tier[app.tierKey])} ${app.tierLabel}.`;
  } else {
    throw new Error("El tipo de cálculo de esta aplicación todavía no está soportado.");
  }

  return {
    appKey, application: app.name, plan, billing: billing.value, billingLabel: billing.label,
    quantity, quantityLabel: app.quantityLabel || "Cantidad", mode: getMicrodataModeCode(billing), period,
    licenseOriginal: license, maintenanceOriginal: maintenance, monthlyFeeOriginal: fee,
    notice, detail,
    configuration: {
      extraUsers: Number(els.extraUsersInput?.value) || 0,
      addModule: Boolean(addModl?.checked),
      module: els.selectMdlGest?.value || "",
      certExtraUsers: Number(uExtra?.value) || 0
    }
  };
}

function buildCurrentMicrodataItem() {
  const calculation = currentMicrodataPreview || getMicrodataSelectionCalculation();
  const previous = microdataEditingItemId
    ? microdataBudgetItems.find(item => item.id === microdataEditingItemId)
    : null;

  return recalculateMicrodataItem({
    ...calculation,
    id: microdataEditingItemId || createMicrodataItemId(),
    itemType: "main",
    parentItemId: null,
    isBundledItem: false,
    licenseDiscountType: previous?.licenseDiscountType || "none",
    licenseDiscountValue: previous?.licenseDiscountValue || 0,
    maintenanceDiscountType: previous?.maintenanceDiscountType || "none",
    maintenanceDiscountValue: previous?.maintenanceDiscountValue || 0,
    monthlyFeeDiscountType: previous?.monthlyFeeDiscountType || "none",
    monthlyFeeDiscountValue: previous?.monthlyFeeDiscountValue || 0,
    licenseFinal: calculation.licenseOriginal,
    maintenanceFinal: calculation.maintenanceOriginal,
    monthlyFeeFinal: calculation.monthlyFeeOriginal
  });
}

function createMicrodataRelatedItem(mainItem, data) {
  const previous = microdataBudgetItems.find(
    item => item.id === data.id
  );

  return recalculateMicrodataItem({
    itemType: "addon",
    parentItemId: mainItem.id,
    isBundledItem: true,
    quantity: 1,
    quantityLabel: "Cantidad",
    mode: "O",
    period: "A",
    licenseOriginal: 0,
    maintenanceOriginal: 0,
    monthlyFeeOriginal: 0,
    licenseDiscountType: previous?.licenseDiscountType || "none",
    licenseDiscountValue: previous?.licenseDiscountValue || 0,
    maintenanceDiscountType: previous?.maintenanceDiscountType || "none",
    maintenanceDiscountValue: previous?.maintenanceDiscountValue || 0,
    monthlyFeeDiscountType: previous?.monthlyFeeDiscountType || "none",
    monthlyFeeDiscountValue: previous?.monthlyFeeDiscountValue || 0,
    ...data
  });
}

function buildMsNotificaRelatedItems(mainItem) {
  if (!mainItem.configuration?.addModule) {
    return [];
  }

  const certifacil = apps.certifacil?.items?.[0] || {};
  const certUsers = Math.max(
    0,
    Number(mainItem.configuration?.certExtraUsers) || 0
  );
  const activationPrice = Number(certifacil.price) || 0;
  const usersPrice = certUsers * (Number(certifacil.userExtra) || 0);
  const certifacilTotal = activationPrice + usersPrice;

  return [
    createMicrodataRelatedItem(mainItem, {
      id: `${mainItem.id}-certifacil`,
      appKey: "certifacil",
      application: "Certifácil",
      plan: "Activación licencia",
      billing: "price",
      billingLabel: "Compra",
      quantity: 1,
      quantityLabel: "Licencia",
      mode: "O",
      period: "A",
      detail:
        certUsers > 0
          ? `Activación · ${certUsers} ${
              certUsers === 1
                ? "usuario extra"
                : "usuarios extra"
            }`
          : "Activación de licencia",
      licenseOriginal: certifacilTotal,
      maintenanceOriginal: 0,
      monthlyFeeOriginal: 0
    })
  ];
}

function buildMsGestRelatedItems(mainItem) {
  if (!mainItem.configuration?.addModule) {
    return [];
  }

  const moduleName = mainItem.configuration?.module;
  const modulesApp = apps.msgest_modulos;
  const moduleTier = modulesApp?.tiers?.find(
    tier => tier.plan === moduleName
  );

  if (!moduleTier) {
    return [];
  }

  const licenses = Math.max(1, Number(mainItem.quantity) || 1);
  const isMonthly = mainItem.period === "M";

  const licenseOriginal = isMonthly
    ? 0
    : Number(moduleTier.price) || 0;

  const maintenanceOriginal = isMonthly
    ? 0
    : (Number(moduleTier.maintenance) || 0) * licenses;

  const monthlyFeeOriginal = isMonthly
    ? Number(moduleTier.saas) || 0
    : 0;

  return [
    createMicrodataRelatedItem(mainItem, {
      id: `${mainItem.id}-msgest-module-${String(moduleName)
        .toLocaleLowerCase("es")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")}`,
      appKey: "msgest_modulos",
      application: `Módulo ${moduleName}`,
      plan: moduleName,
      billing: isMonthly ? "saas" : "price",
      billingLabel: isMonthly ? "SaaS" : "Anual",
      quantity: licenses,
      quantityLabel: "Licencias",
      mode: isMonthly ? "S" : "O",
      period: isMonthly ? "M" : "A",
      detail: `${moduleName} · ${licenses.toLocaleString("es-ES")} ${
        licenses === 1 ? "licencia" : "licencias"
      }`,
      licenseOriginal,
      maintenanceOriginal,
      monthlyFeeOriginal
    })
  ];
}

function buildMicrodataRelatedItems(mainItem) {
  const relatedItemBuilders = {
    msnotifica: buildMsNotificaRelatedItems,
    msgest: buildMsGestRelatedItems
  };

  const builder = relatedItemBuilders[mainItem.appKey];

  return builder
    ? builder(mainItem)
    : [];
}

function replaceMicrodataItemGroup(mainItem, relatedItems = []) {
  const previousMainIndex = microdataBudgetItems.findIndex(
    item => item.id === mainItem.id
  );

  microdataBudgetItems = microdataBudgetItems.filter(
    item =>
      item.id !== mainItem.id &&
      item.parentItemId !== mainItem.id
  );

  const normalizedRelatedItems = relatedItems.map(item => ({
    ...item,
    itemType: "addon",
    parentItemId: mainItem.id,
    isBundledItem: true
  }));

  const group = [
    {
      ...mainItem,
      itemType: "main",
      parentItemId: null,
      isBundledItem: false
    },
    ...normalizedRelatedItems
  ];

  const insertionIndex = previousMainIndex >= 0
    ? Math.min(previousMainIndex, microdataBudgetItems.length)
    : microdataBudgetItems.length;

  microdataBudgetItems.splice(insertionIndex, 0, ...group);
}

function resetMicrodataEditMode() {
  microdataEditingItemId = null;
  if (els.addMicrodataItemButton) els.addMicrodataItemButton.innerHTML = "<span>＋</span>Añadir al presupuesto";
  els.cancelMicrodataEditButton?.classList.add("hidden");
}

function addCurrentMicrodataItem() {
  try {
    const mainItem = buildCurrentMicrodataItem();
    const relatedItems = buildMicrodataRelatedItems(mainItem);

    replaceMicrodataItemGroup(mainItem, relatedItems);

    microdataOpenItemId = mainItem.id;
    resetMicrodataEditMode();
    renderMicrodataBudget();

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

function init() {
  els.appSelect.innerHTML = "";

  Object.entries(apps)
    .filter(([, app]) => (app.type || "main") === "main")
    .sort(([, first], [, second]) =>
      Number(first.order || 0) - Number(second.order || 0)
    )
    .forEach(([key, app]) => {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = app.name;
      els.appSelect.appendChild(option);
    });

  els.appSelect.addEventListener("change", () => {
    refreshPlans();
    updateExtraFields();
    calculate();
  });
  els.planSelect.addEventListener("change", calculate);
  els.quantityInput.addEventListener("input", calculate);
  els.billingSelect.addEventListener("change", calculate);
  els.extraUsersInput.addEventListener("input", calculate);
  els.extraUsersInput.addEventListener("change", calculate);
  els.selectBuzones.addEventListener("change", cambiarBuzonesMsNotifica);
  els.porEmp.addEventListener("change", calcularTrfVariable);
  els.porTbj.addEventListener("change", calcularTrfVariable);
  els.empMdl.addEventListener("change", calcularTrfVariable);
  els.empDrct.addEventListener("change", calcularTrfVariable);
  els.empScds.addEventListener("change", calcularTrfVariable);
  if (els.copyButton) els.copyButton.addEventListener("click", copySummary);
  els.addMicrodataItemButton?.addEventListener("click", addCurrentMicrodataItem);
  els.cancelMicrodataEditButton?.addEventListener("click", resetMicrodataEditMode);
  els.microdataBudgetItems?.addEventListener("click", handleMicrodataBudgetClick);
  els.microdataBudgetItems?.addEventListener("change", handleMicrodataBudgetChange);
  addModl?.addEventListener("change", calculate);
  usersExtra?.addEventListener("change", () => {
    uExtra?.classList.toggle("hidden", !usersExtra.checked);
    calculate();
  });
  uExtra?.addEventListener("input", calculate);
  uExtra?.addEventListener("change", calculate);

  refreshPlans();
  calculate();
}

function initErp() {
  els.erpFamilySelect.addEventListener("change", refreshErpPlans);
  els.erpPlanSelect.addEventListener("change", renderErpPlan);

  els.erpBaseDiscountType.addEventListener("change", () => {
    const discountType = els.erpBaseDiscountType.value;
    const hasDiscount = discountType !== "none";

    els.erpBaseDiscountValue.disabled = !hasDiscount;

    if (!hasDiscount) {
      els.erpBaseDiscountValue.value = 0;
    }

    calculateErpTotal();
  });

  els.erpExtraUsersInput.addEventListener("input", () => {
  const max = Number(els.erpExtraUsersInput.max || 0);
  let value = Math.max(0, Number(els.erpExtraUsersInput.value || 0));

  if (max && value > max) {
    value = max;
    els.erpExtraUsersInput.value = max;
  }

  calculateErpTotal();
});

  els.erpBaseDiscountValue.addEventListener("input", () => {
    calculateErpTotal();
  });

  refreshErpPlans();
}

function refreshErpPlans() {
  const familyKey = els.erpFamilySelect.value;
  const family = erpPlans[familyKey];

  els.erpPlanSelect.innerHTML = "";

  Object.entries(family.plans).forEach(([planKey, plan]) => {
    const option = document.createElement("option");

    option.value = planKey;
    option.textContent = plan.name;

    els.erpPlanSelect.appendChild(option);
  });

  renderErpPlan();
}

function createErpFeatureValue(value, featureName) {
  const wrapper = document.createElement("div");
  wrapper.className = "erp-feature-value";

  const feature = typeof value === "object" ? value : { status: value };

  if (feature.status === "optional" && feature.extraKey) {
    const extra = erpExtras[feature.extraKey];
    const label = document.createElement("label");
    label.className = "erp-extra-toggle";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "erp-extra-checkbox";
    checkbox.dataset.extraKey = feature.extraKey;
    const text = document.createElement("span");
    text.textContent = `${extra.name} · ${formatErpExtraPrice(extra)}`;
    label.append(checkbox, text);
    wrapper.appendChild(label);
    return wrapper;
  }

  const status = document.createElement("i");
  status.className = "status";
  const text = document.createElement("span");

  switch (feature.status) {
    case "included":
      status.classList.add("included");
      text.textContent = "Incluido";
      break;
    case "optional":
      status.classList.add("optional");
      text.textContent = "Opcional";
      break;
    case "unavailable":
      status.classList.add("unavailable");
      text.textContent = "No disponible";
      break;
    default:
      text.textContent = feature.status;
      wrapper.appendChild(text);
      return wrapper;
  }

  wrapper.append(status, text);

  return wrapper;
}

function configureErpExtraUsers(plan) {
  const includedUsers = Number(plan.users || 0);
  const extraUserPrice = Number(plan.extraUserPrice || 0);
  const maxUsers = plan.maxUsers;

  els.erpExtraUsersInput.value = 0;
  els.erpExtraUsersPrice.textContent = euros(0);

  if (!extraUserPrice) {
    els.erpExtraUsersBlock.classList.add("hidden");
    return;
  }

  els.erpExtraUsersBlock.classList.remove("hidden");

  const isUnlimited =
    String(maxUsers).toLowerCase() === "ilimitado";

  if (isUnlimited) {
    els.erpExtraUsersInput.max = 50;

    els.erpExtraUsersDescription.textContent =
      `El plan incluye ${includedUsers} usuario${includedUsers === 1 ? "" : "s"}. ` +
      `Cada usuario adicional cuesta ${euros(extraUserPrice)}/mes.`;
  } else {
    const numericMaxUsers = Number(maxUsers || includedUsers);

    const maximumExtraUsers = Math.max(
      0,
      numericMaxUsers - includedUsers
    );

    els.erpExtraUsersInput.max = maximumExtraUsers;

    els.erpExtraUsersDescription.textContent =
      `El plan incluye ${includedUsers} usuario${includedUsers === 1 ? "" : "s"} ` +
      `y permite un máximo de ${numericMaxUsers}. ` +
      `Cada usuario adicional cuesta ${euros(extraUserPrice)}/mes.`;
  }
}

function renderErpPlan() {
  const familyKey = els.erpFamilySelect.value;
  const planKey = els.erpPlanSelect.value;

  const family = erpPlans[familyKey];
  const plan = family?.plans[planKey];

  if (!plan) {
    return;
  }

  configureErpExtraUsers(plan);

  els.erpBasePrice.textContent = euros(plan.price);
  els.erpIncludedUsers.textContent = plan.users;
  els.erpMaxUsers.textContent = plan.maxUsers;

  els.erpSummaryBase.textContent = euros(plan.price);
  els.erpSummaryExtras.textContent = euros(0);
  els.erpTotal.textContent = euros(plan.price);
  els.erpAnnualTotal.textContent = euros(plan.price * 12);

  els.erpFeaturesTable.innerHTML = "";

  Object.entries(plan.features).forEach(([featureName, featureValue]) => {
    const row = document.createElement("div");
    row.className = "erp-feature-row";

    const name = document.createElement("div");
    name.className = "erp-feature-name";
    name.textContent = featureName;

    const value = createErpFeatureValue(featureValue, featureName);

    row.append(name, value);
    els.erpFeaturesTable.appendChild(row);
  });

  document
  .querySelectorAll(".erp-extra-checkbox")
  .forEach(checkbox => {
    checkbox.addEventListener("change", calculateErpTotal);
  });

  renderErpExtras(plan);
  calculateErpTotal();
}

function renderErpExtras(plan) {
  els.erpExtrasList.innerHTML = "";

  const extras = plan.extras || [];

  extras.forEach(extraKey => {
    const extra = erpExtras[extraKey];

    if (!extra) {
      console.error(`No existe el extra "${extraKey}"`);
      return;
    }

    const row = document.createElement("div");
    row.className = "erp-extra-row";
    row.dataset.extraKey = extraKey;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "erp-extra-checkbox";

    const description = document.createElement("div");
    description.className = "erp-extra-description";

    const name = document.createElement("strong");
    name.textContent = extra.name;

    const period = document.createElement("small");
    period.textContent =
      extra.period === "annual"
        ? "Facturación anual"
        : "Facturación mensual";

    description.append(name, period);

    let originalControl;

    if (extra.type === "tier") {
      originalControl = document.createElement("select");
      originalControl.className = "erp-extra-tier-select";
      originalControl.disabled = true;

      extra.tiers.forEach(tier => {
        const option = document.createElement("option");

        option.value = tier.value;
        option.textContent = tier.label;

        originalControl.appendChild(option);
      });
    } else {
      originalControl = document.createElement("span");
      originalControl.className = "erp-extra-original-price";

      originalControl.textContent =
        extra.period === "annual"
          ? `${euros(extra.price)}/año`
          : `${euros(extra.price)}/mes`;
    }

    const discountType = document.createElement("select");
    discountType.className = "erp-extra-discount-type";
    discountType.disabled = true;

    discountType.innerHTML = `
      <option value="none">Sin descuento</option>
      <option value="percentage">%</option>
      <option value="fixed">€</option>
    `;

    const discountValue = document.createElement("input");
    discountValue.type = "number";
    discountValue.min = "0";
    discountValue.step = "0.01";
    discountValue.value = "0";
    discountValue.className = "erp-extra-discount-value";
    discountValue.disabled = true;

    const finalPrice = document.createElement("strong");
    finalPrice.className = "erp-extra-final-price";

    const initialPrice =
      extra.type === "tier"
        ? extra.tiers[0].monthly
        : extra.price;

    finalPrice.textContent =
      extra.period === "annual"
        ? `${euros(initialPrice)}/año`
        : `${euros(initialPrice)}/mes`;

    row.append(
      checkbox,
      description,
      originalControl,
      discountType,
      discountValue,
      finalPrice
    );

    checkbox.addEventListener("change", () => {
      discountType.disabled = !checkbox.checked;
      discountValue.disabled = !checkbox.checked;

      if (extra.type === "tier") {
        originalControl.disabled = !checkbox.checked;
      }

      calculateErpTotal();
    });

    discountType.addEventListener("change", calculateErpTotal);
    discountValue.addEventListener("input", calculateErpTotal);

    if (extra.type === "tier") {
      originalControl.addEventListener("change", calculateErpTotal);
    }

    els.erpExtrasList.appendChild(row);
  });
}

function renderMicrodataBudget() {
  if (!els.microdataBudgetItems || !els.microdataEmptyState || !els.microdataBudgetTableWrapper) return;

  const hasItems = microdataBudgetItems.length > 0;

  if (microdataOpenItemId && !microdataBudgetItems.some(item => item.id === microdataOpenItemId)) {
    microdataOpenItemId = null;
  }

  els.microdataEmptyState.classList.toggle("hidden", hasItems);
  els.microdataBudgetTableWrapper.classList.toggle("hidden", !hasItems);

  if (els.microdataItemCount) {
    const mainCount = microdataBudgetItems.filter(
      item => item.itemType !== "addon" && !item.parentItemId
    ).length;
    const addonCount = microdataBudgetItems.length - mainCount;

    const mainText = `${mainCount} ${mainCount === 1 ? "aplicación" : "aplicaciones"}`;
    const addonText = addonCount > 0
      ? ` · ${addonCount} ${addonCount === 1 ? "complemento" : "complementos"}`
      : "";

    els.microdataItemCount.textContent = mainText + addonText;
  }

  els.microdataBudgetItems.innerHTML = microdataBudgetItems.map(renderMicrodataBudgetItem).join("");
  updateMicrodataBudgetTotals();
}

function getMicrodataItemSummary(item) {
  const license = Number(item.licenseFinal) || 0;
  const maintenance = Number(item.maintenanceFinal) || 0;
  const fee = Number(item.monthlyFeeFinal) || 0;
  const parts = [];

  if (license > 0) parts.push(euros(license));
  if (maintenance > 0) parts.push(`${euros(maintenance)} mant.`);
  if (fee > 0) parts.push(`${euros(fee)}/${item.period === "M" ? "mes" : "año"}`);

  return parts.length ? parts.join(" + ") : "Sin importe";
}

function getMicrodataParentItem(item) {
  if (!item?.parentItemId) {
    return null;
  }

  return microdataBudgetItems.find(
    candidate => candidate.id === item.parentItemId
  ) || null;
}

function renderMicrodataBudgetItem(item) {
  const isOpen = microdataOpenItemId === item.id;
  const isAddon = item.itemType === "addon" || Boolean(item.parentItemId);
  const parentItem = getMicrodataParentItem(item);
  const quantityText = Number(item.quantity) > 0
    ? `${item.quantityLabel}: ${Number(item.quantity).toLocaleString("es-ES")}`
    : "";
  const relationshipText = isAddon && parentItem
    ? `Complemento de ${parentItem.application}`
    : "";

  return `
    <article class="microdata-result-row microdata-accordion-item ${isOpen ? "is-open" : ""} ${isAddon ? "is-addon" : "is-main-item"}" data-item-id="${escapeHtml(item.id)}"${isAddon ? ` data-parent-item-id="${escapeHtml(item.parentItemId)}"` : ""}>
      <button
        type="button"
        class="microdata-accordion-trigger"
        data-action="toggle"
        aria-expanded="${isOpen}"
        aria-controls="microdata-panel-${escapeHtml(item.id)}"
      >
        <span class="microdata-accordion-chevron" aria-hidden="true">›</span>
        <span class="microdata-accordion-summary">
          <strong data-field="application">${isAddon ? "↳ " : ""}${escapeHtml(item.application)}</strong>
          <small>${relationshipText ? `${escapeHtml(relationshipText)} · ` : ""}${escapeHtml(item.plan || "Sin plan")}${quantityText ? ` · ${escapeHtml(quantityText)}` : ""}</small>
        </span>
        <span class="microdata-accordion-price">${escapeHtml(getMicrodataItemSummary(item))}</span>
      </button>

      <div id="microdata-panel-${escapeHtml(item.id)}" class="microdata-accordion-panel" ${isOpen ? "" : "hidden"}>
        <div class="microdata-accordion-details">
          <div class="microdata-accordion-meta">
            ${isAddon ? '<span class="microdata-item-badge microdata-addon-badge">Complemento</span>' : ""}
            <span class="microdata-item-badge">${escapeHtml(item.billingLabel)}</span>
            <span class="microdata-item-badge microdata-period-badge">${item.period === "M" ? "Mensual" : "Anual"}</span>
          </div>
          ${item.detail ? `<p class="microdata-item-detail">${escapeHtml(item.detail)}</p>` : ""}
        </div>

        <div class="microdata-item-values">
          ${renderMicrodataAmount(item, "license", "Licencia")}
          ${renderMicrodataAmount(item, "maintenance", "Mantenimiento")}
          ${renderMicrodataAmount(item, "monthlyFee", item.period === "M" ? "Cuota mensual" : "Cuota anual")}
        </div>

        <div class="microdata-accordion-actions">
          <button type="button" class="microdata-item-action microdata-edit-action" data-action="edit">${isAddon ? "✎ Configurar aplicación" : "✎ Editar"}</button>
          ${isAddon ? "" : '<button type="button" class="microdata-item-action delete" data-action="delete">X Eliminar</button>'}
        </div>
      </div>
    </article>`;
}

function renderMicrodataAmount(item, key, label) {
  const original = Number(item[`${key}Original`]) || 0;
  const finalValue = Number(item[`${key}Final`]) || 0;
  const type = item[`${key}DiscountType`] || "none";
  const discountValue = Number(item[`${key}DiscountValue`]) || 0;
  const disabled = original <= 0;

  return `
    <div class="microdata-item-value ${disabled ? "is-empty" : ""}">
      <div class="microdata-amount-heading">
        <span>${escapeHtml(label)}</span>
        <strong>${disabled ? "—" : euros(finalValue)}</strong>
      </div>
      ${disabled ? "" : `
        <div class="microdata-discount-controls">
          <small class="microdata-original-price">Precio original: ${euros(original)}</small>
          <div class="microdata-discount-fields">
            <label class="microdata-discount-field">
              <span>Descuento</span>
              <select data-discount-key="${key}" data-discount-part="type" aria-label="Tipo de descuento para ${escapeHtml(label)}">
                <option value="none" ${type === "none" ? "selected" : ""}>Sin descuento</option>
                <option value="percentage" ${type === "percentage" ? "selected" : ""}>Porcentaje</option>
                <option value="fixed" ${type === "fixed" ? "selected" : ""}>Importe fijo</option>
              </select>
            </label>
            <label class="microdata-discount-field microdata-discount-value-field ${type === "none" ? "is-disabled" : ""}">
              <span>Valor</span>
              <input type="number" min="0" step="0.01" value="${discountValue}" data-discount-key="${key}" data-discount-part="value" ${type === "none" ? "disabled" : ""} aria-label="Valor del descuento para ${escapeHtml(label)}">
            </label>
          </div>
        </div>`}
    </div>`;
}

function handleMicrodataBudgetClick(event) {
  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) return;

  const row = actionButton.closest("[data-item-id]");
  const id = row?.dataset.itemId;
  if (!id) return;

  const action = actionButton.dataset.action;

  if (action === "toggle") {
    microdataOpenItemId = microdataOpenItemId === id ? null : id;
    renderMicrodataBudget();
    return;
  }

  if (action === "delete") {
    const selectedItem = microdataBudgetItems.find(item => item.id === id);
    const mainItemId = selectedItem?.parentItemId || id;

    microdataBudgetItems = microdataBudgetItems.filter(
      item => item.id !== mainItemId && item.parentItemId !== mainItemId
    );

    if (microdataEditingItemId === mainItemId) resetMicrodataEditMode();
    if (
      microdataOpenItemId === mainItemId ||
      microdataBudgetItems.every(item => item.id !== microdataOpenItemId)
    ) {
      microdataOpenItemId = null;
    }

    renderMicrodataBudget();
    return;
  }

  if (action === "edit") {
    const selectedItem = microdataBudgetItems.find(item => item.id === id);
    const editableId = selectedItem?.parentItemId || id;

    microdataOpenItemId = editableId;
    editMicrodataItem(editableId);
  }
}

function handleMicrodataBudgetChange(event) {
  const control = event.target.closest("[data-discount-key]");
  if (!control) return;

  const row = control.closest("[data-item-id]");
  const item = microdataBudgetItems.find(current => current.id === row?.dataset.itemId);
  if (!item) return;

  const key = control.dataset.discountKey;
  const part = control.dataset.discountPart;

  if (part === "type") {
    item[`${key}DiscountType`] = control.value;
    if (control.value === "none") item[`${key}DiscountValue`] = 0;
  } else {
    item[`${key}DiscountValue`] = Math.max(0, Number(control.value) || 0);
  }

  microdataOpenItemId = item.id;
  recalculateMicrodataItem(item);
  renderMicrodataBudget();
}

function editMicrodataItem(id) {
  const item = microdataBudgetItems.find(current => current.id === id);
  if (!item) return;

  microdataEditingItemId = id;
  microdataOpenItemId = id;
  els.appSelect.value = item.appKey;
  refreshPlans();
  els.planSelect.value = item.plan;

  const app = apps[item.appKey];
  const billingIndex = (app.billingOptions || []).findIndex(option => option.value === item.billing);
  if (billingIndex >= 0) els.billingSelect.selectedIndex = billingIndex;

  els.quantityInput.value = item.quantity;
  updateExtraFields();

  if (els.extraUsersInput) els.extraUsersInput.value = item.configuration?.extraUsers || 0;
  if (addModl) addModl.checked = Boolean(item.configuration?.addModule);
  if (els.selectMdlGest && item.configuration?.module) els.selectMdlGest.value = item.configuration.module;
  if (uExtra) uExtra.value = item.configuration?.certExtraUsers || 0;

  calculate();

  if (els.addMicrodataItemButton) els.addMicrodataItemButton.textContent = "Guardar cambios";
  els.cancelMicrodataEditButton?.classList.remove("hidden");
  els.appSelect.scrollIntoView({ behavior: "smooth", block: "center" });
}

function getMicrodataBudgetSummary() {
  const totals = microdataBudgetItems.reduce((acc, item) => {
    acc.licenseOriginal += Number(item.licenseOriginal) || 0;
    acc.maintenanceOriginal += Number(item.maintenanceOriginal) || 0;
    acc.licenseFinal += Number(item.licenseFinal) || 0;
    acc.maintenanceFinal += Number(item.maintenanceFinal) || 0;

    if (item.period === "M") {
      acc.monthlyFeeOriginal += Number(item.monthlyFeeOriginal) || 0;
      acc.monthlyFeeFinal += Number(item.monthlyFeeFinal) || 0;
    } else {
      acc.annualFeeOriginal += Number(item.monthlyFeeOriginal) || 0;
      acc.annualFeeFinal += Number(item.monthlyFeeFinal) || 0;
    }

    return acc;
  }, {
    licenseOriginal: 0,
    maintenanceOriginal: 0,
    monthlyFeeOriginal: 0,
    annualFeeOriginal: 0,
    licenseFinal: 0,
    maintenanceFinal: 0,
    monthlyFeeFinal: 0,
    annualFeeFinal: 0
  });

  const mainItems = microdataBudgetItems.filter(
    item => item.itemType !== "addon" && !item.parentItemId
  );

  const addonItems = microdataBudgetItems.filter(
    item => item.itemType === "addon" || Boolean(item.parentItemId)
  );

  const uniqueValues = values => [...new Set(values.filter(Boolean))];
  const applications = uniqueValues(mainItems.map(item => item.application));
  const plans = uniqueValues(mainItems.map(item => item.plan));

  const initialOriginal =
    totals.licenseOriginal +
    totals.maintenanceOriginal +
    totals.annualFeeOriginal;

  const initialFinal =
    totals.licenseFinal +
    totals.maintenanceFinal +
    totals.annualFeeFinal;

  const annualEquivalent =
    initialFinal +
    totals.monthlyFeeFinal * 12;

  const discountCount = microdataBudgetItems.filter(item =>
    (item.licenseDiscountType !== "none" && Number(item.licenseDiscountValue) > 0) ||
    (item.maintenanceDiscountType !== "none" && Number(item.maintenanceDiscountValue) > 0) ||
    (item.monthlyFeeDiscountType !== "none" && Number(item.monthlyFeeDiscountValue) > 0)
  ).length;

  return {
    ...totals,
    initialOriginal,
    initialFinal,
    annualEquivalent,
    applications,
    plans,
    solutionLabel: applications.join(" + "),
    planLabel: plans.join(" · "),
    addonItems,
    discountLabel: discountCount > 0
      ? `${discountCount} ${discountCount === 1 ? "línea con descuento" : "líneas con descuento"}`
      : ""
  };
}

function updateMicrodataBudgetTotals() {
  const summary = getMicrodataBudgetSummary();

  if (els.microdataTotalLicense) els.microdataTotalLicense.textContent = euros(summary.licenseFinal);
  if (els.microdataTotalMaintenance) els.microdataTotalMaintenance.textContent = euros(summary.maintenanceFinal);
  if (els.microdataTotalMonthlyFee) els.microdataTotalMonthlyFee.textContent = euros(summary.monthlyFeeFinal);
  if (els.microdataTotalAnnualFee) els.microdataTotalAnnualFee.textContent = euros(summary.annualFeeFinal);
  if (els.microdataTotal) els.microdataTotal.textContent = euros(summary.monthlyFeeFinal + summary.annualFeeFinal);
  if (els.mainResult) els.mainResult.textContent = euros(summary.initialFinal);
  if (els.summaryMonthly) els.summaryMonthly.textContent = euros(summary.monthlyFeeFinal);
  if (els.summaryAnnual) els.summaryAnnual.textContent = euros(summary.annualEquivalent);
}

function escapeHtml(value = "") {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function calculateErpTotal() {

  const familyKey = els.erpFamilySelect.value;
  const planKey = els.erpPlanSelect.value;
  const plan = erpPlans[familyKey]?.plans[planKey];

  if (!plan) {
    return;
  }

  const extraUsers = Math.max(0, Number(els.erpExtraUsersInput.value || 0));
  const extraUserPrice = Number(plan.extraUserPrice || 0);
  const extraUsersMonthly = extraUsers * extraUserPrice;
  const extraUsersAnnual = extraUsersMonthly * 12;
  const baseDiscountType = els.erpBaseDiscountType.value;
  const baseDiscountValue = Number(
    els.erpBaseDiscountValue.value || 0
  );

  const baseMonthly = applyDiscount(
    plan.price,
    baseDiscountType,
    baseDiscountValue
  );

  const baseAnnual = baseMonthly * 12;

  let extrasMonthly = extraUsersMonthly;
  let extrasAnnual = extraUsersAnnual;

  document.querySelectorAll(".erp-extra-row").forEach(row => {
    const checkbox = row.querySelector(".erp-extra-checkbox");

    if (!checkbox?.checked) return;

    const extraKey = row.dataset.extraKey;
    const extra = erpExtras[extraKey];

    if (!extra) return;

    let originalPrice = extra.price;

    if (extra.type === "tier") {
      const tierSelect = row.querySelector(".erp-extra-tier-select");
      const selectedValue = Number(tierSelect.value);

      const selectedTier =
        extra.tiers.find(tier => tier.value === selectedValue) ||
        extra.tiers[0];

      originalPrice = selectedTier.monthly;
    }

    const discountType =
      row.querySelector(".erp-extra-discount-type").value;

    const discountValue = Number(
      row.querySelector(".erp-extra-discount-value").value || 0
    );

    const finalExtraPrice = applyDiscount(
      originalPrice,
      discountType,
      discountValue
    );

    const finalPriceElement =
      row.querySelector(".erp-extra-final-price");

    finalPriceElement.textContent =
      extra.period === "annual"
        ? `${euros(finalExtraPrice)}/año`
        : `${euros(finalExtraPrice)}/mes`;

    if (extra.period === "monthly") {
      extrasMonthly += finalExtraPrice;
      extrasAnnual += finalExtraPrice * 12;
    } else {
      extrasAnnual += finalExtraPrice;
      extrasMonthly += finalExtraPrice / 12;
    }
  });

  const totalMonthly = baseMonthly + extrasMonthly;
  const totalAnnual = baseAnnual + extrasAnnual;

  els.erpBasePrice.textContent = euros(plan.price);
  els.erpBaseFinalPrice.textContent = euros(baseMonthly);

  els.erpSummaryBase.textContent = euros(baseMonthly);
  els.erpSummaryExtras.textContent = euros(extrasMonthly);
  els.erpTotal.textContent = euros(totalMonthly);
  els.erpAnnualTotal.textContent = euros(totalAnnual);
  els.erpExtraUsersPrice.textContent = `${euros(extraUsersMonthly)}/mes`;
}

function getErpExtraUsersData() {
  const familyKey = els.erpFamilySelect.value;
  const planKey = els.erpPlanSelect.value;

  const plan = erpPlans[familyKey]?.plans?.[planKey];

  if (!plan) {
    return {
      quantity: 0,
      unitPrice: 0,
      monthlyCost: 0
    };
  }

  const quantity = Math.max(0, Number(els.erpExtraUsersInput.value || 0));
  const unitPrice = Number(plan.extraUserPrice || 0);

  return {
    quantity,
    unitPrice,
    monthlyCost: quantity * unitPrice
  };
}

function applyDiscount(price, type, value) {
  const safePrice = Math.max(0, Number(price) || 0);
  const safeValue = Math.max(0, Number(value) || 0);

  if (type === "percentage") {
    const percentage = Math.min(safeValue, 100);

    return safePrice - safePrice * (percentage / 100);
  }

  if (type === "fixed") {
    return Math.max(0, safePrice - safeValue);
  }

  return safePrice;
}

function refreshPlans() {
  const app = apps[els.appSelect.value];
  els.planSelect.innerHTML = "";
  app.plans.forEach(plan => {
    const option = document.createElement("option");
    option.value = plan;
    option.textContent = plan;
    els.planSelect.appendChild(option);
  });

  els.billingSelect.innerHTML = "";
  (app.billingOptions || []).forEach(optionConfig => {
    const option = document.createElement("option");
    option.value = optionConfig.value;
    option.textContent = optionConfig.label;
    els.billingSelect.appendChild(option);
  });

  updateExtraFields();

  els.quantityLabel.textContent = app.quantityLabel;
  els.billingField.style.display = (app.billingOptions || []).length > 1 ? "block" : "none";
  els.quantityInput.value = app.mode === "capacityPlan" ? 360 : 1;
}

function cargarSelectBuzones() {
  extra.classList.contains("hidden") ? null : extra.classList.add("hidden");
  if (els.selectBuzones.options.length > 0) return;
  els.selectBuzones.innerHTML = "";

  (apps.msnotifica?.tiers || []).forEach(tier => {
    const option = document.createElement("option");
    option.value = tier.mailboxes;
    option.textContent = tier.mailboxes === 500 ? "500 o más" : tier.mailboxes;
    els.selectBuzones.appendChild(option);
  });

  els.selectBuzones.style.display = "block";
  els.quantityInput.style.display = "none";
}
// En caso de entrar en app MsGest, añade select con los módulos de MsGest si check marcado
function cargarSelectModulos() {
  if (els.selectMdlGest.options.length > 0) return;
  els.selectMdlGest.innerHTML = "";

  (apps.msgest_modulos?.tiers || []).forEach(tier => {
    const option = document.createElement("option");
    option.value = tier.plan;
    els.selectMdlGest.appendChild(option);
    option.textContent = tier.plan;
  });

  els.selectMdlGest.style.display = "block";
}
// Cambia el input de los buzones por un select en < 500 y vuelve al input en > 500
function cambiarBuzonesMsNotifica() {
  const app = apps[els.appSelect.value];
  if (app.mode !== "msnotifica") {
    els.selectBuzones.style.display = "none";
    els.quantityInput.style.display = "block";
    return;
  } ;
  const valorSelect = Number(els.selectBuzones.value);
  const valorInput = Number(els.quantityInput.value || 0);

  if (valorSelect === 500 && els.selectBuzones.style.display !== "none") {
    els.selectBuzones.style.display = "none";
    els.quantityInput.style.display = "block";
    els.quantityInput.step = 1;
    els.quantityInput.value = 500;
    calculate();
    return;
  }

  if (els.quantityInput.style.display !== "none" && valorInput < 500) {
    els.quantityInput.style.display = "none";
    els.selectBuzones.style.display = "block";
    els.selectBuzones.value = "50";
    calculate();
    return;
  }

  if (els.selectBuzones.style.display !== "none") {
    els.quantityInput.value = valorSelect;
  }
}

function calcLicenciasExtra(quantity, baseQuantity, unitPrice) {
    if (quantity <= baseQuantity) return 0;

    return (quantity - baseQuantity) * unitPrice;
}

function calcularTrabajadores(ejornada, quantity, plan) {
  let precio = 0;
  if ((plan === "Módulo Fichajes" || plan === "Fichajes + Ausencias") && quantity > 100) {
    switch (true) {
      case quantity > 100 && quantity < 200:
        precio = ejornada[plan] + ((plan === "Módulo Fichajes" ? ejornada.workerExtraF : ejornada.workerExtraFA || 0) * (quantity - 100));
        break;
      case quantity > 200 && quantity < 500:
        precio = ejornada[plan] + ((plan === "Módulo Fichajes" ? ejornada.workerExtraF : ejornada.workerExtraFA || 0) * (quantity - 200));
        break;
      case quantity > 500 && quantity < 700:
        precio = ejornada[plan] + ((plan === "Módulo Fichajes" ? ejornada.workerExtraF : ejornada.workerExtraFA || 0) * (quantity - 500));
        break;
      case quantity > 700 && quantity < 1000:
        precio = ejornada[plan] + ((plan === "Módulo Fichajes" ? ejornada.workerExtraF : ejornada.workerExtraFA || 0) * (quantity - 700));
        break;
      default:
        precio = ejornada[plan] + ((plan === "Módulo Fichajes" ? ejornada.workerExtraF : ejornada.workerExtraFA || 0) * (quantity - 1000));
        break;
    }
  } else {
    precio = ejornada[plan];
  }
  return precio;
}

function calcDocs(quantity, plan, period, precioTarifa, efirma, precioExtraUser, extraUser) {
  let precioDocExtra = efirma.extraDocs;
  let usersPlus = calcExtraUsers(extraUser, efirma);
  if (plan === "Concertada") {
    switch (true) {
      case (quantity >= 5000 && quantity < 12500) || (quantity >= 417 && quantity < 1042):
        if (period === "monthly") return {  monthly: precioTarifa +  (precioDocExtra * (quantity - 417)) + usersPlus,
                                            annual: (precioTarifa +  (precioDocExtra * (quantity - 417)) + usersPlus) * 12,
                                            main: precioTarifa +  (precioDocExtra * (quantity - 417)) + usersPlus };
        if (period === "annual") return {   monthly: (precioTarifa +  (precioDocExtra * (quantity - 5000)) + usersPlus) / 12,
                                            annual: (precioTarifa +  (precioDocExtra * (quantity - 5000)) + usersPlus),
                                            main: precioTarifa +  (precioDocExtra * (quantity - 5000)) + usersPlus };
        break;
      case (quantity >= 12500 && quantity < 50000) && (quantity >= 1042 && quantity < 2083):
        if (period === "monthly") return {  monthly: precioTarifa +  (precioDocExtra * (quantity - 1042)) + usersPlus,
                                            annual: (precioTarifa +  (precioDocExtra * (quantity - 1042)) + usersPlus) * 12,
                                            main: precioTarifa +  (precioDocExtra * (quantity - 1042)) + usersPlus };
        if (period === "annual") return {   monthly: (precioTarifa +  (precioDocExtra * (quantity - 12500)) + usersPlus) / 12,
                                            annual: (precioTarifa +  (precioDocExtra * (quantity - 12500)) + usersPlus),
                                            main: precioTarifa +  (precioDocExtra * (quantity - 12500)) + usersPlus };
        break;
      case (quantity >= 50000 && quantity < 70000) && (quantity >= 2083 && quantity < 4167):
        if (period === "monthly") return {  monthly: precioTarifa +  (precioDocExtra * (quantity - 2083)) + usersPlus,
                                            annual: (precioTarifa +  (precioDocExtra * (quantity - 2083)) + usersPlus) * 12,
                                            main: precioTarifa +  (precioDocExtra * (quantity - 2083)) + usersPlus };
        if (period === "annual") return {   monthly: (precioTarifa +  (precioDocExtra * (quantity - 50000)) + usersPlus) / 12,
                                            annual: (precioTarifa +  (precioDocExtra * (quantity - 50000)) + usersPlus),
                                            main: precioTarifa +  (precioDocExtra * (quantity - 50000)) + usersPlus };
        break;
      case (quantity >= 70000 && quantity < 100000) && (quantity >= 4167 && quantity < 8333):
        if (period === "monthly") return {  monthly: precioTarifa +  (precioDocExtra * (quantity - 4167)) + usersPlus,
                                            annual: (precioTarifa +  (precioDocExtra * (quantity - 4167)) + usersPlus) * 12,
                                            main: precioTarifa +  (precioDocExtra * (quantity - 4167)) + usersPlus };
        if (period === "annual") return {   monthly: (precioTarifa +  (precioDocExtra * (quantity - 70000)) + usersPlus) / 12,
                                            annual: (precioTarifa +  (precioDocExtra * (quantity - 70000)) + usersPlus),
                                            main: precioTarifa +  (precioDocExtra * (quantity - 70000)) + usersPlus };
        break;
      case quantity >= 100000  && quantity > 8333:
        if (period === "monthly") return {  monthly: precioTarifa +  (precioDocExtra * (quantity - 8333)) + usersPlus,
                                            annual: (precioTarifa +  (precioDocExtra * (quantity - 8333)) + usersPlus) * 12,
                                            main: precioTarifa +  (precioDocExtra * (quantity - 8333)) + usersPlus };
        if (period === "annual") return {   monthly: (precioTarifa +  (precioDocExtra * (quantity - 100000)) + usersPlus) / 12,
                                            annual: (precioTarifa +  (precioDocExtra * (quantity - 100000)) + usersPlus),
                                            main: precioTarifa +  (precioDocExtra * (quantity - 100000)) + usersPlus };
        break;
      default:
        break;
    }
  } else {
    if (period === "monthly") return { monthly: precioTarifa + (usersPlus / 12), annual: (precioTarifa * 12) + usersPlus, main: precioTarifa + (usersPlus / 12) };
    if (period === "annual") return { monthly: (precioTarifa / 12) + usersPlus, annual: precioTarifa + usersPlus, main: precioTarifa + usersPlus };
  }
  return { monthly: 0, annual: precioTarifa, main: precioTarifa };
}

function calcExtraUsers (extraUsers, tier) {
  if (extraUsers > 0) {
      return tier.userExtra * extraUsers;
  }

  return 0;

}

function addModulosGest(quantity) {
  const mdlKey = "msgest_modulos";
  const moduloSelect = els.selectMdlGest.value;
  const app = apps[mdlKey];
  const tierKey = app.tierKey;
  const billing = selectedBilling(app);
  const modulo = app.tiers.find(item => item.plan === moduloSelect) || app.items[0];
  const value = modulo[billing.field] ?? modulo[tierKey];
  return { monthly: (modulo.price) / 12, annual: modulo.price, main: modulo.price + (modulo.maintenance * quantity), mante: modulo.maintenance * quantity };
}

function cambiaPreciosPorTarifa(plan, app, period, quantity) {
  switch (app) {
    case "efirma":
      switch (plan) {
        case "Personal":
          if (period === "monthly") {
            quantityInput.max = 5;
            quantityInput.min = 5;
            quantityInput.value = 5;
          } else {
            quantityInput.max = 60;
            quantityInput.min = 60;
            quantityInput.value = 60;
          }
          break;
        case "Professional":
          if (period === "monthly") {
            quantityInput.max = 30;
            quantityInput.min = 30;
            quantityInput.value = 30;
          } else {
            quantityInput.max = 360;
            quantityInput.min = 360;
            quantityInput.value = 360;
          }
          break;
        case "Business":
          if (period === "monthly") {
            quantityInput.max = 100;
            quantityInput.min = 100;
            quantityInput.value = 100;
          } else {
            quantityInput.max = 1200;
            quantityInput.min = 1200;
            quantityInput.value = 1200;
          }
          break;
        case "Business Plus":
          if (period === "monthly") {
            quantityInput.max = 250;
            quantityInput.min = 250;
            quantityInput.value = 250;
          } else {
            quantityInput.max = 3000;
            quantityInput.min = 3000;
            quantityInput.value = 3000;
          }
          break;
        case "Concertada":
          if (period === "monthly") {
            quantityInput.min = 417;
            quantityInput.value < 417 ? quantityInput.value = 417 : null;
            quantityInput.removeAttribute("max");
          } else {
            quantityInput.min = 5000;
            quantityInput.value < 5000 ? quantityInput.value = 5000 : null;
            quantityInput.removeAttribute("max");
          }
          break;
        default:
          break;
      } 
      break;
    case "msnomina":
      break;
    case "msgest_modulos":
      break;
    case "msconta":
      break;
    case "msmodelos":
      break;
    case "paquete_fiscal":
      break;
    case "msrenta":
      break;
    case "msscan":
      break;
    case "msscan_ocr":
      break;
    case "msbabelia":
      break;
    case "pago_uso_fiscal":
      break;
    case "pago_uso_laboral":
      break;
    case "msexpress_web":
      break;
    case "despachos_completos":
      break;
    default:
      break;
  }
}

function eurosToNumber(value) {
    return Number(
        value
            .replace("€", "")
            .replace(/\./g, "")
            .replace(",", ".")
            .trim()
    );
}

function calcularTrfVariable () {
  let total = els.totalLaboral.innerText === "0,00 €" ? 0 : eurosToNumber(els.totalLaboral.innerText);
  let totalFscl = els.totalFiscal.innerText === "0,00 €" ? 0 : eurosToNumber(els.totalFiscal.innerText);
  if (!els.trfVrb.classList.contains("hidden")) {
    const app = els.appSelect.value === "msnomina" ? apps["pago_uso_laboral"] : apps["pago_uso_fiscal"];
    switch (els.appSelect.value) {
      case "msnomina":
        let porEmpleado = 0;
        let porEmpresa = 0;
        const listaPorEmpresa = app.items.filter(t => t.plan === "Por Empresa");
        const listaPorTbj = app.items.filter(t => t.plan === "Por Trabajador");
        let precioEmpresa = listaPorEmpresa[0].monthly;
        let precioTrabajador = listaPorTbj[0].monthly;
        els.porEmp.value > 0 ? porEmpresa = els.porEmp.value * precioEmpresa : 0;
        els.porTbj.value > 0 ? porEmpleado = els.porTbj.value  * precioTrabajador : 0;
        total = Number(porEmpleado) + Number(porEmpresa);
        total >= 35 ? els.totalLaboral.textContent = euros(total) : els.totalLaboral.textContent = euros(35);
      break;
      case "paquete_fiscal":
        let empMdl = 0;
        let empDrct = 0;
        let scds = 0;
        const listaEmpMdl = app.items.filter(t => t.plan === "Emp. Módulos");
        const listaEmpDrct = app.items.filter(t => t.plan === "Emp. Direct. N. y Simpl");
        const listaSociedades = app.items.filter(t => t.plan === "Empresa Sociedades");
        let precioEmpMdl = listaEmpMdl[0].annual;
        let precioEmpDrct = listaEmpDrct[0].annual;
        let precioScds = listaSociedades[0].annual;
        els.empMdl.value > 0 ? empMdl = els.empMdl.value * precioEmpMdl : 0;
        els.empDrct.value > 0 ? empDrct = els.empDrct.value  * precioEmpDrct : 0;
        els.empScds.value > 0 ? scds = els.empScds.value  * precioScds : 0;
        totalFiscal = Number(empMdl) + Number(empDrct) + Number(scds);
        els.totalFiscal.textContent = euros(totalFiscal) + " + " + euros(300) + " por implantación = " + euros(totalFiscal+300);
      break;
    }
  }
}

function calculate() {
  updateExtraFields();
  try {
    currentMicrodataPreview = getMicrodataSelectionCalculation();
    if (els.noticeBox) {
      els.noticeBox.textContent = currentMicrodataPreview.notice || "";
      els.noticeBox.classList.toggle("visible", Boolean(currentMicrodataPreview.notice));
    }
  } catch (error) {
    currentMicrodataPreview = null;
    if (els.noticeBox) {
      els.noticeBox.textContent = error.message;
      els.noticeBox.classList.add("visible");
    }
  }
  updateMicrodataBudgetTotals();
}

document.querySelectorAll(".accordion-header").forEach(button => {
  button.addEventListener("click", () => {
    const item = button.parentElement;

    document.querySelectorAll(".accordion-item").forEach(otherItem => {
      if (otherItem !== item) {
        otherItem.classList.remove("active");
      }
    });

    item.classList.toggle("active");
  });
});

async function copySummary() {
  const text = [
    "Resumen de cálculo",
    `App: ${els.summaryApp.textContent}`,
    `Plan / tarifa: ${els.summaryPlan.textContent}`,
    `${els.summaryQuantityLabel.textContent}: ${els.summaryQuantity.textContent}`,
    `Precio mensual: ${els.summaryMonthly.textContent}`,
    `Precio anual: ${els.summaryAnnual.textContent}`
  ].join("\n");

  try {
    await navigator.clipboard.writeText(text);
    els.copyButton.textContent = "Copiado";
    setTimeout(() => els.copyButton.textContent = "Copiar resumen", 1400);
  } catch {
    alert(text);
  }
}

const tabButtons = document.querySelectorAll(".tab-button");
const tabs = document.querySelectorAll(".tab");

function initializeTabs() {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabs = document.querySelectorAll(".tab");

  tabButtons.forEach(button => {
      button.addEventListener("click", () => {
          const selectedTabId = button.dataset.tab;

          if (!selectedTabId) {
              console.warn("El botón no tiene data-tab:", button);
              return;
          }

          const selectedTab = document.getElementById(selectedTabId);

          if (!selectedTab) {
              console.warn(`No existe una pestaña con id="${selectedTabId}"`);
              return;
          }

          tabButtons.forEach(tabButton => {
              tabButton.classList.toggle("active", tabButton === button);
              tabButton.setAttribute("aria-selected", tabButton === button ? "true" : "false");
          });

          tabs.forEach(tab => {
              tab.classList.toggle("active", tab === selectedTab);
          });
      });
  });
}

initializeTabs();

tabButtons.forEach(button => {
  button.addEventListener("click", () => {
    const selectedTabId = button.dataset.tab;

    tabButtons.forEach(btn => {
      btn.classList.toggle("active", btn === button);
    });

    tabs.forEach(tab => {
      tab.classList.toggle("active", tab.id === selectedTabId);
    });

    document.getElementById("generateBudgetBtn")?.classList.toggle(
      "hidden",
      selectedTabId === "microdata"
    );
  });
});

const generateBudgetBtn = document.getElementById("generateBudgetBtn");
const microdataGenerateBudgetBtn = document.getElementById("microdataGenerateBudgetBtn");
const clientModal = document.getElementById("clientModal");
const clientForm = document.getElementById("clientForm");
const closeClientModal = document.getElementById("closeClientModal");
const cancelClientData = document.getElementById("cancelClientData");

closeClientModal.addEventListener("click", closeClientDataModal);
cancelClientData.addEventListener("click", closeClientDataModal);
microdataGenerateBudgetBtn?.addEventListener("click", () => generateBudgetBtn.click());

function closeClientDataModal() {
    clientModal.classList.add("hidden");
}

generateBudgetBtn.addEventListener("click", async event => {
  event.preventDefault();
  event.stopPropagation();

  if (getActiveBudgetType() === "microdata" && microdataBudgetItems.length === 0) {
    alert("Añade al menos una aplicación al presupuesto antes de generar el documento.");
    return;
  }

  clientModal.classList.remove("hidden");
});

clientForm.addEventListener("submit", async event => {
    event.preventDefault();
    const submitButton = clientForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    try {
        const clientData = getClientData();
        const budgetData = {
            ...buildBudgetData(),
            ...clientData
        };

        budgetData.datosPresupuesto = buildBudgetSnapshot(
            budgetData,
            clientData
        );

        console.log("Datos del presupuesto:", budgetData);
        await saveBudgetRecord(budgetData);
        clientModal.classList.add("hidden");
        await generateBudgetDocument(budgetData);
        BudgetManager.clearLoadedBudget();
    } catch (error) {
        console.error(error);
        alert(
            "No se ha podido guardar el presupuesto. " +
            "No se generará el documento para evitar que quede sin registrar."
        );
    } finally {
        submitButton.disabled = false;
    }
});

function getClientData() {
    return {
        clienteNombre:document.getElementById("clientName").value.trim(),
        clienteCif:document.getElementById("clientTaxId").value.trim(),
        clienteDireccion:document.getElementById("clientAddress").value.trim(),
        clienteCodigoPostal:document.getElementById("clientPostalCode").value.trim(),
        clientePoblacion:document.getElementById("clientCity").value.trim(),
        provincia:document.getElementById("clientProvince").value.trim(),
        clienteEmail:document.getElementById("clientEmail").value.trim(),
        clienteTelefono:document.getElementById("clientPhone").value.trim(),
        clienteContacto:document.getElementById("clientRepresentative").value.trim(),
        nifRepres:document.getElementById("clientRepresentativeTaxId").value.trim()
    };
}

function cloneBudgetSnapshotValue(value) {
    return JSON.parse(JSON.stringify(value));
}

function buildBudgetSnapshot(budgetData, clientData) {
    const calculatorType = getActiveBudgetType();

    const snapshot = {
        schemaVersion: 1,
        calculatorType,
        savedAt: new Date().toISOString(),
        budgetNumber: budgetData.numPresupuesto || "",
        sourceBudgetId: currentLoadedBudget?.sourceBudgetId || "",
        recoveryMode: currentLoadedBudget?.recoveryMode || "new",
        customerData: cloneBudgetSnapshotValue(clientData || {}),
        documentData: cloneBudgetSnapshotValue({
            ...budgetData,
            datosPresupuesto: undefined
        })
    };

    if (calculatorType === "microdata") {
        snapshot.items = cloneBudgetSnapshotValue(
            microdataBudgetItems
        );

        snapshot.editorState = {
            notes:
                document
                    .getElementById("microdataBudgetNotes")
                    ?.value || ""
        };
    } else {
        snapshot.erpState = {
            familyKey:
                els.erpFamilySelect?.value || "",
            planKey:
                els.erpPlanSelect?.value || "",
            baseDiscountType:
                els.erpBaseDiscountType?.value || "none",
            baseDiscountValue:
                Number(els.erpBaseDiscountValue?.value) || 0,
            extraUsers:
                Number(els.erpExtraUsersInput?.value) || 0,
            extras:
                cloneBudgetSnapshotValue(
                    captureErpEditorExtrasState()
                ),
            notes:
                budgetNotes?.value || ""
        };
    }

    return snapshot;
}


function captureErpEditorExtrasState() {
    return Array.from(
        document.querySelectorAll("#erpExtrasList .erp-extra-row")
    )
        .map(row => {
            const checkbox = row.querySelector(".erp-extra-checkbox");

            if (!checkbox?.checked) {
                return null;
            }

            return {
                extraKey: row.dataset.extraKey || "",
                nombre:
                    row.querySelector(".erp-extra-description strong")
                        ?.textContent?.trim() || "",
                checked: true,
                tierValue:
                    row.querySelector(".erp-extra-tier-select")?.value || "",
                discountType:
                    row.querySelector(".erp-extra-discount-type")?.value || "none",
                discountValue:
                    Number(
                        row.querySelector(".erp-extra-discount-value")?.value
                    ) || 0
            };
        })
        .filter(Boolean);
}

function getElementText(id) {
    const element = document.getElementById(id);

    if (!element) {
        console.warn(`No existe ningún elemento con id="${id}"`);
        return "";
    }

    return element.textContent.trim();
}

function getActiveBudgetType() {
    const activeTabButton = document.querySelector(
        ".tab-button.active"
    );

    const budgetType = activeTabButton?.dataset.tab;

    if (
        budgetType !== "microdata" &&
        budgetType !== "erp"
    ) {
        throw new Error(
            "No se ha podido identificar la pestaña activa."
        );
    }

    return budgetType;
}

async function generateBudgetDocument(budgetData) {
    const budgetType = getActiveBudgetType();

    const templatePath =
        budgetType === "erp"
            ? "templates/presupuesto-erp.docx"
            : "templates/presupuesto-microdata.docx";

    const content = await loadDocxTemplate(templatePath);

    const zip = new PizZip(content);

    const doc = new window.docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true
    });

    doc.render(budgetData);

    const blob = doc.getZip().generate({
        type: "blob",
        mimeType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    });

    saveAs(blob, "presupuesto.docx");
}

function buildBudgetData() {
    const budgetType = getActiveBudgetType();

    if (budgetType === "erp") {
        return buildErpBudgetData();
    }

    return buildMicrodataBudgetData();
}

function buildErpBudgetData() {
  const familySelect = document.getElementById("erpFamilySelect");
  const planSelect = document.getElementById("erpPlanSelect");
  const extras = buildErpExtrasData();
  const erpExtraUsers = getErpExtraUsersData();
  const manualNotes = budgetNotes?.value?.trim() || "";
  const extraDetails = buildErpExtraDetails();
  const finalNotes = [manualNotes, extraDetails].filter(Boolean).join("\n\n");

  return {
      numPresupuesto: createBudgetNumber(),
      fecha: formatBudgetDate(new Date()),
      solucion: familySelect?.selectedOptions?.[0] ?.textContent?.trim() || "",
      plan: planSelect?.selectedOptions?.[0] ?.textContent?.trim() || "",
      precioBase: getElementText("erpBasePrice"),
      descuentoBase: formatDiscount(document.getElementById("erpBaseDiscountType")?.value || "none",document.getElementById("erpBaseDiscountValue")?.value || 0),
      precioBaseFinal: getElementText("erpBaseFinalPrice"),
      extras,
      tieneExtras: extras.length > 0,
      totalMensual: getElementText("erpTotal"),
      totalAnual: getElementText("erpAnnualTotal"),
      notasAdicionales: finalNotes,
      usuariosAdicionales: erpExtraUsers.quantity,
      costeUsuariosAdicionales: erpExtraUsers.monthlyCost
  };
}

function buildErpExtrasData() {
    const extras = [];
    document
      .querySelectorAll("#erpExtrasList .erp-extra-row")
      .forEach(row => {
        const checkbox = row.querySelector(".erp-extra-checkbox");

        if (!checkbox?.checked) {
            return;
        }

        const extraKey = row.dataset.extraKey;
        const extra = erpExtras[extraKey];
        const discountType = row.querySelector(".erp-extra-discount-type")?.value || "none";
        const discountValue = row.querySelector(".erp-extra-discount-value")?.value || 0;

        extras.push({
          nombre:
              row.querySelector(".erp-extra-description strong")?.textContent?.trim() || extra?.name || "",
          precioOriginal:
              row.querySelector(".erp-extra-original-price")?.textContent?.trim() || "",
          descuento: formatDiscount(discountType, discountValue),
          precioFinal:
              row.querySelector(".erp-extra-final-price")?.textContent?.trim() || "",
          periodicidad:
              extra?.period === "annual"
                  ? "Anual"
                  : "Mensual"
      });
    });

    const extraUsersData = getErpExtraUsersData();

    if (extraUsersData.quantity > 0) {
      const usersLabel = extraUsersData.quantity === 1 ? "1 usuario adicional" : `${extraUsersData.quantity} usuarios adicionales`;

      extras.push({
        nombre: usersLabel,
        precioOriginal: `${euros(extraUsersData.unitPrice)}/mes`,
        descuento: "",
        precioFinal: `${euros(extraUsersData.monthlyCost)}/mes`,
        periodicidad: "Mensual"
      });
    }

    return extras;
}

function buildErpExtraDetails() {
  const details = [];

  document
    .querySelectorAll("#erpExtrasList .erp-extra-row")
    .forEach(row => {
      const checkbox = row.querySelector(".erp-extra-checkbox");

      if (!checkbox?.checked) {
        return;
      }

      const extraKey = row.dataset.extraKey;
      const extra = erpExtras[extraKey];

      if (!extra) {
        return;
      }
      /*
       * Los extras fijos ya se entienden por su nombre.
       * Aquí detallamos especialmente los extras por tramos.
       */
      if (extra.type === "tier") {
        const tierSelect = row.querySelector(".erp-extra-tier-select");
        const selectedValue = Number(tierSelect?.value || 0);
        const selectedTier = extra.tiers?.find(tier => Number(tier.value) === selectedValue);

        if (!selectedTier) {
          return;
        }

        const formattedQuantity = Number(selectedTier.value).toLocaleString("es-ES");
        const tierLabel = extra.tierLabel || "";

        details.push(`${extra.name} hasta ${formattedQuantity} ${tierLabel}`.trim());
      }
    });

  const extraUsers = getErpExtraUsersData();

  if (extraUsers.quantity > 0) {
    details.push(extraUsers.quantity === 1 ? "1 usuario adicional" : `${extraUsers.quantity} usuarios adicionales`);
  }

  if (details.length === 0) {
    return "";
  }

  return [
    "Detalle de extras:",
    ...details.map(detail => `- ${detail}`)
  ].join("\n");
}

function addErpExtraLines(lineas) {
    const checkedExtras = document.querySelectorAll(
        "#erpExtrasList .erp-extra-row " +
        ".erp-extra-checkbox:checked"
    );

    checkedExtras.forEach(checkbox => {
        const row = checkbox.closest(".erp-extra-row");

        if (!row) {
            return;
        }

        const extraKey = row.dataset.extraKey;
        const extraData = erpExtras[extraKey];

        if (!extraData) {
            console.warn("No se encuentra el extra en erpExtras:", extraKey);
            return;
        }

        const extraName = row.querySelector(".erp-extra-description strong")?.textContent?.trim() || extraData.name || extraKey;
        const originalPrice = row.querySelector(".erp-extra-original-price")?.textContent?.trim() || formatErpExtraPrice(extraData);
        const discountType = row.querySelector(".erp-extra-discount-type")?.value || "none";
        const discountValue = row.querySelector(".erp-extra-discount-value")?.value || "0";
        const finalPrice = row.querySelector(".erp-extra-final-price")?.textContent?.trim() || originalPrice;
        const periodicidad = extraData.period === "annual" ? "A" : "M";

        lineas.push({
            aplicacion: extraName,
            modalidad: "S",
            licenciaImporte: "",
            licenciaDto: "",
            licenciaTotal: "",
            mantenimientoFecha: "",
            mantenimientoImporte: originalPrice,
            mantenimientoDto: formatDiscount(discountType, discountValue),
            mantenimientoTotal: finalPrice,
            periodicidad,
            cuota: finalPrice
        });
    });
}

function formatErpExtraPrice(extra) {
    if (!extra) {
        return "";
    }

    if (extra.period === "annual") {
        return `${euros(extra.price)}/año`;
    }

    return `${euros(extra.price)}/mes`;
}

function formatDiscount(type, value) {
  const number = Number(value || 0);

  if (!number || type === "none") {
    return "";
  }

  if (type === "percentage") {
    return `${number} %`;
  }

  if (type === "fixed") {
    return `${number.toFixed(2).replace(".", ",")} €`;
  }

  return "";
}

function getSelectedTierPrice(row) {
  const select = row.querySelector(".erp-extra-tier-select");

  if (!select) return "";

  const selectedOption = select.selectedOptions?.[0];

  return (
    selectedOption?.dataset.price ||
    selectedOption?.getAttribute("data-price") ||
    ""
  );
}


function getMicrodataModalityCode(billingValue, billingPeriod) {
  if (billingValue === "cloud") {
    return "C";
  }

  if (
    billingValue === "saas" ||
    billingValue === "monthly" ||
    billingPeriod === "monthly" ||
    billingPeriod === "unitMonthly"
  ) {
    return "S";
  }

  return "O";
}

function getMicrodataPeriodCodeFromPeriod(billingPeriod) {
  if (billingPeriod === "monthly" || billingPeriod === "unitMonthly") {
    return "M";
  }

  return "A";
}

function setMicrodataPreviewValue(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.textContent = value ?? "";
  }
}

function updateMicrodataBudgetPreview({
  app,
  plan,
  billing,
  quantity,
  maintenance,
  monthly,
  annual,
  main
}) {
  const billingValue = els.billingSelect?.value || "";
  const billingPeriod = billing?.period || "annual";
  const modality = getMicrodataModalityCode(billingValue, billingPeriod);
  const period = getMicrodataPeriodCodeFromPeriod(billingPeriod);
  const isMonthly = period === "M";

  const maintenanceAmount = Number(maintenance || 0);
  const annualAmount = Number(annual || 0);
  const monthlyAmount = Number(monthly || 0);
  const licenseAmount = isMonthly
    ? 0
    : Math.max(0, annualAmount - maintenanceAmount);
  const feeAmount = isMonthly
    ? (monthlyAmount || Number(main || 0))
    : 0;

  setMicrodataPreviewValue("summaryApp", app?.name || "-");
  setMicrodataPreviewValue("summaryPlan", plan || "-");
  setMicrodataPreviewValue("microdataSummaryMode", modality);
  setMicrodataPreviewValue(
    "summaryQuantity",
    Number(quantity || 0).toLocaleString("es-ES")
  );

  setMicrodataPreviewValue(
    "microdataLicenseOriginal",
    licenseAmount > 0 ? euros(licenseAmount) : ""
  );
  setMicrodataPreviewValue("microdataLicenseDiscount", "");
  setMicrodataPreviewValue(
    "microdataLicenseTotal",
    licenseAmount > 0 ? euros(licenseAmount) : "-"
  );

  setMicrodataPreviewValue(
    "microdataMaintenanceOriginal",
    maintenanceAmount > 0 ? euros(maintenanceAmount) : ""
  );
  setMicrodataPreviewValue("microdataMaintenanceDiscount", "");
  setMicrodataPreviewValue(
    "summaryMant",
    maintenanceAmount > 0 ? euros(maintenanceAmount) : "-"
  );

  setMicrodataPreviewValue("microdataPeriod", period);
  setMicrodataPreviewValue(
    "microdataFeeTotal",
    feeAmount > 0 ? euros(feeAmount) : "-"
  );

  setMicrodataPreviewValue(
    "microdataTotalLicense",
    licenseAmount > 0 ? euros(licenseAmount) : "0,00 €"
  );
  setMicrodataPreviewValue(
    "microdataTotalMaintenance",
    maintenanceAmount > 0 ? euros(maintenanceAmount) : "0,00 €"
  );
  setMicrodataPreviewValue(
    "microdataTotal",
    feeAmount > 0 ? euros(feeAmount) : "0,00 €"
  );
}

function buildMicrodataLineDetail({aplicacion, modalidad, periodicidad}) {
  const parts = [aplicacion];

  if (modalidad && modalidad !== "S") {
    parts.push(`Modalidad: ${modalidad}`);
  }

  if (periodicidad) {
    parts.push(`Periodicidad: ${periodicidad}`);
  }

  return parts.join(" · ");
}

function getSelectedOptionText(elementId) {
  const select = document.getElementById(elementId);

  if (!select || select.selectedIndex < 0) {
    return "";
  }

  return (
    select.options[select.selectedIndex]
      ?.textContent
      ?.trim() || ""
  );
}

function isElementVisible(elementId) {
  const element = document.getElementById(elementId);

  if (!element) {
    return false;
  }

  return (
    !element.classList.contains("hidden") &&
    element.offsetParent !== null
  );
}

function getPositiveNumber(elementId) {
  const element = document.getElementById(elementId);
  const value = Number(element?.value || 0);

  return Number.isFinite(value) && value > 0
    ? value
    : 0;
}

function buildMicrodataDetails() {
  const details = [];
  const application = getSelectedOptionText("appSelect");
  const plan = getSelectedOptionText("planSelect");
  const quantityLabel = document
      .getElementById("quantityLabel")
      ?.textContent
      ?.trim() || "Cantidad";
  const quantityInput = document.getElementById("quantityInput");
  const mailboxSelect = document.getElementById("selectBuzones");
  const billing = getSelectedOptionText("billingSelect");
  /*
   * Producto y plan
   */
  if (application) {
    details.push(
      plan && plan !== "-"
        ? `${application} · ${plan}`
        : application
    );
  }
  /*
   * Cantidad principal.
   *
   * Algunos productos usan quantityInput y otros selectBuzones.
   */
  let quantity = "";

  if (mailboxSelect && mailboxSelect.style.display !== "none") {
    quantity = getSelectedOptionText("selectBuzones");
  } else if (quantityInput) {
    quantity = quantityInput.value?.trim() || "";
  }

  if (quantity) {
    details.push(`${quantityLabel}: ${quantity}`);
  }
  /*
   * Periodicidad o facturación
   */
  if (billing && isElementVisible("billingField")) {
    details.push(`Facturación: ${billing}`);
  }
  /*
   * Usuarios extra generales
   */
  if (isElementVisible("extraUsersLabel")) {
    const extraUsers = getPositiveNumber("usersInput");

    if (extraUsers > 0) {
      details.push(
        extraUsers === 1
          ? "1 usuario adicional"
          : `${extraUsers} usuarios adicionales`
      );
    }
  }
  /*
   * Módulo extra principal
   */
  const addModule = document.getElementById("addModl");

  if (addModule?.checked && isElementVisible("extraMdl")) {
    const moduleLabel = document
        .getElementById("modulo")
        ?.textContent
        ?.trim() || "";

    details.push(
      moduleLabel
        ? `Módulo adicional: ${moduleLabel}`
        : "Módulo adicional incluido"
    );
  }
  /*
   * Usuarios extra de CertiF
   */
  const certifExtraCheckbox = document.getElementById("userExtra");

  if (certifExtraCheckbox?.checked && isElementVisible("usersCertiFExtra")) {
    const certifUsers = getPositiveNumber("usersCFExtra");

    if (certifUsers > 0) {
      details.push(
        certifUsers === 1
          ? "CertiF: 1 usuario adicional"
          : `CertiF: ${certifUsers} usuarios adicionales`
      );
    } else {
      details.push(
        "CertiF con usuarios adicionales"
      );
    }
  }
  /*
   * Módulo seleccionado para Gestión
   */
  if (isElementVisible("moduleGestExtra")) {
    const managementModule = getSelectedOptionText("gestModules");

    if (managementModule) {
      details.push(`Módulo de Gestión: ${managementModule}`);
    }
  }
  /*
   * Tarifa variable de Gestión Fiscal
   */
  if (isElementVisible("gestFiscal")) {
    const moduleCompanies = getPositiveNumber("empMdl");
    const directCompanies = getPositiveNumber("empDrct");
    const corporateCompanies = getPositiveNumber("empScds");

    if (moduleCompanies > 0) {
      details.push(`Fiscal · Empresas en módulos: ${moduleCompanies}`);
    }

    if (directCompanies > 0) {
      details.push(`Fiscal · Empresas en directa y simplificada: ${directCompanies}`);
    }

    if (corporateCompanies > 0) {
      details.push(`Fiscal · Empresas en sociedades: ${corporateCompanies}`);
    }
  }
  /*
   * Tarifa variable de Gestión Laboral
   */
  if (isElementVisible("gestLaboral")) {
    const companies = getPositiveNumber("porEmp");
    const workers = getPositiveNumber("porTbj");

    if (companies > 0) {
      details.push(`Laboral · Empresas: ${companies}`);
    }

    if (workers > 0) {
      details.push(`Laboral · Trabajadores: ${workers}`);
    }
  }

  return details;
}

function buildMicrodataAutomaticNotes(details) {
  if (!Array.isArray(details) || details.length === 0) {
    return "";
  }

  return [
    "Detalle de la configuración:",
    ...details.map(detail => `- ${detail}`)
  ].join("\n");
}

function formatMicrodataDiscount(type, value) {
  const safeValue = Number(value) || 0;
  if (!safeValue || type === "none") return "";
  return type === "percentage" ? `${safeValue}%` : euros(safeValue);
}

function buildMicrodataBudgetData() {
  const lineas = microdataBudgetItems.map(item => ({
    aplicacion: item.application,
    modalidad: item.mode || "O",
    licenciaImporte: item.licenseOriginal > 0 ? euros(item.licenseOriginal) : "",
    licenciaDto: formatMicrodataDiscount(item.licenseDiscountType, item.licenseDiscountValue),
    licenciaTotal: item.licenseFinal > 0 ? euros(item.licenseFinal) : "",
    mantenimientoFecha: "",
    mantenimientoImporte: item.maintenanceOriginal > 0 ? euros(item.maintenanceOriginal) : "",
    mantenimientoDto: formatMicrodataDiscount(item.maintenanceDiscountType, item.maintenanceDiscountValue),
    mantenimientoTotal: item.maintenanceFinal > 0 ? euros(item.maintenanceFinal) : "",
    periodicidad: item.period || "A",
    cuota: item.monthlyFeeFinal > 0 ? euros(item.monthlyFeeFinal) : ""
  }));

  const summary = getMicrodataBudgetSummary();

  const details = microdataBudgetItems.map(item => `${item.application} · ${item.plan} · ${item.detail || item.billingLabel}`);
  const manualNotes = document.getElementById("microdataBudgetNotes")?.value?.trim() || "";
  const automaticNotes = buildMicrodataAutomaticNotes(details);
  const finalNotes = [manualNotes, automaticNotes].filter(Boolean).join("\n\n");

  return {
    numPresupuesto: createBudgetNumber(),
    fecha: formatBudgetDate(new Date()),
    solucion: summary.solutionLabel,
    plan: summary.planLabel,
    precioBase: euros(summary.initialOriginal),
    descuentoBase: summary.discountLabel,
    precioBaseFinal: euros(summary.initialFinal),
    extras: summary.addonItems.map(item => ({
      nombre: item.application,
      precioFinal: item.period === "M"
        ? `${euros(item.monthlyFeeFinal)}/mes`
        : euros(
            (Number(item.licenseFinal) || 0) +
            (Number(item.maintenanceFinal) || 0) +
            (Number(item.monthlyFeeFinal) || 0)
          )
    })),
    tieneExtras: summary.addonItems.length > 0,
    totalMensual: euros(summary.monthlyFeeFinal),
    totalAnual: euros(summary.annualEquivalent),
    lineas,
    totalLicencia: euros(summary.licenseFinal),
    totalMantenimiento: euros(summary.maintenanceFinal),
    totalCuota: euros(summary.monthlyFeeFinal + summary.annualFeeFinal),
    notas: finalNotes,
    notasAdicionales: finalNotes,
    detalles: details,
    infoServicios: lineas.map(line => line.aplicacion).filter(Boolean).join("\n")
  };
}

function loadDocxTemplate(url) {
  return new Promise((resolve, reject) => {
    PizZipUtils.getBinaryContent(
      url,
      (error, content) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(content);
      }
    );
  });
}

async function saveBudgetRecord(budgetData) {
    if (!currentSession?.token) {
        throw new Error("Debes iniciar sesión para guardar un presupuesto.");
    }
    await fetch(APPS_SCRIPT_URL,{
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type":
                    "text/plain;charset=utf-8"
            },
            body: JSON.stringify({
                action: "create",
                token: currentSession.token,
                data: budgetData
            })
        }
    );
    console.log("Presupuesto enviado a Apps Script.");
}

function createBudgetNumber() {
  const now = new Date();

  const year = now.getFullYear();

  const month = String(
    now.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    now.getDate()
  ).padStart(2, "0");

  const hours = String(
    now.getHours()
  ).padStart(2, "0");

  const minutes = String(
    now.getMinutes()
  ).padStart(2, "0");

  return `${year}${month}${day}-${hours}${minutes}`;
}

function getDocxErrorMessage(error) {
  const errors = error?.properties?.errors;

  if (Array.isArray(errors)) {
    const details = errors
      .map(item => {
        return (
          item.properties?.explanation ||
          item.message
        );
      })
      .filter(Boolean)
      .join("\n");

    if (details) {
      return (
        "La plantilla contiene etiquetas incorrectas:\n\n" +
        details
      );
    }
  }

  return (
    "No se pudo generar el presupuesto. " +
    "Revisa la consola del navegador."
  );
}

let applicationInitialized = false;

async function initializeApplicationData() {
  if (applicationInitialized) {
    return;
  }

  try {
    await loadApplicationCatalog();

    init();
    initErp();
    applicationInitialized = true;
  } catch (error) {
    console.error("No se ha podido cargar el catálogo:", error);
    setAccessMessage(loginMessage, "La sesión es correcta, pero no se pudo cargar el catálogo.", "error");
    clearLocalSession();
    throw error;
  }
}

async function startApplication() {
    const hasSession = restoreSession();

    if (!hasSession) {
        showLogin();
        return;
    }

    try {
        await initializeApplicationData();
        showApplication();

    } catch (error) {
        console.error(error);
        clearLocalSession();
    }
}


/* ==================================================
   PORTAL COMERCIAL
================================================== */
const dashboardSection = document.getElementById("dashboardView");
const statisticsSection = document.getElementById("statisticsView");
const adminSection = document.getElementById("adminView");
const showDashboardButton = document.getElementById("showDashboardButton");
const showStatisticsButton = document.getElementById("showStatisticsButton");
const showAdminButton = document.getElementById("showAdminButton");
const portalSections = [dashboardSection, calculatorSection, historySection, statisticsSection, adminSection];
const portalNavigationButtons = [showDashboardButton, showCalculatorButton, showHistoryButton, showStatisticsButton, showAdminButton];
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
  if (viewName === "admin") await loadAdmin(Boolean(options.force));
}

// Sustituimos la navegación anterior manteniendo sus funciones públicas.
showCalculatorButton.removeEventListener("click", showCalculator);
showHistoryButton.removeEventListener("click", showHistory);
showDashboardButton.addEventListener("click", () => openPortalView("dashboard"));
showCalculatorButton.addEventListener("click", () => openPortalView("calculator"));
showHistoryButton.addEventListener("click", () => openPortalView("history"));
showStatisticsButton.addEventListener("click", () => openPortalView("statistics"));
showAdminButton.addEventListener("click", () => openPortalView("admin"));
document.getElementById("dashboardNewBudgetButton").addEventListener("click", () => openPortalView("calculator"));
document.getElementById("dashboardOpenHistoryButton").addEventListener("click", () => openPortalView("history"));
document.getElementById("refreshDashboardButton").addEventListener("click", () => loadDashboard(true));
document.getElementById("refreshStatisticsButton").addEventListener("click", () => loadStatistics(true));
document.getElementById("statisticsPeriodFilter").addEventListener("change", () => loadStatistics(false));
document.getElementById("refreshAdminButton").addEventListener("click", () => loadAdmin(true));
document.getElementById("clearCatalogCacheButton").addEventListener("click", clearCatalogCacheFromPortal);

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

startApplication();
