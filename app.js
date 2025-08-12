// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize page state
    let currentPage = 'homepage';
    
    // Mobile navigation toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Page Navigation Functions
    window.showApplicationPage = function() {
        const homepage = document.getElementById('homepage');
        const applicationPage = document.getElementById('applicationPage');
        
        if (homepage && applicationPage) {
            homepage.classList.add('hidden');
            applicationPage.classList.remove('hidden');
            currentPage = 'applicationPage';
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Close mobile menu if open
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (hamburger) hamburger.classList.remove('active');
            }
        }
    };

    window.showHomepage = function() {
        const homepage = document.getElementById('homepage');
        const applicationPage = document.getElementById('applicationPage');
        
        if (homepage && applicationPage) {
            applicationPage.classList.add('hidden');
            homepage.classList.remove('hidden');
            currentPage = 'homepage';
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Smooth scrolling for navigation links (only works on homepage)
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#' || targetId === '#registration') return; // Skip placeholder links
            
            // If we're not on homepage and trying to navigate to a section, go to homepage first
            if (currentPage !== 'homepage' && targetId.startsWith('#')) {
                e.preventDefault();
                showHomepage();
                
                // After a short delay, scroll to the target section
                setTimeout(() => {
                    const targetSection = document.querySelector(targetId);
                    if (targetSection) {
                        const navbar = document.querySelector('.navbar');
                        const navbarHeight = navbar ? navbar.offsetHeight : 80;
                        const targetPosition = targetSection.offsetTop - navbarHeight - 20;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }, 100);
                return;
            }
            
            // Handle normal section scrolling on homepage
            if (currentPage === 'homepage') {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const navbar = document.querySelector('.navbar');
                    const navbarHeight = navbar ? navbar.offsetHeight : 80;
                    const targetPosition = targetSection.offsetTop - navbarHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    if (navMenu && navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        if (hamburger) hamburger.classList.remove('active');
                    }
                }
            }
        });
    });

    // Registration form handling
    const registrationForm = document.getElementById('registrationForm');
    const successModal = document.getElementById('successModal');
    const closeModalBtn = document.getElementById('closeModal');

    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Clear any existing error messages
            clearFormErrors();
            
            // Get form data
            const formData = new FormData(this);
            const data = {};
            
            // Convert FormData to regular object
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            
            // Basic validation
            if (validateRegistrationForm(data)) {
                // Simulate form submission
                submitRegistrationForm(data);
            }
        });
    }

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Clear any existing error messages
            clearFormErrors();
            
            // Get form data
            const formData = new FormData(this);
            const data = {};
            
            // Convert FormData to regular object
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            
            // Basic validation
            if (validateContactForm(data)) {
                // Simulate form submission
                submitContactForm(data);
            }
        });
    }

    // Modal handling
    if (closeModalBtn && successModal) {
        closeModalBtn.addEventListener('click', function() {
            successModal.classList.add('hidden');
        });

        // Close modal when clicking outside of it
        successModal.addEventListener('click', function(e) {
            if (e.target === successModal) {
                successModal.classList.add('hidden');
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !successModal.classList.contains('hidden')) {
                successModal.classList.add('hidden');
            }
        });
    }

    // Add active state to navigation based on scroll position (only on homepage)
    window.addEventListener('scroll', debounce(function() {
        if (currentPage !== 'homepage') return;
        
        const sections = document.querySelectorAll('#homepage section[id]');
        const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
        
        let current = '';
        const scrollY = window.pageYOffset;
        const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 80;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 100;
            const sectionHeight = section.offsetHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, 50));

    // Video background handling
    const video = document.querySelector('.video-background video');
    if (video) {
        // Ensure video plays on mobile devices
        video.addEventListener('loadedmetadata', function() {
            this.play().catch(function(error) {
                console.log('Video autoplay failed:', error);
            });
        });
        
        // Handle video errors
        video.addEventListener('error', function(e) {
            console.log('Video error:', e);
            // Video will fall back to CSS background
        });
    }
});

// Utility function to clear form errors
function clearFormErrors() {
    const existingErrors = document.querySelectorAll('.form-error');
    existingErrors.forEach(error => error.remove());
}

// Form validation functions
function validateRegistrationForm(data) {
    const errors = [];
    
    // Required fields validation
    if (!data.fullName || data.fullName.trim().length < 2) {
        errors.push('Full name must be at least 2 characters long');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.phone || data.phone.trim().length < 10) {
        errors.push('Please enter a valid phone number');
    }
    
    if (!data.education || data.education === '') {
        errors.push('Please select your educational background');
    }
    
    if (!data.program || data.program === '') {
        errors.push('Please select a preferred program');
    }
    
    if (!data.motivation || data.motivation.trim().length < 10) {
        errors.push('Please provide more details about your motivation (at least 10 characters)');
    }
    
    // Display errors if any
    if (errors.length > 0) {
        displayFormErrors(errors, 'registrationForm');
        return false;
    }
    
    return true;
}

function validateContactForm(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.subject || data.subject.trim().length < 3) {
        errors.push('Subject must be at least 3 characters long');
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.push('Message must be at least 10 characters long');
    }
    
    if (errors.length > 0) {
        displayFormErrors(errors, 'contactForm');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function displayFormErrors(errors, formId) {
    // Remove existing error messages
    clearFormErrors();
    
    // Create and display error message
    const errorContainer = document.createElement('div');
    errorContainer.className = 'form-error';
    errorContainer.style.cssText = `
        background: rgba(var(--color-error-rgb), 0.1);
        color: var(--color-error);
        padding: var(--space-16);
        border-radius: var(--radius-base);
        margin-bottom: var(--space-16);
        border: 1px solid rgba(var(--color-error-rgb), 0.2);
    `;
    
    const errorTitle = document.createElement('h4');
    errorTitle.textContent = 'Please fix the following errors:';
    errorTitle.style.cssText = `
        margin: 0 0 var(--space-8) 0;
        font-size: var(--font-size-md);
    `;
    
    const errorList = document.createElement('ul');
    errorList.style.cssText = `
        margin: 0;
        padding-left: var(--space-20);
    `;
    
    errors.forEach(error => {
        const errorItem = document.createElement('li');
        errorItem.textContent = error;
        errorItem.style.marginBottom = 'var(--space-4)';
        errorList.appendChild(errorItem);
    });
    
    errorContainer.appendChild(errorTitle);
    errorContainer.appendChild(errorList);
    
    // Insert error container at the top of the form
    const activeForm = document.getElementById(formId);
    
    if (activeForm) {
        activeForm.insertBefore(errorContainer, activeForm.firstChild);
        
        // Scroll to error message
        errorContainer.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }
}

function submitRegistrationForm(data) {
    // Show loading state
    const submitButton = document.querySelector('#registrationForm button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Clear form
        document.getElementById('registrationForm').reset();
        
        // Show success modal
        const successModal = document.getElementById('successModal');
        if (successModal) {
            successModal.classList.remove('hidden');
        }
        
        // Log form data (in real implementation, this would be sent to server)
        console.log('Registration form submitted:', data);
        
        // Remove any error messages
        clearFormErrors();
        
    }, 1000); // Simulate network delay
}

function submitContactForm(data) {
    // Show loading state
    const submitButton = document.querySelector('#contactForm button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Clear form
        document.getElementById('contactForm').reset();
        
        // Show success message
        showSuccessMessage('Message sent successfully! We\'ll get back to you within 24 hours.');
        
        // Log form data (in real implementation, this would be sent to server)
        console.log('Contact form submitted:', data);
        
        // Remove any error messages
        clearFormErrors();
        
    }, 1000); // Simulate network delay
}

function showSuccessMessage(message) {
    // Create success message element
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.cssText = `
        background: rgba(var(--color-success-rgb), 0.1);
        color: var(--color-success);
        padding: var(--space-16);
        border-radius: var(--radius-base);
        margin-bottom: var(--space-16);
        border: 1px solid rgba(var(--color-success-rgb), 0.2);
        text-align: center;
        font-weight: var(--font-weight-medium);
        animation: fadeIn 0.3s ease-in-out;
    `;
    successDiv.innerHTML = `<strong>✓</strong> ${message}`;
    
    // Insert at the top of the contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.insertBefore(successDiv, contactForm.firstChild);
        
        // Scroll to success message
        successDiv.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            if (successDiv && successDiv.parentNode) {
                successDiv.style.animation = 'fadeOut 0.3s ease-in-out';
                setTimeout(() => {
                    if (successDiv.parentNode) {
                        successDiv.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
}

// File upload handling
document.addEventListener('change', function(e) {
    if (e.target.type === 'file') {
        const file = e.target.files[0];
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        
        if (file) {
            // Check file size
            if (file.size > maxSize) {
                alert('File size must be less than 5MB');
                e.target.value = '';
                return;
            }
            
            // Check file type
            if (!allowedTypes.includes(file.type)) {
                alert('Please upload a PDF, DOC, or DOCX file');
                e.target.value = '';
                return;
            }
            
            // Show file name
            const fileName = file.name;
            const fileInput = e.target;
            const helpText = fileInput.parentNode.querySelector('.form-help');
            
            if (helpText) {
                helpText.textContent = `✓ Selected: ${fileName}`;
                helpText.style.color = 'var(--color-success)';
            }
        }
    }
});

// Enhanced scroll animations
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.card, .stat, .hero-content, .solution-card');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Initialize scroll animations when page loads
window.addEventListener('load', function() {
    addScrollAnimations();
    
    // Handle video autoplay after page load
    const video = document.querySelector('.video-background video');
    if (video) {
        video.play().catch(function(error) {
            console.log('Video autoplay failed:', error);
        });
    }
});

// Performance optimization: Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Utility function to handle form input focus effects
document.addEventListener('focus', function(e) {
    if (e.target.classList.contains('form-control')) {
        e.target.parentNode.classList.add('focused');
    }
}, true);

document.addEventListener('blur', function(e) {
    if (e.target.classList.contains('form-control')) {
        e.target.parentNode.classList.remove('focused');
        
        // Add validation styling
        if (e.target.value.trim() !== '') {
            if (e.target.checkValidity()) {
                e.target.classList.add('valid');
                e.target.classList.remove('invalid');
            } else {
                e.target.classList.add('invalid');
                e.target.classList.remove('valid');
            }
        }
    }
}, true);

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Handle Enter key on buttons
    if (e.key === 'Enter' && e.target.classList.contains('btn')) {
        e.target.click();
    }
    
    // Handle Tab navigation improvements
    if (e.key === 'Tab') {
        const focusedElement = document.activeElement;
        if (focusedElement && focusedElement.classList.contains('btn')) {
            focusedElement.classList.add('keyboard-focus');
            
            // Remove keyboard focus class after a short delay
            setTimeout(() => {
                focusedElement.classList.remove('keyboard-focus');
            }, 3000);
        }
    }
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    const navbar = document.querySelector('.navbar');
    
    if (navMenu && hamburger && navbar) {
        if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    }
});

// Handle browser back/forward navigation
window.addEventListener('popstate', function(e) {
    // This would be enhanced in a real single-page application
    // For now, just ensure we're on the homepage
    showHomepage();
});

// Add error tracking for development
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});

// Add unhandled promise rejection tracking
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
});

// Optimize video loading for better performance
document.addEventListener('DOMContentLoaded', function() {
    const video = document.querySelector('.video-background video');
    if (video) {
        // Set video properties for better performance
        video.preload = 'metadata';
        video.playsInline = true;
        
        // Handle video loading states
        video.addEventListener('loadstart', function() {
            console.log('Video loading started');
        });
        
        video.addEventListener('canplay', function() {
            console.log('Video can start playing');
        });
        
        video.addEventListener('playing', function() {
            console.log('Video is playing');
        });
    }
});

// Add smooth page transitions
function addPageTransitionEffects() {
    const style = document.createElement('style');
    style.textContent = `
        .page-transition {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.3s ease, transform 0.3s ease;
        }
        
        .page-transition.active {
            opacity: 1;
            transform: translateY(0);
        }
        
        .card, .stat, .solution-card, .program-card {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .keyboard-focus {
            box-shadow: var(--focus-ring) !important;
        }
        
        @media (max-width: 768px) {
            .nav-menu {
                display: none;
            }
            
            .nav-menu.active {
                display: flex !important;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: var(--color-surface);
                flex-direction: column;
                padding: var(--space-16);
                border: 1px solid var(--color-border);
                border-top: none;
                box-shadow: var(--shadow-lg);
                z-index: 1000;
            }
            
            .hamburger {
                display: flex;
            }
            
            .hamburger.active span:nth-child(1) {
                transform: rotate(45deg) translate(5px, 5px);
            }
            
            .hamburger.active span:nth-child(2) {
                opacity: 0;
            }
            
            .hamburger.active span:nth-child(3) {
                transform: rotate(-45deg) translate(7px, -6px);
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize page transition effects
addPageTransitionEffects();

// Add intersection observer for better performance
const createIntersectionObserver = () => {
    const options = {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    };

    return new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, options);
};

// Initialize observers when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const observer = createIntersectionObserver();
    const elementsToAnimate = document.querySelectorAll('.card, .stat, .solution-card, .program-card');
    
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
});

/* 
VIDEO REPLACEMENT INSTRUCTIONS:
===============================

To replace the placeholder video with your own:

1. Add your video files to the same directory as this HTML file
2. Replace the src attributes in the HTML video element:
   - Replace "your-video.mp4" with your MP4 video filename
   - Replace "your-video.webm" with your WebM video filename (optional)

3. Recommended video specifications:
   - Duration: 10-30 seconds (loops automatically)
   - Resolution: 1920x1080 (Full HD) or higher
   - File size: Under 50MB for better loading times
   - Format: MP4 (H.264) for best browser compatibility
   - Additional format: WebM for better compression (optional)

4. Video content suggestions:
   - Tech office environment
   - Coding/development scenes
   - Team collaboration
   - Modern technology concepts
   - Abstract tech animations

5. If no video is available, the CSS background gradient will be used as fallback

Example replacement:
<video autoplay muted loop playsinline>
    <source src="tech-office-video.mp4" type="video/mp4">
    <source src="tech-office-video.webm" type="video/webm">
</video>
*/