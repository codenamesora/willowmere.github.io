// Willowmere main JS - handles products, cart, carousel, testimonials, feedback
const PRODUCTS = [
  { id:1, title:'Bottle Glass Necklace', desc:'Mini bottle with dried blooms', price:65000, img:'assets/product1.jpg' },
  { id:2, title:'Ceramic Flora Mug', desc:'Handpainted mug with botanical motif', price:120000, img:'assets/product2.jpg' },
  { id:3, title:'Forest Journal', desc:'Vintage-style journal with pressed leaf', price:90000, img:'assets/product3.jpg' },
  { id:4, title:'Fairy Jar Lights', desc:'Tiny fairy lights in a mason jar', price:85000, img:'assets/product4.jpg' }
];

function formatRp(v){ return 'Rp' + v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') }

// Render products
const grid = document.getElementById('product-grid');
PRODUCTS.forEach(p=>{
  const card = document.createElement('div'); card.className='card';
  card.innerHTML = `
    <img src="${p.img}" alt="${p.title}" />
    <h4>${p.title}</h4>
    <p>${p.desc}</p>
    <div class="product-actions">
      <div class="price">${formatRp(p.price)}</div>
      <div>
        <button class="btn small" data-id="${p.id}" onclick="addToCart(${p.id})">Add</button>
        <button class="btn small" onclick="viewQuick(${p.id})">Quick</button>
      </div>
    </div>
  `;
  grid.appendChild(card);
});

// Simple quick view
function viewQuick(id){
  const p = PRODUCTS.find(x=>x.id===id);
  alert(p.title + '\n' + p.desc + '\n' + formatRp(p.price));
}

// Cart functionality
let cart = JSON.parse(localStorage.getItem('willow_cart')||'[]');
const cartCountEl = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');

function saveCart(){ localStorage.setItem('willow_cart', JSON.stringify(cart)); renderCart(); }

function addToCart(id){
  const p = PRODUCTS.find(x=>x.id===id);
  const existing = cart.find(i=>i.id===id);
  if(existing) existing.qty++;
  else cart.push({id:p.id,title:p.title,price:p.price,qty:1});
  saveCart();
  alert(p.title + ' added to cart');
}

function renderCart(){
  cartCountEl.textContent = cart.reduce((s,i)=>s+i.qty,0);
  cartItemsEl.innerHTML='';
  let total = 0;
  cart.forEach(item=>{
    total += item.price * item.qty;
    const li = document.createElement('li');
    li.textContent = `${item.title} x${item.qty} — ${formatRp(item.price * item.qty)}`;
    cartItemsEl.appendChild(li);
  });
  cartTotalEl.textContent = formatRp(total);
}
document.getElementById('open-cart').addEventListener('click', ()=>{ cartModal.classList.add('show'); cartModal.setAttribute('aria-hidden','false'); renderCart(); });
document.getElementById('close-cart').addEventListener('click', ()=>{ cartModal.classList.remove('show'); cartModal.setAttribute('aria-hidden','true'); });
document.getElementById('checkout').addEventListener('click', ()=>{ 
  if(cart.length===0){ alert('Cart kosong. Tambahkan produk dulu.'); return; }
  alert('Checkout simulated — terima kasih!\nPesananmu akan diproses oleh Sora & Co.');
  cart = []; saveCart();
});

// Carousel
let slideIndex=0;
const slides = document.getElementById('slides');
const totalSlides = slides.children.length;
function showSlide(i){
  slideIndex = (i+totalSlides)%totalSlides;
  slides.style.transform = `translateX(-${slideIndex*100}%)`;
}
document.getElementById('prev').addEventListener('click', ()=> showSlide(slideIndex-1));
document.getElementById('next').addEventListener('click', ()=> showSlide(slideIndex+1));
setInterval(()=> showSlide(slideIndex+1), 5000);

// Testimonials (persisted in localStorage)
const notesEl = document.getElementById('notes');
const submitBtn = document.getElementById('submit-testimonial');
let notes = JSON.parse(localStorage.getItem('willow_notes')||'[]');

function renderNotes(){
  notesEl.innerHTML='';
  notes.slice().reverse().forEach(n=>{
    const d = document.createElement('div'); d.className='note';
    d.innerHTML = `<strong>${escapeHtml(n.name||'Anonymous')}</strong><p>${escapeHtml(n.message)}</p>`;
    notesEl.appendChild(d);
  });
}
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m] }); }

submitBtn.addEventListener('click', ()=>{
  const name = document.getElementById('name').value.trim();
  const message = document.getElementById('message').value.trim();
  if(!message){ alert('Tolong isi pesan.'); return; }
  notes.push({name:name||'Guest',message,ts:Date.now()});
  localStorage.setItem('willow_notes', JSON.stringify(notes));
  document.getElementById('name').value=''; document.getElementById('message').value='';
  renderNotes();
});

// Feedback form
document.getElementById('feedback-form').addEventListener('submit', (e)=>{
  e.preventDefault();
  const name = document.getElementById('fb-name').value.trim();
  const msg = document.getElementById('fb-message').value.trim();
  if(!msg){ alert('Silakan tulis kritik atau saran.'); return; }
  const list = JSON.parse(localStorage.getItem('willow_feedback')||'[]');
  list.push({name:name||'Guest',msg,ts:Date.now()});
  localStorage.setItem('willow_feedback', JSON.stringify(list));
  alert('Terima kasih! Kritik & saranmu telah kami terima.');
  document.getElementById('fb-name').value=''; document.getElementById('fb-message').value='';
});

// Init
document.getElementById('year').textContent = new Date().getFullYear();
renderNotes();
renderCart();

// Utility: preload images to avoid broken link in demo
['assets/hero.jpg','assets/placeholder1.jpg','assets/placeholder2.jpg','assets/placeholder3.jpg','assets/product1.jpg','assets/product2.jpg','assets/product3.jpg','assets/product4.jpg'].forEach(src=>{ const i=new Image(); i.src=src; });
