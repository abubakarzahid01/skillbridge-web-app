/* ============================================================
   SkillBridge - Payment JS (payment.js)
   Payment method switching, card formatting, form validation,
   promo codes, payment processing simulation
   ============================================================ */

const SkillBridgePayment = (function () {

  /* ── State ──────────────────────────────────────────────────
     TODO: Replace with real gateway SDK initialisation
     e.g. Stripe: const stripe = Stripe('pk_live_...');
  ─────────────────────────────────────────────────────────── */
  let currentMethod = 'card';

  const PROMO_CODES = {
    'SKILL20':  { discount: 0.20, label: '20% off' },
    'STUDENT10': { discount: 0.10, label: '10% student discount' },
    'WELCOME15': { discount: 0.15, label: '15% welcome offer' }
  };

  /* ── Payment Method Tabs ────────────────────────────────────*/
  function initMethodTabs() {
    const tabs = document.querySelectorAll('.payment-method-tab');
    if (!tabs.length) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', function () {
        tabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        currentMethod = this.dataset.method;
        switchPaymentMethod(currentMethod);
      });
    });
  }

  function switchPaymentMethod(method) {
    // Hide all sections
    document.querySelectorAll('.payment-form-section[data-method]').forEach(el => {
      el.style.display = 'none';
    });

    // Show active section
    const active = document.querySelector(`.payment-form-section[data-method="${method}"]`);
    if (active) active.style.display = 'block';

    // Update pay button label
    const payBtn = document.querySelector('.pay-btn .pay-btn__text');
    if (payBtn) {
      const labels = {
        card:    'Pay Now',
        apple:   'Pay with Apple Pay',
        google:  'Pay with Google Pay',
        paypal:  'Continue to PayPal'
      };
      payBtn.textContent = labels[method] || 'Pay Now';
    }
  }

  /* ── Card Number Formatting ─────────────────────────────────*/
  function initCardFormatting() {
    const cardInput = document.getElementById('cardNumber');
    if (!cardInput) return;

    cardInput.addEventListener('input', function () {
      let val = this.value.replace(/\D/g, '').substring(0, 16);
      // Group into 4s
      val = val.match(/.{1,4}/g)?.join(' ') || val;
      this.value = val;
      updateCardBrand(val.replace(/\s/g, ''));
    });

    cardInput.addEventListener('keydown', function (e) {
      // Allow backspace to properly delete formatted chars
      if (e.key === 'Backspace' && this.value.endsWith(' ')) {
        this.value = this.value.slice(0, -1);
      }
    });
  }

  function updateCardBrand(number) {
    const icon = document.getElementById('cardBrandIcon');
    if (!icon) return;

    if      (/^4/.test(number))      icon.textContent = '💳'; // Visa
    else if (/^5[1-5]/.test(number)) icon.textContent = '💳'; // Mastercard
    else if (/^3[47]/.test(number))  icon.textContent = '💳'; // Amex
    else                             icon.textContent = '💳';
  }

  /* ── Expiry Date Formatting ──────────────────────────────── */
  function initExpiryFormatting() {
    const expiryInput = document.getElementById('expiryDate');
    if (!expiryInput) return;

    expiryInput.addEventListener('input', function () {
      let val = this.value.replace(/\D/g, '').substring(0, 4);
      if (val.length >= 3) {
        val = val.substring(0, 2) + '/' + val.substring(2);
      }
      this.value = val;
    });
  }

  /* ── CVV Mask ────────────────────────────────────────────── */
  function initCVV() {
    const cvvInput = document.getElementById('cvvCode');
    if (!cvvInput) return;

    cvvInput.addEventListener('input', function () {
      this.value = this.value.replace(/\D/g, '').substring(0, 4);
    });
  }

  /* ── Promo Code ──────────────────────────────────────────── */
  function initPromoCode() {
    const applyBtn = document.getElementById('applyPromo');
    const promoInput = document.getElementById('promoInput');
    const promoMsg   = document.getElementById('promoMsg');
    const discountRow = document.getElementById('discountRow');
    const discountVal = document.getElementById('discountValue');
    const totalEl     = document.getElementById('totalAmount');

    if (!applyBtn || !promoInput) return;

    applyBtn.addEventListener('click', function () {
      const code = promoInput.value.trim().toUpperCase();
      const promo = PROMO_CODES[code];

      if (promo) {
        // Apply discount
        const basePrice = parseFloat(document.getElementById('basePrice')?.dataset.price || 0);
        const discount  = basePrice * promo.discount;
        const newTotal  = basePrice - discount;

        if (discountRow) discountRow.style.display = 'flex';
        if (discountVal) discountVal.textContent = `-£${discount.toFixed(2)} (${promo.label})`;
        if (totalEl)     totalEl.textContent = `£${newTotal.toFixed(2)}`;

        if (promoMsg) {
          promoMsg.textContent = `✓ Promo code applied: ${promo.label}`;
          promoMsg.style.color = 'var(--success)';
          promoMsg.style.display = 'block';
        }
        promoInput.style.borderColor = 'var(--success)';
        applyBtn.textContent = 'Applied ✓';
        applyBtn.style.color = 'var(--success)';
        applyBtn.disabled = true;
      } else {
        if (promoMsg) {
          promoMsg.textContent = 'Invalid promo code. Please try again.';
          promoMsg.style.color = 'var(--danger)';
          promoMsg.style.display = 'block';
        }
        promoInput.style.borderColor = 'var(--danger)';
        setTimeout(() => {
          promoInput.style.borderColor = '';
          if (promoMsg) promoMsg.style.display = 'none';
        }, 3000);
      }
    });

    // Enter key for promo
    if (promoInput) {
      promoInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') applyBtn.click();
      });
    }
  }

  /* ── Form Validation ────────────────────────────────────────*/
  function validateCardForm() {
    const cardHolder = document.getElementById('cardHolder')?.value.trim();
    const cardNumber = document.getElementById('cardNumber')?.value.replace(/\s/g, '');
    const expiry     = document.getElementById('expiryDate')?.value.trim();
    const cvv        = document.getElementById('cvvCode')?.value.trim();

    const errors = [];

    if (!cardHolder || cardHolder.split(' ').length < 2) {
      errors.push({ id: 'cardHolder', msg: 'Please enter the full name on your card.' });
    }

    if (!cardNumber || cardNumber.length < 13) {
      errors.push({ id: 'cardNumber', msg: 'Please enter a valid card number.' });
    }

    if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) {
      errors.push({ id: 'expiryDate', msg: 'Enter expiry in MM/YY format.' });
    } else {
      const [mm, yy] = expiry.split('/').map(Number);
      const now      = new Date();
      const cardExp  = new Date(2000 + yy, mm - 1);
      if (mm < 1 || mm > 12 || cardExp < now) {
        errors.push({ id: 'expiryDate', msg: 'Card has expired or invalid date.' });
      }
    }

    if (!cvv || cvv.length < 3) {
      errors.push({ id: 'cvvCode', msg: 'Enter a valid CVV.' });
    }

    return errors;
  }

  function showFieldErrors(errors) {
    // Clear previous
    document.querySelectorAll('.payment-form__input.error').forEach(el => el.classList.remove('error'));
    document.querySelectorAll('.payment-field-error').forEach(el => el.remove());

    errors.forEach(err => {
      const input = document.getElementById(err.id);
      if (!input) return;
      input.classList.add('error');
      const errEl = document.createElement('div');
      errEl.className = 'payment-field-error';
      errEl.style.cssText = 'font-size:11px;color:var(--danger);margin-top:4px';
      errEl.textContent = err.msg;
      input.parentNode.insertBefore(errEl, input.nextSibling);
    });

    if (errors.length) {
      document.getElementById(errors[0].id)?.focus();
    }
  }

  /* ── Pay Button Handler ─────────────────────────────────────
     TODO: Replace simulation with real gateway call:

     Stripe example:
     const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
       payment_method: { card: cardElement, billing_details: { name: cardHolder } }
     });

     Then call backend:
     await fetch('/api/payments/confirm', {
       method: 'POST',
       body: JSON.stringify({ paymentIntentId: paymentIntent.id, orderId }),
       headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
     });
  ─────────────────────────────────────────────────────────── */
  function initPayButton() {
    const payBtn = document.querySelector('.pay-btn');
    if (!payBtn) return;

    payBtn.addEventListener('click', function () {
      // Clear errors
      document.querySelectorAll('.payment-field-error').forEach(el => el.remove());
      document.querySelectorAll('.payment-form__input.error').forEach(el => el.classList.remove('error'));

      // For card method, validate form
      if (currentMethod === 'card') {
        const errors = validateCardForm();
        if (errors.length) {
          showFieldErrors(errors);
          return;
        }
      }

      // Loading state
      payBtn.classList.add('loading');
      payBtn.disabled = true;

      // ── TODO: Initiate real payment gateway call here ──
      // Simulated processing delay
      setTimeout(() => {
        payBtn.classList.remove('loading');
        payBtn.disabled = false;
        showSuccessModal();
      }, 2200);
    });
  }

  /* ── Success Modal ───────────────────────────────────────── */
  function showSuccessModal() {
    const modal   = document.getElementById('paymentModal');
    const success = document.getElementById('paymentSuccess');
    const form    = document.getElementById('paymentFormWrapper');
    const header  = document.querySelector('.modal__header');

    if (success) {
      if (form)   form.style.display   = 'none';
      if (header) header.style.display = 'none';
      success.style.display = 'block';

      // Generate reference number
      const ref = 'SB-' + Date.now().toString(36).toUpperCase();
      const refEl = document.getElementById('paymentRef');
      if (refEl) refEl.textContent = ref;

      // TODO: Save payment record → POST /api/payments/record
      //       with orderId, amount, method, ref
    }
  }

  /* ── Modal Triggers (buy now buttons) ───────────────────────
     This is also initialised from modal.js — kept here as backup
  ─────────────────────────────────────────────────────────── */
  function populateOrderSummary(data) {
    const nameEl  = document.getElementById('modalItemName');
    const descEl  = document.getElementById('modalItemDesc');
    const priceEl = document.getElementById('modalItemPrice');
    const baseEl  = document.getElementById('basePrice');
    const totalEl = document.getElementById('totalAmount');

    if (nameEl)  nameEl.textContent  = data.name  || 'Item';
    if (descEl)  descEl.textContent  = data.desc  || '';
    if (priceEl) priceEl.textContent = data.price || '£0';
    if (baseEl) {
      baseEl.dataset.price = parseFloat(data.price?.replace('£','') || 0);
      baseEl.textContent = data.price || '£0';
    }
    if (totalEl) totalEl.textContent = data.price || '£0';
  }

  /* ── Init ───────────────────────────────────────────────── */
  function init() {
    initMethodTabs();
    initCardFormatting();
    initExpiryFormatting();
    initCVV();
    initPromoCode();
    initPayButton();

    // Show card section by default
    switchPaymentMethod('card');
  }

  return { init, populateOrderSummary, showSuccessModal };
})();

document.addEventListener('DOMContentLoaded', SkillBridgePayment.init);
