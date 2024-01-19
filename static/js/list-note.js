document.addEventListener('DOMContentLoaded', function() {

  let noteList = new List('note-section', {
    valueNames: ['title', 'username', 'date', 'chapter'],
  });

  const filterButtons = Array.from(
      document.getElementsByClassName('filter-button'));

  filterButtons.forEach((elm) => {
    elm.addEventListener('click', () => {
      let chapter = elm.dataset.chapter;
      document.getElementById('current-chapter').textContent = chapter === '0'
          ? ''
          : chapter;
      filterButtons.forEach((btn) => btn.classList.remove('active'));
      elm.classList.add('active');

      chapter = chapter === '0' ? ['3', '9'] : [chapter];
      noteList.filter((item) => {
        return chapter.includes(item.values().chapter);
      });
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
    noteList.sort(target, {order: sortAsc ? 'asc' : 'desc'});
  }

});