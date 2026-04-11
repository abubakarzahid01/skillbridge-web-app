/* ============================================================
   SkillBridge - Auth JS (auth.js)
   Login + Signup validation, password toggle, role selection
   ============================================================ */

/* ── Auth namespace ─────────────────────────────────────────── */
const SkillBridgeAuth = (function () {

  /* ── Utilities ──────────────────────────────────────────── */
  function showError(inputEl, errorEl, message) {
    if (inputEl)  inputEl.classList.add('error');
    if (errorEl)  { errorEl.textContent = message; errorEl.classList.add('visible'); }
  }

  function clearError(inputEl, errorEl) {
    if (inputEl)  inputEl.classList.remove('error');
    if (errorEl)  { errorEl.textContent = ''; errorEl.classList.remove('visible'); }
  }

  function clearAllErrors(form) {
    form.querySelectorAll('.form-input.error, .form-select.error').forEach(el => el.classList.remove('error'));
    form.querySelectorAll('.field-error.visible').forEach(el => {
      el.textContent = '';
      el.classList.remove('visible');
    });
    const globalError = form.querySelector('.auth-error');
    if (globalError) globalError.classList.remove('visible');
  }

  function showGlobalError(form, message) {
    const el = form.querySelector('.auth-error');
    if (el) { el.textContent = message; el.classList.add('visible'); }
  }

  function showGlobalSuccess(form, message) {
    const el = form.querySelector('.auth-success');
    if (el) { el.textContent = message; el.classList.add('visible'); }
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isStrongPassword(pw) {
    return pw.length >= 8 && /[A-Z]/.test(pw) && /[0-9]/.test(pw);
  }

  /* ── Password Toggle ─────────────────────────────────────── */
  function initPasswordToggles() {
    document.querySelectorAll('.password-toggle').forEach(btn => {
      btn.addEventListener('click', function () {
        const field = this.previousElementSibling || this.closest('.password-field')?.querySelector('.form-input');
        if (!field) return;
        if (field.type === 'password') {
          field.type = 'text';
          this.textContent = '🙈';
          this.setAttribute('aria-label', 'Hide password');
        } else {
          field.type = 'password';
          this.textContent = '👁️';
          this.setAttribute('aria-label', 'Show password');
        }
      });
    });
  }

  /* ── Password Strength ───────────────────────────────────── */
  function initPasswordStrength() {
    const pwInput     = document.getElementById('password');
    const strengthBar = document.querySelector('.password-strength__fill');
    const strengthLbl = document.querySelector('.password-strength__label');
    if (!pwInput || !strengthBar) return;

    pwInput.addEventListener('input', function () {
      const val      = this.value;
      const strength = getStrength(val);

      strengthBar.className = 'password-strength__fill ' + strength.cls;
      if (strengthLbl) strengthLbl.textContent = val ? strength.label : '';
    });
  }

  function getStrength(pw) {
    if (!pw) return { cls: '', label: '' };
    let score = 0;
    if (pw.length >= 8)  score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 2) return { cls: 'weak',   label: 'Weak — add uppercase & numbers' };
    if (score <= 3) return { cls: 'medium', label: 'Moderate — good start'          };
    return            { cls: 'strong', label: 'Strong password ✓'                };
  }

  /* ── Role Selection (Signup) ─────────────────────────────── */
  function initRoleSelection() {
    const roleInputs = document.querySelectorAll('.role-option input[type="radio"]');
    const companyField = document.getElementById('companyFieldGroup');
    const skillsField  = document.getElementById('skillsFieldGroup');
    const uniField     = document.getElementById('universityFieldGroup');

    roleInputs.forEach(input => {
      input.addEventListener('change', function () {
        updateRoleFields(this.value);
      });
    });

    function updateRoleFields(role) {
      if (!companyField) return;
      if (role === 'student') {
        companyField.style.display = 'none';
        if (skillsField) skillsField.style.display = 'block';
        if (uniField)    uniField.style.display    = 'block';
      } else {
        companyField.style.display = 'block';
        if (skillsField) skillsField.style.display = 'none';
        if (uniField)    uniField.style.display    = 'none';
      }
    }
  }

  /* ── Login Form ─────────────────────────────────────────────
     TODO: Replace form submit handler with:
     fetch('/api/auth/login', { method:'POST', body: JSON.stringify({email, password}), headers: {'Content-Type':'application/json'} })
       .then(res => res.json())
       .then(data => { localStorage.setItem('sb_token', data.token); window.location.href = 'dashboard.html'; })
       .catch(err => showGlobalError(form, 'Login failed. Please try again.'));
  ─────────────────────────────────────────────────────────── */
  function initLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearAllErrors(form);

      const emailInput = form.querySelector('#email');
      const pwInput    = form.querySelector('#password');
      const emailError = form.querySelector('#emailError');
      const pwError    = form.querySelector('#passwordError');

      let valid = true;

      if (!emailInput.value.trim()) {
        showError(emailInput, emailError, 'Email is required.');
        valid = false;
      } else if (!isValidEmail(emailInput.value.trim())) {
        showError(emailInput, emailError, 'Please enter a valid email address.');
        valid = false;
      }

      if (!pwInput.value) {
        showError(pwInput, pwError, 'Password is required.');
        valid = false;
      }

      if (!valid) return;

      const submitBtn = form.querySelector('.auth-submit');
      setLoading(submitBtn, true);

      SB.AuthAPI.login(emailInput.value.trim(), pwInput.value)
        .then(() => {
          showGlobalSuccess(form, 'Login successful! Redirecting to dashboard...');
          setTimeout(() => { window.location.href = 'dashboard.html'; }, 1000);
        })
        .catch(err => {
          setLoading(submitBtn, false);
          showGlobalError(form, err.message || 'Invalid credentials. Please check your email and password.');
        });
    });

    // Real-time validation
    const emailInput = form.querySelector('#email');
    const emailError = form.querySelector('#emailError');
    if (emailInput) {
      emailInput.addEventListener('blur', function () {
        if (this.value && !isValidEmail(this.value)) {
          showError(this, emailError, 'Please enter a valid email address.');
        } else {
          clearError(this, emailError);
        }
      });
    }
  }

  /* ── Signup Form ────────────────────────────────────────────
     TODO: Replace submit handler with:
     fetch('/api/auth/signup', { method:'POST', body: JSON.stringify(formData), headers: {'Content-Type':'application/json'} })
       .then(res => res.json())
       .then(data => { window.location.href = 'dashboard.html'; })
       .catch(err => showGlobalError(form, err.message));
  ─────────────────────────────────────────────────────────── */
  function initSignupForm() {
    const form = document.getElementById('signupForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearAllErrors(form);

      const fields = {
        fullName: { el: form.querySelector('#fullName'),   err: form.querySelector('#fullNameError')  },
        email:    { el: form.querySelector('#email'),      err: form.querySelector('#emailError')     },
        password: { el: form.querySelector('#password'),   err: form.querySelector('#passwordError')  },
        confirm:  { el: form.querySelector('#confirmPw'),  err: form.querySelector('#confirmPwError') },
        terms:    { el: form.querySelector('#terms') }
      };

      let valid = true;

      if (!fields.fullName.el?.value.trim() || fields.fullName.el.value.trim().split(' ').length < 2) {
        showError(fields.fullName.el, fields.fullName.err, 'Please enter your full name (first and last).');
        valid = false;
      }

      if (!fields.email.el?.value.trim()) {
        showError(fields.email.el, fields.email.err, 'Email is required.');
        valid = false;
      } else if (!isValidEmail(fields.email.el.value.trim())) {
        showError(fields.email.el, fields.email.err, 'Please enter a valid email address.');
        valid = false;
      }

      if (!fields.password.el?.value) {
        showError(fields.password.el, fields.password.err, 'Password is required.');
        valid = false;
      } else if (!isStrongPassword(fields.password.el.value)) {
        showError(fields.password.el, fields.password.err, 'Password must be 8+ characters with at least one uppercase letter and one number.');
        valid = false;
      }

      if (fields.confirm.el && fields.password.el && fields.confirm.el.value !== fields.password.el.value) {
        showError(fields.confirm.el, fields.confirm.err, 'Passwords do not match.');
        valid = false;
      }

      if (fields.terms.el && !fields.terms.el.checked) {
        showGlobalError(form, 'You must agree to the Terms of Service to create an account.');
        valid = false;
      }

      if (!valid) return;

      const submitBtn = form.querySelector('.auth-submit');
      setLoading(submitBtn, true);

      // Collect form data (ready for backend)
      const formData = {
        fullName:   fields.fullName.el?.value.trim(),
        email:      fields.email.el?.value.trim(),
        password:   fields.password.el?.value,
        role:       form.querySelector('.role-option input:checked')?.value || 'student',
        university: form.querySelector('#university')?.value.trim() || null,
        company:    form.querySelector('#company')?.value.trim() || null,
        industry:   form.querySelector('#industry')?.value || null,
      };

      SB.AuthAPI.signup(formData.fullName, formData.email, formData.password)
        .then(() => {
          showGlobalSuccess(form, 'Account created! Welcome to SkillBridge. Redirecting...');
          setTimeout(() => { window.location.href = 'dashboard.html'; }, 1000);
        })
        .catch(err => {
          setLoading(submitBtn, false);
          showGlobalError(form, err.message || 'Signup failed. Please try again.');
        });
    });

    // Real-time confirm password check
    const confirmInput = form.querySelector('#confirmPw');
    const confirmError = form.querySelector('#confirmPwError');
    const pwInput      = form.querySelector('#password');
    if (confirmInput) {
      confirmInput.addEventListener('input', function () {
        if (this.value && pwInput && this.value !== pwInput.value) {
          showError(this, confirmError, 'Passwords do not match.');
        } else {
          clearError(this, confirmError);
        }
      });
    }
  }

  /* ── Loading state ──────────────────────────────────────────*/
  function setLoading(btn, state) {
    if (!btn) return;
    if (state) {
      btn.classList.add('loading');
      btn.disabled = true;
    } else {
      btn.classList.remove('loading');
      btn.disabled = false;
    }
  }

  /* ── Forgot Password (placeholder) ─────────────────────────
     TODO: Call → POST /api/auth/forgot-password { email }
  ─────────────────────────────────────────────────────────── */
  function initForgotPassword() {
    const link = document.querySelector('.auth-forgot');
    if (!link) return;
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const email = document.getElementById('email')?.value.trim();
      if (!email || !isValidEmail(email)) {
        alert('Please enter your email address first, then click Forgot Password.');
        return;
      }
      alert(`Password reset instructions will be sent to: ${email}\n\n(Backend integration pending)`);
    });
  }

  /* ── Init ────────────────────────────────────────────────── */
  function init() {
    initPasswordToggles();
    initPasswordStrength();
    initRoleSelection();
    initLoginForm();
    initSignupForm();
    initForgotPassword();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', SkillBridgeAuth.init);
