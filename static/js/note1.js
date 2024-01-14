import {OnSpill, Sortable} from '/static/vendor/sortable.core.esm.js';

Sortable.mount(OnSpill);

document.addEventListener('DOMContentLoaded', function() {

  //   Sidebar 
  (function($) {

    'use strict';

    var fullHeight = function() {

      $('.js-fullheight').css('height', $(window).height());
      $(window).resize(function() {
        $('.js-fullheight').css('height', $(window).height());
      });

    };
    fullHeight();

    $('#sidebarCollapse').on('click', function() {
      $('#sidebar').toggleClass('active');
    });

  })(jQuery);

  // Swiper
  var swiper = new Swiper('.mySwiper', {
    loop: true,
    effect: 'cube',
    grabCursor: true,
    cubeEffect: {
      shadow: true,
      slideShadows: true,
      shadowOffset: 20,
      shadowScale: 0.75,
    },
    pagination: {
      clickable: true,
      el: '.swiper-pagination',
    },
  });

  //Sortable 
  const firstRowNum = document.getElementById('first-row-number');
  const secondRowNum = document.getElementById('second-row-number');
  const operator = document.getElementById('operator');
  const decimalName = {
    '1': 'Satu',
    '2': 'Puluh',
    '3': 'Ratus',
    '4': 'Ribu',
    '5': 'Ratus Ribu',
    '6': 'Juta',
    '-1': 'Persepuluh',
    '-2': 'Perseratus',
    '-3': 'Perseribu',
    '-4': 'Persepuluh Ribu',
    '-5': 'Perseratus Ribu',
    '-6': 'Persejuta',
  };
  let rowTooltips = [];

  new Sortable(document.getElementById('numbers'), {
    group: {
      name: 'shared',
      put: false,
      pull: 'clone',
    },
    sort: false,
    animation: 150,
    onStart: function(evt) {
      const background = '#ffffff66!important';
      const border = '2px dashed red';
      firstRowNum.style.border = border;
      firstRowNum.style.background = background;
      secondRowNum.style.border = border;
      secondRowNum.style.background = background;
      beforeRoundNum.style.background = background;
      beforeRoundNum.style.border = border;
      divisors.forEach((elm) => {
        elm.style.background = background;
        elm.style.border = border;
      });
      dividends.forEach((elm) => {
        elm.style.background = background;
        elm.style.border = border;
      });
    },
    onEnd: function(evt) {
      firstRowNum.style.border = '';
      firstRowNum.style.background = '';
      secondRowNum.style.border = '';
      secondRowNum.style.background = '';
      beforeRoundNum.style.background = '';
      beforeRoundNum.style.border = '';
      divisors.forEach((elm) => {
        elm.style.background = '';
        elm.style.border = '';
      });
      dividends.forEach((elm) => {
        elm.style.background = '';
        elm.style.border = '';
      });
    },
  });

  function addTooltip(element, title) {
    if (element.dataset.value !== '.') {
      const tooltip = new bootstrap.Tooltip(element, {
        html: true,
        placement: 'top',
        trigger: 'hover',
        customClass: 'tooltip-maroon',
        title: title,
      });
      rowTooltips.push(tooltip);

      element.addEventListener('drag',
          () => {rowTooltips.forEach((tt) => tt.hide());});
    }
  }

  function updateCalculatorTooltip(sortableList) {
    const list = Array.from(sortableList.children);
    const decimalIndex = list.findIndex((elm) => {
      return elm.dataset.value === '.';
    });
    list.forEach((element, index) => {
      const tooltip = bootstrap.Tooltip.getInstance(element);
      if (tooltip && index !== decimalIndex) {
        const placement = decimalIndex - index;
        let digit = parseInt(element.innerHTML) * 10 **
            (placement > 0 ? placement - 1 : placement);
        digit = placement < 0 ? digit.toFixed(-placement) : digit;
        tooltip.setContent({
          '.tooltip-inner': `
       <p class="mb-0">Nilai tempat: ${decimalName[placement]}</p>
       <p class="mb-0">Nilai digit: ${digit}</p>`,
        });
      }
    });
  }

  function initCalculatorTooltip() {
    [firstRowNum, secondRowNum].forEach((elm) => {
      for (let num of elm.children) {
        if (num.dataset.value !== '.') {
          addTooltip(num, 'Default title');
        }
      }
      updateCalculatorTooltip(elm);
    });
  }

  initCalculatorTooltip();

  const popover = new bootstrap.Popover(operator, {
    html: true,
    placement: 'right',
    trigger: 'focus',
    title: 'Select an operator',
    sanitize: false,
    content: `
      <div class="d-flex flex-column flex-wrap gap-2 m-3 align-items-center operators">
        <button type="button" class="btn btn-orange operator">+</button>
        <button type="button" class="btn btn-orange operator">-</button>
        <button type="button" class="btn btn-orange operator">*</button>
        <button type="button" class="btn btn-orange operator">/</button>
      </div>
    `,

  });

  popover._element.addEventListener('inserted.bs.popover', function() {
    document.querySelectorAll('.operators .operator').forEach((elm) => {
      elm.addEventListener('click',
          function() {
            operator.innerHTML = elm.innerHTML;
          });
    });
  });

  const calTooltip = new bootstrap.Tooltip(operator, {
    placement: 'top',
    trigger: 'manual',
    customClass: 'tooltip-danger',
    title: 'Nombor tidak sah untuk pengiraan."',
  });

  function getValueFromElements(elms) {
    let num = '';
    for (let n of elms) {
      num += n.dataset.value;
    }
    return num;
  }

  function fixRounding(value, precision) {
    var power = Math.pow(10, precision || 0);
    return Math.round(value * power) / power;
  }

  let currentCalTimeoutId = null;

  document.getElementById('calculate').addEventListener('click', function() {
    try {
      const firstNum = getValueFromElements(firstRowNum.children);
      const secondNum = getValueFromElements(secondRowNum.children);
      const op = operator.innerHTML;

      if (isNaN(firstNum) || isNaN(secondNum)) {
        throw new Error('Invalid input: Please provide valid numbers.');
      }

      const result = eval(`${firstNum}${op}${secondNum}`);

      if (isNaN(result)) {
        throw new Error('Invalid operation: Unable to calculate result.');
      }

      document.getElementById('output').innerHTML = fixRounding(result, 5);
    } catch (error) {
      if (currentCalTimeoutId) {
        calTooltip.hide();
        window.clearTimeout(currentCalTimeoutId);
      }
      calTooltip.show();
      console.log(currentCalTimeoutId);
      currentCalTimeoutId = setTimeout(() => calTooltip.hide(), 3000);
    }
  });

  const rowNumberConfig = {
    group: {
      name: 'shared',
      put: function(to) {
        return to.el.children.length < 7;
      },
    },
    removeOnSpill: true,
    onSpill: function(evt) {
      evt.item;
    },
    filter: '.filtered',
    direction: 'horizontal',
    animation: 150,
    onSort: function(evt) {
      updateCalculatorTooltip(evt.to);
    },
    onAdd: function(evt) {
      const addedElement = evt.item;
      addTooltip(addedElement, 'Default title');
    },
  };
  new Sortable(firstRowNum, rowNumberConfig);
  new Sortable(secondRowNum, rowNumberConfig);

  const fractionConfig = {
    group: {
      name: 'shared',
      put: function(to) {
        return to.el.children.length < 2;
      },
    },
    removeOnSpill: true,
    onSpill: function(evt) {
      setTimeout(compareFraction, 100);
    },
    direction: 'horizontal',
    animation: 150,
    onSort: function(evt) {
      compareFraction();
    },
  };
  const dividends = Array.from(document.getElementsByClassName('dividend'));
  const divisors = Array.from(document.getElementsByClassName('divisor'));
  const fracEqual = document.getElementById('fraction-equal');
  const fractionGrids = Array.from(
      document.getElementsByClassName('fraction-grid'));

  dividends.concat(divisors).forEach((elm) => {
    new Sortable(elm, fractionConfig);
  });

  function compareFraction() {
    let values = [];
    for (let i = 0; i < dividends.length; i++) {
      const dividend = parseInt(getValueFromElements(dividends[i].children)) ||
          '';
      const divisor = parseInt(getValueFromElements(divisors[i].children)) ||
          '';
      if (isNaN(divisor) || divisor === '' || divisor === 0 ||
          isNaN(dividend) ||
          dividend === '') {
        fracEqual.innerHTML = '&#10006;';
        equalTooltip.hide();
        equalTooltip.show();
        setTimeout(() => equalTooltip.hide(), 3000);
        return;
      }
      console.log(dividend);
      console.log(divisor);
      updateCell(fractionGrids[i], dividend, divisor);
      values.push(eval(`${dividend} / ${divisor}`));
    }
    if (values[0] === values[1]) {
      fracEqual.innerHTML = '=';
    } else {
      fracEqual.innerHTML = '&NotEqual;';
    }
  }

  const equalTooltip = new bootstrap.Tooltip(fracEqual, {
    placement: 'top',
    trigger: 'manual',
    customClass: 'tooltip-danger',
    title: function() {
      return 'Nombor tidak sah untuk pengiraan.';
    },
  });
  const beforeRoundNum = document.getElementById('before-round');

  function updateCell(grid, dividend, divisor) {
    const len = 100 - grid.children.length;

    for (let i = 0; i < len; i++) {
      grid.innerHTML += '<div class="grid-cell"></div>';
    }

    for (let cell of grid.children) {
      cell.style.backgroundColor = '';
      cell.classList.remove('fill');
      if (dividend > 0) {
        cell.classList.add('fill');
        dividend--;
      }
      if (divisor > 0) {
        cell.style.backgroundColor = 'lightgreen';
        divisor--;
      }
    }
  }

  updateCell(fractionGrids[0], 21, 7);
  updateCell(fractionGrids[1], 12, 7);

  const roundNumberConfig = {
    group: {
      name: 'shared',
      put: function(to) {
        return to.el.children.length < 7;
      },
    },
    removeOnSpill: true,
    onSpill: function(evt) {
      evt.item;
    },
    filter: '.filtered',
    direction: 'horizontal',
    animation: 150,
    onAdd: function(evt) {
      const addedElement = evt.item;
      if (parseInt(addedElement.innerHTML) < 5) {
        addTooltip(addedElement, 'Nombor Sakut');
      } else {
        addTooltip(addedElement, 'Nombor Sihat');
      }
    },
  };
  new Sortable(beforeRoundNum, roundNumberConfig);

  function initRoundTooltip() {
    for (let child of beforeRoundNum.children) {
      if (parseInt(child.innerHTML) < 5) {
        addTooltip(child, 'Nombor Sakit');
      } else {
        addTooltip(child, 'Nombor Sihat');
      }
    }
  }

  initRoundTooltip();

  document.getElementById('round').addEventListener('click', function() {
    const value = document.getElementById('round-val').value;
    const childrenArray = Array.from(beforeRoundNum.children).reverse();
    let increment = false;
    let nums = '';
    const decimalIndex = Array.from(beforeRoundNum.children).
        findIndex((elm) => {
          return elm.dataset.value === '.';
        });
    let i = beforeRoundNum.children.length - decimalIndex - value - 1;
    for (let num of childrenArray) {
      if (num.textContent === '.') {
        nums = '.' + nums;
        continue;
      }
      let val = parseInt(num.textContent);
      if (increment) {
        val += 1;
        if (val === 10) {
          nums = '0' + nums;
          increment = true;
          continue;
        } else {
          increment = false;
          nums = val.toString() + nums;
          continue;
        }
      }
      if (val >= 5 && i > 0) {
        increment = true;
        val = 0;
      }
      i--;
      nums = val.toString() + nums;
    }
    document.getElementById('after-round').innerHTML = parseFloat(nums).
        toFixed(value);
  });

  // Table of content link
  for (let btn of document.getElementsByClassName(
      'link-button')) {
    const elm = document.getElementById(btn.dataset.link);
    btn.addEventListener('click', () => {
      scrollToWithOffset(elm, 100);
    });
  }

  document.getElementById('tutorial-calc').
      addEventListener('click', function() {
        const tutorial = introJs();

        tutorial.setOptions({
          steps: [
            {
              title: 'Langkah 1',
              element: document.querySelector('#sidebar'),
              intro: 'Anda boleh seret nombor dari sini.',
              position: 'right',
            },
            {
              title: 'Langkah 2',
              element: document.querySelector('#first-row-number'),
              intro: 'Nombor boleh diletakkan di sini dan diseret untuk diatur.',
              position: 'bottom',
            },
            {
              title: 'Langkah 3',
              element: document.querySelector('#second-row-number'),
              intro: 'Sama seperti sebelumnya, tetapi nombor ini adalah nombor kedua untuk pengiraan.',
              position: 'top',
            },
            {
              title: 'Langkah 4',
              element: document.querySelector('#operator'),
              intro: 'Pilih operator dengan mengklik ini.',
              position: 'right',
            }, {
              title: 'Langkah 65',
              element: document.querySelector('#calculate'),
              intro: 'Klik di sini untuk mengira hasil.',
              position: 'right',
            },
          ],
          prevLabel: 'Kembali',
          nextLabel: 'Seterusnya',
          doneLabel: 'Selesai',
          scrollToElement: false,
        });
        tutorial.start();
      });

  document.getElementById('tutorial-pecahan').
      addEventListener('click', function() {
        const tutorial = introJs();
        tutorial.setOptions({
          steps: [
            {
              title: 'Langkah 1',
              element: document.querySelector('#sidebar'),
              intro: 'Anda boleh seret nombor dari sini.',
              position: 'right',
              scrollToElement: false,
            },
            {
              title: 'Langkah 2',
              element: document.querySelectorAll('.frac')[0],
              intro: 'Nombor boleh diletakkan di sini dan diseret untuk diatur.',
              position: 'top',
            },
            {
              title: 'Langkah 3',
              element: document.querySelector('.fraction-grid'),
              intro: 'Pecahan akan divisualisasikan dengan gambar ini.',
              position: 'ritgt',
            },
            {
              title: 'Langkah 4',
              element: document.querySelectorAll('.frac')[1],
              intro: 'Sama seperti sebelumnya, tetapi nombor ini adalah pecahan kedua untuk perbandingan.',
              position: 'bottom',
            },
            {
              title: 'Langkah 5',
              element: document.querySelector('#fraction-equal'),
              intro: 'Ini akan menunjukkan simbol sama atau tidak sama setelah membandingkan dua pecahan.',
              position: 'right',
            },
          ],
          prevLabel: 'Kembali',
          nextLabel: 'Seterusnya',
          doneLabel: 'Selesai',
          scrollToElement: false,
        });
        tutorial.start();
      });

  document.getElementById('tutorial-round').
      addEventListener('click', function() {
        const tutorial = introJs();
        tutorial.setOptions({
          steps: [
            {
              title: 'Step 1',
              element: document.querySelector('#sidebar'),
              intro: 'You can drag number from here',
              position: 'right',
            },
            {
              title: 'Step 2',
              element: document.querySelector('#before-round'),
              intro: 'Put the number here',
              position: 'top',
            },
            {
              title: 'Step 3',
              element: document.querySelector('#round-val'),
              intro: 'Put the number here',
              position: 'top',
            },
            {
              title: 'Step 5',
              element: document.querySelector('#round'),
              intro: 'Select an operator',
              position: 'right',
            }, {
              title: 'Step 6',
              element: document.querySelector('#after-round'),
              intro: 'Calculate the result',
              position: 'bottom',
            },
          ],
          prevLabel: 'Kembali',
          nextLabel: 'Seterusnya',
          doneLabel: 'Selesai',
          scrollToElement: false,
        });
        tutorial.start();
      });
});



