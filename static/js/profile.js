function valueChange(id, value) {
  document.getElementById(id).innerText = value
}

function removeTag(btn) {
  if (tagContainer.children.length > 1) {
    btn.parentElement.remove();
    const icon = document.getElementById('add-tag');
    icon.classList.add('text-orange');
    icon.classList.remove('text-danger');
  }
}

function removeExperience(id) {
  $.ajax({
    type: 'POST',
    url: '/remove_experience',
    data: {'id': id},
  }).then(function() {
    window.location.reload();
  });
}

const experienceFormModal = document.getElementById('experience-form-modal');
experienceFormModal.
    addEventListener('submit', function(evt) {
      evt.preventDefault();
      const formData = new FormData(this);
      $.ajax({
        type: 'POST',
        url: '/new_experience',
        data: formData,
        contentType: false,
        processData: false,
      }).then(function() {
        window.location.reload();
      });
    });

experienceFormModal.addEventListener('hidden.bs.modal', function(evt) {
  while (tagContainer.childElementCount > 1) {
    tagContainer.removeChild(tagContainer.lastElementChild);
    const icon = document.getElementById('add-tag');
    icon.classList.add('text-orange');
    icon.classList.remove('text-danger');
  }
});

const tagContainer = document.getElementById('tag-container');

function addTag() {
  const tags = tagContainer.children;
  if (tags.length < 5) {
    const tag = tags[0].cloneNode(true);
    const tagInput = tag.querySelector('input');
    tagInput.value = '';
    tagInput.setAttribute('readonly', true);
    tagInput.classList.add('border-0', 'text-secondary');
    tagInput.addEventListener('dblclick', function() {
      this.removeAttribute('readonly');
      this.classList.remove('border-0', 'text-secondary');
    });
    tagInput.addEventListener('focusout', function() {
      this.setAttribute('readonly', true);
      this.classList.add('border-0', 'text-secondary');
    });
    tagContainer.appendChild(tag);
  }
  if (tags.length === 5) {
    const icon = document.getElementById('add-tag');
    icon.classList.remove('text-orange');
    icon.classList.add('text-danger');
  }
}

for (const field of document.getElementsByClassName('double-editable')) {
  field.addEventListener('dblclick', function() {
    this.removeAttribute('readonly');
    this.classList.remove('border-0', 'text-secondary');
  });
}

for (const field of document.getElementsByClassName('double-editable')) {
  field.addEventListener('focusout', function() {
    this.setAttribute('readonly', true);
    this.classList.add('border-0', 'text-secondary');
  });
}

for (const field of document.getElementsByClassName('focus-out-submit')) {
  field.addEventListener('focusout', function() {
    const column = this.getAttribute('name');
    const value = this.value;
    editProfileRequest({[column]: value});
  });
}

let selectedAvatar = null;

function changeCurrentAvatar(avatar) {
  selectedAvatar = avatar;
  document.getElementById('current-avatar').setAttribute('src', avatar);
}

document.getElementById('avatar-form-modal').
    addEventListener('submit', function(evt) {
      evt.preventDefault();
      const form = this;
      const formData = $(form).serializeArray();
      if (formData[0].value !== formData[1].value) {
        editProfileRequest({'avatar_id': formData[1].value}).
            done(function(response) {
              document.getElementById('profile-avatar').
                  setAttribute('src', selectedAvatar);
            });
      }
      $(form).modal('hide');
    });

function editProfileRequest(data) {
  return $.ajax({
    type: 'POST', url: '/edit_profile', data: data,
  });
}

const imageTooltip = document.getElementById('image-tooltip');
const imageUrl = document.getElementById('image-url');
const tooltip = new bootstrap.Tooltip(imageTooltip, {
  html: true,
  placement: 'right',
  trigger: 'hover',
  customClass: 'custom-tooltip',
  title: function() {
    return `<img src="${imageUrl.value}" alt="Not found" class="img-fluid rounded-1">`;
  },
});

imageTooltip.addEventListener('mouseover', function() {
  tooltip.show();
});

imageTooltip.addEventListener('mouseout', function() {
  tooltip.hide(); // Fix: Use tooltip.hide() to hide the tooltip
});

window.addEventListener('load', () => {
  document.querySelectorAll('.hero-svg path').forEach(function(path) {
    path.classList.add('animate');
  });
});



