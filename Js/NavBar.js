// navbar.js - Breadcrumb and navbar functionality
document.addEventListener('DOMContentLoaded', () => {
    initBreadcrumb();
});

function initBreadcrumb() {
    const breadcrumbList = document.getElementById('breadcrumb-list');
    const breadcrumbCurrent = document.getElementById('breadcrumb-current');
    if (!breadcrumbList || !breadcrumbCurrent) return;

    // Get the current page name from the URL
    const path = window.location.pathname;
    const fileName = path.split('/').pop() || 'home.html';

    // Remove extension and clean up
    let pageName = fileName.replace('.html', '').replace('.htm', '');

    // Capitalize and format the page name nicely
    pageName = pageName
        .replace(/[-_]/g, ' ')        // Replace dashes/underscores with spaces
        .replace(/\b\w/g, c => c.toUpperCase()); // Capitalize first letter of each word

    // Default to "Home" if root or index
    if (!pageName || pageName === 'Index' || pageName === '') {
        pageName = 'Home';
    }

    // Update the breadcrumb
    breadcrumbCurrent.textContent = pageName;

    // Highlight the active nav link based on the current page
    const navLinks = document.querySelectorAll('.navbar-bottom .nav-link');
    navLinks.forEach(link => {
        const linkText = link.textContent.trim().toLowerCase();
        if (linkText === pageName.toLowerCase()) {
            link.classList.add('active');
            link.style.color = 'var(--primary-green)';
        } else if (link.classList.contains('active') && linkText !== pageName.toLowerCase()) {
            // Only remove active if it's not the matching link
            // Keep Home green by default
        }
    });
}
