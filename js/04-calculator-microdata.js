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

