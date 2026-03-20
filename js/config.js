/**
 * Configuration Management for Cool Brothers HVAC Website
 * 
 * This file manages all environment variables and API keys used throughout the site.
 * In production, these values should be injected during the build process.
 * 
 * SECURITY NOTE: All values in this file will be visible to users.
 * Never include sensitive server-side keys here.
 */

// Environment variable loader for browser (simplified for static sites)
class Config {
    constructor() {
        this.env = this.loadEnvironment();
        this.validateRequired();
    }

    /**
     * Load environment variables
     * In a full build system, these would be injected from .env files
     */
    loadEnvironment() {
        // Default configuration - replace with your actual values
        return {
            // Analytics Configuration
            SEGMENT_WRITE_KEY: 'paste_your_segment_key_here',
            GOOGLE_ANALYTICS_ID: 'UA-XXXXXXXXX-X',

            // API Keys (client-safe only)
            GOOGLE_MAPS_API_KEY: 'your_google_maps_api_key_here',
            EMAILJS_SERVICE_ID: 'your_emailjs_service_id',
            EMAILJS_TEMPLATE_ID: 'your_emailjs_template_id',
            EMAILJS_USER_ID: 'your_emailjs_user_id',

            // Business Configuration
            BUSINESS_NAME: 'Cool Brothers HVAC',
            BUSINESS_EMAIL: 'info@coolbrothershvac.com',
            BUSINESS_PHONE: '(555) 123-4567',
            BUSINESS_PHONE_RAW: '+15551234567',
            EMERGENCY_PHONE: '(555) 123-4567',
            EMERGENCY_PHONE_RAW: '+15551234567',
            BUSINESS_ADDRESS: '123 Main St, Springfield, USA',

            // Website Configuration
            SITE_URL: 'https://coolbrothershvac.com',
            SITE_LOGO: process?.env?.SITE_LOGO || 'assets/images/logo.svg',

            // Social Media
            FACEBOOK_URL: process?.env?.FACEBOOK_URL || '',
            TWITTER_URL: process?.env?.TWITTER_URL || '',
            LINKEDIN_URL: process?.env?.LINKEDIN_URL || '',
            GOOGLE_BUSINESS_URL: process?.env?.GOOGLE_BUSINESS_URL || '',

            // Environment Settings
            ENVIRONMENT: process?.env?.ENVIRONMENT || 'development',
            DEBUG_MODE: process?.env?.DEBUG_MODE === 'true' || true,
            API_BASE_URL: process?.env?.API_BASE_URL || 'https://api.coolbrothershvac.com',

            // Feature Flags
            ENABLE_CHAT_WIDGET: process?.env?.ENABLE_CHAT_WIDGET === 'true' || false,
            ENABLE_BOOKING_SYSTEM: process?.env?.ENABLE_BOOKING_SYSTEM === 'true' || false,
            ENABLE_PAYMENT_PROCESSING: process?.env?.ENABLE_PAYMENT_PROCESSING === 'true' || false,

            // Analytics Events Configuration
            ANALYTICS_EVENTS: {
                CTA_CLICKED: 'CTA Clicked',
                PHONE_CALL_INITIATED: 'Phone Call Initiated',
                EMAIL_CLICKED: 'Email Clicked',
                SERVICE_INQUIRY: 'Service Inquiry',
                FORM_SUBMITTED: 'Form Submitted',
                PAGE_VIEW: 'Page View',
                CALCULATOR_USED: 'Calculator Used',
                EMERGENCY_CONTACT: 'Emergency Contact',
                TESTIMONIAL_VIEWED: 'Testimonial Viewed'
            }
        };
    }

    /**
     * Validate that required configuration values are present
     */
    validateRequired() {
        const required = [
            'BUSINESS_NAME',
            'BUSINESS_EMAIL', 
            'BUSINESS_PHONE'
        ];

        const missing = required.filter(key => !this.env[key] || this.env[key].includes('your_') || this.env[key].includes('paste_'));
        
        if (missing.length > 0 && this.env.DEBUG_MODE) {
            console.warn('⚠️ Missing required configuration values:', missing);
            console.warn('Please update the values in js/config.js or set up environment variables');
        }
    }

    /**
     * Get a configuration value by key
     * @param {string} key - The configuration key
     * @param {*} defaultValue - Default value if key doesn't exist
     * @returns {*} The configuration value
     */
    get(key, defaultValue = null) {
        return this.env[key] ?? defaultValue;
    }

    /**
     * Get business information object
     * @returns {Object} Business information
     */
    getBusiness() {
        return {
            name: this.get('BUSINESS_NAME'),
            email: this.get('BUSINESS_EMAIL'),
            phone: this.get('BUSINESS_PHONE'),
            phoneRaw: this.get('BUSINESS_PHONE_RAW'),
            emergencyPhone: this.get('EMERGENCY_PHONE'),
            emergencyPhoneRaw: this.get('EMERGENCY_PHONE_RAW'),
            address: this.get('BUSINESS_ADDRESS'),
            logo: this.get('SITE_LOGO'),
            website: this.get('SITE_URL')
        };
    }

    /**
     * Get analytics configuration
     * @returns {Object} Analytics configuration
     */
    getAnalytics() {
        return {
            segmentWriteKey: this.get('SEGMENT_WRITE_KEY'),
            googleAnalyticsId: this.get('GOOGLE_ANALYTICS_ID'),
            events: this.get('ANALYTICS_EVENTS'),
            enabled: !this.get('SEGMENT_WRITE_KEY').includes('paste_your_')
        };
    }

    /**
     * Get API configuration
     * @returns {Object} API configuration
     */
    getAPI() {
        return {
            googleMaps: this.get('GOOGLE_MAPS_API_KEY'),
            emailJS: {
                serviceId: this.get('EMAILJS_SERVICE_ID'),
                templateId: this.get('EMAILJS_TEMPLATE_ID'), 
                userId: this.get('EMAILJS_USER_ID')
            },
            baseUrl: this.get('API_BASE_URL')
        };
    }

    /**
     * Get social media links
     * @returns {Object} Social media URLs
     */
    getSocial() {
        return {
            facebook: this.get('FACEBOOK_URL'),
            twitter: this.get('TWITTER_URL'),
            linkedin: this.get('LINKEDIN_URL'),
            googleBusiness: this.get('GOOGLE_BUSINESS_URL')
        };
    }

    /**
     * Get feature flags
     * @returns {Object} Feature flags
     */
    getFeatures() {
        return {
            chatWidget: this.get('ENABLE_CHAT_WIDGET'),
            bookingSystem: this.get('ENABLE_BOOKING_SYSTEM'),
            paymentProcessing: this.get('ENABLE_PAYMENT_PROCESSING')
        };
    }

    /**
     * Check if in development mode
     * @returns {boolean} True if in development mode
     */
    isDevelopment() {
        return this.get('ENVIRONMENT') === 'development' || this.get('DEBUG_MODE');
    }

    /**
     * Log configuration for debugging (excludes sensitive keys)
     */
    logConfig() {
        if (!this.isDevelopment()) return;

        console.group('🔧 Cool Brothers HVAC Configuration');
        console.log('Business:', this.getBusiness());
        console.log('Features:', this.getFeatures());
        console.log('Environment:', this.get('ENVIRONMENT'));
        console.log('Analytics Enabled:', this.getAnalytics().enabled);
        console.groupEnd();
    }
}

// Create global configuration instance
window.AppConfig = new Config();

// Log configuration in development
if (window.AppConfig.isDevelopment()) {
    window.AppConfig.logConfig();
}

// Export for module usage (if supported)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Config;
}

/**
 * Utility functions for common configuration tasks
 */
window.ConfigUtils = {
    /**
     * Track analytics event with proper configuration
     * @param {string} event - Event name
     * @param {Object} properties - Event properties
     */
    trackEvent(event, properties = {}) {
        const analytics = window.AppConfig.getAnalytics();
        if (analytics.enabled && typeof window.analytics !== 'undefined') {
            window.analytics.track(event, {
                ...properties,
                timestamp: new Date().toISOString(),
                page: window.location.pathname,
                business: window.AppConfig.get('BUSINESS_NAME')
            });
        } else if (window.AppConfig.isDevelopment()) {
            console.log('📊 Analytics Event:', event, properties);
        }
    },

    /**
     * Get formatted phone number for display
     * @param {string} type - 'business' or 'emergency'
     * @returns {string} Formatted phone number
     */
    getPhone(type = 'business') {
        const business = window.AppConfig.getBusiness();
        return type === 'emergency' ? business.emergencyPhone : business.phone;
    },

    /**
     * Get phone number for tel: links
     * @param {string} type - 'business' or 'emergency' 
     * @returns {string} Raw phone number for tel links
     */
    getPhoneRaw(type = 'business') {
        const business = window.AppConfig.getBusiness();
        return type === 'emergency' ? business.emergencyPhoneRaw : business.phoneRaw;
    }
};

// Log ready state
if (window.AppConfig.isDevelopment()) {
    console.log('✅ Configuration loaded successfully');
}