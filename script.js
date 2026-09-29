const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const year = document.getElementById('year');
year.textContent = new Date().getFullYear();

// Content is visible without JavaScript. Reveal only the sections below the fold.
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove('is-pending');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach((element) => {
    if (element.getBoundingClientRect().top >= window.innerHeight) {
      element.classList.add('is-pending');
      revealObserver.observe(element);
    }
  });
}

const study = document.getElementById('zyada-case-study');
function openCaseFromHash() {
  if (window.location.hash === '#zyada-case-study') study.open = true;
}
openCaseFromHash();
window.addEventListener('hashchange', openCaseFromHash);
document.querySelectorAll('[data-open-case-study]').forEach((link) => {
  link.addEventListener('click', () => { study.open = true; });
});

// Mark the section in view, while leaving native anchor navigation intact.
if ('IntersectionObserver' in window) {
  const navigationLinks = [...document.querySelectorAll('nav a')];
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navigationLinks.forEach((link) => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -65% 0px' });
  ['home', 'work', 'experience', 'about', 'contact'].forEach((id) => sectionObserver.observe(document.getElementById(id)));
}

const dialog = document.getElementById('media-dialog');
const mediaBody = dialog.querySelector('.media-body');
const mediaTitle = document.getElementById('media-title');
const externalVideo = dialog.querySelector('.video-external');
let previousFocus;

function showMedia(title) {
  previousFocus = document.activeElement;
  mediaTitle.textContent = title;
  document.body.classList.add('modal-open');
  dialog.showModal();
  dialog.querySelector('.dialog-close').focus();
}
function closeMedia() { dialog.close(); }
dialog.querySelector('.dialog-close').addEventListener('click', closeMedia);
dialog.addEventListener('close', () => {
  mediaBody.replaceChildren(); // Stop video playback as soon as the dialog closes.
  externalVideo.hidden = true;
  externalVideo.removeAttribute('href');
  document.body.classList.remove('modal-open');
  if (previousFocus && document.contains(previousFocus)) previousFocus.focus({ preventScroll: true });
});
dialog.addEventListener('click', (event) => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeMedia();
});

document.querySelectorAll('[data-image]').forEach((button) => {
  button.addEventListener('click', () => {
    const image = new Image();
    image.src = button.dataset.image;
    image.alt = button.dataset.imageTitle;
    mediaBody.replaceChildren(image);
    externalVideo.hidden = true;
    showMedia(button.dataset.imageTitle);
  });
});

function youtubeId(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    let id = '';
    if (host === 'youtu.be') id = url.pathname.slice(1);
    else if (['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(host)) {
      id = url.searchParams.get('v') || url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1] || '';
    }
    return /^[\w-]{11}$/.test(id) ? id : null;
  } catch { return null; }
}
const videoTitles = {
  overview: 'Zyada Credit — platform overview',
  assessment: 'Zyada Credit — credit assessment & AI extraction',
  educonnect: 'EduConnect — course enrollment & platform overview (57 seconds)',
};
const videos = window.portfolioVideos || {};
document.querySelectorAll('[data-video]').forEach((trigger) => {
  const key = trigger.dataset.video;
  const id = youtubeId(videos[key]);
  if (!id) return;
  trigger.hidden = false;
  if (trigger.closest('#walkthroughs')) document.getElementById('walkthroughs').hidden = false;
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    const frame = document.createElement('iframe');
    frame.src = `https://www.youtube-nocookie.com/embed/${id}?rel=0`;
    frame.title = videoTitles[key];
    frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    mediaBody.replaceChildren(frame);
    externalVideo.href = `https://www.youtube.com/watch?v=${id}`;
    externalVideo.hidden = false;
    showMedia(videoTitles[key]);
  });
});
