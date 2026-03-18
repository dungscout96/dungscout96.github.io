/* ========================================
   Theme Toggle + Publication Filters
   ======================================== */

// --- Dark Mode ---
function toggleTheme() {
  const body = document.body;
  const icon = document.getElementById('theme-icon');
  body.classList.toggle('dark');
  if (body.classList.contains('dark')) {
    icon.className = 'fa-solid fa-sun';
    localStorage.setItem('theme', 'dark');
  } else {
    icon.className = 'fa-solid fa-moon';
    localStorage.setItem('theme', 'light');
  }
}

// Restore saved theme
(function () {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    document.body.classList.add('dark');
    const icon = document.getElementById('theme-icon');
    if (icon) icon.className = 'fa-solid fa-sun';
  }
})();

// --- Publication Filters ---
function filterPubs(topic, btn) {
  // Update active button
  document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');

  const cards = document.querySelectorAll('.pub-card');
  const yearGroups = document.querySelectorAll('.pub-year-group');

  if (topic === 'all') {
    cards.forEach(c => c.style.display = '');
    yearGroups.forEach(g => g.style.display = '');
    return;
  }

  cards.forEach(card => {
    const topics = card.getAttribute('data-topics') || '';
    card.style.display = topics.includes(topic) ? '' : 'none';
  });

  // Hide year groups with no visible cards
  yearGroups.forEach(group => {
    const visibleCards = group.querySelectorAll('.pub-card:not([style*="display: none"])');
    group.style.display = visibleCards.length > 0 ? '' : 'none';
  });
}
