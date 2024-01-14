window.addEventListener('load', () => {

  // Init animated flash message
  jQuery.easing['ease-in-out'] = function(x, t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t + b;
    return -c / 2 * ((--t) * (t - 2) - 1) + b;
  };

  function animateFlash(header) {
    $(header).animate({
      top: '100px',
    }, {
      duration: 1000,
      easing: 'ease-in-out',
      complete: function() {
        setTimeout(function() {
          header.animate({
            top: '-10%',
          }, {
            duration: 500,
            easing: 'ease-in-out',
            complete: function() {
              header.empty();
            },
          });
        }, 3000);
      },
    });
  }

  function showMessage(evt, message, category) {
    evt.preventDefault();
    header.stop(true, true).empty();

    const alertDiv = $(
        '<div class="alert alert-' + category + '" role="alert">' + message +
        '</div>');
    header.append(alertDiv);
    animateFlash(header);
  }

  // Init navbar showing dynamic behavior
  const navbar = document.getElementById('navbar');
  const hero = document.getElementById('hero');
  if (navbar && hero) {
    window.addEventListener('scroll', function() {
      const isNavbarAnimating = $(navbar).is(':animated');
      const scrollThreshold = hero.offsetHeight - 100;

      if (isNavbarAnimating) {
        return;
      }
      if (window.scrollY > scrollThreshold &&
          !navbar.classList.contains('fixed-top')) {
        navbar.classList.remove('position-absolute');
        navbar.classList.add('fixed-top');
        navbar.classList.add('bg-navbar');
        $(navbar).hide().slideDown('fast');
      } else if (window.scrollY <= scrollThreshold - 100 &&
          navbar.classList.contains('fixed-top')) {
        $(navbar).slideUp('fast', () => {
          navbar.classList.remove('fixed-top');
          navbar.classList.add('position-absolute');
          navbar.classList.remove('bg-navbar');
          navbar.style.display = 'block';
        });
      }
    });
  }

  // show flash message if any
  const header = $(document.getElementById('flask-message-header'));
  animateFlash(header);

  // Init preloader
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(function() {
      $(preloader).fadeOut();
    }, 1000);
  }

  AOS.init({once: true});
  document.querySelectorAll('img').forEach((img) =>
      img.addEventListener('load', () =>
          AOS.refresh(),
      ),
  );
});

function scrollToWithOffset(elm, offset) {
  window.scrollTo({
    top: elm.getBoundingClientRect().top +
        window.pageYOffset -
        offset,
    behavior: 'smooth',
  });
}
