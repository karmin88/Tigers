document.addEventListener('DOMContentLoaded', function() {
  //Init swiper
  let swiper = new Swiper('.mySwiper', {
    effect: 'cards',
    grabCursor: true,
    loop: true,
    slideToClickedSlide: true,
  });

  let quizList = new List('quizzes', {
    valueNames: ['title', 'username', 'date', 'chapter'],
  });

  const chapterCheckbox = Array.from(
      document.querySelectorAll('input[type="checkbox"][name="chapter"]'));
  chapterCheckbox.forEach((elm) => {
    elm.addEventListener('change', () => {
      const checkedValues = chapterCheckbox.filter(
          checkbox => checkbox.checked).map(checkbox => checkbox.value);
      quizList.filter((item) => checkedValues.includes(item.values().chapter));
    });
  });

  let sortAsc = true;
  let sortSelect = document.getElementById('sort');
  let btnSort = document.getElementById('btn-sort');

  btnSort.addEventListener('click', (evt) => {
    if (!sortSelect.value) {
      evt.preventDefault();
      return;
    }
    toggleSortIcon();
    sortAsc = !sortAsc;
    sortList(sortSelect.value);
  });

  sortSelect.addEventListener('change', (evt) => {
    sortList(evt.target.value);
    toggleSortIcon();
  });

  function toggleSortIcon() {
    btnSort.firstElementChild.classList.remove('bi-filter');
    btnSort.firstElementChild.classList.remove(
        sortAsc ? 'bi-sort-down' : 'bi-sort-down-alt');
    btnSort.firstElementChild.classList.add(
        sortAsc ? 'bi-sort-down-alt' : 'bi-sort-down');
  }

  function sortList(target) {
    quizList.sort(target, {order: sortAsc ? 'asc' : 'desc'});
  }

  ScrollReveal().reveal('.quiz-card', {
    interval: 16,
    origin: 'bottom',
    distance: '100%',
    opacity: 0,
  });
});