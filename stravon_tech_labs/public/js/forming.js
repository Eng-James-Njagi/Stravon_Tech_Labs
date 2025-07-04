// FAQ Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // FAQ Toggle Handler
    function initFAQToggle() {
        const faqItems = document.querySelectorAll('.stravon-faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.stravon-faq-question');
            const answer = item.querySelector('.stravon-faq-answer');
            
            if (question && answer) {
                question.addEventListener('click', function() {
                    const isActive = item.classList.contains('stravon-active');
                    
                    // Close all other FAQ items
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('stravon-active');
                        }
                    });
                    
                    // Toggle current item
                    if (isActive) {
                        item.classList.remove('stravon-active');
                    } else {
                        item.classList.add('stravon-active');
                    }
                });
            }
        });
    }
    
    // Contact Form Handler
    function initContactForm() {
        const contactForm = document.querySelector('.stravon-contact-form form');
        const submitBtn = document.querySelector('.stravon-submit-btn');
        const successMessage = document.querySelector('.stravon-success-message');
        const errorMessage = document.querySelector('.stravon-error-message');
        
        if (contactForm && submitBtn) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Clear previous errors
                clearFormErrors();
                
                // Validate form
                const isValid = validateForm();
                
                if (isValid) {
                    // Show loading state
                    submitBtn.classList.add('stravon-loading');
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'Sending...';
                    
                    // Simulate form submission (replace with actual submission logic)
                    setTimeout(() => {
                        // Hide loading state
                        submitBtn.classList.remove('stravon-loading');
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Send Message';
                        
                        // Show success message
                        if (successMessage) {
                            successMessage.style.display = 'block';
                            setTimeout(() => {
                                successMessage.style.display = 'none';
                            }, 5000);
                        }
                        
                        // Reset form
                        contactForm.reset();
                        
                    }, 2000);
                } else {
                    // Show error message
                    if (errorMessage) {
                        errorMessage.style.display = 'block';
                        setTimeout(() => {
                            errorMessage.style.display = 'none';
                        }, 5000);
                    }
                }
            });
        }
    }
    
    // Form Validation
    function validateForm() {
        let isValid = true;
        
        // Required fields
        const requiredFields = [
            { selector: 'input[name="name"]', message: 'Name is required' },
            { selector: 'input[name="email"]', message: 'Email is required' },
            { selector: 'input[name="phone"]', message: 'Phone is required' },
            { selector: 'select[name="subject"]', message: 'Subject is required' },
            { selector: 'textarea[name="message"]', message: 'Message is required' }
        ];
        
        requiredFields.forEach(field => {
            const element = document.querySelector(field.selector);
            if (element && !element.value.trim()) {
                showFieldError(element, field.message);
                isValid = false;
            }
        });
        
        // Email validation
        const emailField = document.querySelector('input[name="email"]');
        if (emailField && emailField.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value.trim())) {
                showFieldError(emailField, 'Please enter a valid email address');
                isValid = false;
            }
        }
        
        // Phone validation
        const phoneField = document.querySelector('input[name="phone"]');
        if (phoneField && phoneField.value.trim()) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(phoneField.value.trim().replace(/\s/g, ''))) {
                showFieldError(phoneField, 'Please enter a valid phone number');
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    // Show field error
    function showFieldError(field, message) {
        field.classList.add('stravon-error');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.stravon-field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorElement = document.createElement('span');
        errorElement.className = 'stravon-field-error';
        errorElement.textContent = message;
        field.parentNode.appendChild(errorElement);
    }
    
    // Clear form errors
    function clearFormErrors() {
        const errorFields = document.querySelectorAll('.stravon-error');
        const errorMessages = document.querySelectorAll('.stravon-field-error');
        
        errorFields.forEach(field => {
            field.classList.remove('stravon-error');
        });
        
        errorMessages.forEach(message => {
            message.remove();
        });
    }
    
    // Scroll animation for elements
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.stravon-slide-in');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('stravon-visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(element => {
            element.classList.add('stravon-animate');
            observer.observe(element);
        });
    }
    
    // Real-time form validation
    function initRealTimeValidation() {
        const formFields = document.querySelectorAll('.stravon-form-input, .stravon-form-select, .stravon-form-textarea');
        
        formFields.forEach(field => {
            field.addEventListener('blur', function() {
                validateSingleField(this);
            });
            
            field.addEventListener('input', function() {
                if (this.classList.contains('stravon-error')) {
                    validateSingleField(this);
                }
            });
        });
    }
    
    // Validate single field
    function validateSingleField(field) {
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';
        
        // Clear existing error
        field.classList.remove('stravon-error');
        const existingError = field.parentNode.querySelector('.stravon-field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Check if field is required and empty
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
        }
        
        // Specific field validations
        if (field.value.trim() && fieldName === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value.trim())) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        if (field.value.trim() && fieldName === 'phone') {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(field.value.trim().replace(/\s/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }
        
        if (!isValid) {
            showFieldError(field, errorMessage);
        }
        
        return isValid;
    }
    
    // Auto-resize textarea
    function initAutoResizeTextarea() {
        const textareas = document.querySelectorAll('.stravon-form-textarea');
        
        textareas.forEach(textarea => {
            textarea.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = this.scrollHeight + 'px';
            });
        });
    }
    
    // Initialize all functionality
    initFAQToggle();
    initContactForm();
    initScrollAnimations();
    initRealTimeValidation();
    initAutoResizeTextarea();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Keyboard navigation for FAQ items
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            const activeElement = document.activeElement;
            if (activeElement && activeElement.classList.contains('stravon-faq-question')) {
                e.preventDefault();
                activeElement.click();
            }
        }
    });
    
    // Add accessibility attributes
    function initAccessibility() {
        const faqItems = document.querySelectorAll('.stravon-faq-item');
        
        faqItems.forEach((item, index) => {
            const question = item.querySelector('.stravon-faq-question');
            const answer = item.querySelector('.stravon-faq-answer');
            
            if (question && answer) {
                // Add ARIA attributes
                question.setAttribute('aria-expanded', 'false');
                question.setAttribute('aria-controls', `faq-answer-${index}`);
                question.setAttribute('tabindex', '0');
                question.setAttribute('role', 'button');
                
                answer.setAttribute('id', `faq-answer-${index}`);
                answer.setAttribute('aria-labelledby', `faq-question-${index}`);
                
                question.setAttribute('id', `faq-question-${index}`);
                
                // Update aria-expanded on toggle
                const observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                            const isActive = item.classList.contains('stravon-active');
                            question.setAttribute('aria-expanded', isActive.toString());
                        }
                    });
                });
                
                observer.observe(item, {
                    attributes: true,
                    attributeFilter: ['class']
                });
            }
        });
    }
    
    initAccessibility();
    
    console.log('Stravon FAQ & Contact functionality initialized successfully!');
});

// Export functions for external use if needed
window.StravonFAQ = {
    init: function() {
        // Re-initialize if needed
        document.dispatchEvent(new Event('DOMContentLoaded'));
    },
    
    openFAQ: function(index) {
        const faqItems = document.querySelectorAll('.stravon-faq-item');
        if (faqItems[index]) {
            faqItems[index].classList.add('stravon-active');
        }
    },
    
    closeFAQ: function(index) {
        const faqItems = document.querySelectorAll('.stravon-faq-item');
        if (faqItems[index]) {
            faqItems[index].classList.remove('stravon-active');
        }
    },
    
    closeAllFAQ: function() {
        const faqItems = document.querySelectorAll('.stravon-faq-item');
        faqItems.forEach(item => {
            item.classList.remove('stravon-active');
        });
    }
};