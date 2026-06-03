document.addEventListener('DOMContentLoaded', () => {
  // --- All Pages Setup ---
  initNavigation();
  initLoginModal();
  initPageLoader();
  
  // --- Page Specific Initializations ---
  const path = window.location.pathname;
  const page = path.substring(path.lastIndexOf('/') + 1);
  
  if (page === '' || page === 'index.html') {
    initCarousel();
    initSocialShare();
    initHeroSpotlight();
  } else if (page === 'menu.html') {
    initMenuFilter();
  } else if (page === 'info.html') {
    initContactForm();
  } else if (page === 'order.html') {
    initOrderForm();
  }
});

/* ==========================================================================
   1. Navigation & Scroll Effects
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Scrolled Header Effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile Menu Toggle
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // Active Link Highlight
  const currentPath = window.location.pathname;
  const currentFile = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';
  
  navLinks.forEach(link => {
    const linkFile = link.getAttribute('href');
    if (linkFile === currentFile) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ==========================================================================
   2. Member Login Modal
   ========================================================================== */
function initLoginModal() {
  const loginBtns = document.querySelectorAll('.login-btn');
  const modalOverlay = document.getElementById('loginModal');
  const modalClose = document.querySelector('.modal-close');
  
  if (!modalOverlay) return;

  // Open Modal
  loginBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden'; // Lock background scroll
    });
  });

  // Close Modal
  const closeModal = () => {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  // Close when clicking overlay
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // Handle Login Form Submission
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      alert(`歡迎回來，平方茶莊會員！您已成功登入為: ${email}`);
      closeModal();
    });
  }
}

/* ==========================================================================
   3. Interactive Ad Carousel (Home Page Only)
   ========================================================================== */
function initCarousel() {
  const slides = document.querySelectorAll('.carousel-slide');
  const dotsContainer = document.querySelector('.carousel-dots');
  const prevBtn = document.querySelector('.carousel-btn-prev');
  const nextBtn = document.querySelector('.carousel-btn-next');
  
  if (slides.length === 0) return;
  
  let currentSlide = 0;
  let slideInterval;
  const intervalTime = 5000; // 5 seconds

  // Create dots dynamically
  slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('carousel-dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      goToSlide(index);
      resetTimer();
    });
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.carousel-dot');

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    currentSlide = (index + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  // Event Listeners
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetTimer();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetTimer();
    });
  }

  // Auto slide timer
  function startTimer() {
    slideInterval = setInterval(nextSlide, intervalTime);
  }

  function resetTimer() {
    clearInterval(slideInterval);
    startTimer();
  }

  // Pause on hover
  const carouselContainer = document.querySelector('.carousel-container');
  if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
    carouselContainer.addEventListener('mouseleave', startTimer);
  }

  startTimer();
}

/* ==========================================================================
   4. Social Share Actions
   ========================================================================== */
function initSocialShare() {
  const shareCards = document.querySelectorAll('.share-card');
  
  shareCards.forEach(card => {
    card.addEventListener('click', () => {
      const type = card.classList.contains('fb') ? 'Facebook' :
                   card.classList.contains('line') ? 'Line' :
                   card.classList.contains('ig') ? 'Instagram' : 'CopyLink';
      
      const shareUrl = window.location.href;
      
      if (type === 'CopyLink') {
        navigator.clipboard.writeText(shareUrl).then(() => {
          alert('網站連結已成功複製到剪貼簿！');
        }).catch(err => {
          console.error('無法複製連結:', err);
        });
      } else {
        // Open mock social share popup
        alert(`正在開啟 ${type} 分享視窗，分享網址: ${shareUrl}`);
      }
    });
  });
}

/* ==========================================================================
   5. Menu Category Filtration (Menu Page Only)
   ========================================================================== */
function initMenuFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const menuCards = document.querySelectorAll('.menu-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active class on buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      menuCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.classList.remove('hidden');
          // Simple animation trigger
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   6. Contact Form validation (Store Info Page Only)
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const msg = document.getElementById('message').value;

    if (!name || !email || !msg) {
      alert('請填寫姓名、Email 以及留言內容！');
      return;
    }

    // Success response
    alert(`感謝您的留言，${name} 先生/小姐！\n我們已將您的建議寄送至平方茶莊信箱，專人會儘速於 24 小時內以 Email (${email}) 或電話 (${phone || '未提供'}) 與您聯繫！`);
    contactForm.reset();
  });
}

/* ==========================================================================
   7. Dynamic Order Form & Calculator (Ordering Area Page Only)
   ========================================================================== */
// Tea prices per catty (斤)
const TEA_PRICES = {
  'honey-black': { name: '蜜香紅茶', price: 800 },
  'ruby-red': { name: '日月潭紅玉', price: 1200 },
  'longjing-green': { name: '三峽龍井', price: 900 },
  'biluochun-green': { name: '碧螺春', price: 1000 },
  'baozhong-oolong': { name: '文山包種', price: 1100 },
  'highmountain-oolong': { name: '高山烏龍', price: 1500 },
  'beauty-oolong': { name: '東方美人', price: 2000 },
  'tieguanyin-oolong': { name: '木柵鐵觀音', price: 1300 },
  'chrysanthemum': { name: '菊花茶', price: 600 },
  'puer': { name: '普洱茶', price: 950 },
  'dongpian': { name: '冬片茶', price: 1600 }
};

function initOrderForm() {
  const itemsContainer = document.getElementById('orderItemsContainer');
  const btnAddItem = document.getElementById('btnAddItem');
  const summaryList = document.getElementById('summaryList');
  const totalPriceElement = document.getElementById('totalPrice');
  const totalCattiesElement = document.getElementById('totalCatties');
  const orderForm = document.getElementById('orderForm');
  const orderAlert = document.getElementById('orderAlert');

  if (!itemsContainer || !btnAddItem) return;

  // Add initial item row
  addItemRow();

  btnAddItem.addEventListener('click', () => addItemRow());

  function addItemRow() {
    const row = document.createElement('div');
    row.classList.add('order-item-row');
    
    // Select dropdown options
    let optionsHtml = '<option value="" disabled selected>請選擇茶品</option>';
    for (const [key, item] of Object.entries(TEA_PRICES)) {
      optionsHtml += `<option value="${key}">${item.name} ($${item.price}/斤)</option>`;
    }

    row.innerHTML = `
      <select class="form-control select-tea" required>
        ${optionsHtml}
      </select>
      <input type="number" class="form-control input-qty" min="1" value="1" placeholder="數量" required>
      <div style="font-weight:600; color:var(--primary-color); padding-left:10px;">
        小計: <span class="row-subtotal">$0</span>
      </div>
      <button type="button" class="btn-remove-row" title="刪除此列">✕</button>
    `;

    itemsContainer.appendChild(row);

    // Event Listeners for new inputs
    const select = row.querySelector('.select-tea');
    const qtyInput = row.querySelector('.input-qty');
    const btnRemove = row.querySelector('.btn-remove-row');

    select.addEventListener('change', () => {
      updateRowSubtotal(row);
      calculateOrder();
    });

    qtyInput.addEventListener('input', () => {
      updateRowSubtotal(row);
      calculateOrder();
    });

    btnRemove.addEventListener('click', () => {
      // Keep at least one row
      if (document.querySelectorAll('.order-item-row').length > 1) {
        row.remove();
        calculateOrder();
      } else {
        alert('請至少保留一個訂購項目！');
      }
    });
  }

  function updateRowSubtotal(row) {
    const select = row.querySelector('.select-tea');
    const qtyInput = row.querySelector('.input-qty');
    const subtotalText = row.querySelector('.row-subtotal');

    const teaKey = select.value;
    const qty = parseInt(qtyInput.value) || 0;

    if (teaKey && TEA_PRICES[teaKey]) {
      const price = TEA_PRICES[teaKey].price;
      const subtotal = price * qty;
      subtotalText.innerText = `$${subtotal.toLocaleString()}`;
      return subtotal;
    }
    
    subtotalText.innerText = '$0';
    return 0;
  }

  function calculateOrder() {
    const rows = document.querySelectorAll('.order-item-row');
    summaryList.innerHTML = '';
    
    let totalCatties = 0;
    let totalPrice = 0;
    
    rows.forEach(row => {
      const select = row.querySelector('.select-tea');
      const qtyInput = row.querySelector('.input-qty');
      
      const teaKey = select.value;
      const qty = parseInt(qtyInput.value) || 0;
      
      if (teaKey && TEA_PRICES[teaKey]) {
        const item = TEA_PRICES[teaKey];
        const subtotal = item.price * qty;
        
        totalCatties += qty;
        totalPrice += subtotal;
        
        // Add to summary UI
        const li = document.createElement('li');
        li.classList.add('summary-item');
        li.innerHTML = `
          <span>${item.name} x ${qty} 斤</span>
          <span>$${subtotal.toLocaleString()}</span>
        `;
        summaryList.appendChild(li);
      }
    });
    
    // Display total
    totalPriceElement.innerText = `$${totalPrice.toLocaleString()}`;
    totalCattiesElement.innerText = `${totalCatties} 斤`;
    
    // 大宗訂單警告 (20斤以上需要一個月前備貨)
    if (totalCatties >= 20) {
      orderAlert.style.display = 'block';
    } else {
      orderAlert.style.display = 'none';
    }
  }

  // Handle Order Submit
  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const buyer = document.getElementById('buyerName').value;
      const phone = document.getElementById('buyerPhone').value;
      const address = document.getElementById('buyerAddress').value || '無';
      const taxId = document.getElementById('buyerTaxId').value || '無';
      
      const rows = document.querySelectorAll('.order-item-row');
      let hasTea = false;
      let orderDetails = [];
      let totalCatties = 0;
      let totalPrice = 0;
      
      rows.forEach(row => {
        const select = row.querySelector('.select-tea');
        const qtyInput = row.querySelector('.input-qty');
        
        const teaKey = select.value;
        const qty = parseInt(qtyInput.value) || 0;
        
        if (teaKey && TEA_PRICES[teaKey]) {
          hasTea = true;
          const item = TEA_PRICES[teaKey];
          const subtotal = item.price * qty;
          totalCatties += qty;
          totalPrice += subtotal;
          orderDetails.push(`${item.name} x ${qty}斤`);
        }
      });
      
      if (!hasTea) {
        alert('請選擇至少一樣茶品與填寫數量！');
        return;
      }
      
      let message = `【訂單確認通知】\n`;
      message += `訂購人: ${buyer}\n`;
      message += `聯絡電話: ${phone}\n`;
      message += `外送地址: ${address}\n`;
      message += `發票收據/統編: ${taxId}\n`;
      message += `訂購品項:\n - ${orderDetails.join('\n - ')}\n`;
      message += `總重量: ${totalCatties} 斤\n`;
      message += `總金額: NT$ ${totalPrice.toLocaleString()}\n\n`;
      
      if (totalCatties >= 20) {
        message += `⚠️ 提醒您：大宗訂單 (20 斤以上) 備貨期為一個月，備貨將在付完訂金後正式開始，平方茶莊將由專人電話聯繫您確認收款與送貨細節！`;
      } else {
        message += `平方茶莊已收到您的訂單！我們將儘速備貨並安排出貨。`;
      }
      
      alert(message);
      orderForm.reset();
      
      itemsContainer.innerHTML = '';
      addItemRow();
      calculateOrder();
    });
  }
}

/* ==========================================================================
   8. Page Loader Fade Out Effect
   ========================================================================== */
function initPageLoader() {
  const loader = document.getElementById('loaderOverlay');
  if (loader) {
    // Hide loader after a brief visual delay to feel premium
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('fade-out');
      }, 400);
    });
    
    // Safety fallback in case load event already fired or takes too long
    setTimeout(() => {
      if (!loader.classList.contains('fade-out')) {
        loader.classList.add('fade-out');
      }
    }, 2000);
  }
}

/* ==========================================================================
   9. Hero Spotlight Cursor Follow Effect
   ========================================================================== */
function initHeroSpotlight() {
  const hero = document.getElementById('heroSection');
  if (!hero) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Set custom properties to update gradient center
    hero.style.setProperty('--mouse-x', `${x}%`);
    hero.style.setProperty('--mouse-y', `${y}%`);
  });
}

