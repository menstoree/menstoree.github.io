/* =====================================================================
   RENDU DYNAMIQUE — piloté entièrement par CONFIG (config.js)
   Ne pas modifier sauf si vous savez ce que vous faites.
   ===================================================================== */
(function () {
  'use strict';

  const C = window.CONFIG || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c =>
    ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const setText = (id, v) => { const el = document.getElementById(id); if (el && v != null) el.textContent = v; };
  const isFilled = (v) => typeof v === 'string' && v.trim() !== '';

  /* ---------- HEADER & MARQUE ---------- */
  setText('brandName', C.store?.name);
  setText('footerName', C.store?.name);
  setText('brandLogo', C.store?.logoText || '◆');
  setText('footerLogo', C.store?.logoText || '◆');
  setText('year', new Date().getFullYear());
  document.title = `${C.store?.name || 'Boutique'} — Produits numériques`;

  /* ---------- LIEN CHARIOW GÉNÉRAL ----------
     Tous les boutons avec data-link="store" pointent vers store.chariowUrl.
     Si vide → bouton visuellement désactivé avec libellé indicatif.
  ---------------------------------------------- */
  const chariowUrl = isFilled(C.store?.chariowUrl) ? C.store.chariowUrl : '';
  $$('[data-link="store"]').forEach((btn) => {
    if (chariowUrl) {
      btn.href = chariowUrl;
      btn.target = '_blank';
      btn.rel = 'noopener';
    } else {
      btn.classList.add('btn-pending');
      btn.setAttribute('aria-disabled', 'true');
      btn.removeAttribute('href');
      btn.title = 'Lien Chariow à renseigner dans config.js';
      if (btn.classList.contains('btn-ghost')) {
        btn.classList.remove('btn-ghost');
        btn.classList.add('btn-primary');
      }
      btn.addEventListener('click', (e) => e.preventDefault());
      if (!btn.dataset.keepLabel) btn.textContent = 'Lien à renseigner';
    }
  });

  /* ---------- HERO ---------- */
  setText('heroBadge', C.hero?.badge);
  setText('heroSubtitle', C.hero?.subtitle);
  setText('heroPrimary', C.hero?.primaryCta || 'Découvrir nos produits');

  // Titre hero : autoriser <br/> injecté depuis config (via innerHTML sécurisé sur contenu statique)
  const heroTitle = $('#heroTitle');
  if (heroTitle && C.hero?.title) heroTitle.innerHTML = esc(C.hero.title).replace(/\n/g, '<br/>');

  // Secondaire : on garde le libellé config sauf si lien vide (déjà géré plus haut)
  const heroSec = $('#heroSecondary');
  if (heroSec && C.hero?.secondaryCta && chariowUrl) heroSec.textContent = C.hero.secondaryCta;

  // Stats
  const statsEl = $('#heroStats');
  if (statsEl && C.hero?.stats?.length) {
    statsEl.innerHTML = C.hero.stats.map(s =>
      `<li><strong>${esc(s.value)}</strong><span>${esc(s.label)}</span></li>`
    ).join('');
  }

  // Visuel hero
  const heroVis = $('#heroVisual');
  if (heroVis) {
    if (isFilled(C.hero?.image)) {
      heroVis.innerHTML = `<img src="${esc(C.hero.image)}" alt="Visuel de la boutique" loading="eager" />`;
    } else {
      heroVis.innerHTML = `
        <div class="hero-placeholder">
          <div class="ph-icon">${esc(C.hero?.placeholderIcon || '◈')}</div>
          <div class="ph-title">${esc(C.hero?.placeholderTitle || 'Visuel principal')}</div>
          <div class="ph-sub">${esc(C.hero?.placeholderSub || 'Emplacement réservé')}</div>
        </div>`;
    }
  }

  /* ---------- MISSION & VALEURS ---------- */
  setText('missionTitle', C.mission?.title);
  setText('missionText', C.mission?.text);
  const valuesGrid = $('#valuesGrid');
  if (valuesGrid && C.mission?.values?.length) {
    valuesGrid.innerHTML = C.mission.values.map(v => `
      <div class="value-card reveal">
        <div class="value-icon">${esc(v.icon)}</div>
        <h3>${esc(v.title)}</h3>
        <p>${esc(v.text)}</p>
      </div>
    `).join('');
  }

  /* ---------- PRODUITS ---------- */
  setText('productsTitle', C.products?.title);
  setText('productsSubtitle', C.products?.subtitle);

  const grid = $('#productGrid');
  if (grid) {
    const items = C.products?.items || [];
    grid.innerHTML = items.map(p => {
      const hasImg = isFilled(p.image);
      const hasUrl = isFilled(p.url);
      const priceBlock = isFilled(p.price)
        ? `<div class="price"><strong>${esc(p.price)}</strong>${p.priceNote ? `<small>${esc(p.priceNote)}</small>` : ''}</div>`
        : `<div class="price"><strong>Prix à définir</strong>${p.priceNote ? `<small>${esc(p.priceNote)}</small>` : ''}</div>`;

      const media = hasImg
        ? `<img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy" />`
        : `<div class="media-ph">
             <div class="ph-icon">◈</div>
             <div class="ph-text">Visuel du produit<br/>à ajouter</div>
           </div>`;

      const benefits = (p.benefits || []).map(b => `<li>${esc(b)}</li>`).join('');

      const cta = hasUrl
        ? `<a class="btn btn-primary btn-sm" href="${esc(p.url)}" target="_blank" rel="noopener">Découvrir le produit</a>`
        : `<a class="btn btn-sm btn-pending" aria-disabled="true" title="Lien Chariow à renseigner dans config.js" onclick="return false">Lien à renseigner</a>`;

      return `
        <article class="product-card reveal">
          <div class="product-media">${media}</div>
          <div class="product-body">
            <span class="product-category">${esc(p.category || 'Produit')}</span>
            <h3>${esc(p.name)}</h3>
            <p class="product-desc">${esc(p.description)}</p>
            <ul class="benefits">${benefits}</ul>
            <div class="product-footer">
              ${priceBlock}
              ${cta}
            </div>
          </div>
        </article>`;
    }).join('');
  }

  /* ---------- TÉMOIGNAGES WHATSAPP ---------- */
  setText('testimonialsTitle', C.testimonials?.title);
  setText('testimonialsSubtitle', C.testimonials?.subtitle);

  const waGrid = $('#waGrid');
  if (waGrid && C.testimonials?.items?.length) {
    waGrid.innerHTML = C.testimonials.items.map((t, i) => {
      if (isFilled(t.image)) {
        const captionHtml = isFilled(t.caption) ? `<div class="wa-caption">${esc(t.caption)}</div>` : '';
        return `
          <button class="wa-card reveal" type="button"
                  data-lightbox="${esc(t.image)}"
                  aria-label="${esc(t.alt || 'Témoignage client')}">
            <img src="${esc(t.image)}" alt="${esc(t.alt || 'Témoignage')}" loading="lazy" />
            ${captionHtml}
          </button>`;
      }
      return `
        <div class="wa-card reveal" aria-label="Emplacement réservé">
          <div class="wa-ph">
            <div class="ph-icon">💬</div>
            <div class="ph-text">Capture WhatsApp<br/>à ajouter</div>
            <div class="ph-num">EMPLACEMENT #${i + 1}</div>
          </div>
        </div>`;
    }).join('');
  }

  /* ---------- PERFORMANCES ---------- */
  setText('performanceTitle', C.performance?.title);
  setText('performanceSubtitle', C.performance?.subtitle);

  const metricsRow = $('#metricsRow');
  if (metricsRow && C.performance?.metrics?.length) {
    metricsRow.innerHTML = C.performance.metrics.map(m => `
      <div class="metric-card reveal">
        <strong>${esc(m.value)}</strong>
        <span>${esc(m.label)}</span>
        ${m.note ? `<small>${esc(m.note)}</small>` : ''}
      </div>
    `).join('');
  }

  const perfGrid = $('#perfGrid');
  if (perfGrid && C.performance?.items?.length) {
    perfGrid.innerHTML = C.performance.items.map((p, i) => {
      const media = isFilled(p.image)
        ? `<img src="${esc(p.image)}" alt="${esc(p.alt || 'Capture')}" loading="lazy" data-lightbox="${esc(p.image)}" />`
        : `<div class="perf-ph">
             <div class="ph-icon">📈</div>
             <div class="ph-text">Capture de résultats<br/>à ajouter</div>
             <div class="ph-num" style="font-size:10.5px;letter-spacing:.1em;color:rgba(255,255,255,.35)">EMPLACEMENT #${i + 1}</div>
           </div>`;
      return `
        <article class="perf-card reveal">
          <div class="perf-media">${media}</div>
          <div class="perf-body">
            <h4>${esc(p.title || 'Titre à renseigner')}</h4>
            <p>${esc(p.context || 'Explication du contexte à renseigner.')}</p>
          </div>
        </article>`;
    }).join('');
  }

  /* ---------- FAQ ---------- */
  setText('faqTitle', C.faq?.title);
  const faqList = $('#faqList');
  if (faqList && C.faq?.items?.length) {
    faqList.innerHTML = C.faq.items.map(item => `
      <details class="faq-item reveal">
        <summary>${esc(item.q)}</summary>
        <p>${esc(item.a)}</p>
      </details>
    `).join('');
  }

  /* ---------- FOOTER ---------- */
  setText('footerAbout', C.footer?.about);

  const footerNav = $('#footerNav');
  if (footerNav && C.footer?.nav?.length) {
    footerNav.innerHTML = C.footer.nav.map(l =>
      `<li><a href="${esc(l.href)}">${esc(l.label)}</a></li>`
    ).join('');
    // lien Chariow ajouté en haut du menu si disponible
    if (chariowUrl) {
      footerNav.insertAdjacentHTML('afterbegin',
        `<li><a href="${esc(chariowUrl)}" target="_blank" rel="noopener">Boutique Chariow ↗</a></li>`);
    }
  }

  const contactEl = $('#footerContact');
  if (contactEl) {
    const items = [];
    if (isFilled(C.store?.email))    items.push(`<li><a href="mailto:${esc(C.store.email)}">${esc(C.store.email)}</a></li>`);
    if (isFilled(C.store?.phone))    items.push(`<li><a href="tel:${esc(C.store.phone)}">${esc(C.store.phone)}</a></li>`);
    if (isFilled(C.store?.whatsapp)) items.push(`<li><a href="${esc(C.store.whatsapp)}" target="_blank" rel="noopener">WhatsApp</a></li>`);
    if (isFilled(C.store?.location)) items.push(`<li>${esc(C.store.location)}</li>`);
    contactEl.innerHTML = items.length
      ? items.join('')
      : '<li class="placeholder-line">Coordonnées à renseigner dans config.js</li>';
  }

  const socialsEl = $('#footerSocials');
  if (socialsEl) {
    const labels = { instagram: 'Instagram', facebook: 'Facebook', tiktok: 'TikTok', youtube: 'YouTube', linkedin: 'LinkedIn' };
    const active = Object.entries(C.store?.socials || {}).filter(([, v]) => isFilled(v));
    socialsEl.innerHTML = active.length
      ? active.map(([k, v]) => `<li><a href="${esc(v)}" target="_blank" rel="noopener">${labels[k] || k}</a></li>`).join('')
      : '<li class="placeholder-line">Réseaux à renseigner dans config.js</li>';
  }

  const legalEl = $('#footerLegal');
  if (legalEl && C.footer?.legal?.length) {
    legalEl.innerHTML = C.footer.legal.map(l =>
      `<li><a href="${esc(l.url)}">${esc(l.label)}</a></li>`
    ).join('');
  }

  /* ---------- LIGHTBOX ---------- */
  const lb = $('#lightbox');
  const lbImg = lb?.querySelector('img');
  const openLb = (src, alt) => {
    if (!lb || !lbImg) return;
    lbImg.src = src;
    lbImg.alt = alt || 'Aperçu';
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const closeLb = () => {
    if (!lb) return;
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    lbImg.removeAttribute('src');
    document.body.style.overflow = '';
  };

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-lightbox]');
    if (trigger) {
      e.preventDefault();
      openLb(trigger.dataset.lightbox, trigger.getAttribute('aria-label'));
      return;
    }
    if (e.target.closest('.lightbox-close') || e.target === lb) closeLb();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLb(); });

  /* ---------- ANIMATIONS REVEAL ---------- */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal').forEach((el) => io.observe(el));
  } else {
    $$('.reveal').forEach((el) => el.classList.add('in'));
  }

  /* ---------- HEADER SHADOW AU SCROLL ---------- */
  const header = $('#siteHeader');
  window.addEventListener('scroll', () => {
    if (!header) return;
    header.style.boxShadow = window.scrollY > 8 ? '0 1px 12px rgba(10,22,40,.06)' : 'none';
  }, { passive: true });

})();
