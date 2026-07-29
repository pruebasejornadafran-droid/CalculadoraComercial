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

