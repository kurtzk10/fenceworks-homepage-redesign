class LSCategoryCards {
  constructor(section) {
    this.section = section;
    this.interval = null;
    this.rotationStep = 0;

    // All cards in DOM order — rotation fires in the sequence: 1st, 3rd, 2nd, 4th (0-indexed: 0,2,1,3)
    this.allCards = Array.from(section.querySelectorAll('.lscg__card-wrap'));
    this.rotationOrder = [0, 2, 1, 3]
      .map((i) => this.allCards[i])
      .filter((card) => card && card.querySelectorAll('.lscg__card-img-slot').length > 1);

    if (this.rotationOrder.length > 0) {
      this.startRotation();
    }
  }

  startRotation() {
    this.interval = setInterval(() => {
      const card = this.rotationOrder[this.rotationStep % this.rotationOrder.length];
      this.rotateCard(card);
      this.rotationStep++;
    }, 5000);
  }

  rotateCard(card) {
    const slots = card.querySelectorAll('.lscg__card-img-slot');
    const activeIndex = Array.from(slots).findIndex((s) =>
      s.classList.contains('lscg__card-img-slot--active')
    );
    const nextIndex = (activeIndex + 1) % slots.length;

    slots[activeIndex].classList.remove('lscg__card-img-slot--active');
    slots[nextIndex].classList.add('lscg__card-img-slot--active');
  }

  destroy() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}

document
  .querySelectorAll('[data-section-type="ls-category-cards"]')
  .forEach((section) => {
    new LSCategoryCards(section);
  });
