/* ==================================================
   PRESUPUESTO MICRODATA
================================================== */

let microdataBudgetItems = [];

let microdataEditingItemId = null;
let microdataOpenItemId = null;
let currentMicrodataPreview = null;

let apps = {
  ejornada: {
    name: "ejornada",
    quantityLabel: "Nº de trabajadores",
    mode: "workersNumber",
    tierKey: "workers",
    tierLabel: "trabajadores",
    billingOptions: [
      { value: "annual", label: "Precio anual", field: "annual", period: "annual" }
    ],
    plans: ["Módulo Fichajes", "Fichajes + Ausencias", "Módulo Fichajes Mensual", "Fichajes + Ausencias Mensual"],
    tiers: [
      { workers: 5, "Módulo Fichajes": 195.00, "Fichajes + Ausencias": 255.00, "Módulo Fichajes Mensual": 19.00, "Fichajes + Ausencias Mensual": 24.00, workerExtraF: 0.00, workerExtraFA: 0.00 },
      { workers: 10, "Módulo Fichajes": 240.00, "Fichajes + Ausencias": 315.00, "Módulo Fichajes Mensual": 22.00, "Fichajes + Ausencias Mensual": 29.00, workerExtraF: 0.00, workerExtraFA: 0.00 },
      { workers: 15, "Módulo Fichajes": 288.00, "Fichajes + Ausencias": 378.00, "Módulo Fichajes Mensual": 27.00, "Fichajes + Ausencias Mensual": 35.00, workerExtraF: 0.00, workerExtraFA: 0.00 },
      { workers: 20, "Módulo Fichajes": 336.00, "Fichajes + Ausencias": 441.00, "Módulo Fichajes Mensual": 31.00, "Fichajes + Ausencias Mensual": 41.00, workerExtraF: 0.00, workerExtraFA: 0.00 },
      { workers: 25, "Módulo Fichajes": 384.00, "Fichajes + Ausencias": 504.00, "Módulo Fichajes Mensual": 36.00, "Fichajes + Ausencias Mensual": 46.00, workerExtraF: 0.00, workerExtraFA: 0.00 },
      { workers: 30, "Módulo Fichajes": 408.00, "Fichajes + Ausencias": 535.50, "Módulo Fichajes Mensual": 38.00, "Fichajes + Ausencias Mensual": 49.00, workerExtraF: 0.00, workerExtraFA: 0.00 },
      { workers: 35, "Módulo Fichajes": 432.00, "Fichajes + Ausencias": 567.00, "Módulo Fichajes Mensual": 40.00, "Fichajes + Ausencias Mensual": 52.00, workerExtraF: 0.00, workerExtraFA: 0.00 },
      { workers: 40, "Módulo Fichajes": 456.00, "Fichajes + Ausencias": 598.50, "Módulo Fichajes Mensual": 42.00, "Fichajes + Ausencias Mensual": 55.00, workerExtraF: 0.00, workerExtraFA: 0.00 },
      { workers: 45, "Módulo Fichajes": 480.00, "Fichajes + Ausencias": 630.00, "Módulo Fichajes Mensual": 44.00, "Fichajes + Ausencias Mensual": 58.00, workerExtraF: 0.00, workerExtraFA: 0.00 },
      { workers: 50, "Módulo Fichajes": 504.00, "Fichajes + Ausencias": 660.00, "Módulo Fichajes Mensual": 46.00, "Fichajes + Ausencias Mensual": 61.00, workerExtraF: 0.00, workerExtraFA: 0.00 },
      { workers: 60, "Módulo Fichajes": 604.80, "Fichajes + Ausencias": 792.00, "Módulo Fichajes Mensual": 0.00, "Fichajes + Ausencias Mensual": 0.00, workerExtraF: 0.00, workerExtraFA: 0.00 },
      { workers: 70, "Módulo Fichajes": 705.60, "Fichajes + Ausencias": 924.00, "Módulo Fichajes Mensual": 0.00, "Fichajes + Ausencias Mensual": 0.00, workerExtraF: 0.00, workerExtraFA: 0.00 },
      { workers: 80, "Módulo Fichajes": 806.40, "Fichajes + Ausencias": 1056.00, "Módulo Fichajes Mensual": 0.00, "Fichajes + Ausencias Mensual": 0.00, workerExtraF: 0.00, workerExtraFA: 0.00 },
      { workers: 90, "Módulo Fichajes": 810.00, "Fichajes + Ausencias": 1080.00, "Módulo Fichajes Mensual": 0.00, "Fichajes + Ausencias Mensual": 0.00, workerExtraF: 0.00, workerExtraFA: 0.00 },
      { workers: 100, "Módulo Fichajes": 900.00, "Fichajes + Ausencias": 1200.00, "Módulo Fichajes Mensual": 0.00, "Fichajes + Ausencias Mensual": 0.00, workerExtraF: 9.00, workerExtraFA: 12.00 },
      { workers: 200, "Módulo Fichajes": 1680.00, "Fichajes + Ausencias": 2160.00, "Módulo Fichajes Mensual": 0.00, "Fichajes + Ausencias Mensual": 0.00, workerExtraF: 8.40, workerExtraFA: 10.80 },
      { workers: 500, "Módulo Fichajes": 3900.00, "Fichajes + Ausencias": 5100.00, "Módulo Fichajes Mensual": 0.00, "Fichajes + Ausencias Mensual": 0.00, workerExtraF: 7.80, workerExtraFA: 10.20 },
      { workers: 700, "Módulo Fichajes": 5040.00, "Fichajes + Ausencias": 6720.00, "Módulo Fichajes Mensual": 0.00, "Fichajes + Ausencias Mensual": 0.00, workerExtraF: 7.20, workerExtraFA: 9.60 },
      { workers: 1000, "Módulo Fichajes": 6000.00, "Fichajes + Ausencias": 9000.00, "Módulo Fichajes Mensual": 0.00, "Fichajes + Ausencias Mensual": 0.00, workerExtraF: 6.00, workerExtraFA: 9.00 }
    ]
  },

  msnotifica: {
    name: "MsNotifica",
    quantityLabel: "Nº de buzones",
    mode: "msnotifica",
    tierKey: "mailboxes",
    tierLabel: "buzones",
    billingOptions: [
      { value: "compra", label: "Compra" },
      { value: "saas", label: "SaaS" },
      { value: "cloud", label: "Cloud" }
    ],
    plans: ["Tarifa"],
    tiers: [
      { mailboxes: 50, price: 518, maintenance: 441, userExtra: 66, saas: 40, mailboxExtra: 0.24 },
      { mailboxes: 100, price: 842, maintenance: 537, userExtra: 80, saas: 50, mailboxExtra: 0.24 },
      { mailboxes: 250, price: 842, maintenance: 1017, userExtra: 150, saas: 90, mailboxExtra: 0.24 },
      { mailboxes: 500, price: 842, maintenance: 1377, userExtra: 191, saas: 120, mailboxExtra: 0.24 }
    ]
  },

  efirma: {
    name: "efirma GO",
    quantityLabel: "Nº de documentos al año",
    mode: "capacityPlan",
    billingOptions: [
      { value: "annual", label: "Anual", field: "annual", period: "annual" },
      { value: "monthly", label: "Mensual", field: "monthly", period: "monthly" }
    ],
    plans: ["Personal", "Professional", "Business", "Business Plus", "Concertada"],
    tiers: [
      { plan: "Personal", docsYear: 60, users: 1, smsYear: 24, monthly: 10.80, annual: 108.00, extraDocs: 0.0, userExtra: 108.00 },
      { plan: "Professional", docsYear: 360, users: 3, smsYear: 36, monthly: 22.80, annual: 228.00, extraDocs: 0.0, userExtra: 108.00 },
      { plan: "Business", docsYear: 1200, users: 5, smsYear: 120, monthly: 34.80, annual: 348.00, extraDocs: 0.0, userExtra: 108.00 },
      { plan: "Business Plus", docsYear: 3000, users: 8, smsYear: 300, monthly: 68.40, annual: 684.00, extraDocs: 0.0, userExtra: 108.00 },
      { plan: "Concertada", docsYear: 5000, users: 10, smsYear: 500, monthly: 91.20, annual: 912.00, extraDocs: 0.1824, userExtra: 108.00 },
      { plan: "Concertada", docsYear: 12500, users: 10, smsYear: 1250, monthly: 218.40, annual: 2184.00, extraDocs: 0.1747, userExtra: 108.00 },
      { plan: "Concertada", docsYear: 25000, users: 10, smsYear: 2500, monthly: 414.00, annual: 4140.00, extraDocs: 0.1656, userExtra: 108.00 },
      { plan: "Concertada", docsYear: 50000, users: 30, smsYear: 5000, monthly: 792.00, annual: 7920.00, extraDocs: 0.1584, userExtra: 108.00 },
      { plan: "Concertada", docsYear: 100000, users: 30, smsYear: 10000, monthly: 1500.00, annual: 15000.00, extraDocs: 0.15, userExtra: 108.00}
    ]
  },

  efirma_msnomina: {
    name: "efirma GO para MsNómina",
    quantityLabel: "Nº de trabajadores",
    mode: "rangeBand",
    plans: ["Coste anual"],
    billingOptions: [
      { value: "annual", label: "Coste anual", field: "annual", period: "annual" },
      { value: "monthly", label: "Coste trabajador/mes", field: "workerMonth", period: "unitMonthly" }
    ],
    tiers: [
      { min: 1, max: 10, workerMonth: 0.617, annual: 88.00 },
      { min: 11, max: 25, workerMonth: 0.470, annual: 155.00 },
      { min: 26, max: 50, workerMonth: 0.355, annual: 227.00 },
      { min: 51, max: 100, workerMonth: 0.241, annual: 303.00 },
      { min: 101, max: 250, workerMonth: 0.170, annual: 524.00 },
      { min: 251, max: 500, workerMonth: 0.146, annual: 891.00 },
      { min: 501, max: 1000, workerMonth: 0.089, annual: 1080.00 },
      { min: 1001, max: 2000, workerMonth: 0.075, annual: 1823.00 }
    ]
  },

  certifacil: {
    name: "Certifácil",
    quantityLabel: "Cantidad",
    mode: "catalog",
    plans: ["Activación licencia"],
    billingOptions: [{ value: "price", label: "Compra", field: "price", period: "annual" }],
    items: [
      { plan: "Activación licencia", price: 50.00, userExtra: 5.00 }
    ]
  },

  msnomina: {
    name: "MsNómina",
    quantityLabel: "Cantidad",
    mode: "catalog",
    plans: ["MsNomina PYME", "MsNomina PYME +", "MsNomina hasta 100 trab", "MsNomina", "MsNomina + S.E.A.", "MsNomina solo S.E.A.", "MsNomina gran empresa", "Informes Avanzados de MsNómina"],
    billingOptions: [
      { value: "price", label: "Compra", field: "price", period: "annual" },
      { value: "saas", label: "SaaS 4 usuarios", field: "saas", period: "monthly" }
    ],
    items: [
      { plan: "MsNomina PYME", price: 99.00, maintenance: 419.00 },
      { plan: "MsNomina PYME +", price: 99.00, maintenance: 630.00 },
      { plan: "MsNomina hasta 100 trab", price: 912.00, maintenance: 931.00, userExtra: 175.00, saas: 83.00 },
      { plan: "MsNomina", price: 1392.00, maintenance: 1211.00, userExtra: 227.00, saas: 110.00 },
      { plan: "MsNomina + S.E.A.", price: 1536.00, maintenance: 1434.00, userExtra: 269.00, saas: 129.00 },
      { plan: "MsNomina solo S.E.A.", price: 768.00, maintenance: 734.00, userExtra: 138.00, saas: 66.00 },
      { plan: "MsNomina gran empresa", price: 1872.00, maintenance: 1821.00, saas: 163.00 },
      { plan: "Informes Avanzados de MsNómina", maintenance: 94.00 }
    ]
  },

  mscontrata: {
    name: "MsContrata",
    quantityLabel: "Cantidad",
    mode: "catalog",
    plans: ["Con MsNómina + SEA y Empresas", "Asesor Nóminas 100 y MsNomina", "PYME y Tarifa pago por uso variable"],
    billingOptions: [{ value: "maintenance", label: "Mant. 4 usuarios", field: "maintenance", period: "annual" }],
    items: [
      { plan: "Con MsNómina + SEA y Empresas", maintenance: 304.00 },
      { plan: "Asesor Nóminas 100 y MsNomina", maintenance: 172.00 },
      { plan: "PYME y Tarifa pago por uso variable", maintenance: 118.00 }
    ]
  },

  msgest: {
    name: "MsGest",
    quantityLabel: "Nº de licencias",
    mode: "msgest",
    tierKey: "licenses",
    tierLabel: "licencias",
    billingOptions: [
      { value: "price", label: "MsGest", field: "price", period: "annual" },
      { value: "maintenanceMsConta", label: "MsGest + MsConta", field: "maintenanceMsConta", period: "annual" },
      { value: "saas", label: "SaaS", field: "saas", period: "monthly" },
      { value: "saasMsConta", label: "SaaS con MsConta", field: "saasMsConta", period: "monthly" }
    ],
    plans: ["Tarifa"],
    tiers: [
      { licenses: 1, Tarifa: 400.00, price: 400.00, maintenance: 512.00, maintenanceMsConta: 635.00, saas: 45.00, saasMsConta: 55.00 },
      { licenses: 2, Tarifa: 760.00, price: 760.00, maintenance: 726.00, maintenanceMsConta: 832.00, saas: 65.00, saasMsConta: 74.00 },
      { licenses: 3, Tarifa: 1084.00, price: 1084.00, maintenance: 823.00, maintenanceMsConta: 929.00, saas: 75.00, saasMsConta: 84.00 },
      { licenses: 4, Tarifa: 1376.00, price: 1376.00, maintenance: 921.00, maintenanceMsConta: 1038.00, saas: 85.00, saasMsConta: 95.00 },
      { licenses: 5, Tarifa: 1638.00, price: 1638.00, maintenance: 1021.00, maintenanceMsConta: 1160.00, saas: 95.00, saasMsConta: 107.00 },
      { licenses: 6, Tarifa: 1874.00, price: 1874.00, maintenance: 1120.00, maintenanceMsConta: 1298.00, saas: 105.00, saasMsConta: 120.00 },
      { licenses: 7, Tarifa: 2087.00, price: 2087.00, maintenance: 1218.00, maintenanceMsConta: 1456.00, saas: 115.00, saasMsConta: 134.00 },
      { licenses: 8, Tarifa: 2278.00, price: 2278.00, maintenance: 1317.00, maintenanceMsConta: 1632.00, saas: 124.00, saasMsConta: 150.00 },
      { licenses: 9, Tarifa: 2450.00, price: 2450.00, maintenance: 1415.00, maintenanceMsConta: 1836.00, saas: 133.00, saasMsConta: 168.00 },
      { licenses: 10, Tarifa: 2605.00, price: 2605.00, maintenance: 1515.00, maintenanceMsConta: 2064.00, saas: 143.00, saasMsConta: 188.00 }
    ]
  },

  msgest_soluziona: {
    name: "MsGest Soluziona Básico",
    quantityLabel: "Cantidad",
    mode: "catalog",
    plans: ["MsGest Soluziona Básico", "MsGest Sect. + Tesorería", "MsGest Sect. + MsConta", "Módulo Liquidaciones Fiscales"],
    billingOptions: [
      { value: "price", label: "Anual", field: "price", period: "annual" },
      { value: "saas", label: "SaaS 1 usuario", field: "saas", period: "monthly" }
    ],
    items: [
      { plan: "MsGest Soluziona Básico", price: 90.00, maintenance: 198.00, saas: 17.00 },
      { plan: "MsGest Sect. + Tesorería", price: 340.00, maintenance: 316.00, saas: 28.00 },
      { plan: "MsGest Sect. + MsConta", price: 580.00, maintenance: 397.00, saas: 37.00 },
      { plan: "Módulo Liquidaciones Fiscales", price: 180.00, maintenance: 141.00, saas: 13.00 }
    ]
  },

  msgest_modulos: {
    name: "Módulos Activables MsGest",
    quantityLabel: "Cantidad",
    mode: "modules",
    tierKey: "plan",
    plans: ["Obras", "Trazabilidad", "Fabricación", "Tallas y Colores", "Medidas", "Series", "Envases Avanzado", "TPV", "Partes de Trabajo"],
    billingOptions: [
      { value: "price", label: "Anual", field: "price", period: "annual" },
      { value: "saas", label: "SaaS", field: "saas", period: "monthly" }
    ],
    tiers: [
      { plan: "Obras", price: 450.00, maintenance: 55.00, saas: 7.00 },
      { plan: "Trazabilidad", price: 450.00, maintenance: 55.00, saas: 7.00 },
      { plan: "Fabricación", price: 450.00, maintenance: 55.00, saas: 7.00 },
      { plan: "Tallas y Colores", price: 300.00, maintenance: 37.00, saas: 5.00 },
      { plan: "Medidas", price: 300.00, maintenance: 37.00, saas: 5.00 },
      { plan: "Series", price: 250.00, maintenance: 31.00, saas: 4.00 },
      { plan: "Envases Avanzado", price: 250.00, maintenance: 31.00, saas: 4.00 },
      { plan: "TPV", price: 350.00, maintenance: 42.00, saas: 6.00 },
      { plan: "Partes de Trabajo", price: 300.00, maintenance: 37.00, saas: 5.00 }
    ]
  },

  msconta: {
    name: "MsConta",
    quantityLabel: "Cantidad",
    mode: "catalog",
    plans: ["MSregistro (Mseos)", "MSconta", "MSconta + Mspci", "Msconta + Mseos + Mspci Asesor", "Módulo Análisis de Balances", "MsSII"],
    billingOptions: [
      { value: "price", label: "Compra", field: "price", period: "annual" },
      { value: "maintenance", label: "Mant. 5 usuarios", field: "maintenance", period: "annual" },
      { value: "saas", label: "SaaS 5 usuarios", field: "saas", period: "monthly" }
    ],
    items: [
      { plan: "MSregistro (Mseos)", price: 324.00, maintenance: 327.00, userExtra: 49.00, saas: 29.00 },
      { plan: "MSconta", price: 540.00, maintenance: 360.00, userExtra: 54.00, saas: 33.00 },
      { plan: "MSconta + Mspci", price: 648.00, maintenance: 501.00, userExtra: 75.00, saas: 46.00 },
      { plan: "Msconta + Mseos + Mspci Asesor", price: 888.00, maintenance: 997.00, userExtra: 150.00, saas: 89.00 },
      { plan: "Módulo Análisis de Balances", maintenance: 161.00 },
      { plan: "MsSII", price: 324.00, maintenance: 452.00, saas: 40.00 }
    ]
  },

  msmodelos: {
    name: "MsModelos",
    quantityLabel: "Cantidad",
    mode: "catalog",
    plans: ["MsModelos", "MsModelos + Imp Soc. + Ctas Anuales", "Impuesto Soc. + Ctas. Anuales"],
    billingOptions: [
      { value: "price", label: "Compra", field: "price", period: "annual" },
      { value: "maintenance", label: "Mant. 5 usuarios", field: "maintenance", period: "annual" },
      { value: "saas", label: "SaaS 5 usuarios", field: "saas", period: "monthly" }
    ],
    items: [
      { plan: "MsModelos", price: 420.00, maintenance: 431.00, userExtra: 65.00, saas: 39.00 },
      { plan: "MsModelos + Imp Soc. + Ctas Anuales", price: 900.00, maintenance: 778.00, userExtra: 117.00, saas: 70.00 },
      { plan: "Impuesto Soc. + Ctas. Anuales", price: 660.00, maintenance: 607.00, userExtra: 91.00, saas: 55.00 }
    ]
  },

  paquete_fiscal: {
    name: "Paquete Fiscal",
    quantityLabel: "Cantidad",
    mode: "catalog",
    plans: ["Mseos + Msmod + Mspci", "Paquete Fiscal Empresa Sin Sociedades", "Paquete Fiscal Empresa", "Paquete Fiscal 10 Sociedades", "Paquete Fiscal 30 Sociedades", "Paquete Fiscal 60 Sociedades", "Paquete Fiscal Ilimitado"],
    billingOptions: [
      { value: "price", label: "Compra", field: "price", period: "annual" },
      { value: "maintenance", label: "Mant. 5 usuarios", field: "maintenance", period: "annual" },
      { value: "saas", label: "SaaS 5 usuarios", field: "saas", period: "monthly" }
    ],
    items: [
      { plan: "Mseos + Msmod + Mspci", price: 1038.00, maintenance: 618.00, userExtra: 93.00, saas: 58.00 },
      { plan: "Paquete Fiscal Empresa Sin Sociedades", price: 864.00, maintenance: 655.00, userExtra: 98.00, saas: 60.00 },
      { plan: "Paquete Fiscal Empresa", price: 864.00, maintenance: 797.00, userExtra: 120.00, saas: 72.00 },
      { plan: "Paquete Fiscal 10 Sociedades", price: 1308.00, maintenance: 898.00, userExtra: 135.00, saas: 83.00 },
      { plan: "Paquete Fiscal 30 Sociedades", price: 1536.00, maintenance: 1327.00, userExtra: 199.00, saas: 120.00 },
      { plan: "Paquete Fiscal 60 Sociedades", price: 1536.00, maintenance: 1536.00, userExtra: 230.00, saas: 138.00 },
      { plan: "Paquete Fiscal Ilimitado", price: 1788.00, maintenance: 1929.00, userExtra: 289.00, saas: 172.00 }
    ]
  },

  msrenta: {
    name: "MsRenta",
    quantityLabel: "Cantidad",
    mode: "catalog",
    plans: ["MsRenta Multi"],
    billingOptions: [{ value: "price", label: "Compra", field: "price", period: "annual" } ],
    items: [{ plan: "MsRenta Multi", price: 740.00, maintenance: 584.00 }]
  },

  msscan_ocr: {
    name: "MsScan OCR",
    quantityLabel: "Nº de documentos",
    mode: "closestBand",
    tierKey: "documents",
    tierLabel: "documentos",
    billingOptions: [
      { value: "perDoc", label: "Importe por documento", field: "perDoc", period: "unit" }
    ],
    plans: ["Tarifa"],
    tiers: [
      { documents: 5000, Tarifa: 450.00, perDoc: 0.09, maintenance: 450.00 },
      { documents: 10000, Tarifa: 900.00, perDoc: 0.09, maintenance: 900.00 },
      { documents: 15000, Tarifa: 1350.00, perDoc: 0.09, maintenance: 1350.00 },
      { documents: 20000, Tarifa: 1400.00, perDoc: 0.07, maintenance: 1400.00 },
      { documents: 30000, Tarifa: 2100.00, perDoc: 0.07, maintenance: 2100.00 },
      { documents: 40000, Tarifa: 2400.00, perDoc: 0.06, maintenance: 2400.00 },
      { documents: 50000, Tarifa: 2500.00, perDoc: 0.05, maintenance: 2500.00 },
      { documents: 60000, Tarifa: 3000.00, perDoc: 0.05, maintenance: 3000.00 },
      { documents: 70000, Tarifa: 3500.00, perDoc: 0.05, maintenance: 3500.00 },
      { documents: Infinity, label: "Ilimitada", Tarifa: 3900.00, maintenance: 3900.00 }
    ]
  },

  msbabelia: {
    name: "MsBabelia",
    quantityLabel: "Nº de documentos",
    mode: "closestBand",
    tierKey: "documents",
    tierLabel: "documentos",
    billingOptions: [
      { value: "amount", label: "Importe", field: "amount", period: "annual" },
      { value: "maintenance", label: "Mantenimiento por documento", field: "maintenance", period: "unit" }
    ],
    plans: ["Tarifa"],
    tiers: [
      { documents: 10000, Tarifa: 500.00, maintenance: 0.050, amount: 500.00 },
      { documents: 25000, Tarifa: 675.00, maintenance: 0.045, amount: 675.00 },
      { documents: 40000, Tarifa: 600.00, maintenance: 0.040, amount: 600.00 },
      { documents: 50000, Tarifa: 350.00, maintenance: 0.035, amount: 350.00 }
    ]
  },

  pago_uso_fiscal: {
    name: "Tarifa pago por uso — Gestión Fiscal",
    quantityLabel: "Nº de empresas",
    tierKey: "plan",
    mode: "catalog",
    plans: ["Emp. Módulos", "Emp. Direct. N. y Simpl", "Empresa Sociedades"],
    billingOptions: [{ value: "annual", label: "Precio anual", field: "annual", period: "annual" }],
    items: [
      { plan: "Emp. Módulos", annual: 12.00 },
      { plan: "Emp. Direct. N. y Simpl", annual: 24.00 },
      { plan: "Empresa Sociedades", annual: 36.00 }
    ]
  },

  pago_uso_laboral: {
    name: "Tarifa pago por uso — Gestión Laboral",
    quantityLabel: "Cantidad",
    tierKey: "plan",
    mode: "catalog",
    plans: ["Por Empresa", "Por Trabajador"],
    billingOptions: [{ value: "monthly", label: "Precio mes", field: "monthly", period: "monthly" }],
    items: [
      { plan: "Por Empresa", monthly: 2.00 },
      { plan: "Por Trabajador", monthly: 1.00 }
    ]
  },

  msexpress_web: {
    name: "MsExpress + Web",
    quantityLabel: "Cantidad",
    mode: "catalog",
    plans: ["Con MsNotifica", "Con MsNomina"],
    billingOptions: [
      { value: "maintenance", label: "Mant. 3 usuarios", field: "maintenance", period: "annual" },
      { value: "saas", label: "SaaS 5 usuarios", field: "saas", period: "monthly" }
    ],
    items: [
      { plan: "Con MsNotifica", maintenance: 126.00, userExtra: 32.00, saas: 11.00 },
      { plan: "Con MsNomina", maintenance: 256.00, userExtra: 64.00, saas: 21.00 }
    ]
  },

  despachos_completos: {
    name: "Despachos Completos",
    quantityLabel: "Cantidad",
    mode: "catalog",
    plans: ["Despacho Ilimitado", "Despacho Avanzado", "Despacho Emergente"],
    billingOptions: [{ value: "monthly", label: "Cuota mensual", field: "monthly", period: "monthly" }],
    items: [
      { plan: "Despacho Ilimitado", monthly: 399.00 },
      { plan: "Despacho Avanzado", monthly: 299.00 },
      { plan: "Despacho Emergente", monthly: 229.00 }
    ]
  }
};

let erpPlans = {
  despacho: {
    name: "ERP Despacho",
    plans: {
      esencial: {
        name: "Esencial",
        price: 159.95,
        users: 1,
        maxUsers: 2,
        features: {
          "Laboral": "included",
          "Contabilidad": "included",
          "Gestión del despacho": "included",
          "Facturación": "included",
          "Portal Asesor": "included",
          "Gestión de expedientes": "optional",
          "Renta": "optional",
          "Profiture": "optional",
          "DiezBank": "1",
          "Portal del empleado": "optional",
          "Convenios": "1",
          "Scan (año)": "optional",
          "Contasimple": "1",
          "Soporte online": "included",
          "Soporte telefónico": "optional",
          "Soporte prioritario": "unavailable",
          "Copia de seguridad online": "included",
          "Socio de Adecla": "included",
          "Seminarios": "optional",
          "Contenido legal": "included",
          "Seguro de responsabilidad civil": "optional",
          "Gestor documental": "2 GB",
          "Accountancy Network": "optional",
          "Empresas conectadas": "50"
        },
        extras: [
            "caseManagement",
            "rent",
            "diezScan",
            "diezBank",
            "profiture",
            "employeePortal",
            "phoneSupport",
            "prioritySupport",
            "seminars",
            "civilLiability",
            "accountancyNetwork"
        ]
      },

      estandar: {
        name: "Estándar",
        price: 299.95,
        users: 3,
        maxUsers: "Ilimitado",
        features: {
          "Laboral": "included",
          "Contabilidad": "included",
          "Gestión del despacho": "included",
          "Facturación": "included",
          "Portal Asesor": "included",
          "Gestión de expedientes": "included",
          "Renta": "optional",
          "Profiture": "optional",
          "DiezBank": "5",
          "Portal del empleado": "5",
          "Convenios": "5",
          "Scan (año)": "500 documentos",
          "Contasimple": "3",
          "Soporte online": "included",
          "Soporte telefónico": "included",
          "Soporte prioritario": "unavailable",
          "Copia de seguridad online": "included",
          "Socio de Adecla": "included",
          "Seminarios": "included",
          "Contenido legal": "included",
          "Seguro de responsabilidad civil": "optional",
          "Gestor documental": "5 GB",
          "Accountancy Network": "optional",
          "Empresas conectadas": "300"
        },
        extras: [
          "rent",
          "diezScan",
          "diezBank",
          "profiture",
          "prioritySupport",
          "civilLiability",
          "accountancyNetwork"
        ]
      },

      premium: {
        name: "Premium",
        price: 369.95,
        users: 3,
        maxUsers: "Ilimitado",
        features: {
          "Laboral": "included",
          "Contabilidad": "included",
          "Gestión del despacho": "included",
          "Facturación": "included",
          "Portal Asesor": "included",
          "Gestión de expedientes": "included",
          "Renta": "Ilimitado",
          "Profiture": "included",
          "DiezBank": "10",
          "Portal del empleado": "10",
          "Convenios": "10",
          "Scan (año)": "1.000 documentos",
          "Contasimple": "5",
          "Soporte online": "included",
          "Soporte telefónico": "included",
          "Soporte prioritario": "included",
          "Copia de seguridad online": "included",
          "Socio de Adecla": "included",
          "Seminarios": "included",
          "Contenido legal": "included",
          "Seguro de responsabilidad civil": "optional",
          "Gestor documental": "10 GB",
          "Accountancy Network": "optional",
          "Empresas conectadas": "Ilimitado"
        },
        extras: [
          "civilLiability",
          "diezScan",
          "diezBank",
          "accountancyNetwork"
        ]
      }
    }
  },

  fiscal: {
    name: "ERP Despacho Fiscal",
    plans: {
      esencial: {
        name: "Esencial",
        price: 129.95,
        users: 1,
        maxUsers: 2,
        features: {
          "Laboral": "unavailable",
          "Contabilidad": "included",
          "Gestión del despacho": "included",
          "Facturación": "included",
          "Portal Asesor": "included",
          "Gestión de expedientes": "optional",
          "Renta": "optional",
          "Profiture": "optional",
          "DiezBank": "1",
          "Portal del empleado": "unavailable",
          "Convenios": "unavailable",
          "Scan (año)": "optional",
          "Contasimple": "1",
          "Soporte online": "included",
          "Soporte telefónico": "optional",
          "Soporte prioritario": "unavailable",
          "Copia de seguridad online": "included",
          "Socio de Adecla": "included",
          "Seminarios": "optional",
          "Contenido legal": "optional",
          "Seguro de responsabilidad civil": "optional",
          "Gestor documental": "2 GB",
          "Accountancy Network": "optional",
          "Empresas conectadas": "50"
        },
        extras: [
          "caseManagement",
          "rent",
          "diezScan",
          "diezBank",
          "profiture",
          "phoneSupport",
          "prioritySupport",
          "seminars",
          "legalContent",
          "civilLiability",
          "accountancyNetwork"
        ]
      },

      estandar: {
        name: "Estándar",
        price: 209.95,
        users: 3,
        maxUsers: "Ilimitado",
        features: {
          "Laboral": "unavailable",
          "Contabilidad": "included",
          "Gestión del despacho": "included",
          "Facturación": "included",
          "Portal Asesor": "included",
          "Gestión de expedientes": "included",
          "Renta": "optional",
          "Profiture": "optional",
          "DiezBank": "5",
          "Portal del empleado": "unavailable",
          "Convenios": "unavailable",
          "Scan (año)": "500",
          "Contasimple": "3",
          "Soporte online": "included",
          "Soporte telefónico": "included",
          "Soporte prioritario": "unavailable",
          "Copia de seguridad online": "included",
          "Socio de Adecla": "included",
          "Seminarios": "included",
          "Contenido legal": "included",
          "Seguro de responsabilidad civil": "optional",
          "Gestor documental": "5 GB",
          "Accountancy Network": "optional",
          "Empresas conectadas": "Ilimitado"
        },
        extras: [
          "rent",
          "diezScan",
          "diezBank",
          "profiture",
          "prioritySupport",
          "civilLiability",
          "accountancyNetwork"
        ]
      }
    }
  },

  laboral: {
    name: "ERP Despacho Laboral",
    plans: {
      estandar: {
        name: "Estándar",
        price: 209.95,
        users: 3,
        maxUsers: "Ilimitado",
        features: {
          "Laboral": "included",
          "Contabilidad": "unavailable",
          "Gestión del despacho": "included",
          "Facturación": "included",
          "Portal Asesor": "included",
          "Gestión de expedientes": "included",
          "Renta": "optional",
          "Profiture": "optional",
          "DiezBank": "unavailable",
          "Portal del empleado": "5",
          "Convenios": "5",
          "Scan (año)": "unavailable",
          "Contasimple": "unavailable",
          "Soporte online": "included",
          "Soporte telefónico": "included",
          "Soporte prioritario": "unavailable",
          "Copia de seguridad online": "included",
          "Socio de Adecla": "included",
          "Seminarios": "included",
          "Contenido legal": "included",
          "Seguro de responsabilidad civil": "optional",
          "Gestor documental": "5 GB",
          "Accountancy Network": "optional",
          "Empresas conectadas": "Ilimitado"
        },
        extras: [
          "rent",
          "diezScan",
          "diezBank",
          "profiture",
          "prioritySupport",
          "civilLiability",
          "accountancyNetwork"
        ]
      }
    }
  }
};

let erpExtras = {
    phoneSupport: {
        name: "Soporte telefónico",
        price: 29.95,
        period: "monthly"
    },

    prioritySupport: {
        name: "Soporte prioritario",
        price: 59.95,
        period: "monthly"
    },

    profiture: {
        name: "Profiture",
        price: 40,
        period: "monthly"
    },

    caseManagement: {
        name: "Gestión de expedientes",
        price: 29.95,
        period: "monthly"
    },

    rent: {
        name: "Renta",
        price: 540,
        period: "annual"
    },

    employeePortal: {
        name: "Portal del empleado",
        price: 14,
        period: "monthly"
    },

    diezScan: {
      name: "DiezScan",
      type: "tier",
      period: "monthly",
      tierLabel: "documentos/año",
      tiers: [
        {
          value: 3000,
          label: "3.000",
          monthly: 50,
          unitPrice: 0.20
        },
        {
          value: 6500,
          label: "6.500",
          monthly: 100,
          unitPrice: 0.18
        },
        {
          value: 10000,
          label: "10.000",
          monthly: 150,
          unitPrice: 0.18
        },
        {
          value: 14000,
          label: "14.000",
          monthly: 200,
          unitPrice: 0.17
        },
        {
          value: 18000,
          label: "18.000",
          monthly: 250,
          unitPrice: 0.17
        },
        {
          value: 24000,
          label: "24.000",
          monthly: 300,
          unitPrice: 0.15
        },
        {
          value: 30000,
          label: "30.000",
          monthly: 350,
          unitPrice: 0.14
        }
      ]
    },

    seminars: {
        name: "Seminarios",
        price: 21.95,
        period: "monthly"
    },

    legalContent: {
        name: "Contenido legal",
        price: 19.95,
        period: "monthly"
    },

    civilLiability: {
        name: "Seguro responsabilidad civil",
        price: 49.95,
        period: "monthly"
    },

    diezBank: {
      name: "DiezBank",
      type: "tier",
      period: "monthly",
      tierLabel: "conexiones",
      tiers: [
        {
          value: 10,
          label: "10",
          monthly: 25
        },
        {
          value: 25,
          label: "25",
          monthly: 50
        },
        {
          value: 50,
          label: "50",
          monthly: 75
        }
      ]
    },

    accountancyNetwork: {
        name: "Red de Asesorías",
        price: 26.95,
        period: "monthly"
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

async function loadSimpleCatalog() {
    if (!currentSession?.token) {
        throw new Error("Debes iniciar sesión para cargar el catálogo.");
    }

    const response = await jsonpRequest("getSimpleCatalog", { token: currentSession.token });

    if (!response?.success || !response?.apps) {
        throw new Error(response?.message || "No se pudo cargar el catálogo.");
    }

    Object.assign(apps, response.apps);
}

async function loadErpCatalog() {
  if (!currentSession?.token) {
    throw new Error("Debes iniciar sesión para cargar el catálogo ERP.");
  }

  const response = await jsonpRequest("getErpCatalog",{ token:currentSession.token });

  if (!response?.success || !response?.plans || !response?.extras) {
    throw new Error(response?.message || "No se pudo cargar el catálogo ERP.");
  }

  erpPlans = response.plans;
  erpExtras = response.extras;
  console.log("Planes ERP cargados:", erpPlans);
  console.log("Extras ERP cargados:", erpExtras);
}

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

  Object.assign(apps, response.apps);
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

    setDetailText(
        "detailExtras",
        budget["Tiene Extras"]
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
    const certifacil = apps.certifacil?.items?.[0] || {};
    const certUsers = Math.max(0, Number(uExtra?.value) || 0);
    const certExtra = certUsers * (Number(certifacil.userExtra) || 0);
    if (billing.value === "compra") {
      license = (Number(tier.price) || 0) + mailboxExtra + extraUsersAnnual + (addModl?.checked ? Number(certifacil.price) || 0 : 0) + certExtra;
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
    if (addModl?.checked) {
      const moduleResult = addModulosGest(quantity);
      if (period === "M") fee += Number(moduleResult.monthly) || 0;
      else {
        license += Number(moduleResult.main) || Number(moduleResult.annual) || 0;
        maintenance += Number(moduleResult.mante) || 0;
      }
    }
    detail = `${quantity.toLocaleString("es-ES")} licencias${addModl?.checked ? ` · ${els.selectMdlGest.value}` : ""}`;
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
  const previous = microdataEditingItemId ? microdataBudgetItems.find(item => item.id === microdataEditingItemId) : null;
  return recalculateMicrodataItem({
    ...calculation,
    id: microdataEditingItemId || createMicrodataItemId(),
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

function resetMicrodataEditMode() {
  microdataEditingItemId = null;
  if (els.addMicrodataItemButton) els.addMicrodataItemButton.innerHTML = "<span>＋</span>Añadir al presupuesto";
  els.cancelMicrodataEditButton?.classList.add("hidden");
}

function addCurrentMicrodataItem() {
  try {
    const item = buildCurrentMicrodataItem();
    const index = microdataBudgetItems.findIndex(current => current.id === item.id);
    if (index >= 0) microdataBudgetItems[index] = item;
    else microdataBudgetItems.push(item);
    microdataOpenItemId = item.id;
    resetMicrodataEditMode();
    renderMicrodataBudget();
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

function init() {
  Object.entries(apps).forEach(([key, app]) => {
    const option = document.createElement("option");
    if (key !== "msgest_modulos" && key !== "pago_uso_fiscal" && key !== "pago_uso_laboral") {
      option.value = key;
      option.textContent = app.name;
      els.appSelect.appendChild(option);
    }
  });

  els.appSelect.addEventListener("change", () => {
    refreshPlans();
    updateExtraFields();
    calculate();
  });
  els.planSelect.addEventListener("change", calculate);
  els.quantityInput.addEventListener("input", calculate);
  els.billingSelect.addEventListener("change", calculate);
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
    const count = microdataBudgetItems.length;
    els.microdataItemCount.textContent = `${count} ${count === 1 ? "aplicación" : "aplicaciones"}`;
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

function renderMicrodataBudgetItem(item) {
  const isOpen = microdataOpenItemId === item.id;
  const quantityText = Number(item.quantity) > 0
    ? `${item.quantityLabel}: ${Number(item.quantity).toLocaleString("es-ES")}`
    : "";

  return `
    <article class="microdata-result-row microdata-accordion-item ${isOpen ? "is-open" : ""}" data-item-id="${escapeHtml(item.id)}">
      <button
        type="button"
        class="microdata-accordion-trigger"
        data-action="toggle"
        aria-expanded="${isOpen}"
        aria-controls="microdata-panel-${escapeHtml(item.id)}"
      >
        <span class="microdata-accordion-chevron" aria-hidden="true">›</span>
        <span class="microdata-accordion-summary">
          <strong data-field="application">${escapeHtml(item.application)}</strong>
          <small>${escapeHtml(item.plan || "Sin plan")}${quantityText ? ` · ${escapeHtml(quantityText)}` : ""}</small>
        </span>
        <span class="microdata-accordion-price">${escapeHtml(getMicrodataItemSummary(item))}</span>
      </button>

      <div id="microdata-panel-${escapeHtml(item.id)}" class="microdata-accordion-panel" ${isOpen ? "" : "hidden"}>
        <div class="microdata-accordion-details">
          <div class="microdata-accordion-meta">
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
          <button type="button" class="microdata-item-action microdata-edit-action" data-action="edit">✎ Editar</button>
          <button type="button" class="microdata-item-action delete" data-action="delete">X Eliminar</button>
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
    microdataBudgetItems = microdataBudgetItems.filter(item => item.id !== id);
    if (microdataEditingItemId === id) resetMicrodataEditMode();
    if (microdataOpenItemId === id) microdataOpenItemId = null;
    renderMicrodataBudget();
    return;
  }

  if (action === "edit") {
    microdataOpenItemId = id;
    editMicrodataItem(id);
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

function updateMicrodataBudgetTotals() {
  const totals = microdataBudgetItems.reduce((acc, item) => {
    acc.license += Number(item.licenseFinal) || 0;
    acc.maintenance += Number(item.maintenanceFinal) || 0;
    if (item.period === "M") acc.monthlyFee += Number(item.monthlyFeeFinal) || 0;
    else acc.annualFee += Number(item.monthlyFeeFinal) || 0;
    return acc;
  }, { license: 0, maintenance: 0, monthlyFee: 0, annualFee: 0 });

  const initial = totals.license + totals.maintenance + totals.annualFee;
  const annualEquivalent = initial + totals.monthlyFee * 12;

  if (els.microdataTotalLicense) els.microdataTotalLicense.textContent = euros(totals.license);
  if (els.microdataTotalMaintenance) els.microdataTotalMaintenance.textContent = euros(totals.maintenance);
  if (els.microdataTotalMonthlyFee) els.microdataTotalMonthlyFee.textContent = euros(totals.monthlyFee);
  if (els.microdataTotalAnnualFee) els.microdataTotalAnnualFee.textContent = euros(totals.annualFee);
  if (els.microdataTotal) els.microdataTotal.textContent = euros(totals.monthlyFee + totals.annualFee);
  if (els.mainResult) els.mainResult.textContent = euros(initial);
  if (els.summaryMonthly) els.summaryMonthly.textContent = euros(totals.monthlyFee);
  if (els.summaryAnnual) els.summaryAnnual.textContent = euros(annualEquivalent);
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

  apps.msnotifica.tiers.forEach(tier => {
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

  apps.msgest_modulos.tiers.forEach(tier => {
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
        console.log("Datos del presupuesto:", budgetData);
        await saveBudgetRecord(budgetData);
        clientModal.classList.add("hidden");
        await generateBudgetDocument(budgetData);
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

function getMicrodataPeriodCode(billingPeriod) {
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
  const period = getMicrodataPeriodCode(billingPeriod);
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

function buildMicrodataAutomaticNotes(lineas) {
  const details = lineas
    .map(line => line.detalle)
    .filter(Boolean);

  if (details.length === 0) {
    return "";
  }

  return [
    "Detalle de productos:",
    ...details.map(detail => `- ${detail}`)
  ].join("\n");
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

  const totals = microdataBudgetItems.reduce((acc, item) => {
    acc.license += Number(item.licenseFinal) || 0;
    acc.maintenance += Number(item.maintenanceFinal) || 0;
    acc.fee += Number(item.monthlyFeeFinal) || 0;
    return acc;
  }, { license: 0, maintenance: 0, fee: 0 });

  const details = microdataBudgetItems.map(item => `${item.application} · ${item.plan} · ${item.detail || item.billingLabel}`);
  const manualNotes = document.getElementById("microdataBudgetNotes")?.value?.trim() || "";
  const automaticNotes = buildMicrodataAutomaticNotes(details);
  const finalNotes = [manualNotes, automaticNotes].filter(Boolean).join("\n\n");

  return {
    numPresupuesto: createBudgetNumber(),
    fecha: formatBudgetDate(new Date()),
    lineas,
    totalLicencia: euros(totals.license),
    totalMantenimiento: euros(totals.maintenance),
    totalCuota: euros(totals.fee),
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

startApplication();