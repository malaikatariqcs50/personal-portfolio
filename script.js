// Preserve the original scroll reveals, typing, anchor navigation and back-to-top behavior.
function reveal() {
  document.querySelectorAll('.reveal, .revealtop').forEach((element) => {
    element.classList.toggle('active', element.getBoundingClientRect().top < window.innerHeight - 80);
  });
}
const backToTop = document.getElementById('button');
function updateScroll() {
  reveal();
  backToTop.classList.toggle('show', window.scrollY > 300);
}
window.addEventListener('scroll', updateScroll, { passive: true });
window.addEventListener('resize', reveal);
updateScroll();

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (typeof Typed !== 'undefined' && !reducedMotion.matches) {
  document.getElementById('element').textContent = '';
  new Typed('#element', {
    strings: ['Software Engineer', 'Full Stack Developer', 'Frontend Engineer'],
    typeSpeed: 50,
    backSpeed: 50,
    cursorChar: '|',
    loop: true,
  });
}
// The fixed header itself is not a scroll destination; Home always returns to the top.
document.querySelectorAll('a[href="#home"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  });
});
