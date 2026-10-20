(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Reveal page sections as they enter the viewport.
  const revealItems = document.querySelectorAll(".reveal");
  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("visible"));
  }

  // Mobile navigation.
  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector(".site-nav");
  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      siteNav.classList.toggle("is-open", !isOpen);
    });
    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.setAttribute("aria-expanded", "false");
        siteNav.classList.remove("is-open");
      });
    });
  }

  // Smooth scrolling for valid in-page links.
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (target && !link.hasAttribute("data-learn") && !link.hasAttribute("data-home")) {
        event.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
      }
    });
  });

  // Active navigation link.
  const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
  const navSections = navLinks.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window && navSections.length) {
    const navObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (!visible.length) return;
      navLinks.forEach((link) => {
        if (link.getAttribute("href") === `#${visible[0].target.id}`) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }, { rootMargin: "-15% 0px -65% 0px", threshold: [0, 0.15, 0.35, 0.6] });
    navSections.forEach((section) => navObserver.observe(section));
  }

  // Project concept preview modal.
  const modal = document.getElementById("conceptModal");
  if (modal) {
    const screens = [...modal.querySelectorAll("[data-screen]")];
    const address = document.getElementById("browserAddress");
    const closeButton = modal.querySelector(".concept-close");
    let lastFocusedElement = null;
    const conceptNames = { nova: "NOVA", velocity: "VELOCITY", nexora: "NEXORA" };

    function openConcept(name, trigger) {
      if (!conceptNames[name]) return;
      lastFocusedElement = trigger || document.activeElement;
      screens.forEach((screen) => { screen.hidden = screen.dataset.screen !== name; });
      if (address) address.textContent = `comecode.studio / concept / ${name}`;
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("concept-modal-open");
      const activeScreen = screens.find((screen) => screen.dataset.screen === name);
      if (activeScreen) activeScreen.scrollTop = 0;
      if (closeButton) closeButton.focus();
    }

    function closeConcept() {
      if (!modal.classList.contains("is-open")) return;
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("concept-modal-open");
      if (lastFocusedElement && lastFocusedElement.isConnected) lastFocusedElement.focus();
    }

    document.querySelectorAll("[data-project]").forEach((button) => {
      button.addEventListener("click", () => openConcept(button.dataset.project, button));
    });
    modal.querySelectorAll("[data-close-modal]").forEach((button) => button.addEventListener("click", closeConcept));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeConcept();
    });

    modal.querySelectorAll("[data-learn]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        const screen = button.closest("[data-screen]");
        const details = screen && screen.querySelector(".concept-details");
        if (details) details.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
      });
    });

    modal.querySelectorAll("[data-contact]").forEach((button) => {
      button.addEventListener("click", () => {
        closeConcept();
        const contact = document.querySelector("#contact");
        if (contact) contact.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
      });
    });

    modal.querySelectorAll("[data-home]").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const screen = link.closest("[data-screen]");
        if (screen) screen.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
      });
    });
  }

 
  // COMECODE contact form — FormSubmit
  const inquiryForm = document.querySelector("#inquiry-form");
  const formStatus = document.querySelector("#form-status");

  if (inquiryForm && formStatus) {
    inquiryForm.action =
      "https://formsubmit.co/comecode.studio@gmail.com";
    inquiryForm.method = "POST";

    inquiryForm.addEventListener("submit", () => {
      formStatus.textContent = "Sending your inquiry...";
    });
  }
})();