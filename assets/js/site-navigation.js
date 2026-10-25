(() => {
  const navs = [...document.querySelectorAll('nav')];

  navs.forEach((nav, index) => {
    if (nav.dataset.compactReady === 'true') return;

    const logo = [...nav.querySelectorAll('a')].find((link) =>
      link.querySelector('img[src*="rydberg-starck-nav"]')
    );
    if (!logo) return;

    const themeToggle = nav.querySelector('#theme-toggle');
    const menuLinks = [...nav.querySelectorAll('a')].filter((link) => link !== logo);
    const drawer = document.createElement('div');
    const drawerId = `rsl-site-menu-${index + 1}`;
    drawer.className = 'rsl-nav-drawer';
    drawer.id = drawerId;
    drawer.hidden = true;
    drawer.setAttribute('aria-label', 'Site pages');

    menuLinks.forEach((link) => drawer.append(link));

    const oldChildren = [...nav.children];
    oldChildren.forEach((child) => {
      if (child !== logo && !child.contains(logo)) child.remove();
    });

    const row = logo.parentElement === nav ? nav : logo.parentElement;
    row.classList.add('rsl-nav-row');
    if (row !== nav) {
      [...row.children].forEach((child) => {
        if (child !== logo) child.remove();
      });
    }

    const controls = document.createElement('div');
    controls.className = 'rsl-nav-controls';
    if (themeToggle) controls.append(themeToggle);

    const button = document.createElement('button');
    button.className = 'rsl-menu-toggle';
    button.type = 'button';
    button.setAttribute('aria-label', 'Open site menu');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', drawerId);
    button.innerHTML = '<span></span><span></span><span></span>';
    controls.append(button);

    row.append(controls);
    row.append(drawer);
    nav.dataset.compactReady = 'true';

    const closeMenu = (restoreFocus = false) => {
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-label', 'Open site menu');
      drawer.classList.remove('is-open');
      window.setTimeout(() => {
        if (button.getAttribute('aria-expanded') === 'false') drawer.hidden = true;
      }, 230);
      if (restoreFocus) button.focus();
    };

    button.addEventListener('click', () => {
      const isOpen = button.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeMenu();
        return;
      }
      drawer.hidden = false;
      requestAnimationFrame(() => drawer.classList.add('is-open'));
      button.setAttribute('aria-expanded', 'true');
      button.setAttribute('aria-label', 'Close site menu');
    });

    drawer.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });

    document.addEventListener('pointerdown', (event) => {
      if (button.getAttribute('aria-expanded') === 'true' && !row.contains(event.target)) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') closeMenu(true);
    });
  });
})();
