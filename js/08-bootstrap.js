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


