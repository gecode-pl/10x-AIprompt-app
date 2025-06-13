const promptApi = `${config.apiUrl}${config.endpoints.prompts}`;
let userId;
let token;

async function loadPrompts() {
  try {
    const res = await fetch(`${config.apiUrl}${config.endpoints.public}/${userId}`);
    const data = await res.json();
    const tbody = document.getElementById("promptTableBody");
    tbody.innerHTML = "";

    if (!data.prompts || data.prompts.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5">Brak promptów</td></tr>`;
      return;
    }

    data.prompts.forEach((prompt, index) => {
      const row = document.createElement("tr");
      row.setAttribute('data-id', prompt._id);
      row.innerHTML = `
        <td class="handle" style="cursor: move">⋮⋮</td>
        <td>${prompt.category}</td>
        <td>${prompt.name}</td>
        <td>${prompt.content}</td>
        <td>
          <button class="btn btn-sm btn-warning" data-id="${prompt._id}" onclick="openEditModal(this)">Edytuj</button>
          <button class="btn btn-sm btn-danger" data-id="${prompt._id}" onclick="openDeleteModal(this)">Usuń</button>
        </td>
      `;
      tbody.appendChild(row);
    });

    // Inicjalizacja Sortable.js
    new Sortable(tbody, {
      handle: '.handle',
      animation: 150,
      onEnd: async function(evt) {
        const rows = tbody.getElementsByTagName('tr');
        const reorderedIds = Array.from(rows).map(row => row.getAttribute('data-id'));
        
        try {
          const res = await fetch(`${promptApi}/reorder`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ reorderedIds })
          });

          if (!res.ok) {
            throw new Error('Błąd podczas zapisywania kolejności');
          }

          // Odśwież listę promptów
          await loadPrompts();
        } catch (error) {
          console.error('Błąd zapisywania kolejności:', error);
          alert('Nie udało się zapisać nowej kolejności');
        }
      }
    });
  } catch (error) {
    console.error("Błąd ładowania:", error);
    document.getElementById("dashboardMessage").innerHTML =
      `<div class="alert alert-danger">Nie udało się pobrać promptów.</div>`;
  }
}

function openEditModal(button) {
  const id = button.getAttribute("data-id");
  const row = button.closest("tr");
  const [category, name, content] = [...row.children].map((td) => td.textContent);

  document.getElementById("editPromptId").value = id;
  document.getElementById("editCategory").value = category;
  document.getElementById("editName").value = name;
  document.getElementById("editContent").value = content;

  const editModal = new bootstrap.Modal(document.getElementById("editPromptModal"));
  editModal.show();
}

function openDeleteModal(button) {
  const id = button.getAttribute("data-id");
  document.getElementById("deletePromptId").value = id;

  const deleteModal = new bootstrap.Modal(document.getElementById("deletePromptModal"));
  deleteModal.show();
}

// Funkcja do pokazywania/ukrywania informacji o API
function toggleApiInfo() {
  const apiInfoBody = document.getElementById('apiInfoBody');
  const button = document.querySelector('.card-header button');
  const icon = button.querySelector('i');
  
  if (apiInfoBody.style.display === 'none') {
    apiInfoBody.style.display = 'block';
    icon.classList.remove('bi-eye');
    icon.classList.add('bi-eye-slash');
  } else {
    apiInfoBody.style.display = 'none';
    icon.classList.remove('bi-eye-slash');
    icon.classList.add('bi-eye');
  }
}

// Funkcja do kopiowania tekstu do schowka
function copyToClipboard(elementId) {
  const element = document.getElementById(elementId);
  element.select();
  document.execCommand('copy');
  
  // Pokaż komunikat o skopiowaniu
  const button = element.nextElementSibling;
  const originalText = button.innerHTML;
  button.innerHTML = '<i class="bi bi-check"></i> Skopiowano!';
  setTimeout(() => {
    button.innerHTML = originalText;
  }, 2000);
}

document.addEventListener("DOMContentLoaded", async () => {
  token = localStorage.getItem("token");
  if (!token) return (window.location.href = "login.html");

  const payload = JSON.parse(atob(token.split(".")[1]));
  userId = payload.userId;

  // Wypełnij pola API
  document.getElementById("userIdDisplay").value = userId;
  document.getElementById("apiUrlDisplay").value = `${config.apiUrl}${config.endpoints.prompts}/json/${userId}`;

  await loadPrompts();

  const addForm = document.getElementById("addPromptForm");
  const msg = document.getElementById("addPromptMessage");

  // Obsługa modali
  const editModal = document.getElementById("editPromptModal");
  const deleteModal = document.getElementById("deletePromptModal");

  // Obsługa focusu w modalach
  editModal.addEventListener("show.bs.modal", () => {
    editModal.removeAttribute("inert");
  });

  editModal.addEventListener("hide.bs.modal", () => {
    editModal.setAttribute("inert", "");
    document.body.focus();
  });

  deleteModal.addEventListener("show.bs.modal", () => {
    deleteModal.removeAttribute("inert");
  });

  deleteModal.addEventListener("hide.bs.modal", () => {
    deleteModal.setAttribute("inert", "");
    document.body.focus();
  });

  addForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const category = document.getElementById("category").value;
    const content = document.getElementById("content").value;

    console.log('Sending request with token:', token); // Debug log
    console.log('Request payload:', { name, category, content }); // Debug log

    try {
      const res = await fetch(promptApi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, category, content }),
      });

      console.log('Response status:', res.status); // Debug log
      const data = await res.json();
      console.log('Response data:', data); // Debug log

      if (res.ok) {
        msg.innerHTML = `<div class="alert alert-success">Prompt dodany!</div>`;
        addForm.reset();
        await loadPrompts();
      } else {
        msg.innerHTML = `<div class="alert alert-danger">${data.message || "Błąd."}</div>`;
      }
    } catch (err) {
      console.error('Error details:', err); // Debug log
      msg.innerHTML = `<div class="alert alert-danger">Nie udało się dodać prompta.</div>`;
    }
  });

  document.getElementById("saveEditPrompt").addEventListener("click", async () => {
    const id = document.getElementById("editPromptId").value;
    const category = document.getElementById("editCategory").value;
    const name = document.getElementById("editName").value;
    const content = document.getElementById("editContent").value;

    try {
      console.log('Sending edit request for prompt:', id);
      const res = await fetch(`${promptApi}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, category, content }),
      });

      console.log('Edit response status:', res.status);
      if (res.ok) {
        const modal = bootstrap.Modal.getInstance(document.getElementById("editPromptModal"));
        modal.hide();
        await loadPrompts();
      } else {
        const data = await res.json();
        alert(data.message || "Błąd edycji");
      }
    } catch (err) {
      console.error("Edycja:", err);
      alert("Wystąpił błąd podczas edycji");
    }
  });

  document.getElementById("confirmDeletePrompt").addEventListener("click", async () => {
    const id = document.getElementById("deletePromptId").value;

    try {
      console.log('Sending delete request for prompt:', id);
      const res = await fetch(`${promptApi}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Delete response status:', res.status);
      if (res.ok) {
        const modal = bootstrap.Modal.getInstance(document.getElementById("deletePromptModal"));
        modal.hide();
        await loadPrompts();
      } else {
        const data = await res.json();
        alert(data.message || "Błąd usuwania");
      }
    } catch (err) {
      console.error("Usuwanie:", err);
      alert("Wystąpił błąd podczas usuwania");
    }
  });
});
