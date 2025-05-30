function isMobile() {
    const isMobileUA = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isSmallScreen = window.innerWidth <= 768;
    return isMobileUA || isSmallScreen;
}

function waitForElementWithContent(callback) {
    const interval = setInterval(() => {
        const elements = document.querySelectorAll('[id^="aswift_"][id$="_host"]');
        let found = false;
        elements.forEach(el => {
            const isVisible = el && el.offsetWidth > 0 && el.offsetHeight > 0;
            if (isVisible) {
                found = true;
            }
        });
        if (found) {
            //clearInterval(interval);
            callback();
        }
    }, 500);
}

function createOverlayBlocks() {
    const elements = document.querySelectorAll('[id^="aswift_"][id$="_host"]');
    if (elements.length === 0) return;

    elements.forEach((target) => {
        if (!target || target.offsetWidth === 0 || target.offsetHeight === 0) return;
        const overlayId = `overlay_${target.id}`;
        if (document.getElementById(overlayId)) return;
        const rect = target.getBoundingClientRect();
        const overlay = document.createElement('div');
        overlay.id = overlayId;
        overlay.style.position = 'absolute';
        overlay.style.left = `${rect.left + window.scrollX}px`;
        overlay.style.top = `${rect.top + window.scrollY}px`;
        overlay.style.width = `${rect.width}px`;
        overlay.style.height = `${rect.height}px`;
        overlay.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
        overlay.style.zIndex = '9999';
        overlay.style.pointerEvents = 'auto';
        overlay.style.cursor = 'not-allowed';
        document.body.appendChild(overlay);
    });
}

window.addEventListener('load', () => {
    if (!isMobile()) return;
    waitForElementWithContent(() => {
        createOverlayBlocks();
    });
});
