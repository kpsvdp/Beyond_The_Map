(function () {
  const profileKey = 'btm_explorer_profile';
  const credentialsKey = 'btm_explorer_credentials';
  const status = document.getElementById('authStatus');
  const showStatus = (message, error) => { if (status) { status.textContent = message; status.classList.toggle('is-error', Boolean(error)); } };
  const read = (key) => { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch (error) { return null; } };

  const registerForm = document.getElementById('registerForm');
  if (registerForm) registerForm.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!registerForm.reportValidity()) return;
    const data = new FormData(registerForm);
    const profile = {};
    ['firstName','middleName','surname','email','username','accountType','gender','dateOfBirth','nationality','location','currency'].forEach((key) => { profile[key] = String(data.get(key) || '').trim(); });
    localStorage.setItem(profileKey, JSON.stringify(profile));
    localStorage.setItem(credentialsKey, JSON.stringify({ email: profile.email.toLowerCase(), username: profile.username.toLowerCase(), password: String(data.get('password')) }));
    localStorage.setItem('btm_user', profile.username);
    showStatus('Account created. Opening your dashboard…');
    window.setTimeout(function () { location.href = 'dashboard.html'; }, 500);
  });

  const loginForm = document.getElementById('loginForm');
  if (loginForm) loginForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const saved = read(credentialsKey);
    if (!saved) { showStatus('No account was found. Create an account first.', true); return; }
    const data = new FormData(loginForm);
    const identity = String(data.get('identity') || '').trim().toLowerCase();
    const password = String(data.get('password') || '');
    if ((identity !== saved.email && identity !== saved.username) || password !== saved.password) { showStatus('The username, email, or password is incorrect.', true); return; }
    localStorage.setItem('btm_user', saved.username);
    showStatus('Signed in. Opening your dashboard…');
    window.setTimeout(function () { location.href = 'dashboard.html'; }, 350);
  });

  const forgotForm = document.getElementById('forgotUsernameForm');
  if (forgotForm) forgotForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const profile = read(profileKey);
    const data = new FormData(forgotForm);
    const email = String(data.get('email') || '').trim().toLowerCase();
    const dob = String(data.get('dateOfBirth') || '');
    if (!profile || String(profile.email || '').toLowerCase() !== email || profile.dateOfBirth !== dob) { showStatus('Those details do not match a saved traveller account.', true); return; }
    showStatus(`Your traveller username is: ${profile.username}`);
  });
})();
