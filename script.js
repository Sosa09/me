// --- Palette Switcher Logic ---
function setPalette(themeName) {
    if (themeName === 'default') {
        document.documentElement.removeAttribute('data-theme');
    } else {
        document.documentElement.setAttribute('data-theme', themeName);
    }
}

// Function to create and add palette buttons
function createPaletteButtons() {
    const switcher = document.querySelector('.palette-switcher');
    if (!switcher) return;

    const palettes = [
        { name: 'default', color: '#F0E6D1', label: 'Charcoal/Cream' },
        { name: 'warm-amber', color: '#F59E0B', label: 'Warm Amber' },
        { name: 'soft-crimson', color: '#EF4444', label: 'Soft Crimson' },
        { name: 'electric-lime', color: '#A3E635', label: 'Electric Lime' },
        { name: 'cyber-green', color: '#33FF33', label: 'Cyber Green' },
        { name: 'arc-reactor', color: '#06B6D4', label: 'Arc Reactor' },
        { name: 'quantum-purple', color: '#C026D3', label: 'Quantum Purple' },
        { name: 'midnight-gold', color: '#FBBF24', label: 'Midnight/Gold' },
        { name: 'slate-crimson', color: '#DC2626', label: 'Slate/Crimson' },
        { name: 'forest-amber', color: '#F59E0B', label: 'Forest/Amber' },
        { name: 'oceanic', color: '#00BCD4', label: 'Oceanic' },
        { name: 'sunset', color: '#FF6B6B', label: 'Sunset' },
        { name: 'royal', color: '#A69BEE', label: 'Royal' },
        { name: 'graphite', color: '#FFAB00', label: 'Graphite' },
        { name: 'moss', color: '#A5D6A7', label: 'Moss' },
        { name: 'ruby', color: '#F44336', label: 'Ruby' },
        { name: 'sapphire', color: '#42A5F5', label: 'Sapphire' },
        { name: 'monochrome', color: '#FFFFFF', label: 'Monochrome' },
        { name: 'rose', color: '#EC407A', label: 'Rose' },
        { name: 'earth', color: '#FF9800', label: 'Earth' },
        // --- 20 New Palettes ---
        { name: 'solar-flare', color: '#FF8C00', label: 'Solar Flare' },
        { name: 'deep-space', color: '#50E3C2', label: 'Deep Space' },
        { name: 'emerald-city', color: '#00FF7F', label: 'Emerald City' },
        { name: 'vintage-teal', color: '#CD853F', label: 'Vintage Teal' },
        { name: 'crimson-night', color: '#DC143C', label: 'Crimson Night' },
        { name: 'golden-dune', color: '#D4AF37', label: 'Golden Dune (Light)' },
        { name: 'arctic-dawn', color: '#E6A4B4', label: 'Arctic Dawn (Light)' },
        { name: 'lavender-haze', color: '#C3B1E1', label: 'Lavender Haze' },
        { name: 'olive-grove', color: '#B5B887', label: 'Olive Grove' },
        { name: 'coral-reef', color: '#FF6F61', label: 'Coral Reef' },
        { name: 'volcanic-ash', color: '#FF4500', label: 'Volcanic Ash' },
        { name: 'sakura', color: '#FFB7C5', label: 'Sakura (Light)' },
        { name: 'neptune', color: '#3EDBF0', label: 'Neptune' },
        { name: 'tangerine', color: '#F28500', label: 'Tangerine' },
        { name: 'amethyst', color: '#9966CC', label: 'Amethyst' },
        { name: 'forest-floor', color: '#778A35', label: 'Forest Floor' },
        { name: 'blueberry', color: '#8A2BE2', label: 'Blueberry' },
        { name: 'sandstone', color: '#E9967A', label: 'Sandstone' },
        { name: 'steel', color: '#88C0D0', label: 'Steel' },
        { name: 'cherry-blossom', color: '#DE3163', label: 'Cherry Blossom' },
        // --- 5 New Light Palettes ---
        { name: 'minty-breeze', color: '#7FFFD4', label: 'Minty Breeze (Light)' },
        { name: 'peach-sorbet', color: '#FFDAB9', label: 'Peach Sorbet (Light)' },
        { name: 'sky-blue', color: '#87CEEB', label: 'Sky Blue (Light)' },
        { name: 'lilac-dream', color: '#D8BFD8', label: 'Lilac Dream (Light)' },
        { name: 'misty-gray', color: '#B0C4DE', label: 'Misty Gray (Light)' },
    ];

    palettes.forEach(p => {
        const button = document.createElement('button');
        button.className = 'palette-btn';
        button.style.backgroundColor = p.color;
        button.setAttribute('aria-label', `Set ${p.label} Theme`);
        button.onclick = () => setPalette(p.name);
        switcher.appendChild(button);
    });
}
// --- End Palette Switcher Logic ---

// --- Data Loading and Rendering ---
let portfolioData = null; // To store fetched data
let sliderInitialized = false; // Flag to prevent multiple initializations

// Function to fetch data from JSON
async function loadData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        portfolioData = await response.json();
        renderAchievements();
        renderProjects();
    } catch (error) {
        console.error("Could not load portfolio data:", error);
        // Optionally display an error message to the user
        const achievementsContainer = document.getElementById('achievements-container');
        const sliderTrack = document.getElementById('slider-track');
        if(achievementsContainer) achievementsContainer.innerHTML = '<p class="text-red-500 text-center col-span-full">Could not load achievements.</p>';
        if(sliderTrack) sliderTrack.innerHTML = '<p class="text-red-500 text-center w-full">Could not load projects.</p>';
    }
}

// Function to render achievements
function renderAchievements() {
    const container = document.getElementById('achievements-container');
    if (!container || !portfolioData || !portfolioData.achievements) return;

    container.innerHTML = ''; // Clear existing content

    portfolioData.achievements.forEach(ach => {
        const card = document.createElement('div');
        card.className = 'achievement-card';
        // Use placeholder images based on category or a default
        let imageUrl = ach.imageUrl || `https://placehold.co/600x400/${getComputedStyle(document.documentElement).getPropertyValue('--bg-color').substring(1)}/${getComputedStyle(document.documentElement).getPropertyValue('--accent-color').substring(1)}?text=${ach.category}&font=chivo-mono`;
        card.style.backgroundImage = `url('${imageUrl}')`;

        card.innerHTML = `
            <div class="achievement-card-content p-6 min-h-[180px] flex flex-col justify-center">
                <h4 class="text-lg font-bold accent-text">${ach.title}</h4>
                <p class="mt-2 text-slate opacity-90">${ach.description}</p>
            </div>
        `;
        container.appendChild(card);
    });
}

// Function to render projects
function renderProjects() {
    const track = document.getElementById('slider-track');
    if (!track || !portfolioData || !portfolioData.projects) return;

    track.innerHTML = ''; // Clear existing content

    portfolioData.projects.forEach(proj => {
        const card = document.createElement('div');
        card.className = 'project-card rounded-lg p-6 md:p-8 flex-shrink-0 w-full md:w-1/2 lg:w-1/3 box-border mr-6';
        card.innerHTML = `
            <h3 class="text-xl md:text-2xl font-bold accent-text">${proj.title}</h3>
            <p class="mt-4 text-slate opacity-90">
                <strong>Problem:</strong> ${proj.problem}
            </p>
            <p class="mt-4 text-slate opacity-90">
                <strong>Solution:</strong> ${proj.solution}
            </p>
            <p class="mt-4 text-slate opacity-90">
                <strong>Outcome:</strong> ${proj.outcome}
            </p>
        `;
        track.appendChild(card);
    });

    // Initialize slider *after* projects are rendered
    initializeSlider();
}
// --- End Data Loading and Rendering ---

// --- Slider Logic ---
function initializeSlider() {
     // If slider already exists, maybe just update? Or prevent re-init.
    if (sliderInitialized) {
        console.log("Slider already initialized, attempting to update.");
        // We might need a dedicated update function if cards change dynamically later
        // For now, let's just run the setup again, ensuring listeners are managed.
        // Or simply return if the slider structure should only be built once.
        // Let's reset the flag and proceed to ensure resize works correctly after data load
        sliderInitialized = false;
    }

    const track = document.querySelector('.slider-track');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const progressBar = document.getElementById('progressBar');

    // Only proceed if essential elements exist
    if (!track || !nextBtn || !prevBtn || !progressBar || track.children.length === 0) {
        console.log("Slider essential elements not found or no cards. Skipping slider initialization.");
        // Hide controls if no cards?
        const controls = document.querySelector('.slider-controls');
        if(controls) controls.style.display = 'none';
        return;
    }
     // Show controls if they were hidden
    const controls = document.querySelector('.slider-controls');
    if(controls) controls.style.display = 'flex';

    let cards = Array.from(track.children);
    let cardWidth = cards[0].offsetWidth; // Use offsetWidth for accurate width including padding/border
    let cardsToShow = calculateCardsToShow();
    // Get margin from CSS - safer to access style directly if possible
    let cardMargin = cards.length > 1 ? parseInt(window.getComputedStyle(cards[0]).marginRight) || 0 : 0;
    let slideWidth = cardWidth + cardMargin;
    let currentIndex = 0;
    let totalSlides = calculateTotalSlides();

    function calculateCardsToShow() {
        if (window.innerWidth < 768) return 1;
        if (window.innerWidth < 1024) return 2;
        return 3;
    }

    function calculateTotalSlides() {
        if (cards.length === 0) return 0;
        const numCardsToShow = calculateCardsToShow();
        return Math.ceil(cards.length / numCardsToShow);
    }

    function resizeHandler() {
        if (cards.length === 0) return;
        cardWidth = cards[0].offsetWidth; // Recalculate width on resize
        cardsToShow = calculateCardsToShow();
        cardMargin = cards.length > 1 ? parseInt(window.getComputedStyle(cards[0]).marginRight) || 0 : 0;
        slideWidth = cardWidth + cardMargin;
        totalSlides = calculateTotalSlides();
        currentIndex = 0; // Reset index on resize
        updateSlider();
    }

    // Debounce resize handler
    let resizeTimeout;
    window.removeEventListener('resize', debouncedResizeHandler); // Remove previous listener if any
    window.addEventListener('resize', debouncedResizeHandler);

    function debouncedResizeHandler() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resizeHandler, 100); // Wait 100ms after resize stops
    }


    function updateSlider() {
        if (cards.length === 0) return;
        let moveAmount = -currentIndex * (slideWidth * cardsToShow);
        // Adjust for single/double card views where we slide card by card
         if (window.innerWidth < 768) { // Mobile
            moveAmount = -currentIndex * slideWidth;
        } else if (window.innerWidth < 1024) { // Tablet
             moveAmount = -currentIndex * (slideWidth * 2); // Slide two cards at a time
        } else { // Desktop
            moveAmount = -currentIndex * (slideWidth * 3); // Slide three cards at a time
        }

        track.style.transform = `translateX(${moveAmount}px)`;
        updateControls();
    }

    function updateControls() {
        if (cards.length === 0 || totalSlides === 0) {
            prevBtn.disabled = true;
            nextBtn.disabled = true;
            progressBar.style.width = '0%';
            return;
        };

        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= totalSlides - 1; // Check against total *pages*

        let progress = totalSlides > 1 ? (currentIndex / (totalSlides - 1)) * 100 : 100;
        progressBar.style.width = `${progress}%`;
    }

     // Remove potentially existing listeners before adding new ones
    const nextClickHandler = () => {
        if (currentIndex < totalSlides - 1) {
            currentIndex++;
            updateSlider();
        }
    };
    const prevClickHandler = () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    };

    // Clean up old listeners if re-initializing
    nextBtn.removeEventListener('click', nextBtn._clickHandler);
    prevBtn.removeEventListener('click', prevBtn._clickHandler);

    // Store handlers to remove later
    nextBtn._clickHandler = nextClickHandler;
    prevBtn._clickHandler = prevClickHandler;

    nextBtn.addEventListener('click', nextBtn._clickHandler);
    prevBtn.addEventListener('click', prevBtn._clickHandler);

    updateSlider(); // Initial setup
    sliderInitialized = true; // Set flag
}
// --- End Slider Logic ---


// --- Contact Form Modal Logic ---
document.addEventListener('DOMContentLoaded', () => {

    const overlay = document.getElementById('contact-form-overlay');
    const openBtn1 = document.getElementById('open-contact-form');
    const openBtn2 = document.getElementById('open-contact-form-2');
    const terminalBody = document.getElementById('terminal-body');

    const formHTML = `
        <form class="terminal-form" action="https://api.web3forms.com/submit" method="POST">
            <input type="hidden" name="apikey" value="YOUR_WEB3FORMS_API_KEY">
            <input type="hidden" name="subject" value="New Contact Message from your Portfolio">
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
        setTimeout(() => {
            form.classList.add('is-visible');
        }, 100);
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

        // --- EDIT: Add your public key from web3forms.com ---
        const apiKey = "YOUR_WEB3FORMS_API_KEY"; // <-- PUT YOUR KEY HERE
        if (apiKey === "YOUR_WEB3FORMS_API_KEY") {
            terminalBody.innerHTML = `
                <p class="text-red-500">Error: Form not configured.</p>
                <p>Please add your Web3Forms API key in script.js (around line 340).</p>
                <br>
                <button type="button" id="close-contact-form" class="terminal-btn go-back">close()</button>
            `;
            const newCloseBtn = document.getElementById('close-contact-form');
            if (newCloseBtn) newCloseBtn.addEventListener('click', closeModal);
            return;
        }

        form.querySelector('input[name="apikey"]').value = apiKey;
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
                <p>${error.message || 'Please try again later.'}</p>
                <br>
                <button type="button" id="close-contact-form" class="terminal-btn go-back">close()</button>
            `;
             const newCloseBtn = document.getElementById('close-contact-form');
            if (newCloseBtn) newCloseBtn.addEventListener('click', closeModal);
        }
    };

    // Initialize palette buttons and load data when the DOM is ready
    createPaletteButtons();
    loadData();

}); // End DOMContentLoaded
// --- End Contact Form Modal Logic ---
