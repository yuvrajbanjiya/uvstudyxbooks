const firebaseConfig={apiKey:"AIzaSyBoVu1cTd3r3XuzI8ddyivzaIrwucyP1KU",authDomain:"telegram-channel-865e4.firebaseapp.com",projectId:"telegram-channel-865e4",storageBucket:"telegram-channel-865e4.firebasestorage.app",messagingSenderId:"358639430043",appId:"1:358639430043:web:bc6b748ec4a95fc847993e",measurementId:"G-KXPB2E328S"};
firebase.initializeApp(firebaseConfig);const db=firebase.firestore(),booksCollection=db.collection("books");
let books=[],activeSubject="all",searchTerm="",editingBookId=null;

function normalize(v){return String(v||"").toLowerCase().trim()}
function inferSubject(b){if(b.subject)return b.subject;const s=normalize(`${b.title} ${b.category}`);if(s.includes("physics")||s.includes("physic"))return"Physics";if(s.includes("chemistry")||s.includes("chemical"))return"Chemistry";if(s.includes("biology")||s.includes("botany")||s.includes("zoology"))return"Biology";if(s.includes("hindi"))return"Hindi";if(s.includes("english"))return"English";if(s.includes("math")||s.includes("jee"))return"Mathematics";return"Other"}
function escapeHtml(v){return String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}
function safeUrl(v){try{const u=new URL(String(v));return ["http:","https:"].includes(u.protocol)?u.href:"#"}catch{return"#"}}

booksCollection.orderBy("createdAt","desc").onSnapshot(s=>{books=s.docs.map(d=>({id:d.id,...d.data()}));renderBooks();if(document.getElementById("adminModal").classList.contains("show"))renderAdminBooks()},e=>{console.error(e);try{const x=JSON.parse(localStorage.getItem("classFreeBooks")||"[]");if(Array.isArray(x)){books=x;renderBooks()}}catch(_){} });

function filteredBooks(){const q=normalize(searchTerm);return books.filter(b=>{const sub=inferSubject(b);const text=normalize(`${b.title} ${b.category} ${sub} ${b.class||""}`);return (activeSubject==="all"||sub===activeSubject)&&(!q||text.includes(q))})}
function renderBooks(){const grid=document.getElementById("booksGrid"),empty=document.getElementById("emptyState");if(!grid)return;const list=filteredBooks();document.getElementById("countAll").textContent=books.length;document.querySelectorAll("#subjectTabs button[data-subject]").forEach(btn=>{const sub=btn.dataset.subject;if(sub!=="all")btn.querySelector("span").textContent=books.filter(b=>inferSubject(b)===sub).length});grid.innerHTML=list.map(b=>{const sub=inferSubject(b),url=safeUrl(b.download),shareData=encodeURIComponent(JSON.stringify({title:b.title,subject:sub,url:b.download}));return `<article class="book-card"><div class="cover-wrap"><img class="book-cover" src="${escapeHtml(safeUrl(b.image))}" alt="${escapeHtml(b.title)} cover" loading="lazy" onerror="this.src='https://placehold.co/600x800/f0f2f5/667085?text=Book+Cover'"><span class="subject-badge">${escapeHtml(sub)}</span></div><div class="book-info"><div class="book-meta"><span>${escapeHtml(b.category||"Study Material")}</span></div><h3>${escapeHtml(b.title)}</h3><div class="card-actions"><a class="book-download" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">⬇️ Download</a><button class="share-btn" onclick="shareBook(decodeURIComponent('${shareData}'))">↗ Share</button></div></div></article>`}).join("");empty.hidden=list.length>0;document.getElementById("resultText").textContent=`Showing ${list.length} of ${books.length} book${books.length===1?"":"s"}`}

async function shareBook(raw){try{const d=JSON.parse(raw);const text=`📚 ${d.title}\n${d.subject}\n\n${location.href}`;if(navigator.share){await navigator.share({title:d.title,text,url:location.href})}else{await navigator.clipboard.writeText(text);showToast("Book link copied!")}}catch(e){if(e.name!=="AbortError")showToast("Unable to share on this device")}}
function showToast(msg){let t=document.getElementById("toast");if(!t){t=document.createElement("div");t.id="toast";document.body.appendChild(t)}t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
function handleSearch(v){searchTerm=v;renderBooks()}
function clearSearch(){document.getElementById("bookSearch").value="";searchTerm="";renderBooks()}
function setSubject(sub,el){activeSubject=sub;document.querySelectorAll("#subjectTabs button").forEach(b=>b.classList.toggle("active",b.dataset.subject===sub));if(sub!=="all"){const btn=[...document.querySelectorAll("#subjectTabs button")].find(b=>b.dataset.subject===sub);if(btn)btn.classList.add("active")}document.getElementById("books").scrollIntoView({behavior:"smooth",block:"start"});renderBooks()}
function resetFilters(){activeSubject="all";searchTerm="";document.getElementById("bookSearch").value="";document.querySelectorAll("#subjectTabs button").forEach(b=>b.classList.toggle("active",b.dataset.subject==="all"));renderBooks()}
function toggleMenu(){document.getElementById("nav").classList.toggle("open")}
document.querySelectorAll("#nav a").forEach(a=>a.addEventListener("click",()=>document.getElementById("nav").classList.remove("open")));
document.getElementById("year").textContent=new Date().getFullYear();
const channelSlides=[...document.querySelectorAll(".channel-slide")];let activeChannel=0;
function showChannel(index){if(!channelSlides.length)return;activeChannel=(index+channelSlides.length)%channelSlides.length;channelSlides.forEach((slide,i)=>{slide.hidden=i!==activeChannel;slide.classList.toggle("active",i===activeChannel)});}
function changeChannel(step){showChannel(activeChannel+step);}
showChannel(0);


const ADMIN_PASSWORD="Bajiya@123";let tapCount=0,tapTimer=null;document.querySelector(".brand img").addEventListener("click",()=>{tapCount++;clearTimeout(tapTimer);tapTimer=setTimeout(()=>tapCount=0,450);if(tapCount===2){tapCount=0;document.getElementById("loginModal").classList.add("show");setTimeout(()=>document.getElementById("adminPassword").focus(),50)}});
function closeLogin(){document.getElementById("loginModal").classList.remove("show");document.getElementById("adminPassword").value="";document.getElementById("loginError").textContent=""}
function loginAdmin(){if(document.getElementById("adminPassword").value===ADMIN_PASSWORD){closeLogin();renderAdminBooks();document.getElementById("adminModal").classList.add("show")}else document.getElementById("loginError").textContent="Incorrect password."}
function closeAdmin(){document.getElementById("adminModal").classList.remove("show");closeBookForm()}
function openBookForm(id=null){editingBookId=id;document.getElementById("bookForm").hidden=false;document.getElementById("formTitle").textContent=id?"Edit Book":"Add New Book";const b=id?books.find(x=>x.id===id):{title:"",category:"",image:"",download:"",subject:"Physics"};document.getElementById("bookTitle").value=b?.title||"";document.getElementById("bookSubject").value=inferSubject(b||{})||"Other";document.getElementById("bookCategory").value=b?.category||"";document.getElementById("bookImage").value=b?.image||"";document.getElementById("bookDownload").value=b?.download||"";document.querySelector("#bookForm .primary").textContent=id?"Save Changes":"Add Book"}
function closeBookForm(){document.getElementById("bookForm").hidden=true;editingBookId=null}
async function saveBook(){const b={title:document.getElementById("bookTitle").value.trim(),subject:document.getElementById("bookSubject").value,category:document.getElementById("bookCategory").value.trim(),image:document.getElementById("bookImage").value.trim(),download:document.getElementById("bookDownload").value.trim()};if(!b.title||!b.category||!b.image||!b.download){alert("Please fill all fields.");return}try{if(editingBookId)await booksCollection.doc(editingBookId).update({...b,updatedAt:firebase.firestore.FieldValue.serverTimestamp()});else await booksCollection.add({...b,createdAt:firebase.firestore.FieldValue.serverTimestamp(),updatedAt:firebase.firestore.FieldValue.serverTimestamp()});closeBookForm();showToast(editingBookId?"Book updated":"Book added")}catch(e){console.error(e);alert("Book save failed. Check Firestore rules.")}}
async function deleteBook(id){const b=books.find(x=>x.id===id);if(!b)return;if(confirm(`Delete “${b.title}” permanently?`))try{await booksCollection.doc(id).delete();showToast("Book deleted")}catch(e){alert("Delete failed. Check Firestore rules.")}}
function renderAdminBooks(){const box=document.getElementById("adminBooks");box.innerHTML=books.length?books.map(b=>`<div class="admin-book"><img src="${escapeHtml(safeUrl(b.image))}" alt=""><div class="admin-book-info"><b>${escapeHtml(b.title)}</b><small>${escapeHtml(inferSubject(b))} • ${escapeHtml(b.category)}</small></div><div class="admin-actions"><button class="small-btn" onclick="openBookForm('${escapeHtml(b.id)}')">Edit</button><button class="small-btn danger" onclick="deleteBook('${escapeHtml(b.id)}')">Delete</button></div></div>`).join(""):"<p class='admin-empty'>No books added yet.</p>"}
renderBooks();


// Telegram welcome popup: shown whenever the website opens.
function openTelegramPopup(){
  const popup=document.getElementById('telegramPopup');
  if(!popup)return;
  popup.classList.add('show');
  popup.setAttribute('aria-hidden','false');
  document.body.classList.add('popup-open');
}
function closeTelegramPopup(){
  const popup=document.getElementById('telegramPopup');
  if(!popup)return;
  popup.classList.remove('show');
  popup.setAttribute('aria-hidden','true');
  document.body.classList.remove('popup-open');
}
document.addEventListener('DOMContentLoaded',()=>{
  setTimeout(openTelegramPopup,120);
});
document.addEventListener('keydown',(e)=>{if(e.key==='Escape')closeTelegramPopup();});
