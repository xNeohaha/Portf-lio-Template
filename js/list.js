// -----------------------------
// 📦 ELEMENTOS BASE
// -----------------------------
const inputSearch = document.getElementById("inputSearch");

// -----------------------------
// 🚀 FUNÇÃO RAIZ
// -----------------------------
async function fetchTemplate(path) {
  const response = await fetch(path);
  const text = await response.text();
  const wrapper = document.createElement("div");
  wrapper.innerHTML = text.trim();
  return wrapper.firstElementChild;
}

async function init() {
  await loadProjects();
  setupFilter();
  setupStudentCardToggle();
}

window.onload = init;

// -----------------------------
// 🧩 FUNÇÃO: CARREGAR PROJETOS E CATEGORIAS
// -----------------------------
async function loadProjects() {
  const mainContainer = document.querySelector(".lesson-section");

  try {
    const response = await fetch("./data/lessons.json");
    const data = await response.json();

    for (const categoria in data) {
      // cria o carrossel com template
      const carousel = await fetchTemplate("./templates/carousel.html");
      carousel.querySelector(".categoria-titulo").textContent = categoria;

      const cardsContainer = carousel.querySelector(".lesson-cards");

      // gera cada card
      for (const item of data[categoria]) {
        const card = await fetchTemplate("./templates/project-card.html");

        card.querySelector(".project-title").textContent = item.titulo;

        const sub = card.querySelector(".project-sub");
        if (item.semestre) sub.textContent = `${item.semestre}º Semestre`;
        else if (item.tipo) sub.textContent = `Tipo: ${item.tipo}`;
        else sub.remove();

        const progress = card.querySelector(".progress-text");
        progress.textContent =
          item.progress === 2
            ? "✅ Concluído!"
            : item.progress === 1
            ? "🚧 Em desenvolvimento"
            : "";

        card.querySelector(".project-desc").textContent = item.descricao;

        const linksDiv = card.querySelector(".project-links");
        item.links?.forEach(link => {
          const a = document.createElement("a");
          a.href = link.url;
          a.textContent = link.texto;
          linksDiv.appendChild(a);
        });

        cardsContainer.appendChild(card);
      }

      mainContainer.appendChild(carousel);

      // 🎯 Botões de navegação do carrossel
      const btnPrev = carousel.querySelector(".carousel-btn.prev");
      const btnNext = carousel.querySelector(".carousel-btn.next");
      const scrollAmount = 300;

      btnPrev.addEventListener("click", () => {
        cardsContainer.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      });
      btnNext.addEventListener("click", () => {
        cardsContainer.scrollBy({ left: scrollAmount, behavior: "smooth" });
      });
    }
  } catch (error) {
    console.error("Erro ao carregar os projetos:", error);
    mainContainer.innerHTML += "<p>Não foi possível carregar as categorias.</p>";
  }
}

// -----------------------------
// 🔍 FUNÇÃO: FILTRO DE BUSCA
// -----------------------------
function setupFilter() {
  inputSearch.addEventListener("input", () => {
    const searchValue = inputSearch.value.toLowerCase().trim();
    const carousels = document.querySelectorAll(".carousel-wrapper");

    carousels.forEach(wrapper => {
      const cards = wrapper.querySelectorAll(".card");
      let visibleCount = 0;

      cards.forEach(card => {
        const titleElement = card.querySelector(".project-title");
        if (!titleElement) return;
        const titleText = titleElement.textContent.toLowerCase();

        if (titleText.includes(searchValue)) {
          card.style.display = "block";
          visibleCount++;
        } else {
          card.style.display = "none";
        }
      });

      const categoriaTitle = wrapper.previousElementSibling;
      if (visibleCount === 0) {
        wrapper.style.display = "none";
        if (categoriaTitle?.classList.contains("categoria-titulo"))
          categoriaTitle.style.display = "none";
      } else {
        wrapper.style.display = "block";
        if (categoriaTitle?.classList.contains("categoria-titulo"))
          categoriaTitle.style.display = "block";
      }
    });
  });
}

// -----------------------------
// 🧍 FUNÇÃO: CARD DO ALUNO
// -----------------------------
function setupStudentCardToggle() {
  window.addStudentCard = async function () {
    const existingOverlay = document.querySelector(".overlay");
    if (existingOverlay) {
      existingOverlay.remove();
      return;
    }

    try {
      const overlay = await fetchTemplate("./templates/student-card.html");
      const info = (await (await fetch("./data/info.json")).json())[0];

      overlay.querySelector(".student-name").textContent = info.nome;
      overlay.querySelector(".student-ra").textContent = "RA: " + info.ra;

      const photo = overlay.querySelector(".student-photo");
      if (info.foto) photo.src = info.foto;
      else photo.remove();

      const links = overlay.querySelector(".student-links");
      info.repository.forEach(l => {
        const a = document.createElement("a");
        a.href = l.url;
        a.textContent = l.texto;
        links.appendChild(a);
      });

      overlay.querySelector(".close-btn").addEventListener("click", () => overlay.remove());
      overlay.addEventListener("click", e => {
        if (e.target === overlay) overlay.remove();
      });

      document.body.appendChild(overlay);
    } catch (err) {
      console.error("Erro ao carregar informações do aluno:", err);
    }
  };
}
