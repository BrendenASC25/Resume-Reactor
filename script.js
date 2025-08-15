function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}
function createRaindrop(container) {
  const drop = document.createElement('span');
  drop.style.left = randomBetween(0, 98) + 'vw';
  drop.style.animationDuration = randomBetween(1.8, 3.5) + 's';
  drop.style.opacity = randomBetween(0.2, 0.7);
  drop.style.width = randomBetween(3, 8) + 'px';
  drop.style.height = randomBetween(10, 22) + 'px';
  container.appendChild(drop);
  drop.addEventListener('animationend', () => {
    drop.remove();
    createRaindrop(container);
  });
}
function createParticle(container) {
  const particle = document.createElement('span');
  particle.classList.add('particle');
  particle.style.left = Math.random() * 100 + 'vw';
  particle.style.top = Math.random() * 100 + 'vh';
  particle.style.animationDuration = Math.random() * 5 + 5 + 's';
  particle.style.opacity = Math.random();
  container.appendChild(particle);
  setTimeout(() => particle.remove(), 10000);
}
function typeWriter(text, element, speed = 30) {
  element.textContent = '';
  let i = 0;
  const interval = setInterval(() => {
    element.textContent += text.charAt(i++);
    if (i >= text.length) clearInterval(interval);
  }, speed);
}
document.addEventListener('DOMContentLoaded', () => {
  const topResumeButton = document.querySelector('#resume-generator');
  const generateSection = document.getElementById('generate-section');
  if (topResumeButton && generateSection) {
    topResumeButton.addEventListener('click', e => {
      e.preventDefault();
      generateSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
  const rainContainer = document.querySelector('.bg-raindrops');
  if (rainContainer) {
    rainContainer.innerHTML = '';
    for (let i = 0; i < 18; i++) createRaindrop(rainContainer);
  }
  const particleContainer = document.body;
  for (let i = 0; i < 20; i++) createParticle(particleContainer);
  setInterval(() => createParticle(particleContainer), 1500);
  const generateBtn = document.querySelector('#generate');
  const jobDescriptionInput = document.querySelector('#job-description');
  const preview = document.querySelector('#preview');
  if (generateBtn && jobDescriptionInput && preview) {
    generateBtn.addEventListener('click', async () => {
      const text = jobDescriptionInput.value.trim();
      if (!text) {
        preview.textContent = 'Please enter a job description first.';
        return;
      }
      preview.textContent = 'Generating...';
      try {
        const response = await fetch('http://localhost:3000/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobDescription: text })
        });
        const data = await response.json();
        typeWriter(data.result, preview);
      } catch (err) {
        preview.textContent = 'Error generating resume: ' + err.message;
      }
    });
  }
  const musicBtn = document.querySelector('#music-btn');
  const music = document.querySelector('#bg-music');
  let isPlaying = false;
  if (musicBtn && music) {
    music.volume = 0.6;
    musicBtn.addEventListener('click', () => {
      if (isPlaying) {
        music.pause();
        musicBtn.classList.remove('music-playing');
      } else {
        music.play();
        musicBtn.classList.add('music-playing');
      }
      isPlaying = !isPlaying;
    });
  }
  const sections = document.querySelectorAll('.content-section');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.2 });
  sections.forEach(sec => observer.observe(sec));
  const pitchdeckButton = document.querySelector('#pitchdeck');
  if (pitchdeckButton) {
    pitchdeckButton.addEventListener('click', () => {
      window.open(
        'https://docs.google.com/presentation/d/1CqK0sW_XYZIcRhxkt_nU2VVMXuVr58n0-Pz2BxW2Kno/edit?slide=id.p1#slide=id.p1',
        '_blank'
      );
    });
  }
  const mvpButton = document.querySelector('#MVP');
  if (mvpButton) {
    mvpButton.addEventListener('click', () => {
      window.open('MVP/index.html', '_blank');
    });
  }
});
