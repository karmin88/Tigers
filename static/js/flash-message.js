jQuery.easing['ease-in-out'] = function (x, t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t + b;
    return -c / 2 * ((--t) * (t - 2) - 1) + b;
};

function animateFlash(header) {
    header.animate({
        top: '3%',
    }, {
        duration: 1000, // 1 second in milliseconds
        easing: 'ease-in-out',
        complete: function () {
            setTimeout(function () {
                // Move back above the viewport with animation
                header.animate({
                    top: '-10%',
                }, {
                    duration: 500,
                    easing: 'ease-in-out',
                    complete: function () {
                        // Animation complete, remove the content
                        header.empty();
                    },
                });
            }, 3000);
        },
    });
}

$(document).ready(function () {
    const header = $('#flask-message-header');
    animateFlash(header)
});

function showMessage(evt, message, category) {
    evt.preventDefault();

    const header = $('#flask-message-header');

    // Clear existing animations and remove the header content
    header.stop(true, true).empty();

    var alertDiv = $('<div class="alert alert-' + category + '" role="alert">' + message + '</div>');
    header.append(alertDiv);
    animateFlash(header)
}