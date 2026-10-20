(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      nav.classList.toggle('open', !isOpen);
      menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
    }));
  }

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const form = document.getElementById('project-form');
  const note = document.getElementById('form-note');
  if (form) {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const email = String(data.get('email') || '').trim();
      const type = String(data.get('projectType') || '').trim();
      const budget = String(data.get('budget') || '').trim();
      const message = String(data.get('message') || '').trim();
      if (!name || !email || !type || !budget || !message) {
        if (note) note.textContent = 'Please complete every field before sending.';
        return;
      }
      // Replace this address with your real studio inbox before publishing.
      const recipient = 'hello@comecode.studio';
      const subject = encodeURIComponent(`Project enquiry — ${type}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nProject type: ${type}\nEstimated budget: ${budget}\n\nProject details:\n${message}`);
      if (note) note.textContent = 'Opening your email app. If nothing happens, check that an email app is configured.';
      window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
    });
  }
})();
