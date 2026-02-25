/**
 * Toast Notification Utility
 * Usage: showToast('message', 'success') or showToast('message', 'error')
 * Include this script and call showToast() from any page.
 */

(function () {
    // Ensure toast container exists
    function getToastContainer() {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }
        return container;
    }

    /**
     * Show a toast notification
     * @param {string} message - The message to display
     * @param {string} type - 'success' (green) or 'error' (red)
     * @param {number} duration - Auto-dismiss time in ms (default 3000)
     */
    function showToast(message, type = 'success', duration = 3000) {
        const container = getToastContainer();

        const toast = document.createElement('div');
        toast.className = `custom-toast custom-toast-${type}`;

        const icon = type === 'success'
            ? '<i class="fas fa-check-circle toast-icon"></i>'
            : '<i class="fas fa-exclamation-circle toast-icon"></i>';

        toast.innerHTML = `
            ${icon}
            <span class="toast-message">${message}</span>
            <button class="toast-close" aria-label="Close">&times;</button>
        `;

        container.appendChild(toast);

        // Trigger slide-in animation
        requestAnimationFrame(() => {
            toast.classList.add('toast-show');
        });

        // Close button
        toast.querySelector('.toast-close').addEventListener('click', () => {
            dismissToast(toast);
        });

        // Auto dismiss
        if (duration > 0) {
            setTimeout(() => dismissToast(toast), duration);
        }
    }

    function dismissToast(toast) {
        if (toast.classList.contains('toast-hiding')) return;
        toast.classList.add('toast-hiding');
        toast.addEventListener('animationend', () => toast.remove());
    }

    // Expose globally so any script can use it
    window.showToast = showToast;
})();
