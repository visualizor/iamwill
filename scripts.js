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


// — hover videos —
document.querySelectorAll('.vid-wrap').forEach(vidWrap => {
  const video = vidWrap.querySelector('video');

  vidWrap.addEventListener('mouseenter', () => {
    if (video.readyState < 3) vidWrap.classList.add('buffering');
    video.play().then(() => {
      vidWrap.classList.remove('buffering');
      vidWrap.classList.add('playing');
    }).catch(() => {
      vidWrap.classList.remove('buffering');
    });
  });

  vidWrap.addEventListener('mouseleave', () => {
    vidWrap.classList.remove('playing', 'buffering');
    video.pause();
    video.currentTime = 0;
  });
});

// — image hover swap (base → white → new, reversed on leave) —
document.querySelectorAll('.img-swap').forEach(imgSwap => {
  const link    = imgSwap.querySelector('a') ?? imgSwap.querySelector('img:not(.img-over)');
  const imgOver = imgSwap.querySelector('.img-over');
  imgSwap.addEventListener('mouseenter', () => {
    link.style.transition    = 'opacity 0.4s ease';
    link.style.opacity       = '0';
    imgOver.style.transition = 'opacity 0.4s ease';
    imgOver.style.opacity    = '1';
  });

  imgSwap.addEventListener('mouseleave', () => {
    link.style.transition    = 'opacity 0.4s ease';
    link.style.opacity       = '1';
    imgOver.style.transition = 'opacity 0.4s ease';
    imgOver.style.opacity    = '0';
  });
});

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