// KrydonMC Website JavaScript
// Modern interactive features and UPI payment integration

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initSectionNavigation();
    initStoreCategories();
    initLoginTabs();
    initForms();
    initAnimations();
    initParticles();
    
    console.log('KrydonMC Website Loaded Successfully!');
});

// ===== NAVIGATION FUNCTIONALITY =====
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ===== SECTION NAVIGATION =====
function initSectionNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    const sections = document.querySelectorAll('.section');
    
    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');
            showSection(targetSection);
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Handle hash navigation (for direct links)
    function handleHashNavigation() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            showSection(hash);
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            const activeLink = document.querySelector(`[data-section="${hash}"]`);
            if (activeLink) activeLink.classList.add('active');
        }
    }
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashNavigation);
    
    // Check initial hash on load
    handleHashNavigation();
}

function showSection(sectionName) {
    const sections = document.querySelectorAll('.section');
    const targetSection = document.getElementById(sectionName);
    
    if (targetSection) {
        // Hide all sections
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target section
        targetSection.classList.add('active');
        
        // Update URL hash
        history.pushState(null, null, `#${sectionName}`);
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ===== STORE CATEGORIES =====
function initStoreCategories() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const storeCategories = document.querySelectorAll('.store-category');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding category
            storeCategories.forEach(cat => {
                cat.classList.remove('active');
                if (cat.id === category) {
                    cat.classList.add('active');
                }
            });
        });
    });
}

// ===== UPI PAYMENT INTEGRATION =====
/* 
CUSTOMIZATION POINT: UPI Payment System
Replace the UPI ID and modify amounts as needed
Current UPI ID: 8091056604@fam
*/

function initiatePayment(productId, amount, productName) {
    try {
        // Generate unique transaction ID
        const transactionId = generateTransactionId();
        const orderId = generateOrderId(productId);
        
        // CUSTOMIZATION POINT: Replace with your UPI ID
        const upiId = '8091056604@fam';
        const merchantName = 'KrydonMC';
        const merchantCode = '0000';
        
        // Construct UPI deep link
        const upiLink = `upi://pay?pa=${upiId}&pn=${merchantName}&mc=${merchantCode}&tid=${transactionId}&tr=${orderId}&am=${amount.toFixed(2)}&cu=INR&tn=Purchase%20${encodeURIComponent(productName)}%20from%20KrydonMC`;
        
        console.log('Initiating UPI Payment:', {
            productId,
            amount,
            productName,
            transactionId,
            orderId,
            upiLink
        });
        
        // Store transaction details for verification
        storeTransactionDetails(transactionId, {
            productId,
            amount,
            productName,
            orderId,
            timestamp: new Date().toISOString()
        });
        
        // Show payment instructions
        showPaymentModal(productName, amount, transactionId, upiLink);
        
    } catch (error) {
        console.error('Payment initiation error:', error);
        showAlert('Payment Error', 'Failed to initiate payment. Please try again.', 'error');
    }
}

function generateTransactionId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `TXN${timestamp}${random}`.toUpperCase();
}

function generateOrderId(productId) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 3);
    return `ORD${productId}_${timestamp}${random}`.toUpperCase();
}

function storeTransactionDetails(transactionId, details) {
    const transactions = JSON.parse(localStorage.getItem('krydonmc_transactions') || '{}');
    transactions[transactionId] = details;
    localStorage.setItem('krydonmc_transactions', JSON.stringify(transactions));
}

function showPaymentModal(productName, amount, transactionId, upiLink) {
    // Create modal HTML
    const modalHtml = `
        <div class="payment-modal-overlay" id="paymentModal">
            <div class="payment-modal">
                <div class="payment-modal-header">
                    <h3><i class="fas fa-credit-card"></i> Complete Payment</h3>
                    <button class="close-modal" onclick="closePaymentModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="payment-modal-body">
                    <div class="payment-product">
                        <h4>Product: ${productName}</h4>
                        <div class="payment-amount">Amount: ₹${amount}</div>
                    </div>
                    
                    <div class="payment-instructions">
                        <h4><i class="fas fa-mobile-alt"></i> Payment Instructions</h4>
                        <ol>
                            <li>Click the "Pay Now" button below to open your UPI app</li>
                            <li>Verify the payment details in your UPI app</li>
                            <li>Complete the payment using your preferred method</li>
                            <li>Note down your transaction ID for verification</li>
                            <li>Submit the transaction ID in the store section</li>
                        </ol>
                    </div>
                    
                    <div class="payment-details">
                        <div class="detail-row">
                            <span>Merchant:</span>
                            <span>KrydonMC</span>
                        </div>
                        <div class="detail-row">
                            <span>Amount:</span>
                            <span>₹${amount.toFixed(2)}</span>
                        </div>
                        <div class="detail-row">
                            <span>Reference ID:</span>
                            <span class="transaction-id">${transactionId}</span>
                        </div>
                    </div>
                    
                    <div class="payment-actions">
                        <a href="${upiLink}" class="btn btn-primary payment-btn" onclick="trackPaymentAttempt('${transactionId}')">
                            <i class="fas fa-mobile-alt"></i> Pay Now via UPI
                        </a>
                        <button class="btn btn-secondary" onclick="copyTransactionId('${transactionId}')">
                            <i class="fas fa-copy"></i> Copy Reference ID
                        </button>
                    </div>
                    
                    <div class="payment-note">
                        <p><i class="fas fa-info-circle"></i> After completing payment, please submit your transaction ID in the store section for verification and delivery.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Add modal styles if not already added
    if (!document.getElementById('modal-styles')) {
        addModalStyles();
    }
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

function trackPaymentAttempt(transactionId) {
    console.log('Payment attempt tracked:', transactionId);
    // You can add analytics tracking here
    
    // Auto-fill transaction ID in form if visible
    setTimeout(() => {
        const transactionIdInput = document.getElementById('transactionId');
        if (transactionIdInput && !transactionIdInput.value) {
            transactionIdInput.value = transactionId;
        }
    }, 1000);
}

function copyTransactionId(transactionId) {
    navigator.clipboard.writeText(transactionId).then(() => {
        showNotification('Reference ID copied to clipboard!', 'success');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = transactionId;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Reference ID copied to clipboard!', 'success');
    });
}

function addModalStyles() {
    const styles = `
        <style id="modal-styles">
        .payment-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 20px;
            animation: fadeIn 0.3s ease;
        }
        
        .payment-modal {
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-large);
            max-width: 500px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            animation: slideInUp 0.3s ease;
            box-shadow: var(--shadow-heavy);
        }
        
        .payment-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 24px;
            border-bottom: 1px solid var(--border-color);
            background: var(--bg-secondary);
            border-radius: var(--radius-large) var(--radius-large) 0 0;
        }
        
        .payment-modal-header h3 {
            margin: 0;
            color: var(--accent-primary);
            font-family: var(--font-display);
        }
        
        .close-modal {
            background: none;
            border: none;
            color: var(--text-secondary);
            font-size: 1.2rem;
            cursor: pointer;
            padding: 8px;
            border-radius: var(--radius-small);
            transition: all var(--transition-fast);
        }
        
        .close-modal:hover {
            background: var(--bg-tertiary);
            color: var(--text-primary);
        }
        
        .payment-modal-body {
            padding: 24px;
        }
        
        .payment-product {
            text-align: center;
            margin-bottom: 24px;
            padding: 20px;
            background: var(--bg-tertiary);
            border-radius: var(--radius-medium);
            border: 1px solid var(--border-color);
        }
        
        .payment-product h4 {
            margin: 0 0 12px 0;
            color: var(--text-primary);
        }
        
        .payment-amount {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--accent-primary);
            font-family: var(--font-display);
        }
        
        .payment-instructions {
            margin-bottom: 24px;
        }
        
        .payment-instructions h4 {
            color: var(--accent-primary);
            margin-bottom: 16px;
        }
        
        .payment-instructions ol {
            color: var(--text-secondary);
            padding-left: 20px;
        }
        
        .payment-instructions li {
            margin-bottom: 8px;
            line-height: 1.5;
        }
        
        .payment-details {
            background: var(--bg-tertiary);
            padding: 20px;
            border-radius: var(--radius-medium);
            border: 1px solid var(--border-color);
            margin-bottom: 24px;
        }
        
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            color: var(--text-secondary);
        }
        
        .detail-row:last-child {
            margin-bottom: 0;
        }
        
        .detail-row span:last-child {
            color: var(--text-primary);
            font-weight: 500;
        }
        
        .transaction-id {
            font-family: monospace;
            background: var(--bg-primary);
            padding: 4px 8px;
            border-radius: var(--radius-small);
            border: 1px solid var(--border-color);
        }
        
        .payment-actions {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 24px;
        }
        
        .payment-btn {
            font-size: 1.1rem;
            padding: 16px 24px;
        }
        
        .payment-note {
            background: rgba(0, 212, 255, 0.1);
            border: 1px solid rgba(0, 212, 255, 0.3);
            border-radius: var(--radius-medium);
            padding: 16px;
            text-align: center;
        }
        
        .payment-note p {
            margin: 0;
            color: var(--text-secondary);
            font-size: 0.9rem;
            line-height: 1.5;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @media (max-width: 480px) {
            .payment-modal {
                margin: 10px;
                max-height: calc(100vh - 20px);
            }
            
            .payment-modal-body {
                padding: 16px;
            }
            
            .payment-actions {
                flex-direction: column;
            }
        }
        </style>
    `;
    document.head.insertAdjacentHTML('beforeend', styles);
}

// ===== UTILITY FUNCTIONS =====
function copyIP() {
    const ip = 'play.krydonmc.net'; // CUSTOMIZATION POINT: Replace with your server IP
    
    navigator.clipboard.writeText(ip).then(() => {
        showNotification('Server IP copied to clipboard!', 'success');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = ip;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Server IP copied to clipboard!', 'success');
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add notification styles if not already added
    if (!document.getElementById('notification-styles')) {
        addNotificationStyles();
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
    
    // Remove on click
    notification.addEventListener('click', () => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
}

function addNotificationStyles() {
    const styles = `
        <style id="notification-styles">
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-medium);
            padding: 16px 20px;
            box-shadow: var(--shadow-medium);
            z-index: 9999;
            max-width: 350px;
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.3s ease;
            animation: slideInNotification 0.3s ease forwards;
        }
        
        .notification-success {
            border-left: 4px solid var(--accent-success);
        }
        
        .notification-error {
            border-left: 4px solid var(--accent-danger);
        }
        
        .notification-info {
            border-left: 4px solid var(--accent-primary);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 12px;
            color: var(--text-primary);
        }
        
        .notification-success .notification-content i {
            color: var(--accent-success);
        }
        
        .notification-error .notification-content i {
            color: var(--accent-danger);
        }
        
        .notification-info .notification-content i {
            color: var(--accent-primary);
        }
        
        @keyframes slideInNotification {
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @media (max-width: 480px) {
            .notification {
                right: 10px;
                left: 10px;
                max-width: none;
            }
        }
        </style>
    `;
    document.head.insertAdjacentHTML('beforeend', styles);
}

function showAlert(title, message, type = 'info') {
    const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle';
    const color = type === 'success' ? 'var(--accent-success)' : type === 'error' ? 'var(--accent-danger)' : 'var(--accent-primary)';
    
    const alertHtml = `
        <div class="alert-overlay" onclick="closeAlert()">
            <div class="alert-modal" onclick="event.stopPropagation()">
                <div class="alert-icon" style="color: ${color}">
                    <i class="fas fa-${icon}"></i>
                </div>
                <h3>${title}</h3>
                <p>${message}</p>
                <button class="btn btn-primary" onclick="closeAlert()">OK</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', alertHtml);
    
    // Add alert styles if not already added
    if (!document.getElementById('alert-styles')) {
        addAlertStyles();
    }
}

function closeAlert() {
    const alert = document.querySelector('.alert-overlay');
    if (alert) {
        alert.remove();
    }
}

function addAlertStyles() {
    const styles = `
        <style id="alert-styles">
        .alert-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 20px;
            animation: fadeIn 0.2s ease;
        }
        
        .alert-modal {
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-large);
            padding: 32px;
            text-align: center;
            max-width: 400px;
            width: 100%;
            animation: scaleIn 0.2s ease;
        }
        
        .alert-icon {
            font-size: 3rem;
            margin-bottom: 16px;
        }
        
        .alert-modal h3 {
            color: var(--text-primary);
            margin-bottom: 16px;
            font-family: var(--font-display);
        }
        
        .alert-modal p {
            color: var(--text-secondary);
            margin-bottom: 24px;
            line-height: 1.5;
        }
        
        @keyframes scaleIn {
            from {
                opacity: 0;
                transform: scale(0.8);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        </style>
    `;
    document.head.insertAdjacentHTML('beforeend', styles);
}

// ===== LOGIN TABS =====
function initLoginTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === targetTab + '-tab') {
                    content.classList.add('active');
                }
            });
        });
    });
}

// ===== FORM HANDLING =====
function initForms() {
    // Transaction form
    const transactionForm = document.getElementById('transactionForm');
    if (transactionForm) {
        transactionForm.addEventListener('submit', handleTransactionSubmission);
    }
    
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

function handleTransactionSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const transactionData = {
        playerName: formData.get('playerName'),
        transactionId: formData.get('transactionId'),
        productPurchased: formData.get('productPurchased'),
        timestamp: new Date().toISOString()
    };
    
    console.log('Transaction submission:', transactionData);
    
    // Store transaction submission
    storeTransactionSubmission(transactionData);
    
    // Show success message
    showAlert('Transaction Submitted!', 'Your transaction details have been submitted for verification. You will receive your purchase within 24 hours. Please join our Discord server for faster support.', 'success');
    
    // Reset form
    e.target.reset();
}

function storeTransactionSubmission(data) {
    const submissions = JSON.parse(localStorage.getItem('krydonmc_submissions') || '[]');
    submissions.push(data);
    localStorage.setItem('krydonmc_submissions', JSON.stringify(submissions));
}

function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const contactData = {
        name: formData.get('contactName'),
        email: formData.get('contactEmail'),
        minecraft: formData.get('contactMinecraft'),
        subject: formData.get('contactSubject'),
        message: formData.get('contactMessage'),
        timestamp: new Date().toISOString()
    };
    
    console.log('Contact form submission:', contactData);
    
    // Show success message
    showAlert('Message Sent!', 'Thank you for contacting us! We will get back to you within 24 hours. For faster support, please join our Discord server.', 'success');
    
    // Reset form
    e.target.reset();
}

function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const loginData = {
        username: formData.get('loginUsername'),
        password: formData.get('loginPassword'),
        remember: formData.get('rememberMe') === 'on'
    };
    
    console.log('Login attempt:', { username: loginData.username, remember: loginData.remember });
    
    // CUSTOMIZATION POINT: Integrate with your authentication system
    showAlert('Login System', 'Login system is not yet integrated. Please check back later or contact support for account issues.', 'info');
}

function handleRegister(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const password = formData.get('registerPassword');
    const confirmPassword = formData.get('confirmPassword');
    
    if (password !== confirmPassword) {
        showAlert('Registration Error', 'Passwords do not match. Please try again.', 'error');
        return;
    }
    
    const registerData = {
        username: formData.get('registerUsername'),
        email: formData.get('registerEmail'),
        minecraft: formData.get('registerMinecraft'),
        password: password
    };
    
    console.log('Registration attempt:', { 
        username: registerData.username, 
        email: registerData.email, 
        minecraft: registerData.minecraft 
    });
    
    // CUSTOMIZATION POINT: Integrate with your authentication system
    showAlert('Registration System', 'Registration system is not yet integrated. Please check back later or contact support to create an account.', 'info');
}

// ===== DISCORD OAUTH INTEGRATION =====
// CUSTOMIZATION POINT: Discord OAuth Integration
function loginWithDiscord() {
    console.log('Discord login initiated');
    showAlert('Discord Login', 'Discord OAuth integration is not yet configured. Please contact an administrator to set up Discord login.', 'info');
    
    // When ready, implement Discord OAuth:
    // const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=${encodeURIComponent(window.location.origin + '/discord-callback')}&response_type=code&scope=identify%20email`;
    // window.location.href = discordAuthUrl;
}

function registerWithDiscord() {
    console.log('Discord registration initiated');
    showAlert('Discord Registration', 'Discord OAuth integration is not yet configured. Please contact an administrator to set up Discord registration.', 'info');
}

// ===== ANIMATIONS =====
function initAnimations() {
    // Intersection Observer for scroll animations
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
    document.querySelectorAll('.mode-card, .community-card, .news-card, .product-card, .feature-card').forEach(el => {
        observer.observe(el);
    });
    
    // Add animation styles
    if (!document.getElementById('animation-styles')) {
        addAnimationStyles();
    }
}

function addAnimationStyles() {
    const styles = `
        <style id="animation-styles">
        .mode-card, .community-card, .news-card, .product-card, .feature-card {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .mode-card.animate-in, .community-card.animate-in, .news-card.animate-in, 
        .product-card.animate-in, .feature-card.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Staggered animation delay */
        .mode-card:nth-child(2).animate-in { transition-delay: 0.1s; }
        .mode-card:nth-child(3).animate-in { transition-delay: 0.2s; }
        .community-card:nth-child(2).animate-in { transition-delay: 0.1s; }
        .community-card:nth-child(3).animate-in { transition-delay: 0.2s; }
        .community-card:nth-child(4).animate-in { transition-delay: 0.3s; }
        .product-card:nth-child(2).animate-in { transition-delay: 0.1s; }
        .product-card:nth-child(3).animate-in { transition-delay: 0.2s; }
        </style>
    `;
    document.head.insertAdjacentHTML('beforeend', styles);
}

// ===== PARTICLES ANIMATION =====
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particleCount = 50;
    const particles = [];
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(0, 212, 255, 0.6);
            border-radius: 50%;
            pointer-events: none;
        `;
        
        // Random initial position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        particlesContainer.appendChild(particle);
        
        particles.push({
            element: particle,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 3 + 1
        });
    }
    
    // Animate particles
    function animateParticles() {
        particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around screen
            if (particle.x < 0) particle.x = window.innerWidth;
            if (particle.x > window.innerWidth) particle.x = 0;
            if (particle.y < 0) particle.y = window.innerHeight;
            if (particle.y > window.innerHeight) particle.y = 0;
            
            // Update element position
            particle.element.style.left = particle.x + 'px';
            particle.element.style.top = particle.y + 'px';
            particle.element.style.width = particle.size + 'px';
            particle.element.style.height = particle.size + 'px';
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
}

// ===== REAL-TIME FEATURES =====
function updatePlayerCount() {
    // CUSTOMIZATION POINT: Integrate with your server status API
    // This is a mock implementation
    const playerCountElements = document.querySelectorAll('#playerCount, .stat-number');
    const mockPlayerCount = Math.floor(Math.random() * 50) + 200; // Mock: 200-250 players
    
    playerCountElements.forEach(element => {
        if (element.parentElement && element.parentElement.querySelector('.stat-label')?.textContent.includes('Players')) {
            element.textContent = mockPlayerCount;
        } else if (element.id === 'playerCount') {
            element.textContent = mockPlayerCount;
        }
    });
}

// Update player count every 30 seconds
setInterval(updatePlayerCount, 30000);

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', function(e) {
    // Escape key to close modals
    if (e.key === 'Escape') {
        closePaymentModal();
        closeAlert();
    }
    
    // Ctrl+/ to show shortcuts help
    if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        showKeyboardShortcuts();
    }
});

function showKeyboardShortcuts() {
    const shortcuts = `
        <h4>Keyboard Shortcuts</h4>
        <ul>
            <li><kbd>Esc</kbd> - Close modals and dialogs</li>
            <li><kbd>Ctrl</kbd> + <kbd>/</kbd> - Show this help</li>
            <li><kbd>Ctrl</kbd> + <kbd>C</kbd> - Copy server IP (when focused)</li>
        </ul>
    `;
    showAlert('Keyboard Shortcuts', shortcuts, 'info');
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // Don't show error alerts to users in production
    // showAlert('Error', 'An unexpected error occurred. Please refresh the page and try again.', 'error');
});

// ===== PERFORMANCE MONITORING =====
window.addEventListener('load', function() {
    // Log performance metrics
    if (window.performance) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        console.log(`Page loaded in ${loadTime}ms`);
    }
});

// ===== EXPORT FUNCTIONS FOR GLOBAL ACCESS =====
window.KrydonMC = {
    showSection,
    copyIP,
    initiatePayment,
    showNotification,
    showAlert,
    loginWithDiscord,
    registerWithDiscord,
    closePaymentModal,
    closeAlert
};

console.log('KrydonMC Website JavaScript Loaded Successfully!');