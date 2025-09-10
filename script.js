// Task 4: Interactive button repurposed as theme switch
const modeBtn = document.getElementById('modeBtn');
const logoutBtn = document.getElementById('logoutBtn');
const postsList = document.getElementById('posts');
const gallery = document.getElementById('gallery');
const loginForm = document.getElementById('loginForm');
const loginMsg = document.getElementById('loginMsg');
const dashboard = document.getElementById('dashboard');
const fetchPostsBtn = document.getElementById('fetchPostsBtn');
const loadImagesBtn = document.getElementById('loadImagesBtn');
const yearSpan = document.getElementById('year');

yearSpan.textContent = new Date().getFullYear();

// Persisted theme
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
updateModeBtn(savedTheme);

// Toggle theme
modeBtn.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateModeBtn(next);
});

function updateModeBtn(theme) {
  modeBtn.textContent = theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
}

// Task 6: Form validation (client-side)
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const password = document.getElementById('password');

  let valid = true;
  if (name.value.trim().length < 3) { name.classList.add('is-invalid'); valid = false; } else name.classList.remove('is-invalid');
  if (!email.value.includes('@')) { email.classList.add('is-invalid'); valid = false; } else email.classList.remove('is-invalid');
  if (password.value.length < 6) { password.classList.add('is-invalid'); valid = false; } else password.classList.remove('is-invalid');

  if (!valid) {
    loginMsg.textContent = 'Please fix errors above.';
    loginMsg.className = 'mt-3 small text-danger';
    return;
  }

  // Simulated auth success
  localStorage.setItem('loggedIn', '1');
  loginMsg.textContent = 'Login successful! Redirecting to Dashboard...';
  loginMsg.className = 'mt-3 small text-success';
  setTimeout(() => {
    document.getElementById('dashboard').classList.remove('d-none');
    document.getElementById('logoutBtn').classList.remove('d-none');
    window.location.hash = '#dashboard';
  }, 400);
});

// Restore session
if (localStorage.getItem('loggedIn') === '1') {
  dashboard.classList.remove('d-none');
  logoutBtn.classList.remove('d-none');
}

// Logout
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('loggedIn');
  postsList.innerHTML = '';
  gallery.innerHTML = '';
  dashboard.classList.add('d-none');
  logoutBtn.classList.add('d-none');
  window.location.hash = '#login';
});

// Task 5: API Integration (JSONPlaceholder)
fetchPostsBtn.addEventListener('click', async () => {
  postsList.innerHTML = '<li class="list-group-item">Loading...</li>';
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=6');
    const data = await res.json();
    postsList.innerHTML = '';
    data.forEach(post => {
      const li = document.createElement('li');
      li.className = 'list-group-item';
      li.innerHTML = `<strong>${post.id}. ${post.title}</strong><br><span class="text-muted">${post.body}</span>`;
      postsList.appendChild(li);
    });
  } catch (err) {
    postsList.innerHTML = '<li class="list-group-item text-danger">Failed to fetch posts.</li>';
    console.error(err);
  }
});

// Load images (Picsum) - no key required
loadImagesBtn.addEventListener('click', () => {
  gallery.innerHTML = '';
  const count = 6;
  for (let i = 0; i < count; i++) {
    const img = document.createElement('img');
    // Cache-bust to force new images
    img.src = `https://picsum.photos/seed/${Date.now()}-${i}/400/300`;
    img.alt = 'Random image';
    img.loading = 'lazy';
    gallery.appendChild(img);
  }
});
