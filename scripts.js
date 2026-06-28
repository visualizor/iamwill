const isHoverDevice = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// dot nav active state
const sections = document.querySelectorAll('section');
const dots     = document.querySelectorAll('#dot-nav a');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      dots.forEach(d => d.classList.remove('active'));
      const id = entry.target.id;
      document.querySelector('#dot-nav a[href="#' + id + '"]').classList.add('active');
    }
  });
}, { threshold: 0.5 });
sections.forEach(s => observer.observe(s));

if (isHoverDevice) {

  // hover videos
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

  // image hover swap
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

} else {

  // touch: rebuild section 1 grid as flat layout
  const grid  = document.querySelector('#section1 .grid');
  const items = [...grid.querySelectorAll('.grid-item')];
  const flat  = [];

  items.forEach(item => {
    const vidWrap = item.querySelector('.vid-wrap');
    const imgSwap = item.querySelector('.img-swap');

    if (vidWrap) {
      // show the video directly, autoplaying
      const video = vidWrap.querySelector('video').cloneNode(true);
      video.setAttribute('autoplay', '');
      video.removeAttribute('preload');
      const link = vidWrap.querySelector('a');
      const div  = document.createElement('div');
      div.className = 'grid-item';
      if (link) {
        const a = document.createElement('a');
        a.href = link.href;
        const label = link.getAttribute('aria-label');
        if (label) a.setAttribute('aria-label', label);
        a.appendChild(video);
        div.appendChild(a);
      } else {
        div.appendChild(video);
      }
      flat.push(div);

    } else if (imgSwap) {
      // split into two tiles: base and hover image
      const baseEl  = imgSwap.querySelector('a') ?? imgSwap.querySelector('img:not(.img-over)');
      const imgOver = imgSwap.querySelector('.img-over');

      const div1 = document.createElement('div');
      div1.className = 'grid-item';
      div1.appendChild(baseEl.cloneNode(true));
      flat.push(div1);

      const div2  = document.createElement('div');
      div2.className = 'grid-item';
      const clone = imgOver.cloneNode(true);
      clone.classList.remove('img-over');
      div2.appendChild(clone);
      flat.push(div2);

    } else {
      // plain tile — keep as-is
      flat.push(item.cloneNode(true));
    }
  });

  grid.innerHTML = '';
  flat.forEach(item => grid.appendChild(item));
}

// JS tooltip for nav dots
const tooltip = document.createElement('div');
tooltip.id = 'dot-tooltip';
document.body.appendChild(tooltip);
document.querySelectorAll('#dot-nav a').forEach(dot => {
  dot.addEventListener('mouseenter', () => {
    tooltip.textContent = dot.dataset.title;
    document.body.appendChild(tooltip);
    tooltip.style.opacity = '0';
    void tooltip.offsetWidth;
    const rect    = dot.getBoundingClientRect();
    const tipRect = tooltip.getBoundingClientRect();
    tooltip.style.left  = `${rect.left - tipRect.width - 6}px`;
    tooltip.style.top   = `${rect.top + rect.height / 2 - tipRect.height / 2}px`;
    tooltip.style.opacity = '1';
  });
  dot.addEventListener('mouseleave', () => {
    tooltip.style.opacity = '0';
  });
});
