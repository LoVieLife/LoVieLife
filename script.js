document.addEventListener('DOMContentLoaded', () => {
    // Get references to all necessary DOM elements
    const glutathioneInteractive = document.getElementById('glutathione-interactive');
    const ergothioneineInteractive = document.getElementById('ergothioneine-interactive');

    const glutathioneContent = document.getElementById('glutathione-content');
    const ergothioneineContent = document.getElementById('ergothioneine-content');

    const glutathioneInfoPanel = document.getElementById('glutathione-info-panel');
    const ergothioneineInfoPanel = document.getElementById('ergothioneine-info-panel');

    const pageOverlay = document.querySelector('.page-overlay');
    const closeButtons = document.querySelectorAll('.close-btn');

    // Helper function to show an element by adding .active class
    function showElement(element) {
        if (element) {
            element.style.display = 'block'; // Or 'flex' if your .active class uses it
            // Timeout to allow display property to take effect before transition starts
            setTimeout(() => {
                element.classList.add('active');
            }, 10); 
        }
    }

    // Helper function to hide an element by removing .active class
    function hideElement(element) {
        if (element) {
            element.classList.remove('active');
            // Listen for transition end to set display to none
            element.addEventListener('transitionend', function handler() {
                if (!element.classList.contains('active')) {
                    element.style.display = 'none';
                }
                element.removeEventListener('transitionend', handler);
            });
        }
    }

    // Function to move content and set up panels
    function setupPanel(contentElement, panelElement) {
        if (contentElement && panelElement) {
            // Move content: Find a suitable place in the panel, e.g., after the close button.
            // Assuming the close button is the first child.
            panelElement.insertBefore(contentElement, panelElement.children[1]);
            // Original content div is now part of the panel, no need to hide it separately
            // as the panel itself is hidden.
        }
    }

    // Setup panels by moving content
    setupPanel(glutathioneContent, glutathioneInfoPanel);
    setupPanel(ergothioneineContent, ergothioneineInfoPanel);

    // Event listeners for molecule placeholders
    function handleMoleculeClick(placeholderElement, panelElement, overlayElement) {
        // Add click animation to the placeholder
        placeholderElement.classList.add('clicked-animation');
        
        // Remove the animation class after it finishes
        placeholderElement.addEventListener('animationend', function handler() {
            placeholderElement.classList.remove('clicked-animation');
            placeholderElement.removeEventListener('animationend', handler);
        }, { once: true }); // Ensure the handler is called only once

        // Show the corresponding info panel and overlay
        showElement(panelElement);
        showElement(overlayElement);
    }

    if (glutathioneInteractive) {
        glutathioneInteractive.addEventListener('click', function() { // Use function to get 'this' context if needed, or pass element directly
            handleMoleculeClick(this, glutathioneInfoPanel, pageOverlay);
        });
    }

    if (ergothioneineInteractive) {
        ergothioneineInteractive.addEventListener('click', function() {
            handleMoleculeClick(this, ergothioneineInfoPanel, pageOverlay);
        });
    }

    // Event listeners for close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const panelToClose = button.closest('.info-panel');
            hideElement(panelToClose);
            hideElement(pageOverlay);
        });
    });

    // Event listener for page overlay
    if (pageOverlay) {
        pageOverlay.addEventListener('click', () => {
            if (glutathioneInfoPanel && glutathioneInfoPanel.classList.contains('active')) {
                hideElement(glutathioneInfoPanel);
            }
            if (ergothioneineInfoPanel && ergothioneineInfoPanel.classList.contains('active')) {
                hideElement(ergothioneineInfoPanel);
            }
            hideElement(pageOverlay);
        });
    }

    // --- Hotspot Interaction Logic ---
    const hotspotData = {
        'hotspot-1': "細胞膜是細胞的守護者，控制物質進出。(The cell membrane is the guardian of the cell, controlling substances entering and exiting.)",
        'hotspot-2': "粒線體是細胞的能量工廠，產生ATP。(Mitochondria are the cell's power plants, generating ATP.)",
        'hotspot-3': "自由基過多會導致細胞損傷，抗氧化劑有助於中和它們。(Excessive free radicals can cause cell damage; antioxidants help neutralize them.)"
    };

    const hotspots = document.querySelectorAll('.hotspot');
    const hotspotTooltip = document.getElementById('hotspot-tooltip');
    const hotspotTextElement = document.getElementById('hotspot-text');
    const closeTooltipBtn = document.getElementById('close-tooltip-btn');

    hotspots.forEach(hotspot => {
        hotspot.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent click from bubbling to graphic container if that matters
            const hotspotId = hotspot.id;
            const textToShow = hotspotData[hotspotId];

            if (textToShow && hotspotTextElement && hotspotTooltip) {
                hotspotTextElement.textContent = textToShow;
                
                // Position tooltip - simple version: centered below the graphic container
                // More complex: position near event.clientX, event.clientY or hotspot.getBoundingClientRect()
                // For now, relying on CSS default position or a simple adjustment
                // The CSS has .hotspot-tooltip.active for display, so use showElement logic
                
                // Show tooltip (using a simplified version of showElement as tooltip might not need complex display changes)
                hotspotTooltip.style.display = 'block';
                // If CSS uses .active for opacity/transform transitions on tooltip:
                setTimeout(() => {
                    hotspotTooltip.classList.add('active'); 
                }, 10);

            } else {
                console.warn('Hotspot data or tooltip element not found for ID:', hotspotId);
            }
        });
    });

    if (closeTooltipBtn && hotspotTooltip) {
        closeTooltipBtn.addEventListener('click', () => {
            // Hide tooltip (using a simplified version of hideElement)
            hotspotTooltip.classList.remove('active');
            hotspotTooltip.addEventListener('transitionend', function handler() {
                if (!hotspotTooltip.classList.contains('active')) {
                    hotspotTooltip.style.display = 'none';
                }
                hotspotTooltip.removeEventListener('transitionend', handler);
            }, { once: true }); // Ensure handler is called only once
        });
    }
    
    // Optional: Close tooltip if clicking outside of it (but not on a hotspot)
    // document.addEventListener('click', (event) => {
    //     if (hotspotTooltip && hotspotTooltip.classList.contains('active')) {
    //         if (!hotspotTooltip.contains(event.target) && !Array.from(hotspots).some(h => h.contains(event.target))) {
    //             hotspotTooltip.classList.remove('active');
    //             // Add transitionend listener as above if needed
    //         }
    //     }
    // });

    // --- Custom Cursor Trail Effect ---
    const trailContainer = document.body; 
    const numDots = 7;
    const dots = [];
    const dotPositions = [];
    const dotBaseSize = 10;
    const easing = 0.15; 

    // Create dots
    for (let i = 0; i < numDots; i++) {
        const dot = document.createElement('div');
        dot.classList.add('trail-dot');
        dot.style.width = `${Math.max(2, dotBaseSize - i * 0.8)}px`; // Dots get smaller, min size 2px
        dot.style.height = `${Math.max(2, dotBaseSize - i * 0.8)}px`;
        trailContainer.appendChild(dot);
        dots.push(dot);
        dotPositions.push({ x: -100, y: -100 }); // Start off-screen
    }

    let mouseX = -100;
    let mouseY = -100;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateTrail() {
        // Update position of the first dot (leader)
        dotPositions[0].x += (mouseX - dotPositions[0].x) * easing;
        dotPositions[0].y += (mouseY - dotPositions[0].y) * easing;

        // Update positions of the rest of the dots
        for (let i = 1; i < numDots; i++) {
            dotPositions[i].x += (dotPositions[i-1].x - dotPositions[i].x) * easing;
            dotPositions[i].y += (dotPositions[i-1].y - dotPositions[i].y) * easing;
        }

        // Apply styles to dots
        dots.forEach((dot, index) => {
            const dotSize = parseFloat(dot.style.width); 
            dot.style.transform = `translate(${dotPositions[index].x - dotSize/2}px, ${dotPositions[index].y - dotSize/2}px)`;
            dot.style.opacity = (1 - index * (1 / numDots) * 0.7).toFixed(2); // Fade out further dots more
        });

        requestAnimationFrame(animateTrail);
    }

    animateTrail(); // Start the animation loop
});
