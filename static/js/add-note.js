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
    accept: function (file, done) {
        if (file.type === 'application/pdf') {
            if (this.files.filter(f => f.type === 'application/pdf').length > 1) {
                done("Only one PDF file is allowed per section.");
            } else {
                const fileUrl = URL.createObjectURL(file)
                $(this['element']).parents('.card-body').find('.embed-responsive-item').attr('src', fileUrl)
            }
        } else {
            done();
        }
    },
    removedfile: function (file) {
        if (file.type === 'application/pdf' && !this.files.some(f => f.type === 'application/pdf')) {
            const iframeBody = $(this['element']).parents('.card-body').find('.embed-responsive-item').contents().find('body');
            iframeBody.html('<h1>PDF not found or has been removed</h1>')
            iframeBody.css('background-color', '#efefef')
        }
        if (file.previewElement != null && file.previewElement.parentNode != null) {
            file.previewElement.parentNode.removeChild(file.previewElement);
        }
        return this._updateMaxFilesReachedClass();
    },
    dictDefaultMessage: `<i class="bi bi-cloud-arrow-up-fill h1"></i>
                                <br>Click or drop files here to upload
                                <br>Only 1 PDF and up to 5 images are allowed per section (<5Mb)`,
    init: function () {
        this.on('addedfile', function (file) {
            $('.dz-progress').addClass('d-none');
            const removeLink = $('.dz-remove');
            removeLink.addClass('my-1');
            removeLink.html('<i class="bi bi-x-circle-fill bi-hover text-danger"></i>')
        });

        this.on("error", function (file, message, xhr) {
            if (xhr == null) this.removeFile(file);
            alert(message)
        });
    }
}

function addSection() {
    const newSection = $('#section-form-template').contents().clone();
    $('#section-container').append(newSection);
    const dropzone = newSection.find('.dropzone')
    dropzone.dropzone(dropzoneConfig);
}

$(document).ready(function () {

    addSection()

    $('.collapsible').on('click', function () {
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

    $('#add-section').on('click', function (evt) {
        addSection()
    });
})