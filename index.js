const APPS_SCRIPT_PLACEHOLDER = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";

const form = document.querySelector(".contact-form");

if (form) {
    const submitButton = form.querySelector(".submit-btn");
    const statusEl = form.querySelector(".form-status");
    const fields = {
        name: form.querySelector("#name"),
        email: form.querySelector("#email"),
        message: form.querySelector("#message"),
        website: form.querySelector("#website"),
    };

    const setStatus = (message, state = "") => {
        statusEl.textContent = message;
        statusEl.className = `form-status${state ? ` is-${state}` : ""}`;
    };

    const markInvalid = (field, isInvalid) => {
        field.classList.toggle("is-invalid", isInvalid);
        field.setAttribute("aria-invalid", String(isInvalid));
    };

    const validate = () => {
        let firstInvalidField = null;

        const name = fields.name.value.trim();
        const email = fields.email.value.trim();
        const message = fields.message.value.trim();
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        const rules = [
            [fields.name, name.length < 2],
            [fields.email, !emailOk],
            [fields.message, message.length < 10],
        ];

        rules.forEach(([field, invalid]) => {
            markInvalid(field, invalid);

            if (invalid && !firstInvalidField) {
                firstInvalidField = field;
            }
        });

        if (firstInvalidField) {
            firstInvalidField.focus();
            setStatus("Please enter your name, a valid email, and a message with at least 10 characters.", "error");
            return false;
        }

        setStatus("");
        return true;
    };

    const setSubmitting = (isSubmitting) => {
        submitButton.disabled = isSubmitting;
        submitButton.textContent = isSubmitting ? "Sending..." : "Submit";
    };

    [fields.name, fields.email, fields.message].forEach((field) => {
        field.addEventListener("input", () => {
            if (field.classList.contains("is-invalid")) {
                validate();
            }
        });
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const endpoint = form.dataset.endpoint?.trim();

        if (!validate()) {
            return;
        }

        if (!endpoint || endpoint === APPS_SCRIPT_PLACEHOLDER) {
            setStatus("Connect your Google Apps Script URL in the form's data-endpoint before using the contact box.", "error");
            return;
        }

        if (fields.website.value.trim() !== "") {
            setStatus("Submission blocked.", "error");
            return;
        }

        const payload = new URLSearchParams({
            name: fields.name.value.trim(),
            email: fields.email.value.trim(),
            message: fields.message.value.trim(),
            website: fields.website.value.trim(),
            source: window.location.href,
        });

        try {
            setSubmitting(true);
            setStatus("Sending your message...", "loading");

            await fetch(endpoint, {
                method: "POST",
                mode: "no-cors",
                body: payload,
            });

            form.reset();
            [fields.name, fields.email, fields.message].forEach((field) => {
                markInvalid(field, false);
            });
            setStatus("Message sent. If your Apps Script is deployed correctly, it should appear in Google Sheets shortly.", "success");
        } catch (error) {
            setStatus(error.message || "Something went wrong while sending your message.", "error");
        } finally {
            setSubmitting(false);
        }
    });
}
