/* Sazzad Hossen Portfolio — Interactions */

document.addEventListener('DOMContentLoaded', () => {
  // ===== Sticky header =====
  const header = document.getElementById('header');
  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ===== Mobile navigation =====
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  const navClose = document.getElementById('nav-close');
  const navLinks = document.querySelectorAll('.nav__link');

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  const openMenu = () => {
    navMenu.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
  const closeMenu = () => {
    navMenu.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (navToggle) navToggle.addEventListener('click', openMenu);
  if (navClose) navClose.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);
  navLinks.forEach(link => link.addEventListener('click', closeMenu));

  // ===== Active nav link on scroll =====
  const sections = document.querySelectorAll('section[id]');
  const setActiveLink = () => {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav__link[href="#${id}"]`);
      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  };
  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  // ===== Smooth scroll (extra safety for older browsers) =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = header.offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ===== Reveal on scroll =====
  const revealElements = document.querySelectorAll(
    '.expertise__card, .process__item, .product__card, .project__card, .approach__card, .tool__card, .experience__card, .skills__group, .about__grid, .tools__automation, .gallery__item'
  );
  revealElements.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Optional: unobserve after reveal for performance
          // revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  // Stagger children slightly
  document.querySelectorAll('.expertise__grid, .products__grid, .projects__grid, .approach__grid, .tools__grid, .process__timeline, .gallery__grid').forEach(grid => {
    const children = grid.querySelectorAll('.reveal, .gallery__item');
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.05}s`;
    });
  });

  // ===== Gallery filter =====
  const filterBtns = document.querySelectorAll('.gallery__filter');
  const galleryItems = document.querySelectorAll('.gallery__item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // ===== Lightbox =====
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  let currentIndex = 0;
  let visibleItems = [];

  const getVisibleItems = () => {
    return Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));
  };

  const openLightbox = (index) => {
    visibleItems = getVisibleItems();
    if (!visibleItems.length) return;
    currentIndex = index;
    const item = visibleItems[currentIndex];
    const img = item.querySelector('img');
    const caption = item.querySelector('figcaption');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = caption ? caption.textContent : '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const showNext = () => {
    visibleItems = getVisibleItems();
    currentIndex = (currentIndex + 1) % visibleItems.length;
    openLightbox(currentIndex);
  };

  const showPrev = () => {
    visibleItems = getVisibleItems();
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    openLightbox(currentIndex);
  };

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      visibleItems = getVisibleItems();
      const idx = visibleItems.indexOf(item);
      if (idx !== -1) openLightbox(idx);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', showNext);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
});
