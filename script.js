/* Premium script:
 - Construye la malla
 - Guardado en localStorage
 - Filtro búsqueda
 - Dark mode toggle (persistente)
 - Progreso global + por semestre
 - Export estado (JSON)
 - Reset con confirm
*/

document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Datos (estructura de semestres y ramos) ---------- */
  const semestres = [
    { title: 'Primer Semestre', items: [
      'Introducción al Marketing',
      'Taller de Herramientas Online',
      'Matemática para la Educación Superior',
      'Usabilidad y Experiencia de Usuario',
      'Herramientas para la Empleabilidad',
      'Habilidades para la Comunicación'
    ]},
    { title: 'Segundo Semestre', items: [
      'Marketing Digital',
      'Taller de Diseño Web',
      'Taller de Herramientas de Procesamiento de Datos',
      'Marketing de Contenidos',
      'Herramientas para la Innovación',
      'Herramientas de Inteligencia Artificial'
    ]},
    { title: 'Tercer Semestre', items: [
      'Marketing Digital Aplicado',
      'Taller de Diseño e-commerce',
      'Sostenibilidad Organizacional',
      'Posicionamiento y Analítica Web',
      'Certificado de Especialidad I',
      'Metodologías Ágiles'
    ]},
    { title: 'Cuarto Semestre', items: [
      'Community Manager',
      'Inglés Inicial I',
      'Taller de Marca Personal',
      'Nuevas Tendencias del Marketing Digital',
      'Taller de Proyecto de Especialidad',
      'Certificado de Especialidad II'
    ]},
    { title: 'Quinto Semestre', items: [
      'Práctica Profesional'
    ]}
  ];

  /* ---------- Mapeo simple de iconos (emoji) por palabra clave ---------- */
  const iconFor = (name) => {
    const n = name.toLowerCase();
    if (n.includes('taller') || n.includes('taller de')) return '🛠️';
    if (n.includes('marketing')) return '📘';
    if (n.includes('digital') || n.includes('e-commerce') || n.includes('web')) return '💻';
    if (n.includes('inteligencia') || n.includes('ia')) return '🤖';
    if (n.includes('analítica') || n.includes('posicionamiento')) return '📊';
    if (n.includes('ingles')) return '🗣️';
    if (n.includes('proyecto') || n.includes('práctica')) return '🧩';
    if (n.includes('certificado')) return '🎓';
    if (n.includes('sostenibilidad')) return '🌱';
    if (n.includes('empleabilidad') || n.includes('habilidades')) return '🧭';
    return '✨';
  };

  /* ---------- Selectores ---------- */
  const container = document.getElementById('malla');
  const globalProgress = document.getElementById('global-progress');
  const aprobadosCount = document.getElementById('aprobados-count');
  const totalCount = document.getElementById('total-count');
  const resetAllBtn = document.getElementById('reset-all');
  const exportBtn = document.getElementById('export');
  const searchInput = document.getElementById('search');
  const clearSearchBtn = document.getElementById('clear-search');
  const themeToggle = document.getElementById('theme-toggle');

  /* ---------- Utils: localStorage keys ---------- */
  const keyPrefix = 'malla_ramo_';
  const themeKey = 'malla_theme';

  /* ---------- Construir UI ---------- */
  function buildMalla() {
    container.innerHTML = '';
    semestres.forEach((sem, sIdx) => {
      const semCard = document.createElement('article');
      semCard.className = 'sem-card card';
      const title = document.createElement('h3');
      title.textContent = sem.title;
      semCard.appendChild(title);

      // small progress bar container
      const semProgress = document.createElement('div');
      semProgress.className = 'sem-progress';
      semProgress.innerHTML = `<div class="small-bar"><div class="fill" id="fill-${sIdx}" style="width:0%"></div></div><div class="meta-percentage" id="meta-${sIdx}" style="min-width:48px;text-align:right;font-weight:700;color:var(--muted)">0%</div>`;
      semCard.appendChild(semProgress);

      const list = document.createElement('div');
      list.className = 'ramos-list';

      sem.items.forEach((ramoName, rIdx) => {
        const id = `${sIdx+1}_${rIdx+1}`; // ej: 1_1
        const item = document.createElement('div');
        item.className = 'ramo no-aprobado';
        item.dataset.title = ramoName.toLowerCase();
        item.id = keyPrefix + id;

        const left = document.createElement('div');
        left.className = 'left';
        const iconBox = document.createElement('div');
        iconBox.className = 'icon';
        iconBox.textContent = iconFor(ramoName);
        const textBox = document.createElement('div');
        textBox.innerHTML = `<div class="title">${ramoName}</div><div class="meta">Semestre ${sIdx+1}</div>`;
        left.appendChild(iconBox);
        left.appendChild(textBox);

        const right = document.createElement('div');
        right.className = 'right';
        right.innerHTML = `<div class="meta">clic para aprobar</div>`;

        item.appendChild(left);
        item.appendChild(right);

        // recupera estado guardado
        const saved = localStorage.getItem(item.id);
        if (saved === 'aprobado') {
          item.classList.remove('no-aprobado');
          item.classList.add('aprobado');
        }

        // evento click
        item.addEventListener('click', () => {
          if (item.classList.contains('bloqueado')) return;
          const isAprob = item.classList.toggle('aprobado');
          item.classList.toggle('no-aprobado', !isAprob);
          localStorage.setItem(item.id, isAprob ? 'aprobado' : 'no');
          updateAllProgress();
          // micro animation
          item.animate([{ transform: 'scale(1.02)' }, { transform: 'scale(1)' }], { duration: 160 });
        });

        list.appendChild(item);
      });

      semCard.appendChild(list);
      container.appendChild(semCard);
    });

    // set total count
    totalCount.textContent = document.querySelectorAll('.ramo').length;
    updateAllProgress();
  }

  /* ---------- Progreso general + por semestre ---------- */
  function updateAllProgress() {
    const all = document.querySelectorAll('.ramo');
    const aprobados = document.querySelectorAll('.aprobado');
    const total = all.length;
    const apro = aprobados.length;
    const pct = total === 0 ? 0 : Math.round((apro / total) * 100);
    globalProgress.style.width = pct + '%';
    aprobadosCount.textContent = apro;
    totalCount.textContent = total;

    // por semestre
    semestres.forEach((sem, sIdx) => {
      const items = document.querySelectorAll(`#malla .sem-card:nth-child(${sIdx+1}) .ramos-list .ramo`);
      const tot = items.length;
      let ap = 0;
      items.forEach(it => { if (it.classList.contains('aprobado')) ap++ });
      const p = tot === 0 ? 0 : Math.round((ap / tot) * 100);
      const fill = document.getElementById(`fill-${sIdx}`);
      const meta = document.getElementById(`meta-${sIdx}`);
      if (fill) fill.style.width = p + '%';
      if (meta) meta.textContent = `${p}%`;
    });
  }

  /* ---------- Búsqueda / filtrado ---------- */
  function filterRamos(q) {
    const items = document.querySelectorAll('.ramo');
    const term = q.trim().toLowerCase();
    items.forEach(it => {
      const title = it.dataset.title || '';
      if (!term || title.includes(term)) {
        it.style.display = '';
      } else {
        it.style.display = 'none';
      }
    });
  }

  /* ---------- Export estado (JSON) ---------- */
  function exportEstado() {
    const data = {};
    document.querySelectorAll('.ramo').forEach(r => {
      data[r.id] = localStorage.getItem(r.id) || 'no';
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'malla_estado.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  /* ---------- Reset (limpia localStorage para las claves de la malla) ---------- */
  function resetAll(confirmPrompt = true) {
    if (confirmPrompt) {
      const ok = confirm('¿Seguro que quieres reiniciar toda la malla? Se perderán los estados guardados en este navegador.');
      if (!ok) return;
    }
    document.querySelectorAll('.ramo').forEach(r => {
      r.classList.remove('aprobado'); r.classList.add('no-aprobado');
      localStorage.setItem(r.id, 'no');
    });
    updateAllProgress();
  }

  /* ---------- Theme (dark / light) persistent ---------- */
  function applyTheme(theme) {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    themeToggle.setAttribute('aria-pressed', theme === 'dark');
  }

  function toggleTheme() {
    const now = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const nw = now === 'dark' ? 'light' : 'dark';
    applyTheme(nw);
    localStorage.setItem(themeKey, nw);
  }

  /* ---------- Eventos UI ---------- */
  searchInput.addEventListener('input', e => filterRamos(e.target.value));
  clearSearchBtn.addEventListener('click', () => { searchInput.value = ''; filterRamos(''); });
  resetAllBtn.addEventListener('click', () => resetAll(true));
  exportBtn.addEventListener('click', exportEstado);
  themeToggle.addEventListener('click', toggleTheme);

  /* ---------- Inicialización ---------- */
  // aplicar tema guardado o preferencia del sistema
  (function initTheme(){
    const saved = localStorage.getItem(themeKey);
    if (saved) applyTheme(saved);
    else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark ? 'dark' : 'light');
    }
  })();

  buildMalla();

  // small UX: support keyboard '/' to focus search
  window.addEventListener('keydown', e => {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault(); searchInput.focus(); searchInput.select();
    }
  });

});
