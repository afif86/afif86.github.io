// Class page filters: custom select dropdowns (Type of classes, Teacher) and a custom date picker.
(function () {
  function initSelectDropdowns() {
    document.querySelectorAll('.select-dropdown').forEach(function (dd) {
      var toggle = dd.querySelector('.select-dd-toggle');
      var label = dd.querySelector('.select-dd-label');
      var items = dd.querySelectorAll('.select-dd-list li');

      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = dd.classList.toggle('open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });

      items.forEach(function (item) {
        item.addEventListener('click', function () {
          items.forEach(function (i) { i.classList.remove('is-selected'); });
          item.classList.add('is-selected');
          label.textContent = item.textContent;
          dd.setAttribute('data-value', item.getAttribute('data-value'));
          dd.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });

      document.addEventListener('click', function (e) {
        if (!dd.contains(e.target)) {
          dd.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  function initDatePicker() {
    var dd = document.querySelector('.date-dropdown');
    if (!dd) return;
    var toggle = dd.querySelector('.date-dd-toggle');
    var label = dd.querySelector('.date-dd-label');
    var title = dd.querySelector('.date-dd-title');
    var grid = dd.querySelector('.date-dd-grid');
    var navs = dd.querySelectorAll('.date-dd-nav');

    var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    var today = new Date();
    var view = new Date(today.getFullYear(), today.getMonth(), 1);
    var selected = null;

    function pad(n) { return n < 10 ? '0' + n : '' + n; }

    function render() {
      title.textContent = MONTHS[view.getMonth()] + ' ' + view.getFullYear();
      grid.innerHTML = '';
      var year = view.getFullYear();
      var month = view.getMonth();
      var first = new Date(year, month, 1);
      // Convert Sun=0..Sat=6 to Mon=0..Sun=6
      var startOffset = (first.getDay() + 6) % 7;
      var daysInMonth = new Date(year, month + 1, 0).getDate();
      var daysInPrev = new Date(year, month, 0).getDate();

      for (var i = 0; i < 42; i++) {
        var btn = document.createElement('button');
        btn.type = 'button';
        var dayNum, cellDate, muted = false;
        if (i < startOffset) {
          dayNum = daysInPrev - startOffset + 1 + i;
          cellDate = new Date(year, month - 1, dayNum);
          muted = true;
        } else if (i >= startOffset + daysInMonth) {
          dayNum = i - (startOffset + daysInMonth) + 1;
          cellDate = new Date(year, month + 1, dayNum);
          muted = true;
        } else {
          dayNum = i - startOffset + 1;
          cellDate = new Date(year, month, dayNum);
        }
        btn.textContent = dayNum;
        if (muted) btn.classList.add('is-muted');
        if (selected &&
          cellDate.getFullYear() === selected.getFullYear() &&
          cellDate.getMonth() === selected.getMonth() &&
          cellDate.getDate() === selected.getDate()) {
          btn.classList.add('is-selected');
        }
        (function (d) {
          btn.addEventListener('click', function (e) {
            e.stopPropagation();
            selected = d;
            label.textContent = pad(d.getDate()) + '.' + pad(d.getMonth() + 1) + '.' + d.getFullYear();
            label.classList.remove('is-placeholder');
            dd.setAttribute('data-value', d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()));
            dd.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
          });
        })(cellDate);
        grid.appendChild(btn);
      }
    }

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = dd.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (isOpen) render();
    });

    navs.forEach(function (nav) {
      nav.addEventListener('click', function (e) {
        e.stopPropagation();
        view.setMonth(view.getMonth() + parseInt(nav.getAttribute('data-dir'), 10));
        render();
      });
    });

    document.addEventListener('click', function (e) {
      if (!dd.contains(e.target)) {
        dd.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    render();
  }

  function init() {
    initSelectDropdowns();
    initDatePicker();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
