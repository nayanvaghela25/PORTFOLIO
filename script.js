// =========================================
//  SCRIPT.JS (Structured Format)
// =========================================

// Note: Logic is unchanged. Only formatting
// and indentation have been improved.

'use strict';

const $=(s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];

const categories=['All','Character','Weapon','Environment','Architecture','Furniture','Vehicle','Product'];

let models=[], active='All', query='';

window.addEventListener('load',()=>setTimeout(()=>$('.loader').classList.add('hide'),500));

$('#year').textContent=new Date().getFullYear();

window.addEventListener('mousemove',e=> {
    const c=$('.cursor');
    c.style.left=e.clientX+'px';
    c.style.top=e.clientY+'px'
}
);

window.addEventListener('scroll',()=> {
    $('header').classList.toggle('scrolled',scrollY>30);
     const ids=$$('main section').map(s=>s.id).filter(Boolean);
     const id=ids.findLast(x=>scrollY+160>$('#'+x).offsetTop);
     $$('.links a').forEach(a=>a.classList.toggle('active',a.hash==='#'+id))
}
);

$('.menu').addEventListener('click',()=>$('.links').classList.toggle('open'));

$$('.links a').forEach(a=>a.addEventListener('click',()=>$('.links').classList.remove('open')));

const observer=new IntersectionObserver(entries=>entries.forEach(e=> {
    if(!e.isIntersecting)return;
    e.target.classList.add('visible');
    if(e.target.classList.contains('skills'))$$('.skill',e.target).forEach(s=>$('u',s).style.width=s.dataset.level+'%');
    if(e.target.classList.contains('stat'))count(e.target)
}
), {
    threshold:.16
}
);

$$('.reveal').forEach(el=>observer.observe(el));

function count(el) {
    const node=$('[data-count]',el),target=+node.dataset.count,start=performance.now();
    function tick(now) {
        node.textContent=Math.round(Math.min((now-start)/1100,1)*target);
        if(now-start<1100)requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
}

const words=['3D worlds','game worlds','digital stories','bold ideas'];
let wi=0,ci=0,deleting=false;

function type() {
    const word=words[wi];
    ci+=deleting?-1:1;
    $('#typed').textContent=word.slice(0,ci);
    if(!deleting&&ci===word.length) {
        deleting=true;
        setTimeout(type,1500);
        return
    }
    if(deleting&&ci===0) {
        deleting=false;
        wi=(wi+1)%words.length
    }
    setTimeout(type,deleting?45:85)
}
setTimeout(type,1500);

function safe(t='') {
    const d=document.createElement('div');
    d.textContent=t;
    return d.innerHTML
}

function renderFilters() {
    const box=$('#filters');
    box.innerHTML=categories.map(c=>`<button class="filter ${c===active?'active':''}" data-cat="${c}">${c}</button>`).join('');
    $$('.filter').forEach(b=>b.onclick=()=> {
        active=b.dataset.cat;
        renderFilters();
        renderModels()
    }
    )
}

function renderModels() {
    const list=models.filter(m=>(active==='All'||m.category===active)&&m.name.toLowerCase().includes(query));
    $('#model-grid').innerHTML=list.map((m,i)=>`<article class="model-card" style="animation-delay:${i*50}ms"><div class="thumb"><img src="${safe(m.image)}" alt="${safe(m.name)}" loading="lazy"></div><div class="card-body"><div class="card-top"><div><small>${safe(m.category)}</small><h3>${safe(m.name)}</h3></div><div class="stars">${'<i class="fa-solid fa-star"></i>'.repeat(Math.max(0,Math.min(5,m.rating||5)))}</div></div><button class="btn view" data-index="${models.indexOf(m)}">View in 3D <i class="fa-solid fa-arrow-up-right-from-square"></i></button></div></article>`).join('');
    $('#empty').hidden=!!list.length;
    $$('.view').forEach(b=>b.onclick=()=>openModel(models[+b.dataset.index]))
}

async function loadData() {
    try {
        models=await fetch('data/models.json').then(r=> {
            if(!r.ok)throw Error();
            return r.json()
        }
        );
        renderFilters();
        renderModels()
    }
    catch {
        models=[];
        renderFilters();
        renderModels();
        toast('Run with Live Server to load portfolio data.')
    }
    try {
        const projects=await fetch('data/projects.json').then(r=>r.json());
        renderProjects(projects)
    }
    catch {
        renderProjects([])
    }
    
}

function renderProjects(items) {
    $('#project-grid').innerHTML=!items.length?`<div class="coming reveal visible"><i class="fa-solid fa-wand-magic-sparkles"></i><h3>Coming Soon</h3><p>New interactive work is currently taking shape.</p></div>`:items.map(p=>`<article class="model-card"><div class="thumb"><img src="${safe(p.image)}" alt="${safe(p.name)}" loading="lazy"></div><div class="card-body"><small>${safe(p.category||'Project')}</small><h3>${safe(p.name)}</h3><p>${safe(p.description||'')}</p>${p.url?`<a class="btn view" href="${safe(p.url)}" target="_blank">View project</a>`:''}</div></article>`).join('')
}

const modal=$('#modal'), viewer=$('#viewer');

function openModel(m) {
    $('#modal-title').textContent=m.name;
    $('#modal-cat').textContent=m.category;
    viewer.src=m.model;
    $('.viewer').classList.remove('loaded');
    viewer.addEventListener('load',()=>$('.viewer').classList.add('loaded'), {
        once:true
    }
    );
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    document.body.classList.add('lock')
}

function closeModel() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    document.body.classList.remove('lock');
    setTimeout(()=>viewer.removeAttribute('src'),350)
}

$$('[data-close]').forEach(x=>x.onclick=closeModel);
window.addEventListener('keydown',e=> {
    if(e.key==='Escape')closeModel()
}
);

$('#fullscreen').onclick=()=> {
    const target=$('.viewer');
    if(target.requestFullscreen)target.requestFullscreen()
}
;

$('#search').oninput=e=> {
    query=e.target.value.trim().toLowerCase();
    renderModels()
}
;

$('#contact-form').onsubmit=e=> {
    e.preventDefault();
    $('#form-note').textContent='Thanks — your email app is opening.';
    const d=new FormData(e.target);
    location.href=`mailto:nayan@example.com?subject=${encodeURIComponent(d.get('subject'))}&body=${encodeURIComponent('Name: '+d.get('name')+'\nEmail: '+d.get('email')+'\n\n'+d.get('message'))}`
}
;

function toast(msg) {
    const t=$('#toast');
    t.textContent=msg;
    t.classList.add('show');
    setTimeout(()=>t.classList.remove('show'),3500)
}

$$('.ripple').forEach(b=>b.addEventListener('click',e=> {
    const r=document.createElement('i'),box=b.getBoundingClientRect();
    r.style.cssText=`position:absolute;width:10px;height:10px;border-radius:50%;background:#fff8;left:${e.clientX-box.left}px;top:${e.clientY-box.top}px;transform:scale(0);animation:rip .6s;pointer-events:none`;
    b.append(r);
    setTimeout(()=>r.remove(),650)
}
));

loadData();
