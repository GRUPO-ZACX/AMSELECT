const header = document.querySelector(".site-header");
const menuToggle = document.querySelector("[data-menu-toggle]");
const siteNav = document.querySelector("#site-nav");

if (header && menuToggle && siteNav) {
  const setMenuOpen = (isOpen) => {
    header.classList.toggle("is-menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  };

  menuToggle.addEventListener("click", () => {
    setMenuOpen(!header.classList.contains("is-menu-open"));
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      setMenuOpen(false);
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuOpen(false);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      setMenuOpen(false);
    }
  });
}

const platformsCarousel = document.querySelector("[data-platforms-carousel]");

if (platformsCarousel) {
  const slides = Array.from(platformsCarousel.querySelectorAll("[data-platforms-slide]"));
  let activeSlide = 0;
  let rotationTimer = null;
  let isVisible = false;

  const syncRotation = () => {
    window.clearInterval(rotationTimer);
    rotationTimer = null;

    if (isVisible && !document.hidden && slides.length > 1) {
      rotationTimer = window.setInterval(() => {
        activeSlide = (activeSlide + 1) % slides.length;

        slides.forEach((slide, index) => {
          const isActive = index === activeSlide;
          slide.classList.toggle("is-active", isActive);
          slide.setAttribute("aria-hidden", String(!isActive));
        });
      }, 2000);
    }
  };

  document.addEventListener("visibilitychange", syncRotation);

  new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting && entry.intersectionRatio >= 0.2;
    syncRotation();
  }, { threshold: [0, 0.2] }).observe(platformsCarousel);
}

const feedbackCarousel = document.querySelector(".feedbacks-marquee");

if (feedbackCarousel) {
  const cards = Array.from(feedbackCarousel.querySelectorAll(".feedback-card"));
  let activeReview = 0;
  let reviewTimer = null;
  let isVisible = false;
  let isHovered = false;
  let touchStart = null;

  const showReview = (index) => {
    activeReview = (index + cards.length) % cards.length;
    cards.forEach((card, cardIndex) => {
      card.hidden = cardIndex !== activeReview;
    });
  };

  const syncReviews = () => {
    window.clearInterval(reviewTimer);
    reviewTimer = null;

    if (isVisible && !document.hidden && !isHovered && !feedbackCarousel.contains(document.activeElement) && cards.length > 1) {
      reviewTimer = window.setInterval(() => showReview(activeReview + 1), 7000);
    }
  };

  feedbackCarousel.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse") {
      isHovered = true;
      syncReviews();
    }
  });

  feedbackCarousel.addEventListener("pointerleave", (event) => {
    if (event.pointerType === "mouse") {
      isHovered = false;
      syncReviews();
    }
  });

  feedbackCarousel.addEventListener("focusin", syncReviews);
  feedbackCarousel.addEventListener("focusout", (event) => {
    if (!feedbackCarousel.contains(event.relatedTarget)) {
      window.setTimeout(syncReviews, 0);
    }
  });

  feedbackCarousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      showReview(activeReview + (event.key === "ArrowRight" ? 1 : -1));
    }
  });

  feedbackCarousel.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch") {
      touchStart = { x: event.clientX, y: event.clientY };
      feedbackCarousel.setPointerCapture(event.pointerId);
    }
  });

  feedbackCarousel.addEventListener("pointerup", (event) => {
    if (!touchStart) return;
    const deltaX = event.clientX - touchStart.x;
    const deltaY = event.clientY - touchStart.y;
    touchStart = null;

    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      showReview(activeReview + (deltaX < 0 ? 1 : -1));
      syncReviews();
    }
  });

  feedbackCarousel.addEventListener("pointercancel", () => { touchStart = null; });
  document.addEventListener("visibilitychange", syncReviews);

  if (cards.length) {
    showReview(0);
    feedbackCarousel.classList.add("is-ready");
    new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      syncReviews();
    }, { threshold: 0 }).observe(feedbackCarousel);
  }
}
