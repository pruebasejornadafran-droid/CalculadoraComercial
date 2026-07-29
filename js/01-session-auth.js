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

