// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// DYNAMIC SCROLL-BASED COLOR TRANSITIONS
// Define color transitions for each scroll position
const colorStages = [
    { scrollPercent: 0, bg1: 'rgba(15, 15, 30, 0.95)', bg2: 'rgba(20, 10, 40, 0.8)', accent: '#FF1493' },
    { scrollPercent: 12, bg1: 'rgba(181, 55, 242, 0.2)', bg2: 'rgba(0, 217, 255, 0.15)', accent: '#00D9FF' },
    { scrollPercent: 25, bg1: 'rgba(10, 20, 40, 0.95)', bg2: 'rgba(15, 15, 30, 0.8)', accent: '#39FF14' },
    { scrollPercent: 38, bg1: 'rgba(40, 20, 60, 0.9)', bg2: 'rgba(20, 10, 40, 0.85)', accent: '#FF1493' },
    { scrollPercent: 50, bg1: 'rgba(10, 30, 40, 0.95)', bg2: 'rgba(15, 20, 35, 0.9)', accent: '#FFD60A' },
    { scrollPercent: 62, bg1: 'rgba(30, 10, 50, 0.95)', bg2: 'rgba(20, 15, 40, 0.9)', accent: '#FF1493' },
    { scrollPercent: 75, bg1: 'rgba(20, 20, 20, 0.98)', bg2: 'rgba(15, 15, 30, 0.9)', accent: '#00D9FF' },
    { scrollPercent: 88, bg1: 'rgba(50, 20, 30, 0.95)', bg2: 'rgba(30, 10, 40, 0.9)', accent: '#39FF14' },
    { scrollPercent: 100, bg1: 'rgba(10, 10, 10, 0.99)', bg2: 'rgba(5, 5, 15, 0.95)', accent: '#FF1493' }
];

function interpolateColor(color1, color2, factor) {
    // Extract RGB values
    const rgb1 = color1.match(/\d+/g);
    const rgb2 = color2.match(/\d+/g);
    
    if (!rgb1 || !rgb2) return color1;
    
    const r = Math.round(parseInt(rgb1[0]) + (parseInt(rgb2[0]) - parseInt(rgb1[0])) * factor);
    const g = Math.round(parseInt(rgb1[1]) + (parseInt(rgb2[1]) - parseInt(rgb1[1])) * factor);
    const b = Math.round(parseInt(rgb1[2]) + (parseInt(rgb2[2]) - parseInt(rgb1[2])) * factor);
    const a = (parseFloat(rgb1[3] || 1) + (parseFloat(rgb2[3] || 1) - parseFloat(rgb1[3] || 1)) * factor).toFixed(2);
    
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}

const headphoneBackdrop = document.querySelector('.headphone-backdrop');
let lastScrollY = window.scrollY;
let headphoneRotation = 0;

window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    const scrollDelta = window.scrollY - lastScrollY;
    headphoneRotation += scrollDelta * 0.12;
    if (headphoneBackdrop) {
        headphoneBackdrop.style.setProperty('--headphone-rotation', `${headphoneRotation}deg`);
    }
    lastScrollY = window.scrollY;
    
    // Find the two nearest color stages
    let stage1 = colorStages[0];
    let stage2 = colorStages[1];
    
    for (let i = 0; i < colorStages.length - 1; i++) {
        if (scrollPercent >= colorStages[i].scrollPercent && scrollPercent <= colorStages[i + 1].scrollPercent) {
            stage1 = colorStages[i];
            stage2 = colorStages[i + 1];
            break;
        }
    }
    
    // Calculate interpolation factor
    const stageDiff = stage2.scrollPercent - stage1.scrollPercent;
    const factor = (scrollPercent - stage1.scrollPercent) / stageDiff;
    
    // Create smooth color transition
    const bgColor1 = interpolateColor(stage1.bg1, stage2.bg1, factor);
    const bgColor2 = interpolateColor(stage1.bg2, stage2.bg2, factor);
    
    // Apply animated background with multiple gradients
    document.body.style.background = 
        `radial-gradient(circle at ${20 + scrollPercent * 0.5}% ${50 + Math.sin(scrollPercent / 10) * 20}%, ${bgColor1} 0%, transparent 40%),
         radial-gradient(circle at ${80 - scrollPercent * 0.4}% ${80 - Math.sin(scrollPercent / 15) * 25}%, ${bgColor2} 0%, transparent 40%),
         radial-gradient(circle at ${40 + Math.cos(scrollPercent / 20) * 30}% ${scrollPercent * 0.4}%, rgba(57, 255, 20, ${0.05 + (scrollPercent / 100) * 0.1}) 0%, transparent 50%),
         #0a0a0a`;
    
    // Add glow to sections based on scroll proximity
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const viewportCenter = window.innerHeight / 2;
        const sectionCenter = rect.top + rect.height / 2;
        const distanceFromCenter = Math.abs(sectionCenter - viewportCenter);
        const maxDistance = window.innerHeight * 1.5;
        const glowIntensity = Math.max(0, 1 - distanceFromCenter / maxDistance);
        
        if (glowIntensity > 0.1) {
            // Assign different glow colors based on section
            let glowColor = 'rgba(255, 20, 147, ';
            if (section.classList.contains('manifesto')) {
                glowColor = 'rgba(0, 217, 255, ';
            } else if (section.classList.contains('learning')) {
                glowColor = 'rgba(57, 255, 20, ';
            } else if (section.classList.contains('about-julia')) {
                glowColor = 'rgba(255, 214, 10, ';
            } else if (section.classList.contains('experience')) {
                glowColor = 'rgba(0, 217, 255, ';
            } else if (section.classList.contains('program')) {
                glowColor = 'rgba(181, 55, 242, ';
            } else if (section.classList.contains('testimonials')) {
                glowColor = 'rgba(57, 255, 20, ';
            } else if (section.classList.contains('cta-full')) {
                glowColor = 'rgba(255, 214, 10, ';
            }
            
            section.style.boxShadow = `inset 0 0 ${60 * glowIntensity}px ${glowColor}${0.3 * glowIntensity}), 
                                      0 0 ${40 * glowIntensity}px ${glowColor}${0.2 * glowIntensity})`;
        } else {
            section.style.boxShadow = 'none';
        }
    });
}, { passive: true });

// Intersection Observer for scroll-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Apply observer to animated elements
document.querySelectorAll('.learning-item, .experience-item, .program-item, .testimonial').forEach((el, index) => {
    el.style.animationDelay = (index * 0.1) + 's';
    observer.observe(el);
});

// Glow effect on mouse move for buttons
document.addEventListener('mousemove', (e) => {
    const buttons = document.querySelectorAll('.btn-hot-pink, .btn-cta');
    buttons.forEach(btn => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (x > 0 && x < rect.width && y > 0 && y < rect.height) {
            const glowColor = btn.classList.contains('btn-cta') ? 'rgba(255, 214, 10, ' : 'rgba(255, 20, 147, ';
            btn.style.boxShadow = `0 0 30px ${glowColor}0.8), ${x}px ${y}px 20px ${glowColor}0.3)`;
        }
    });
});

// Trigger initial animation
window.dispatchEvent(new Event('scroll'));

console.log('Julia Bliss DJ Academy - Ready to learn, mix, and dominate!');
