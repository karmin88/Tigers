
window.addEventListener('load', function() {

  document.querySelectorAll('.btn-check').forEach(function(radio) {
    $(radio).on('change', function() {
      const flipImg = document.getElementById(this.getAttribute('data-target'));
      if (this.classList.contains('teacher')) {
        flipImg.style.transform = 'rotateY(0deg)';
      } else if (this.classList.contains('student')) {
        flipImg.style.transform = 'rotateY(-180deg)';
      }
    });
  });

});