// Apply the saved choice before styles render to avoid a light flash in dark mode.
(() => {
  let preference;
  try { preference = localStorage.getItem('portfolio-theme'); } catch { /* Storage may be disabled. */ }
  if (!['light', 'dark'].includes(preference)) preference = null;

  function apply(theme) {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#101923' : '#f7f8fa';
    const button = document.getElementById('theme-toggle');
    if (button) {
      const label = `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`;
      button.setAttribute('aria-label', label);
      button.title = label;
      button.querySelector('i').className = `fa-solid fa-${theme === 'dark' ? 'sun' : 'moon'}`;
    }
  }

  apply(preference || 'dark');
  document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('theme-toggle');
    button.hidden = false;
    apply(document.documentElement.dataset.theme);
    button.addEventListener('click', () => {
      preference = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('portfolio-theme', preference); } catch { /* The toggle still works. */ }
      apply(preference);
    });
  });
})();
