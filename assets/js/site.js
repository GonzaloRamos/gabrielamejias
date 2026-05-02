const navigation = document.querySelector("[data-site-nav]");
const navigationLinks = navigation ? navigation.querySelectorAll(".nav-link[data-scroll-target]") : [];
const scrollTriggers = document.querySelectorAll("[data-scroll-target]");
const contactNavigationButton = navigation ? navigation.querySelector('.nav-cta[data-scroll-target="#contacto"]') : null;
const sections = [...document.querySelectorAll("main section[id]")];
const contactForm = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");
const navbarCollapseElement = document.getElementById("navbarNav");
let lockedSectionId = "";
let scrollLockTimeoutId = 0;

function getNavigationOffset() {
    return navigation ? navigation.offsetHeight + 12 : 0;
}

function scrollToSection(selector) {
    const target = document.querySelector(selector);

    if (!target) {
        return;
    }

    const top = target.getBoundingClientRect().top + window.scrollY - getNavigationOffset();

    window.scrollTo({
        top,
        behavior: "smooth",
    });
}

function setActiveLink(targetId) {
    navigationLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${targetId}`;
        link.classList.toggle("active", isActive);
        if (isActive) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });

    if (contactNavigationButton) {
        const isContactActive = targetId === "contacto";
        contactNavigationButton.classList.toggle("active", isContactActive);
        if (isContactActive) {
            contactNavigationButton.setAttribute("aria-current", "page");
        } else {
            contactNavigationButton.removeAttribute("aria-current");
        }
    }
}

function getActiveSectionId() {
    const scrollPosition = window.scrollY + getNavigationOffset() + 24;
    let currentSectionId = sections[0]?.id || "";

    sections.forEach((section) => {
        if (scrollPosition >= section.offsetTop) {
            currentSectionId = section.id;
        }
    });

    return currentSectionId;
}

function syncActiveNavigation() {
    const activeSectionId = getActiveSectionId();

    if (activeSectionId) {
        setActiveLink(activeSectionId);
    }
}

function clearScrollLock() {
    if (scrollLockTimeoutId) {
        window.clearTimeout(scrollLockTimeoutId);
        scrollLockTimeoutId = 0;
    }

    lockedSectionId = "";
}

function releaseScrollLockIfReached() {
    if (!lockedSectionId) {
        return false;
    }

    const targetSection = document.getElementById(lockedSectionId);

    if (!targetSection) {
        clearScrollLock();
        syncActiveNavigation();
        return true;
    }

    const distanceToTarget = Math.abs(targetSection.getBoundingClientRect().top - getNavigationOffset());

    if (distanceToTarget <= 20) {
        clearScrollLock();
        syncActiveNavigation();
        return true;
    }

    return false;
}

function lockNavigationToSection(targetId) {
    clearScrollLock();
    lockedSectionId = targetId;
    setActiveLink(targetId);

    scrollLockTimeoutId = window.setTimeout(() => {
        clearScrollLock();
        syncActiveNavigation();
    }, 1400);
}

scrollTriggers.forEach((link) => {
    link.addEventListener("click", (event) => {
        const targetSelector = link.getAttribute("data-scroll-target");

        if (!targetSelector) {
            return;
        }

        event.preventDefault();
        lockNavigationToSection(targetSelector.replace("#", ""));
        scrollToSection(targetSelector);

        if (window.history.pushState) {
            window.history.pushState(null, "", targetSelector);
        }

        if (navbarCollapseElement && navbarCollapseElement.classList.contains("show") && window.bootstrap?.Collapse) {
            window.bootstrap.Collapse.getOrCreateInstance(navbarCollapseElement).hide();
        }
    });
});

window.addEventListener(
    "scroll",
    () => {
        if (lockedSectionId) {
            releaseScrollLockIfReached();
            return;
        }

        syncActiveNavigation();
    },
    { passive: true }
);

window.addEventListener("resize", () => {
    if (lockedSectionId) {
        releaseScrollLockIfReached();
        return;
    }

    syncActiveNavigation();
});

if (window.location.hash) {
    scrollToSection(window.location.hash);
}

syncActiveNavigation();

if (contactForm && formStatus) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!contactForm.reportValidity()) {
            return;
        }

        const formData = new FormData(contactForm);
        const name = String(formData.get("nombre") || "").trim();
        const email = String(formData.get("email") || "").trim();
        const service = String(formData.get("servicio") || "").trim();
        const message = String(formData.get("mensaje") || "").trim();
        const subject = encodeURIComponent(`Consulta desde el sitio web - ${name}`);
        const body = encodeURIComponent(
            [
                `Nombre: ${name}`,
                `Correo: ${email}`,
                `Servicio de interés: ${service}`,
                "",
                "Mensaje:",
                message,
            ].join("\n")
        );

        formStatus.textContent = "Se está abriendo tu cliente de correo predeterminado.";
        window.location.href = `mailto:gabrielamejias@gmail.com?subject=${subject}&body=${body}`;
    });
}
