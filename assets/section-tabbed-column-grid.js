class TabbedColumnGrid {
  constructor(section) {
    this.section = section;
    this.tabs = section.querySelectorAll('.tcg__tab');
    this.panels = section.querySelectorAll('.tcg__panel');
    this.loadMoreButtons = section.querySelectorAll('.tcg__load-more');

    this.tabs.forEach((tab) => {
      tab.addEventListener('click', () => this.switchTab(tab));
    });

    this.loadMoreButtons.forEach((btn) => {
      btn.addEventListener('click', () => this.loadMore(btn));
    });
  }

  switchTab(activeTab) {
    const targetTab = activeTab.dataset.tab;

    this.tabs.forEach((tab) => {
      const isActive = tab.dataset.tab === targetTab;
      tab.classList.toggle('tcg__tab--active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    this.panels.forEach((panel) => {
      const isActive = panel.dataset.tab === targetTab;
      panel.classList.toggle('tcg__panel--active', isActive);
      if (isActive) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', '');
      }
    });
  }

  loadMore(btn) {
    const tab = btn.dataset.loadMoreTab;
    const panel = this.section.querySelector(`.tcg__panel[data-tab="${tab}"]`);
    if (!panel) return;

    const hiddenItems = panel.querySelectorAll('.tcg__grid-item--hidden');
    hiddenItems.forEach((item) => item.classList.remove('tcg__grid-item--hidden'));

    btn.closest('.tcg__load-more-wrap').remove();
  }
}

document.querySelectorAll('[data-section-type="tabbed-column-grid"]').forEach((section) => {
  new TabbedColumnGrid(section);
});
