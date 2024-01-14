window.addEventListener('load', () => {

  // Set height for container of card tab
  for (const cardTabContainer of document.getElementsByClassName(
      'card-tab-container')) {
    cardTabContainer.style.height = cardTabContainer.firstElementChild.clientHeight +
        'px';
  }

  // Init counter animation for about us
  const initCounter = () => {

    const counters = document.querySelectorAll('.count');

    const minTarget = Math.min(...Array.from(counters,
        counter => parseInt(counter.getAttribute('data-target'))));
    const maxTarget = Math.max(...Array.from(counters,
        counter => parseInt(counter.getAttribute('data-target'))));

    const valueRange = maxTarget - minTarget;

    const speed = valueRange;

    let counting = true;

    counters.forEach((counter) => {
      const updateCount = () => {
        const target = parseInt(counter.getAttribute('data-target'));
        const count = parseInt(counter.innerText);
        const increment = Math.trunc(target / speed);

        if (count < target && counting) {
          counter.innerText = count + increment;
          setTimeout(updateCount, 50);
        } else {
          counter.innerText = target;
          counting = false;
        }
      };
      updateCount();
    });
  };

  document.addEventListener('aos:in:counter', function(detail) {
    setTimeout(() => initCounter(), 450)
  });

  function scrollIntoElement(id) {
    const targetElement = document.querySelector(id);
    const elementPosition = targetElement.getBoundingClientRect().top;
    const offset = elementPosition + window.pageYOffset -
        document.getElementById('navbar').offsetHeight;
    window.scrollTo({
      behavior: 'smooth',
      top: offset,
    });
  }

  document.getElementById('resources-link').
      addEventListener('click', function(evt) {
        evt.preventDefault();
        scrollIntoElement(
            this.getAttribute('href'));
      });
});

