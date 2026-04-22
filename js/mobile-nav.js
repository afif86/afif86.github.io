// Mobile dropdown: handle tap on Services toggle
(function () {
  function initMobileDropdown() {
    if (window.innerWidth > 991) return;
    document.querySelectorAll('.w-nav .w-dropdown-toggle').forEach(function (toggle) {
      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        var dropdown = toggle.closest('.w-dropdown');
        var list = dropdown && dropdown.querySelector('.w-dropdown-list');
        if (\!list) return;
        var isOpen = list.classList.contains('w--open');
        // Close all other open dropdowns first
        document.querySelectorAll('.w-dropdown-list.w--open').forEach(function (el) {
          el.classList.remove('w--open', 'w--nav-link-open');
          el.style.display = '';
        });
        if (\!isOpen) {
          list.classList.add('w--open');
          list.style.display = 'block';
        }
      });
    });
    // Close when clicking outside
    document.addEventListener('click', function (e) {
      if (\!e.target.closest('.w-dropdown')) {
        document.querySelectorAll('.w-dropdown-list.w--open').forEach(function (el) {
          el.classList.remove('w--open', 'w--nav-link-open');
          el.style.display = '';
        });
      }
    });
  }
  document.addEventListener('DOMContentLoaded', initMobileDropdown);
  window.addEventListener('resize', initMobileDropdown);
})();
