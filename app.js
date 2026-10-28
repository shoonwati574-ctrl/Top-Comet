(() => {
  const sections = [...document.querySelectorAll(".view")];
  const navigation = [...document.querySelectorAll(".primary-nav [data-view]")];
  const pageIndicator = document.getElementById("page-indicator");
  const pageNumbers = {
    home: "HOME",
    about: "ABOUT",
    profile: "PROFILE",
    gallery: "GALLERY",
    contact: "CONTACT",
  };

  function showView(id, updateHash = true) {
    const target = document.getElementById(id);
    if (!target || !target.classList.contains("view")) return;

    sections.forEach((section) => {
      const active = section === target;
      section.hidden = !active;
      section.classList.toggle("is-active", active);
      section.setAttribute("aria-hidden", String(!active));
      if (active) section.scrollTop = 0;
    });

    navigation.forEach((button) => {
      if (button.dataset.view === id)
        button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });

    if (pageIndicator)
      pageIndicator.textContent = `${pageNumbers[id] || "HOME"} / 05`;
    if (updateHash) history.replaceState(null, "", `#${id}`);
  }

  navigation.forEach((button) =>
    button.addEventListener("click", () => showView(button.dataset.view)),
  );
  document
    .querySelectorAll("[data-go]")
    .forEach((button) =>
      button.addEventListener("click", () => showView(button.dataset.go)),
    );
  document
    .querySelectorAll('.brand[href="#home"], .footer-brand[href="#home"]')
    .forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        showView("home");
      });
    });

  const initial = location.hash.slice(1);
  showView(
    document.getElementById(initial)?.classList.contains("view")
      ? initial
      : "home",
    false,
  );
  window.addEventListener("hashchange", () =>
    showView(location.hash.slice(1), false),
  );

  const form = document.getElementById("contact-form");
  const result = document.getElementById("form-result");
  if (form && result) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      result.className = "form-result";
      const fields = [...form.querySelectorAll("input, textarea")];
      fields.forEach((field) => field.removeAttribute("aria-invalid"));

      const firstInvalid = fields.find((field) => !field.checkValidity());
      if (firstInvalid) {
        firstInvalid.setAttribute("aria-invalid", "true");
        result.classList.add("is-error");
        result.textContent =
          "Please complete each field with a valid name, email address, and message.";
        firstInvalid.focus();
        return;
      }

      result.classList.add("is-success");
      result.textContent =
        "Your enquiry is complete and has not been sent. The agency email is awaiting confirmation; please call 09959359423 to reach the team.";
    });
  }
})();
