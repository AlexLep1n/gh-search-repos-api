"use strict";

const searchInput = document.querySelector(".wrapper__search-input");
const resultList = document.querySelector(".wrapper__result-list");
const resultItems = document.querySelectorAll(".wrapper__result-item");
const cards = document.querySelector(".cards");

const gitHubReposUrl =
  "https://api.github.com/search/repositories?q=${queryText}&per_page=5";

// Получение массива репозиториев с GitHub API
async function getGitHubRepos(queryText) {
  try {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${queryText}&per_page=5`
    );
    if (!response.ok) {
      throw new Error(`Request failed, status ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

// Сортировка массива репозиториев по данным input`a и вывод их имен

let filteredRepos;

async function showResults(repoName) {
  if (repoName.trim()) {
    const reposData = await getGitHubRepos(repoName);
    filteredRepos = reposData.items.filter((repo) => {
      if (repo.name) {
        return repo.name
          .toLocaleLowerCase()
          .startsWith(repoName.toLocaleLowerCase());
      }
    });
    resultItems.forEach((li, i) => {
      if (filteredRepos[i]?.name) {
        li.textContent = filteredRepos[i].name;
        li.style.display = "block";
      } else {
        li.style.display = "none";
      }
    });
    resultList.style.display = "block";
  } else {
    resultList.style.display = "none";
  }
}

// Обработка события input
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    debounce(showResults, 700)(e.target.value);
  });
}

function debounce(fn, delay) {
  let timerID;
  return function (...args) {
    clearTimeout(timerID);
    timerID = setTimeout(() => fn.apply(this, args), delay);
  };
}

function createCard(cardData) {
  cards.insertAdjacentHTML(
    "beforeend",
    `<div class="cards__item">
      <div class="cards__item-content">
      <p class="cards__item-text">Name: ${cardData.name}</p>
      <p class="cards__item-text">Owner: ${cardData.owner.login}</p>
      <p class="cards__item-text">Stars: </p>
      </div>
      <button class="cards__item-close"></button>
    </div>`
  );
}

const cardsList = [];

resultList.addEventListener("click", (e) => showCards(e));

function showCards(e) {
  let currentLi = e.target;
  if (currentLi.tagName === "LI") {
    let newCardData = filteredRepos.find(
      (item) => item.name === currentLi.textContent
    );
    if (!cardsList.includes(newCardData)) {
      cardsList.push(newCardData);
      createCard(newCardData);
    }
    if (cards.children.length > 0) {
      cards.style.display = "flex";
    } else {
      cards.style.display = "none";
    }
  }
}
