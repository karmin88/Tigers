document.addEventListener('DOMContentLoaded', function() {

  function plot(func, target) {
    try {
      var data = [];

      if (func) {
        data.push({
          color: 'darkorange',
          fn: func,
        });
      }

      functionPlot({
        width: window.getComputedStyle(document.querySelector(target)).
            getPropertyValue('width').
            replace('px', ''),
        height: window.getComputedStyle(document.querySelector(target)).
            getPropertyValue('height').
            replace('px', ''),
        target: target,
        data: data,
        grid: true,
        yAxis: {domain: [-10, 10]},
        xAxis: {domain: [-10, 10]},
      });
    } catch (error) {
      console.error('An error occurred:', error.message);
      functionPlot({
        width: window.getComputedStyle(document.querySelector(target)).
            getPropertyValue('width').
            replace('px', ''),
        height: window.getComputedStyle(document.querySelector(target)).
            getPropertyValue('height').
            replace('px', ''),
        target: target,
        data: [],
        grid: true,
        yAxis: {domain: [-10, 10]},
        xAxis: {domain: [-10, 10]},
      });
    }
  }

  let currentValue = '.';

  document.getElementById('type').addEventListener('change', (evt) => {
    currentValue = evt.target.value;
    plot(currentValue, '#garis-lulus');
  });

  plot('2x+5', '#linear');
  plot('(x/2)^2 - 5', '#quad');
  plot('(x/3)^3 - 3', '#cube');
  plot('10/x', '#reci');
  plot('.', '#plot');
  plot(currentValue, '#garis-lulus');
  plot('x', '#positive-gradient');
  plot('-x', '#negative-gradient');
  functionPlot({
    width: window.getComputedStyle(document.querySelector('#parallel')).
        getPropertyValue('width').
        replace('px', ''),
    height: window.getComputedStyle(document.querySelector('#parallel')).
        getPropertyValue('height').
        replace('px', ''),
    target: '#parallel',
    data: [
      {
        color: 'darkorange',
        fn: '2x + 1',
      },
      {
        color: 'red',
        fn: '2x+5',
      },
    ],
    grid: true,
    yAxis: {domain: [-10, 10]},
    xAxis: {domain: [-10, 10]},
  });
  window.onresize = function() {
    plot('2x+5', '#linear');
    plot('(x/2)^2 - 5', '#quad');
    plot('(x/3)^3 - 3', '#cube');
    plot('10/x +3', '#reci');
    plot(result, '#plot');
    plot(currentValue, '#garis-lulus');
    plot('x', '#positive-gradient');
    plot('-x', '#negative-gradient');
    functionPlot({
      width: window.getComputedStyle(document.querySelector('#parallel')).
          getPropertyValue('width').
          replace('px', ''),
      height: window.getComputedStyle(document.querySelector('#parallel')).
          getPropertyValue('height').
          replace('px', ''),
      target: '#parallel',
      data: [
        {
          color: 'darkorange',
          fn: '2x + 1',
        },
        {
          color: 'red',
          fn: '2x+5',
        },
      ],
      grid: true,
      yAxis: {domain: [-10, 10]},
      xAxis: {domain: [-10, 10]},
    });
  };

  document.getElementById('type').addEventListener('change', function(evt) {
    currentValue = String(this.value);
    plot(this.value, '#garis-lulus');
  });

  for (let btn of document.getElementsByClassName(
      'link-button')) {
    const elm = document.getElementById(btn.dataset.link);
    btn.addEventListener('click', () => {
      scrollToWithOffset(elm, 100);
    });
  }

  let mathFieldSpan = document.getElementById('math-field');
  let result = '';
  let MQ = MathQuill.getInterface(2);
  let mathField = MQ.MathField(mathFieldSpan, {
    handlers: {
      edit: function() {
        var enteredMath = mathField.latex(); // Get entered math in LaTeX format
        console.log(enteredMath);
        $.ajax({
          type: 'GET',
          url: '/get_math_expr/',
          data: {latex: enteredMath}, // Send the enteredMath as a parameter named 'expression'
          dataType: 'text',
          success: function(response) {
            let resp = JSON.parse(response);
            console.log(resp);
            if (resp.success) {
              result = resp.result;
              plot(resp.result, '#plot');
              katex.render(String(resp.xIntercept), document.getElementById('x-intercept'), { throwOnError: false})
              katex.render(String(resp.yIntercept), document.getElementById('y-intercept'), { throwOnError: false})
            }
          },
          error: function(jqXHR, textStatus, errorThrown) {
            // Handle any errors that occur during the AJAX request
            console.error('AJAX Error:', textStatus, errorThrown);
          },
        });
      },
    },
  });
});
