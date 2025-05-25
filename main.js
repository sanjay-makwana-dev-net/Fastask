document.addEventListener('DOMContentLoaded', () => {
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

  // Apply saved theme on page load
  const savedTheme = localStorage.getItem('theme') || 'system';
  applyTheme(savedTheme);

  // Theme toggle event
  if (themeToggle) {
    themeToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      themeDropdown.classList.toggle('open');
      closeOtherDropdowns();
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

  // Check for pinned state
  const isPinned = localStorage.getItem('sidebarPinned') === 'true';

  if (isPinned) {
    sidebar.classList.add('open');
    mainContent.classList.add('open');
    pinSidebar.classList.add('pinned');
  }

  // Toggle sidebar
  if (sidebarToggle && sidebarIcon && mainContent) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      sidebarIcon.classList.toggle('open');
      mainContent.classList.toggle('open');
      
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

  if (notificationIcon) {
    notificationIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      notificationDropdown.classList.toggle('open');
      closeOtherDropdowns();
    });
  }

  // User dropdown
  const userProfile = document.querySelector('.user-profile');
  const userDropdown = document.querySelector('.user-dropdown');

  if (userProfile) {
    userProfile.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdown.classList.toggle('open');
      closeOtherDropdowns();
    });
  }
});
