const api_key = "UCVuuExRhCftTXDHbUyNh7W99DrRkBygopqNcThU";
const currentImageContainer = document.getElementById("current-image-container");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchHistory = document.getElementById("search-history");

document.addEventListener("DOMContentLoaded", () => {
  getCurrentImageOfTheDay();
  loadSearchHistory();
});

function getCurrentImageOfTheDay() {
  const currentDate = new Date().toISOString().split("T")[0];
  fetchImage(currentDate);
}

function getImageOfTheDay(date, save = true) {
  fetchImage(date);
  if (save) {
    saveSearch(date);
    addSearchToHistory();
  }
}

function fetchImage(date) {
  fetch(`https://api.nasa.gov/planetary/apod?date=${date}&api_key=${api_key}`)
    .then(res => res.json())
    .then(data => {
      if (data.code === 400) {
        currentImageContainer.innerHTML = `<p style="color:red;">No image available for ${date}</p>`;
        return;
      }
      displayImage(data, date);
    })
    .catch(err => console.error("Error fetching data:", err));
}

function displayImage(data, date) {
  currentImageContainer.innerHTML = `
    
    ${
      data.media_type === "image"
        ? `<img src="${data.url}" alt="${data.title}" style="max-width:100%; border-radius:10px; margin-left:40px; padding-bottom:20px;">`
        : `<iframe src="${data.url}" width="100%" height="400px" style="border-radius:10px;"></iframe>`
    }
        <h2>${data.title} (${date})</h2>
    <p>${data.explanation}</p>
  `;
}

function saveSearch(date) {
  let searches = JSON.parse(localStorage.getItem("searches")) || [];
  if (!searches.includes(date)) {
    searches.push(date);
    localStorage.setItem("searches", JSON.stringify(searches));
  }
}

function addSearchToHistory() {
  searchHistory.innerHTML = "";
  let searches = JSON.parse(localStorage.getItem("searches")) || [];

  searches.forEach(date => {
    const li = document.createElement("li");

    const link = document.createElement("a");
    link.href = "#";
    link.textContent = date;
    link.style.color = "blue";
    link.style.cursor = "pointer";
    link.style.textDecoration = "underline";

    link.addEventListener("click", (e) => {
      e.preventDefault();
      getImageOfTheDay(date, false);
    });

    li.appendChild(link);
    searchHistory.appendChild(li);
  });
}

function loadSearchHistory() {
  addSearchToHistory();
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const date = searchInput.value;
  if (date) {
    getImageOfTheDay(date);
  }
});
