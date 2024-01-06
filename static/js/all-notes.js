function extractNoteData() {
  const noteElements = document.querySelectorAll('.note');
  const noteDataArray = [];

  noteElements.forEach(function(noteElement) {
    const contentAttribute = noteElement.getAttribute('data-content');
    const chapterAttribute = noteElement.getAttribute('data-chapter');

    noteDataArray.push({
      elmId: noteElement.getAttribute('id'),
      content: contentAttribute,
      chapter: chapterAttribute,
    });
  });
  return noteDataArray;
}

const notesData = extractNoteData();
let notesOnView = null;

function filterNotesBySearch(evt) {
  evt.preventDefault();
  refreshContainer($('#note-container'),
      () => callback('.note', notesOnView, $('#filter-value')[0].value,
          ['content']));
}

function filterNotesByChapter(chapter) {
  notesOnView = JSON.parse(JSON.stringify(notesData));
  if (chapter === undefined) {
    resetChapter();
  } else {
    refreshContainer($('#note-container'),
        () => callback('.note', notesData, String(chapter), ['chapter'], true));
  }
}

const callback = (selector, data, filterValue, fuzzyKeys, strict) => {
  const notes = $(selector);
  const options = {
    includeScore: true, threshold: strict ? 0 : 0.4, keys: fuzzyKeys,
  };
  const fuse = new Fuse(data, options);
  const results = fuse.search(filterValue);
  notes.each(function(index, elm) {
    const noteElm = $(elm);
    const isMatch = results.some(
        result => result.item.elmId === noteElm.attr('id'));
    if (isMatch) {
      noteElm.show();
    } else {
      noteElm.hide();
      if (strict) {
        notesOnView = notesOnView.filter(
            note => note.elmId !== noteElm.attr('id'));
      }
    }
  });
};

function refreshContainer(container, callback) {
  container.css({opacity: 0});
  callback();
  container.stop().animate({opacity: 1}, 'fast');
}

function setActiveFromGroup(listItem) {
  listItem = $(listItem);
  const listGroup = listItem.parent();
  listGroup.children().each(function(index, listElm) {
    $(listElm).removeClass('active');
  });
  listItem.addClass('active');
}

$('input[type=search]').on('search', function() {
  refreshContainer($('#note-container'), () => {
    notesOnView.forEach(function(elm) {
      $('#' + elm.elmId).show();
    });
  });
});

function resetChapter() {
  refreshContainer($('#note-container'), () => {
    notesOnView = JSON.parse(JSON.stringify(notesData));
    $('#list-note').children().each(function(int, elm) {
      $(elm).show();
    });
  });
}

function setBreadcrumb(chapter) {
  const currentChapterLink = $('#current-chapter');
  currentChapterLink.text(chapter? 'Chapter ' + chapter: '');
  currentChapterLink.attr('href', `javascript:filterNotesByChapter(${chapter})`);
  currentChapterLink.parent().show();
}