const BASE_URL = "https://webdev.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/movies/";
const POSTER_URL = BASE_URL + "/posters/";
const MOVIES_PER_PAGE = 12;

// 全部的電影清單
const movies = [];
// 符合關鍵字的電影清單
let filteredMovies = [];

const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const paginator = document.querySelector("#paginator");

// 函式renderMovieList
function renderMovieList(data) {
  let rawHTML = "";

  // processing
  data.forEach((item) => {
    rawHTML += `<div class="col-sm-2">
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
                <button class="btn btn-info btn-add-favorite"  data-id="${
                  item.id
                }">+</button>
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
// 函式addToFavorite
function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  const movie = movies.find((movie) => movie.id === id);

  if (list.some((movie) => movie.id === id)) {
    return alert("此電影已加入收藏清單中！");
  }
  list.push(movie);
  localStorage.setItem("favoriteMovies", JSON.stringify(list));
}
// 函式getMoviesByPage
function getMoviesByPage(page) {
  //計算起始 index
  const startIndex = (page - 1) * MOVIES_PER_PAGE;
  // 若filteredMovies不是空陣列(表示有搜尋)，則以filterMovies做分頁器；否則用movies做分頁器
  const data = filteredMovies.length ? filteredMovies : movies;
  //回傳切割後的新陣列
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE);
}
// 函式renderPaginator
function renderPaginator(amount) {
  // 計算總頁數
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE);
  //製作 template
  let rawHTML = "";

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`;
  }
  //放回 HTML
  paginator.innerHTML = rawHTML;
}

// API Movie List
axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results);
    renderPaginator(movies.length);
    renderMovieList(getMoviesByPage(1));
  })
  .catch((err) => console.log(err));

// 監聽dataPanel
dataPanel.addEventListener("click", function onPanelClicked(e) {
  if (e.target.matches(".btn-show-movie")) {
    showMovieModal(Number(e.target.dataset.id));
  } else if (e.target.matches(".btn-add-favorite")) {
    addToFavorite(Number(e.target.dataset.id));
  }
});

// 監聽searchForm
searchForm.addEventListener("submit", function onSearchFromSubmitted(e) {
  //不要做預設動作(重整瀏覽頁面)
  e.preventDefault();

  // 取得搜尋關鍵字
  const keyword = searchInput.value.trim().toLowerCase();
  // 關鍵字篩選
  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  );

  //錯誤處理：無符合條件的結果
  if (filteredMovies.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`);
  }

  // 重新渲染分頁器
  renderPaginator(filteredMovies.length);
  // 重新渲染畫面
  renderMovieList(getMoviesByPage(1));
});

// 監聽paginator
paginator.addEventListener("click", function onPaginatorClicked(e) {
  //如果被點擊的不是 a 標籤，結束函式
  if (e.target.tagName !== "A") return;

  const page = Number(e.target.dataset.page);
  renderMovieList(getMoviesByPage(page));
});
