const apps = {
  ejornada: {
    name: "eJornada",
    quantityLabel: "Nº de trabajadores",
    mode: "closestBand",
    tierKey: "workers",
    tierLabel: "trabajadores",
    billingOptions: [
      { value: "annual", label: "Precio anual", field: "annual", period: "annual" },
      { value: "monthly", label: "Equivalente mensual", field: "annual", period: "annualToMonthly" }
    ],
    plans: ["Módulo Fichajes", "Fichajes + Ausencias"],
    tiers: [
      { workers: 5, "Módulo Fichajes": 195.00, "Fichajes + Ausencias": 255.00 },
      { workers: 10, "Módulo Fichajes": 240.00, "Fichajes + Ausencias": 315.00 },
      { workers: 15, "Módulo Fichajes": 288.00, "Fichajes + Ausencias": 378.00 },
      { workers: 20, "Módulo Fichajes": 336.00, "Fichajes + Ausencias": 441.00 },
      { workers: 25, "Módulo Fichajes": 384.00, "Fichajes + Ausencias": 504.00 },
      { workers: 30, "Módulo Fichajes": 408.00, "Fichajes + Ausencias": 535.50 },
      { workers: 35, "Módulo Fichajes": 432.00, "Fichajes + Ausencias": 567.00 },
      { workers: 40, "Módulo Fichajes": 456.00, "Fichajes + Ausencias": 598.50 },
      { workers: 45, "Módulo Fichajes": 480.00, "Fichajes + Ausencias": 630.00 },
      { workers: 50, "Módulo Fichajes": 504.00, "Fichajes + Ausencias": 660.00 },
      { workers: 60, "Módulo Fichajes": 604.80, "Fichajes + Ausencias": 792.00 },
      { workers: 70, "Módulo Fichajes": 705.60, "Fichajes + Ausencias": 924.00 },
      { workers: 80, "Módulo Fichajes": 806.40, "Fichajes + Ausencias": 1056.00 },
      { workers: 90, "Módulo Fichajes": 810.00, "Fichajes + Ausencias": 1080.00 },
      { workers: 100, "Módulo Fichajes": 900.00, "Fichajes + Ausencias": 1200.00 },
      { workers: 200, "Módulo Fichajes": 1680.00, "Fichajes + Ausencias": 2160.00 },
      { workers: 500, "Módulo Fichajes": 3900.00, "Fichajes + Ausencias": 5100.00 },
      { workers: 700, "Módulo Fichajes": 5040.00, "Fichajes + Ausencias": 6720.00 },
      { workers: 1000, "Módulo Fichajes": 6000.00, "Fichajes + Ausencias": 9000.00 }
    ]
  },

  msnotifica: {
    name: "MsNotifica",
    quantityLabel: "Nº de buzones",
    mode: "closestBand",
    tierKey: "mailboxes",
    tierLabel: "buzones",
    billingOptions: [
      { value: "price", label: "Precio licencia", field: "price", period: "annual" },
      { value: "maintenance", label: "Mantenimiento", field: "maintenance", period: "annual" },
      { value: "userExtra", label: "Usuario extra", field: "userExtra", period: "annual" },
      { value: "saas", label: "SaaS 5 usuarios", field: "saas", period: "monthly" }
    ],
    plans: ["Tarifa"],
    tiers: [
      { mailboxes: 50, Tarifa: 518.00, price: 518.00, maintenance: 441.00, userExtra: 66.00, saas: 40.00 },
      { mailboxes: 100, Tarifa: 842.00, price: 842.00, maintenance: 537.00, userExtra: 80.00, saas: 50.00 },
      { mailboxes: 250, Tarifa: 842.00, price: 842.00, maintenance: 1017.00, userExtra: 150.00, saas: 90.00 },
      { mailboxes: 500, Tarifa: 842.00, price: 842.00, maintenance: 1377.00, userExtra: 191.00, saas: 120.00 }
    ]
  },

  efirma: {
    name: "eFirma GO",
    quantityLabel: "Nº de documentos al año",
    mode: "capacityPlan",
    billingOptions: [
      { value: "monthly", label: "Mensual", field: "monthly", period: "monthly" },
      { value: "annual", label: "Anual", field: "annual", period: "annual" }
    ],
    plans: ["Personal", "Professional", "Business", "Business Plus", "Concertada"],
    tiers: [
      { plan: "Personal", docsYear: 60, users: 1, smsYear: 24, monthly: 10.80, annual: 108.00 },
      { plan: "Professional", docsYear: 360, users: 3, smsYear: 36, monthly: 22.80, annual: 228.00 },
      { plan: "Business", docsYear: 1200, users: 5, smsYear: 120, monthly: 34.80, annual: 348.00 },
      { plan: "Business Plus", docsYear: 3000, users: 8, smsYear: 300, monthly: 68.40, annual: 684.00 },
      { plan: "Concertada", docsYear: 5000, users: 10, smsYear: 500, monthly: 91.20, annual: 912.00 },
      { plan: "Concertada", docsYear: 12500, users: 10, smsYear: 1250, monthly: 218.40, annual: 2184.00 },
      { plan: "Concertada", docsYear: 25000, users: 10, smsYear: 2500, monthly: 414.00, annual: 4140.00 },
      { plan: "Concertada", docsYear: 50000, users: 30, smsYear: 5000, monthly: 792.00, annual: 7920.00 },
      { plan: "Concertada", docsYear: 100000, users: 30, smsYear: 10000, monthly: 1500.00, annual: 15000.00 }
    ]
  },

  efirma_msnomina: {
    name: "eFirma GO para MsNómina",
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
    plans: ["Activación licencia", "Usuario extra"],
    billingOptions: [{ value: "price", label: "Precio", field: "price", period: "annual" }],
    items: [
      { plan: "Activación licencia", price: 50.00 },
      { plan: "Usuario extra", price: 5.00 }
    ]
  },

  msnomina: {
    name: "MsNómina",
    quantityLabel: "Cantidad",
    mode: "catalog",
    plans: ["MsNomina PYME", "MsNomina PYME +", "MsNomina hasta 100 trab", "MsNomina", "MsNomina + S.E.A.", "MsNomina solo S.E.A.", "MsNomina gran empresa", "Informes Avanzados de MsNómina"],
    billingOptions: [
      { value: "price", label: "Precio", field: "price", period: "annual" },
      { value: "maintenance", label: "Mant. 4 usuarios", field: "maintenance", period: "annual" },
      { value: "userExtra", label: "Usuario extra", field: "userExtra", period: "annual" },
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
    mode: "closestBand",
    tierKey: "licenses",
    tierLabel: "licencias",
    billingOptions: [
      { value: "price", label: "Precio", field: "price", period: "annual" },
      { value: "maintenance", label: "Mantenimiento", field: "maintenance", period: "annual" },
      { value: "maintenanceMsConta", label: "Mant. con MsConta", field: "maintenanceMsConta", period: "annual" },
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
      { value: "price", label: "Precio", field: "price", period: "annual" },
      { value: "maintenance", label: "Mant. 1 puesto", field: "maintenance", period: "annual" },
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
    mode: "catalog",
    plans: ["Obras", "Trazabilidad", "Fabricación", "Tallas y Colores", "Medidas", "Series", "Envases Avanzado", "TPV", "Conector Prestashop", "SINLI", "Partes de Trabajo (Talleres)", "Fitosanitarios"],
    billingOptions: [
      { value: "price", label: "Precio", field: "price", period: "annual" },
      { value: "maintenance", label: "Mant. usuario", field: "maintenance", period: "annual" },
      { value: "saas", label: "SaaS", field: "saas", period: "monthly" }
    ],
    items: [
      { plan: "Obras", price: 450.00, maintenance: 55.00, saas: 7.00 },
      { plan: "Trazabilidad", price: 450.00, maintenance: 55.00, saas: 7.00 },
      { plan: "Fabricación", price: 450.00, maintenance: 55.00, saas: 7.00 },
      { plan: "Tallas y Colores", price: 300.00, maintenance: 37.00, saas: 5.00 },
      { plan: "Medidas", price: 300.00, maintenance: 37.00, saas: 5.00 },
      { plan: "Series", price: 250.00, maintenance: 31.00, saas: 4.00 },
      { plan: "Envases Avanzado", price: 250.00, maintenance: 31.00, saas: 4.00 },
      { plan: "TPV", price: 350.00, maintenance: 42.00, saas: 6.00 },
      { plan: "Conector Prestashop", price: 250.00, maintenance: 31.00, saas: 4.00 },
      { plan: "SINLI", price: 400.00, maintenance: 47.00, saas: 6.00 },
      { plan: "Partes de Trabajo (Talleres)", price: 300.00, maintenance: 37.00, saas: 5.00 },
      { plan: "Fitosanitarios", price: 300.00, maintenance: 37.00, saas: 5.00 }
    ]
  },

  msconta: {
    name: "MsConta",
    quantityLabel: "Cantidad",
    mode: "catalog",
    plans: ["MSregistro (Mseos)", "MSconta", "MSconta + Mspci", "Msconta + Mseos + Mspci Asesor", "Módulo Análisis de Balances", "MsSII"],
    billingOptions: [
      { value: "price", label: "Precio", field: "price", period: "annual" },
      { value: "maintenance", label: "Mant. 5 usuarios", field: "maintenance", period: "annual" },
      { value: "userExtra", label: "Usuario extra", field: "userExtra", period: "annual" },
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
      { value: "price", label: "Precio", field: "price", period: "annual" },
      { value: "maintenance", label: "Mant. 5 usuarios", field: "maintenance", period: "annual" },
      { value: "userExtra", label: "Usuario extra", field: "userExtra", period: "annual" },
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
      { value: "price", label: "Precio", field: "price", period: "annual" },
      { value: "maintenance", label: "Mant. 5 usuarios", field: "maintenance", period: "annual" },
      { value: "userExtra", label: "Usuario extra", field: "userExtra", period: "annual" },
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
    billingOptions: [
      { value: "price", label: "Precio", field: "price", period: "annual" },
      { value: "maintenance", label: "Mantenimiento", field: "maintenance", period: "annual" }
    ],
    items: [{ plan: "MsRenta Multi", price: 740.00, maintenance: 584.00 }]
  },

  msscan: {
    name: "MsScan",
    quantityLabel: "Cantidad",
    mode: "catalog",
    plans: ["Archivo Documental + MsScan Empresa", "Archivo Documental + MsScan ASESOR"],
    billingOptions: [{ value: "maintenance", label: "Mantenimiento", field: "maintenance", period: "annual" }],
    items: [
      { plan: "Archivo Documental + MsScan Empresa", maintenance: 253.00 },
      { plan: "Archivo Documental + MsScan ASESOR", maintenance: 333.00 }
    ]
  },

  msscan_ocr: {
    name: "MsScan OCR",
    quantityLabel: "Nº de documentos",
    mode: "closestBand",
    tierKey: "documents",
    tierLabel: "documentos",
    billingOptions: [
      { value: "maintenance", label: "Mantenimiento", field: "maintenance", period: "annual" },
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
      { value: "userExtra", label: "Usuario extra", field: "userExtra", period: "annual" },
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

function valueToMonthlyAnnual(value, period, quantity = 1) {
  const qty = Math.max(1, quantity || 1);
  const multiplied = value * qty;

  if (period === "monthly") return { monthly: multiplied, annual: multiplied * 12, main: multiplied };
  if (period === "annual") return { monthly: multiplied / 12, annual: multiplied, main: multiplied };
  if (period === "annualToMonthly") return { monthly: value / 12, annual: value, main: value / 12 };
  if (period === "unitMonthly") return { monthly: value * qty, annual: value * qty * 12, main: value };
  if (period === "unit") return { monthly: 0, annual: value * qty, main: value };
  return { monthly: 0, annual: multiplied, main: multiplied };
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
  if (els.copyButton) els.copyButton.addEventListener("click", copySummary);

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

  els.billingSelect.innerHTML = "";
  (app.billingOptions || []).forEach(optionConfig => {
    const option = document.createElement("option");
    option.value = optionConfig.value;
    option.textContent = optionConfig.label;
    els.billingSelect.appendChild(option);
  });

  els.quantityLabel.textContent = app.quantityLabel;
  els.summaryQuantityLabel.textContent = app.quantityLabel;
  els.billingField.style.display = (app.billingOptions || []).length > 1 ? "block" : "none";
  els.quantityInput.value = app.mode === "capacityPlan" ? 360 : 1;
}

function calculate() {
  const app = apps[els.appSelect.value];
  const plan = els.planSelect.value;
  const quantity = Math.max(1, Number(els.quantityInput.value || 1));
  const billing = selectedBilling(app);
  let monthly = 0;
  let annual = 0;
  let main = 0;
  let subtitle = "";
  let notice = "";

  if (app.mode === "closestBand") {
    const tierKey = app.tierKey;
    const tier = app.tiers.find(t => quantity <= t[tierKey]) || app.tiers[app.tiers.length - 1];
    const value = tier[billing.field] ?? tier[plan];
    const result = valueToMonthlyAnnual(value, billing.period, billing.period === "unit" ? quantity : 1);
    monthly = result.monthly;
    annual = result.annual;
    main = result.main;
    const tierText = tier.label || formatNumber(tier[tierKey]);
    subtitle = `${billing.label} · tramo hasta ${tierText} ${app.tierLabel}.`;
    notice = quantity > tier[tierKey] && Number.isFinite(tier[tierKey])
      ? `La tabla llega hasta ${formatNumber(tier[tierKey])} ${app.tierLabel}. Revisa manualmente importes superiores.`
      : `Se ha usado el tramo de ${tierText} ${app.tierLabel}.`;
  }

  if (app.mode === "capacityPlan") {
    const candidates = app.tiers.filter(t => t.plan === plan && quantity <= t.docsYear);
    const tier = candidates[0] || app.tiers.filter(t => t.plan === plan).slice(-1)[0];
    const value = tier[billing.field];
    const result = valueToMonthlyAnnual(value, billing.period, 1);
    monthly = result.monthly;
    annual = result.annual;
    main = result.main;
    subtitle = `${tier.docsYear.toLocaleString("es-ES")} documentos/año · ${tier.users} usuarios · ${tier.smsYear.toLocaleString("es-ES")} SMS/año.`;
    notice = quantity > tier.docsYear
      ? `El plan seleccionado no cubre ${quantity.toLocaleString("es-ES")} documentos/año. Revisa una tarifa superior o personalizada.`
      : `Se ha seleccionado la capacidad mínima que cubre ${quantity.toLocaleString("es-ES")} documentos/año.`;
  }

  if (app.mode === "rangeBand") {
    const tier = app.tiers.find(t => quantity >= t.min && quantity <= t.max) || app.tiers[app.tiers.length - 1];
    const value = tier[billing.field];
    const result = valueToMonthlyAnnual(value, billing.period, quantity);
    monthly = result.monthly;
    annual = result.annual;
    main = result.main;
    subtitle = `${billing.label} · tramo ${formatNumber(tier.min)}-${formatNumber(tier.max)} trabajadores.`;
    notice = quantity > tier.max
      ? `La tabla llega hasta ${formatNumber(tier.max)} trabajadores. Revisa manualmente importes superiores.`
      : `Se ha usado el tramo ${formatNumber(tier.min)}-${formatNumber(tier.max)} trabajadores.`;
  }

  if (app.mode === "catalog") {
    const item = app.items.find(i => i.plan === plan) || app.items[0];
    const value = item[billing.field];

    if (value === undefined) {
      monthly = 0;
      annual = 0;
      main = 0;
      subtitle = `${billing.label} no disponible para esta tarifa.`;
      notice = `Esta combinación no tiene importe en la tabla original.`;
    } else {
      const result = valueToMonthlyAnnual(value, billing.period, quantity);
      monthly = result.monthly;
      annual = result.annual;
      main = result.main;
      subtitle = `${billing.label} · ${plan}.`;
      notice = billing.period === "monthly"
        ? `Se ha calculado multiplicando la cuota mensual por la cantidad indicada.`
        : `Se ha calculado multiplicando el importe por la cantidad indicada.`;
    }
  }

  els.noticeBox.textContent = notice;
  els.noticeBox.classList.toggle("visible", Boolean(notice));
  els.mainResult.textContent = euros(main);
  els.resultSubtitle.textContent = subtitle;
  els.summaryApp.textContent = app.name;
  els.summaryPlan.textContent = plan;
  els.summaryQuantity.textContent = quantity.toLocaleString("es-ES");
  els.summaryMonthly.textContent = monthly ? euros(monthly) : "-";
  els.summaryAnnual.textContent = annual ? euros(annual) : "-";
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
