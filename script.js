const API_KEY = 'API_KEY';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// 기본 요소 불러오기
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const cardContainer = document.getElementById('card-container');

// 모달 _ 상세 정보는 여기에서 담당당
const modalHTML = `
  <div class="modal fade" id="movieModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalTitle">영화 제목</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <img id="modalPoster" class="img-fluid mb-3" src="" alt="포스터">
          <p id="modalOverview">줄거리</p>
          <p><strong>개봉일:</strong> <span id="modalRelease"></span></p>
          <p><strong>평점:</strong> <span id="modalVote"></span></p>
        </div>
      </div>
    </div>
  </div>
`;
document.body.insertAdjacentHTML('beforeend', modalHTML);


// 영화 카드 그리는 함수
function showMovies(movies) {
  cardContainer.innerHTML = '';

  if (!movies || movies.length === 0) {
    cardContainer.innerHTML = `<p class="text-center">영화가 없습니다다</p>`;
    return;
  }

  movies.forEach((mov) => {
    const img = mov.poster_path ? `${IMG_BASE_URL}${mov.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image';
    const summary = mov.overview ? mov.overview.slice(0, 100) + '...' : '줄거리 없음';

    const card = document.createElement('div');
    card.className = 'col';
    card.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${img}" class="card-img-top" alt="${mov.title}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${mov.title}</h5>
          <p class="card-text">${summary}</p>
          <div class="mt-auto d-flex justify-content-between align-items-center">
            <button class="btn btn-sm btn-outline-secondary" data-id="${mov.id}" data-bs-toggle="modal" data-bs-target="#movieModal">자세히 보기</button>
            <small class="text-muted">⭐ ${mov.vote_average}</small>
          </div>
        </div>
      </div>
    `;
    cardContainer.appendChild(card);
  });

  // 버튼 클릭시 모달창창
  document.querySelectorAll('button[data-id]').forEach((btn) => {
    btn.addEventListener('click', (a) => {
      const id = a.currentTarget.dataset.id;
      loadDetail(id);
    });
  });
}

// 인기 영화 불러오기
function Popular() {
  const url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=ko-KR`;

  fetch(url)
    .then(res => res.json())
    .then(json => showMovies(json.results))
    .catch(err => console.log('인기 영화 불러오기 실패', err));
}

// 검색한한 영화 불러오기
function searchMovies(keyword) {
  const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=ko-KR&query=${encodeURIComponent(keyword)}`;

  fetch(url)
    .then(res => res.json())
    .then(json => showMovies(json.results))
    .catch(err => console.log('검색 실패', err));
}

// 상세 정보 가져와서 모달에 채우기
function loadDetail(movieId) {
  const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=ko-KR`;

  fetch(url)
    .then(res => res.json())
    .then((movie) => {
      document.getElementById('modalTitle').innerText = movie.title;
      document.getElementById('modalPoster').src = movie.poster_path ? `${IMG_BASE_URL}${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image';
      document.getElementById('modalOverview').innerText = movie.overview || '줄거리 없음';
      document.getElementById('modalRelease').innerText = movie.release_date || '-';
      document.getElementById('modalVote').innerText = movie.vote_average || '-';
    })
    .catch(err => console.log('상세 정보 실패', err));
}


// 기본 실행
document.addEventListener('DOMContentLoaded', () => {
  Popular();
});

// 검색 버튼 클릭
searchBtn.addEventListener('click', () => {
  const keyword = searchInput.value.trim();
  if (keyword) searchMovies(keyword);
});

// Enter로 검색
searchInput.addEventListener('keydown', (a) => {
  if (a.key === 'Enter') {
    a.preventDefault();
    searchBtn.click();
  }
});
