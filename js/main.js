/**
 * Cool Brothers HVAC - Main JavaScript File
 * 
 * This file contains the main functionality for the website including:
 * - Dynamic content population from configuration
 * - Event tracking and analytics 
 * - Navigation and UI interactions
 * - Smooth scrolling and animations
 */

class CoolBrothersApp {
    constructor() {
        this.config = null;
        this.isInitialized = false;
        
        // Bind methods to maintain context
        this.init = this.init.bind(this);
        this.populateContent = this.populateContent.bind(this);
        this.setupEventListeners = this.setupEventListeners.bind(this);
        this.setupNavigation = this.setupNavigation.bind(this);
        this.setupAnalytics = this.setupAnalytics.bind(this);
    }

    /**
     * Initialize the application
     */
    init() {
        if (this.isInitialized) return;

        try {
            // Wait for config to be available
            if (typeof window.AppConfig === 'undefined') {
                console.warn('Configuration not loaded yet, retrying...');
                setTimeout(this.init, 100);
                return;
            }

            this.config = window.AppConfig;
            this.isInitialized = true;

            // Initialize all components
            this.populateContent();
            this.setupEventListeners();
            this.setupNavigation();
            this.setupAnalytics();
            this.setupTestimonials();

            console.log('✅ Cool Brothers HVAC app initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing app:', error);
        }
    }

    /**
     * Populate dynamic content from configuration
     */
    populateContent() {
        const business = this.config.getBusiness();
        
        try {
            // Update page title
            document.title = `${business.name} - Professional Heating & Cooling Services`;
            
            // Update meta description
            const metaDesc = document.querySelector('meta[name=\"description\"]');
            if (metaDesc) {
                metaDesc.content = `${business.name} - Professional heating, cooling, and ventilation services for residential and commercial properties. Emergency repairs available 24/7.`;
            }

            // Company name elements
            const companyNameElements = document.querySelectorAll('.company-name, .footer__company-name, [data-business-name]');
            companyNameElements.forEach(el => el.textContent = business.name);

            // Phone number elements
            this.updatePhoneElements(business);
            
            // Email elements
            this.updateEmailElements(business);
            
            // Address elements
            this.updateAddressElements(business);
            
            // Logo elements (alt text)
            const logoElements = document.querySelectorAll('img[alt*=\"ProComfort\"], img[alt*=\"Cool Brothers\"]');
            logoElements.forEach(el => el.alt = business.name);

            console.log('📝 Content populated successfully');
        } catch (error) {
            console.error('❌ Error populating content:', error);
        }
    }

    /**
     * Update phone number elements with tracking
     */
    updatePhoneElements(business) {
        // Hero phone button
        const heroPhoneBtn = document.getElementById('heroPhoneBtn');
        if (heroPhoneBtn) {
            heroPhoneBtn.href = `tel:${business.phoneRaw}`;
            heroPhoneBtn.querySelector('.phone-text').textContent = `Call Now: ${business.phone}`;
            heroPhoneBtn.onclick = (e) => this.trackPhoneCall('hero', business.phone);
        }

        // Header emergency button
        const headerEmergencyBtn = document.getElementById('headerEmergencyBtn');
        if (headerEmergencyBtn) {
            headerEmergencyBtn.href = `tel:${business.emergencyPhoneRaw}`;
            headerEmergencyBtn.querySelector('.emergency-text').textContent = `Emergency: ${business.emergencyPhone}`;
            headerEmergencyBtn.onclick = (e) => this.trackPhoneCall('header', business.emergencyPhone, 'emergency');
        }

        // CTA emergency button
        const ctaEmergencyBtn = document.getElementById('ctaEmergencyBtn');
        if (ctaEmergencyBtn) {
            ctaEmergencyBtn.href = `tel:${business.emergencyPhoneRaw}`;
            ctaEmergencyBtn.querySelector('.emergency-text').textContent = `Emergency: ${business.emergencyPhone}`;
            ctaEmergencyBtn.onclick = (e) => this.trackPhoneCall('bottom_cta', business.emergencyPhone, 'emergency');
        }

        // Footer phone link
        const footerPhoneLink = document.getElementById('footerPhoneLink');
        if (footerPhoneLink) {
            footerPhoneLink.href = `tel:${business.phoneRaw}`;
            footerPhoneLink.textContent = business.phone;
            footerPhoneLink.onclick = (e) => this.trackPhoneCall('footer', business.phone);
        }
    }

    /**
     * Update email elements with tracking
     */
    updateEmailElements(business) {
        const footerEmailLink = document.getElementById('footerEmailLink');
        if (footerEmailLink) {
            footerEmailLink.href = `mailto:${business.email}`;
            footerEmailLink.textContent = business.email;
            footerEmailLink.onclick = (e) => this.trackEmailClick(business.email, 'footer');
        }
    }

    /**
     * Update address elements
     */
    updateAddressElements(business) {
        const footerAddress = document.getElementById('footerAddress');
        if (footerAddress) {
            footerAddress.textContent = business.address;
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
                
                // Track menu interaction
                ConfigUtils.trackEvent('Menu Interaction', {
                    action: isExpanded ? 'close' : 'open',
                    device: 'mobile'
                });
            });
        }

        // Service card interactions
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                ConfigUtils.trackEvent('Service Card Hovered', {
                    service: card.querySelector('.service-card__title')?.textContent
                });
            });
        });

        // Scroll tracking for engagement
        this.setupScrollTracking();
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
                    
                    // Track navigation
                    ConfigUtils.trackEvent('Internal Navigation', {
                        target: targetId,
                        source: 'smooth_scroll'
                    });
                }
            });
        });

        // Active navigation highlighting
        this.setupActiveNavigation();
    }

    /**
     * Setup analytics tracking
     */
    setupAnalytics() {
        // Track page load completion
        window.addEventListener('load', () => {
            ConfigUtils.trackEvent('Page Loaded', {
                loadTime: performance.now(),
                userAgent: navigator.userAgent,
                viewport: `${window.innerWidth}x${window.innerHeight}`
            });
        });

        // Track outbound links
        const outboundLinks = document.querySelectorAll('a[href^=\"http\"]:not([href*=\"coolbrothershvac.com\"])');
        outboundLinks.forEach(link => {
            link.addEventListener('click', () => {
                ConfigUtils.trackEvent('Outbound Link Clicked', {
                    url: link.href,
                    text: link.textContent
                });
            });
        });
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
            
            // Track testimonial view
            ConfigUtils.trackEvent('Testimonial Viewed', {
                author: testimonials[currentIndex].author,
                index: currentIndex
            });
        }, 5000);
    }

    /**
     * Setup scroll tracking for engagement metrics
     */
    setupScrollTracking() {
        let scrollDepth = 0;
        const milestones = [25, 50, 75, 90];
        
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );
            
            milestones.forEach(milestone => {
                if (scrollPercent >= milestone && scrollDepth < milestone) {
                    scrollDepth = milestone;
                    ConfigUtils.trackEvent('Scroll Depth', {
                        depth: milestone,
                        page: window.location.pathname
                    });
                }
            });
        });
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

    /**
     * Track phone call events 
     */
    trackPhoneCall(location, phone, type = 'general') {
        ConfigUtils.trackEvent('Phone Call Initiated', {
            location,
            phone,
            type,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Track email click events
     */
    trackEmailClick(email, location) {
        ConfigUtils.trackEvent('Email Clicked', {
            email,
            location,
            timestamp: new Date().toISOString()
        });
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