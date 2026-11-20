const cameras={Nota:{v:'videoNota',c:'canvasNota',p:'previewNota'},Retur:{v:'videoRetur',c:'canvasRetur',p:'previewRetur'},Bukti:{v:'videoBukti',c:'canvasBukti',p:'previewBukti'}};
const camConstraints={audio:false,video:{facingMode:{ideal:'environment'},width:{ideal:1280},height:{ideal:1024}}};
async function startCamera(k){
  const v=$('#'+cameras[k].v);
  try{v.srcObject=await navigator.mediaDevices.getUserMedia(camConstraints);v.play()}
  catch(e){S.toast('Kamera tidak bisa dibuka: '+e.message,false)}
}
function stopCamera(k){const v=$('#'+cameras[k].v);v.srcObject?.getTracks().forEach(t=>t.stop());v.srcObject=null}
function takeSnapshot(k){
  const c=cameras[k],v=$('#'+c.v),cv=$('#'+c.c),p=$('#'+c.p);
  if(!v.videoWidth)return S.toast('Kamera belum siap, coba lagi',false);
  const W=1024,H=819;cv.width=W;cv.height=H;
  const vr=v.videoWidth/v.videoHeight,or=W/H;let sw=v.videoWidth,sh=v.videoHeight;
  if(vr>or)sw=sh*or;else sh=sw/or;
  cv.getContext('2d').drawImage(v,(v.videoWidth-sw)/2,(v.videoHeight-sh)/2,sw,sh,0,0,W,H);
  const url=cv.toDataURL('image/jpeg',0.72);
  p.src=url;p.classList.remove('hidden');v.classList.add('hidden');stopCamera(k);
  window[`foto${k}Base64`]=url.split(',')[1];
  $('#ambil'+k).classList.add('hidden');
  const b=document.createElement('button');b.type='button';b.className='remove-btn';b.textContent='✕';b.setAttribute('aria-label','Ulangi foto');
  b.onclick=()=>{p.src='';p.classList.add('hidden');v.classList.remove('hidden');startCamera(k);$('#ambil'+k).classList.remove('hidden');delete window[`foto${k}Base64`];b.remove()};
  p.parentElement.append(b);
}
function resetCameras(){
  for(const k in cameras){const c=cameras[k],p=$('#'+c.p);stopCamera(k);p.removeAttribute('src');p.classList.add('hidden');$('#'+c.v).classList.remove('hidden');$('#ambil'+k).classList.remove('hidden');p.parentElement.querySelector('.remove-btn')?.remove();delete window[`foto${k}Base64`]}
  $('#returBox').classList.add('hidden');$('#buktiBox').classList.add('hidden');startCamera('Nota');
}
function bindToggle(inputId,evt,show,k,box){
  $('#'+inputId).addEventListener(evt,e=>{
    const on=show(e.target.value),v=$('#'+cameras[k].v),p=$('#'+cameras[k].p);
    $('#'+box).classList.toggle('hidden',!on);
    if(on){if(!v.srcObject&&p.classList.contains('hidden')){v.classList.remove('hidden');startCamera(k)}}else stopCamera(k);
  });
}
bindToggle('retur','input',v=>(parseInt(v)||0)>0,'Retur','returBox');
bindToggle('pembayaran','change',v=>v==='Ya','Bukti','buktiBox');
addEventListener('DOMContentLoaded',()=>startCamera('Nota'));
