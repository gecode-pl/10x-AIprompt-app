const apiUrl = "http://127.0.0.1:3000/api/auth";

document.addEventListener("DOMContentLoaded", () => {
  // Dynamiczne includy
  const include = (id, file) => {
    const el = document.getElementById(id);
    if (!el) return;
    fetch(file)
      .then((res) => res.text())
      .then((html) => {
        el.outerHTML = html;

        // Jeśli to navbar, odpal logikę po załadowaniu
        if (id === "include-navbar") {
          setTimeout(handleNavbarLogic, 50);
        }
      });
  };

  include("include-head", "components/head.html");
  include("include-footer", "components/footer.html");
  include("include-navbar", "components/navbar.html");

  function handleNavbarLogic() {
    const logoutBtn = document.getElementById("logoutBtn");
    const logoutItem = document.getElementById("logoutItem");

    if (logoutBtn && logoutItem) {
      const token = localStorage.getItem("token");
      if (token) logoutItem.style.display = "block";

      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "login.html";
      });
    }
  }

  // Obsługa formularza rejestracji
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      try {
        const res = await fetch(`${config.apiUrl}${config.endpoints.auth}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        const data = await res.json();
        const message = document.getElementById("message");
        message.innerHTML = `<div class="alert alert-success">${data.message || "Zarejestrowano!"}</div>`;
      } catch (err) {
        console.error("Błąd rejestracji:", err);
      }
    });
  }

  // Obsługa formularza logowania
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      try {
        const res = await fetch(`${config.apiUrl}${config.endpoints.auth}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        const data = await res.json();
        const message = document.getElementById("message");

        if (data.token) {
          localStorage.setItem("token", data.token);
          message.innerHTML = `<div class="alert alert-success">Zalogowano!</div>`;
          window.location.href = "dashboard.html";
        } else {
          message.innerHTML = `<div class="alert alert-danger">${data.message || "Błąd logowania."}</div>`;
        }
      } catch (err) {
        console.error("Błąd logowania:", err);
      }
    });
  }
});
