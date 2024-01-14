let swiper = new Swiper('.mySwiper', {
  direction: 'vertical',
  mousewheel: true,
  slidesPerView: 1,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    renderBullet: function(index, className) {
      return '<span class="' + className + '">' + (index + 1) + '</span>';
    },
  },
});

let strict = true;

document.getElementById('strict').addEventListener('click', () => {
  document.getElementById('strict-submit').toggleAttribute('disabled');
  toggleStrictMode();
});

document.getElementById('strict-submit').addEventListener('click', (evt) => {
  document.querySelectorAll(
      'form.swiper-slide').forEach((elm, index) => {
    if (!elm.checkValidity()) {
      if (swiper.activeIndex !== index) {
        swiper.slideTo(index);
        swiper.on('transitionEnd', function() {
          elm.reportValidity();
          swiper.off('transitionEnd');
        });
        return false;
      }
    }

  });
  let selectionInputs = document.querySelectorAll(
      'input[name="selection"]:checked');
  let correctAnswer = Array.from(selectionInputs).
      filter(input => input.classList.contains('answer')).length;
  let score = eval(`${correctAnswer} / ${selectionInputs.length}`);
  document.getElementById('correct').textContent = correctAnswer;
  document.getElementById('score').textContent = score * 100 + '%';
  let scorebar = document.getElementById('scorebar');
  scorebar.style.width = score * 100 + '%';
  scorebar.classList.remove('bg-danger', 'bg-warning', 'bg-info', 'bg-success');
  if (score <= 0.25) {
    scorebar.classList.add('bg-danger');
  } else if (score <= 0.5) {
    scorebar.classList.add('bg-warning');
  } else if (score <= 0.75) {
    scorebar.classList.add('bg-info');
  } else {
    scorebar.classList.add('bg-success');
  }
  scorebar.style.width = score * 100 + '%';

  let resultModal = new bootstrap.Modal(
      document.getElementById('result-modal'));
  resultModal.show();

  for (let form of document.getElementsByTagName('form')) {
    form.reset();
  }
});

const selections = document.querySelectorAll('input[name="selection"]');
const changeHandler = (evt) => {
  $(evt.target).closest('ol').find('label').each(function() {
    $(this).removeClass('text-danger animating');
    if (evt.target.checked && evt.target.classList.contains('answer')) {
      evt.target.nextSibling.classList.add('text-success', 'animating');
    } else {
      console.log($(this)[0]);
      if (!$(this).hasClass('answer')) {
        $(this).addClass('text-danger animating');
      } else {
        $(this).addClass('text-success animating');
      }
    }
  });
};

function toggleStrictMode() {
  strict = !strict;
  if (strict) {
    selections.forEach(
        (elm) => { elm.removeEventListener('change', changeHandler);});
    for (let elm of document.getElementsByTagName(
        'label')) {
      elm.classList.remove('text-danger', 'text-success', 'animating');
    }
  } else {
    selections.forEach((elm) => {
      elm.addEventListener('change', changeHandler);
    });
  }
}

let tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]'));
let tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl);
});