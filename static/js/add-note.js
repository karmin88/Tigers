Dropzone.autoDiscover = false;

let sectionCounter = 0;
const dropzoneConfig = {
  url: '/he',
  paramName: 'file',
  maxFiles: 5,
  maxFilesize: 5,
  addRemoveLinks: true,
  autoQueue: true,
  autoProcessQueue: false,
  clickable: true,
  acceptedFiles: 'image/*, application/pdf',
  accept: function(file, done) {
    if (file.type === 'application/pdf') {
      if (this.files.filter(f => f.type === 'application/pdf').length > 1) {
        done('Only one PDF file is allowed per section.');
      } else {
        const fileUrl = URL.createObjectURL(file);
        $(this['element']).
            closest('.card-body').
            find('.embed-responsive-item').
            attr('src', fileUrl);
      }
    } else {
      done();
    }
  },

  removedfile: function(file) {
    if (file.type === 'application/pdf' &&
        !this.files.some(f => f.type === 'application/pdf')) {
      const iframeBody = $(this['element']).
          closest('.card-body').
          find('.embed-responsive-item').
          contents().
          find('body');
      iframeBody.html(
          '    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">\n    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css">\n<div class="container-fluid h-100 d-flex justify-content-center align-items-center flex-column my-5">\n    <i class="bi bi-exclamation-triangle-fill text-danger h4"></i>\n    <h1 class="text-center ">PDF tidak ditemui atau telah dipadamkan</h1>\n</div>');
      iframeBody.css('background-color', 'white');
    }
    if (file.previewElement != null && file.previewElement.parentNode != null) {
      file.previewElement.parentNode.removeChild(file.previewElement);
    }
    return this._updateMaxFilesReachedClass();
  },

  dictDefaultMessage: `
    <div class=" text-muted">
        <i class="bi bi-cloud-arrow-up-fill h1"></i>
        <br class="text-muted">Klik atau seret dan laspankan fail di sini untuk dimuatnaik.
        <br>Hanya 1 PDF dan sehingga 5 imej yang dibenarkan untuk setiap bahagian (kurang dari 5Mb)
    </div>`,

  init: function() {
    this.on('addedfile', function(file) {
      $('.dz-progress').addClass('d-none');
      const removeLink = $('.dz-remove');
      removeLink.addClass('my-1');
      removeLink.html(
          '<i class="bi bi-x-circle-fill bi-hover text-danger"></i>');
    });

    this.on('error', function(file, message, xhr) {
      if (xhr == null) this.removeFile(file);
      alert(message);
    });
  },
};

const tinyMCEConfig = {
  selector: 'textarea',
  plugins: 'ai tinycomments mentions anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed permanentpen footnotes advtemplate advtable advcode editimage tableofcontents mergetags powerpaste tinymcespellchecker autocorrect a11ychecker typography inlinecss',
  toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
  tinycomments_mode: 'embedded',
  tinycomments_author: 'Author name',
  mergetags_list: [
    {value: 'First.Name', title: 'First Name'},
    {value: 'Email', title: 'Email'},
  ],
  ai_request: (request, respondWith) => respondWith.string(
      () => Promise.reject('See docs to implement AI Assistant')),
  setup: function(editor) {
    editor.on('change', function() {
      editor.save();
    });
  },
};

function addSection(skipScroll = false) {
  const newSection = $('#section-form-template').contents().clone(true, true);
  const container = $('#section-container');
  container.append(newSection);
  const dropzone = newSection.find('.dropzone');
  dropzone.dropzone(dropzoneConfig);
  tinymce.init(tinyMCEConfig);

  newSection.find('.close').on('click', function(evt) {
    const currentForm = $(this).closest('form');
    const prevForm = currentForm.prev();
    currentForm.remove();
    window.scrollTo({
      top: prevForm.get(0).getBoundingClientRect().top + window.pageYOffset -
          25,
      behavior: 'smooth',
    });
  });

  newSection.find('.collapsible').on('click', function() {
    const collapseIcon = $(this).children('.bi-collapsible');
    if (collapseIcon.hasClass('bi-arrows-angle-contract')) {
      collapseIcon.addClass('bi-arrows-angle-expand');
      collapseIcon.removeClass('bi-arrows-angle-contract');
    } else {
      collapseIcon.removeClass('bi-arrows-angle-expand');
      collapseIcon.addClass('bi-arrows-angle-contract');
    }
    $(this).siblings('.card-body').slideToggle('fast');
  });
  if (skipScroll) {
    window.scrollTo({
      top: newSection.get(1).getBoundingClientRect().top + window.pageYOffset -
          25,
      behavior: 'smooth',
    });
  }
}

$(document).ready(function() {

  addSection();

  $('#add-section').on('click', function(evt) {
    addSection(true);
  });

  $('#submit-note').on('click', function(evt) {

    const forms = $('#section-container .section-form');
    const selectedChap = $('#selected-chap');
    if (selectedChap.val() === null) {
      selectedChap[0].setCustomValidity('Please select a chapter.');
      console.log(selectedChap.val());
      selectedChap[0].reportValidity();
      return;
    } else {
      selectedChap[0].setCustomValidity('');
      selectedChap[0].reportValidity();
    }
    if (forms.toArray().some(form => !form.reportValidity())) return;
    let counter = 1;
    let allSectionFormData = new FormData();
    allSectionFormData.append('total_section', forms.length);
    allSectionFormData.append('chapter', selectedChap.val());
    forms.each(function() {
      for (ent of new FormData(this).entries()) {
        console.log(ent)
      }
      for (value of new FormData(this).values()) {
        allSectionFormData.append(`s${counter}_data`, value);
      }
      const dropzone = Dropzone.forElement($(this).find('.dropzone')[0]);
      dropzone.files.forEach(
          file => allSectionFormData.append(`s${counter}_files`, file));
      counter++;
    });
    $.ajax({
      type: 'POST',
      url: '/teacher_note',
      data: allSectionFormData,
      contentType: false,
      processData: false,
    }).then(window.location.reload());
  });
});