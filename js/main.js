document.addEventListener('DOMContentLoaded', () => {
  // --- All Pages Setup ---
  initNavigation();
  initLoginModal();
  initPageLoader();
  initSocialShare();
  
  // --- Page Specific Initializations ---
  const path = window.location.pathname;
  const page = path.substring(path.lastIndexOf('/') + 1);
  
  if (page === '' || page === 'index.html') {
    initCarousel();
    initHeroSpotlight();
  } else if (page === 'menu.html') {
    initMenuFilter();
    initMenuSelects();
    initTeaDetails();
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
  const shareCards = document.querySelectorAll('.share-card, .footer-share-card');
  
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
        const cardCategory = card.getAttribute('data-category') || '';
        const categories = cardCategory.split(' ');
        
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.classList.remove('hidden');
          
          // Programmatically switch the dropdown choice if filter matches specific type
          const select = card.querySelector('.menu-product-select');
          if (select && filterValue !== 'all') {
            const selectOptions = Array.from(select.options);
            const matchingOpt = selectOptions.find(opt => opt.getAttribute('data-type') === filterValue);
            if (matchingOpt && select.value !== matchingOpt.value) {
              select.value = matchingOpt.value;
              select.dispatchEvent(new Event('change'));
            }
          }

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

function initMenuSelects() {
  const selects = document.querySelectorAll('.menu-product-select');
  selects.forEach(select => {
    // Add event listener to handle changes
    select.addEventListener('change', () => {
      const card = select.closest('.menu-card');
      if (!card) return;

      const selectedOpt = select.options[select.selectedIndex];
      const teaId = select.value;
      const price = selectedOpt.getAttribute('data-price');
      const unit = selectedOpt.getAttribute('data-unit');
      const tagText = selectedOpt.getAttribute('data-tag');
      const tagBg = selectedOpt.getAttribute('data-tag-bg');
      const tagColor = selectedOpt.getAttribute('data-tag-color');

      // Update card ID so clicking open details popup works for selected tea variety
      card.setAttribute('data-id', teaId);

      // Update tag display
      const tagEl = card.querySelector('.menu-tag');
      if (tagEl) {
        tagEl.innerText = tagText;
        tagEl.style.backgroundColor = tagBg;
        tagEl.style.color = tagColor;
      }

      // Update temp badges visibility (hide for tea-leaves, show for tea-drink)
      const tempBadges = card.querySelector('.menu-temp-badges');
      if (tempBadges) {
        if (teaId.endsWith('-leaves')) {
          tempBadges.style.display = 'none';
        } else {
          tempBadges.style.display = 'flex';
        }
      }

      // Update price display
      const priceEl = card.querySelector('.menu-card-price');
      if (priceEl) {
        priceEl.innerHTML = `${price} <span style="font-size:0.75rem; color:var(--text-muted);">/ ${unit}</span>`;
      }
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
    const category = document.getElementById('category').value;
    const msg = document.getElementById('message').value;

    if (!name || !email || !category || !msg) {
      alert('請填寫姓名、Email、諮詢類別以及留言內容！');
      return;
    }

    // Success response
    alert(`感謝您的留言，${name} 先生/小姐！\n關於您詢問的「${category}」事宜，我們已收到留言。專人會儘速於 24 小時內以 Email (${email}) 或電話 (${phone || '未提供'}) 與您聯繫！`);
    contactForm.reset();
  });
}

/* ==========================================================================
   7. Dynamic Order Form & Calculator (Ordering Area Page Only)
   ========================================================================== */
// Tea prices per unit (杯/瓶/壺/盒)
const TEA_PRICES = {
  // Tea Drinks
  'honey-black-drink': { name: '蜜香冷泡紅茶', price: 65, unit: '杯', type: 'tea-drink' },
  'ruby-red-drink': { name: '日月潭紅玉現泡茶', price: 80, unit: '杯', type: 'tea-drink' },
  'longjing-green-drink': { name: '三峽龍井冷萃綠茶', price: 70, unit: '杯', type: 'tea-drink' },
  'biluochun-green-drink': { name: '碧螺春現泡綠茶', price: 75, unit: '杯', type: 'tea-drink' },
  'highmountain-oolong-drink': { name: '阿里山高山烏龍', price: 90, unit: '杯', type: 'tea-drink' },
  'beauty-oolong-drink': { name: '東方美人香茗', price: 120, unit: '杯', type: 'tea-drink' },
  'tieguanyin-oolong-drink': { name: '木柵鐵觀音', price: 85, unit: '杯', type: 'tea-drink' },
  'chrysanthemum-drink': { name: '無毒契作菊花茶', price: 60, unit: '杯', type: 'tea-drink' },
  'puer-drink': { name: '陳年普洱熟茶', price: 95, unit: '杯', type: 'tea-drink' },
  'dongpian-drink': { name: '翠玉冬片茶', price: 100, unit: '杯', type: 'tea-drink' },

  // Tea Leaves (斤)
  'honey-black-leaves': { name: '蜜香紅茶茶葉', price: 1400, unit: '斤', type: 'tea-leaves' },
  'ruby-red-leaves': { name: '日月潭紅玉茶葉', price: 1600, unit: '斤', type: 'tea-leaves' },
  'longjing-green-leaves': { name: '三峽龍井茶葉', price: 1200, unit: '斤', type: 'tea-leaves' },
  'biluochun-green-leaves': { name: '碧螺春茶葉', price: 1280, unit: '斤', type: 'tea-leaves' },
  'highmountain-oolong-leaves': { name: '阿里山高山烏龍茶葉', price: 2000, unit: '斤', type: 'tea-leaves' },
  'beauty-oolong-leaves': { name: '東方美人茶葉', price: 2400, unit: '斤', type: 'tea-leaves' },
  'tieguanyin-oolong-leaves': { name: '木柵鐵觀音茶葉', price: 1800, unit: '斤', type: 'tea-leaves' },
  'chrysanthemum-leaves': { name: '無毒契作菊花茶葉', price: 1120, unit: '斤', type: 'tea-leaves' },
  'puer-leaves': { name: '陳年普洱茶葉', price: 2200, unit: '斤', type: 'tea-leaves' },
  'dongpian-leaves': { name: '翠玉冬片茶葉', price: 1920, unit: '斤', type: 'tea-leaves' },

  // Gift Boxes
  'gift-royal': { name: '經典御璽茶禮盒', price: 1680, unit: '盒', type: 'gift-box' },
  'gift-premium-highland': { name: '台灣手採雙響禮盒', price: 2800, unit: '盒', type: 'gift-box' },
  'gift-biluochun': { name: '三峽翠玉碧螺春禮盒', price: 1200, unit: '盒', type: 'gift-box' },
  'gift-tieguanyin': { name: '木柵老鐵觀音珍藏禮盒', price: 1980, unit: '盒', type: 'gift-box' }
};

// Detailed tea information dataset for popups
const TEA_DETAILS = {
  'honey-black-drink': {
    tag: '現調茶飲',
    tagClass: '',
    name: '蜜香冷泡紅茶',
    price: 'NT$ 65 / 杯',
    desc: '嚴選契作蜜香紅茶，茶葉經小綠葉蟬叮咬後，自帶自然的蜂蜜甜香。我們採用低溫慢速冷萃 8 小時，將單寧酸的釋放降到最低，展現極其清甜、滑順、不加糖也芳香四溢的完美喉韻。',
    origin: '台灣花蓮舞鶴茶區',
    flavor: '天然蜂蜜香、熟果蜜味、溫潤清甜',
    brewing: '低溫 4°C 冷萃 8 小時，建議冰飲，開封後請儘速飲用完畢。',
    img: 'images/menu-tea.png'
  },
  'ruby-red-drink': {
    tag: '現調茶飲',
    tagClass: '',
    name: '日月潭紅玉現泡茶',
    price: 'NT$ 80 / 杯',
    desc: '享譽國際的台茶 18 號「紅玉」，是台灣紅茶的頂級代表。茶湯色澤艷紅明亮，香氣中帶有天然的肉桂香與清涼的薄荷尾韻，層次極其豐富，口感醇厚有勁。',
    origin: '台灣南投日月潭茶區',
    flavor: '天然肉桂香、薄荷涼感、醇厚麥芽韻',
    brewing: '使用 95°C 熱水現泡悶蒸，建議熱飲品茗，亦可加冰急速冰鎮鎖香。',
    img: 'images/menu-tea.png'
  },
  'longjing-green-drink': {
    tag: '現調茶飲',
    tagClass: '',
    name: '三峽龍井冷萃綠茶',
    price: 'NT$ 70 / 杯',
    desc: '精選三峽手採龍井，採摘青心柑仔茶樹嫩芽，外形扁平挺秀。茶香清雅，帶有淡淡的炒豆香與新鮮草本氣息，口感清爽回甘，富含天然茶多酚與兒茶素，去油解膩。',
    origin: '台灣新北市三峽茶區',
    flavor: '烘炒豆香、清新草本香、爽口回甘',
    brewing: '低溫冷淬，完美釋放茶胺酸，建議冷飲開封即飲，冰鎮風味尤佳。',
    img: 'images/menu-tea.png'
  },
  'biluochun-green-drink': {
    tag: '現調茶飲',
    tagClass: '',
    name: '碧螺春現泡綠茶',
    price: 'NT$ 75 / 杯',
    desc: '手採清明前幼嫩芽葉，外觀微捲白毫顯露，宛如碧螺。茶湯碧綠清澈，散發清新芬芳的花香，口感鮮靈活潑，入口甘甜，是極具春天氣息的綠茶。',
    origin: '台灣新北市三峽茶區',
    flavor: '清雅花香、鮮甜果香、甘涼爽口',
    brewing: '使用 80°C 水溫手作沖泡，避免高溫破壞兒茶素與嫩葉細緻口感。',
    img: 'images/menu-tea.png'
  },
  'highmountain-oolong-drink': {
    tag: '現調茶飲',
    tagClass: '',
    name: '阿里山高山烏龍',
    price: 'NT$ 90 / 杯',
    desc: '來自阿里山高海拔茶區，長年雲霧繚繞，晝夜溫差大。茶湯富含果膠質，口感滑潤飽滿，獨特的「高山冷霜蘭花香」持久悠長，回甘極佳，茶氣厚重。',
    origin: '台灣嘉義阿里山茶區',
    flavor: '蘭花冷霜香、果膠滑順感、醇厚回甘',
    brewing: '以功夫茶具、92°C 水溫沖泡，第一泡溫潤，第二至四泡茶香最盛。',
    img: 'images/menu-tea.png'
  },
  'beauty-oolong-drink': {
    tag: '現調茶飲',
    tagClass: '',
    name: '東方美人香茗',
    price: 'NT$ 120 / 杯',
    desc: '又名白毫烏龍，經小綠葉蟬叮咬後產生複雜化學變化。茶湯呈金黃琥珀色，具強烈且無法被人工複製的蜂蜜甜香與成熟果香，滋味圓柔，是茶中之極品。',
    origin: '台灣新竹峨眉、北埔茶區',
    flavor: '天然蜂蜜香、熟蜜果香、甜柔喉韻',
    brewing: '使用 85°C 稍低水溫沖泡，慢速釋放蜜糖般甜美，忌用滾水以免苦澀。',
    img: 'images/menu-tea.png'
  },
  'tieguanyin-oolong-drink': {
    tag: '現調茶飲',
    tagClass: '',
    name: '木柵鐵觀音',
    price: 'NT$ 85 / 杯',
    desc: '遵循正統鐵觀音重火炭焙工藝，經反覆包揉與炭火烘焙。茶湯紅亮帶金黃，具獨特的木質火香味與天然弱酸性喉韻，生津止渴，沉穩內斂。',
    origin: '台灣台北市木柵茶區',
    flavor: '濃郁熟火香、熟果微酸、木質炭香',
    brewing: '95°C 高溫沖泡，宜快沖快出，高溫能激發炭火醇厚的老茶香。',
    img: 'images/menu-tea.png'
  },
  'chrysanthemum-drink': {
    tag: '現調茶飲',
    tagClass: '',
    name: '無毒契作菊花茶',
    price: 'NT$ 60 / 杯',
    desc: '與苗栗銅鑼在地茶農契作，無化學農藥與二氧化硫漂白。金黃杭菊在杯中緩緩綻放，清香芬芳，天然甘甜，具有極佳的舒緩與明目、降火氣功效。',
    origin: '台灣苗栗銅鑼鄉',
    flavor: '清雅杭菊香、微甜回甘、舒緩芬芳',
    brewing: '使用 90°C 熱水直接沖泡，悶泡 3 分鐘即可，冷飲冰鎮亦佳。',
    img: 'images/menu-tea.png'
  },
  'puer-drink': {
    tag: '現調茶飲',
    tagClass: '',
    name: '陳年普洱熟茶',
    price: 'NT$ 95 / 杯',
    desc: '優選陳年雲南熟普洱，茶性溫和，不傷胃。茶湯深紅如紅寶石，口感極度順滑，帶有沉穩厚重的古木陳香，入口即化，越陳越甘醇。',
    origin: '中國雲南省西雙版納',
    flavor: '古木陳香、滑順口感、溫潤喉韻',
    brewing: '使用 100°C 沸水沖泡，第一泡洗茶，第二泡起細細品嚐溫潤口感。',
    img: 'images/menu-tea.png'
  },
  'dongpian-drink': {
    tag: '現調茶飲',
    tagClass: '',
    name: '翠玉冬片茶',
    price: 'NT$ 100 / 杯',
    desc: '冬至前後暖冬氣候中，茶樹反常萌發的嫩芽。因氣候寒冷生長極慢，產量珍稀。茶湯帶特有冷霜氣與清淡花香，甘甜爽口無一絲苦澀感，為老饕摯愛。',
    origin: '台灣南投竹山茶區',
    flavor: '冷霜氣息、清雅花香、純淨清甜',
    brewing: '使用 90°C 熱水沖泡，悶蒸時間稍長，或作為高階冷泡茶冷萃。',
    img: 'images/menu-tea.png'
  },
  'honey-black-leaves': {
    tag: '嚴選茶葉',
    tagClass: 'gift-box-tag',
    name: '蜜香紅茶茶葉',
    price: 'NT$ 350 / 包',
    desc: '契作蜜香紅茶，茶葉經小綠葉蟬叮咬後，自帶自然蜂蜜甜香。精選頂級原葉茶葉裝袋，每包 150g。保留最純粹的高山風味，極其耐泡，回甘帶有迷人熟果香與蜜香。',
    origin: '台灣花蓮舞鶴茶區',
    flavor: '天然蜂蜜香、熟果蜜味、溫潤清甜',
    brewing: '水溫 85°C-90°C，建議以陶瓷茶壺沖泡，悶蒸約 50 秒，可連續沖泡 4-6 次。',
    img: 'images/menu-tea.png'
  },
  'ruby-red-leaves': {
    tag: '嚴選茶葉',
    tagClass: 'gift-box-tag',
    name: '日月潭紅玉茶葉',
    price: 'NT$ 400 / 包',
    desc: '頂級台茶 18 號紅玉茶葉，由精選一心二葉手工採摘，茶味濃郁。每包 150g。茶湯艷紅亮麗，自帶薄荷涼感與肉桂清香，適合傳統熱泡品茗。',
    origin: '台灣南投日月潭茶區',
    flavor: '天然肉桂香、薄荷涼感、醇厚麥芽韻',
    brewing: '水溫 90°C-95°C，以紫砂壺或陶壺沖泡，悶蒸約 45 秒，可沖泡 5-6 次。',
    img: 'images/menu-tea.png'
  },
  'longjing-green-leaves': {
    tag: '嚴選茶葉',
    tagClass: 'gift-box-tag',
    name: '三峽龍井茶葉',
    price: 'NT$ 300 / 包',
    desc: '手採明前三峽龍井綠茶葉，採摘青心柑仔茶樹嫩芽，外形扁平挺秀。每包 150g。茶香清雅持久，具獨特烘炒豆香與清爽草本芬芳，消暑解膩。',
    origin: '台灣新北市三峽茶區',
    flavor: '烘炒豆香、清新草本香、爽口回甘',
    brewing: '水溫 80°C 左右沖泡，避免水溫過高破壞葉綠素，悶蒸約 40 秒，可沖泡 3-4 次。',
    img: 'images/menu-tea.png'
  },
  'biluochun-green-leaves': {
    tag: '嚴選茶葉',
    tagClass: 'gift-box-tag',
    name: '碧螺春茶葉',
    price: 'NT$ 320 / 包',
    desc: '手採明前碧螺春綠茶葉，條索緊結纖細，白毫顯露。每包 150g。具清新綠草花果芳香，滋味鮮爽甘甜，富含兒茶素。',
    origin: '台灣新北市三峽茶區',
    flavor: '清新草本香、花果芳香、鮮爽甘甜',
    brewing: '水溫 75°C-80°C 沖泡，第一泡悶蒸約 30 秒即可出湯，可沖泡 3-4 次。',
    img: 'images/menu-tea.png'
  },
  'highmountain-oolong-leaves': {
    tag: '嚴選茶葉',
    tagClass: 'gift-box-tag',
    name: '阿里山高山烏龍茶葉',
    price: 'NT$ 500 / 包',
    desc: '嚴選阿里山高海拔茶區手採烏龍茶葉，長年雲霧環繞，茶質厚實。每包 150g。獨具清雅的高山冷霜蘭花香，湯質滑潤，甘甜回味無窮。',
    origin: '台灣嘉義阿里山茶區',
    flavor: '蘭花冷霜香、果膠滑順感、醇厚回甘',
    brewing: '水溫 92°C-95°C，適合功夫茶具傳統沖泡，悶蒸約 50 秒，可連續沖泡 6 次以上。',
    img: 'images/menu-tea.png'
  },
  'beauty-oolong-leaves': {
    tag: '嚴選茶葉',
    tagClass: 'gift-box-tag',
    name: '東方美人茶葉',
    price: 'NT$ 600 / 包',
    desc: '又稱白毫烏龍，受小綠葉蟬叮咬，茶湯呈現漂亮的琥珀金黃色。每包 150g。富含渾然天成的蜂蜜甜香與熟果香，滋味圓潤蜜甜，是台灣名茶中的極品。',
    origin: '台灣新竹峨眉、北埔茶區',
    flavor: '天然蜂蜜香、熟蜜果香、甜柔喉韻',
    brewing: '水溫 80°C-85°C 沖泡，第一泡悶蒸約 40 秒，避免滾水破壞細緻蜜香，可沖泡 5 次。',
    img: 'images/menu-tea.png'
  },
  'tieguanyin-oolong-leaves': {
    tag: '嚴選茶葉',
    tagClass: 'gift-box-tag',
    name: '木柵鐵觀音茶葉',
    price: 'NT$ 450 / 包',
    desc: '正宗木柵鐵觀音茶葉，由茶師依古法手工炭焙，焦糖火香持久。每包 150g。茶湯呈亮琥珀色，口感滑軟醇厚，帶有獨特弱果酸微韻與鐵觀音喉韻。',
    origin: '台灣台北木柵茶區',
    flavor: '炭焙熟火香、焦糖香、獨特弱果酸韻',
    brewing: '沸水（95°C-100°C）沖泡，紫砂壺最佳，悶蒸約 50 秒，可沖泡 6-8 次。',
    img: 'images/menu-tea.png'
  },
  'chrysanthemum-leaves': {
    tag: '嚴選茶葉',
    tagClass: 'gift-box-tag',
    name: '無毒契作菊花茶葉',
    price: 'NT$ 280 / 包',
    desc: '與苗栗銅鑼在地茶農契作無毒杭菊，整朵完整乾燥菊花，無農藥殘留。每包 100g。沖泡後花朵在茶湯中綻放，茶湯金黃芬芳，降火氣明目。',
    origin: '台灣苗栗銅鑼',
    flavor: '杭菊清香、天然甘甜、舒緩明目',
    brewing: '水溫 90°C 熱水直接沖泡，建議配合玻璃茶壺靜置悶蒸 3-5 分鐘即可飲用。',
    img: 'images/menu-tea.png'
  },
  'puer-leaves': {
    tag: '嚴選茶葉',
    tagClass: 'gift-box-tag',
    name: '陳年普洱茶葉',
    price: 'NT$ 550 / 包',
    desc: '特選雲南大葉種陳年熟普洱茶葉（散茶），經多年陳化，茶性極度溫潤。每包 150g。茶湯深紅似寶石，口感極度順滑醇厚，具悠長古木陳香，養胃生津。',
    origin: '中國雲南省西雙版納',
    flavor: '古木陳香、滑順口感、溫潤喉韻',
    brewing: '沸水（100°C）沖泡，第一泡洗茶，第二泡悶蒸約 40 秒即可，可沖泡 6 次以上。',
    img: 'images/menu-tea.png'
  },
  'dongpian-leaves': {
    tag: '嚴選茶葉',
    tagClass: 'gift-box-tag',
    name: '翠玉冬片茶葉',
    price: 'NT$ 480 / 包',
    desc: '冬至前後採摘之冬片翠玉茶葉，富含冷霜味與純淨甜感，回甘甘潤，每包 150g。',
    origin: '台灣南投竹山茶區',
    flavor: '冷霜氣息、清雅花香、純淨清甜',
    brewing: '水溫 90°C 熱水沖泡，第一泡悶蒸約 45 秒即可，亦非常適合作為冷泡茶冷萃。',
    img: 'images/menu-tea.png'
  },
  'gift-royal': {
    tag: '精品禮盒',
    tagClass: 'gift',
    name: '經典御璽茶禮盒',
    price: 'NT$ 1,680 / 盒',
    desc: '平方茶莊的旗艦首選禮盒。精選自產自銷的「蜜香紅茶（150g）」與「阿里山高山烏龍（150g）」雙拼裝，紅色大氣禮盒包裝，附專屬提袋，是年節與重要商務送禮的不二之選。',
    origin: '花蓮舞鶴茶區 / 嘉義阿里山茶區',
    flavor: '蜜香紅茶的醇厚蜜香，與高山烏龍的冷霜蘭香，雙重極致享受',
    brewing: '內附精緻原葉茶葉，適合以蓋碗或茶壺傳統沖泡，內含茶品沖泡指南手冊。',
    img: 'images/menu-tea.png'
  },
  'gift-premium-highland': {
    tag: '精品禮盒',
    tagClass: 'gift',
    name: '台灣手採雙響禮盒',
    price: 'NT$ 2,800 / 盒',
    desc: '專為茶道老饕打造的至尊禮盒。內含特級手採「阿里山高山茶（150g）」與精選「東方美人茶（150g）」，包裝採用金底深綠壓紋的皇家風範設計，極具尊榮感。',
    origin: '新竹峨眉茶區 / 嘉義阿里山茶區',
    flavor: '極品高山茶的厚重山頭氣，搭配東方美人華麗的熟果蜜糖香',
    brewing: '極品茶葉，沖泡水溫因茶而異（美人茶85°C，高山茶92°C），隨盒附帶精細溫度指南。',
    img: 'images/menu-tea.png'
  },
  'gift-biluochun': {
    tag: '精品禮盒',
    tagClass: 'gift',
    name: '三峽翠玉碧螺春禮盒',
    price: 'NT$ 1,200 / 盒',
    desc: '雅致簡約的綠茶禮盒。內含手採明前「碧螺春茶葉（150g）」，外包裝以淡綠色紙雕工藝設計，風格清新脫俗，散發自然氣息，非常適合送給長輩或崇尚健康生活的友人。',
    origin: '台灣新北市三峽茶區',
    flavor: '清雅豆香、春天鮮嫩草本香氣，滋味鮮靈',
    brewing: '碧螺春綠茶宜低溫沖泡（80°C），禮盒附有精美沙漏計時器，協助掌握最佳沖泡時間。',
    img: 'images/menu-tea.png'
  },
  'gift-tieguanyin': {
    tag: '精品禮盒',
    tagClass: 'gift',
    name: '木柵老鐵觀音珍藏禮盒',
    price: 'NT$ 1,980 / 盒',
    desc: '傳統復古鐵盒珍藏包裝。內含資深茶師手工炭焙的珍貴「木柵老鐵觀音茶葉（150g x 2罐）」，茶香沉穩，焦糖火香與果酸氣息濃重，適合懂茶的老饕慢慢珍藏細品。',
    origin: '台灣台北市木柵茶區',
    flavor: '老茶獨特的焦糖陳火香、醇厚濃滑口感，回甘極強且帶微果酸',
    brewing: '使用 95°C-100°C 沸水溫潤泡，宜用紫砂壺或厚瓷杯沖泡，越泡越香。',
    img: 'images/menu-tea.png'
  }
};

// 7.1 Tea details popup modal initializer
function initTeaDetails() {
  const modalOverlay = document.getElementById('teaDetailModal');
  const modalClose = document.getElementById('teaDetailClose');
  const menuCards = document.querySelectorAll('.menu-card');

  if (!modalOverlay) return;

  // Open Modal on Card Click
  menuCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Only trigger details modal if clicking the photo (img box)
      if (!e.target.closest('.menu-card-img-box')) return;
      
      const teaId = card.getAttribute('data-id');
      const details = TEA_DETAILS[teaId];
      if (!details) return;

      // Populate Modal Fields
      const tagEl = document.getElementById('teaDetailTag');
      tagEl.className = 'tea-detail-tag ' + (details.tagClass || '');
      tagEl.innerText = details.tag;

      document.getElementById('teaDetailTitle').innerText = details.name;
      document.getElementById('teaDetailPrice').innerText = details.price;
      document.getElementById('teaDetailDesc').innerText = details.desc;
      document.getElementById('teaDetailOrigin').innerText = details.origin;
      document.getElementById('teaDetailFlavor').innerText = details.flavor;
      document.getElementById('teaDetailBrewing').innerText = details.brewing;
      document.getElementById('teaDetailImg').src = details.img;
      document.getElementById('teaDetailImg').alt = details.name;

      // Show Modal
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent scroll
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

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });
}

function initOrderForm() {
  const itemsContainer = document.getElementById('orderItemsContainer');
  const btnAddItem = document.getElementById('btnAddItem');
  const summaryList = document.getElementById('summaryList');
  const totalPriceElement = document.getElementById('totalPrice');
  const totalCattiesElement = document.getElementById('totalCatties'); // Now represents total items count
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
    let optionsHtml = '<option value="" disabled selected>請選擇商品</option>';
    for (const [key, item] of Object.entries(TEA_PRICES)) {
      if (item.type === 'tea-leaves' || item.type === 'gift-box') {
        optionsHtml += `<option value="${key}">${item.name} ($${item.price}/${item.unit})</option>`;
      }
    }

    row.innerHTML = `
      <select class="form-control select-tea" required>
        ${optionsHtml}
      </select>
      <input type="number" class="form-control input-qty" min="1" value="1" placeholder="數量" required>
      <span class="row-unit" style="align-self: center; min-width: 24px; font-weight: 600; color: var(--primary-color); padding-left: 8px;">-</span>
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
    const unitSpan = row.querySelector('.row-unit');

    select.addEventListener('change', () => {
      const teaKey = select.value;
      if (teaKey && TEA_PRICES[teaKey]) {
        unitSpan.innerText = TEA_PRICES[teaKey].unit;
      }
      updateRowSubtotal(row);
      calculateOrder();
    });

    qtyInput.addEventListener('input', () => {
      updateRowSubtotal(row);
      calculateOrder();
    });

    btnRemove.addEventListener('click', () => {
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
    
    let totalQty = 0;
    let totalPrice = 0;
    let totalLeaves = 0;
    let totalBoxes = 0;
    
    rows.forEach(row => {
      const select = row.querySelector('.select-tea');
      const qtyInput = row.querySelector('.input-qty');
      
      const teaKey = select.value;
      const qty = parseInt(qtyInput.value) || 0;
      
      if (teaKey && TEA_PRICES[teaKey]) {
        const item = TEA_PRICES[teaKey];
        const subtotal = item.price * qty;
        
        totalQty += qty;
        totalPrice += subtotal;
        
        if (item.type === 'tea-leaves') {
          totalLeaves += qty;
        } else if (item.type === 'gift-box') {
          totalBoxes += qty;
        }
        
        // Add to summary UI
        const li = document.createElement('li');
        li.classList.add('summary-item');
        li.innerHTML = `
          <span>${item.name} x ${qty} ${item.unit}</span>
          <span>$${subtotal.toLocaleString()}</span>
        `;
        summaryList.appendChild(li);
      }
    });
    
    // Display total
    totalPriceElement.innerText = `NT$ ${totalPrice.toLocaleString()}`;
    totalCattiesElement.innerText = `${totalQty} 件`;
    
    // 大宗訂單警告 (20斤茶葉或10盒禮盒以上)
    if (totalLeaves >= 20 || totalBoxes >= 10) {
      const alertHtml = `<strong>⚠️ 大宗訂單提醒：</strong><br>
        您的單筆訂單已達 <strong>${totalLeaves >= 20 ? totalLeaves + ' 斤茶葉' : ''}${totalLeaves >= 20 && totalBoxes >= 10 ? ' 與 ' : ''}${totalBoxes >= 10 ? totalBoxes + ' 盒禮盒' : ''}（含）以上</strong>，屬於大宗訂購。<br>
        茶葉大宗備貨需提前 3 天，禮盒備貨需提前 7 天，送出訂單後平方茶莊將由專人聯繫您確認細節！`;
      orderAlert.innerHTML = alertHtml;
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
      let totalQty = 0;
      let totalPrice = 0;
      let totalLeaves = 0;
      let totalBoxes = 0;
      
      rows.forEach(row => {
        const select = row.querySelector('.select-tea');
        const qtyInput = row.querySelector('.input-qty');
        
        const teaKey = select.value;
        const qty = parseInt(qtyInput.value) || 0;
        
        if (teaKey && TEA_PRICES[teaKey]) {
          hasTea = true;
          const item = TEA_PRICES[teaKey];
          const subtotal = item.price * qty;
          totalQty += qty;
          totalPrice += subtotal;
          
          if (item.type === 'tea-drink') {
            totalLeaves += qty;
          } else if (item.type === 'gift-box') {
            totalBoxes += qty;
          }
          
          orderDetails.push(`${item.name} x ${qty} ${item.unit}`);
        }
      });
      
      if (!hasTea) {
        alert('請選擇至少一樣商品與填寫數量！');
        return;
      }
      
      let message = `【訂單確認通知】\n`;
      message += `訂購人: ${buyer}\n`;
      message += `聯絡電話: ${phone}\n`;
      message += `外送地址: ${address}\n`;
      message += `發票收據/統編: ${taxId}\n`;
      message += `訂購品項:\n - ${orderDetails.join('\n - ')}\n`;
      message += `總數量: ${totalQty} 件\n`;
      message += `總金額: NT$ ${totalPrice.toLocaleString()}\n\n`;
      
      if (totalLeaves >= 20 || totalBoxes >= 10) {
        message += `⚠️ 提醒您：此訂單包含大宗品項（${totalLeaves >= 20 ? totalLeaves + '斤茶葉 ' : ''}${totalBoxes >= 10 ? totalBoxes + '盒禮盒' : ''}），備貨期需 3 至 7 天，專人將於 24 小時內與您聯繫確認付款與送貨細節！`;
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

