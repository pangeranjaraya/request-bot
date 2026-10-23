import './style.css';

const app = document.querySelector('#app');
const state = { profile: null, owner: new URLSearchParams(location.search).get('owner') === '1', ownerOk: false, activeChat: '', messages: [], sending: false };
const CHAT_KEY = 'req_local_chats_v1';
const readChats = () => { try { const value = JSON.parse(localStorage.getItem(CHAT_KEY) || '{}'); return value && typeof value === 'object' ? value : {}; } catch { return {}; } };
const writeChats = value => localStorage.setItem(CHAT_KEY, JSON.stringify(value));
const getChat = id => readChats()[String(id)] || [];
const saveMessage = (id, message) => { const chats = readChats(); const key = String(id); chats[key] = [...(Array.isArray(chats[key]) ? chats[key] : []), message].slice(-500); writeChats(chats); };
const allLocalMessages = () => Object.entries(readChats()).flatMap(([id, messages]) => (Array.isArray(messages) ? messages : []).map(m => ({ ...m, telegram_id: id, display_name: m.display_name || 'Pengguna' }))).sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
const escapeHTML = (s='') => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const initials = name => (name || 'U').trim().split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase();
const avatar = (name, url) => url ? `<img src="${escapeHTML(url)}" alt="">` : `<span>${escapeHTML(initials(name))}</span>`;
const toast = msg => { const el=document.querySelector('#toast'); if(el){el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2800);} };
function shell(content) { app.innerHTML = `${content}<div id="toast" class="toast"></div>`; }
function landing() {
  shell(`<nav class="nav wrap"><a class="brand" href="#"><span class="brand-mark">R</span><span>REQ<span class="muted">BOT</span></span></a><div class="nav-links"><a href="#fitur">Fitur</a><a href="#alur">Cara kerja</a><button class="btn btn-small btn-quiet" id="navLogin">Buka Dashboard <span>↗</span></button></div><button class="menu-btn" id="menuBtn" aria-label="Buka menu">☰</button></nav>
  <main><section class="hero wrap"><div class="hero-copy"><div class="eyebrow"><span class="live-dot"></span> REQUEST CENTER · ONLINE</div><h1>Punya ide keren?<br><span class="gradient-text">Bikin jadi nyata.</span></h1><p class="hero-desc">Tempat request fitur, bot, dan ide digital. Kirim request langsung ke owner atau ngobrol lewat request Telegram dan catatan lokal—ringkas, jelas, dan tanpa ribet.</p><div class="hero-actions"><button class="btn btn-primary" id="heroStart">Mulai Sekarang <span>→</span></button><a class="btn btn-outline" href="#fitur">Jelajahi fitur</a></div><div class="trust-row"><div class="avatar-stack"><span>R</span><span>✦</span><span>⌘</span></div><span>Pusat request pribadi</span><span class="trust-sep">•</span><span>Chat lokal di browser</span></div></div>
  <div class="hero-visual"><div class="orb orb-one"></div><div class="orb orb-two"></div><div class="glass-card main-card"><div class="card-top"><div class="window-dots"><i></i><i></i><i></i></div><span class="tiny-label">REQUEST OVERVIEW</span><span class="status-pill"><i></i> Active</span></div><div class="mini-profile"><div class="profile-icon">✦</div><div><b>Request baru</b><small>Ide kamu, langkah pertama.</small></div><span class="more">•••</span></div><div class="progress-title"><span>Proses request</span><b>Live</b></div><div class="progress-track"><span></span></div><div class="chat-preview"><div class="chat-avatar">U</div><div class="chat-bubble"><small>YOU · NOW</small><p>Aku punya ide fitur baru...</p></div></div><div class="chat-preview owner-preview"><div class="chat-avatar owner-avatar">R</div><div class="chat-bubble"><small>LOCAL NOTE</small><p>Siap, ceritakan detailnya 👋</p></div></div><div class="card-foot"><span><i class="live-dot"></i> Local browser</span><span>REQ / 001</span></div></div><div class="float-chip chip-top"><span class="chip-icon">↗</span><div><b>Instan terkirim</b><small>Notifikasi Telegram</small></div></div><div class="float-chip chip-bottom"><span class="chip-icon purple">⌁</span><div><b>Local notes</b><small>Catatan di browser</small></div></div></div></section>
  <section class="metrics wrap"><div><b>01</b><span>Masuk dengan profil</span></div><div><b>02</b><span>Kirim ide atau request</span></div><div><b>03</b><span>Diskusi langsung dengan owner</span></div></section>
  <section id="fitur" class="section wrap"><div class="section-heading"><div><div class="eyebrow">DIBUAT UNTUK IDE BESAR</div><h2>Semua yang kamu butuhkan.<br><span class="muted">Dalam satu tempat.</span></h2></div><p>Alur simpel, tampilan bersih, dan fitur yang fokus pada hal penting: request kamu sampai ke tujuan.</p></div><div class="feature-grid"><article class="feature-card"><div class="feature-icon violet">↗</div><div class="feature-tag">01 / INSTANT</div><h3>Auto Request</h3><p>Kirim satu pesan request dan notifikasi langsung masuk ke Telegram owner.</p><span class="feature-link">Cepat dan praktis <b>↗</b></span></article><article class="feature-card featured"><div class="feature-icon mint">◉</div><div class="feature-tag">02 / LOCAL NOTES</div><h3>Catatan Lokal</h3><p>Catat pesan di browser ini. Pesan tidak otomatis terlihat oleh owner di perangkat lain.</p><span class="feature-link">Riwayat lokal <b>↗</b></span><div class="feature-glow"></div></article><article class="feature-card"><div class="feature-icon blue">⌘</div><div class="feature-tag">03 / PERSONAL</div><h3>Profil pengguna</h3><p>Nama, ID Telegram, dan foto profil untuk pengalaman dashboard yang personal.</p><span class="feature-link">Profil tersimpan <b>↗</b></span></article></div></section>
  <section id="alur" class="steps-section"><div class="wrap steps-inner"><div class="eyebrow">GAMPANG BANGET</div><h2>Dari ide ke percakapan.<br><span class="muted">Cuma beberapa langkah.</span></h2><div class="steps-grid"><div class="step"><span>01</span><div class="step-line"></div><h3>Lengkapi profil</h3><p>Masukkan nama dan ID Telegram agar request punya identitas.</p></div><div class="step"><span>02</span><div class="step-line"></div><h3>Pilih kebutuhan</h3><p>Kirim request otomatis atau simpan catatan lokal.</p></div><div class="step"><span>03</span><div class="step-line"></div><h3>Lanjutkan diskusi</h3><p>Periksa notifikasi Telegram dan catatan yang tersimpan di browser ini.</p></div></div><div class="bottom-cta"><div><h3>Siap kirim ide pertamamu?</h3><p>Mulai sekarang. Biar idemu nggak cuma jadi wacana.</p></div><button class="btn btn-primary" id="bottomStart">Masuk Dashboard <span>→</span></button></div></div></section></main>
  <footer class="footer wrap"><a class="brand" href="#"><span class="brand-mark">R</span><span>REQ<span class="muted">BOT</span></span></a><span>Made for ideas that move forward.</span><span>© 2026 REQ FEATURE / REQ BOT</span></footer>`);
  ['navLogin','heroStart','bottomStart'].forEach(id=>document.getElementById(id)?.addEventListener('click', onboarding));
  document.getElementById('menuBtn')?.addEventListener('click',()=>document.querySelector('.nav-links')?.classList.toggle('menu-open'));
}
function onboarding() {
  shell(`<div class="onboard-page"><button class="back-link" id="backHome">← Kembali ke landing page</button><div class="onboard-card"><div class="onboard-brand"><span class="brand-mark">R</span><span>REQ<span class="muted">BOT</span></span></div><div class="onboard-avatar">${avatar('Kamu','')}</div><div class="eyebrow center">SEBELUM KITA MULAI</div><h1>Kenalan dulu, yuk.</h1><p class="onboard-sub">Isi profil singkat untuk menyertai request yang dikirim ke Telegram owner.</p><form id="profileForm" class="form-stack"><label>Nama tampilan<input id="displayName" required maxlength="40" placeholder="Contoh: Raka Pratama" autocomplete="name"></label><label>Telegram numeric ID<input id="telegramId" required inputmode="numeric" pattern="[0-9]{5,20}" placeholder="Contoh: 123456789"><small>Buka profil Telegram atau gunakan bot ID tepercaya untuk mengetahui ID numerik. Jangan masukkan username seperti @nama.</small></label><label>URL foto profil <span class="optional">OPSIONAL</span><input id="avatarUrl" type="url" placeholder="https://.../foto.jpg"></label><button class="btn btn-primary btn-full" type="submit">Lanjut ke Dashboard <span>→</span></button></form><div class="privacy-note">▣ Data profil dipakai untuk menampilkan identitas request kamu.</div></div></div>`);
  document.getElementById('backHome').onclick=landing;
  document.getElementById('displayName').addEventListener('input',e=>{document.querySelector('.onboard-avatar').innerHTML=avatar(e.target.value,'');});
  document.getElementById('profileForm').onsubmit=async e=>{
    e.preventDefault();
    const profile={name:document.getElementById('displayName').value.trim(),telegramId:document.getElementById('telegramId').value.trim(),avatarUrl:document.getElementById('avatarUrl').value.trim()};
    if(!/^[0-9]{5,20}$/.test(profile.telegramId)) return toast('Masukkan ID Telegram numerik yang valid.');
    if(profile.avatarUrl && !/^https?:\/\//i.test(profile.avatarUrl)) return toast('URL foto harus dimulai dengan https:// atau http://');
    localStorage.setItem('req_profile',JSON.stringify(profile)); state.profile=profile; dashboard();
  };
}
function dashboard() {
  const p=state.profile;
  shell(`<div class="app-layout"><aside class="sidebar"><a class="brand" href="#" id="brandHome"><span class="brand-mark">R</span><span>REQ<span class="muted">BOT</span></span></a><div class="side-label">WORKSPACE</div><button class="side-item active" data-tab="overview"><span>▦</span> Overview</button><button class="side-item" data-tab="request"><span>↗</span> Auto Request</button><button class="side-item" data-tab="chat"><span>◉</span> Catatan Lokal <i class="side-live"></i></button><div class="side-bottom"><div class="side-help"><span>✦</span><b>Punya ide?</b><small>Kami siap mendengar.</small></div><button class="side-item" id="editProfile"><span>⚙</span> Edit Profil</button><button class="side-item" id="logout"><span>↪</span> Keluar Dashboard</button><div class="side-user">${avatar(p.name,p.avatarUrl)}<div><b>${escapeHTML(p.name)}</b><small>ID ${escapeHTML(p.telegramId)}</small></div><span class="online-indicator"></span></div></div></aside><main class="dash-main"><header class="dash-header"><div><div class="eyebrow">YOUR WORKSPACE</div><h1 id="dashTitle">Overview</h1></div><div class="header-right"><span class="system-status"><i class="live-dot"></i> Browser aktif</span><div class="header-avatar">${avatar(p.name,p.avatarUrl)}</div></div></header><div id="dashContent"></div></main></div>`);
  document.getElementById('brandHome').onclick=e=>{e.preventDefault();landing();};
  document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>showTab(b.dataset.tab));
  document.getElementById('editProfile').onclick=onboarding;
  document.getElementById('logout').onclick=()=>{localStorage.removeItem('req_profile');state.profile=null;landing();};
  showTab('overview');
}
function showTab(tab) {
  document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));
  document.getElementById('dashTitle').textContent=({overview:'Overview',request:'Auto Request',chat:'Catatan Lokal'})[tab];
  const p=state.profile, target=document.getElementById('dashContent');
  if(tab==='overview') {
    target.innerHTML=`<section class="welcome-banner"><div><div class="eyebrow">FRIDAY FEELING? MAKE IT PRODUCTIVE.</div><h2>Halo, ${escapeHTML(p.name.split(' ')[0])} <span class="wave">✦</span></h2><p>Punya ide atau butuh bantuan? Pilih cara yang paling nyaman buat kamu.</p><button class="btn btn-primary" id="quickRequest">Buat Request <span>→</span></button></div><div class="welcome-art"><div class="art-ring"></div><div class="art-center">R<span>✦</span></div><div class="art-orbit orbit-a">↗</div><div class="art-orbit orbit-b">◉</div></div></section><div class="dash-section-head"><div><h2>Akses cepat</h2><p>Semua fitur penting, satu klik dari sini.</p></div><span class="subtle-pill">YOUR TOOLS</span></div><div class="quick-grid"><button class="quick-card" data-go="request"><span class="quick-icon violet">↗</span><span class="quick-arrow">↗</span><h3>Auto Request</h3><p>Kirim satu pesan ke owner lewat Telegram secara instan.</p><b>Mulai request <span>→</span></b></button><button class="quick-card" data-go="chat"><span class="quick-icon mint">◉</span><span class="quick-arrow">↗</span><h3>Catatan Lokal</h3><p>Simpan catatan percakapan lokal di browser ini.</p><b>Buka percakapan <span>→</span></b></button><div class="profile-card"><div class="profile-card-head"><span>PROFIL KAMU</span><span>•••</span></div><div class="profile-card-user">${avatar(p.name,p.avatarUrl)}<div><b>${escapeHTML(p.name)}</b><small>Telegram ID</small><code>${escapeHTML(p.telegramId)}</code></div></div><div class="profile-card-foot"><span><i class="live-dot"></i> Profile active</span><button id="profileEditSmall">Edit →</button></div></div></div><div class="notice-row"><span class="notice-icon">✦</span><div><b>Tips kecil untuk request yang jelas</b><p>Ceritakan tujuan, fitur yang dibutuhkan, dan contoh hasil yang kamu inginkan.</p></div></div>`;
    document.getElementById('quickRequest').onclick=()=>showTab('request');
    document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>showTab(b.dataset.go));
    document.getElementById('profileEditSmall').onclick=onboarding;
  } else if(tab==='request') {
    target.innerHTML=`<div class="content-narrow"><div class="intro-block"><div class="large-icon violet">↗</div><h2>Kirim request ke owner.</h2><p>Gunakan pesan otomatis untuk menyampaikan ide atau kebutuhan. Pesan akan dikirim langsung ke Telegram owner.</p></div><div class="panel request-panel"><div class="panel-heading"><div><h3>Pesan request</h3><p>Jelaskan request kamu secara singkat dan jelas.</p></div><span class="secure-label">● DIRECT</span></div><label>Tujuan request<select id="reqDestination" class="form-select"><option value="owner">Kirim otomatis ke Owner (Telegram pribadi)</option><option value="channel">Kirim otomatis ke Channel Telegram</option></select></label><label>Topik request<input id="reqTopic" maxlength="100" placeholder="Contoh: Bot downloader Telegram"></label><label>Detail pesan<textarea id="reqBody" rows="5" maxlength="3000" placeholder="Halo owner, saya ingin request fitur..."></textarea><small id="charCount">0 / 3000</small></label><button class="btn btn-primary btn-full" id="sendRequest">Kirim Request Otomatis <span>↗</span></button><p class="form-footnote">Satu pengiriman otomatis per profil browser. Jangan kirim kata sandi atau informasi sensitif.</p></div><div class="info-strip"><span>ⓘ</span><p>Request akan masuk ke Telegram owner. Catatan Lokal hanya tersimpan di browser ini dan tidak mengirim pesan ke owner.</p></div></div>`;
    document.getElementById('reqBody').oninput=e=>document.getElementById('charCount').textContent=`${e.target.value.length} / 3000`;
    document.getElementById('sendRequest').onclick=sendRequest;
  } else if(tab==='chat') renderChat(target);
}
async function sendRequest() {
  const topic=document.getElementById('reqTopic').value.trim(), body=document.getElementById('reqBody').value.trim();
  if(!topic||!body) return toast('Isi topik dan detail request dulu.');
  const key=`req_auto_sent_${state.profile.telegramId}`;
  if(localStorage.getItem(key)) return toast('Request otomatis untuk profil ini sudah pernah dikirim.');
  const btn=document.getElementById('sendRequest');btn.disabled=true;btn.innerHTML='Mengirim... <span>◌</span>';
  try {
    const r=await fetch('/api/notify',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name:state.profile.name,telegramId:state.profile.telegramId,type:'Auto Request: '+topic,message:body,destination:document.getElementById('reqDestination').value})});
    const data=await r.json();if(!r.ok) throw new Error(data.error||'Gagal mengirim.');
    localStorage.setItem(key,'1');toast(document.getElementById('reqDestination').value==='channel'?'Request berhasil dikirim ke channel!':'Request berhasil dikirim ke owner!');document.getElementById('reqTopic').value='';document.getElementById('reqBody').value='';document.getElementById('charCount').textContent='0 / 3000';
  } catch(e) { toast(e.message||'Terjadi kesalahan.'); }
  finally {btn.disabled=false;btn.innerHTML='Kirim Request Otomatis <span>↗</span>';}
}
async function renderChat(target) {
  const p=state.profile;
  target.innerHTML=`<div class="info-strip"><span>ⓘ</span><p><b>Chat lokal:</b> pesan disimpan di localStorage browser ini. Owner tidak bisa melihat atau membalas dari perangkat lain. Untuk menghubungi owner, gunakan fitur Auto Request Telegram.</p></div><div class="chat-layout"><section class="chat-main panel"><div class="chat-header"><div class="chat-owner-avatar">R</div><div><b>Catatan Percakapan · REQ BOT</b><small>Disimpan di browser ini saja</small></div><span class="chat-header-tag">LOCAL</span></div><div class="chat-messages" id="chatMessages"></div><form id="chatForm" class="chat-compose"><textarea id="chatInput" rows="1" maxlength="3000" placeholder="Tulis catatan pesan..." required></textarea><button class="send-btn" aria-label="Simpan pesan">↑</button></form><div class="compose-hint">Enter untuk menyimpan · Shift + Enter untuk baris baru</div></section><aside class="chat-details panel"><div class="details-title">Detail penyimpanan</div><div class="details-profile">${avatar(p.name,p.avatarUrl)}<b>${escapeHTML(p.name)}</b><small>Profil browser ini</small></div><div class="detail-row"><span>Telegram ID</span><code>${escapeHTML(p.telegramId)}</code></div><div class="detail-row"><span>Sinkronisasi</span><span class="status-text">Tidak tersedia</span></div><div class="details-note"><span>✦</span><p>Gunakan Auto Request untuk mengirim pesan ke Telegram owner.</p></div><button class="btn btn-outline btn-full" id="refreshChat">↻ Muat ulang catatan</button><button class="btn btn-outline btn-full" id="clearLocalChat">Hapus catatan lokal</button></aside></div>`;
  document.getElementById('chatForm').onsubmit=e=>{e.preventDefault();const input=document.getElementById('chatInput'),body=input.value.trim();if(!body)return;saveMessage(p.telegramId,{sender:'user',body,display_name:p.name,created_at:new Date().toISOString()});input.value='';loadMessages();};
  document.getElementById('chatInput').onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();document.getElementById('chatForm').requestSubmit();}};
  document.getElementById('refreshChat').onclick=loadMessages;
  document.getElementById('clearLocalChat').onclick=()=>{if(!confirm('Hapus catatan chat lokal di browser ini?'))return;const chats=readChats();delete chats[String(p.telegramId)];writeChats(chats);loadMessages();toast('Catatan lokal dihapus.');};
  loadMessages();
}
function loadMessages() {
  const p=state.profile, box=document.getElementById('chatMessages');if(!box)return;
  const data=getChat(p.telegramId);
  if(!data.length){box.innerHTML='<div class="chat-empty"><div class="empty-icon">◉</div><b>Belum ada catatan</b><p>Tulis pesan untuk menyimpannya di browser ini.</p></div>';return;}
  box.innerHTML=data.map(m=>`<div class="message-row mine"><div class="message-content"><div class="message-meta">${escapeHTML(m.display_name||p.name)} · ${new Date(m.created_at).toLocaleString('id-ID',{hour:'2-digit',minute:'2-digit'})}</div><div class="message-bubble">${escapeHTML(m.body).replace(/\n/g,'<br>')}</div></div></div>`).join(''); box.scrollTop=box.scrollHeight;
}
async function ownerLogin() {
  shell(`<div class="onboard-page"><div class="onboard-card owner-login"><div class="onboard-brand"><span class="brand-mark">R</span><span>REQ<span class="muted">BOT</span></span></div><div class="onboard-avatar owner-login-icon">⌘</div><div class="eyebrow center">ARSIP LOKAL</div><h1>Arsip browser ini.</h1><p class="onboard-sub">Karena tidak ada database bersama, panel ini hanya membaca pesan yang tersimpan di browser/perangkat yang sama. Ini bukan inbox owner lintas pengguna.</p><button class="btn btn-primary btn-full" id="openLocalArchive">Buka arsip lokal <span>→</span></button><button class="back-link" id="ownerBack">← Kembali ke website</button></div></div>`);
  document.getElementById('ownerBack').onclick=landing;
  document.getElementById('openLocalArchive').onclick=()=>{state.ownerOk=true;ownerDashboard();};
}
async function ownerDashboard() {
  shell(`<div class="owner-shell"><header class="owner-top"><a class="brand" href="#"><span class="brand-mark">R</span><span>REQ<span class="muted">BOT</span></span></a><span class="owner-badge">ARSIP LOKAL · BROWSER INI</span><button id="ownerLogout" class="btn btn-quiet btn-small">Keluar ↗</button></header><main class="owner-content"><div class="eyebrow">LOCAL ARCHIVE</div><h1>Arsip lokal<span class="gradient-text">.</span></h1><p class="owner-desc">Data hanya berasal dari localStorage perangkat/browser ini. Pengunjung lain tidak mengirim chat ke arsip ini.</p><div class="owner-stats"><div class="panel stat-card"><span>Profil yang punya catatan</span><b id="ownerUsers">—</b></div><div class="panel stat-card"><span>Total pesan lokal</span><b id="ownerCount">—</b></div><div class="panel stat-card"><span>Penyimpanan</span><b>localStorage</b></div></div><div class="owner-chat-grid"><section class="panel owner-users"><div class="panel-heading"><div><h3>Profil lokal</h3><p>Pilih profil di browser ini.</p></div><button class="icon-btn" id="ownerReload">↻</button></div><div id="ownerUserList" class="owner-user-list"></div></section><section class="panel owner-conversation"><div class="owner-convo-head" id="ownerConvoHead"><b>Pilih catatan</b><small>Arsip lokal, bukan chat bersama.</small></div><div id="ownerMessages" class="owner-messages"><div class="chat-empty"><b>Belum ada profil dipilih</b></div></div><div class="owner-actions"><button class="btn btn-outline btn-small" id="deleteHistory">Hapus riwayat lokal terpilih</button></div></section></div><p class="security-warning">Jangan gunakan arsip lokal ini untuk percakapan privat lintas pengguna. localStorage tidak disinkronkan ke server.</p></main></div>`);
  document.getElementById('ownerLogout').onclick=landing;
  document.getElementById('ownerReload').onclick=loadOwnerUsers;
  document.getElementById('deleteHistory').onclick=deleteHistory;
  await loadOwnerUsers();
}
async function loadOwnerUsers() {
  const all=allLocalMessages();state.messages=all;
  const map=new Map();for(const m of all)if(!map.has(m.telegram_id))map.set(m.telegram_id,m);
  document.getElementById('ownerUsers').textContent=map.size;document.getElementById('ownerCount').textContent=all.length;
  const list=document.getElementById('ownerUserList');
  list.innerHTML=map.size?[...map.values()].map(m=>`<button class="owner-user ${state.activeChat===m.telegram_id?'selected':''}" data-id="${escapeHTML(m.telegram_id)}"><span class="owner-user-avatar">${escapeHTML(initials(m.display_name))}</span><span><b>${escapeHTML(m.display_name)}</b><small>ID ${escapeHTML(m.telegram_id)}</small><small class="user-last">${escapeHTML(m.body.slice(0,48))}</small></span></button>`).join(''):'<div class="empty-users">Belum ada catatan di browser ini.</div>';
  list.querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>{state.activeChat=b.dataset.id;loadOwnerUsers();loadOwnerMessages();});if(state.activeChat)await loadOwnerMessages();
}
async function loadOwnerMessages() {
  const id=state.activeChat,box=document.getElementById('ownerMessages');if(!id||!box)return;
  const data=getChat(id);const sample=data[0];
  document.getElementById('ownerConvoHead').innerHTML=`<b>${escapeHTML(sample?.display_name||'Pengguna')}</b><small>Telegram ID: ${escapeHTML(id)} · lokal</small>`;
  box.innerHTML=data.length?data.map(m=>`<div class="message-row ${m.sender==='owner'?'mine':'theirs'}"><div class="message-content"><div class="message-meta">${m.sender==='owner'?'Owner':'Pengguna'} · ${new Date(m.created_at).toLocaleString('id-ID',{hour:'2-digit',minute:'2-digit'})}</div><div class="message-bubble">${escapeHTML(m.body).replace(/\n/g,'<br>')}</div></div></div>`).join(''):'<div class="chat-empty"><b>Belum ada catatan</b></div>';box.scrollTop=box.scrollHeight;
}
async function deleteHistory() {
  if(!state.activeChat)return toast('Pilih arsip yang ingin dihapus.');
  if(!confirm('Hapus riwayat lokal ini dari browser?'))return;
  const chats=readChats();delete chats[String(state.activeChat)];writeChats(chats);state.activeChat='';toast('Riwayat lokal dihapus.');await loadOwnerUsers();document.getElementById('ownerMessages').innerHTML='<div class="chat-empty"><b>Riwayat lokal dihapus</b></div>';
}
async function init() {
  if(state.owner) { ownerLogin(); return; }
  try {const saved=JSON.parse(localStorage.getItem('req_profile')||'null');if(saved?.name&&saved?.telegramId){state.profile=saved;dashboard();return;}}catch{}
  landing();
}
init();
