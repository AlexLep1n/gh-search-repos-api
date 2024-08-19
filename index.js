"use strict";

const searchInput = document.querySelector(".wrapper__search-input");
const resultList = document.querySelector(".wrapper__result-list");
const resultItems = document.querySelectorAll(".wrapper__result-item");

const gitHubReposUrl = "https://api.github.com/repositories";

async function getGitHubRepos() {
  const response = await fetch(gitHubReposUrl);
  if (!response.ok) {
    throw new Error(`Request failed, status ${response.status}`);
  }
  const data = await response.json();
  return data;
}

async function showResults(repoName) {
  const reposData = await getGitHubRepos();
  if (repoName.trim()) {
    let firstFive = reposData
      .filter((repo) => {
        if (repo.name) {
          return repo.name
            .toLocaleLowerCase()
            .startsWith(repoName.toLocaleLowerCase());
        }
      })
      .slice(0, 5);
    resultItems.forEach((li, i) => {
      li.textContent = firstFive[i]?.name;
    });
    resultList.style.display = "block";
  } else {
    resultList.style.display = "none";
  }
}
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    console.log(e.target.value);
    debounce(showResults, 600)(e.target.value);
  });
}

function debounce(fn, ms) {
  let timerID;
  return function (...args) {
    clearTimeout(timerID);
    timerID = setTimeout(() => {
      fn.apply(this, args);
    }, ms);
  };
}
