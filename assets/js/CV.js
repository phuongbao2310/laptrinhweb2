document.addEventListener('DOMContentLoaded', () => {
    // =======================================================================
    // 1. KHAI BÁO CÁC PHẦN TỬ HTML CẦN THIẾT
    // =======================================================================
    const cvNameElement = document.getElementById('cvName');
    const taglineElement = document.getElementById('tagline-running-effect');
    const contactAddressElement = document.getElementById('contactAddress');
    const contactPhoneElement = document.getElementById('contactPhone');
    const contactEmailElement = document.getElementById('contactEmail'); // Đây là thẻ <a>
    const aboutMeContentElement = document.getElementById('aboutMeContent');

    // Các phần tử cho modal chỉnh sửa
    const editCvIcon = document.getElementById('editCvIcon');
    const editCvModal = document.getElementById('editCvModal');
    // Kiểm tra editCvModal trước khi querySelector để tránh lỗi nếu modal chưa được tải
    const closeButton = editCvModal ? editCvModal.querySelector('.close-button') : null;
    const saveBtn = editCvModal ? editCvModal.querySelector('.save-btn') : null; // Đã sửa từ .save-button
    const cancelBtn = editCvModal ? editCvModal.querySelector('.cancel-btn') : null; // Đã sửa từ .cancel-button
    const editCvForm = document.getElementById('editCvForm');

    // Các trường input trong form chỉnh sửa
    const editNameInput = document.getElementById('editName');
    const editTaglineInput = document.getElementById('editTagline');
    const editPhoneInput = document.getElementById('editPhone');
    const editEmailInput = document.getElementById('editEmail');
    const editAddressInput = document.getElementById('editAddress');
    const editAboutMeTextarea = document.getElementById('editAboutMe');

    // Theme switch
    const themeToggle = document.getElementById('checkbox');

    // =======================================================================
    // 2. CHỨC NĂNG LƯU/TẢI DỮ LIỆU CV VÀO LOCAL STORAGE
    // =======================================================================

    /**
     * Lưu dữ liệu CV hiện tại vào Local Storage.
     */
    function saveCvData() {
        const cvData = {
            name: cvNameElement ? cvNameElement.textContent : '',
            tagline: taglineElement ? taglineElement.textContent : '',
            phone: contactPhoneElement ? contactPhoneElement.textContent : '',
            email: contactEmailElement ? contactEmailElement.textContent : '',
            address: contactAddressElement ? contactAddressElement.textContent : '',
            aboutMe: aboutMeContentElement ? aboutMeContentElement.textContent : ''
        };
        try {
            localStorage.setItem('cvData', JSON.stringify(cvData));
            console.log('Dữ liệu CV đã được lưu.');
        } catch (e) {
            console.error('Lỗi khi lưu dữ liệu vào Local Storage:', e);
        }
    }

    /**
     * Tải dữ liệu CV từ Local Storage và cập nhật vào trang.
     */
    function loadCvData() {
        try {
            const savedData = localStorage.getItem('cvData');
            if (savedData) {
                const cvData = JSON.parse(savedData);
                if (cvNameElement) cvNameElement.textContent = cvData.name || '';
                if (taglineElement) taglineElement.textContent = cvData.tagline || '';
                if (contactPhoneElement) contactPhoneElement.textContent = cvData.phone || '';
                // Email: Cập nhật cả textContent và href
                if (contactEmailElement) {
                    contactEmailElement.textContent = cvData.email || '';
                    contactEmailElement.href = `mailto:${cvData.email}`;
                }
                if (contactAddressElement) contactAddressElement.textContent = cvData.address || '';
                if (aboutMeContentElement) aboutMeContentElement.textContent = cvData.aboutMe || '';
                console.log('Dữ liệu CV đã được tải.');
            }
        } catch (e) {
            console.error('Lỗi khi tải dữ liệu từ Local Storage:', e);
        }
    }

    // =======================================================================
    // 3. CHỨC NĂNG CHUYỂN ĐỔI CHẾ ĐỘ SÁNG/TỐI (THEME SWITCH)
    // =======================================================================

    if (themeToggle) {
        // Tải thiết lập theme đã lưu từ Local Storage
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') { // CSS của bạn dùng class 'dark-theme'
            document.body.classList.add('dark-theme');
            themeToggle.checked = true;
        } else {
            document.body.classList.remove('dark-theme');
            themeToggle.checked = false;
        }

        // Gắn sự kiện thay đổi cho nút chuyển đổi
        themeToggle.addEventListener('change', () => {
            if (themeToggle.checked) {
                document.body.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.classList.remove('dark-theme');
                localStorage.setItem('theme', 'light');
            }
        });
    } else {
        console.warn("Cảnh báo: Không tìm thấy nút chuyển đổi chủ đề (ID: checkbox). Chức năng theme switch sẽ không hoạt động.");
    }

    // =======================================================================
    // 4. HIỆU ỨNG GÕ CHỮ CHO TAGLINE
    // =======================================================================

    let currentTaglineText = '';
    let taglineCharIndex = 0;
    let taglineTypingTimeout;

    /**
     * Bắt đầu hiệu ứng gõ chữ cho tagline.
     * @param {string} textToAnimate Nội dung tagline cần hiển thị hiệu ứng.
     */
    function startTaglineTypingEffect(textToAnimate) {
        if (!taglineElement) {
            console.warn("Cảnh báo: Không tìm thấy phần tử tagline (ID: tagline-running-effect). Hiệu ứng gõ chữ sẽ không hoạt động.");
            return;
        }

        currentTaglineText = textToAnimate;
        taglineElement.innerHTML = ''; // Xóa nội dung cũ
        taglineCharIndex = 0;

        clearTimeout(taglineTypingTimeout); // Xóa timeout cũ nếu có
        typeNextTaglineChar();
    }

    function typeNextTaglineChar() {
        if (taglineCharIndex < currentTaglineText.length) {
            const charSpan = document.createElement('span');
            charSpan.textContent = currentTaglineText.charAt(taglineCharIndex);
            charSpan.classList.add('char-typing-effect'); // Thêm class để áp dụng animation-delay qua CSS
            taglineElement.appendChild(charSpan);
            
            // Áp dụng animation-delay riêng cho từng ký tự
            charSpan.style.animationDelay = `${taglineCharIndex * 0.05}s`; // 0.05s delay cho mỗi ký tự

            taglineCharIndex++;
            taglineTypingTimeout = setTimeout(typeNextTaglineChar, 50); // Tốc độ gõ chữ giữa các ký tự
        } else {
             // Đảm bảo con trỏ nhấp nháy sau khi gõ xong
            taglineElement.style.borderRight = '2px solid var(--secondary-color)'; 
        }
    }

    // =======================================================================
    // 5. CHỨC NĂNG CHỈNH SỬA THÔNG TIN CV (MODAL)
    // =======================================================================

    /**
     * Mở modal chỉnh sửa và điền dữ liệu hiện tại vào form.
     */
    function openEditModal() {
        if (!editCvModal) {
            console.error('Lỗi: Không tìm thấy modal chỉnh sửa (ID: editCvModal).');
            return;
        }
        
        // Thêm class 'active' để modal hiển thị và áp dụng transition từ CSS
        editCvModal.classList.add('active'); 

        // Điền dữ liệu hiện tại vào các trường input của form
        if (editNameInput && cvNameElement) editNameInput.value = cvNameElement.textContent;
        if (editTaglineInput && taglineElement) editTaglineInput.value = taglineElement.textContent;
        if (editPhoneInput && contactPhoneElement) editPhoneInput.value = contactPhoneElement.textContent;
        // Lấy href và textContent cho email
        if (editEmailInput && contactEmailElement) editEmailInput.value = contactEmailElement.textContent;
        if (editAddressInput && contactAddressElement) editAddressInput.value = contactAddressElement.textContent;
        if (editAboutMeTextarea && aboutMeContentElement) editAboutMeTextarea.value = aboutMeContentElement.textContent;
    }

    /**
     * Ẩn modal chỉnh sửa.
     */
    function closeEditModal() {
        if (editCvModal) {
            editCvModal.classList.remove('active'); // Xóa class 'active' để ẩn modal
        }
    }

    // Gắn sự kiện click cho icon chỉnh sửa
    if (editCvIcon) {
        editCvIcon.addEventListener('click', (event) => {
            event.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ <a>
            openEditModal();
        });
    } else {
        console.warn("Cảnh báo: Không tìm thấy icon chỉnh sửa CV (ID: editCvIcon). Chức năng chỉnh sửa sẽ không hoạt động.");
    }

    // Gắn sự kiện click cho nút đóng (X) trong modal
    if (closeButton) {
        closeButton.addEventListener('click', closeEditModal);
    }

    // Gắn sự kiện click cho nút Hủy (Cancel) trong modal
    if (cancelBtn) { // Đã sửa tên biến từ cancelButton sang cancelBtn
        cancelBtn.addEventListener('click', closeEditModal);
    }

    // Đóng modal khi click ra ngoài vùng nội dung modal
    if (editCvModal) {
        editCvModal.addEventListener('click', function(event) {
            if (event.target === editCvModal) { // Chỉ đóng khi click vào overlay, không phải nội dung modal
                closeEditModal();
            }
        });
    }


    // Gắn sự kiện submit cho form chỉnh sửa
    if (editCvForm) {
        editCvForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Ngăn chặn hành vi mặc định của form (tải lại trang)

            // Cập nhật nội dung CV trên trang bằng dữ liệu từ form
            if (cvNameElement && editNameInput) cvNameElement.textContent = editNameInput.value.trim();
            if (taglineElement && editTaglineInput) {
                const newTagline = editTaglineInput.value.trim();
                taglineElement.textContent = newTagline; // Cập nhật ngay lập tức để lấy text mới
                startTaglineTypingEffect(newTagline); // Chạy lại hiệu ứng với tagline mới
            }
            if (contactPhoneElement && editPhoneInput) contactPhoneElement.textContent = editPhoneInput.value.trim();
            // Cập nhật email: textContent và href
            if (contactEmailElement && editEmailInput) {
                contactEmailElement.textContent = editEmailInput.value.trim();
                contactEmailElement.href = `mailto:${editEmailInput.value.trim()}`;
            }
            if (contactAddressElement && editAddressInput) contactAddressElement.textContent = editAddressInput.value.trim();
            if (aboutMeContentElement && editAboutMeTextarea) aboutMeContentElement.textContent = editAboutMeTextarea.value.trim();

            saveCvData(); // Lưu dữ liệu mới vào Local Storage
            closeEditModal(); // Đóng modal
            alert('Thông tin CV đã được cập nhật!'); // Thông báo cho người dùng
        });
    } else {
        console.warn("Cảnh báo: Không tìm thấy form chỉnh sửa CV (ID: editCvForm). Chức năng lưu dữ liệu sẽ không hoạt động.");
    }

    // =======================================================================
    // 6. CUỘN MƯỢT MÀ CHO THANH ĐIỀU HƯỚNG
    // =======================================================================

    document.querySelectorAll('.cv-nav-icons a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ <a> (nhảy trang)
            const targetId = this.getAttribute('href'); // Lấy ID của section đích (ví dụ: #experience)
            const targetElement = document.querySelector(targetId); // Tìm phần tử đó
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth' // Cuộn mượt mà
                });
            }
        });
    });

    // =======================================================================
    // 7. KHỞI TẠO CÁC CHỨC NĂNG KHI TRANG ĐƯỢC TẢI
    // =======================================================================
    
    // Tải dữ liệu CV đã lưu (nếu có) khi trang load
    loadCvData(); 

    // Khởi tạo hiệu ứng gõ chữ cho tagline với nội dung hiện tại
    // (nội dung này có thể đã được load từ Local Storage)
    if (taglineElement) {
        startTaglineTypingEffect(taglineElement.textContent);
    }
});