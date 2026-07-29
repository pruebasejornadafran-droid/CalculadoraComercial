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

    return ApiClient.post(action, {
        token: currentSession.token,
        ...parameters
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
    const response = await ApiClient.post("budget.updateStatus", {
        token: currentSession.token,
        id,
        estado
    });

    if (!response?.success) {
        throw new Error(response?.message || "No se ha podido actualizar el estado.");
    }
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
// El listener se registra aqui porque loadBudgetHistory ya esta definido.
refreshHistoryButton.addEventListener("click", loadBudgetHistory);
