// ===========================================
// PHẦN 1: XỬ LÝ GIAO DIỆN SIDEBAR + CHẾ ĐỘ DARK MODE + TÌM KIẾM MENU
// ===========================================

// Lấy các phần tử DOM cần thiết
const body = document.querySelector("body"),
    sidebar = body.querySelector(".sidebar"),
    toggle = body.querySelector(".toggle"),
    searchBtn = body.querySelector(".search-box"), // Phần này không sử dụng trong JS hiện tại
    modeSwitch = body.querySelector(".toggle-switch"),
    modeText = body.querySelector(".mode-text"), // Phần này cần một phần tử HTML có class "mode-text"
    searchInput = document.querySelector('.search-box input'),
    menuLinks = document.querySelectorAll('.menu-links .nav-link');

// Xử lý sự kiện khi click vào nút toggle sidebar
toggle.addEventListener("click", () => {
    sidebar.classList.toggle("close"); // Thêm/Xóa class "close" cho sidebar
});

// Xử lý sự kiện khi click vào nút chuyển đổi Dark mode / Light mode
modeSwitch.addEventListener("click", () => {
    body.classList.toggle("dark"); // Thêm/Xóa class "dark" cho thẻ body

    // Cập nhật văn bản hiển thị chế độ (Light mode/Dark mode)
    if (body.classList.contains("dark")) {
        modeText.innerText = "Light mode";
    } else {
        modeText.innerText = "Dark mode";
    }
});

// Xử lý sự kiện khi người dùng nhập vào ô tìm kiếm menu
searchInput.addEventListener('input', function() {
    const value = this.value.toLowerCase(); // Lấy giá trị nhập vào và chuyển về chữ thường

    // Lặp qua từng liên kết trong menu và ẩn/hiện dựa trên kết quả tìm kiếm
    menuLinks.forEach(link => {
        const text = link.textContent.toLowerCase(); // Lấy nội dung văn bản của liên kết và chuyển về chữ thường
        link.style.display = text.includes(value) ? '' : 'none'; // Nếu tìm thấy, hiển thị; ngược lại, ẩn
    });
});