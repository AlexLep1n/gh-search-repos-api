"use strict";

fetch("https://api.github.com/repositories")
  .then((response) => response.json())
  .then((repos) => {
    console.log(repos);
  });
