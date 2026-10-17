document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const fields = ['name', 'email', 'phone', 'message', 'password', 'confirmPassword', 'agree'];
  const status = document.getElementById('formStatus');
  const password = document.getElementById('password');
  const phone = document.getElementById('phone');
  const phoneMethod = document.getElementById('contactPhone');
  let submitted = false;

  function getError(id) {
    const field = document.getElementById(id);
    const value = field.value.trim();

    if (id === 'name' && !value) return 'Enter your name; spaces alone are not enough.';
    if (id === 'email') {
      if (!value) return 'Enter your email address.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || field.validity.typeMismatch) return 'Enter a valid email address, for example name@example.com.';
    }
    if (id === 'phone') {
      if (phoneMethod.checked && !value) return 'Enter your phone number when Phone is selected.';
      const digits = value.replace(/\D/g, '');
      if (value && (!/^\+?[\d\s().-]+$/.test(value) || digits.length < 7 || digits.length > 15)) {
        return 'Enter a phone number with 7–15 digits; use only spaces, +, brackets or hyphens as separators.';
      }
    }
    if (id === 'message' && !value) return 'Enter your message; spaces alone are not enough.';
    if (id === 'password') {
      if (!value) return 'Enter a made-up password for this demonstration.';
      if (field.value.length < 8) return 'Use at least 8 characters for the demo password.';
    }
    if (id === 'confirmPassword') {
      if (!value) return 'Confirm your demo password.';
      if (field.value !== password.value) return 'The demo passwords do not match.';
    }
    if (id === 'agree' && !field.checked) return 'Confirm that you understand this is a demonstration form.';
    return '';
  }

  function validateField(id) {
    const field = document.getElementById(id);
    const error = document.getElementById(id + 'Error');
    const message = getError(id);
    field.classList.toggle('is-invalid', Boolean(message));
    field.setAttribute('aria-invalid', String(Boolean(message)));
    error.textContent = message;
    error.classList.toggle('d-block', Boolean(message));
    return !message;
  }

  function updatePhoneRequirement() {
    phone.required = phoneMethod.checked;
    document.getElementById('phoneRequirement').textContent = phone.required ? '(required)' : '(optional)';
    if (submitted) validateField('phone');
  }

  fields.forEach(id => {
    const field = document.getElementById(id);
    field.addEventListener('input', () => {
      status.textContent = '';
      if (submitted) {
        validateField(id);
        if (id === 'password') validateField('confirmPassword');
      }
    });
    field.addEventListener('change', () => {
      if (submitted) validateField(id);
    });
  });

  form.querySelectorAll('input[name="method"]').forEach(radio => {
    radio.addEventListener('change', () => {
      status.textContent = '';
      updatePhoneRequirement();
    });
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    submitted = true;
    ['name', 'email', 'phone', 'message'].forEach(id => {
      const field = document.getElementById(id);
      field.value = field.value.trim();
    });
    const invalidFields = fields.filter(id => !validateField(id));

    if (invalidFields.length) {
      status.textContent = 'Please correct the highlighted fields and submit again.';
      document.getElementById(invalidFields[0]).focus();
      return;
    }

    status.textContent = 'Validation successful. This is a local demonstration; no information was sent. Demo passwords have been cleared.';
    password.value = '';
    document.getElementById('confirmPassword').value = '';
    submitted = false;
  });

  updatePhoneRequirement();
});
