document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.faq-question').forEach(button => {
    const answer = document.getElementById(button.getAttribute('aria-controls'));
    if (!answer) return;
    button.setAttribute('aria-expanded', 'false');
    answer.setAttribute('aria-hidden', 'true');
    answer.classList.remove('is-open');
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
      answer.setAttribute('aria-hidden', String(expanded));
      answer.classList.toggle('is-open', !expanded);
    });
  });

  const colors = [
    { value: '#fbf7f2', name: 'Cream' },
    { value: '#f5e8e5', name: 'Rose' },
    { value: '#edf1e8', name: 'Sage' },
    { value: '#efebf5', name: 'Lavender' }
  ];
  let colorIndex = 0;
  const colorButton = document.getElementById('changeBackground');
  if (colorButton) {
    colorButton.addEventListener('click', () => {
      colorIndex = (colorIndex + 1) % colors.length;
      document.body.style.backgroundColor = colors[colorIndex].value;
      document.getElementById('backgroundName').textContent = colors[colorIndex].name;
    });
  }

  const clocks = document.querySelectorAll('[data-current-time]');
  if (clocks.length) {
    const formatter = new Intl.DateTimeFormat('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true
    });
    function updateClock() {
      const now = new Date();
      clocks.forEach(clock => {
        clock.dateTime = now.toISOString();
        clock.textContent = formatter.format(now);
      });
    }
    updateClock();
    window.setInterval(updateClock, 1000);
  }

  const dialog = document.getElementById('subscriptionDialog');
  const openButton = document.getElementById('openSubscription');
  if (dialog && openButton) {
    const form = document.getElementById('subscriptionForm');
    const status = document.getElementById('subscriptionStatus');
    const inputs = Array.from(form.querySelectorAll('input[required]'));
    let submitted = false;

    function validateSubscriptionField(input) {
      const value = input.value.trim();
      let message = '';
      if (!value) message = input.type === 'email' ? 'Enter your email address.' : 'Enter your name.';
      else if (input.type === 'email' && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || input.validity.typeMismatch)) {
        message = 'Enter a valid email address, for example name@example.com.';
      }
      const error = document.getElementById(input.id + 'Error');
      input.classList.toggle('is-invalid', Boolean(message));
      input.setAttribute('aria-invalid', String(Boolean(message)));
      error.textContent = message;
      return !message;
    }

    function resetSubscription() {
      form.reset();
      submitted = false;
      status.textContent = '';
      inputs.forEach(input => {
        input.classList.remove('is-invalid');
        input.setAttribute('aria-invalid', 'false');
        document.getElementById(input.id + 'Error').textContent = '';
      });
    }

    openButton.addEventListener('click', () => {
      resetSubscription();
      dialog.showModal();
      document.body.classList.add('popup-open');
      inputs[0].focus();
    });
    document.getElementById('closeSubscription').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      const bounds = dialog.getBoundingClientRect();
      const outside = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
      if (event.target === dialog && outside) dialog.close();
    });
    dialog.addEventListener('close', () => {
      document.body.classList.remove('popup-open');
      resetSubscription();
      openButton.focus();
    });
    inputs.forEach(input => input.addEventListener('input', () => {
      status.textContent = '';
      if (submitted) validateSubscriptionField(input);
    }));
    form.addEventListener('submit', event => {
      event.preventDefault();
      submitted = true;
      inputs.forEach(input => { input.value = input.value.trim(); });
      const invalid = inputs.filter(input => !validateSubscriptionField(input));
      if (invalid.length) {
        status.textContent = 'Please correct the highlighted fields.';
        invalid[0].focus();
        return;
      }
      status.textContent = 'Thank you! Your details passed validation. This demo does not send data or create a subscription.';
      form.reset();
      submitted = false;
    });
  }
});
