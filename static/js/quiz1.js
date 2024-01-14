let swiper = new Swiper('.flashcards', {
  effect: 'coverflow',
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: 'auto',
  mousewheel: true,
  coverflowEffect: {
    rotate: -20,
    stretch: 0,
    depth: 100,
    modifier: 1,
    slideShadows: true,
    scale: 0.8,
  },
  pagination: {
    el: '.swiper-pagination',
  },
});

for (let elm of document.getElementsByClassName(
    'card-flip')) {
  elm.addEventListener('click', () => {
    console.log('clip');
    // Toggle the 'flipped' class on click
    elm.classList.toggle('flipped');
  });
}

let cardWrapper = document.getElementById('card-wrapper');
for (let i = cardWrapper.children.length; i >= 0; i--) {
  cardWrapper.appendChild(cardWrapper.children[Math.random() * i | 0]);
}

document.getElementById('start').addEventListener('click', () => {
  const matchSectionOverlay = document.getElementsByClassName(
      'section-overlay')[0];
  matchSectionOverlay.style.zIndex = '-1';
  matchSectionOverlay.classList.add('hide');

  matchSectionOverlay.addEventListener('transitionend', () => {
    matchSectionOverlay.classList.add('d-none');
    let timerValue = 0.00;
    let timerInterval;

    function startTimer() {
      timerInterval = setInterval(updateTimer, 10);
    }

    function updateTimer() {
      timerValue += 0.01;
      document.getElementById('timer-value').textContent = timerValue.toFixed(
          2);
    }

    let selectedElement = [];
    let correctedElement = [];

    const cards = Array.from(document.getElementsByClassName('card-match'));
    cards.forEach((elm, index) => {
      elm.addEventListener('click', () => {
        if (selectedElement.includes(elm)) {
          return;
        }
        elm.classList.add('selected');
        selectedElement.push(elm);
        if (selectedElement.length === 2) {
          const matched = selectedElement[0].dataset.key ===
              selectedElement[1].dataset.key;
          if (matched) {
            selectedElement[0].classList.remove('selected');
            selectedElement[1].classList.remove('selected');
            selectedElement[0].style.backgroundColor = 'lightgreen';
            selectedElement[1].style.backgroundColor = 'lightgreen';
            selectedElement[0].classList.add('hide');
            selectedElement[1].classList.add('hide');
            correctedElement.push(selectedElement[0], selectedElement[1]);
          } else {
            selectedElement[0].classList.remove('selected');
            selectedElement[1].classList.remove('selected');
            selectedElement[0].classList.add('animate-wrong');
            selectedElement[1].classList.add('animate-wrong');

            function onAnimationEnd(event) {
              event.target.classList.remove('animate-wrong');
            }

            selectedElement[0].addEventListener('animationend', onAnimationEnd);
            selectedElement[1].addEventListener('animationend', onAnimationEnd);
          }
          selectedElement = [];
          if (correctedElement.length === cards.length) {
            clearInterval(timerInterval);
            matchModal._element.querySelector(
                '#match-time').textContent = document.getElementById(
                'timer-value').textContent;
            matchModal.show();
            const conf = document.getElementById('confetti');
            conf.style.zIndex = '2';

            var confettiSettings = {
              'target': conf,
              'max': '80',
              'size': '1',
              'animate': true,
              'props': ['circle', 'square', 'triangle', 'line'],
              'colors': [
                [165, 104, 246],
                [230, 61, 135],
                [0, 199, 228],
                [253, 214, 126]],
              'clock': '25',
              'rotate': true,
              'start_from_edge': true,
              'respawn': true,
            };
            var confetti = new ConfettiGenerator(confettiSettings);
            confetti.render();
          }
        }
      });
    });
    startTimer();
  });
});

let matchModal = new bootstrap.Modal(document.getElementById('match-result'), {focus: false});

let progressBar = document.querySelector('#quiz-timer .progress-bar');

let quizSwiper = new Swiper('.quiz', {
  autoplay: {
    delay: 30000,
    stopOnLastSlide: true,
  },
});
quizSwiper.allowTouchMove = false;
quizSwiper.update();
quizSwiper.autoplay.stop();

document.getElementById('start-quiz').addEventListener('click', (evt) => {

  const matchSectionOverlay = document.getElementsByClassName(
      'section-overlay')[1];
  const quizzes = document.querySelectorAll('.quiz .swiper-slide');
  matchSectionOverlay.classList.add('hide');
  matchSectionOverlay.style.zIndex = '-1';

  quizSwiper.on('autoplayTimeLeft', (swiper, timeLeft, percentage) => {
    const remainingTime = parseFloat((timeLeft / 1000).toFixed(2));
    if (remainingTime % 1 === 0) {
      progressBar.style.width = percentage * 100 + '%';
      progressBar.textContent = remainingTime + 's';
      if (remainingTime <= 10) {
        progressBar.style.backgroundColor = 'var(--bs-danger)';
      } else if (remainingTime <= 20) {
        progressBar.style.backgroundColor = ('var(--bs-warning)');
      }
    }
    if (remainingTime === 0 && index === quizzes.length - 1) {
      submitAndOpenModal(timeLeft, percentage);
    }
  });

  quizSwiper.on('autoplayStart', () => {
    resetProgress();
  });

  let index = 0;
  quizSwiper.on('slideChange', (swiper) => {
    index++;
    resetProgress();
  });

  quizSwiper.autoplay.start();

  function resetProgress() {
    progressBar.style.width = '100%';
    progressBar.style.backgroundColor = 'var(--bs-success)';
    progressBar.textContent = '30s';
  }

  document.getElementById('next').addEventListener('click', (evt) => {
    quizSwiper.slideNext();
    if (index === quizzes.length - 1) {
      evt.target.textContent = 'Hantar';
      submitAndOpenModal();
    }
  });

  function submitAndOpenModal() {

    let correntAnswer = Array.from(
        document.querySelectorAll(
            'input[type="radio"][name="selection"]:checked')).
        filter((elm) => elm.classList.contains('answer')).length;
    let score = correntAnswer / 10;
    document.getElementById('correct').textContent = correntAnswer;
    document.getElementById('score').textContent = (score / 10) * 100 + '%';
    let scorebar = document.getElementById('scorebar');
    scorebar.style.width = score * 100 + '%';
    scorebar.classList.remove('bg-danger', 'bg-warning', 'bg-info',
        'bg-success');
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
        document.getElementById('result-modal'), {focus: false});
    resultModal.show();
    progressBar.style.opacity = '0';
  }
})
;

