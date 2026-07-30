(function () {
  "use strict";

  const state = {
    initialized: false,
    opportunityCallbacks: null
  };

  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
      callback();
    }
  }

  function opportunityModalTemplate(states) {
    return `
      <div id="opportunityEditorModal" class="modal-overlay hidden" role="dialog" aria-modal="true" aria-labelledby="opportunityEditorTitle">
        <div class="modal-card opportunity-editor-card">
          <div class="modal-header">
            <div>
              <p class="eyebrow">Sales Hub</p>
              <h2 id="opportunityEditorTitle">Nueva oportunidad</h2>
              <p id="opportunityEditorSubtitle">Registra una venta potencial asociada a un cliente.</p>
            </div>
            <button id="closeOpportunityEditorButton" class="modal-close-button" type="button" aria-label="Cerrar">×</button>
          </div>
          <form id="opportunityEditorForm" class="opportunity-editor-form">
            <input id="opportunityEditorId" type="hidden">
            <div class="form-grid opportunity-form-grid">
              <label class="form-field form-field-wide"><span>Cliente *</span><select id="opportunityCustomerId" required></select></label>
              <label class="form-field"><span>Nombre de la oportunidad *</span><input id="opportunityName" maxlength="180" required placeholder="Ej.: Implantación ERP 2026"></label>
              <label class="form-field"><span>Producto</span><input id="opportunityProduct" maxlength="120" placeholder="ERP, eJornada, Firma digital…"></label>
              <label class="form-field"><span>Fase</span><select id="opportunityStatus">${states.map(state => `<option value="${state}">${state}</option>`).join("")}</select></label>
              <label class="form-field"><span>Probabilidad (%)</span><input id="opportunityProbability" type="number" min="0" max="100" step="1"></label>
              <label class="form-field"><span>Importe mensual</span><input id="opportunityMonthlyAmount" type="number" min="0" step="0.01"></label>
              <label class="form-field"><span>Importe inicial</span><input id="opportunityInitialAmount" type="number" min="0" step="0.01"></label>
              <label class="form-field"><span>Cierre previsto</span><input id="opportunityExpectedClose" type="date"></label>
              <label class="form-field"><span>Responsable</span><input id="opportunityResponsible" maxlength="120"></label>
              <label class="form-field form-field-wide"><span>Próxima acción</span><input id="opportunityNextAction" maxlength="250" placeholder="Llamar, preparar demo, enviar propuesta…"></label>
              <label class="form-field"><span>Fecha próxima acción</span><input id="opportunityNextActionDate" type="date"></label>
              <label class="form-field form-field-wide"><span>Notas</span><textarea id="opportunityNotes" rows="4" maxlength="2000"></textarea></label>
            </div>
            <div id="opportunityEditorMessage" class="portal-message" aria-live="polite"></div>
            <div class="modal-actions">
              <button id="deleteOpportunityButton" class="portal-danger-button hidden" type="button">Eliminar</button>
              <span class="modal-actions-spacer"></span>
              <button id="cancelOpportunityButton" class="portal-secondary-button" type="button">Cancelar</button>
              <button id="saveOpportunityButton" class="portal-primary-button" type="submit">Guardar oportunidad</button>
            </div>
          </form>
        </div>
      </div>`;
  }

  function ensureOpportunityModal(states, callbacks) {
    state.opportunityCallbacks = callbacks || state.opportunityCallbacks || {};

    if (!document.body) return false;
    if (!document.getElementById("opportunityEditorModal")) {
      document.body.insertAdjacentHTML("beforeend", opportunityModalTemplate(states || []));
    }

    const modal = document.getElementById("opportunityEditorModal");
    if (!modal || modal.dataset.uiBound === "true") return Boolean(modal);

    modal.dataset.uiBound = "true";
    document.getElementById("closeOpportunityEditorButton")?.addEventListener("click", () => state.opportunityCallbacks?.onClose?.());
    document.getElementById("cancelOpportunityButton")?.addEventListener("click", () => state.opportunityCallbacks?.onClose?.());
    modal.addEventListener("click", event => {
      if (event.target === modal) state.opportunityCallbacks?.onClose?.();
    });
    document.getElementById("opportunityEditorForm")?.addEventListener("submit", event => state.opportunityCallbacks?.onSubmit?.(event));
    document.getElementById("deleteOpportunityButton")?.addEventListener("click", () => state.opportunityCallbacks?.onDelete?.());
    document.getElementById("opportunityStatus")?.addEventListener("change", event => state.opportunityCallbacks?.onStatusChange?.(event));
    return true;
  }

  function initialize() {
    if (state.initialized) return;
    state.initialized = true;
  }

  window.UIManager = {
    ready,
    initialize,
    ensureOpportunityModal
  };

  ready(initialize);
})();
