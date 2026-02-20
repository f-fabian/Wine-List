// Patch for Electron input freeze bug
(function() {
    // Override closeModal to ensure input is accessible
    const oldCloseModal = closeModal;
    window.closeModal = function() {
        modal.classList.remove('open');
        productForm.reset();
        setTimeout(function() {
            input.disabled = false;
            input.style.opacity = '1';
            input.style.pointerEvents = 'auto';
            input.focus();
        }, 50);
    };
    
    // Re-attach listeners
    if (cancelBtn) {
        cancelBtn.removeEventListener('click', oldCloseModal);
        cancelBtn.addEventListener('click', closeModal);
    }
    if (closeBtn) {
        closeBtn.removeEventListener('click', oldCloseModal);
        closeBtn.addEventListener('click', closeModal);
    }
})();
