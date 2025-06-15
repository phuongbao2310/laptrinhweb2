document.addEventListener('DOMContentLoaded', function() {
    const themeSwitch = document.getElementById('checkbox');
    const body = document.body;
    const toggleSidebarBtn = document.getElementById('toggleSidebarBtn');
    const sidebarNav = document.querySelector('.sidebar-nav');
    const mainContentWrapper = document.querySelector('.main-content-wrapper');

    // Function to set the theme
    function setTheme(isContrastMode) {
        if (isContrastMode) {
            body.classList.add('contrast-mode');
            localStorage.setItem('theme', 'contrast-mode');
        } else {
            body.classList.remove('contrast-mode');
            localStorage.setItem('theme', 'dark-mode');
        }
    }

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'contrast-mode') {
        themeSwitch.checked = true;
        setTheme(true);
    } else {
        // Default to dark mode if no preference or is 'dark-mode'
        themeSwitch.checked = false;
        setTheme(false);
    }

    // Event listener for theme switch
    themeSwitch.addEventListener('change', function() {
        setTheme(this.checked);
    });

    // Sidebar toggle for mobile
    toggleSidebarBtn.addEventListener('click', function() {
        sidebarNav.classList.toggle('active');
        mainContentWrapper.classList.toggle('sidebar-active');
    });

    // Close sidebar when clicking outside on mobile
    mainContentWrapper.addEventListener('click', function(event) {
        if (sidebarNav.classList.contains('active') && !sidebarNav.contains(event.target) && !toggleSidebarBtn.contains(event.target)) {
            sidebarNav.classList.remove('active');
            mainContentWrapper.classList.remove('sidebar-active');
        }
    });

    // Ensure the sidebar is hidden if window resizes above mobile breakpoint while active
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            sidebarNav.classList.remove('active');
            mainContentWrapper.classList.remove('sidebar-active');
        }
    });

    // Add intersection observer for section fade-in effect
    const sectionCards = document.querySelectorAll('.section-card');
    const observerOptions = {
        root: null, // relative to the viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of the item must be visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once it's visible
            }
        });
    }, observerOptions);

    sectionCards.forEach(card => {
        sectionObserver.observe(card);
    });
});