const container = document.querySelector(".lesson-cards");
const infocontainer = document.querySelector(".site-header");

window.onload = () => {

  try {
    fetch('./data/lessons.json')
      .then(response => response.json())
      .then(projetos => {
        projetos.forEach(projeto => {
          const card = document.createElement("div");
          card.classList.add("card");

          const title = document.createElement("h3");
          title.classList.add("project-title");
          title.textContent = projeto.titulo;
          card.appendChild(title);

          if (projeto.semestre) {
            const semester = document.createElement("h4");
            semester.textContent = `${projeto.semestre}º Semestre`;
            card.appendChild(semester);
          }

          if (projeto.status !== undefined) {
            const statustext = document.createElement("h5");
            statustext.textContent = projeto.status
              ? "O exercício está completo."
              : "O exercício está incompleto. Talvez um erro.";
            card.appendChild(statustext);
          }

          const desc = document.createElement("p");
          desc.textContent = projeto.descricao;
          card.appendChild(desc);

          projeto.links.forEach(linkData => {
            const link = document.createElement("a");
            link.href = linkData.url;
            link.textContent = linkData.texto;
            card.appendChild(link);
          });

          container.appendChild(card);
        });
      });
  } catch (error) {
    console.error("Erro ao carregar os projetos:", error);
    container.innerHTML = "<p>Não foi possível carregar os projetos.</p>";
  }

  try {
    fetch('./data/info.json')
      .then(responsa => responsa.json())
      .then(infos => {
        infos.forEach(info => {
          const infocard = document.createElement("div");
          infocard.classList.add("card");

          const std_name = document.createElement("h1");
          std_name.classList.add("student_name");
          std_name.textContent = info.nome;
          infocard.appendChild(std_name);

          const std_ra = document.createElement("h2");
          std_ra.textContent = ("RA: "+ info.ra);
          infocard.appendChild(std_ra);

          info.repository.forEach(linkData => {
            const link = document.createElement("a");
            link.href = linkData.url;
            link.textContent = linkData.texto;
            infocard.appendChild(link);
          });

          infocontainer.appendChild(infocard);
        });
      });
  } catch (error) {
    console.error("Erro ao carregar as informações do aluno:", error); // Programador incomptente
    infocontainer.innerHTML = "<p>Não foi possível carregar as informações do aluno.</p>";
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

