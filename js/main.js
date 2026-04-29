document.addEventListener('DOMContentLoaded', () => {
  // --- Preloader ---
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => setTimeout(() => preloader.classList.add('done'), 2000));
  setTimeout(() => preloader.classList.add('done'), 4000); // fallback

  // --- Theme Toggle ---
  const themeToggle = document.getElementById('theme-toggle');
  const saved = localStorage.getItem('yv-theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next === 'dark' ? '' : next);
    if (next === 'dark') document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('yv-theme', next);
  });

  // --- Custom Cursor ---
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (window.matchMedia('(hover:hover)').matches && cursor && follower) {
    document.addEventListener('mousemove', e => {
      cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px';
      follower.animate({left: e.clientX+'px', top: e.clientY+'px'}, {duration:400, fill:'forwards'});
    });
    document.querySelectorAll('a,button').forEach(el => {
      el.addEventListener('mouseenter', () => { follower.style.width='50px'; follower.style.height='50px'; follower.style.background='rgba(91,156,245,.1)'; });
      el.addEventListener('mouseleave', () => { follower.style.width='36px'; follower.style.height='36px'; follower.style.background='none'; });
    });
  }

  // --- Header scroll ---
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 60));

  // --- Mobile Nav ---
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });
  document.querySelectorAll('.mobile-link').forEach((link, i) => {
    link.style.transitionDelay = (i * 0.08) + 's';
    link.addEventListener('click', () => {
      hamburger.classList.remove('active'); mobileNav.classList.remove('open'); document.body.style.overflow = '';
    });
  });

  // --- Active Nav ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.toggle('active', l.dataset.section === e.target.id));
      }
    });
  }, {threshold: 0.3});
  sections.forEach(s => observer.observe(s));

  // --- Scroll Animations ---
  const animObserver = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('animated'); animObserver.unobserve(e.target); }});
  }, {threshold: 0.1});
  document.querySelectorAll('[data-animate]').forEach(el => animObserver.observe(el));

  // --- Counter Animation ---
  document.querySelectorAll('.stat-number').forEach(el => {
    const target = +el.dataset.count;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        let current = 0;
        const step = Math.max(1, Math.floor(target / 40));
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); }
          el.textContent = current;
        }, 30);
        obs.disconnect();
      }
    }, {threshold: 0.5});
    obs.observe(el);
  });

  // --- Gallery ---
  const grid = document.getElementById('masonry-grid');
  const filterBar = document.getElementById('gallery-filter');
  const loadMoreBtn = document.getElementById('load-more-btn');
  const loadMoreCount = document.getElementById('load-more-count');
  const loadMoreWrap = document.getElementById('load-more-wrap');

  let allImages = []; // {src, category, categoryLabel}
  let filteredImages = [];
  let displayedCount = 0;
  const BATCH = 20;
  let currentFilter = 'all';

  // Build flat image list + filter buttons
  if (typeof galleryCategories !== 'undefined') {
    galleryCategories.forEach(cat => {
      // Add filter button
      const btn = document.createElement('button');
      btn.className = 'filter-btn';
      btn.dataset.filter = cat.id;
      btn.textContent = cat.label;
      filterBar.appendChild(btn);

      cat.images.forEach(src => {
        allImages.push({src, category: cat.id, categoryLabel: cat.label});
      });
    });
    filteredImages = [...allImages];
  }

  function renderBatch() {
    const end = Math.min(displayedCount + BATCH, filteredImages.length);
    for (let i = displayedCount; i < end; i++) {
      const item = document.createElement('div');
      item.className = 'masonry-item';
      item.dataset.index = i;
      const img = document.createElement('img');
      img.src = filteredImages[i].src;
      img.alt = 'Yankeeverse — ' + filteredImages[i].categoryLabel;
      img.loading = 'lazy';
      img.onload = () => item.classList.add('visible');
      const overlay = document.createElement('div');
      overlay.className = 'overlay';
      overlay.innerHTML = '<span>' + filteredImages[i].categoryLabel + '</span>';
      item.appendChild(img); item.appendChild(overlay);
      item.addEventListener('click', () => openLightbox(i));
      grid.appendChild(item);
    }
    displayedCount = end;
    updateLoadMore();
  }

  function updateLoadMore() {
    const remaining = filteredImages.length - displayedCount;
    loadMoreCount.textContent = `Showing ${displayedCount} of ${filteredImages.length} artworks`;
    loadMoreWrap.style.display = remaining > 0 ? '' : 'none';
  }

  function applyFilter(filter) {
    currentFilter = filter;
    displayedCount = 0;
    grid.innerHTML = '';
    filteredImages = filter === 'all' ? [...allImages] : allImages.filter(img => img.category === filter);
    renderBatch();
    filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b.dataset.filter === filter));
  }

  filterBar.addEventListener('click', e => {
    if (e.target.classList.contains('filter-btn')) applyFilter(e.target.dataset.filter);
  });
  loadMoreBtn.addEventListener('click', renderBatch);
  renderBatch(); // initial

  // --- Lightbox ---
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbCounter = document.getElementById('lightbox-counter');
  const lbCategory = document.getElementById('lightbox-category');
  let lbIndex = 0;

  function openLightbox(i) {
    lbIndex = i;
    lbImg.src = filteredImages[i].src;
    lbCounter.textContent = (i + 1) + ' / ' + filteredImages.length;
    lbCategory.textContent = filteredImages[i].categoryLabel;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  function navLightbox(dir) {
    lbIndex = (lbIndex + dir + filteredImages.length) % filteredImages.length;
    lbImg.src = filteredImages[lbIndex].src;
    lbCounter.textContent = (lbIndex + 1) + ' / ' + filteredImages.length;
    lbCategory.textContent = filteredImages[lbIndex].categoryLabel;
  }
  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  document.getElementById('lightbox-prev').addEventListener('click', () => navLightbox(-1));
  document.getElementById('lightbox-next').addEventListener('click', () => navLightbox(1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navLightbox(-1);
    if (e.key === 'ArrowRight') navLightbox(1);
  });

  // --- Smooth scroll for anchors ---
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({behavior:'smooth'}); }
    });
  });
});
