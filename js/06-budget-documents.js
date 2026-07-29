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

