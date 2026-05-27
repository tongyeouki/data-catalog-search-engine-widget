import { MOCK_ENTITIES, MOCK_CATALOGUE, MOCK_DICTIONARY } from './mockData.js';

// --- State ---
let isGristMode = false;
let catalogueRecords = []; // Active Catalogue records (Grist or Mock fallback)
let selectedRecord = null; // Currently selected record in drawer
let searchQuery = '';
let activeFilters = {
  direction: '',
  sensitivity: '',
  publication: '',
  format: ''
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  setupSearchInput();
  setupFilters();
  setupDrawerActions();
  setupThemeToggle();
  
  // Try to connect to Grist Custom Widget API
  initializeGristWidget();
  
  // Standalone Fallback Timer (if Grist not responding within 800ms)
  setTimeout(() => {
    if (!isGristMode) {
      console.log("Grist not detected. Loading standalone mock data fallback.");
      initStandaloneMode();
    }
  }, 800);
});

// --- Grist Widget API Integration ---
function initializeGristWidget() {
  if (typeof grist === 'undefined') return;
  
  try {
    grist.ready({
      requiredAccess: 'read table',
      columns: [
        { name: 'Titre', type: 'Text' },
        { name: 'Description', type: 'Text' },
        { name: 'Niveau_Sensibilite', type: 'ChoiceList' },
        { name: 'Statut_Publication', type: 'Choice' },
        { name: 'Statut_Qualification', type: 'Choice' },
        { name: 'Bureau_Producteur', type: 'Reference' },
        { name: 'Mots_Cles', type: 'ChoiceList' },
        { name: 'Date_MaJ', type: 'Date' },
        { name: 'Format_Donnees', type: 'ReferenceList', optional: true },
        { name: 'Frequence_MaJ', type: 'Reference', optional: true },
        { name: 'URL_Open_Data', type: 'Text', optional: true },
        { name: 'Volumetrie_en_Mo_', type: 'Numeric', optional: true },
        { name: 'URL', type: 'Text', optional: true },
        { name: 'Contact_Service', type: 'Reference', optional: true },
        { name: 'Domaine_Fonctionnel', type: 'Reference', optional: true },
        { name: 'Langue', type: 'Choice', optional: true },
        { name: 'Couverture_Geo', type: 'ReferenceList', optional: true },
        { name: 'Periode_de_couverture_Date_de_debut', type: 'Date', optional: true },
        { name: 'Periode_de_couverture_Date_de_fin', type: 'Date', optional: true },
        { name: 'Contact', type: 'Reference', optional: true },
        { name: 'Commanditaire', type: 'Text', optional: true },
        { name: 'Systeme_d_Information', type: 'ReferenceList', optional: true },
        { name: 'Date_Publication', type: 'Date', optional: true },
        { name: 'URL_de_telechargement', type: 'Text', optional: true },
        { name: 'Licence', type: 'Reference', optional: true },
        { name: 'Donnees_ouvertes', type: 'Bool', optional: true }
      ]
    });
    
    // Subscribe to Grist table updates
    grist.onRecords((rawRecords) => {
      isGristMode = true;
      document.body.classList.add('mode-grist');
      
      const badge = document.getElementById('mode-badge');
      if (badge) {
        badge.textContent = "WIDGET GRIST ACTIF";
        badge.className = "fr-badge fr-badge--success fr-badge--no-icon";
      }
      
      console.log("Raw records received from Grist:", rawRecords);
      
      // Convert columnar/nested records from Grist into standard row-oriented objects
      catalogueRecords = transformGristRecords(rawRecords);
      
      // Dynamically populate search filter options drawing straight from Grist records
      populateDynamicFilters(catalogueRecords);
      
      applySearchAndFilters();
    });
    
    // Subscribe to Grist selection cursor changes
    grist.onRecord((record) => {
      if (record && record.id) {
        openDetailPanel(record.id, false); // Open panel but don't bounce setCursorPos to avoid loops
      }
    });
  } catch (error) {
    console.error("Error connecting to Grist Widget API:", error);
    initStandaloneMode();
  }
}

// Resilient Grist columnar to row list parser
function transformGristRecords(records) {
  if (!records) return [];
  
  // If already standard array of objects
  if (Array.isArray(records)) {
    return records.map(rec => {
      const formatted = { ...rec };
      // Resolve reference ID
      if (rec.Bureau_Producteur && typeof rec.Bureau_Producteur === 'object') {
        formatted.Bureau_Producteur = rec.Bureau_Producteur.id || rec.Bureau_Producteur;
      }
      return formatted;
    });
  }
  
  // If columnar layout {"id": [1, 2], "Titre": ["A", "B"]}
  if (records.id && Array.isArray(records.id)) {
    return records.id.map((id, index) => {
      const row = { id };
      Object.keys(records).forEach((col) => {
        let val = records[col][index];
        if (val && typeof val === 'object' && val.id) {
          val = val.id; // Extract Grist ID reference
        }
        row[col] = val;
      });
      return row;
    });
  }
  
  return [];
}

// Dynamic drop-down list populator drawing data straight from Grist records
function populateDynamicFilters(records) {
  if (!records) return;
  
  // 1. Directions
  const directions = new Set();
  records.forEach(rec => {
    if (rec.Direction) directions.add(rec.Direction);
  });
  updateSelectOptions('filter-direction', Array.from(directions).sort(), '📁 Toutes Directions');
  
  // 2. Sensibilité (Niveau de Sensibilité)
  const sensitivities = new Set();
  records.forEach(rec => {
    if (rec.Niveau_Sensibilite) {
      const list = Array.isArray(rec.Niveau_Sensibilite) ? rec.Niveau_Sensibilite : [rec.Niveau_Sensibilite];
      list.forEach(s => {
        if (s) sensitivities.add(s);
      });
    }
  });
  updateSelectOptions('filter-sensitivity', Array.from(sensitivities).sort(), '🔒 Toute Sensibilité', (val) => {
    return String(val).replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase());
  });
  
  // 3. Publication
  const publications = new Set();
  records.forEach(rec => {
    if (rec.Statut_Publication) publications.add(rec.Statut_Publication);
  });
  updateSelectOptions('filter-publication', Array.from(publications).sort(), '📢 Tout Régime', (val) => {
    return String(val).replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase());
  });
  
  // 4. Format
  const formats = new Set();
  records.forEach(rec => {
    if (rec.Format_Donnees) {
      const list = Array.isArray(rec.Format_Donnees) ? rec.Format_Donnees : [rec.Format_Donnees];
      list.forEach(f => {
        if (f) {
          const name = typeof f === 'object' ? (f.valeur || f.label || JSON.stringify(f)) : f;
          formats.add(name);
        }
      });
    }
  });
  updateSelectOptions('filter-format', Array.from(formats).sort(), '⚙️ Tout Format');
}

function updateSelectOptions(selectId, uniqueValues, placeholderText, formatLabelFn = null) {
  const select = document.getElementById(selectId);
  if (!select) return;
  
  const currentValue = select.value;
  select.innerHTML = `<option value="" selected>${placeholderText}</option>`;
  
  uniqueValues.forEach(val => {
    const option = document.createElement('option');
    option.value = val;
    option.textContent = formatLabelFn ? formatLabelFn(val) : val;
    if (val === currentValue) {
      option.selected = true;
    }
    select.appendChild(option);
  });
}

// Standalone Demo boot
function initStandaloneMode() {
  isGristMode = false;
  catalogueRecords = [...MOCK_CATALOGUE];
  
  // Dynamically populate search filter options from mock records
  populateDynamicFilters(catalogueRecords);
  
  applySearchAndFilters();
}

// --- Search and Filters Logic ---
function setupSearchInput() {
  const searchBar = document.getElementById('search-bar');
  const clearBtn = document.getElementById('clear-search-btn');
  const searchSubmit = document.getElementById('search-submit');
  
  if (!searchBar) return;
  
  const handleSearch = () => {
    searchQuery = searchBar.value.toLowerCase().trim();
    if (clearBtn) clearBtn.style.display = searchQuery ? 'block' : 'none';
    applySearchAndFilters();
  };
  
  searchBar.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    if (clearBtn) clearBtn.style.display = searchQuery ? 'block' : 'none';
    applySearchAndFilters();
  });
  
  if (searchSubmit) {
    searchSubmit.addEventListener('click', handleSearch);
  }
  
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchBar.value = '';
      searchQuery = '';
      clearBtn.style.display = 'none';
      applySearchAndFilters();
    });
  }
}

function setupFilters() {
  const filters = ['direction', 'sensitivity', 'publication', 'format'];
  filters.forEach(type => {
    const select = document.getElementById(`filter-${type}`);
    if (!select) return;
    
    select.addEventListener('change', (e) => {
      activeFilters[type] = e.target.value;
      applySearchAndFilters();
    });
  });
}

function applySearchAndFilters() {
  if (!catalogueRecords) return;
  
  let filtered = [...catalogueRecords];
  
  // 1. Full-text search
  if (searchQuery) {
    const terms = searchQuery.split(/\s+/);
    filtered = filtered.filter(rec => {
      const title = (rec.Titre || '').toLowerCase();
      const desc = (rec.Description || '').toLowerCase();
      const keywords = (rec.Mots_Cles || []).map(k => k.toLowerCase());
      
      return terms.every(term => {
        return title.includes(term) || 
               desc.includes(term) || 
               keywords.some(k => k.includes(term));
      });
    });
  }
  
  // 2. Select Dropdowns
  if (activeFilters.direction) {
    filtered = filtered.filter(rec => {
      const dir = rec.Direction;
      return String(dir || '').toLowerCase() === String(activeFilters.direction).toLowerCase();
    });
  }
  if (activeFilters.sensitivity) {
    filtered = filtered.filter(rec => {
      const sensList = Array.isArray(rec.Niveau_Sensibilite) ? rec.Niveau_Sensibilite : [rec.Niveau_Sensibilite];
      return sensList.some(s => String(s || '').toLowerCase() === String(activeFilters.sensitivity).toLowerCase());
    });
  }
  if (activeFilters.publication) {
    filtered = filtered.filter(rec => {
      const pub = rec.Statut_Publication;
      return String(pub || '').toLowerCase() === String(activeFilters.publication).toLowerCase();
    });
  }
  if (activeFilters.format) {
    filtered = filtered.filter(rec => {
      const formatsList = Array.isArray(rec.Format_Donnees) ? rec.Format_Donnees : [rec.Format_Donnees];
      return formatsList.some(f => {
        const name = typeof f === 'object' ? (f.valeur || f.label || JSON.stringify(f)) : f;
        return String(name || '').toLowerCase() === String(activeFilters.format).toLowerCase();
      });
    });
  }
  
  // Update result count
  const countEl = document.getElementById('results-count');
  if (countEl) {
    countEl.textContent = `${filtered.length} jeu(s) de données répertorié(s)`;
  }
  
  renderCatalogueList(filtered);
}

// Mapping from sensitivity to DSFR badges
function getDsfrBadgeColor(sensitivity) {
  switch (sensitivity) {
    case 'open-data':
      return 'fr-badge--green-emeraude';
    case 'diffusion-restreinte':
      return 'fr-badge--blue-france';
    case 'donnees-personnelles-rgpd':
      return 'fr-badge--purple-glycine';
    case 'diffusion-contrainee':
      return 'fr-badge--yellow-tournesol';
    case 'confidentiel':
      return 'fr-badge--red-marianne';
    default:
      return 'fr-badge--info';
  }
}

// --- Render Catalogue Cards (DSFR Horizontal Cards) ---
function getPrimarySensitivity(sens) {
  if (!sens) return 'open-data';
  if (Array.isArray(sens)) {
    return sens[0] || 'open-data';
  }
  return sens;
}

function renderCatalogueList(records) {
  const container = document.getElementById('catalog-list');
  if (!container) return;
  
  container.innerHTML = '';
  
  if (records.length === 0) {
    container.innerHTML = `
      <div class="empty-state fr-p-4w">
        <h3 class="fr-h6">Aucun jeu de données ne correspond</h3>
        <p class="fr-text--sm">Ajustez vos filtres ou élargissez vos termes de recherche.</p>
      </div>
    `;
    return;
  }
  
  records.forEach(rec => {
    const card = document.createElement('div');
    card.className = 'fr-card fr-card--horizontal fr-card--grey fr-p-2v dataset-card';
    card.dataset.id = rec.id;
    
    const sens = getPrimarySensitivity(rec.Niveau_Sensibilite);
    card.setAttribute('data-sensitivity', sens);
    
    if (selectedRecord && selectedRecord.id === rec.id) {
      card.classList.add('active-record');
    }
    
    const formatsList = Array.isArray(rec.Format_Donnees) ? rec.Format_Donnees : (rec.Format_Donnees ? [rec.Format_Donnees] : []);
    const formats = formatsList.slice(0, 2).map(f => typeof f === 'object' ? (f.valeur || f.label || JSON.stringify(f)) : f).join(' / ') || 'N/A';
    const bureau = getBureauSigle(rec.Bureau_Producteur);
    const badgeClass = getDsfrBadgeColor(sens);
    
    card.innerHTML = `
      <div class="fr-card__body">
        <div class="fr-card__content">
          <h3 class="fr-card__title card-title" title="${rec.Titre}">${rec.Titre}</h3>
          <p class="fr-card__desc card-description">${rec.Description}</p>
          <div class="fr-card__start">
            <p class="fr-badge fr-badge--sm ${badgeClass} fr-badge--no-icon">${sens.replace('-', ' ')}</p>
          </div>
          <div class="fr-card__end card-footer">
            <span class="card-producer">📁 ${rec.Direction || 'Direction'} > ${bureau}</span>
            <span class="card-format">${formats}</span>
          </div>
        </div>
      </div>
    `;
    
    card.addEventListener('click', (e) => {
      e.preventDefault();
      openDetailPanel(rec.id, true);
    });
    
    container.appendChild(card);
  });
}

function getBureauSigle(bureauId) {
  if (!bureauId) return 'B.';
  const ent = MOCK_ENTITIES.find(e => e.id === bureauId);
  return ent ? ent.Sigle : 'B.';
}

// --- Data Normalization Helpers for Detail Panel ---
function getBureauDisplay(bureauVal) {
  if (!bureauVal) return 'Non renseigné';
  if (typeof bureauVal === 'object') {
    return bureauVal.label || bureauVal.Nom || bureauVal.Sigle || JSON.stringify(bureauVal);
  }
  const ent = MOCK_ENTITIES.find(e => e.id === bureauVal || e.Nom === bureauVal || e.Sigle === bureauVal);
  if (ent) {
    return ent.Chemin || ent.Nom || ent.Sigle;
  }
  return bureauVal;
}

function formatReference(val) {
  if (!val) return 'N/A';
  if (typeof val === 'object') {
    return val.label || val.Nom || val.valeur || val.id || JSON.stringify(val);
  }
  return val;
}

function formatList(val) {
  if (!val) return 'N/A';
  if (Array.isArray(val)) {
    if (val.length === 0) return 'N/A';
    return val.map(item => {
      if (typeof item === 'object') {
        return item.label || item.valeur || item.SI || item.Nom || JSON.stringify(item);
      }
      return item;
    }).join(', ');
  }
  return formatReference(val);
}

function formatDate(val) {
  if (!val) return 'N/A';
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return val;
    return d.toLocaleDateString('fr-FR');
  } catch (e) {
    return val;
  }
}

function formatUrl(val) {
  if (!val) return 'N/A';
  const urlStr = String(val).trim();
  if (!urlStr || urlStr === 'N/A') return 'N/A';
  let href = urlStr;
  if (!/^https?:\/\//i.test(href)) {
    href = 'http://' + href;
  }
  return `<a href="${href}" target="_blank" class="fr-link fr-icon-external-link-line fr-link--icon-right">${urlStr}</a>`;
}

function formatBool(val) {
  if (val === true || val === 'true' || val === 1) {
    return '<span class="fr-badge fr-badge--sm fr-badge--success fr-badge--no-icon">Oui</span>';
  }
  return '<span class="fr-badge fr-badge--sm fr-badge--error fr-badge--no-icon">Non</span>';
}

// --- Slide-in Detail Panel Drawer ---
function openDetailPanel(recordId, syncWithGrist = true) {
  const rec = catalogueRecords.find(r => r.id === recordId);
  if (!rec) return;
  
  selectedRecord = rec;
  
  // Highlight active card
  document.querySelectorAll('.dataset-card').forEach(c => {
    c.classList.remove('active-record');
    if (parseInt(c.dataset.id) === recordId) {
      c.classList.add('active-record');
    }
  });
  
  // Synchronize cursor with Grist table
  if (syncWithGrist && isGristMode) {
    try {
      grist.setCursorPos({ rowId: recordId });
    } catch (e) {
      console.warn("Could not sync Grist cursor position:", e);
    }
  }
  
  // Populate Drawer title & desc
  document.getElementById('detail-title').textContent = rec.Titre || 'Jeu de données sans titre';
  document.getElementById('detail-desc').textContent = rec.Description || 'Aucune description.';
  
  const badge = document.getElementById('detail-sensitivity-badge');
  const sens = getPrimarySensitivity(rec.Niveau_Sensibilite);
  badge.textContent = sens.replace('-', ' ');
  badge.className = `fr-badge fr-badge--sm ${getDsfrBadgeColor(sens)} fr-badge--no-icon`;
  
  // Keyword Tags List
  const tagsContainer = document.getElementById('detail-tags');
  if (tagsContainer) {
    tagsContainer.innerHTML = '';
    const keywords = Array.isArray(rec.Mots_Cles) ? rec.Mots_Cles : (rec.Mots_Cles ? String(rec.Mots_Cles).split(/,\s*/) : []);
    if (keywords.length > 0) {
      keywords.forEach(kw => {
        if (!kw) return;
        const li = document.createElement('li');
        li.innerHTML = `<span class="fr-tag fr-tag--sm">${kw}</span>`;
        tagsContainer.appendChild(li);
      });
    } else {
      tagsContainer.innerHTML = '<li><span class="fr-tag fr-tag--sm fr-tag--disabled">Aucun mot-clé</span></li>';
    }
  }
  
  // Populate Level 1 - Identification
  document.getElementById('detail-bureau').textContent = getBureauDisplay(rec.Bureau_Producteur);
  document.getElementById('detail-contact-service').textContent = formatReference(rec.Contact_Service);
  document.getElementById('detail-url').innerHTML = formatUrl(rec.URL);
  
  // Populate Level 2 - Classification
  document.getElementById('detail-statut-publication').textContent = formatReference(rec.Statut_Publication);
  document.getElementById('detail-sensibilite').textContent = formatList(rec.Niveau_Sensibilite);
  document.getElementById('detail-domaine').textContent = formatReference(rec.Domaine_Fonctionnel || rec.Thematique);
  document.getElementById('detail-langue').textContent = formatReference(rec.Langue);
  document.getElementById('detail-couverture-geo').textContent = formatList(rec.Couverture_Geo);
  
  const dateDebut = formatDate(rec.Periode_de_couverture_Date_de_debut);
  const dateFin = formatDate(rec.Periode_de_couverture_Date_de_fin);
  if (dateDebut !== 'N/A' || dateFin !== 'N/A') {
    document.getElementById('detail-periode-couverture').textContent = `Du ${dateDebut} au ${dateFin}`;
  } else {
    document.getElementById('detail-periode-couverture').textContent = 'N/A';
  }
  
  // Populate Level 3 - Organisation
  document.getElementById('detail-contact-principal').textContent = formatReference(rec.Contact);
  document.getElementById('detail-commanditaire').textContent = rec.Commanditaire || 'N/A';
  document.getElementById('detail-frequence').textContent = formatReference(rec.Frequence_MaJ);
  document.getElementById('detail-si').textContent = formatList(rec.Systeme_d_Information);
  document.getElementById('detail-date-publication').textContent = formatDate(rec.Date_Publication);
  document.getElementById('detail-date-maj').textContent = formatDate(rec.Date_MaJ);
  
  // Populate Level 4 - Technique & Distribution
  document.getElementById('detail-url-telechargement').innerHTML = formatUrl(rec.URL_de_telechargement);
  document.getElementById('detail-formats').textContent = formatList(rec.Format_Donnees);
  document.getElementById('detail-licence').textContent = formatReference(rec.Licence);
  document.getElementById('detail-volumetrie').textContent = rec.Volumetrie_en_Mo_ ? `${rec.Volumetrie_en_Mo_} Mo` : 'N/A';
  document.getElementById('detail-open-data-badge').innerHTML = formatBool(rec.Donnees_ouvertes);
  document.getElementById('detail-url-open-data').innerHTML = formatUrl(rec.URL_Open_Data);
  
  // Populate Level 5 - Qualification
  document.getElementById('detail-statut-qualification').textContent = formatReference(rec.Statut_Qualification);
  
  // Toggle RGPD Exporter button visibility
  const rgpdBtn = document.getElementById('print-rgpd-btn');
  if (sens === 'donnees-personnelles-rgpd') {
    rgpdBtn.style.display = 'inline-flex';
  } else {
    rgpdBtn.style.display = 'none';
  }
  
  // Open panel overlay
  const overlay = document.getElementById('detail-panel-overlay');
  const panel = document.getElementById('detail-panel');
  
  overlay.style.display = 'block';
  setTimeout(() => {
    overlay.style.opacity = '1';
    panel.classList.add('open');
  }, 10);
}

function closeDetailPanel() {
  const overlay = document.getElementById('detail-panel-overlay');
  const panel = document.getElementById('detail-panel');
  
  panel.classList.remove('open');
  overlay.style.opacity = '0';
  setTimeout(() => {
    overlay.style.display = 'none';
    selectedRecord = null;
    document.querySelectorAll('.dataset-card').forEach(c => c.classList.remove('active-record'));
  }, 200);
}

function setupDrawerActions() {
  document.getElementById('detail-panel-overlay').addEventListener('click', closeDetailPanel);
  document.getElementById('panel-close').addEventListener('click', closeDetailPanel);
  
  // Print triggers
  document.getElementById('print-rip-btn').addEventListener('click', () => {
    if (selectedRecord) printComplianceSheet('RIP');
  });
  document.getElementById('print-rgpd-btn').addEventListener('click', () => {
    if (selectedRecord) printComplianceSheet('RGPD');
  });
}

// --- DSFR Light/Dark Theme Controller ---
function setupThemeToggle() {
  const themeBtn = document.getElementById('theme-toggle');
  if (!themeBtn) return;
  
  // Default DSFR dark attribute
  const html = document.documentElement;
  
  themeBtn.addEventListener('click', () => {
    const isDark = html.getAttribute('data-fr-theme') === 'dark';
    if (isDark) {
      html.setAttribute('data-fr-theme', 'light');
      themeBtn.textContent = "Mode Sombre";
      themeBtn.className = "fr-btn fr-btn--secondary fr-btn--sm fr-icon-moon-fill";
    } else {
      html.setAttribute('data-fr-theme', 'dark');
      themeBtn.textContent = "Mode Clair";
      themeBtn.className = "fr-btn fr-btn--secondary fr-btn--sm fr-icon-sun-fill";
    }
  });
}

// --- Printable Compliance Sheets Generator ---
function printComplianceSheet(type) {
  const rec = selectedRecord;
  if (!rec) return;
  
  const printShell = document.getElementById('compliance-print-shell');
  if (!printShell) return;
  
  const vars = MOCK_DICTIONARY.filter(v => v.jeu_de_donnees === rec.id);
  let dictHtml = '';
  if (vars.length > 0) {
    dictHtml = `
      <div class="print-section">
        <div class="print-section-title">Variables et Dictionnaire Technique</div>
        <table class="print-dictionary-table">
          <thead>
            <tr>
              <th>Nom Variable</th>
              <th>Type</th>
              <th>Description / Consigne</th>
            </tr>
          </thead>
          <tbody>
            ${vars.map(v => `
              <tr>
                <td style="font-family: monospace; font-weight: bold;">${v.variable}</td>
                <td>${v.type}</td>
                <td>${v.commentaire}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
  
  const dateFormatted = rec.Date_MaJ ? new Date(rec.Date_MaJ).toLocaleDateString('fr-FR') : 'Non renseignée';
  
  if (type === 'RIP') {
    // Generate RIP compliant template
    printShell.innerHTML = `
      <div class="print-header">
        <div class="print-logo">République<br>Française</div>
        <div class="print-document-type">RÉPERTOIRE DES INFORMATIONS PUBLIQUES (RIP)</div>
      </div>
      
      <h1 class="print-title">${rec.Titre}</h1>
      <p style="font-size: 10pt; margin-bottom: 20px; font-style: italic; color: #555;">Généré automatiquement par le Catalogue de données ministérielles MEF.</p>
      
      <div class="print-meta-grid">
        <div class="print-meta-cell">
          <div class="print-label">Organisation</div>
          <div class="print-value">${rec.Organisation || 'MEF'}</div>
        </div>
        <div class="print-meta-cell">
          <div class="print-label">Service gestionnaire</div>
          <div class="print-value">${rec.Service || 'Non renseigné'}</div>
        </div>
        <div class="print-meta-cell">
          <div class="print-label">Statut réglementaire</div>
          <div class="print-value">Conforme CRPA (Art. L322-6)</div>
        </div>
        <div class="print-meta-cell">
          <div class="print-label">Sensibilité légale</div>
          <div class="print-value" style="text-transform: uppercase;">${rec.Niveau_Sensibilite}</div>
        </div>
        <div class="print-meta-cell">
          <div class="print-label">Licence légale</div>
          <div class="print-value">${rec.Licence || 'Licence Restreinte'}</div>
        </div>
        <div class="print-meta-cell">
          <div class="print-label">Date de mise à jour</div>
          <div class="print-value">${dateFormatted}</div>
        </div>
      </div>
      
      <div class="print-section">
        <div class="print-section-title">1. Descriptif et utilité</div>
        <p>${rec.Description}</p>
      </div>
      
      <div class="print-section">
        <div class="print-section-title">2. Accès et diffusion publique</div>
        <ul style="margin-left: 20px; margin-top: 6px;">
          <li><strong>Statut d'ouverture :</strong> ${rec.Donnees_ouvertes ? 'Données publiées sur data.gouv.fr' : 'Diffusion restreinte à l\'administration'}</li>
          <li><strong>Format de distribution :</strong> ${(rec.Format_Donnees || []).join(', ')}</li>
          <li><strong>Fréquence de révision :</strong> ${rec.Frequence_MaJ || 'Non spécifiée'}</li>
        </ul>
      </div>
      
      ${dictHtml}
      
      <div class="print-footer">
        Référentiel de conformité légale CRPA — Catalogue ministériel MEF
      </div>
    `;
  } else if (type === 'RGPD') {
    // Generate RGPD register Art. 30 compliant template
    printShell.innerHTML = `
      <div class="print-header">
        <div class="print-logo">République<br>Française</div>
        <div class="print-document-type">REGISTRE DES TRAITEMENTS (RGPD ART. 30)</div>
      </div>
      
      <h1 class="print-title">Registre : ${rec.Titre}</h1>
      <p style="font-size: 10pt; margin-bottom: 20px; font-style: italic; color: #555;">Annexe technique de déclaration de traitement de données personnelles nominatives.</p>
      
      <div class="print-meta-grid">
        <div class="print-meta-cell">
          <div class="print-label">Responsable traitement</div>
          <div class="print-value">${rec.Organisation || 'MEF'}</div>
        </div>
        <div class="print-meta-cell">
          <div class="print-label">Service Référent</div>
          <div class="print-value">${rec.Service || 'Non renseigné'}</div>
        </div>
        <div class="print-meta-cell">
          <div class="print-label">Sensibilité</div>
          <div class="print-value" style="color: #6a1b9a; font-weight: bold;">DONNÉES PERSONNELLES RGPD</div>
        </div>
        <div class="print-meta-cell">
          <div class="print-label">Identifiant unique</div>
          <div class="print-value" style="font-family: monospace; font-size: 8.5pt;">${rec.BUID || 'Non mesuré'}</div>
        </div>
      </div>
      
      <div class="print-section">
        <div class="print-section-title">1. Finalité Légitime</div>
        <p>${rec.Description}</p>
        <p style="margin-top: 8px;"><strong>Base Légale :</strong> Article 6(e) du RGPD - Exécution d'une mission d'intérêt public.</p>
      </div>
      
      <div class="print-section">
        <div class="print-section-title">2. Données à caractère personnel collectées</div>
        <p>Les variables comprennent des informations nominatives directes ou de réidentification :</p>
        <ul style="margin-left: 20px; margin-top: 6px;">
          <li><strong>Catégories de variables identifiées :</strong> ${vars.map(v => v.variable).join(', ') || 'Identité agent, NIR, Données RH'}</li>
          <li><strong>Durée d'utilité administrative (DUA) :</strong> 10 ans après clôture, puis archivage.</li>
        </ul>
      </div>
      
      ${dictHtml}
      
      <div class="print-footer">
        Fiche Registre RGPD — Secrétariat Général MEF — Article 30 RGPD
      </div>
    `;
  }
  
  // Trigger system print window
  window.print();
}
