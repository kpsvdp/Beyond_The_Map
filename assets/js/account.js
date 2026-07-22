(function () {
  const editor = document.getElementById('profileEditor');
  const editButton = document.getElementById('editProfileBtn');
  const cancelButton = document.getElementById('cancelProfileEdit');
  const status = document.getElementById('profileSaveStatus');
  if (!editor || !editButton) return;

  const storageKey = 'btm_explorer_profile';
  const fields = {
    firstName: document.getElementById('profileFirstNameInput'),
    middleName: document.getElementById('profileMiddleNameInput'),
    surname: document.getElementById('profileSurnameInput'),
    email: document.getElementById('profileEmailInput'),
    username: document.getElementById('profileUsernameInput'),
    accountType: document.getElementById('profileTypeInput'),
    gender: document.getElementById('profileGenderInput'),
    dateOfBirth: document.getElementById('profileDobInput'),
    nationality: document.getElementById('profileNationalityInput'),
    location: document.getElementById('profileLocationInput'),
    currency: document.getElementById('profileCurrencyInput')
  };

  const defaultProfile = {
    firstName: 'Pavan',
    middleName: '',
    surname: '',
    email: '',
    username: '',
    accountType: 'Global Explorer',
    gender: '',
    dateOfBirth: '',
    nationality: 'Indian',
    location: 'United Kingdom',
    currency: 'GBP (£)'
  };

  function readProfile() {
    try {
      return Object.assign({}, defaultProfile, JSON.parse(localStorage.getItem(storageKey) || '{}'));
    } catch (error) {
      return Object.assign({}, defaultProfile);
    }
  }

  function fullName(profile) {
    return [profile.firstName, profile.middleName, profile.surname].filter(Boolean).join(' ') || 'Pavan';
  }

  function updateText(id, value) {
    const node = document.getElementById(id);
    if (node) node.textContent = value;
  }

  function renderProfile(profile) {
    const name = fullName(profile);
    updateText('profileName', name);
    updateText('profileNameValue', name);
    updateText('profileTypeValue', profile.accountType);
    updateText('profileNationalityValue', `🇮🇳 ${profile.nationality}`);
    updateText('profileLocationValue', `🇬🇧 ${profile.location}`);
    updateText('profileCurrencyValue', profile.currency);

    const typeBadge = document.querySelector('.profile-status');
    if (typeBadge) typeBadge.textContent = profile.accountType;

    const identityLine = document.querySelector('.profile-identity-copy > p');
    if (identityLine) identityLine.textContent = `${profile.nationality} traveller based in ${profile.location}`;

    const username = document.getElementById('profileUsername');
    if (username) {
      username.textContent = profile.username ? `@${profile.username}` : '';
      username.hidden = !profile.username;
    }
  }

  function populateForm(profile) {
    Object.keys(fields).forEach((key) => {
      if (fields[key]) fields[key].value = profile[key] || '';
    });
  }

  function setEditorOpen(open) {
    editor.hidden = !open;
    editButton.setAttribute('aria-expanded', String(open));
    editButton.textContent = open ? '✕ Close Editor' : '✎ Edit Profile';
    if (status) status.textContent = '';
    if (open && fields.firstName) fields.firstName.focus();
  }

  let profile = readProfile();
  populateForm(profile);
  renderProfile(profile);

  editButton.addEventListener('click', function () {
    setEditorOpen(editor.hidden);
  });

  if (cancelButton) {
    cancelButton.addEventListener('click', function () {
      populateForm(profile);
      setEditorOpen(false);
    });
  }

  editor.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!editor.reportValidity()) return;

    profile = Object.keys(fields).reduce((result, key) => {
      result[key] = fields[key] ? fields[key].value.trim() : '';
      return result;
    }, {});

    localStorage.setItem(storageKey, JSON.stringify(profile));
    try {
      const credentialsKey = 'btm_explorer_credentials';
      const credentials = JSON.parse(localStorage.getItem(credentialsKey) || '{}');
      if (credentials.password) {
        credentials.email = profile.email.toLowerCase();
        credentials.username = profile.username.toLowerCase();
        localStorage.setItem(credentialsKey, JSON.stringify(credentials));
      }
      localStorage.setItem('btm_user', profile.username);
    } catch (error) {
      localStorage.setItem('btm_user', profile.username);
    }
    renderProfile(profile);
    if (status) status.textContent = 'Account details saved on this device.';
    editButton.textContent = '✎ Edit Profile';
    editButton.setAttribute('aria-expanded', 'false');
    window.setTimeout(function () {
      editor.hidden = true;
    }, 700);
  });
})();
