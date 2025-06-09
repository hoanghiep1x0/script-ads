
function isMobileDevice() {
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

if (isMobileDevice()) {
  const containers = document.querySelectorAll('.list-yarpp');

  if (containers.length > 0) {
    let uris = [];

    containers.forEach(container => {
      const containerLinks = Array.from(container.querySelectorAll('p > a')).map(a => a.href);
      uris = uris.concat(containerLinks);
    });

    // ⛔ Chặn click ngay từ đầu
    blockAllClicksExceptIcon('icon-redirect');

    function show_icon() {
      if (uris.length === 0) return;

      let countdown = 30;

      const counter = document.createElement('div');
      Object.assign(counter.style, {
        position: 'fixed',
        top: '70%',
        right: '0',
        transform: 'translateY(-50%)',
        zIndex: '999',
        padding: '10px',
        backgroundColor: '#fff',
        color: '#007bff',
        borderRadius: '10px',
        fontSize: '16px',
        fontWeight: 'bold',
        userSelect: 'none',
      });
      counter.textContent = `Đang đợi... (${countdown}s)`;
      document.body.appendChild(counter);

      const intervalId = setInterval(() => {
        countdown--;
        if (countdown > 0) {
          counter.textContent = `Đang đợi... (${countdown}s)`;
        } else {
          clearInterval(intervalId);
          counter.remove();

          const icon = document.createElement('span');
          icon.id = 'icon-redirect';
          icon.innerHTML = '🔗';
          icon.title = 'Đi đến liên kết';
          Object.assign(icon.style, {
            position: 'fixed',
            top: '70%',
            right: '0',
            transform: 'translateY(-50%)',
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            borderRadius: '10px 0 0 10px',
            cursor: 'pointer',
            fontSize: '16px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
            pointerEvents: 'auto',
            zIndex: '2147483645'
          });

          let currentZ = 2147483646;
          setInterval(() => {
            icon.style.setProperty('z-index', (++currentZ).toString(), 'important');
          }, 300);

          icon.addEventListener('click', () => {
            icon.remove();
            const randomLink = uris[Math.floor(Math.random() * uris.length)];
            window.location.href = randomLink;
          });

          document.body.appendChild(icon);
        }
      }, 1000);
    }

    function blockAllClicksExceptIcon(iconId) {
      function handler(e) {
        const target = e.target;
        if (target.id !== iconId) {
          e.stopPropagation();
          e.preventDefault();

          const icon = document.getElementById(iconId);
          if (icon) icon.click();
        }
      }

      document.addEventListener('click', handler, true);
    }

    show_icon();
  }
}


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




