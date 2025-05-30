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
                const hasContent = el && el.innerHTML.trim().length > 0;
                if (hasContent) {
                    found = true;
                }
            });
            if (found) {
                // clearInterval(interval); // Bỏ comment nếu bạn muốn dừng lại sau khi tìm thấy một lần
                callback();
            }
        }, 200);
    }

    function disableClicksOnElements() {
        const elements = document.querySelectorAll('[id^="aswift_"][id$="_host"]');
        if (elements.length === 0) return;

        elements.forEach((target) => {
            // Đảm bảo phần tử tồn tại và có kích thước
            if (!target || target.offsetWidth === 0 || target.offsetHeight === 0) return;

            // *** Đây là dòng quan trọng để CHẶN click ***
            target.style.pointerEvents = 'none';
            target.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
            // Thay đổi con trỏ chuột để người dùng biết không thể click
            target.style.cursor = 'not-allowed'; 
        });
    }

    function observeContentChanges() {
        const observer = new MutationObserver(() => {
            disableClicksOnElements(); // Gọi lại hàm chặn click khi có thay đổi DOM
        });

        const startObserving = () => {
            const targets = document.querySelectorAll('[id^="aswift_"][id$="_host"]');
            targets.forEach((el) => {
                observer.observe(el, {
                    childList: true,
                    subtree: true,
                    attributes: true // Quan sát cả sự thay đổi thuộc tính
                });
            });
        };

        // Quan sát sự thay đổi trong DOM trong trường hợp các phần tử mục tiêu được thêm vào sau
        const globalObserver = new MutationObserver(() => {
            startObserving(); // Kiểm tra lại các phần tử phù hợp mới
            disableClicksOnElements(); // Đảm bảo áp dụng cho các phần tử mới
        });

        globalObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Cố gắng quan sát ban đầu các phần tử đã tồn tại
        startObserving();
    }

    window.addEventListener('load', () => {
         if (!isMobile()) return; // Bỏ comment nếu bạn chỉ muốn áp dụng trên thiết bị di động

        waitForElementWithContent(() => {
            disableClicksOnElements();
        });
        observeContentChanges();
    });
