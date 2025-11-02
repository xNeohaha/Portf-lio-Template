window.onload = () => {
  const container = document.querySelector(".lesson-cards");

  try {
    fetch('./data/lessons.json')
      .then(response => response.json())
      .then(projetos => {
        projetos.forEach(projeto => {
          const card = document.createElement("div");
          card.classList.add("card");

          // TÍTULO
          const title = document.createElement("h3");
          title.classList.add("project-title"); // 🔹 Classe para identificar o título
          title.textContent = projeto.titulo;
          card.appendChild(title);

          // SEMESTRE
          if (projeto.semestre) {
            const semester = document.createElement("h4");
            semester.textContent = `${projeto.semestre}º Semestre`;
            card.appendChild(semester);
          }

          // STATUS
          if (projeto.status !== undefined) {
            const statustext = document.createElement("h5");
            statustext.textContent = projeto.status
              ? "O exercício está completo."
              : "O exercício está incompleto. Talvez um erro.";
            card.appendChild(statustext);
          }

          // DESCRIÇÃO
          const desc = document.createElement("p");
          desc.textContent = projeto.descricao;
          card.appendChild(desc);

          // LINKS
          projeto.links.forEach(linkData => {
            const link = document.createElement("a");
            link.href = linkData.url;
            link.textContent = linkData.texto;
            card.appendChild(link);
          });

          // Adiciona o card ao container
          container.appendChild(card);
        });
      });
  } catch (error) {
    console.error("Erro ao carregar os projetos:", error);
    container.innerHTML = "<p>Não foi possível carregar os projetos.</p>";
  }
};

// --- SISTEMA DE PESQUISA POR TÍTULO ---
const inputSearch = document.getElementById("inputSearch");

function addFilter() {
  const searchValue = inputSearch.value.toLowerCase().trim();
  const cards = document.querySelectorAll(".lesson-cards .card");

  cards.forEach(card => {
    const titleElement = card.querySelector(".project-title");

    if (!titleElement) return; // segurança caso algo falhe

    const titleText = titleElement.textContent.toLowerCase();

    // Exibe apenas se o título contém o texto digitado
    card.style.display = titleText.includes(searchValue) ? "block" : "none";
  });
}

// 🔹 Busca em tempo real
inputSearch.addEventListener("input", addFilter);

// 🔹 Mantém o botão funcional
document.querySelector("button").addEventListener("click", addFilter);

const carousel = document.querySelector(".lesson-cards");
const btnPrev = document.querySelector(".carousel-btn.prev");
const btnNext = document.querySelector(".carousel-btn.next");

// valor de rolagem (ajuste conforme o tamanho dos cards)
const scrollAmount = 300;

btnPrev.addEventListener("click", () => {
  carousel.scrollBy({ left: -scrollAmount, behavior: "smooth" });
});

btnNext.addEventListener("click", () => {
  carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
});