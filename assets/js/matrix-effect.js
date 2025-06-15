// js/matrix-effect.js
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

// Đặt kích thước canvas bằng kích thước cửa sổ trình duyệt
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Các ký tự sẽ được hiển thị (Katakana)
const symbols = 'アァカサタナハマヤラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨロヲゴゾドボポヴッン';
const fontSize = 16;
let columns = Math.ceil(canvas.width / fontSize); // Số cột ký tự, có thể thay đổi
const drops = []; // Mảng để theo dõi vị trí y của mỗi cột

// Khởi tạo vị trí ban đầu của các "giọt" ký tự
for (let x = 0; x < columns; x++) {
    drops[x] = 1; // Bắt đầu từ hàng đầu tiên
}

function drawMatrix() {
    // Làm mờ canvas từng bước một để tạo hiệu ứng "rơi" của ma trận
    // (0,0,0,0.05) là màu đen với độ trong suốt thấp, tạo vết mờ cho ký tự đã rơi
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Cài đặt màu và font cho các ký tự ma trận
    ctx.fillStyle = '#0F0'; // Màu xanh lá cây sáng (màu matrix truyền thống)
    ctx.font = `${fontSize}px monospace`; // Font monospace để các ký tự có chiều rộng bằng nhau

    // Vẽ từng ký tự
    for (let i = 0; i < drops.length; i++) {
        const text = symbols.charAt(Math.floor(Math.random() * symbols.length)); // Chọn ký tự ngẫu nhiên
        ctx.fillText(text, i * fontSize, drops[i] * fontSize); // Vẽ ký tự tại vị trí (x, y)

        // Nếu ký tự đã rơi ra ngoài màn hình (hoặc đạt cuối màn hình)
        // và một xác suất ngẫu nhiên (để tạo sự ngẫu nhiên trong việc khởi tạo lại)
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0; // Đặt lại vị trí y về 0 để nó bắt đầu rơi lại
        }
        drops[i]++; // Tăng vị trí y cho lần vẽ tiếp theo (tạo hiệu ứng rơi xuống)
    }
}

// Chạy animation: Gọi hàm drawMatrix mỗi 33ms (khoảng 30 khung hình/giây)
setInterval(drawMatrix, 33);

// Xử lý khi cửa sổ trình duyệt thay đổi kích thước
// Cần cập nhật kích thước canvas và số cột để hiệu ứng không bị lỗi
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Cập nhật lại số cột ký tự
    columns = Math.ceil(canvas.width / fontSize);
    // Điều chỉnh mảng drops để phù hợp với số cột mới
    if (columns > drops.length) {
        // Nếu tăng số cột, thêm các cột mới vào mảng
        for (let x = drops.length; x < columns; x++) {
            drops[x] = 1;
        }
    } else if (columns < drops.length) {
        // Nếu giảm số cột, cắt bớt mảng
        drops.length = columns;
    }
});