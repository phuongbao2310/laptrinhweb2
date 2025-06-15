const body = document.querySelector("body"),
     sidebar = body.querySelector(".sidebar"),
     toggle = body.querySelector(".toggle"),
     searchBtn = body.querySelector(".search-box"),
     modeSwitch = body.querySelector(".toggle-switch"),
     modeText = body.querySelector(".mode-text"),
     searchInput = document.querySelector('.search-box input'),
     menuLinks = document.querySelectorAll('.menu-links .nav-link');

    toggle.addEventListener("click", () => {
        sidebar.classList.toggle("close");
    });

    modeSwitch.addEventListener("click", () => {
        body.classList.toggle("dark");
        if (body.classList.contains("dark")) {
            modeText.innerText = "Light mode";
        } else {
            modeText.innerText = "Dark mode";
        }
    });

    searchInput.addEventListener('input', function() {
        const value = this.value.toLowerCase();
        menuLinks.forEach(link => {
            const text = link.textContent.toLowerCase();
            if (text.includes(value)) {
                link.style.display = '';
            } else {
                link.style.display = 'none';
            }
        });
    });

    
// main.js skill
  function showTab(tab) {
  document.getElementById('skills-tech').style.display = tab === 'tech' ? 'flex' : 'none';
  document.getElementById('skills-tools').style.display = tab === 'tools' ? 'flex' : 'none';
  document.getElementById('skills-english').style.display = tab === 'english' ? 'flex' : 'none';
  document.getElementById('skills-certificate').style.display = tab === 'certificate' ? 'flex' : 'none';
  
  const tabs = document.querySelectorAll('.skills-tab');
  tabs[0].classList.toggle('active', tab === 'tech');
  tabs[1].classList.toggle('active', tab === 'tools');
  tabs[2].classList.toggle('active', tab === 'english');
  tabs[3].classList.toggle('active', tab === 'certificate');

}

// Enhanced Settings Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    const tabs = document.querySelectorAll('.setting-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            document.querySelectorAll('.setting-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.setting-tab-content').forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            document.getElementById(`${tab.dataset.tab}-tab`).classList.add('active');
        });
    });
    
    // Profile settings
    const saveProfileBtn = document.getElementById('save-profile');
    saveProfileBtn.addEventListener('click', saveProfileSettings);
    
    // Projects management
    const projectsContainer = document.getElementById('projects-container');
    const addProjectBtn = document.getElementById('add-project');
    const projectForm = document.getElementById('project-form');
    const saveProjectsBtn = document.getElementById('save-projects');
    
    let currentProjectIndex = -1;
    let projects = [];
    
    // Load existing projects
    loadProjects();
    
    addProjectBtn.addEventListener('click', () => {
        currentProjectIndex = -1; // New project
        resetProjectForm();
        projectForm.style.display = 'block';
    });
    
    document.getElementById('cancel-project').addEventListener('click', () => {
        projectForm.style.display = 'none';
    });
    
    document.getElementById('save-project').addEventListener('click', saveProject);
    saveProjectsBtn.addEventListener('click', saveAllProjects);
    
    // Image preview
    document.getElementById('project-image').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                document.getElementById('project-preview').src = event.target.result;
                document.getElementById('project-preview').style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Skills management
    const saveSkillsBtn = document.getElementById('save-skills');
    saveSkillsBtn.addEventListener('click', saveAllSkills);
    
    // Load existing skills
    loadSkills();
    
    // Add skill buttons
    document.querySelectorAll('.add-skill-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            addSkillItem(category);
        });
    });
    
    // Avatar preview
    document.getElementById('home-avatar').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                document.getElementById('home-avatar-preview').src = event.target.result;
                document.getElementById('home-avatar-preview').style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Show avatar preview initially
    document.getElementById('home-avatar-preview').style.display = 'block';
    
    // Functions
    function saveProfileSettings() {
        // Update home section
        document.getElementById('display-name').textContent = document.getElementById('home-name').value;
        document.getElementById('display-decs').textContent = document.getElementById('home-desc').value;
        
        // Update avatar if changed
        const avatarFile = document.getElementById('home-avatar').files[0];
        if (avatarFile) {
            const reader = new FileReader();
            reader.onload = function(event) {
                document.querySelector('.home-avatar img').src = event.target.result;
                document.querySelector('.about-avatar-large img').src = event.target.result;
            };
            reader.readAsDataURL(avatarFile);
        }
        
        // Update about section
        const aboutInfo = document.querySelector('.about-info');
        aboutInfo.innerHTML = `
            <p>${document.getElementById('about-text1').value}</p>
            <p>${document.getElementById('about-text2').value}</p>
            <P>${document.getElementById('about-hobbies').value}</P>
        `;
        
        alert('Profile settings saved successfully!');
    }
    
    function loadProjects() {
        // Get existing projects from the page
        const projectElements = document.querySelectorAll('.project-card');
        projects = [];
        
        projectElements.forEach((project, index) => {
            projects.push({
                title: project.querySelector('.project-name').textContent,
                description: project.querySelector('.project-info').textContent,
                technologies: project.querySelector('.project-tech').textContent,
                image: project.querySelector('.project-img img').src
            });
            
            // Add project to settings UI
            addProjectToUI(project.querySelector('.project-name').textContent, index);
        });
    }
    
    function addProjectToUI(title, index) {
        const projectItem = document.createElement('div');
        projectItem.className = 'project-item';
        projectItem.innerHTML = `
            <h4>${title}</h4>
            <div class="project-actions">
                <button class="btn btn-primary edit-project" data-index="${index}">Edit</button>
                <button class="btn btn-danger delete-project" data-index="${index}">Delete</button>
            </div>
        `;
        projectsContainer.appendChild(projectItem);
        
        // Add event listeners
        projectItem.querySelector('.edit-project').addEventListener('click', function() {
            editProject(parseInt(this.dataset.index));
        });
        
        projectItem.querySelector('.delete-project').addEventListener('click', function() {
            deleteProject(parseInt(this.dataset.index));
        });
    }
    
    function resetProjectForm() {
        document.getElementById('project-title').value = '';
        document.getElementById('project-desc').value = '';
        document.getElementById('project-tech').value = '';
        document.getElementById('project-image').value = '';
        document.getElementById('project-preview').style.display = 'none';
    }
    
    function editProject(index) {
        currentProjectIndex = index;
        const project = projects[index];
        
        document.getElementById('project-title').value = project.title;
        document.getElementById('project-desc').value = project.description;
        document.getElementById('project-tech').value = project.technologies;
        
        // Set image preview
        if (project.image) {
            document.getElementById('project-preview').src = project.image;
            document.getElementById('project-preview').style.display = 'block';
        }
        
        projectForm.style.display = 'block';
    }
    
    function saveProject() {
        const title = document.getElementById('project-title').value;
        const description = document.getElementById('project-desc').value;
        const technologies = document.getElementById('project-tech').value;
        
        if (!title || !description || !technologies) {
            alert('Please fill all fields');
            return;
        }
        
        const projectData = {
            title,
            description,
            technologies
        };
        
        // Handle image
        const imageFile = document.getElementById('project-image').files[0];
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function(event) {
                projectData.image = event.target.result;
                completeProjectSave(projectData);
            };
            reader.readAsDataURL(imageFile);
        } else if (currentProjectIndex >= 0 && projects[currentProjectIndex].image) {
            // Keep existing image if not changed
            projectData.image = projects[currentProjectIndex].image;
            completeProjectSave(projectData);
        } else {
            alert('Please select an image for the project');
            return;
        }
    }
    
    function completeProjectSave(projectData) {
        if (currentProjectIndex === -1) {
            // Add new project
            projects.push(projectData);
            addProjectToUI(projectData.title, projects.length - 1);
        } else {
            // Update existing project
            projects[currentProjectIndex] = projectData;
            // Refresh UI
            projectsContainer.innerHTML = '';
            projects.forEach((project, index) => {
                addProjectToUI(project.title, index);
            });
        }
        
        // Reset form
        resetProjectForm();
        projectForm.style.display = 'none';
    }
    
    function deleteProject(index) {
        if (confirm('Are you sure you want to delete this project?')) {
            projects.splice(index, 1);
            // Refresh UI
            projectsContainer.innerHTML = '';
            projects.forEach((project, index) => {
                addProjectToUI(project.title, index);
            });
        }
    }
    
    function saveAllProjects() {
        // Get the projects grid element
        const projectsGrid = document.querySelector('.project-grid');
        
        // Clear existing projects (keep the first one as template)
        projectsGrid.innerHTML = '';
        
        // Add all projects
        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.innerHTML = `
                <div class="project-img">
                    <img src="${project.image}" alt="${project.title}">
                </div>
                <div class="project-content">
                    <h3 class="project-name">${project.title}</h3>
                    <p class="project-info">${project.description}</p>
                    <div class="project-tech">${project.technologies}</div>
                    <div class="project-links">
                        <a href="#" title="View Source"><i class="fa-brands fa-github"></i></a>
                        <a href="#" title="Live Demo"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>
                    </div>
                </div>
            `;
            projectsGrid.appendChild(projectCard);
        });
        
        alert('All projects saved successfully!');
    }
    
    function loadSkills() {
        // Tech skills
        const techSkills = document.querySelectorAll('#skills-tech .skill-card');
        techSkills.forEach(skill => {
            const icon = skill.querySelector('i');
            addSkillItem('tech', 
                        skill.querySelector('span').textContent, 
                        icon.className, 
                        icon.style.color);
        });
        
        // Tools skills
        const toolsSkills = document.querySelectorAll('#skills-tools .skill-card');
        toolsSkills.forEach(skill => {
            const icon = skill.querySelector('i');
            addSkillItem('tools', 
                        skill.querySelector('span').textContent, 
                        icon.className, 
                        icon.style.color);
        });
    }
    
    function addSkillItem(category, name = '', iconClass = '', color = '#695CFE') {
        const container = document.getElementById(`${category}-skills`);
        const skillItem = document.createElement('div');
        skillItem.className = 'skill-item';
        skillItem.innerHTML = `
            <input type="text" class="setting-input skill-name" value="${name}" placeholder="Skill name">
            <input type="text" class="setting-input skill-icon" value="${iconClass}" placeholder="Icon class (e.g. fa-brands fa-html5)">
            <input type="color" class="setting-input skill-color" value="${color}">
            <span class="remove-skill"><i class="fa-solid fa-trash"></i></span>
        `;
        container.appendChild(skillItem);
        
        // Add event listener for remove button
        skillItem.querySelector('.remove-skill').addEventListener('click', function() {
            skillItem.remove();
        });
    }
    
    function saveAllSkills() {
        // Tech skills
        const techSkillsContainer = document.getElementById('tech-skills');
        const techSkills = techSkillsContainer.querySelectorAll('.skill-item');
        updateSkillsSection('skills-tech', techSkills);
        
        // Tools skills
        const toolsSkillsContainer = document.getElementById('tools-skills');
        const toolsSkills = toolsSkillsContainer.querySelectorAll('.skill-item');
        updateSkillsSection('skills-tools', toolsSkills);
        
        // English skills
        const englishSkillsContainer = document.getElementById('english-skills');
        const englishSkills = englishSkillsContainer.querySelectorAll('.skill-item');
        updateSkillsSection('skills-english', englishSkills);
        
        // Certificate skills
        const certificateSkillsContainer = document.getElementById('certificate-skills');
        const certificateSkills = certificateSkillsContainer.querySelectorAll('.skill-item');
        updateSkillsSection('skills-certificate', certificateSkills);
        
        alert('All skills saved successfully!');
    }
    
    function updateSkillsSection(sectionId, skillItems) {
        const section = document.getElementById(sectionId);
        section.innerHTML = '';
        
        skillItems.forEach(item => {
            const name = item.querySelector('.skill-name').value;
            const iconClass = item.querySelector('.skill-icon').value;
            const color = item.querySelector('.skill-color').value;
            
            if (name && iconClass) {
                const skillCard = document.createElement('div');
                skillCard.className = 'skill-card';
                skillCard.innerHTML = `
                    <i class="${iconClass}" style="color:${color}; font-size:2rem"></i>
                    <span>${name}</span>
                `;
                section.appendChild(skillCard);
            }
        });
    }
});