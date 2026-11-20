const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const S={
  guard(){
    if(localStorage.getItem('loggedIn')!=='true'||!localStorage.getItem('id_spreadsheet')){location.replace('login.html');return false}
    let t;const go=()=>{clearTimeout(t);t=setTimeout(()=>{localStorage.clear();location.replace('login.html')},10*60*1000)};
    ['pointerdown','keydown','scroll'].forEach(e=>addEventListener(e,go,{passive:true}));go();return true;
  },
  bar(title,{back=true,extra=''}={}){
    const h=document.createElement('header');h.className='top';
    h.innerHTML=`<a href="dashboard.html"><img src="pertamina-logo.png" alt="i-Shipping"></a><h1>${esc(title)}</h1>${back?'<a class="btn ghost sm" href="dashboard.html">Dashboard</a>':''}${extra}`;
    document.body.prepend(h);
  },
  spin(on){let e=$('#spin');if(!e){e=document.createElement('div');e.id='spin';e.innerHTML='<i></i>';document.body.append(e)}e.className=on?'on':''},
  toast(m,ok=true){let e=$('#toast');if(!e){e=document.createElement('div');e.id='toast';e.setAttribute('role','status');document.body.append(e)}
    e.textContent=m;e.className='on'+(ok?'':' bad');clearTimeout(S._t);S._t=setTimeout(()=>e.className='',3500)},
  async api(url,body){const r=await fetch(url,body?{method:'POST',body:JSON.stringify(body)}:undefined);if(!r.ok)throw new Error('Server '+r.status);return r.json()},
  dialog({title,msg,fields=[],ok='Simpan',danger}){return new Promise(res=>{
    const d=document.createElement('dialog');
    d.innerHTML=`<form method="dialog"><h3>${esc(title)}</h3>${msg?`<p>${esc(msg)}</p>`:''}${fields.map((f,i)=>`<div class="f"><label>${esc(f.label)}<input name="f${i}" value="${esc(f.value||'')}" style="text-transform:uppercase;margin-top:6px"></label></div>`).join('')}<div class="row end"><button class="btn ghost" value="x">Batal</button><button class="btn${danger?' danger':''}" value="ok">${esc(ok)}</button></div></form>`;
    document.body.append(d);d.showModal();
    d.addEventListener('close',()=>{const y=d.returnValue==='ok';const v=y?[...new FormData(d.querySelector('form')).values()].map(x=>String(x).trim().toUpperCase()):null;d.remove();res(v)});
  })}
};
