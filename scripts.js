// highlight the right dot as each section becomes >50% in view
const sections = document.querySelectorAll('section');
const dots     = document.querySelectorAll('#dot-nav a');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
    if (entry.isIntersecting) {
        dots.forEach(d => d.classList.remove('active'));
        const id = entry.target.id;
        document.querySelector('#dot-nav a[href="#'+id+'"]')
                .classList.add('active');
    }
    });
}, { threshold: 0.5 });
sections.forEach(s => observer.observe(s));

function trapScroll(selector) {
  const el = document.querySelector(selector);
  el.addEventListener('wheel', e => {
    const atTop    = el.scrollTop === 0;
    const atBottom = Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) < 1;
    // if NOT at the very ends, eat the event here
    if ((e.deltaY < 0 && !atTop) || (e.deltaY > 0 && !atBottom)) {
      e.stopPropagation();
    }
  }, { passive: false });
}
// apply to both the image grid and the tools list
trapScroll('#section1 .grid');
trapScroll('#section4 ul');


// — JS-tooltip for the nav dots —
const tooltip = document.createElement('div');
tooltip.id = 'dot-tooltip';
document.body.appendChild(tooltip);

document.querySelectorAll('#dot-nav a').forEach(dot => {
  dot.addEventListener('mouseenter', () => {
  tooltip.textContent = dot.dataset.title;
  document.body.appendChild(tooltip);
  tooltip.style.opacity = '0';
  void tooltip.offsetWidth;
  const rect   = dot.getBoundingClientRect();
  const tipRect = tooltip.getBoundingClientRect();
  // position tooltip to the left, vertically centered
  tooltip.style.left  = `${rect.left - tipRect.width - 6}px`;
  tooltip.style.top   = `${rect.top + rect.height/2 - tipRect.height/2}px`;
  tooltip.style.opacity = '1';
});
  dot.addEventListener('mouseleave', () => {
    tooltip.style.opacity = '0';
  });
});