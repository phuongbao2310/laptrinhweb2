// js/script.js
document.addEventListener('DOMContentLoaded', () => {
    // Hiệu ứng Fade-in cho các section khi cuộn
    const sectionCards = document.querySelectorAll('.section-card');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // Khi 10% của phần tử hiển thị, kích hoạt
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Ngừng theo dõi sau khi đã visible
            }
        });
    }, observerOptions);

    sectionCards.forEach(card => {
        observer.observe(card);
    });

    // Hiệu ứng cuộn mượt cho Navbar
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });

            // Cập nhật trạng thái active của navbar (tùy chọn)
            document.querySelectorAll('.nav-links li a').forEach(item => {
                item.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    // Cập nhật trạng thái active của navbar khi cuộn trang
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - (window.innerHeight / 3); // Điều chỉnh điểm kích hoạt
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-links li a').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').includes(current)) {
                item.classList.add('active');
            }
        });
    });

    // Đảm bảo mục đầu tiên active khi tải trang
    if (document.querySelector('.nav-links li a[href="#about"]')) {
        document.querySelector('.nav-links li a[href="#about"]').classList.add('active');
    }
});