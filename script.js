document.addEventListener('DOMContentLoaded', () => {
    // Scroll Animation Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up');
    animatedElements.forEach(el => observer.observe(el));

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Simple burger animation
            const bars = mobileMenuBtn.querySelectorAll('.bar');
            // You could add a class to animate bars to 'X' here if desired in CSS
        });
    }

    // Smooth scroll for anchor links (extra safety/polish)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close menu on click if mobile
                if (navLinks) navLinks.classList.remove('active');
            }
        });
    });

    // Skill Bar Animation
    const skillSection = document.getElementById('skills');
    const progressFills = document.querySelectorAll('.progress-fill');

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                progressFills.forEach(fill => {
                    const width = fill.getAttribute('data-width');
                    fill.style.width = width;
                });
                // Stop observing once animated
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (skillSection) {
        skillObserver.observe(skillSection);
    }

    // Timeline Line Animation
    const timelineSection = document.querySelector('.journey-section');
    const timelineLine = document.querySelector('.timeline-line-progress');

    if (timelineSection && timelineLine) {
        window.addEventListener('scroll', () => {
            const sectionTop = timelineSection.offsetTop;
            const sectionHeight = timelineSection.offsetHeight;
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;

            // Start filling when the section enters the view (offset by some margin)
            const startPoint = sectionTop - windowHeight / 2;
            const endPoint = sectionTop + sectionHeight - windowHeight / 2;

            let scrollPercentage = (scrollY - startPoint) / (endPoint - startPoint);

            // Clamp between 0 and 1
            if (scrollPercentage < 0) scrollPercentage = 0;
            if (scrollPercentage > 1) scrollPercentage = 1;

            timelineLine.style.height = `${scrollPercentage * 100}%`;
        });
    }



    // Cursor Parallax Animation
    const globe1 = document.querySelector('.globe-1');
    const globe2 = document.querySelector('.globe-2');

    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;

        // Parallax Effect for Globes
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const xRel = (x / windowWidth) - 0.5;
        const yRel = (y / windowHeight) - 0.5;

        if (globe1) {
            globe1.style.transform = `translate(${xRel * 100}px, ${yRel * 100}px)`;
        }
        if (globe2) {
            globe2.style.transform = `translate(${xRel * -120}px, ${yRel * -120}px)`;
        }
    });
});

// Chat Widget Logic
const chatToggle = document.getElementById('chat-toggle');
const chatWindow = document.getElementById('chat-window');
const chatClose = document.getElementById('chat-close');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');
const chatMessages = document.getElementById('chat-messages');

if (chatToggle && chatWindow) {
    // Toggle Visibility
    chatToggle.addEventListener('click', () => {
        chatWindow.classList.toggle('hidden');
        if (!chatWindow.classList.contains('hidden')) {
            chatInput.focus();
        }
    });

    chatClose.addEventListener('click', () => {
        chatWindow.classList.add('hidden');
    });

    // Send Message Logic
    function sendMessage() {
        const text = chatInput.value.trim();
        if (text) {
            // Add User Message
            addMessage(text, 'user');
            chatInput.value = '';

            // Show Typing Indicator
            const typingId = showTypingIndicator();

            // Simulate AI Thinking
            setTimeout(() => {
                const response = getBotResponse(text);
                removeTypingIndicator(typingId);
                addMessage(response, 'bot');
            }, 1500);
        }
    }

    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}

function showTypingIndicator() {
    const id = 'typing-' + Date.now();
    const div = document.createElement('div');
    div.classList.add('typing-indicator');
    div.id = id;
    div.innerHTML = `
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
    `;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return id;
}

function removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

function addMessage(text, sender) {
    const div = document.createElement('div');
    div.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
    div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getBotResponse(input) {
    input = input.toLowerCase();

    // Simple Keyword Matching
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
        return "Hello there! How can I help you today?";
    } else if (input.includes('who are you') || input.includes('name') || input.includes('what do you do')) {
        return "I'm Tharun's AI assistant. Tharun is a passionate developer and digital creator!";
    } else if (input.includes('contact') || input.includes('email') || input.includes('reach')) {
        return "You can reach Tharun at tharundunna17@gmail.com or use the contact form on this page!";
    } else if (input.includes('skills') || input.includes('experience')) {
        return "Tharun is skilled in Web Development, UI/UX Design, and creating modern digital experiences.";
    } else if (input.includes('project') || input.includes('work')) {
        return "Check out the 'Expertise' section to see what Tharun can do!";
    } else if (input.includes('bye')) {
        return "Goodbye! Have a great day!";
    } else {
        return "I'm not sure about that. Try asking about 'skills', 'contact', or 'projects'!";
    }
}

// Bubble Animation
const canvas = document.getElementById('bubble-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    const bubbles = [];
    const maxBubbles = 50;

    class Bubble {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 5 + 2;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.color = `rgba(${Math.random() > 0.5 ? '99, 102, 241' : '236, 72, 153'}, ${Math.random() * 0.5 + 0.1})`;
        }

        update(mouseX, mouseY) {
            this.x += this.speedX;
            this.y += this.speedY;

            // Boundary checks
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

            // Mouse interaction
            if (mouseX && mouseY) {
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 100) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (100 - distance) / 100;
                    const directionX = forceDirectionX * force * 2;
                    const directionY = forceDirectionY * force * 2;
                    this.x -= directionX;
                    this.y -= directionY;
                }
            }

            this.draw();
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    function init() {
        for (let i = 0; i < maxBubbles; i++) {
            bubbles.push(new Bubble());
        }
    }

    let mouseX = null;
    let mouseY = null;

    canvas.parentElement.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });

    canvas.parentElement.addEventListener('mouseleave', () => {
        mouseX = null;
        mouseY = null;
    });

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        bubbles.forEach(bubble => bubble.update(mouseX, mouseY));
        requestAnimationFrame(animate);
    }

    init();
    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
    });
}

// Auth Modal Logic
const authModal = document.getElementById('auth-modal');
const loginBtn = document.getElementById('login-btn');
const authClose = document.getElementById('auth-close');
const loginContainer = document.getElementById('login-container');
const registerContainer = document.getElementById('register-container');
const switchToRegister = document.getElementById('switch-to-register');
const switchToLogin = document.getElementById('switch-to-login');

if (authModal && loginBtn && authClose) {
    // Open Modal
    loginBtn.addEventListener('click', () => {
        authModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });

    // Close Modal
    authClose.addEventListener('click', () => {
        authModal.classList.add('hidden');
        document.body.style.overflow = '';
    });

    // Close on Outside Click
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
            authModal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    });

    // Switch to Register
    if (switchToRegister) {
        switchToRegister.addEventListener('click', () => {
            loginContainer.classList.add('hidden');
            registerContainer.classList.remove('hidden');
        });
    }

    // Switch to Login
    if (switchToLogin) {
        switchToLogin.addEventListener('click', () => {
            registerContainer.classList.add('hidden');
            loginContainer.classList.remove('hidden');
        });
    }
}