// --- Data Loading and Rendering ---
let portfolioData = null; // To store fetched data
let skillsData = null; // To store skills data
let sliderInitialized = false; // Flag to prevent multiple initializations

// Function to fetch data from JSON
async function loadData() {
    try {
        const [achievementsResponse, skillsResponse] = await Promise.all([
            fetch('data.json'),
            fetch('skills.json')
        ]);
        if (!achievementsResponse.ok) throw new Error(`HTTP error! status: ${achievementsResponse.status}`);
        if (!skillsResponse.ok) throw new Error(`HTTP error! status: ${skillsResponse.status}`);

        portfolioData = await achievementsResponse.json();
        skillsData = await skillsResponse.json();

        renderAchievements(); // Render achievements with fetched data
        renderSkills(); // Render structured skills by default
        renderSkillCloud(); // Also render the cloud, but it will be hidden initially
    } catch (error) {
        console.error("Could not load portfolio data:", error);
    }
}

// Function to render achievements
function renderAchievements() {
    const container = document.getElementById('achievements-container');
    if (!container) return;

    container.innerHTML = ''; // Clear existing content
    // Use achievements from portfolioData, or an empty array as a fallback.
    const achievements = (portfolioData && portfolioData.achievements) ? portfolioData.achievements : [];

    if (achievements.length === 0) {
        console.warn("No achievements found in data.json or data failed to load.");
    }

    achievements.forEach(ach => {
        const card = document.createElement('div');
        card.className = 'achievement-card';
        card.innerHTML = `
            <div class="achievement-card-content p-6 min-h-[180px] flex flex-col justify-center">
                <span class="text-sm font-bold accent-text uppercase tracking-widest">${ach.title}</span>
                <p class="mt-3 text-base opacity-80">${ach.description}</p>
            </div>
        `;
        container.appendChild(card);
    });
}

// Function to render the new categorized skills section
function renderSkills() {
    const container = document.getElementById('skills-container');
    if (!container) return;

    // Create a single, shared tooltip for notes
    const notesTooltip = document.createElement('div');
    notesTooltip.id = 'skill-notes-tooltip';
    notesTooltip.className = 'skill-notes-tooltip';
    document.body.appendChild(notesTooltip);

    container.innerHTML = ''; // Clear fallback skills

    const categories = (skillsData && skillsData.skillCategories) ? skillsData.skillCategories : [];

    if (categories.length === 0) {
        container.textContent = 'Skills data could not be loaded.';
        return;
    }

    categories.forEach(category => {
        const categoryWrapper = document.createElement('div');
        categoryWrapper.className = 'skill-category-card';

        const categoryTitle = document.createElement('h3');
        categoryTitle.className = 'skill-category-title';
        categoryTitle.textContent = category.category;
        categoryWrapper.appendChild(categoryTitle);

        const skillsGrid = document.createElement('div');
        skillsGrid.className = 'skills-grid';

        category.skills.forEach(skill => {
            const skillCard = document.createElement('div');
            skillCard.className = 'skill-card';
            skillCard.innerHTML = `
                <span class="skill-card-name">${skill.name}</span>
                <div class="skill-card-proficiency-bg">
                    <div class="skill-card-proficiency-fg" style="width: ${skill.proficiency * 20}%"></div>
                </div>
            `;

            // Show tooltip on hover
            skillCard.addEventListener('mouseenter', (e) => {
                notesTooltip.textContent = skill.notes;
                notesTooltip.classList.add('is-visible');

                const rect = e.currentTarget.getBoundingClientRect();
                notesTooltip.style.left = `${rect.left + rect.width / 2}px`;
                notesTooltip.style.top = `${rect.top - 10}px`;
            });

            // Hide tooltip on mouse leave
            skillCard.addEventListener('mouseleave', () => {
                notesTooltip.classList.remove('is-visible');
            });

            skillsGrid.appendChild(skillCard);
        });

        categoryWrapper.appendChild(skillsGrid);
        container.appendChild(categoryWrapper);
    });
}

// Function to render the animated skill cloud
function renderSkillCloud() {
    const container = document.getElementById('skill-cloud-container');
    if (!container) return;

    container.innerHTML = ''; // Clear content

    let cloudSkills = [];
    // Use the detailed skills.json as the source for the cloud view for consistency
    if (skillsData && skillsData.skillCategories) {
        skillsData.skillCategories.forEach(category => {
            category.skills.forEach(skill => {
                cloudSkills.push({
                    name: skill.name,
                    definition: skill.notes // Use the detailed notes for the tooltip
                });
            });
        });
    }

    if (cloudSkills.length === 0) return;

    const radius = 250;

    const tooltip = document.createElement('div');
    tooltip.className = 'skill-definition-tooltip';
    container.appendChild(tooltip);

    const cloud = document.createElement('div');
    cloud.className = 'skill-cloud';
    container.appendChild(cloud);

    cloudSkills.forEach((skill, i) => {
        const tag = document.createElement('span');
        tag.className = 'skill-tag';
        const textSpan = document.createElement('span');
        textSpan.className = 'skill-tag-text';
        textSpan.textContent = skill.name;
        tag.appendChild(textSpan);
        tag.dataset.definition = skill.definition;

        const phi = Math.acos(-1 + (2 * i) / cloudSkills.length);
        const theta = Math.sqrt(cloudSkills.length * Math.PI) * phi;
        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(phi);

        tag.style.setProperty('--x', `${x}px`);
        tag.style.setProperty('--y', `${y}px`);
        tag.style.setProperty('--z', `${z}px`);

        const duration = 30 + Math.random() * 30;
        const delay = Math.random() * -60;
        tag.style.animation = `skill-drift ${duration}s ease-in-out ${delay}s infinite alternate`;

        tag.addEventListener('mouseover', () => {
            tooltip.textContent = tag.dataset.definition;
            tooltip.style.visibility = 'visible';
            tooltip.style.opacity = '1';
        });
        tag.addEventListener('mouseout', () => {
            tooltip.style.visibility = 'hidden';
            tooltip.style.opacity = '0';
        });
        cloud.appendChild(tag);
    });
}
// --- End Data Loading and Rendering ---

// --- Smooth Scroll Logic ---
function smoothScroll(event) {
    // Only act on links with a hash
    if (this.hash !== "") {
        event.preventDefault();
        const hash = this.hash;
        const targetElement = document.querySelector(hash);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header Logic ---
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) { // Add 'scrolled' class after 50px of scrolling
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    // --- End Sticky Header Logic ---

    // --- Attach Smooth Scroll to Nav Links ---
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });
    // --- End Smooth Scroll ---

    // --- Mobile Menu Logic ---
    const burgerBtn = document.getElementById('burger-menu-btn');
    const closeMenuBtn = document.getElementById('close-mobile-menu-btn');
    const mobileMenuPanel = document.getElementById('mobile-menu-panel');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');

    const openMobileMenu = () => {
        mobileMenuPanel.classList.add('is-open');
        mobileMenuOverlay.style.visibility = 'visible';
        mobileMenuOverlay.style.opacity = '1';
    };
    const closeMobileMenu = () => {
        mobileMenuPanel.classList.remove('is-open');
        mobileMenuOverlay.style.opacity = '0';
        setTimeout(() => { mobileMenuOverlay.style.visibility = 'hidden'; }, 300);
    };

    if (burgerBtn && mobileMenuPanel) {
        burgerBtn.addEventListener('click', openMobileMenu);
    }
    if (closeMenuBtn && mobileMenuPanel) {
        closeMenuBtn.addEventListener('click', closeMobileMenu);
    }
    // Close menu when overlay is clicked
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    }
    // Close menu when a link is clicked
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    // --- End Mobile Menu Logic ---

    // --- Interchangeable Skills View Toggle Logic ---
    const toggleBtn = document.getElementById('skill-view-toggle-btn');
    const listContainer = document.getElementById('skills-container');
    const cloudContainer = document.getElementById('skill-cloud-container');

    if (toggleBtn && listContainer && cloudContainer) {
        let currentView = 'cloud'; // Default view

        const icons = {
            list: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" /></svg>`,
            cloud: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" /></svg>`
        };

        // Set initial state
        toggleBtn.innerHTML = icons.list; // Show icon to switch to 'list'

        toggleBtn.addEventListener('click', () => {
            if (currentView === 'cloud') {
                // Switch to list view
                cloudContainer.classList.add('hidden');
                listContainer.classList.remove('hidden');
                toggleBtn.innerHTML = icons.cloud; // Show icon to switch back to 'cloud'
                toggleBtn.setAttribute('aria-label', 'Switch to cloud view');
                currentView = 'list';
            } else {
                // Switch to cloud view
                listContainer.classList.add('hidden');
                cloudContainer.classList.remove('hidden');
                toggleBtn.innerHTML = icons.list; // Show icon to switch back to 'list'
                toggleBtn.setAttribute('aria-label', 'Switch to structured view');
                currentView = 'cloud';
            }
        });
    }

    // --- Contact Form Modal Logic ---
    const overlay = document.getElementById('contact-form-overlay');
    const openBtn1 = document.getElementById('open-contact-form');
    const openBtn2 = document.getElementById('open-contact-form-2');
    const terminalBody = document.getElementById('terminal-body');

    const formHTML = `
        <form class="terminal-form" action="send_email.php" method="POST">
            <div class="form-group">
                <label for="name"><span class="terminal-prompt">>$</span> Enter your name:</label>
                <input type="text" id="name" name="name" required>
            </div>
            <div class="form-group">
                <label for="email"><span class="terminal-prompt">>$</span> Enter your email:</label>
                <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
                <label for="message"><span class="terminal-prompt">>$</span> Write your message:</label>
                <textarea id="message" name="message" rows="4" required></textarea>
            </div>
            <div class="mt-6">
                <button type="button" id="close-contact-form" class="terminal-btn go-back">abort()</button>
                <button type="submit" class="terminal-btn">execute()</button>
            </div>
        </form>
    `;

    // Function to type text with cursor
    const typeLine = async (element, text, speed = 50, showCursor = true) => {
        const textSpan = document.createElement('span');
        element.appendChild(textSpan);
        let cursorSpan = null;

        if (showCursor) {
            cursorSpan = document.createElement('span');
            cursorSpan.className = 'typing-cursor';
            element.appendChild(cursorSpan);
        }

        for (let i = 0; i < text.length; i++) {
            textSpan.textContent += text[i];
            await new Promise(resolve => setTimeout(resolve, speed));
        }

        if (cursorSpan) cursorSpan.remove(); // Remove cursor when typing is done
    };

    const showForm = () => {
        const br = document.createElement('br');
        terminalBody.appendChild(br);

        const formWrapper = document.createElement('div');
        formWrapper.innerHTML = formHTML;
        terminalBody.appendChild(formWrapper);

        const form = formWrapper.querySelector('.terminal-form');

        // Re-attach listeners
        const closeBtn = formWrapper.querySelector('#close-contact-form');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }
        form.addEventListener('submit', handleFormSubmit);

        // Fade in form
        setTimeout(() => form.style.opacity = 1, 10);
    };

    const openModal = async () => {
        if (overlay) {
            overlay.classList.remove('hidden');
            setTimeout(() => overlay.classList.add('is-visible'), 10);
        }
        document.body.style.overflow = 'hidden';

        // Start typing animation
        terminalBody.innerHTML = ''; // Clear previous content

        const line1 = document.createElement('p');
        terminalBody.appendChild(line1);
        await typeLine(line1, 'arrs@portfolio:~$ ./send-message.sh', 80, true); // Type command with cursor

        await new Promise(resolve => setTimeout(resolve, 200)); // Pause

        const line2 = document.createElement('p');
        line2.textContent = 'Initializing secure connection...';
        terminalBody.appendChild(line2);

        await new Promise(resolve => setTimeout(resolve, 100)); // Pause

        const line3 = document.createElement('p');
        line3.textContent = 'Connection established. Awaiting input.';
        terminalBody.appendChild(line3);

        // Show form with smooth fade-in
        showForm();
    };

    const closeModal = () => {
        if (overlay) {
            overlay.classList.remove('is-visible');
            setTimeout(() => overlay.classList.add('hidden'), 300);
        }
        document.body.style.overflow = 'auto';
    };

    if (openBtn1) openBtn1.addEventListener('click', openModal);
    if (openBtn2) openBtn2.addEventListener('click', openModal);
    // Close button is attached dynamically in showForm()

    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal();
            }
        });
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;

        const formData = new FormData(form);

        terminalBody.innerHTML = `
            <p><span class="terminal-prompt">arrs@portfolio:~$</span> ./send-message.sh</p>
            <p>Initializing secure connection...</p>
            <p>Connection established. Awaiting input.</p>
            <br>
            <p>Sending message...</p>
        `;

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                terminalBody.innerHTML = `
                    <p><span class="terminal-prompt">arrs@portfolio:~$</span> ./send-message.sh</p>
                    <p>Initializing secure connection...</p>
                    <p>Connection established. Awaiting input.</p>
                    <br>
                    <p>Sending message...</p>
                    <p class="accent-text">Message sent successfully!</p>
                    <p>Thank you for reaching out. I will get back to you shortly.</p>
                    <br>
                    <button type="button" id="close-contact-form" class="terminal-btn go-back">close()</button>
                `;
                const newCloseBtn = document.getElementById('close-contact-form');
                if (newCloseBtn) newCloseBtn.addEventListener('click', closeModal);
            } else {
                throw new Error(result.message || "Unknown error");
            }
        } catch (error) {
            terminalBody.innerHTML = `
                <p><span class="terminal-prompt">arrs@portfolio:~$</span> ./send-message.sh</p>
                <p>Initializing secure connection...</p>
                <p>Connection established. Awaiting input.</p>
                <br>
                <p>Sending message...</p>
                <p class="text-red-500">Error: Message failed to send.</p>
                <p>You can also email me directly at <a href="mailto:me@soufianearrazouki.com" class="accent-text">me@soufianearrazouki.com</a>.</p>
                <p class="text-red-500">Error: ${error.message}.</p>
                <br>
                <p class="text-yellow-400">This is a client-side error, often caused by one of two things:</p>
                <ol class="list-decimal list-inside text-yellow-400/80 pl-4">
                    <li>Testing on a local machine without a PHP server (e.g., opening the HTML file directly).</li>
                    <li>A network issue or incorrect file path on the live server.</li>
                </ol>
                <p class="mt-2">The form should work correctly when uploaded to a web host like Hostinger.</p>
                <br>
                <button type="button" id="close-contact-form" class="terminal-btn go-back">close()</button>
            `;
            const newCloseBtn = document.getElementById('close-contact-form');
            if (newCloseBtn) newCloseBtn.addEventListener('click', closeModal);
        }
    };

    // Load data when the DOM is ready
    loadData();

}); // End DOMContentLoaded