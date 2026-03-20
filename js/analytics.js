/**
 * Cool Brothers HVAC - Analytics Management
 * 
 * This file handles:
 * - Segment analytics initialization and configuration
 * - Page view tracking
 * - Button and CTA tracking
 * - User interaction analytics
 * - Enhanced event tracking utilities
 */

class AnalyticsManager {
    constructor() {
        this.isInitialized = false;
        this.config = null;
        this.queue = [];
        this.segmentKey = null;
        
        // Bind methods to maintain context
        this.init = this.init.bind(this);
        this.track = this.track.bind(this);
        this.page = this.page.bind(this);
        this.identify = this.identify.bind(this);
    }

    /**
     * Initialize analytics with configuration
     */
    async init() {
        if (this.isInitialized) return;

        try {
            // Wait for config to be available
            await this.waitForConfig();
            
            this.config = window.AppConfig;
            const analyticsConfig = this.config.getAnalytics();
            this.segmentKey = analyticsConfig.segmentWriteKey;

            // Initialize Segment if key is provided and valid
            if (this.segmentKey && !this.segmentKey.includes('paste_your_')) {
                await this.initializeSegment();
                this.setupAutoTracking();
                this.processQueue();
                this.isInitialized = true;
                
                console.log('✅ Analytics initialized with Segment');
            } else {
                console.warn('⚠️ Segment Analytics not initialized - missing or invalid write key');
                this.isInitialized = false;
            }
        } catch (error) {
            console.error('❌ Analytics initialization failed:', error);
            this.isInitialized = false;
        }
    }

    /**
     * Wait for AppConfig to be available
     */
    waitForConfig() {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 50; // 5 seconds max wait
            
            const checkConfig = () => {
                if (typeof window.AppConfig !== 'undefined') {
                    resolve();
                } else if (attempts >= maxAttempts) {
                    reject(new Error('Configuration not loaded within timeout'));
                } else {
                    attempts++;
                    setTimeout(checkConfig, 100);
                }
            };
            
            checkConfig();
        });
    }

    /**
     * Initialize Segment Analytics
     */
    initializeSegment() {
        return new Promise((resolve) => {
            // Create Segment snippet if not already loaded
            if (typeof window.analytics === 'undefined') {
                !function() {
                    var analytics = window.analytics = window.analytics || [];
                    if (!analytics.initialize) {
                        if (analytics.invoked) {
                            window.console && console.error && console.error("Segment snippet included twice.");
                        } else {
                            analytics.invoked = !0;
                            analytics.methods = ["trackSubmit", "trackClick", "trackLink", "trackForm", 
                                               "pageview", "identify", "reset", "group", "track", "ready", 
                                               "alias", "debug", "page", "once", "off", "on", 
                                               "addSourceMiddleware", "addIntegrationMiddleware", 
                                               "setAnonymousId", "addDestinationMiddleware"];
                            analytics.factory = function(e) {
                                return function() {
                                    var t = Array.prototype.slice.call(arguments);
                                    t.unshift(e);
                                    analytics.push(t);
                                    return analytics;
                                }
                            };
                            for (var e = 0; e < analytics.methods.length; e++) {
                                var key = analytics.methods[e];
                                analytics[key] = analytics.factory(key);
                            }
                            analytics.load = function(key, e) {
                                var t = document.createElement("script");
                                t.type = "text/javascript";
                                t.async = !0;
                                t.src = "https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";
                                var n = document.getElementsByTagName("script")[0];
                                n.parentNode.insertBefore(t, n);
                                analytics._loadOptions = e;
                            };
                            analytics.SNIPPET_VERSION = "4.13.2";
                        }
                    }
                }();
            }

            // Load analytics with the configured key
            window.analytics.load(this.segmentKey);
            
            // Wait for analytics to be ready
            window.analytics.ready(() => {
                console.log('📊 Segment Analytics loaded successfully');
                resolve();
            });

            // Fallback timeout
            setTimeout(resolve, 3000);
        });
    }

    /**
     * Setup automatic tracking for common elements
     */
    setupAutoTracking() {
        // Track all buttons automatically
        this.setupButtonTracking();
        
        // Track all links
        this.setupLinkTracking();
        
        // Track form interactions
        this.setupFormTracking();
        
        // Track scroll depth
        this.setupScrollTracking();
        
        // Track page engagement time
        this.setupEngagementTracking();
    }

    /**
     * Setup comprehensive button tracking
     */
    setupButtonTracking() {
        const buttons = document.querySelectorAll('button, .btn, [role="button"], input[type="submit"], input[type="button"]');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const buttonData = this.extractButtonData(button);
                
                this.track('Button Clicked', {
                    ...buttonData,
                    page: window.location.pathname,
                    timestamp: new Date().toISOString()
                });
            });
        });
    }

    /**
     * Extract meaningful data from button elements
     */
    extractButtonData(button) {
        const data = {
            button_text: button.textContent?.trim() || button.value || 'Unknown',
            button_type: button.type || 'button',
            button_id: button.id || null,
            button_class: button.className || null
        };

        // Identify button categories
        const text = data.button_text.toLowerCase();
        const classes = data.button_class?.toLowerCase() || '';
        const id = data.button_id?.toLowerCase() || '';
        
        // CTA Detection
        if (text.includes('call') || text.includes('phone') || button.href?.includes('tel:')) {
            data.button_category = 'phone_cta';
            data.phone_type = text.includes('emergency') ? 'emergency' : 'general';
        } else if (text.includes('email') || button.href?.includes('mailto:')) {
            data.button_category = 'email_cta';
        } else if (text.includes('contact') || text.includes('quote') || text.includes('estimate')) {
            data.button_category = 'contact_cta';
        } else if (text.includes('service') || classes.includes('service')) {
            data.button_category = 'service_cta';
        } else if (text.includes('submit') || data.button_type === 'submit') {
            data.button_category = 'form_submit';
        } else if (classes.includes('nav') || id.includes('nav')) {
            data.button_category = 'navigation';
        } else {
            data.button_category = 'other';
        }

        // Location detection
        if (classes.includes('hero') || id.includes('hero')) {
            data.button_location = 'hero';
        } else if (classes.includes('header') || id.includes('header')) {
            data.button_location = 'header';
        } else if (classes.includes('footer') || id.includes('footer')) {
            data.button_location = 'footer';
        } else if (classes.includes('cta') || id.includes('cta')) {
            data.button_location = 'cta_section';
        } else if (classes.includes('service') || id.includes('service')) {
            data.button_location = 'services_section';
        } else {
            data.button_location = 'content';
        }

        return data;
    }

    /**
     * Setup link tracking
     */
    setupLinkTracking() {
        const links = document.querySelectorAll('a');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.href;
                const text = link.textContent?.trim();
                const isExternal = href && !href.includes(window.location.hostname);
                const isPhone = href && href.startsWith('tel:');
                const isEmail = href && href.startsWith('mailto:');
                
                let eventName = 'Link Clicked';
                const eventData = {
                    link_text: text,
                    link_url: href,
                    page: window.location.pathname,
                    timestamp: new Date().toISOString()
                };

                if (isPhone) {
                    eventName = 'Phone Call Initiated';
                    eventData.phone_number = href.replace('tel:', '');
                    eventData.call_type = text?.toLowerCase().includes('emergency') ? 'emergency' : 'general';
                } else if (isEmail) {
                    eventName = 'Email Clicked';
                    eventData.email_address = href.replace('mailto:', '');
                } else if (isExternal) {
                    eventName = 'Outbound Link Clicked';
                    eventData.external_domain = new URL(href).hostname;
                } else if (href?.startsWith('#')) {
                    eventName = 'Internal Navigation';
                    eventData.target_section = href.substring(1);
                }

                this.track(eventName, eventData);
            });
        });
    }

    /**
     * Setup form tracking
     */
    setupFormTracking() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            // Track form starts
            const inputs = form.querySelectorAll('input, select, textarea');
            let hasStarted = false;
            
            inputs.forEach(input => {
                input.addEventListener('focus', () => {
                    if (!hasStarted) {
                        hasStarted = true;
                        this.track('Form Started', {
                            form_id: form.id || 'unnamed',
                            form_name: form.name || 'unnamed',
                            page: window.location.pathname,
                            timestamp: new Date().toISOString()
                        });
                    }
                });
            });

            // Track form submissions
            form.addEventListener('submit', () => {
                this.track('Form Submitted', {
                    form_id: form.id || 'unnamed',
                    form_name: form.name || 'unnamed',
                    page: window.location.pathname,
                    timestamp: new Date().toISOString()
                });
            });
        });
    }

    /**
     * Setup scroll depth tracking
     */
    setupScrollTracking() {
        let maxScrollPercent = 0;
        let scrollMilestones = [25, 50, 75, 100];
        let trackedMilestones = new Set();

        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );

            if (scrollPercent > maxScrollPercent) {
                maxScrollPercent = scrollPercent;

                // Track milestones
                scrollMilestones.forEach(milestone => {
                    if (scrollPercent >= milestone && !trackedMilestones.has(milestone)) {
                        trackedMilestones.add(milestone);
                        
                        this.track('Scroll Depth', {
                            scroll_percentage: milestone,
                            page: window.location.pathname,
                            timestamp: new Date().toISOString()
                        });
                    }
                });
            }
        });
    }

    /**
     * Setup page engagement tracking
     */
    setupEngagementTracking() {
        let startTime = Date.now();
        let isActive = true;

        // Track when user becomes inactive
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && isActive) {
                const engagementTime = Math.round((Date.now() - startTime) / 1000);
                
                this.track('Page Engagement', {
                    engagement_time_seconds: engagementTime,
                    page: window.location.pathname,
                    timestamp: new Date().toISOString()
                });
                
                isActive = false;
            } else if (!document.hidden && !isActive) {
                startTime = Date.now();
                isActive = true;
            }
        });

        // Track on page unload
        window.addEventListener('beforeunload', () => {
            if (isActive) {
                const engagementTime = Math.round((Date.now() - startTime) / 1000);
                
                this.track('Page Engagement', {
                    engagement_time_seconds: engagementTime,
                    page: window.location.pathname,
                    timestamp: new Date().toISOString()
                });
            }
        });
    }

    /**
     * Track an analytics event
     */
    track(eventName, properties = {}) {
        if (!this.isInitialized) {
            this.queue.push({ method: 'track', args: [eventName, properties] });
            return;
        }

        // Add default context
        const enrichedProperties = {
            ...properties,
            business_name: this.config?.get('BUSINESS_NAME') || 'Cool Brothers HVAC',
            page_url: window.location.href,
            page_path: window.location.pathname,
            referrer: document.referrer,
            user_agent: navigator.userAgent,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            timestamp: new Date().toISOString()
        };

        // Track with Segment
        if (typeof window.analytics !== 'undefined' && window.analytics.track) {
            window.analytics.track(eventName, enrichedProperties);
        }

        // Log in development
        if (this.config?.isDevelopment()) {
            console.log('📊 Analytics Event:', eventName, enrichedProperties);
        }
    }

    /**
     * Track a page view
     */
    page(pageName, properties = {}) {
        if (!this.isInitialized) {
            this.queue.push({ method: 'page', args: [pageName, properties] });
            return;
        }

        const pageProperties = {
            ...properties,
            business_name: this.config?.get('BUSINESS_NAME') || 'Cool Brothers HVAC',
            page_title: document.title,
            page_url: window.location.href,
            page_path: window.location.pathname,
            referrer: document.referrer,
            timestamp: new Date().toISOString()
        };

        // Track with Segment
        if (typeof window.analytics !== 'undefined' && window.analytics.page) {
            window.analytics.page(pageName, pageProperties);
        }

        // Log in development
        if (this.config?.isDevelopment()) {
            console.log('📊 Page View:', pageName, pageProperties);
        }
    }

    /**
     * Identify a user
     */
    identify(userId, traits = {}) {
        if (!this.isInitialized) {
            this.queue.push({ method: 'identify', args: [userId, traits] });
            return;
        }

        if (typeof window.analytics !== 'undefined' && window.analytics.identify) {
            window.analytics.identify(userId, traits);
        }

        if (this.config?.isDevelopment()) {
            console.log('📊 User Identified:', userId, traits);
        }
    }

    /**
     * Process queued events
     */
    processQueue() {
        while (this.queue.length > 0) {
            const { method, args } = this.queue.shift();
            this[method](...args);
        }
    }

    /**
     * Track specific HVAC business events
     */
    trackHVACEvent(eventType, properties = {}) {
        const hvacEventMap = {
            'service_inquiry': 'Service Inquiry Started',
            'emergency_call': 'Emergency Service Called',
            'quote_request': 'Quote Requested',
            'appointment_book': 'Appointment Booking Started',
            'service_area_check': 'Service Area Checked'
        };

        const eventName = hvacEventMap[eventType] || eventType;
        this.track(eventName, properties);
    }
}

// Create global analytics instance
window.Analytics = new AnalyticsManager();

// Initialize analytics when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.Analytics.init().then(() => {
            // Track initial page view
            window.Analytics.page();
        });
    });
} else {
    // DOM already loaded
    window.Analytics.init().then(() => {
        // Track initial page view
        window.Analytics.page();
    });
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnalyticsManager;
}