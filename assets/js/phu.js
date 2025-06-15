// Dark Mode Toggle Functionality
const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.body;

// Check for saved user preference or use system preference
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
const currentTheme = localStorage.getItem("theme");

if (currentTheme === "dark" || (!currentTheme && prefersDarkScheme.matches)) {
  body.classList.add("dark-mode");
  darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

// Toggle dark mode
darkModeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode");

  // Update icon and save preference
  if (body.classList.contains("dark-mode")) {
    darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    localStorage.setItem("theme", "dark");
  } else {
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    localStorage.setItem("theme", "light");
  }
});

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Scroll Animation
const sections = document.querySelectorAll(".section");

const revealSection = () => {
  sections.forEach((section) => {
    const sectionTop = section.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (sectionTop < windowHeight - 100) {
      section.classList.add("visible");
    } else {
      section.classList.remove("visible");
    }
  });
};

window.addEventListener("scroll", revealSection);
revealSection();

// Button Ripple Effect
document.querySelectorAll(".btn").forEach((button) => {
  button.addEventListener("click", function (e) {
    const x = e.clientX - e.target.offsetLeft;
    const y = e.clientY - e.target.offsetTop;

    const ripple = document.createElement("span");
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add("ripple");

    this.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
});

// Dynamic Title
const originalTitle = document.title;

window.addEventListener("blur", () => {
  document.title = "Quay lại với tôi nhé! 🌸";
});

window.addEventListener("focus", () => {
  document.title = originalTitle;
});

// Random Background Color
const randomColorBtn = document.createElement("button");
randomColorBtn.textContent = "Đổi màu nền";
randomColorBtn.classList.add("random-color-btn");
document.body.appendChild(randomColorBtn);

randomColorBtn.addEventListener("click", () => {
  const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  document.body.style.backgroundColor = randomColor;
});

document.getElementById("updateInfoBtn").addEventListener("click", () => {
  // Kích hoạt chế độ chỉnh sửa cho các phần nội dung
  const editableSections = document.querySelectorAll(
    ".name, .title, .bio, .skill-list, .section-title, .project-title, .project-role, .project-tech, .project-desc, .hobby-item, .award-list li"
  );

  editableSections.forEach((section) => {
    section.setAttribute("contenteditable", "true");
    section.style.border = "1px dashed var(--primary)"; // Thêm viền để hiển thị vùng chỉnh sửa
    section.style.padding = "5px"; // Tăng khoảng cách để dễ chỉnh sửa
  });

  // Thay đổi nút thành "Lưu thông tin"
  const updateInfoBtn = document.getElementById("updateInfoBtn");
  updateInfoBtn.textContent = "Lưu thông tin";
  updateInfoBtn.classList.add("save-btn");

  // Thêm sự kiện lưu thông tin
  updateInfoBtn.addEventListener("click", () => {
    editableSections.forEach((section) => {
      section.removeAttribute("contenteditable");
      section.style.border = "none"; // Xóa viền sau khi lưu
      section.style.padding = "0"; // Xóa khoảng cách sau khi lưu
    });

    // Đổi lại nút thành "Cập nhật thông tin"
    updateInfoBtn.textContent = "Cập nhật thông tin";
    updateInfoBtn.classList.remove("save-btn");
  });
});

// Add functionality to the "Download CV" button
document.querySelector(".download-btn").addEventListener("click", async (e) => {
  e.preventDefault();
  const button = e.target;
  button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang tải...';

  try {
    const link = document.createElement("a");
    link.href = "Phu_CV.pdf";
    link.download = "Phu_CV.pdf";
    link.click();
  } catch (error) {
    alert("Có lỗi xảy ra khi tải CV!");
  } finally {
    button.innerHTML = 'Download CV <i class="fas fa-download"></i>';
  }
});

// Add back to top button
const backToTop = document.createElement("button");
backToTop.classList.add("back-to-top");
backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
document.body.appendChild(backToTop);

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 100) {
    backToTop.style.display = "block";
  } else {
    backToTop.style.display = "none";
  }
});

const contactForm = document.querySelector(".contact-form form");
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // Add your form validation and submission logic here
  alert("Cảm ơn bạn đã liên hệ! Tôi sẽ phản hồi sớm nhất có thể.");
});
