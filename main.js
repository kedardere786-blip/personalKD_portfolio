let allProjects = []; 

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    fetchProjects(); 
    setupActiveTabs();
    setupScrollAnimations();
    setupContactForm();
});

// 1. Theme Toggle
function initTheme() {
    const toggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    if (currentTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        toggleBtn.textContent = '☀️';
    }

    toggleBtn.addEventListener('click', () => {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            toggleBtn.textContent = '🌙';
        } else {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            toggleBtn.textContent = '☀️';
        }
    });
}

// 2. Fetch Projects (View Code button removed)
async function fetchProjects() {
    const backupProjects = [
        { 
            title: 'E-Commerce Store', 
            description: 'A responsive shopping app with a modern UI and cart functionality.', 
            technologies: ['React', 'Node.js', 'MongoDB']
        },
        { 
            title: 'Task Manager', 
            description: 'A sleek to-do application to manage daily tasks efficiently.', 
            technologies: ['JavaScript', 'HTML', 'CSS']
        },
        { 
            title: 'Weather App', 
            description: 'Real-time weather forecasting using public APIs.', 
            technologies: ['JavaScript', 'React', 'API']
        }
    ];

    try {
        const response = await fetch('/api/projects');
        if (!response.ok) throw new Error("Backend connection failed");
        
        allProjects = await response.json();
        if (allProjects.length === 0) {
            allProjects = backupProjects;
        }
    } catch (error) {
        allProjects = backupProjects;
    }

    renderProjects(allProjects);
    setupFilters();
}

function renderProjects(projectsToRender) {
    const container = document.getElementById('projects-container');
    container.innerHTML = ''; 

    if (projectsToRender.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No projects found for this category.</p>';
        return;
    }

    projectsToRender.forEach(project => {
        const card = document.createElement('div');
        card.className = 'card fade-in appear'; 
        const techBadges = project.technologies.map(tech => `<span>${tech}</span>`).join('');

        // Notice the View Code button has been completely removed from this block
        card.innerHTML = `
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="tags">${techBadges}</div>
        `;
        container.appendChild(card);
    });
}

function setupFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            buttons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            const filterValue = e.target.getAttribute('data-filter');
            
            if (filterValue === 'all') {
                renderProjects(allProjects);
            } else {
                const filtered = allProjects.filter(p => 
                    p.technologies.some(tech => tech.toLowerCase().includes(filterValue.toLowerCase()))
                );
                renderProjects(filtered);
            }
        });
    });
}

// 3. Contact Form Submission
function setupContactForm() {
    const form = document.getElementById('contact-form');
    const statusText = document.getElementById('form-status');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button');
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            
            if (result.success) {
                statusText.textContent = result.message;
                statusText.className = 'form-status success-msg';
                form.reset();
            }
        } catch (error) {
            statusText.textContent = 'Message simulated! (Backend needed for real emails)';
            statusText.style.color = '#3b82f6';
        } finally {
            submitBtn.textContent = 'Send Message';
            submitBtn.disabled = false;
            setTimeout(() => { statusText.textContent = ''; }, 5000);
        }
    });
}

// 4. Active Tabs & Scroll Animation
function setupActiveTabs() {
    const sections = document.querySelectorAll('section, footer');
    const navLinks = document.querySelectorAll('.nav-links a:not(.icon-btn)'); 

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= (sectionTop - section.clientHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
}

function setupScrollAnimations() {
    const faders = document.querySelectorAll('.fade-in');
    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('appear');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

    faders.forEach(fader => appearOnScroll.observe(fader));
}