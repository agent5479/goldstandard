(() => {
  const form = document.getElementById("enquiry-form");
  if (!form) return;

  const submitButton = document.getElementById("submit-button");
  const successMessage = document.getElementById("form-success");
  const errorMessage = document.getElementById("form-error");

  const hideMessages = () => {
    successMessage.classList.add("is-hidden");
    errorMessage.classList.add("is-hidden");
  };

  const showError = (message) => {
    errorMessage.textContent = message;
    errorMessage.classList.remove("is-hidden");
  };

  const setSubmittingState = (isSubmitting) => {
    if (!submitButton) return;
    submitButton.disabled = isSubmitting;
    submitButton.textContent = isSubmitting ? "Sending..." : "Send enquiry";
  };

  const hasValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!window.GSDT_FORM_ACCESS_KEY) {
    showError("Enquiry form is not configured yet. Please call or email Warwick directly.");
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    hideMessages();

    const name = form.elements.name.value.trim();
    const phone = form.elements.phone.value.trim();
    const email = form.elements.email.value.trim();
    const message = form.elements.message.value.trim();
    const service = form.elements.service_interest.value.trim();
    const honeypot = form.elements.website.value.trim();

    if (honeypot) return;

    if (!name || !phone || !email || !message || !service) {
      showError("Please complete all required fields.");
      return;
    }

    if (!hasValidEmail(email)) {
      showError("Please enter a valid email address.");
      return;
    }

    if (!window.GSDT_FORM_ACCESS_KEY) {
      showError("Enquiry form is not configured yet. Please call or email Warwick directly.");
      return;
    }

    const payload = {
      access_key: window.GSDT_FORM_ACCESS_KEY,
      from_name: name,
      subject: `New Gold Standard enquiry (${service})`,
      name,
      phone,
      email,
      dog_name: form.elements.dog_name.value.trim(),
      service_interest: service,
      message
    };

    try {
      setSubmittingState(true);
      const response = await fetch(window.GSDT_FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to submit form.");
      }

      form.reset();
      successMessage.classList.remove("is-hidden");
    } catch (error) {
      showError("There was a problem sending your enquiry. Please try again or call/text 027 814 2222.");
    } finally {
      setSubmittingState(false);
    }
  });
})();
