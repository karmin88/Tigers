var swiper = new Swiper('.mySwiper', {
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    renderBullet: function(index, className) {
      return '<span class="' + className + '">' + (index + 1) + '</span>';
    },
    dynamicBullets: true,
    dynamicMainBullets: 5,
  },
});

function totalQuizChange(elm) {
  const questionSwiper = document.getElementById('swiper-wrapper');
  const questionNum = questionSwiper.children.length;
  const questionNumberDiff = questionNum - parseInt(elm.value);
  const questions = Array.from(questionSwiper.children);
  console.log(questionNumberDiff);
  if (questionNumberDiff < 0) {
    for (let i = questionNumberDiff, count = 1; i < 0; i++, count++) {
      questionSwiper.insertAdjacentHTML('beforeend',
          slide(questionNum + count));
    }
  } else if (questionNumberDiff > 0) {
    for (let i = questionNumberDiff; i > 0; i--) {
      questionSwiper.removeChild(questions[i]);
    }
  }
  swiper.update();
}

function addOption(elm, evt) {
  evt.preventDefault();
  const optionWrapper = $(elm).closest('.row').find('.option-wrapper')[0];
  const optionNum = optionWrapper.children.length;
  if (optionNum < 6) {
    optionWrapper.insertAdjacentHTML('beforeend', option);
    // Update values for all radio buttons
    updateRadioValues(optionWrapper);

    if (optionNum === 5) {
      elm.firstElementChild.classList.remove('text-orange');
      elm.firstElementChild.classList.add('text-danger');
    }
  }
}

// Function to update radio button values based on their index
function updateRadioValues(wrapper) {
  Array.from(wrapper.children).forEach((child, index) => {
    child.querySelector('input[name="answer"]').value = index;
  });
}

function removeOption(elm, evt) {
  evt.preventDefault();
  const optionWrapper = $(elm).closest('.row').find('.option-wrapper')[0];
  if (optionWrapper.children.length > 2) {
    const addButtonIcon = optionWrapper.previousElementSibling.getElementsByClassName(
        'add-option')[0];
    $(elm).closest('.option').remove();

    // Update values for all radio buttons
    updateRadioValues(optionWrapper);

    addButtonIcon.classList.remove('text-danger');
    addButtonIcon.classList.add('text-orange');
  }
  evt.preventDefault();
  evt.stopPropagation()
}

function addedImage(elm, evt) {
  if (elm.tagName === 'INPUT' && elm.files[0] !== undefined) {
    const imgReader = new FileReader();
    console.log(elm.labels)
    elm.labels.item(0).querySelector('.filename').innerHTML = elm.files[0].name;
    imgReader.onload = (evt) => {
      $(elm).
          closest('.swiper-slide').
          find('.question-img')[0].src = evt.target.result;
    };
    imgReader.readAsDataURL(elm.files[0]);
  } else {
    elm.parentElement.getElementsByClassName('filename').
        item(0).innerHTML = 'Tiada imej yang dipilih';
    elm.previousElementSibling.value = '';
    $(elm).
        closest('.swiper-slide').
        find('.question-img')[0].src = '';
  }
  evt.preventDefault();
}

function submitQuestion(elm, evt) {
  evt.preventDefault();
  const allQuesForm = new FormData(elm);
  const quesFormList = Array.from(document.getElementsByClassName('question'));
  for (let i = 0; i < quesFormList.length; i++) {
    if (!quesFormList[i].checkValidity()) {
      if (swiper.activeIndex !== i) {
        swiper.slideTo(i);
        swiper.on('transitionEnd', function() {
          quesFormList[i].reportValidity();
          swiper.off('transitionEnd');
        });
      } else {
        quesFormList[i].reportValidity();
      }
      return false;
    } else {
      const quesForm = new FormData(quesFormList[i]);
      if (quesForm.get('image').type !== 'application/octet-stream') {
        allQuesForm.append(`q${i}_file`, quesForm.get('image'));
      }
      quesForm.delete('image');
      const formDataObj = {};

      for (const [key, value] of quesForm.entries()) {
        if (formDataObj.hasOwnProperty(key)) {
          // If the key already exists, convert it to an array or push the new value
          if (!Array.isArray(formDataObj[key])) {
            formDataObj[key] = [formDataObj[key]];
          }
          formDataObj[key].push(value);
        } else {
          formDataObj[key] = value;
        }
      }
      allQuesForm.append(`q${i}_data`, JSON.stringify(formDataObj));
    }
  }
  logFormData(allQuesForm);
  $.ajax({
    type: 'POST',
    url: '/add_quiz',
    contentType: false,
    processData: false,
    data: allQuesForm,
  }).then(() => window.location.reload());
}

function logFormData(formData) {
  for (entry of formData.entries()) {
    console.log(entry[0] + ': ' + entry[1]);
  }
}

const slide = (questionNum) => `<form class="swiper-slide card pb-5 question">
  <div class="card-header bg-white fw-bold h5 text-orange question-no">Soalan ${questionNum}</div>
  <div class="card-img card-img-top">
    <img src="" alt="" class="question-img">
  </div>
  <div class="card-body pt-4 w-100 text-start">
    <div class="row mb-3">
      <label class="col-form-label col-lg-3">Pilih imej soalan</label>
      <div class="col-lg-9">
        <label for="image-${questionNum}" class="w-100 custom-form-file rounded-1 overflow-hidden">
                    <span class="d-flex">
                      <span class="btn btn-orange rounded-0" style="white-space: nowrap">Pilih imej</span>
                      <span class="form-control rounded-start-0 rounded-end-0 p-0">
                        <span class="text-muted ms-2 mb-0 h-100 d-flex align-items-center filename">
                          Tiada imej yang dipilih
                        </span>
                      </span>
                      <button type="button" class="btn btn-danger rounded-0" onclick="addedImage(this, event)">Buang</button>
                    </span>
        </label>
          <input type="file" accept="image/*" name="image" class="d-none" id="image-${questionNum}"
                 onchange="addedImage(this, event)">
        <div class="form-text">** Mengunggah gambar untuk soalan tidak diwajibkan dan hanya satu gambar setiap
          soalan.
        </div>
      </div>
    </div>
    <div class="row mb-3">
      <label class="col-form-label col-lg-3">Soalan</label>
      <div class="col-lg-9">
        <textarea class="form-control" name="question" placeholder="Masukkan soalan di sini" rows="6"
                  required></textarea>
      </div>
    </div>
    <div class="row mb-3">
      <label class="col-form-label col-lg-3">
                <span class="d-flex justify-content-between align-items-center">
                  Pilihan
                  <button title="Tambah pilihan" onclick="addOption(this, event)"><span
                        class="bi bi-hover-sm bi-plus-square-fill text-orange add-option"></span></button>
                </span>
      </label>
      <div class="col-lg-9 option-wrapper">
        <div class="input-group mb-2 option">
          <div class="input-group-text option-no">Pilihan
            <input class="form-check-input m-0 ms-2" type="radio" name="answer" value="0" title="Pilih sebagai jawapan"
                   required>
          </div>
          <input type="text" name="option[]" class="form-control border-end-0" required>
          <div class="input-group-text border-start-0 bg-white">
            <button type="button" title="remove"><span class="bi bi-x-circle-fill bi-hover-sm text-danger"></span></button>
          </div>
        </div>
        <div class="input-group mb-2 option">
          <div class="input-group-text option-no">Pilihan
            <input class="form-check-input m-0 ms-2" type="radio" name="answer" value="1" title="Pilih sebagai jawapan"
                   required>
          </div>
          <input type="text" name="option[]" class="form-control border-end-0" required>
          <div class="input-group-text border-start-0 bg-white">
            <button type="button" title="remove"><span class="bi bi-x-circle-fill bi-hover-sm text-danger"></span></button>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
`;

const option = `
<div class="input-group mb-2 option">
  <div class="input-group-text option-no">Pilihan
    <input class="form-check-input m-0 ms-2" type="radio" name="answer" title="Pilih sebagai jawapan">
  </div>
  <input type="text" name="option[]" class="form-control border-end-0" required>
  <div class="input-group-text border-start-0 bg-white">
    <button title="remove" onclick="removeOption(this, event)"><span
          class="bi bi-x-circle-fill bi-hover-sm text-danger"></span></button>
  </div>
</div>
`;