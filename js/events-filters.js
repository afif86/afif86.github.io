// Events page filters: Type select dropdown (same behaviour as the classes page)
// and a custom date-RANGE picker (select a start and end day).
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

  function initDateRangePicker() {
    var dd = document.querySelector('.daterange-dropdown');
    if (!dd) return;
    var toggle = dd.querySelector('.daterange-dd-toggle');
    var label = dd.querySelector('.daterange-dd-label');
    var title = dd.querySelector('.daterange-dd-title');
    var grid = dd.querySelector('.daterange-dd-grid');
    var navs = dd.querySelectorAll('.daterange-dd-nav');
    var clearBtn = dd.querySelector('.daterange-dd-clear');

    var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    var today = new Date();
    var view = new Date(today.getFullYear(), today.getMonth(), 1);
    var start = null; // Date
    var end = null;   // Date

    function pad(n) { return n < 10 ? '0' + n : '' + n; }
    function fmt(d) { return pad(d.getDate()) + '.' + pad(d.getMonth() + 1) + '.' + d.getFullYear(); }
    function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
    function ymd(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime(); }
    function sameDay(a, b) { return a && b && ymd(a) === ymd(b); }

    function updateLabel() {
      if (start && end) {
        label.textContent = fmt(start) + ' – ' + fmt(end);
        label.classList.remove('is-placeholder');
        dd.setAttribute('data-start', iso(start));
        dd.setAttribute('data-end', iso(end));
      } else if (start) {
        label.textContent = fmt(start) + ' – …';
        label.classList.remove('is-placeholder');
        dd.setAttribute('data-start', iso(start));
        dd.setAttribute('data-end', '');
      } else {
        label.textContent = 'Start – End';
        label.classList.add('is-placeholder');
        dd.setAttribute('data-start', '');
        dd.setAttribute('data-end', '');
      }
    }

    function pick(d) {
      if (!start || (start && end)) {
        // begin a new range
        start = d;
        end = null;
      } else {
        // completing the range
        if (ymd(d) < ymd(start)) {
          end = start;
          start = d;
        } else {
          end = d;
        }
      }
      updateLabel();
      render();
    }

    function render() {
      title.textContent = MONTHS[view.getMonth()] + ' ' + view.getFullYear();
      grid.innerHTML = '';
      var year = view.getFullYear();
      var month = view.getMonth();
      var first = new Date(year, month, 1);
      var startOffset = (first.getDay() + 6) % 7; // Mon=0..Sun=6
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

        if (sameDay(cellDate, start)) btn.classList.add('is-start');
        if (sameDay(cellDate, end)) btn.classList.add('is-end');
        if (start && end && ymd(cellDate) > ymd(start) && ymd(cellDate) < ymd(end)) {
          btn.classList.add('is-in-range');
        }

        (function (d) {
          btn.addEventListener('click', function (e) {
            e.stopPropagation();
            pick(d);
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

    if (clearBtn) {
      clearBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        start = null;
        end = null;
        updateLabel();
        render();
      });
    }

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
    initDateRangePicker();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
