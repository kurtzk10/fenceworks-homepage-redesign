/*
  Animated <details> for .lsfaq__item.

  Pattern: intercept the <summary> click, animate the <details> element's
  own `height` (summary-height ↔ summary + content height) via the Web
  Animations API, and only flip the `open` attribute when the animation
  finishes. This sidesteps the UA's "hide non-summary children when
  closed" behavior so the close direction animates symmetrically with
  the open direction, and re-opens always start from the correct height
  instead of snapping.

  Adapted from the MDN canonical recipe:
  https://css-tricks.com/how-to-animate-the-details-element/
*/

const DURATION = 350;
const EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';
/*
  fill: 'forwards' makes the animation's end value persist after it
  finishes. We then clear inline styles and `cancel()` the animation
  inside onAnimationFinish — that ordering lets the computed height
  hop straight from the animation's end value to the element's natural
  `auto` height (which by construction equals the end value), so there
  is no visible snap when the resting state takes over.
*/
const ANIM_OPTIONS = { duration: DURATION, easing: EASING, fill: 'forwards' };

class LsFaqItem {
  constructor(details) {
    this.details = details;
    this.summary = details.querySelector('.lsfaq__q');
    this.content = details.querySelector('.lsfaq__a');

    if (!this.summary || !this.content) return;

    this.animation = null;
    this.isClosing = false;
    this.isExpanding = false;

    this.summary.addEventListener('click', (e) => this.onClick(e));
  }

  get prefersReduced() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  onClick(e) {
    if (this.prefersReduced) return; // native behavior is fine

    e.preventDefault();
    this.details.style.overflow = 'hidden';

    if (this.isClosing || !this.details.open) {
      this.open();
    } else if (this.isExpanding || this.details.open) {
      this.shrink();
    }
  }

  /*
    The details element itself can have padding + border (we have
    `padding: 8px 0` and a `border-bottom: 1px` on .lsfaq__item).
    `details.offsetHeight` includes those; `summary.offsetHeight +
    content.offsetHeight` does NOT. Without this adjustment the
    animation ends a few px short of the natural `auto` height and the
    element snaps to fill the gap when fill='forwards' is released.
  */
  boxAdjust() {
    const cs = getComputedStyle(this.details);
    return (
      parseFloat(cs.paddingTop) +
      parseFloat(cs.paddingBottom) +
      parseFloat(cs.borderTopWidth) +
      parseFloat(cs.borderBottomWidth)
    );
  }

  shrink() {
    this.isClosing = true;
    // Flag the closing state so the +/− icon CSS can morph back to "+"
    // in lock-step with the height collapse instead of snapping at the
    // very end (when [open] finally flips off).
    this.details.classList.add('is-closing');

    const startHeight = `${this.details.offsetHeight}px`;
    const endHeight = `${this.summary.offsetHeight + this.boxAdjust()}px`;

    if (this.animation) this.animation.cancel();

    this.animation = this.details.animate(
      { height: [startHeight, endHeight] },
      ANIM_OPTIONS
    );

    this.animation.onfinish = () => this.onAnimationFinish(false);
    this.animation.oncancel = () => {
      this.isClosing = false;
    };
  }

  open() {
    // If we're interrupting a close-in-progress, drop the closing flag
    // so the icon snaps back to "−" alongside the new expand animation.
    this.details.classList.remove('is-closing');
    // Pin current (closed) height before flipping `open` so the layout
    // doesn't jump while we wait for the next frame.
    this.details.style.height = `${this.details.offsetHeight}px`;
    this.details.open = true;
    requestAnimationFrame(() => this.expand());
  }

  expand() {
    this.isExpanding = true;

    const startHeight = `${this.details.offsetHeight}px`;
    const endHeight = `${
      this.summary.offsetHeight + this.content.offsetHeight + this.boxAdjust()
    }px`;

    if (this.animation) this.animation.cancel();

    this.animation = this.details.animate(
      { height: [startHeight, endHeight] },
      ANIM_OPTIONS
    );

    this.animation.onfinish = () => this.onAnimationFinish(true);
    this.animation.oncancel = () => {
      this.isExpanding = false;
    };
  }

  onAnimationFinish(open) {
    // Stash + null our pointer first so the cancel() below (which fires
    // oncancel) doesn't clobber state we're about to set.
    const anim = this.animation;
    this.animation = null;

    // Establish the resting state under cover of the still-active
    // animation effect: flip [open] (UA shows/hides content) and drop
    // the inline overrides so natural `auto` height takes over.
    this.details.open = open;
    this.details.style.height = '';
    this.details.style.overflow = '';
    this.details.classList.remove('is-closing');

    this.isClosing = false;
    this.isExpanding = false;

    // Now remove the persisted animation effect. Because fill:'forwards'
    // was holding height at the animation's end value — and that end
    // value equals the new natural height — there's nothing to "snap"
    // to: the computed height transitions directly to auto.
    if (anim) anim.cancel();
  }
}

function init(root = document) {
  root.querySelectorAll('.lsfaq__item').forEach((item) => {
    if (item.__lsfaqInit) return;
    new LsFaqItem(item);
    item.__lsfaqInit = true;
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => init());
} else {
  init();
}

// Theme-editor: re-init when a section is added/edited
document.addEventListener('shopify:section:load', (e) => init(e.target));