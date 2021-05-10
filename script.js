const searchButton = document.getElementById("search-button");
searchButton.addEventListener("click", searchMovie);

const searchBox = document.getElementById("search-box");
searchBox.addEventListener("keypress", function (event) {
  if (event.code === "Enter") {
    event.preventDefault();
    searchMovie();
  }
});

const banner = document.getElementById("banner");

const searchTermTitle = document.getElementById("search-term-title");

const searchResultsList = document.getElementById("search-results-list");

const nominationsList = document.getElementById("nominations-list");

let nominationCount = 0;

let nominations = [];

window.onbeforeunload = function (event) {
  if (typeof Storage !== "undefined") {
    // Code for localStorage/sessionStorage.
    localStorage.setItem("nominations", JSON.stringify(nominations));
  } else {
    // Do nothing
  }
};

window.onload = function (event) {
  let prevNominations = localStorage.getItem("nominations");
  if (prevNominations === null) {
    nominations = JSON.parse(prevNominations);
    updateNominationList(nominations);
  }
};

/**
 * Searches for a movie
 */
async function searchMovie() {
  let searchTerm = searchBox.value;
  searchBox.value = "";
  searchTermTitle.innerHTML = `"${searchTerm}"`;
  let jsonResponse = await fetch(
    `https://www.omdbapi.com/?t=${searchTerm}&apikey=6d133698`
  );
  let movie = await jsonResponse.json();
  if (movie.Title === undefined) {
    alert(`${searchTerm} cannot be found`);
  } else {
    let movieDescription = `${movie.Title} (${movie.Year})`;
    updateResultList(movieDescription);
  }
}

/**
 * Adds a movie to the search results list
 * @param movie
 */
function updateResultList(movie) {
  let resultItem = document.createElement("li");
  resultItem.setAttribute("id", `search-${movie}`);

  let movieContainer = document.createElement("div");
  movieContainer.setAttribute("id", "movie-container");

  let movieTitle = document.createElement("span");
  movieTitle.setAttribute("class", "movie-title");
  let movieTitleTextNode = document.createTextNode(movie);
  movieTitle.appendChild(movieTitleTextNode);

  let nominateButton = document.createElement("button");
  nominateButton.setAttribute("class", "li-function-button");
  nominateButton.setAttribute("name", movie);
  nominateButton.textContent = "Nominate";
  nominateButton.addEventListener("click", addNomination);

  movieContainer.appendChild(movieTitle);
  movieContainer.appendChild(nominateButton);

  resultItem.appendChild(movieContainer);

  searchResultsList.appendChild(resultItem);
}

/**
 * Adds previous nominations to nominations list
 * @param prevNominations
 */
function updateNominationList(prevNominations) {
  prevNominations.forEach((prevNomination) => {
    let nominationItem = document.createElement("li");
    nominationItem.setAttribute("id", `pre-search-${prevNomination}`);

    let movieContainer = document.createElement("div");
    movieContainer.setAttribute("id", "movie-container");

    let movieTitle = document.createElement("span");
    movieTitle.setAttribute("class", "movie-title");
    let movieTitleTextNode = document.createTextNode(prevNomination);
    movieTitle.appendChild(movieTitleTextNode);

    let removeButton = document.createElement("button");
    removeButton.setAttribute("class", "li-function-button");
    removeButton.setAttribute("name", prevNomination);
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", removeNomination);

    movieContainer.appendChild(movieTitle);
    movieContainer.appendChild(removeButton);

    nominationItem.appendChild(movieContainer);

    nominationsList.appendChild(nominationItem);

    nominationCount = nominationCount + 1;

    if (nominations.length >= 5) {
      banner.style.display = "block";
    }
  });
}

/**
 * Adds a movie to the nomination list
 */
function addNomination(event) {
  let elementContainer = event.target.parentElement;
  let elementListItem = elementContainer.parentElement.cloneNode(true);
  let movie = event.target.getAttribute("name");
  elementListItem.setAttribute("id", `search-${movie}`);
  let elementListItemContents = elementListItem.childNodes[0];
  let button = elementListItemContents.childNodes[1];
  button.removeEventListener("click", addNomination);
  button.addEventListener("click", removeNomination);
  button.textContent = "Remove";

  nominationsList.appendChild(elementListItem);

  event.target.disabled = true;

  nominations.push(movie);

  nominationCount = nominationCount + 1;

  if (nominationCount === 5) {
    banner.style.display = "block";
  }
}

/**
 * Removes a nomination
 * @param event
 */
function removeNomination(event) {
  let removeButton = event.target;
  let removeButtonParent = removeButton.parentElement;
  let nominationItem = removeButtonParent.parentElement;
  let movie = removeButton.getAttribute("name");
  let nominateButton = document.getElementsByName(
    removeButton.getAttribute("name")
  )[0];
  nominationItem.remove();
  nominateButton.disabled = false;

  nominations = nominations.filter((item) => item !== movie);
  console.log(nominations);

  nominationCount = nominationCount - 1;

  if (nominationCount < 5) {
    banner.style.display = "none";
  }
}
