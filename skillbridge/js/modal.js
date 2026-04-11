/* ============================================================
   SkillBridge - Modal JS (modal.js)
   Generic modal system: open, close, escape key, body lock
   Payment modal trigger handling
   ============================================================ */

const SkillBridgeModal = (function () {

  const activeModals = new Set();

  /* ── Core: Open Modal ───────────────────────────────────── */
  function openModal(modalId) {
    const overlay = document.getElementById(modalId + 'Overlay') || document.getElementById(modalId);
    if (!overlay) return;

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    activeModals.add(modalId);

    // Focus trap: focus first focusable element
    setTimeout(() => {
      const focusable = overlay.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable) focusable.focus();
    }, 100);
  }

  /* ── Core: Close Modal ──────────────────────────────────── */
  function closeModal(modalId) {
    const overlay = document.getElementById(modalId + 'Overlay') || document.getElementById(modalId);
    if (!overlay) return;

    overlay.classList.remove('open');
    activeModals.delete(modalId);

    if (!activeModals.size) {
      document.body.style.overflow = '';
    }
  }

  /* ── Close all modals ───────────────────────────────────── */
  function closeAllModals() {
    activeModals.forEach(id => closeModal(id));
  }

  /* ── Bind close buttons ─────────────────────────────────── */
  function bindCloseButtons() {
    // X buttons inside modals
    document.querySelectorAll('[data-modal-close]').forEach(btn => {
      btn.addEventListener('click', function () {
        const modalId = this.dataset.modalClose;
        closeModal(modalId);
      });
    });

    // Click outside modal box to close
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', function (e) {
        if (e.target === this) {
          const id = this.id?.replace('Overlay', '');
          if (id) closeModal(id);
        }
      });
    });
  }

  /* ── Escape key handler ─────────────────────────────────── */
  function bindEscapeKey() {
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && activeModals.size) {
        const lastModal = [...activeModals].pop();
        closeModal(lastModal);
      }
    });
  }

  /* ── Payment Modal ──────────────────────────────────────────
     Triggered by:
       data-modal-trigger="payment"
       data-item-id="..."
       data-item-name="..."
       data-item-price="..."
       data-item-desc="..."   (optional)
  ─────────────────────────────────────────────────────────── */
  function bindTriggers() {
    document.querySelectorAll('[data-modal-trigger="payment"]').forEach(btn => {
      // Remove old listeners by cloning
      const fresh = btn.cloneNode(true);
      btn.parentNode.replaceChild(fresh, btn);

      fresh.addEventListener('click', function () {
        const data = {
          id:    this.dataset.itemId    || '',
          name:  this.dataset.itemName  || 'Item',
          price: this.dataset.itemPrice || '£0',
          desc:  this.dataset.itemDesc  || ''
        };
        openPaymentModal(data);
      });
    });
  }

  function openPaymentModal(data) {
    // Reset modal state
    resetPaymentModal();

    // Populate order summary
    if (window.SkillBridgePayment) {
      window.SkillBridgePayment.populateOrderSummary(data);
    } else {
      // Fallback inline population
      populateModalFallback(data);
    }

    openModal('payment');
  }

  function populateModalFallback(data) {
    const nameEl  = document.getElementById('modalItemName');
    const priceEl = document.getElementById('modalItemPrice');
    const baseEl  = document.getElementById('basePrice');
    const totalEl = document.getElementById('totalAmount');

    if (nameEl)  nameEl.textContent  = data.name;
    if (priceEl) priceEl.textContent = data.price;
    if (baseEl) {
      baseEl.dataset.price = parseFloat(data.price.replace('£','') || 0);
      baseEl.textContent   = data.price;
    }
    if (totalEl) totalEl.textContent = data.price;
  }

  function resetPaymentModal() {
    // Reset form
    const paymentForm = document.getElementById('paymentFormWrapper');
    const successView = document.getElementById('paymentSuccess');
    const header      = document.querySelector('.modal__header');

    if (paymentForm) paymentForm.style.display = 'block';
    if (successView) successView.style.display = 'none';
    if (header)      header.style.display      = '';

    // Clear form fields
    ['cardHolder','cardNumber','expiryDate','cvvCode','promoInput'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });

    // Reset promo
    const promoMsg    = document.getElementById('promoMsg');
    const discountRow = document.getElementById('discountRow');
    const applyBtn    = document.getElementById('applyPromo');
    if (promoMsg)    { promoMsg.textContent = ''; promoMsg.style.display = 'none'; }
    if (discountRow) discountRow.style.display = 'none';
    if (applyBtn)    { applyBtn.textContent = 'Apply'; applyBtn.disabled = false; applyBtn.style.color = ''; }

    // Reset method tabs
    document.querySelectorAll('.payment-method-tab').forEach((tab, i) => {
      tab.classList.toggle('active', i === 0);
    });
    document.querySelectorAll('.payment-form-section[data-method]').forEach((sec, i) => {
      sec.style.display = i === 0 ? 'block' : 'none';
    });

    // Remove field errors
    document.querySelectorAll('.payment-field-error').forEach(el => el.remove());
    document.querySelectorAll('.payment-form__input.error').forEach(el => el.classList.remove('error'));
  }

  /* ── Hire modal / confirm dialog ────────────────────────────
     Generic confirm dialog for hire actions
  ─────────────────────────────────────────────────────────── */
  function openConfirm(options = {}) {
    const {
      title   = 'Confirm Action',
      message = 'Are you sure you want to proceed?',
      onConfirm,
      confirmText = 'Confirm',
      cancelText  = 'Cancel'
    } = options;

    // Create modal dynamically
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'confirmOverlay';
    overlay.innerHTML = `
      <div class="modal" style="max-width:400px">
        <div class="modal__header">
          <div>
            <div class="modal__title">${title}</div>
          </div>
          <button class="modal__close" id="confirmClose">✕</button>
        </div>
        <div class="modal__body">
          <p style="font-size:var(--text-sm);color:var(--gray-600);line-height:1.7;margin-bottom:var(--space-6)">${message}</p>
          <div style="display:flex;gap:var(--space-3)">
            <button class="btn btn-ghost" style="flex:1" id="confirmCancel">${cancelText}</button>
            <button class="btn btn-primary" style="flex:1" id="confirmOk">${confirmText}</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    setTimeout(() => overlay.classList.add('open'), 10);
    document.body.style.overflow = 'hidden';

    const close = () => {
      overlay.classList.remove('open');
      setTimeout(() => { overlay.remove(); document.body.style.overflow = ''; }, 300);
    };

    overlay.querySelector('#confirmClose').addEventListener('click', close);
    overlay.querySelector('#confirmCancel').addEventListener('click', close);
    overlay.querySelector('#confirmOk').addEventListener('click', () => {
      close();
      if (typeof onConfirm === 'function') onConfirm();
    });
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  }

  /* ── Toast notifications ────────────────────────────────── */
  function toast(message, type = 'success', duration = 3500) {
    const existing = document.querySelectorAll('.sb-toast');
    existing.forEach(t => t.remove());

    const el = document.createElement('div');
    el.className = 'sb-toast';

    const colors = {
      success: { bg: '#10B981', icon: '✓' },
      error:   { bg: '#EF4444', icon: '✕' },
      info:    { bg: '#2563EB', icon: 'ℹ' },
      warning: { bg: '#F59E0B', icon: '⚠' }
    };
    const { bg, icon } = colors[type] || colors.info;

    el.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: ${bg};
      color: #fff;
      padding: 14px 20px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      display: flex;
      align-items: center;
      gap: 10px;
      z-index: 9999;
      transform: translateY(80px);
      transition: transform 0.3s cubic-bezier(0.175,0.885,0.32,1.275);
      max-width: 360px;
    `;

    el.innerHTML = `<span style="font-size:1.1rem">${icon}</span><span>${message}</span>`;
    document.body.appendChild(el);

    setTimeout(() => { el.style.transform = 'translateY(0)'; }, 10);
    setTimeout(() => {
      el.style.transform = 'translateY(80px)';
      setTimeout(() => el.remove(), 300);
    }, duration);
  }

  /* ── Init ────────────────────────────────────────────────── */
  function init() {
    bindCloseButtons();
    bindEscapeKey();
    bindTriggers();
  }

  // Expose bindTriggers so it can be called after dynamic DOM updates
  window.SkillBridge = window.SkillBridge || {};
  window.SkillBridge.PaymentModal = {
    open: openPaymentModal,
    close: () => closeModal('payment'),
    bindTriggers
  };
  window.SkillBridge.Modal  = { open: openModal, close: closeModal, closeAll: closeAllModals };
  window.SkillBridge.Toast  = toast;
  window.SkillBridge.Confirm = openConfirm;

  return { init, openModal, closeModal, openPaymentModal, bindTriggers, toast };
})();

document.addEventListener('DOMContentLoaded', SkillBridgeModal.init);
