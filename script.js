const apps = {
  ejornada: {
    name: "eJornada",
    quantityLabel: "Nº de trabajadores",
    mode: "closestBand",
    billingLabel: "Precio de tabla",
    plans: ["Standard", "Professional"],
    tiers: [
      { workers: 5, Standard: 195.00, Professional: 255.00 },
      { workers: 10, Standard: 240.00, Professional: 315.00 },
      { workers: 15, Standard: 288.00, Professional: 378.00 },
      { workers: 20, Standard: 336.00, Professional: 441.00 },
      { workers: 25, Standard: 384.00, Professional: 504.00 },
      { workers: 30, Standard: 408.00, Professional: 535.50 },
      { workers: 35, Standard: 432.00, Professional: 567.00 },
      { workers: 40, Standard: 456.00, Professional: 598.50 },
      { workers: 45, Standard: 480.00, Professional: 630.00 },
      { workers: 50, Standard: 504.00, Professional: 660.00 },
      { workers: 60, Standard: 604.80, Professional: 792.00 },
      { workers: 70, Standard: 705.60, Professional: 924.00 },
      { workers: 80, Standard: 806.40, Professional: 1056.00 },
      { workers: 90, Standard: 810.00, Professional: 1080.00 },
      { workers: 100, Standard: 900.00, Professional: 1200.00 },
      { workers: 200, Standard: 1680.00, Professional: 2160.00 },
      { workers: 500, Standard: 3900.00, Professional: 5100.00 },
      { workers: 700, Standard: 5040.00, Professional: 6720.00 },
      { workers: 1000, Standard: 6000.00, Professional: 9000.00 }
    ]
  },
  efirma: {
    name: "efirmaGO",
    quantityLabel: "Nº de documentos al año",
    mode: "capacityPlan",
    plans: ["Personal", "Professional", "Business", "Business Plus", "Concertada"],
    tiers: [
      { plan: "Personal", docsYear: 60, users: 1, smsYear: 24, monthly: 10.80, annual: 108 },
      { plan: "Professional", docsYear: 360, users: 3, smsYear: 36, monthly: 22.80, annual: 228 },
      { plan: "Business", docsYear: 1200, users: 5, smsYear: 120, monthly: 34.80, annual: 348 },
      { plan: "Business Plus", docsYear: 3000, users: 8, smsYear: 300, monthly: 68.40, annual: 684 },
      { plan: "Concertada", docsYear: 5000, users: 10, smsYear: 500, monthly: 91.20, annual: 912 },
      { plan: "Concertada", docsYear: 12500, users: 10, smsYear: 1250, monthly: 218.40, annual: 2184 },
      { plan: "Concertada", docsYear: 25000, users: 10, smsYear: 2500, monthly: 414.00, annual: 4140 },
      { plan: "Concertada", docsYear: 50000, users: 30, smsYear: 5000, monthly: 792.00, annual: 7920 },
      { plan: "Concertada", docsYear: 100000, users: 30, smsYear: 10000, monthly: 1500.00, annual: 15000 }
    ]
  }
};

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
  summaryApp: document.getElementById("summaryApp"),
  summaryPlan: document.getElementById("summaryPlan"),
  summaryQuantityLabel: document.getElementById("summaryQuantityLabel"),
  summaryQuantity: document.getElementById("summaryQuantity"),
  summaryMonthly: document.getElementById("summaryMonthly"),
  summaryAnnual: document.getElementById("summaryAnnual"),
  copyButton: document.getElementById("copyButton")
};

function euros(value) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(value || 0);
}

function init() {
  Object.entries(apps).forEach(([key, app]) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = app.name;
    els.appSelect.appendChild(option);
  });

  els.appSelect.addEventListener("change", () => {
    refreshPlans();
    calculate();
  });
  els.planSelect.addEventListener("change", calculate);
  els.quantityInput.addEventListener("input", calculate);
  els.billingSelect.addEventListener("change", calculate);
  els.copyButton.addEventListener("click", copySummary);

  refreshPlans();
  calculate();
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

  els.quantityLabel.textContent = app.quantityLabel;
  els.summaryQuantityLabel.textContent = app.quantityLabel;
  els.billingField.style.display = app.mode === "capacityPlan" ? "block" : "none";
  els.quantityInput.value = app.mode === "capacityPlan" ? 360 : 50;
}

function calculate() {
  const appKey = els.appSelect.value;
  const app = apps[appKey];
  const plan = els.planSelect.value;
  const quantity = Math.max(1, Number(els.quantityInput.value || 1));
  let monthly = 0;
  let annual = 0;
  let main = 0;
  let subtitle = "";
  let notice = "";

  if (app.mode === "closestBand") {
    const tier = app.tiers.find(t => quantity <= t.workers) || app.tiers[app.tiers.length - 1];
    annual = tier[plan];
    monthly = annual / 12;
    main = annual;
    subtitle = `Tarifa ${plan} hasta ${tier.workers} trabajadores.`;
    notice = quantity > tier.workers
      ? `La tabla llega hasta ${tier.workers} trabajadores. Revisa manualmente importes superiores.`
      : `Se ha usado el tramo de ${tier.workers} trabajadores.`;
  }

  if (app.mode === "capacityPlan") {
    let candidates = app.tiers.filter(t => t.plan === plan && quantity <= t.docsYear);
    let tier = candidates[0] || app.tiers.filter(t => t.plan === plan).slice(-1)[0];
    monthly = tier.monthly;
    annual = tier.annual;
    main = els.billingSelect.value === "monthly" ? monthly : annual;
    subtitle = `${tier.docsYear.toLocaleString("es-ES")} documentos/año · ${tier.users} usuarios · ${tier.smsYear.toLocaleString("es-ES")} SMS/año.`;
    notice = quantity > tier.docsYear
      ? `El plan seleccionado no cubre ${quantity.toLocaleString("es-ES")} documentos/año. Revisa una tarifa superior o personalizada.`
      : `Se ha seleccionado la capacidad mínima que cubre ${quantity.toLocaleString("es-ES")} documentos/año.`;
  }

  els.noticeBox.textContent = notice;
  els.noticeBox.classList.toggle("visible", Boolean(notice));
  els.mainResult.textContent = euros(main);
  els.resultSubtitle.textContent = subtitle;
  els.summaryApp.textContent = app.name;
  els.summaryPlan.textContent = plan;
  els.summaryQuantity.textContent = quantity.toLocaleString("es-ES");
  els.summaryMonthly.textContent = euros(monthly);
  els.summaryAnnual.textContent = euros(annual);
}

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

init();
