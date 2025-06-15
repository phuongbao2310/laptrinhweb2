// ============================================
// setting.js - Quản lý Cài đặt
// Chứa các chức năng xử lý tương tác trên tab Cài đặt (Settings)
// bao gồm Hồ sơ cá nhân (Profile) và Dự án (Projects).
// ============================================

document.addEventListener('DOMContentLoaded', function() {

    // ============================================
    // PHẦN 1: QUẢN LÝ CÁC TAB CÀI ĐẶT
    // Xử lý chuyển đổi giữa các tab "Profile" và "Projects"
    // ============================================

    const tabs = document.querySelectorAll('.setting-tab'); // Lấy tất cả các nút tab cài đặt
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Xóa trạng thái 'active' khỏi tất cả các tab và nội dung tab
            document.querySelectorAll('.setting-tab').forEach(t => t.classList.remove('active')); // Xóa lớp 'active' khỏi tất cả các tab
            document.querySelectorAll('.setting-tab-content').forEach(c => c.classList.remove('active')); // Xóa lớp 'active' khỏi tất cả các nội dung tab

            // Thêm trạng thái 'active' vào tab và nội dung tab được chọn
            tab.classList.add('active'); // Thêm lớp 'active' vào tab hiện tại
            document.getElementById(`${tab.dataset.tab}-tab`).classList.add('active'); // Thêm lớp 'active' vào nội dung tab tương ứng
        });
    });

    

    // ============================================
    // PHẦN 2: CÀI ĐẶT HỒ SƠ CÁ NHÂN (PROFILE SETTINGS)
    // Xử lý cập nhật thông tin cá nhân và ảnh đại diện.
    // ============================================

    // Xử lý xem trước ảnh đại diện khi chọn tệp
    document.getElementById('home-avatar').addEventListener('change', function(e) {
        const file = e.target.files[0]; // Lấy tệp ảnh đã chọn
        if (file) {
            const reader = new FileReader(); // Tạo đối tượng FileReader để đọc tệp
            reader.onload = function(event) {
                document.getElementById('home-avatar-preview').src = event.target.result; // Cập nhật src của ảnh xem trước
                document.getElementById('home-avatar-preview').style.display = 'block'; // Hiển thị ảnh xem trước
            };
            reader.readAsDataURL(file); // Đọc tệp ảnh dưới dạng URL dữ liệu
        }
    });

    // Đảm bảo ảnh xem trước được hiển thị nếu có ảnh đã tồn tại (từ lần tải trang ban đầu)
    const initialAvatarPreview = document.getElementById('home-avatar-preview'); // Lấy phần tử xem trước ảnh đại diện
    if (initialAvatarPreview && initialAvatarPreview.src && initialAvatarPreview.src !== window.location.href + '/') {
        initialAvatarPreview.style.display = 'block'; // Hiển thị ảnh xem trước nếu có
    } else {
        initialAvatarPreview.style.display = 'none'; // Ẩn nếu không có ảnh
    }

    // Gán sự kiện click cho nút "Save Profile Settings"
    document.getElementById('save-profile').addEventListener('click', saveProfileSettings); // Lắng nghe sự kiện click cho nút lưu hồ sơ

    // Hàm lưu cài đặt hồ sơ cá nhân
    function saveProfileSettings() {
        // Cập nhật tên và mô tả trên trang Home
        document.getElementById('display-name').textContent = document.getElementById('home-name').value; // Cập nhật tên hiển thị
        document.getElementById('display-decs').textContent = document.getElementById('home-desc').value; // Cập nhật mô tả hiển thị

        // Xử lý cập nhật ảnh đại diện
        const avatarFile = document.getElementById('home-avatar').files[0]; // Lấy tệp ảnh đại diện mới
        if (avatarFile) {
            const reader = new FileReader(); // Tạo đối tượng FileReader
            reader.onload = function(event) {
                // Cập nhật ảnh đại diện ở phần Home
                const homeAvatarImg = document.querySelector('.home-avatar img'); // Lấy ảnh đại diện ở phần Home
                if (homeAvatarImg) homeAvatarImg.src = event.target.result; // Cập nhật src ảnh Home

                // Cập nhật ảnh đại diện ở phần About
                const aboutAvatarImg = document.querySelector('.about-avatar-large img'); // Lấy ảnh đại diện ở phần About
                if (aboutAvatarImg) aboutAvatarImg.src = event.target.result; // Cập nhật src ảnh About
            };
            reader.readAsDataURL(avatarFile); // Đọc tệp ảnh
        }

        // Cập nhật thông tin phần "About Me"
        const aboutInfo = document.querySelector('.about-info'); // Lấy phần tử chứa thông tin About
        if (aboutInfo) { // Kiểm tra xem phần tử có tồn tại không
            aboutInfo.innerHTML = `
                <p>${document.getElementById('about-text1').value}</p>
                <p>${document.getElementById('about-text2').value}</p>
                <P>${document.getElementById('about-hobbies').value}</P>
            `;
        }

        console.log('Cài đặt hồ sơ đã được lưu thành công!'); // Ghi log thông báo thành công
        alert('Cài đặt hồ sơ đã được lưu thành công!'); // HIỂN THỊ THÔNG BÁO POP-UP
    }

    // ============================================
    // PHẦN 3: QUẢN LÝ DỰ ÁN (PROJECTS MANAGEMENT)
    // Chức năng thêm, chỉnh sửa, xóa và hiển thị dự án.
    // ============================================

    const projectsContainer = document.getElementById('projects-container'); // Container chứa danh sách project trong tab Settings
    const addProjectBtn = document.getElementById('add-project'); // Nút "Add New Project"
    const projectForm = document.getElementById('project-form'); // Form thêm/chỉnh sửa project
    const saveProjectsBtn = document.getElementById('save-projects'); // Nút "Save All Projects"

    let currentProjectIndex = -1; // Biến theo dõi index của project đang được chỉnh sửa (-1 nếu là project mới)
    let projects = []; // Mảng chứa dữ liệu của tất cả các project

    loadProjects(); // Tải các project hiện có khi trang được tải

    // Gán sự kiện click cho nút "Add New Project"
    addProjectBtn.addEventListener('click', () => {
        currentProjectIndex = -1; // Đặt lại index về -1 để thêm project mới
        resetProjectForm(); // Xóa dữ liệu trong form
        projectForm.style.display = 'block'; // Hiển thị form
    });

    // Gán sự kiện click cho nút "Cancel" trong form project
    document.getElementById('cancel-project').addEventListener('click', () => {
        projectForm.style.display = 'none'; // Ẩn form
    });

    // Gán sự kiện click cho nút "Save Project" (trong form)
    document.getElementById('save-project').addEventListener('click', saveProject); // Lắng nghe sự kiện click cho nút lưu project

    // Gán sự kiện click cho nút "Save All Projects" (ngoài form)
    saveProjectsBtn.addEventListener('click', saveAllProjects); // Lắng nghe sự kiện click cho nút lưu tất cả project

    // Xử lý xem trước ảnh project khi chọn tệp
    document.getElementById('project-image').addEventListener('change', function(e) {
        const file = e.target.files[0]; // Lấy tệp ảnh đã chọn
        if (file) {
            const reader = new FileReader(); // Tạo đối tượng FileReader
            reader.onload = function(event) {
                document.getElementById('project-preview').src = event.target.result; // Cập nhật src của ảnh xem trước
                document.getElementById('project-preview').style.display = 'block'; // Hiển thị ảnh xem trước
            };
            reader.readAsDataURL(file); // Đọc tệp ảnh
        }
    });

    // Hàm tải các project từ DOM hiện có (trang web) vào mảng 'projects'
    function loadProjects() {
        projects = []; // Xóa mảng projects hiện tại
        const projectElements = document.querySelectorAll('.project-grid .project-card'); // Lấy tất cả các project card từ trang

        projectElements.forEach((projectCard) => {
            projects.push({
                title: projectCard.querySelector('.project-name').textContent, // Lấy tiêu đề project
                description: projectCard.querySelector('.project-info').textContent, // Lấy mô tả project
                technologies: projectCard.querySelector('.project-tech').textContent, // Lấy công nghệ sử dụng
                image: projectCard.querySelector('.project-img img').src, // Lấy đường dẫn ảnh
                githubLink: projectCard.querySelector('.project-links a:nth-child(1)')?.href || '#', // Lấy link GitHub hoặc '#' nếu không có
                liveDemoLink: projectCard.querySelector('.project-links a:nth-child(2)')?.href || '#' // Lấy link Live Demo hoặc '#' nếu không có
            });
        });
        renderProjectsInSetting(); // Hiển thị các project trong tab Settings
    }

    // Hàm hiển thị danh sách project trong tab Cài đặt (Settings)
    function renderProjectsInSetting() {
        projectsContainer.innerHTML = ''; // Xóa nội dung hiện tại trong container project của tab Settings
        projects.forEach((project, index) => {
            const projectItem = document.createElement('div'); // Tạo một div cho mỗi project
            projectItem.className = 'project-item'; // Thêm class
            projectItem.innerHTML = `
                <h4>${project.title}</h4>
                <div class="project-actions">
                    <button class="btn btn-primary edit-project" data-index="${index}">Sửa</button>
                    <button class="btn btn-danger delete-project" data-index="${index}">Xóa</button>
                </div>
            `;
            projectsContainer.appendChild(projectItem); // Thêm project vào container

            // Gán sự kiện cho nút "Sửa"
            projectItem.querySelector('.edit-project').addEventListener('click', function() {
                editProject(parseInt(this.dataset.index)); // Gọi hàm chỉnh sửa project
            });

            // Gán sự kiện cho nút "Xóa"
            projectItem.querySelector('.delete-project').addEventListener('click', function() {
                // Sử dụng window.confirm để hỏi xác nhận trước khi xóa
                if (window.confirm('Bạn có chắc chắn muốn xóa dự án này không?')) {
                    deleteProject(parseInt(this.dataset.index)); // Gọi hàm xóa project
                } else {
                    console.log('Hủy xóa dự án.'); // Ghi log khi hủy xóa
                }
            });
        });
    }

    // Hàm đặt lại (xóa) dữ liệu trong form project
    function resetProjectForm() {
        document.getElementById('project-title').value = ''; // Xóa tiêu đề
        document.getElementById('project-desc').value = ''; // Xóa mô tả
        document.getElementById('project-tech').value = ''; // Xóa công nghệ
        document.getElementById('project-image').value = ''; // Xóa giá trị input file
        document.getElementById('project-preview').src = ''; // Xóa ảnh xem trước
        document.getElementById('project-preview').style.display = 'none'; // Ẩn ảnh xem trước
    }

    // Hàm chỉnh sửa một project đã tồn tại
    function editProject(index) {
        currentProjectIndex = index; // Cập nhật index project hiện tại
        const project = projects[index]; // Lấy dữ liệu project từ mảng

        document.getElementById('project-title').value = project.title; // Đặt giá trị tiêu đề vào form
        document.getElementById('project-desc').value = project.description; // Đặt giá trị mô tả vào form
        document.getElementById('project-tech').value = project.technologies; // Đặt giá trị công nghệ vào form
        // Thêm các trường cho githubLink và liveDemoLink nếu bạn muốn chỉnh sửa chúng

        if (project.image) {
            document.getElementById('project-preview').src = project.image; // Đặt ảnh xem trước nếu có
            document.getElementById('project-preview').style.display = 'block'; // Hiển thị ảnh xem trước
        } else {
            document.getElementById('project-preview').style.display = 'none'; // Ẩn ảnh xem trước nếu không có
        }

        projectForm.style.display = 'block'; // Hiển thị form
    }

    // Hàm lưu project (thêm mới hoặc cập nhật)
    function saveProject() {
        const title = document.getElementById('project-title').value; // Lấy tiêu đề từ form
        const description = document.getElementById('project-desc').value; // Lấy mô tả từ form
        const technologies = document.getElementById('project-tech').value; // Lấy công nghệ từ form
        // Thêm các trường nhập liệu cho githubLink và liveDemoLink nếu bạn muốn chỉnh sửa chúng
        const githubLink = '#'; // Giá trị mặc định
        const liveDemoLink = '#'; // Giá trị mặc định

        // Kiểm tra xem các trường bắt buộc đã được điền chưa
        if (!title || !description || !technologies) {
            console.warn('Vui lòng điền đầy đủ tất cả các trường dự án.'); // Ghi log cảnh báo
            alert('Vui lòng điền đầy đủ tất cả các trường dự án!'); // HIỂN THỊ CẢNH BÁO POP-UP
            return; // Dừng hàm nếu thiếu thông tin
        }

        const projectData = { // Tạo đối tượng project
            title,
            description,
            technologies,
            githubLink,
            liveDemoLink
        };

        const imageFile = document.getElementById('project-image').files[0]; // Lấy tệp ảnh mới
        if (imageFile) {
            const reader = new FileReader(); // Tạo đối tượng FileReader
            reader.onload = function(event) {
                projectData.image = event.target.result; // Lưu ảnh dưới dạng URL dữ liệu
                completeProjectSave(projectData); // Hoàn tất lưu project
            };
            reader.readAsDataURL(imageFile); // Đọc tệp ảnh
        } else if (currentProjectIndex >= 0 && projects[currentProjectIndex] && projects[currentProjectIndex].image) {
            // Giữ lại ảnh hiện có nếu không có ảnh mới được tải lên khi chỉnh sửa
            projectData.image = projects[currentProjectIndex].image; // Giữ lại ảnh cũ
            completeProjectSave(projectData); // Hoàn tất lưu project
        } else {
            // Xử lý trường hợp không có ảnh nào được chọn cho một project mới
            console.warn('Vui lòng chọn một ảnh cho dự án.'); // Ghi log cảnh báo
            alert('Vui lòng chọn một ảnh cho dự án!'); // HIỂN THỊ CẢNH BÁO POP-UP
            return; // Dừng hàm
        }
    }

    // Hàm hoàn tất quá trình lưu project (sau khi xử lý ảnh)
    function completeProjectSave(projectData) {
        if (currentProjectIndex === -1) {
            projects.push(projectData); // Thêm project mới vào mảng
        } else {
            projects[currentProjectIndex] = projectData; // Cập nhật project hiện có
        }

        renderProjectsInSetting(); // Hiển thị lại danh sách project trong tab Settings
        resetProjectForm(); // Xóa dữ liệu trong form
        projectForm.style.display = 'none'; // Ẩn form
    }

    // Hàm xóa một project
    function deleteProject(index) {
        projects.splice(index, 1); // Xóa project khỏi mảng
        renderProjectsInSetting(); // Hiển thị lại danh sách project
    }

    // Hàm lưu tất cả các project đã quản lý vào phần hiển thị trên trang chính
    function saveAllProjects() {
        const projectsGrid = document.querySelector('.project-grid'); // Lấy container project trên trang chính
        if (projectsGrid) {
            projectsGrid.innerHTML = ''; // Xóa tất cả project hiện có trên trang chính

            projects.forEach(project => {
                const projectCard = document.createElement('div'); // Tạo một project card mới
                projectCard.className = 'project-card'; // Thêm class
                projectCard.innerHTML = `
                    <div class="project-img">
                        <img src="${project.image}" alt="${project.title}">
                    </div>
                    <div class="project-content">
                        <h3 class="project-name">${project.title}</h3>
                        <p class="project-info">${project.description}</p>
                        <div class="project-tech">${project.technologies}</div>
                        <div class="project-links">
                            <a href="${project.githubLink}" title="View Source"><i class="fa-brands fa-github"></i></a>
                            <a href="${project.liveDemoLink}" title="Live Demo"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>
                        </div>
                    </div>
                `;
                projectsGrid.appendChild(projectCard); // Thêm project card vào trang chính
            });
        }
        console.log('Tất cả các dự án đã được lưu thành công!'); // Ghi log thông báo
        alert('Tất cả các dự án đã được lưu thành công!'); // HIỂN THỊ THÔNG BÁO POP-UP
    }





});