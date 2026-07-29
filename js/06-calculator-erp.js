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

