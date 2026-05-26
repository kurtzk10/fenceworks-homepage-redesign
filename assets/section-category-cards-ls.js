class CategoryCards {
  constructor(section) {
    this.section = section;

    // Only track cards that have more than one image
    this.cards = Array.from(section.querySelectorAll('.cc__card')).filter(
      (card) => parseInt(card.dataset.imageCount || '0') > 1
    );

    if (this.cards.length === 0) return;

    this.cards.forEach((card) => {
      card._ccImageIndex = 0;
    });

    this.interval = setInterval(() => this.rotateRandom(), 3000);
  }

  rotateRandom() {
    const card = this.cards[Math.floor(Math.random() * this.cards.length)];
    this.rotateCard(card);
  }

  rotateCard(card) {
    const images = card.querySelectorAll('.cc__card-image');
    if (images.length <= 1) return;

    const currentIndex = card._ccImageIndex;
    const nextIndex = (currentIndex + 1) % images.length;

    images[currentIndex].classList.remove('cc__card-image--active');
    images[nextIndex].classList.add('cc__card-image--active');

    card._ccImageIndex = nextIndex;
  }

  destroy() {
    clearInterval(this.interval);
  }
}

document.querySelectorAll('[data-section-type="category-cards"]').forEach((section) => {
  new CategoryCards(section);
});
