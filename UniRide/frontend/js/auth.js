/* UniRide login / register behaviour */
(function () {
  'use strict';

  // Change this to match API_BASE_URL in your backend .env
  var API_BASE_URL = 'http://localhost:3001/api/v1';

  var DASHBOARDS = {
    student: 'student/dashboard.html',
    faculty: 'student/dashboard.html',
    transport_officer: 'staff/dashboard.html',
    driver: 'staff/dashboard.html',
    helper: 'staff/dashboard.html',
    admin: 'admin/dashboard.html'
  };

  var tabs = document.querySelectorAll('.auth-tab');
  var panels = {
    login: document.getElementById('panel-login'),
    register: document.getElementById('panel-register')
  };
  var switchToRegister = document.getElementById('switch-to-register');
  var switchToLogin = document.getElementById('switch-to-login');
  var footerText = document.getElementById('auth-footer-text');
  var footerTextLogin = document.getElementById('auth-footer-text-login');

  function showTab(name) {
    tabs.forEach(function (t) {
      var active = t.dataset.tab === name;
      t.classList.toggle('auth-tab--active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    Object.keys(panels).forEach(function (key) {
      var on = key === name;
      panels[key].hidden = !on;
      panels[key].classList.toggle('auth-panel--active', on);
    });
    var reg = name === 'register';
    footerText.hidden = reg;
    switchToRegister.hidden = reg;
    footerTextLogin.hidden = !reg;
    switchToLogin.hidden = !reg;
    document.title = (reg ? 'Register' : 'Sign In') + ' - UniRide';
  }

  tabs.forEach(function (t) {
    t.addEventListener('click', function () { showTab(t.dataset.tab); });
  });
  switchToRegister.addEventListener('click', function (e) { e.preventDefault(); showTab('register'); });
  switchToLogin.addEventListener('click', function (e) { e.preventDefault(); showTab('login'); });

  var params = new URLSearchParams(window.location.search);
  showTab(params.get('register') === 'true' ? 'register' : 'login');

  // Password visibility toggles
  document.querySelectorAll('.form-input-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var input = document.getElementById(btn.dataset.target);
      if (!input) return;
      var show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.classList.toggle('is-visible', show);
    });
  });

  // Helpers
  function showError(el, msg) {
    el.textContent = msg;
    el.hidden = false;
  }
  function clearError(el) {
    el.textContent = '';
    el.hidden = true;
  }
  function setBusy(btn, busy, label) {
    btn.disabled = busy;
    btn.textContent = busy ? 'Please wait…' : label;
  }
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function request(path, body) {
    return fetch(API_BASE_URL + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        if (!res.ok) throw new Error(data.message || 'Request failed (' + res.status + ')');
        return data;
      });
    });
  }

  function storeSession(data, remember) {
    var store = remember ? window.localStorage : window.sessionStorage;
    try {
      store.setItem('uniride_token', data.token || '');
      store.setItem('uniride_user', JSON.stringify(data.user || {}));
    } catch (e) { /* storage unavailable */ }
  }

  // Login
  var loginForm = document.getElementById('login-form');
  var loginError = document.getElementById('login-error');
  var loginBtn = document.getElementById('login-submit');

  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    clearError(loginError);
    var email = document.getElementById('login-email').value.trim();
    var password = document.getElementById('login-password').value;
    var remember = document.getElementById('login-remember').checked;

    if (!EMAIL_RE.test(email)) return showError(loginError, 'Please enter a valid email address.');
    if (!password) return showError(loginError, 'Please enter your password.');

    setBusy(loginBtn, true, 'Sign In');
    request('/auth/login', { email: email, password: password })
      .then(function (data) {
        storeSession(data, remember);
        var role = (data.user && data.user.role) || 'student';
        window.location.href = DASHBOARDS[role] || DASHBOARDS.student;
      })
      .catch(function (err) {
        showError(loginError, err.message === 'Failed to fetch'
          ? 'Cannot reach the server. Make sure the backend is running.'
          : err.message);
      })
      .finally(function () { setBusy(loginBtn, false, 'Sign In'); });
  });

  // Register
  var registerForm = document.getElementById('register-form');
  var registerError = document.getElementById('register-error');
  var registerBtn = document.getElementById('register-submit');

  registerForm.addEventListener('submit', function (e) {
    e.preventDefault();
    clearError(registerError);
    var v = function (id) { return document.getElementById(id).value.trim(); };
    var role = document.getElementById('register-role').value;
    var firstName = v('register-firstName');
    var lastName = v('register-lastName');
    var email = v('register-email');
    var studentId = v('register-studentId');
    var password = document.getElementById('register-password').value;
    var confirm = document.getElementById('register-confirmPassword').value;
    var terms = document.getElementById('register-terms').checked;

    if (!role) return showError(registerError, 'Please select your role.');
    if (!firstName || !lastName) return showError(registerError, 'Please enter your first and last name.');
    if (!EMAIL_RE.test(email)) return showError(registerError, 'Please enter a valid university email.');
    if (!studentId) return showError(registerError, 'Please enter your Student/Staff ID.');
    if (password.length < 8) return showError(registerError, 'Password must be at least 8 characters.');
    if (password !== confirm) return showError(registerError, 'Passwords do not match.');
    if (!terms) return showError(registerError, 'You must accept the Terms of Service and Privacy Policy.');

    setBusy(registerBtn, true, 'Create Account');
    request('/auth/register', {
      role: role, firstName: firstName, lastName: lastName,
      email: email, studentId: studentId, password: password
    })
      .then(function () {
        showTab('login');
        document.getElementById('login-email').value = email;
        showError(loginError, 'Account created. Please sign in.');
        loginError.classList.add('auth-alert--success');
      })
      .catch(function (err) {
        showError(registerError, err.message === 'Failed to fetch'
          ? 'Cannot reach the server. Make sure the backend is running.'
          : err.message);
      })
      .finally(function () { setBusy(registerBtn, false, 'Create Account'); });
  });

  // Clear the success styling once the user starts typing again
  loginForm.addEventListener('input', function () {
    loginError.classList.remove('auth-alert--success');
  });

  // Forgot password (placeholder until the reset endpoint exists)
  document.getElementById('forgot-password-link').addEventListener('click', function (e) {
    e.preventDefault();
    var email = document.getElementById('login-email').value.trim();
    if (!EMAIL_RE.test(email)) return showError(loginError, 'Enter your email above first, then click "Forgot password?".');
    request('/auth/forgot-password', { email: email })
      .then(function () {
        showError(loginError, 'If that email exists, a reset link has been sent.');
        loginError.classList.add('auth-alert--success');
      })
      .catch(function (err) { showError(loginError, err.message); });
  });
})();
