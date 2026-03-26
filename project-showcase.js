document.addEventListener("DOMContentLoaded", () => {
    const sections = Array.from(document.querySelectorAll(".project-section"));

    if (!sections.length) {
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                entry.target.classList.toggle("is-visible", entry.isIntersecting);
            });
        },
        {
            threshold: 0.45,
            rootMargin: "-8% 0px -8% 0px",
        }
    );

    sections.forEach((section, index) => {
        if (index === 0) {
            section.classList.add("is-visible");
        }

        observer.observe(section);
    });
});
