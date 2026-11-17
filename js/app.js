/**
 * Basreng S2 - Official Landing Page JavaScript
 * Updated with 5 Variants, 3 Sizes, Real Price Calculation, and Official Socials
 */

// =============================================================================
// 1. OFFICIAL BUSINESS CONFIGURATION
// =============================================================================
const CONFIG = {
  // Nomor WhatsApp resmi Basreng S2 (083179640374 -> 6283179640374)
  whatsappNumber: "6283179640374",
  whatsappDisplay: "0831-7964-0374",
  
  // Tautan toko Shopee resmi
  shopeeUrl: "https://shopee.co.id/basrengs2",
  shopeeDisplay: "basrengs2",
  
  // Tautan toko TikTok Shop resmi
  tiktokUrl: "https://www.tiktok.com/@basrengs2",
  tiktokDisplay: "basrengs2",
  
  // Default greetings
  defaultGreeting: "Halo Basreng S2, saya tertarik dengan produk camilan basreng Anda."
};

// =============================================================================
// 2. PRICING MATRIX PER VARIANT & SIZE
// =============================================================================
const PRICING = {
  // Kelompok 1: Balado & Original
  "Balado": {
    "250gr": 24200,
    "500gr": 43400,
    "1kg": 75600
  },
  "Original": {
    "250gr": 24200,
    "500gr": 43400,
    "1kg": 75600
  },

  // Kelompok 2: Pedas Daun Jeruk & Original Daun Jeruk & Pedas Gurih
  "Pedas Daun Jeruk": {
    "250gr": 25200,
    "500gr": 44800,
    "1kg": 77000
  },
  "Original Daun Jeruk": {
    "250gr": 25200,
    "500gr": 44800,
    "1kg": 77000
  },
  "Pedas Gurih": {
    "250gr": 25200,
    "500gr": 44800,
    "1kg": 77000
  }
};

// Helper: Format number to IDR string
function formatRupiah(amount) {
  if (typeof amount !== "number" || isNaN(amount)) return "Rp 0";
  return "Rp " + amount.toLocaleString("id-ID");
}

// =============================================================================
// 3. DOM CONTENT LOADED EVENT
// =============================================================================
document.addEventListener("DOMContentLoaded", () => {
  initStickyNavbar();
  initMobileMenu();
  initSmoothScrollAndActiveNav();
  initQuantityStepper();
  initOrderForm();
  initKatalogButtons();
  initContactButtons();
  initFloatingWhatsApp();
  initScrollAnimations();
});

// =============================================================================
// 4. STICKY NAVBAR HANDLER (Optimized with requestAnimationFrame - Zero Reflow)
// =============================================================================
function initStickyNavbar() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  let ticking = false;
  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 30) {
          header.classList.add("scrolled");
        } else {
          header.classList.remove("scrolled");
        }
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
}

// =============================================================================
// 5. MOBILE NAVIGATION TOGGLE
// =============================================================================
function initMobileMenu() {
  const mobileToggle = document.querySelector(".mobile-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  if (!mobileToggle || !navMenu) return;

  mobileToggle.addEventListener("click", () => {
    const isActive = navMenu.classList.toggle("active");
    mobileToggle.classList.toggle("active");
    mobileToggle.setAttribute("aria-expanded", isActive ? "true" : "false");
  });

  // Close menu on link click
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      mobileToggle.classList.remove("active");
      mobileToggle.setAttribute("aria-expanded", "false");
    });
  });

  // Close menu when clicked outside
  document.addEventListener("click", (e) => {
    if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains("active")) {
      navMenu.classList.remove("active");
      mobileToggle.classList.remove("active");
      mobileToggle.setAttribute("aria-expanded", "false");
    }
  });
}

// =============================================================================
// 6. ACTIVE SECTION HIGHLIGHT (IntersectionObserver - Zero Forced Reflow)
// =============================================================================
function initSmoothScrollAndActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  if (!sections.length || !navLinks.length) return;

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute("id");
          navLinks.forEach(link => {
            if (link.getAttribute("href") === `#${currentId}`) {
              link.classList.add("active");
            } else {
              link.classList.remove("active");
            }
          });
        }
      });
    }, {
      rootMargin: "-25% 0px -65% 0px",
      threshold: 0
    });

    sections.forEach(section => sectionObserver.observe(section));
  }
}

// =============================================================================
// 7. QUANTITY STEPPER (+ / -)
// =============================================================================
function initQuantityStepper() {
  const qtyInput = document.getElementById("order_quantity");
  const btnMinus = document.getElementById("btn-qty-minus");
  const btnPlus = document.getElementById("btn-qty-plus");

  if (!qtyInput || !btnMinus || !btnPlus) return;

  btnMinus.addEventListener("click", () => {
    let currentVal = parseInt(qtyInput.value, 10) || 1;
    if (currentVal > 1) {
      qtyInput.value = currentVal - 1;
      qtyInput.dispatchEvent(new Event("input"));
    }
  });

  btnPlus.addEventListener("click", () => {
    let currentVal = parseInt(qtyInput.value, 10) || 1;
    qtyInput.value = currentVal + 1;
    qtyInput.dispatchEvent(new Event("input"));
  });

  qtyInput.addEventListener("change", () => {
    let val = parseInt(qtyInput.value, 10);
    if (isNaN(val) || val < 1) {
      qtyInput.value = 1;
    }
  });
}

// =============================================================================
// 8. ORDER FORM & REAL-TIME PRICE CALCULATION
// =============================================================================
function initOrderForm() {
  const form = document.getElementById("order-form");
  if (!form) return;

  const nameInput = document.getElementById("buyer_name");
  const phoneInput = document.getElementById("buyer_phone");
  const variantSelect = document.getElementById("product_variant");
  const sizeSelect = document.getElementById("product_size");
  const qtyInput = document.getElementById("order_quantity");
  const notesInput = document.getElementById("order_notes");
  const methodRadios = document.querySelectorAll('input[name="order_method"]');
  const submitBtn = document.getElementById("order-submit-btn");

  // Summary preview elements
  const summaryVariant = document.getElementById("summary-variant");
  const summarySize = document.getElementById("summary-size");
  const summaryUnitPrice = document.getElementById("summary-unit-price");
  const summaryQty = document.getElementById("summary-qty");
  const summaryMethod = document.getElementById("summary-method");
  const summaryTotalPrice = document.getElementById("summary-total-price");

  // Update summary preview and calculate real prices dynamically
  function updateOrderSummary() {
    const selectedVariant = variantSelect.value;
    const selectedSize = sizeSelect ? sizeSelect.value : "250gr";
    const qty = parseInt(qtyInput.value, 10) || 1;
    let selectedMethod = "WhatsApp";
    
    methodRadios.forEach(r => {
      if (r.checked) {
        selectedMethod = r.value;
      }
    });

    // Check pricing
    let unitPrice = 0;
    if (selectedVariant && PRICING[selectedVariant] && PRICING[selectedVariant][selectedSize]) {
      unitPrice = PRICING[selectedVariant][selectedSize];
    }
    const totalPrice = unitPrice * qty;

    if (summaryVariant) {
      summaryVariant.textContent = selectedVariant ? `Basreng ${selectedVariant}` : "Belum dipilih";
    }
    if (summarySize) {
      summarySize.textContent = selectedSize;
    }
    if (summaryUnitPrice) {
      summaryUnitPrice.textContent = unitPrice > 0 ? formatRupiah(unitPrice) : "-";
    }
    if (summaryQty) {
      summaryQty.textContent = `${qty} Bungkus`;
    }
    if (summaryMethod) {
      summaryMethod.textContent = selectedMethod;
    }
    if (summaryTotalPrice) {
      summaryTotalPrice.textContent = totalPrice > 0 ? formatRupiah(totalPrice) : "-";
    }

    // Update submit button text based on method
    if (submitBtn) {
      if (selectedMethod === "WhatsApp") {
        submitBtn.innerHTML = `<span>Kirim Pesanan via WhatsApp</span> <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;
      } else if (selectedMethod === "Shopee") {
        submitBtn.innerHTML = `<span>Lanjutkan ke Shopee</span> <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;
      } else if (selectedMethod === "TikTok Shop") {
        submitBtn.innerHTML = `<span>Lanjutkan ke TikTok Shop</span> <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;
      }
    }
  }

  // Listen for changes
  variantSelect.addEventListener("change", () => {
    clearFieldError("product_variant");
    updateOrderSummary();
  });

  if (sizeSelect) {
    sizeSelect.addEventListener("change", () => {
      clearFieldError("product_size");
      updateOrderSummary();
    });
  }

  qtyInput.addEventListener("input", updateOrderSummary);
  nameInput.addEventListener("input", () => clearFieldError("buyer_name"));
  phoneInput.addEventListener("input", () => clearFieldError("buyer_phone"));

  methodRadios.forEach(radio => {
    radio.addEventListener("change", updateOrderSummary);
  });

  // Initial update
  updateOrderSummary();

  // Form submission handler
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Validation
    let isValid = true;

    const name = nameInput.value.trim();
    if (!name) {
      showFieldError("buyer_name", "Silakan masukkan nama lengkap Anda.");
      isValid = false;
    } else {
      clearFieldError("buyer_name");
    }

    const phone = phoneInput.value.trim();
    const phoneDigits = phone.replace(/[^0-9]/g, "");
    if (!phone) {
      showFieldError("buyer_phone", "Silakan masukkan nomor WhatsApp Anda.");
      isValid = false;
    } else if (phoneDigits.length < 8) {
      showFieldError("buyer_phone", "Nomor WhatsApp minimal 8 digit angka.");
      isValid = false;
    } else {
      clearFieldError("buyer_phone");
    }

    const variant = variantSelect.value;
    if (!variant) {
      showFieldError("product_variant", "Silakan pilih salah satu varian rasa Basreng S2.");
      isValid = false;
    } else {
      clearFieldError("product_variant");
    }

    const size = sizeSelect ? sizeSelect.value : "250gr";
    if (!size) {
      showFieldError("product_size", "Silakan pilih ukuran kemasan.");
      isValid = false;
    } else {
      clearFieldError("product_size");
    }

    const qty = parseInt(qtyInput.value, 10);
    if (isNaN(qty) || qty < 1) {
      showFieldError("order_quantity", "Jumlah pesanan minimal 1 bungkus.");
      isValid = false;
    } else {
      clearFieldError("order_quantity");
    }

    if (!isValid) {
      const firstError = form.querySelector(".has-error");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    // Pricing calculation
    let unitPrice = 0;
    if (PRICING[variant] && PRICING[variant][size]) {
      unitPrice = PRICING[variant][size];
    }
    const totalPrice = unitPrice * qty;

    const notes = notesInput.value.trim() || "-";
    let chosenMethod = "WhatsApp";
    methodRadios.forEach(r => {
      if (r.checked) chosenMethod = r.value;
    });

    handleOrderSubmission({
      name,
      phone,
      variant,
      size,
      unitPrice,
      totalPrice,
      qty,
      notes,
      method: chosenMethod
    });
  });
}

// Helper to show/clear inline form errors
function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  const parent = field.closest(".form-group");
  if (!parent) return;

  parent.classList.add("has-error");
  let errorEl = parent.querySelector(".form-error-msg");
  if (errorEl) {
    errorEl.textContent = message;
  }
}

function clearFieldError(fieldId) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  const parent = field.closest(".form-group");
  if (!parent) return;

  parent.classList.remove("has-error");
}

// =============================================================================
// 9. ORDER SUBMISSION PROCESSING (WhatsApp, Shopee & TikTok)
// =============================================================================
function handleOrderSubmission(orderData) {
  const messageText = 
`Halo Basreng S2, saya ingin memesan camilan:
- Nama Pembeli: ${orderData.name}
- No. WhatsApp: ${orderData.phone}
- Varian: Basreng ${orderData.variant}
- Ukuran Kemasan: ${orderData.size}
- Harga Satuan: ${formatRupiah(orderData.unitPrice)}
- Jumlah: ${orderData.qty} bungkus
- Total Pembayaran: ${formatRupiah(orderData.totalPrice)}
- Catatan: ${orderData.notes}
- Metode Pemesanan: ${orderData.method}

Mohon konfirmasi dan segera diproses. Terima kasih!`;

  if (orderData.method === "WhatsApp") {
    processWhatsAppOrder(messageText);
  } else if (orderData.method === "Shopee") {
    processMarketplaceOrder("Shopee", CONFIG.shopeeUrl, messageText);
  } else if (orderData.method === "TikTok Shop") {
    processMarketplaceOrder("TikTok Shop", CONFIG.tiktokUrl, messageText);
  }
}

// Process WhatsApp Order
function processWhatsAppOrder(messageText) {
  const encodedText = encodeURIComponent(messageText);
  const cleanNumber = CONFIG.whatsappNumber.replace(/[^0-9]/g, "");
  const waUrl = `https://wa.me/${cleanNumber}?text=${encodedText}`;

  // Open WhatsApp directly
  window.open(waUrl, "_blank");

  // Show friendly confirmation modal
  showModal({
    icon: "📱",
    iconClass: "whatsapp",
    title: "Pesanan Telah Diteruskan ke WhatsApp!",
    description: "Kami telah membuka aplikasi WhatsApp dengan pesan pesanan otomatis. Jika WhatsApp belum terbuka secara otomatis, Anda dapat menyalin draf pesanan atau klik tombol di bawah ini:",
    draft: messageText,
    primaryBtnText: "Buka WhatsApp Kembali",
    primaryBtnAction: () => {
      window.open(waUrl, "_blank");
    },
    secondaryBtnText: "Salin Draf Pesanan",
    secondaryBtnAction: () => {
      copyToClipboard(messageText);
    }
  });
}

// Process Shopee & TikTok Shop Orders
function processMarketplaceOrder(channelName, targetUrl, messageText) {
  const url = (targetUrl || "").trim();

  // If valid link is available, open directly and show confirmation
  if (url && url.startsWith("http")) {
    window.open(url, "_blank");

    showModal({
      icon: channelName === "Shopee" ? "🛍️" : "🎵",
      iconClass: "info",
      title: `Menuju Toko Resmi ${channelName}`,
      description: `Halaman ${channelName} resmi Basreng S2 telah dibuka di tab baru. Anda juga dapat melanjutkan pemesanan langsung via WhatsApp agar pesanan diproses lebih cepat oleh admin kami.`,
      primaryBtnText: `Buka ${channelName} Kembali`,
      primaryBtnAction: () => {
        window.open(url, "_blank");
      },
      secondaryBtnText: "Atau Pesan via WhatsApp",
      secondaryBtnAction: () => {
        closeModal();
        processWhatsAppOrder(messageText);
      }
    });
  } else {
    // Fallback if link not configured
    showModal({
      icon: "ℹ️",
      iconClass: "info",
      title: `Tautan ${channelName} Belum Tersedia`,
      description: `Toko resmi ${channelName} Basreng S2 sedang dalam pembaruan. Silakan lakukan pemesanan melalui WhatsApp kami.`,
      primaryBtnText: "Pesan via WhatsApp Sekarang",
      primaryBtnAction: () => {
        closeModal();
        processWhatsAppOrder(messageText);
      },
      secondaryBtnText: "Tutup",
      secondaryBtnAction: () => {
        closeModal();
      }
    });
  }
}

// =============================================================================
// 10. KATALOG PRODUCTS BUTTON ACTION
// =============================================================================
function initKatalogButtons() {
  const katalogOrderButtons = document.querySelectorAll(".btn-order-variant");

  katalogOrderButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const variantName = button.getAttribute("data-variant");
      const sizeName = button.getAttribute("data-size") || "250gr";
      selectVariantInForm(variantName, sizeName);
    });
  });
}

// Function to select variant and size, then smoothly scroll to form
function selectVariantInForm(variantName, sizeName = "250gr") {
  const variantSelect = document.getElementById("product_variant");
  const sizeSelect = document.getElementById("product_size");
  const orderSection = document.getElementById("order");

  if (variantSelect && variantName) {
    variantSelect.value = variantName;
    variantSelect.dispatchEvent(new Event("change"));
    clearFieldError("product_variant");
  }

  if (sizeSelect && sizeName) {
    sizeSelect.value = sizeName;
    sizeSelect.dispatchEvent(new Event("change"));
  }

  if (orderSection) {
    orderSection.scrollIntoView({ behavior: "smooth" });
    
    // Subtle pulse effect on form wrapper
    const wrapper = document.querySelector(".order-wrapper");
    if (wrapper) {
      wrapper.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";
      wrapper.style.transform = "scale(1.02)";
      wrapper.style.boxShadow = "0 0 0 4px rgba(201, 42, 42, 0.3), var(--shadow-lg)";
      setTimeout(() => {
        wrapper.style.transform = "scale(1)";
        wrapper.style.boxShadow = "var(--shadow-lg)";
      }, 700);
    }
  }
}

// Expose globally
window.selectVariantInForm = selectVariantInForm;

// =============================================================================
// 11. CONTACT SECTION BUTTONS
// =============================================================================
function initContactButtons() {
  const contactWaBtn = document.getElementById("btn-contact-wa");
  const contactShopeeBtn = document.getElementById("btn-contact-shopee");
  const contactTiktokBtn = document.getElementById("btn-contact-tiktok");

  if (contactWaBtn) {
    contactWaBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const cleanNumber = CONFIG.whatsappNumber.replace(/[^0-9]/g, "");
      const text = encodeURIComponent(CONFIG.defaultGreeting);
      window.open(`https://wa.me/${cleanNumber}?text=${text}`, "_blank");
    });
  }

  if (contactShopeeBtn) {
    contactShopeeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.open(CONFIG.shopeeUrl, "_blank");
    });
  }

  if (contactTiktokBtn) {
    contactTiktokBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.open(CONFIG.tiktokUrl, "_blank");
    });
  }
}

// =============================================================================
// 12. FLOATING WHATSAPP BUTTON
// =============================================================================
function initFloatingWhatsApp() {
  const floatBtn = document.getElementById("floating-wa-btn");
  if (!floatBtn) return;

  floatBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const cleanNumber = CONFIG.whatsappNumber.replace(/[^0-9]/g, "");
    const text = encodeURIComponent("Halo Basreng S2, saya ingin bertanya dan memesan camilan Basreng S2.");
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, "_blank");
  });
}

// =============================================================================
// 13. REUSABLE MODAL DIALOG
// =============================================================================
function showModal({
  icon = "ℹ️",
  iconClass = "info",
  title = "Informasi",
  description = "",
  draft = null,
  primaryBtnText = "OK",
  primaryBtnAction = null,
  secondaryBtnText = null,
  secondaryBtnAction = null
}) {
  let modalOverlay = document.getElementById("app-modal");
  
  if (!modalOverlay) {
    modalOverlay = document.createElement("div");
    modalOverlay.id = "app-modal";
    modalOverlay.className = "modal-overlay";
    modalOverlay.innerHTML = `
      <div class="modal-card" role="dialog" aria-modal="true">
        <button class="modal-close-btn" aria-label="Tutup Modal" id="modal-close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div class="modal-icon-badge" id="modal-icon"></div>
        <h3 class="modal-title" id="modal-title"></h3>
        <p class="modal-desc" id="modal-desc"></p>
        <div class="modal-draft-box" id="modal-draft" style="display:none;"></div>
        <div class="modal-actions" id="modal-actions"></div>
      </div>
    `;
    document.body.appendChild(modalOverlay);

    // Close event listeners
    modalOverlay.querySelector("#modal-close").addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modalOverlay.classList.contains("active")) {
        closeModal();
      }
    });
  }

  // Populate content
  const iconEl = modalOverlay.querySelector("#modal-icon");
  iconEl.textContent = icon;
  iconEl.className = `modal-icon-badge ${iconClass}`;

  modalOverlay.querySelector("#modal-title").textContent = title;
  modalOverlay.querySelector("#modal-desc").textContent = description;

  const draftEl = modalOverlay.querySelector("#modal-draft");
  if (draft) {
    draftEl.textContent = draft;
    draftEl.style.display = "block";
  } else {
    draftEl.style.display = "none";
  }

  const actionsEl = modalOverlay.querySelector("#modal-actions");
  actionsEl.innerHTML = "";

  if (primaryBtnText) {
    const pBtn = document.createElement("button");
    pBtn.className = "btn btn-primary btn-block";
    pBtn.textContent = primaryBtnText;
    pBtn.addEventListener("click", () => {
      if (primaryBtnAction) primaryBtnAction();
      else closeModal();
    });
    actionsEl.appendChild(pBtn);
  }

  if (secondaryBtnText) {
    const sBtn = document.createElement("button");
    sBtn.className = "btn btn-secondary btn-block";
    sBtn.textContent = secondaryBtnText;
    sBtn.addEventListener("click", () => {
      if (secondaryBtnAction) secondaryBtnAction();
      else closeModal();
    });
    actionsEl.appendChild(sBtn);
  }

  // Show
  modalOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const modalOverlay = document.getElementById("app-modal");
  if (modalOverlay) {
    modalOverlay.classList.remove("active");
  }
  document.body.style.overflow = "";
}

// Copy to clipboard with visual notice
function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      alert("✅ Draf pesanan berhasil disalin ke clipboard!");
    }).catch(() => {
      fallbackCopyText(text);
    });
  } else {
    fallbackCopyText(text);
  }
}

function fallbackCopyText(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand("copy");
    alert("✅ Draf pesanan berhasil disalin!");
  } catch (err) {
    alert("Gagal menyalin teks.");
  }
  document.body.removeChild(textArea);
}

// =============================================================================
// 14. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
// =============================================================================
function initScrollAnimations() {
  const revealElements = document.querySelectorAll(".reveal-fade-up");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px"
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add("is-revealed"));
  }
}
