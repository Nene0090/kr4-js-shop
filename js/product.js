const productTitle = document.getElementById('productTitle');
const productPrice = document.getElementById('productPrice');
const productDesc = document.getElementById('productDesc');
const productImage = document.getElementById('productImage');
const productSpecs = document.getElementById('productSpecs');
const productRating = document.getElementById('productRating');
const productStatus = document.getElementById('productStatus');
const productAddBtn = document.getElementById('productAddBtn');

function formatPrice(price) {
  return `${price.toLocaleString('ru-RU')} руб.`;
}

function getFinalPrice(product) {
  return Math.round(product.price - product.price * product.discountPercent / 100);
}

function loadCart() {
  try {
    const raw = localStorage.getItem('starhit-cart');
    const value = raw === null ? [] : JSON.parse(raw);
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem('starhit-cart', JSON.stringify(items));
}

function updateCartCounters() {
  const total = loadCart().reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('.cart-counter').forEach((element) => {
    element.textContent = `Корзина: ${total}`;
  });
}

if (productTitle) {
  const product = products[0];

  if (!product) {
    productTitle.textContent = 'Товар не найден';
  } else {
    document.title = `Star Hit Cafe — ${product.title}`;
    productTitle.textContent = product.title;

    if (productPrice) {
      productPrice.textContent = '';
      if (product.discountPercent > 0) {
        const oldPrice = document.createElement('span');
        oldPrice.classList.add('product-detail__price-old');
        oldPrice.textContent = formatPrice(product.price);
        productPrice.append(oldPrice);
        
        const newPrice = document.createElement('span');
        newPrice.classList.add('product-detail__price-new');
        newPrice.textContent = formatPrice(getFinalPrice(product));
        productPrice.append(newPrice);
      } else {
        productPrice.textContent = formatPrice(product.price);
      }
    }

    if (productDesc) {
      productDesc.textContent = product.description;
    }

    if (productImage) {
      productImage.src = product.image;
      productImage.alt = product.title;
    }

    if (productRating) {
      productRating.textContent = `★ ${product.rating.toFixed(1)}`;
    }

    if (productStatus) {
      productStatus.textContent = product.isAvailable ? 'В наличии' : 'Нет в наличии';
      productStatus.classList.toggle('is-unavailable', !product.isAvailable);
    }

    if (productSpecs) {
      productSpecs.textContent = '';
      Object.entries(product.specs).forEach(([key, value]) => {
        const row = document.createElement('tr');
        const cellKey = document.createElement('td');
        cellKey.textContent = key;
        const cellValue = document.createElement('td');
        cellValue.textContent = value;
        row.append(cellKey, cellValue);
        productSpecs.append(row);
      });
    }

    if (productAddBtn) {
      if (!product.isAvailable) {
        productAddBtn.disabled = true;
        productAddBtn.textContent = 'Недоступно';
      } else {
        productAddBtn.addEventListener('click', () => {
          const cart = loadCart();
          const existing = cart.find((item) => item.productId === product.id);
          if (existing) {
            existing.quantity += 1;
          } else {
            cart.push({ productId: product.id, quantity: 1 });
          }
          saveCart(cart);
          updateCartCounters();
          productAddBtn.textContent = 'Добавлено';
          setTimeout(() => {
            productAddBtn.textContent = 'В корзину';
          }, 1500);
        });
      }
    }

    updateCartCounters();
  }
}