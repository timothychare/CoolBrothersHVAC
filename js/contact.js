/**
 * Cool Brothers HVAC - Contact Form and Page Interactions
 * 
 * This file handles:
 * - Contact form validation and submission
 * - FAQ accordion functionality
 * - Contact page specific analytics tracking
 */

class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.submitBtn = this.form?.querySelector('button[type="submit"]');
        this.submitText = document.getElementById('submitText');
        this.submitLoader = document.getElementById('submitLoader');
        this.successMessage = document.getElementById('formSuccess');
        
        this.isSubmitting = false;
        this.validators = this.setupValidators();
        
        this.init();
    }

    init() {
        if (!this.form) return;
        
        this.setupEventListeners();
        this.setupFAQ();
        this.setupContactPageElements();
        console.log('✅ Contact form initialized');
    }

    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });

        // Phone number formatting
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => this.formatPhoneNumber(e));
        }

        // Service type tracking
        const serviceSelect = document.getElementById('serviceType');
        if (serviceSelect) {
            serviceSelect.addEventListener('change', (e) => {
                if (e.target.value) {
                    ConfigUtils.trackEvent('Form Interaction', {
                        action: 'service_selected',
                        service: e.target.value,
                        location: 'contact_form'
                    });
                }
            });
        }
    }

    setupValidators() {
        return {
            name: (value) => {
                if (!value.trim()) return 'Name is required';
                if (value.trim().length < 2) return 'Name must be at least 2 characters';
                return null;
            },
            
            email: (value) => {
                if (!value.trim()) return 'Email is required';
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) return 'Please enter a valid email address';
                return null;
            },
            
            phone: (value) => {
                if (!value.trim()) return 'Phone number is required';
                const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                const cleanPhone = value.replace(/\D/g, '');
                if (cleanPhone.length < 10) return 'Please enter a valid phone number';
                return null;
            }
        };
    }

    setupContactPageElements() {
        // Update contact page specific phone/email elements
        const config = window.AppConfig;
        if (!config) return;

        const business = config.getBusiness();

        // Contact page phone elements
        this.updateContactElement('contactPhoneMain', `tel:${business.phoneRaw}`, business.phone);
        this.updateContactElement('contactPhoneEmergency', `tel:${business.emergencyPhoneRaw}`, business.emergencyPhone);
        this.updateContactElement('contactEmailMain', `mailto:${business.email}`, business.email);
        this.updateContactElement('contactAddress', null, business.address);
        this.updateContactElement('emergencyMainBtn', `tel:${business.emergencyPhoneRaw}`, `Call Emergency Line: ${business.emergencyPhone}`);

        // Add click tracking to contact page elements
        this.setupContactTracking();
    }

    updateContactElement(id, href, text) {
        const element = document.getElementById(id);
        if (!element) return;

        if (href && element.tagName.toLowerCase() === 'a') {
            element.href = href;
        }
        element.textContent = text;
    }

    setupContactTracking() {
        // Track contact page interactions
        const trackableElements = [
            { id: 'contactPhoneMain', event: 'Phone Call Initiated', props: { location: 'contact_page', type: 'general' }},
            { id: 'contactPhoneEmergency', event: 'Phone Call Initiated', props: { location: 'contact_page', type: 'emergency' }},
            { id: 'contactEmailMain', event: 'Email Clicked', props: { location: 'contact_page' }},
            { id: 'emergencyMainBtn', event: 'Phone Call Initiated', props: { location: 'contact_page_banner', type: 'emergency' }}
        ];

        trackableElements.forEach(({ id, event, props }) => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('click', () => {
                    ConfigUtils.trackEvent(event, props);
                });
            }
        });
    }

    validateField(field) {
        const fieldName = field.name;
        const value = field.value;
        const validator = this.validators[fieldName];
        
        if (!validator) return true;
        
        const error = validator(value);
        const errorElement = document.getElementById(`${fieldName}Error`);
        
        if (error) {
            this.showFieldError(field, errorElement, error);
            return false;
        } else {
            this.clearFieldError(field, errorElement);
            return true;
        }
    }

    showFieldError(field, errorElement, message) {
        field.classList.add('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');
        field.classList.remove('border-gray-300', 'focus:ring-primary-500', 'focus:border-primary-500');
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.className = 'error-message text-red-600 text-sm mt-1';
        }
    }

    clearFieldError(field, errorElement) {
        field.classList.remove('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');
        field.classList.add('border-gray-300', 'focus:ring-primary-500', 'focus:border-primary-500');
        
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.className = 'error-message';
        }
    }

    clearError(field) {
        const errorElement = document.getElementById(`${field.name}Error`);
        if (errorElement && errorElement.textContent) {
            this.clearFieldError(field, errorElement);
        }
    }

    formatPhoneNumber(e) {
        const input = e.target;
        const value = input.value.replace(/\D/g, '');
        let formattedValue = '';

        if (value.length > 0) {
            if (value.length <= 3) {
                formattedValue = `(${value}`;
            } else if (value.length <= 6) {
                formattedValue = `(${value.slice(0, 3)}) ${value.slice(3)}`;
            } else {
                formattedValue = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
            }
        }

        input.value = formattedValue;
    }

    validateForm() {
        let isValid = true;
        const requiredFields = ['name', 'email', 'phone'];
        
        requiredFields.forEach(fieldName => {
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            if (field && !this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmitting) return;
        
        // Track form submission attempt
        ConfigUtils.trackEvent('Form Submitted', {
            form_type: 'contact',
            location: 'contact_page',
            attempt: 'started'
        });

        // Validate form
        if (!this.validateForm()) {
            ConfigUtils.trackEvent('Form Submitted', {
                form_type: 'contact',
                location: 'contact_page',
                success: false,
                error: 'validation_failed'
            });
            return;
        }

        this.isSubmitting = true;
        this.setLoadingState(true);

        try {
            // Collect form data
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData.entries());

            // Add timestamp and source
            data.timestamp = new Date().toISOString();
            data.source = 'website_contact_form';
            data.page = window.location.pathname;

            // Simulate API call (replace with actual submission)
            await this.simulateSubmission(data);

            // Show success message
            this.showSuccess();

            // Track successful submission
            ConfigUtils.trackEvent('Form Submitted', {
                form_type: 'contact',
                location: 'contact_page',
                success: true,
                service_type: data.serviceType || 'not_specified',
                property_type: data.propertyType
            });

        } catch (error) {
            console.error('Form submission error:', error);
            this.showError('Sorry, there was an error submitting your form. Please try again or call us directly.');
            
            ConfigUtils.trackEvent('Form Submitted', {
                form_type: 'contact',
                location: 'contact_page',
                success: false,
                error: 'submission_failed'
            });
        } finally {
            this.isSubmitting = false;
            this.setLoadingState(false);
        }
    }

    async simulateSubmission(data) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // In a real implementation, this would be:
        // const response = await fetch('/api/contact', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data)
        // });
        // if (!response.ok) throw new Error('Submission failed');
        
        console.log('📧 Contact form submitted:', data);
    }

    setLoadingState(loading) {
        if (!this.submitBtn || !this.submitText || !this.submitLoader) return;
        
        this.submitBtn.disabled = loading;
        
        if (loading) {
            this.submitText.classList.add('hidden');
            this.submitLoader.classList.remove('hidden');
            this.submitBtn.classList.add('opacity-75');
        } else {
            this.submitText.classList.remove('hidden');
            this.submitLoader.classList.add('hidden');
            this.submitBtn.classList.remove('opacity-75');
        }
    }

    showSuccess() {
        if (!this.successMessage) return;
        
        this.form.style.display = 'none';
        this.successMessage.classList.remove('hidden');
        this.successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    showError(message) {
        // Create or update error message
        let errorDiv = document.getElementById('formError');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'formError';
            errorDiv.className = 'bg-red-50 border border-red-200 rounded-lg p-4 mt-4';
            this.form.appendChild(errorDiv);
        }
        
        errorDiv.innerHTML = `
            <div class="flex items-center">
                <span class="text-red-600 text-xl mr-3">❌</span>
                <div>
                    <h3 class="text-red-800 font-semibold">Submission Error</h3>
                    <p class="text-red-700">${message}</p>
                </div>
            </div>
        `;
        
        errorDiv.classList.remove('hidden');
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    setupFAQ() {
        const faqQuestions = document.querySelectorAll('.faq-question');
        
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const answer = question.nextElementSibling;
                const icon = question.querySelector('.faq-icon');
                const isOpen = answer.classList.contains('hidden');
                
                // Close all other FAQ items
                faqQuestions.forEach(otherQuestion => {
                    if (otherQuestion !== question) {
                        const otherAnswer = otherQuestion.nextElementSibling;
                        const otherIcon = otherQuestion.querySelector('.faq-icon');
                        otherAnswer.classList.add('hidden');
                        otherIcon.textContent = '+';
                        otherIcon.style.transform = 'rotate(0deg)';
                    }
                });
                
                // Toggle current FAQ item
                if (isOpen) {
                    answer.classList.remove('hidden');
                    icon.textContent = '−';
                    icon.style.transform = 'rotate(180deg)';
                    
                    // Track FAQ interaction
                    ConfigUtils.trackEvent('FAQ Interaction', {
                        question: question.textContent.trim(),
                        action: 'opened',
                        location: 'contact_page'
                    });
                } else {
                    answer.classList.add('hidden');
                    icon.textContent = '+';
                    icon.style.transform = 'rotate(0deg)';
                }
            });
        });
    }
}

// Initialize contact form when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('contactForm')) {
        new ContactForm();
    }
});

// Export for testing/debugging
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContactForm;
}