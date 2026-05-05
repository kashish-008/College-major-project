document.addEventListener('DOMContentLoaded', function() {
    // Create mobile menu overlay
    const mobileMenuOverlay = document.createElement('div');
    mobileMenuOverlay.className = 'mobile-menu-overlay';
    mobileMenuOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 999;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    `;
    
    // Create mobile menu container
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    mobileMenu.style.cssText = `
        position: fixed;
        top: 0;
        right: -300px;
        width: 280px;
        height: 100%;
        background: var(--white);
        z-index: 1000;
        padding: 80px 20px 20px;
        transition: right 0.3s ease;
        overflow-y: auto;
        box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
    `;
    
    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'mobile-menu-close';
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        background: none;
        border: none;
        font-size: 1.5rem;
        color: var(--dark-color);
        cursor: pointer;
    `;
    
    // Add navigation links to mobile menu
    const nav = document.querySelector('.nav');
    if (nav) {
        const navClone = nav.cloneNode(true);
        navClone.style.cssText = `
            display: block !important;
        `;
        
        const navList = navClone.querySelector('ul');
        if (navList) {
            navList.style.cssText = `
                flex-direction: column;
                gap: 0;
            `;
            
            const navItems = navList.querySelectorAll('li');
            navItems.forEach(item => {
                item.style.margin = '0';
                item.style.width = '100%';
                
                const link = item.querySelector('a');
                if (link) {
                    link.style.cssText = `
                        display: block;
                        padding: 15px 0;
                        border-bottom: 1px solid #eee;
                        font-size: 1.1rem;
                        color: var(--dark-color);
                        text-decoration: none;
                    `;
                    
                    // Add active class styling
                    if (link.classList.contains('active')) {
                        link.style.color = 'var(--primary-color)';
                        link.style.fontWeight = 'bold';
                    }
                }
            });
        }
        
        mobileMenu.appendChild(navClone);
    }
    
    // Add auth buttons to mobile menu if they exist
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons) {
        const authClone = authButtons.cloneNode(true);
        authClone.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-top: 20px;
        `;
        
        const buttons = authClone.querySelectorAll('.btn');
        buttons.forEach(btn => {
            btn.style.width = '100%';
            btn.style.textAlign = 'center';
        });
        
        mobileMenu.appendChild(authClone);
    }
    
    // Add close button to mobile menu
    mobileMenu.appendChild(closeBtn);
    
    // Add elements to DOM
    document.body.appendChild(mobileMenuOverlay);
    document.body.appendChild(mobileMenu);
    
    // Toggle mobile menu function
    function toggleMobileMenu() {
        const isOpen = mobileMenu.style.right === '0px';
        
        if (isOpen) {
            mobileMenu.style.right = '-300px';
            mobileMenuOverlay.style.opacity = '0';
            mobileMenuOverlay.style.visibility = 'hidden';
            document.body.style.overflow = 'auto';
        } else {
            mobileMenu.style.right = '0';
            mobileMenuOverlay.style.opacity = '1';
            mobileMenuOverlay.style.visibility = 'visible';
            document.body.style.overflow = 'hidden';
        }
    }
    
    // Add event listeners
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    closeBtn.addEventListener('click', toggleMobileMenu);
    mobileMenuOverlay.addEventListener('click', toggleMobileMenu);
    
    // Close menu when clicking on links
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMobileMenu);
    });
    
    // Handle window resize
    function handleResize() {
        if (window.innerWidth > 768) {
            mobileMenu.style.right = '-300px';
            mobileMenuOverlay.style.opacity = '0';
            mobileMenuOverlay.style.visibility = 'hidden';
            document.body.style.overflow = 'auto';
        }
    }
    
    window.addEventListener('resize', handleResize);
});
