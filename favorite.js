const BASE_URL = "https://webdev.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/movies/";
const POSTER_URL = BASE_URL + "/posters/";

const dataPanel = document.querySelector("#data-panel");
const movies = JSON.parse(localStorage.getItem("favoriteMovies")) || [];

renderMovieList(movies);

// 監聽dataPanel
dataPanel.addEventListener("click", function onPanelClicked(e) {
  if (e.target.matches(".btn-show-movie")) {
    showMovieModal(Number(e.target.dataset.id));
  } else if (e.target.matches(".btn-remove-favorite")) {
    removeFromFavorite(Number(e.target.dataset.id));
  }
});

// 函式庫
// 函式renderMovieList
function renderMovieList(data) {
  let rawHTML = "";

  // processing
  data.forEach((item) => {
    rawHTML += `<div class="col-sm-3">
          <div class="mb-2">
            <div class="card">
              <img
                src="${POSTER_URL + item.image}"
                class="card-img-top"
                alt="Movie Poster"
              />
              <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
              </div>
              <div class="card-footer">
                <button
                  class="btn btn-primary btn-show-movie"
                  data-bs-toggle="modal"
                  data-bs-target="#movie-modal"
                  data-id="${item.id}"
                >
                  More
                </button>
                <button class="btn btn-danger btn-remove-favorite"  data-id="${
                  item.id
                }">X</button>
              </div>
            </div>
          </div>
        </div>
  `;
  });

  dataPanel.innerHTML = rawHTML;
}
// 函式showMovieModal
function showMovieModal(id) {
  const modalTitle = document.querySelector("#movie-modal-title");
  const modalImage = document.querySelector("#movie-modal-image");
  const modalDate = document.querySelector("#movie-modal-date");
  const modalDescription = document.querySelector("#movie-modal-description");

  // API抓取電影詳細資料
  axios
    .get(INDEX_URL + id)
    .then((response) => {
      const data = response.data.results;

      modalTitle.innerText = data.title;
      modalDate.innerText = "realease date: " + data.release_date;
      modalDescription.innerText = data.description;
      modalImage.innerHTML = `
      <img src="${
        POSTER_URL + data.image
      }" alt="movie-poster" class="image-fluid" />
      `;
      // 利用 .img-fluid 設定為響應式圖片
    })
    .catch((err) => console.log(err));
}
// 函式removeFromFavorite
function removeFromFavorite(id) {
  //若movies為空陣列時，結束函式
  if (!movies || !movies.length) return;

  //透過 id 找到要刪除電影的 index
  const movieIndex = movies.findIndex((movie) => movie.id === id);
  //若找不到符合id的資料時，結束函式
  if (movieIndex === -1) return;

  //刪除該筆電影
  movies.splice(movieIndex, 1);
  //存回 local storage
  localStorage.setItem("favoriteMovies", JSON.stringify(movies));
  //更新頁面
  renderMovieList(movies);
}
