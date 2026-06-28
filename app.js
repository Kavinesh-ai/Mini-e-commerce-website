const app = document.getElementById('app');
let products = [];

async function loadProducts() {
  try {
    const response = await fetch('products.json');
    if (!response.ok) throw new Error('Unable to load products');
    products = await response.json();
    render();
  } catch (error) {
    app.innerHTML = `<p class="status">${error.message}</p>`;
  }
}

function render() {
  const path = window.location.pathname;

  if (path.startsWith('/product/')) {
    const id = path.split('/').pop();
    const product = products.find((item) => item.id === id);
    if (product) {
      renderProduct(product);
    } else {
      renderHome();
    }
    return;
  }

  if (path === '/about') {
    renderAbout();
    return;
  }

  renderHome();
}

function renderHome() {
  app.innerHTML = `
    <section class="hero">
      <h1>Smart picks for modern living</h1>
      <p>Discover a compact catalog of premium everyday essentials.</p>
    </section>
    <section class="grid">
      ${products
        .map(
          (product) => `
            <article class="card">
              <img src="${product.image}" alt="${product.name}" loading="lazy" />
              <h3>${product.name}</h3>
              <p>${product.short}</p>
              <div class="price">${product.price}</div>
              <a class="btn" href="/product/${product.id}" data-link>View details</a>
            </article>
          `
        )
        .join('')}
    </section>
  `;
}

function renderProduct(product) {
  app.innerHTML = `
    <section class="detail">
      <img src="${product.image}" alt="${product.name}" />
      <div>
        <span class="badge">${product.tag}</span>
        <h1>${product.name}</h1>
        <p>${product.description}</p>
        <div class="price">${product.price}</div>
        <a class="btn" href="/" data-link>Back to catalog</a>
      </div>
    </section>
  `;
}

function renderAbout() {
  app.innerHTML = `
    <section class="about">
      <h2>About Northstar Store</h2>
      <p>This small storefront shows a clean product catalog experience with client-side routing, reusable components, and simple performance-friendly assets.</p>
    </section>
  `;
}

document.addEventListener('click', (event) => {
  const link = event.target.closest('a[data-link]');
  if (!link) return;

  const path = link.getAttribute('href');
  event.preventDefault();
  history.pushState({}, '', path);
  render();
});

window.addEventListener('popstate', render);
window.addEventListener('DOMContentLoaded', loadProducts);
