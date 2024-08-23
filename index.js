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
    console.log("Get");
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

//
async function showSearchResults(repoName) {
  try {
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
          li.dataset.name = filteredRepos[i].name;
          li.dataset.owner = filteredRepos[i].owner.login;
          li.style.display = "block";
        } else {
          li.style.display = "none";
        }
      });
      resultList.style.display = "block";
    } else {
      resultList.style.display = "none";
    }
  } catch (error) {
    console.error(error);
  }
}

// Обработка события input
if (searchInput) {
  const debounceShowSearchResults = debounce(showSearchResults, 500);
  searchInput.addEventListener("input", (e) => {
    debounceShowSearchResults(e.target.value);
  });
}

// Функция свертки вызовов функции
function debounce(fn, delay) {
  let timerID;
  return function (...args) {
    clearTimeout(timerID);
    timerID = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Шаблон карточки репозитория
function createCard(cardData) {
  cards.insertAdjacentHTML(
    "beforeend",
    `<div class="cards__item">
      <div class="cards__item-content">
      <p class="cards__item-text" data-name="${cardData.name}">Name: ${cardData.name}</p>
      <p class="cards__item-text" data-owner="${cardData.owner.login}">Owner: ${cardData.owner.login}</p>
      <p class="cards__item-text">Stars: ${cardData.stargazers_count}</p>
      </div>
      <button class="cards__item-close"></button>
    </div>`
  );
}

const cardsList = [];

// При клике по li добавляет новую карточку репозитория
resultList.addEventListener("click", (e) => addCard(e));

// Функция обработчик события на li
function addCard(e) {
  let currentLi = e.target;
  if (currentLi.tagName === "LI") {
    let newCardData = filteredRepos.find(
      (item) =>
        item.name === currentLi.dataset.name &&
        item.owner.login === currentLi.dataset.owner
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

// При клике на крестик удаляет текущую карточку репозитория
cards.addEventListener("click", (e) => deleteCard(e));

function deleteCard(e) {
  const btn = e.target;
  if (btn.tagName === "BUTTON") {
    const cardItem = btn.closest(".cards__item");
    const cardsTextElems = cardItem.querySelectorAll(".cards__item-text");
    const deleteItemIndex = cardsList.findIndex(
      (item) =>
        item.name === cardsTextElems[0].dataset.name &&
        item.owner.login === cardsTextElems[1].dataset.owner
    );
    cardsList.splice(deleteItemIndex, 1);
    cardItem.remove();
  }
}
