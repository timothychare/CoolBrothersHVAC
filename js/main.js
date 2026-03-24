/**
 * Cool Brothers HVAC - Main JavaScript File
 * 
 * This file contains the main functionality for the website including:
 * - Navigation and UI interactions
 * - Smooth scrolling and animations
 */

class CoolBrothersApp {
    constructor() {
        this.isInitialized = false;
        
        // Bind methods to maintain context
        this.init = this.init.bind(this);
        this.setupEventListeners = this.setupEventListeners.bind(this);
        this.setupNavigation = this.setupNavigation.bind(this);
    }

    /**
     * Initialize the application
     */
    init() {
        if (this.isInitialized) return;

        try {
            this.isInitialized = true;

            // Initialize all components
            this.setupEventListeners();
            this.setupNavigation();
            this.setupTestimonials();

            console.log('✅ Cool Brothers HVAC app initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing app:', error);
        }
    }
    /**
     * Setup event listeners for UI interactions
     */
    setupEventListeners() {
        // Mobile navigation toggle
        const navToggle = document.querySelector('.navbar__toggle');
        const navMenu = document.querySelector('.navbar__menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
                navToggle.setAttribute('aria-expanded', !isExpanded);
                navMenu.classList.toggle('navbar__menu--active');
            });
        }

        // Service card interactions
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                // Add hover effects here if needed
            });
        });

        // Scroll tracking for engagement (removed)
    }

    /**
     * Setup navigation behaviors
     */
    setupNavigation() {
        // Smooth scrolling for anchor links
        const scrollLinks = document.querySelectorAll('a[href^=\"#\"]:not([href=\"#\"])');
        scrollLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Active navigation highlighting
        this.setupActiveNavigation();
    }

    /**
     * Setup testimonials carousel
     */
    setupTestimonials() {
        const testimonialsData = [
            {
                rating: 5,
                text: "Excellent service! They arrived on time, diagnosed the problem quickly, and had our AC running perfectly within an hour. Highly recommend Cool Brothers HVAC.",
                author: "Sarah Johnson",
                location: "Residential Customer"
            },
            {
                rating: 5,
                text: "Professional technicians who know their stuff. Fixed our heating system just before winter hit. Fair pricing and great communication throughout.",
                author: "Mike Rodriguez",
                location: "Springfield, IL"
            },
            {
                rating: 5,
                text: "We've used Cool Brothers for our office building's HVAC maintenance for 2 years. Always reliable, always professional. Wouldn't trust anyone else.",
                author: "Lisa Chen",
                location: "Business Owner"
            }
        ];

        this.initializeTestimonialCarousel(testimonialsData);
    }

    /**
     * Initialize testimonial carousel with data
     */
    initializeTestimonialCarousel(testimonials) {
        const container = document.getElementById('testimonialsContainer');
        if (!container) return;

        let currentIndex = 0;
        
        // Create testimonial elements
        container.innerHTML = '';
        testimonials.forEach((testimonial, index) => {
            const card = document.createElement('div');
            card.className = `testimonial-card ${index === 0 ? 'testimonial-card--active' : ''}`;
            card.innerHTML = `
                <div class=\"testimonial-card__rating\">
                    ${'⭐'.repeat(testimonial.rating)}
                </div>
                <blockquote class=\"testimonial-card__quote\">
                    ${testimonial.text}
                </blockquote>
                <cite class=\"testimonial-card__author\">
                    <strong>${testimonial.author}</strong>
                    <span>${testimonial.location}</span>
                </cite>
            `;
            container.appendChild(card);
        });

        // Auto-rotate testimonials
        setInterval(() => {
            const cards = container.querySelectorAll('.testimonial-card');
            cards[currentIndex].classList.remove('testimonial-card--active');
            currentIndex = (currentIndex + 1) % testimonials.length;
            cards[currentIndex].classList.add('testimonial-card--active');
        }, 5000);
    }

    /**
     * Setup active navigation highlighting based on scroll position
     */
    setupActiveNavigation() {
        const navLinks = document.querySelectorAll('.navbar__link[href^=\"#\"]');
        const sections = Array.from(navLinks).map(link => 
            document.querySelector(link.getAttribute('href'))
        ).filter(Boolean);

        if (sections.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => link.classList.remove('navbar__link--active'));
                    const activeLink = document.querySelector(`.navbar__link[href=\"#${entry.target.id}\"]`);
                    if (activeLink) {
                        activeLink.classList.add('navbar__link--active');
                    }
                }
            });
        }, { threshold: 0.3 });

        sections.forEach(section => observer.observe(section));
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.CoolBrothersApp = new CoolBrothersApp();
    window.CoolBrothersApp.init();
});

// Also initialize on window load as backup
window.addEventListener('load', () => {
    if (!window.CoolBrothersApp?.isInitialized) {
        window.CoolBrothersApp = new CoolBrothersApp();
        window.CoolBrothersApp.init();
    }
});

// Export for testing/debugging
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CoolBrothersApp;
}