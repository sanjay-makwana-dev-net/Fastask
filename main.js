document.addEventListener('DOMContentLoaded', () => {
  // Hide loader when DOM is fully loaded
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => { //
      loader.classList.add('loader-hidden'); //
      // Optional: Remove loader from DOM after animation for performance
      loader.addEventListener('transitionend', () => { //
        loader.remove(); //
      });
    }, 1000); // 5000 milliseconds = 5 seconds
  }

  // Theme Functionality
  const themeToggle = document.querySelector('.theme-toggle');
  const themeDropdown = document.querySelector('.theme-dropdown');
  const themeOptions = document.querySelectorAll('.theme-option');

  function applyTheme(theme) {
    document.documentElement.classList.remove('light', 'dark');

    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.add(prefersDark ? 'dark' : 'light');
    } else {
      document.documentElement.classList.add(theme);
    }

    localStorage.setItem('theme', theme);
    updateActiveThemeIndicator();
  }

  function updateActiveThemeIndicator() {
    const currentTheme = localStorage.getItem('theme') || 'system';
    themeOptions.forEach(option => {
      option.classList.toggle('active', option.dataset.theme === currentTheme);
      const checkIcon = option.querySelector('.check-icon');
      if (checkIcon) {
        checkIcon.classList.toggle('hidden', option.dataset.theme !== currentTheme);
      }
    });
  }

  function closeOtherDropdowns(excludeDropdown) {
    const dropdowns = [themeDropdown, notificationDropdown, userDropdown];
    dropdowns.forEach(dropdown => {
      if (dropdown !== excludeDropdown && dropdown) {
        dropdown.classList.remove('open');
      }
    });
  }

  // Apply saved theme on page load
  const savedTheme = localStorage.getItem('theme') || 'system';
  applyTheme(savedTheme);

  // Theme toggle event
  if (themeToggle) {
    themeToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      themeDropdown.classList.toggle('open');
      closeOtherDropdowns(themeDropdown);
    });
  }

  // Theme option selection
  themeOptions.forEach(option => {
    option.addEventListener('click', () => {
      const theme = option.dataset.theme;
      applyTheme(theme);
      themeDropdown.classList.remove('open');
    });
  });

  // Sidebar Functionality
  const sidebar = document.querySelector('#sidebar');
  const sidebarToggle = document.querySelector('#sidebar-toggle');
  const sidebarIcon = document.querySelector('#sidebar-icon');
  const mainContent = document.querySelector('#main-content');
  const pinSidebar = document.querySelector('#pin-sidebar');
  const menuPath = document.querySelector('.menu-path');
  const closePath = document.querySelector('.close-path');

  // Check for pinned state
  const isPinned = localStorage.getItem('sidebarPinned') === 'true';
  if (isPinned) {
    sidebar.classList.add('open');
    mainContent.classList.add('open');
    pinSidebar.classList.add('pinned');
    // Ensure correct icon is shown if pinned on load
    if (menuPath && closePath) {
        menuPath.classList.add('hidden');
        closePath.classList.remove('hidden');
    }
  }

  // Toggle sidebar
  if (sidebarToggle && sidebarIcon && mainContent && menuPath && closePath) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      sidebarIcon.classList.toggle('open');
      mainContent.classList.toggle('open');
      menuPath.classList.toggle('hidden'); // Hide menu icon
      closePath.classList.toggle('hidden'); // Show close icon

      // Unpin when manually toggling
      if (!sidebar.classList.contains('open')) {
        pinSidebar.classList.remove('pinned');
        localStorage.setItem('sidebarPinned', 'false');
      }
    });
  }

  // Pin sidebar
  if (pinSidebar) {
    pinSidebar.addEventListener('click', (e) => {
      e.stopPropagation();
      pinSidebar.classList.toggle('pinned');
      const isNowPinned = pinSidebar.classList.contains('pinned');
      localStorage.setItem('sidebarPinned', isNowPinned.toString());

      if (isNowPinned) {
        sidebar.classList.add('open');
        mainContent.classList.add('open');
      }
    });
  }

  // Notification dropdown
  const notificationIcon = document.querySelector('.notification-icon');
  const notificationDropdown = document.querySelector('.notification-dropdown');


  // User dropdown
  const userProfile = document.querySelector('.user-profile');
  const userDropdown = document.querySelector('.user-dropdown');

  if (userProfile) {
    userProfile.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdown.classList.toggle('open');
      closeOtherDropdowns(userDropdown);
    });
  }

  // Close dropdowns and sidebar when clicking outside
  document.addEventListener('click', (e) => {
    // Close notification dropdown
    if (notificationDropdown && notificationIcon && !notificationDropdown.contains(e.target) && !notificationIcon.contains(e.target)) {
      notificationDropdown.classList.remove('open');
    }

    // Close user dropdown
    if (userDropdown && userProfile && !userDropdown.contains(e.target) && !userProfile.contains(e.target)) {
      userDropdown.classList.remove('open');
    }

    // Close theme dropdown
    if (themeDropdown && themeToggle && !themeDropdown.contains(e.target) && !themeToggle.contains(e.target)) {
      themeDropdown.classList.remove('open');
    }

    // Close sidebar when clicking outside on mobile
    // Check if the click was outside the sidebar and not on the toggle button
    if (sidebar && sidebarToggle && !sidebar.contains(e.target) && !sidebarToggle.contains(e.target) && sidebar.classList.contains('open')) {
        // Check for mobile screen size, e.g., max-width 640px
        if (window.innerWidth <= 640) {
            sidebar.classList.remove('open');
            mainContent.classList.remove('open');
            sidebarIcon.classList.remove('open'); // Toggle icon back
            if (menuPath && closePath) {
                menuPath.classList.remove('hidden'); // Show menu icon
                closePath.classList.add('hidden'); // Hide close icon
            }
        }
    }
  });

  // Add animation to notification icon when dropdown is open
  if (notificationIcon) {
    notificationIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      notificationDropdown.classList.toggle('open');
      closeOtherDropdowns(notificationDropdown);

      // Add animation class
      if (notificationDropdown.classList.contains('open')) {
        notificationIcon.classList.add('animate-bounce');
        setTimeout(() => {
          notificationIcon.classList.remove('animate-bounce');
        }, 1000);
      }
    });
  }

  // Important: Add a resize listener to handle cases where screen size changes (e.g., rotating device)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 640 && sidebar && sidebar.classList.contains('open')) {
        // If sidebar is open and screen resized to desktop, close it gracefully
        sidebar.classList.remove('open');
        if (mainContent) mainContent.classList.remove('open'); // Ensure mainContent exists
        if (sidebarIcon) sidebarIcon.classList.remove('open'); // Ensure sidebarIcon exists
        if (menuPath && closePath) { // Ensure paths exist
            menuPath.classList.remove('hidden'); // Show menu icon
            closePath.classList.add('hidden'); // Hide close icon
        }
        // Also unpin if it was pinned and now on desktop
        if (pinSidebar && pinSidebar.classList.contains('pinned')) {
            pinSidebar.classList.remove('pinned');
            localStorage.setItem('sidebarPinned', 'false');
        }
    }
  });
});
