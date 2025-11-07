const container = document.querySelector(".lesson-cards");
const infocontainer = document.querySelector(".site-header");

window.onload = () => {

  try {
    fetch('./data/lessons.json')
  .then(response => response.json())
  .then(data => {
    const categorias = ["projetos", "outros"];

    categorias.forEach(categoria => {
      const categoriaTitulo = document.createElement("h2");
      categoriaTitulo.textContent = categoria;
      categoriaTitulo.classList.add("categoria-titulo");
      container.appendChild(categoriaTitulo);

      data[categoria].forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");

        const title = document.createElement("h3");
        title.classList.add("project-title");
        title.textContent = item.titulo;
        card.appendChild(title);

        // Subcategoria (semestre ou tipo)
        if (item.semestre) {
          const semester = document.createElement("h4");
          semester.textContent = `${item.semestre}º Semestre`;
          card.appendChild(semester);
        } else if (item.tipo) {
          const tipo = document.createElement("h4");
          tipo.textContent = `Tipo: ${item.tipo}`;
          card.appendChild(tipo);
        }

        // Barra ou texto de progresso
        const progress = document.createElement("p");
        progress.classList.add("progress-text");

        switch (item.progress) {
          case 0:
            progress.textContent = "Não iniciado";
            progress.style.color = "#a00";
            break;
          case 1:
            progress.textContent = "Em desenvolvimento";
            progress.style.color = "#d49a00";
            break;
          case 2:
            progress.textContent = "Concluído!";
            progress.style.color = "#0a0";
            break;
        }

        card.appendChild(progress);

        const desc = document.createElement("p");
        desc.textContent = item.descricao;
        card.appendChild(desc);

        item.links.forEach(linkData => {
          const link = document.createElement("a");
          link.href = linkData.url;
          link.textContent = linkData.texto;
          card.appendChild(link);
        });

        container.appendChild(card);
      });
    });
  })
  .catch(error => {
    console.error("Erro ao carregar os projetos:", error);
    container.innerHTML = "<p>Não foi possível carregar os projetos.</p>";
  });

  } catch (error) {
    console.error("Erro ao carregar os projetos:", error);
    container.innerHTML = "<p>Não foi possível carregar os projetos.</p>";
  }
};

const inputSearch = document.getElementById("inputSearch");

function addFilter() {
  const searchValue = inputSearch.value.toLowerCase().trim();
  const cards = document.querySelectorAll(".lesson-cards .card");

  cards.forEach(card => {
    const titleElement = card.querySelector(".project-title");

    if (!titleElement) return;

    const titleText = titleElement.textContent.toLowerCase();


    card.style.display = titleText.includes(searchValue) ? "block" : "none";
  });
}

inputSearch.addEventListener("input", addFilter);

const carousel = document.querySelector(".lesson-cards");
const btnPrev = document.querySelector(".carousel-btn.prev");
const btnNext = document.querySelector(".carousel-btn.next");

const scrollAmount = 300;

btnPrev.addEventListener("click", () => {
  carousel.scrollBy({ left: -scrollAmount, behavior: "smooth" });
});

btnNext.addEventListener("click", () => {
  carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
});

function addStudentCard() {
  // Verifica se já existe um card de estudante
  const existingCard = document.querySelector(".site-header .student-card");
  if (existingCard) {
    existingCard.remove(); // Remove o card existente
    return; // Sai da função (serve como um "toggle")
  }

  fetch('./data/info.json')
    .then(responsa => responsa.json())
    .then(infos => {
      infos.forEach(info => {
        const infocard = document.createElement("div");
        infocard.classList.add("card", "student-card"); // adiciona classe específica

        const std_name = document.createElement("h1");
        std_name.classList.add("student_name");
        std_name.textContent = info.nome;
        infocard.appendChild(std_name);

        const std_ra = document.createElement("h2");
        std_ra.textContent = "RA: " + info.ra;
        infocard.appendChild(std_ra);

        info.repository.forEach(linkData => {
          const link = document.createElement("a");
          link.href = linkData.url;
          link.textContent = linkData.texto;
          infocard.appendChild(link);
        });

        infocontainer.appendChild(infocard);
      });
    })
    .catch(err => {
      console.error("Erro ao carregar informações do aluno:", err);
    });
}
