document.addEventListener('DOMContentLoaded', () => {
  // Hide loader when DOM is fully loaded
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('loader-hidden');
      // Optional: Remove loader from DOM after animation for performance
      loader.addEventListener('transitionend', () => {
        loader.remove();
      });
    }, 1000);
  }

  // Theme Functionality
  const floatingThemeToggleWrapper = document.querySelector('.floating-theme-toggle-wrapper');
  const themeToggle = document.querySelector('#floating-theme-toggle');
  const themeDropdown = document.querySelector('.theme-dropdown');
  const themeOptions = document.querySelectorAll('.theme-option');

  // Function to apply the selected theme
  function applyTheme(theme) {
    // Remove existing theme classes
    document.documentElement.classList.remove('light', 'dark');

    // Apply the new theme
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.add(prefersDark ? 'dark' : 'light');
    } else {
      document.documentElement.classList.add(theme);
    }

    // Save theme preference to local storage
    localStorage.setItem('theme', theme);
    // Update active indicator on theme options
    updateActiveThemeIndicator();
  }

  // Function to update the visual indicator for the active theme
  function updateActiveThemeIndicator() {
    const currentTheme = localStorage.getItem('theme') || 'system';
    themeOptions.forEach(option => {
      // Toggle 'active' class based on the current theme
      option.classList.toggle('active', option.dataset.theme === currentTheme);
      const checkIcon = option.querySelector('.check-icon');
      if (checkIcon) {
        // Show/hide check icon based on active theme
        checkIcon.classList.toggle('hidden', option.dataset.theme !== currentTheme);
      }
    });
  }

  // Function to close other open dropdowns
  function closeOtherDropdowns(excludeDropdown) {
    const dropdowns = [notificationDropdown, userDropdown, themeDropdown]; // Include themeDropdown for consistent closing
    dropdowns.forEach(dropdown => {
      if (dropdown && dropdown !== excludeDropdown) {
        dropdown.classList.remove('open');
      }
    });
  }

  // Apply saved theme on page load
  const savedTheme = localStorage.getItem('theme') || 'system';
  applyTheme(savedTheme);

  // Theme toggle (main sun icon) behavior
  if (themeToggle && themeDropdown) {
    // Click event to toggle the theme dropdown
    themeToggle.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent document click from immediately closing
      themeDropdown.classList.toggle('open');
      // Close other dropdowns when theme dropdown is opened
      closeOtherDropdowns(themeDropdown);
    });

    // Hover effect for the wrapper to open the theme dropdown
    if (floatingThemeToggleWrapper) {
      floatingThemeToggleWrapper.addEventListener('mouseenter', () => {
        themeDropdown.classList.add('open');
      });
      floatingThemeToggleWrapper.addEventListener('mouseleave', () => {
        themeDropdown.classList.remove('open');
      });
    }
  }

  // Theme option selection
  themeOptions.forEach(option => {
    option.addEventListener('click', () => {
      const theme = option.dataset.theme;
      applyTheme(theme); // Apply the selected theme
      themeDropdown.classList.remove('open'); // Close dropdown after selection
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

  // Function to update sidebar and main content classes based on sidebar state
  function updateSidebarState(isOpen) {
    if (isOpen) {
      sidebar.classList.add('open');
      mainContent.classList.add('md:ml-64'); // Apply margin for desktop
      if (menuPath && closePath) {
        menuPath.classList.add('hidden');
        closePath.classList.remove('hidden');
      }
    } else {
      sidebar.classList.remove('open');
      mainContent.classList.remove('md:ml-64'); // Remove margin for desktop
      if (menuPath && closePath) {
        menuPath.classList.remove('hidden');
        closePath.classList.add('hidden');
      }
    }
  }

  // Function to handle sidebar visibility based on screen size
  function handleSidebarVisibility() {
    if (window.innerWidth >= 768) { // md breakpoint and above
      // On desktop, sidebar is always "open" (visible) or pinned
      sidebar.classList.add('open');
      mainContent.classList.add('md:ml-64');
      sidebarToggle.classList.add('hidden'); // Hide toggle button on desktop
      pinSidebar.classList.remove('hidden'); // Show pin button on desktop
      // If pinned, ensure correct icon is shown
      if (pinSidebar.classList.contains('pinned')) {
        if (menuPath && closePath) {
          menuPath.classList.add('hidden');
          closePath.classList.remove('hidden');
        }
      } else {
        if (menuPath && closePath) {
          menuPath.classList.remove('hidden');
          closePath.classList.add('hidden');
        }
      }
    } else { // Below md breakpoint (mobile)
      // On mobile, sidebar is initially closed, toggle button is visible
      sidebar.classList.remove('open');
      mainContent.classList.remove('md:ml-64'); // No margin on mobile
      sidebarToggle.classList.remove('hidden'); // Show toggle button on mobile
      pinSidebar.classList.add('hidden'); // Hide pin button on mobile
      if (menuPath && closePath) {
        menuPath.classList.remove('hidden');
        closePath.classList.add('hidden');
      }
    }
  }

  // Initial check for pinned state and sidebar visibility on load
  const isPinned = localStorage.getItem('sidebarPinned') === 'true';
  if (isPinned && window.innerWidth >= 768) {
    updateSidebarState(true);
    pinSidebar.classList.add('pinned');
  } else {
    updateSidebarState(false); // Ensure sidebar is closed by default on mobile or if not pinned
  }
  handleSidebarVisibility(); // Apply initial visibility based on screen size

  // Toggle sidebar on button click
  if (sidebarToggle && sidebarIcon && mainContent && menuPath && closePath) {
    sidebarToggle.addEventListener('click', () => {
      const isOpen = !sidebar.classList.contains('open');
      updateSidebarState(isOpen);

      // Unpin when manually toggling on mobile
      if (window.innerWidth < 768) {
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

      // When pinning, ensure sidebar is open
      if (isNowPinned) {
        updateSidebarState(true);
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
      closeOtherDropdowns(notificationDropdown); // Close others

      // Add animation class
      if (notificationDropdown.classList.contains('open')) {
        notificationIcon.classList.add('animate-bounce');
        setTimeout(() => {
          notificationIcon.classList.remove('animate-bounce');
        }, 1000);
      }
    });
  }

  // User dropdown
  const userProfile = document.querySelector('.user-profile');
  const userDropdown = document.querySelector('.user-dropdown');

  if (userProfile) {
    userProfile.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdown.classList.toggle('open');
      closeOtherDropdowns(userDropdown); // Close others
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
    if (themeDropdown && floatingThemeToggleWrapper && !floatingThemeToggleWrapper.contains(e.target) && themeDropdown.classList.contains('open')) {
      themeDropdown.classList.remove('open');
    }

    // Close sidebar when clicking outside on mobile
    if (sidebar && sidebarToggle && !sidebar.contains(e.target) && !sidebarToggle.contains(e.target) && sidebar.classList.contains('open') && window.innerWidth < 768) {
      updateSidebarState(false);
    }
  });

  // Important: Add a resize listener to handle cases where screen size changes (e.g., rotating device)
  window.addEventListener('resize', () => {
    handleSidebarVisibility(); // Re-evaluate sidebar visibility on resize
    // If sidebar was open on mobile and resized to desktop, ensure it's open
    if (window.innerWidth >= 768 && sidebar.classList.contains('open')) {
      mainContent.classList.add('md:ml-64');
    } else if (window.innerWidth < 768) {
      mainContent.classList.remove('md:ml-64'); // Ensure no margin on mobile
    }
  });
});
