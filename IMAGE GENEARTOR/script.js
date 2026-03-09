
// ═══════════════════════════════════════════════════
// EMOJI DATA
// ═══════════════════════════════════════════════════
const EC={
  smileys:['😀','😂','🥹','😍','🤩','😎','🥳','😇','🤔','😴','🤯','😈','👻','💀','🤖','👾','💪','👏','🙌','✌️','👍','❤️','🧡','💛','💚','💙','💜','🖤','💕','💯','🔥','⚡'],
  nature:['🌸','🌺','🌻','🌹','🌷','🍀','🌿','🍃','🌱','🌲','🌳','🌴','🍄','🌾','🌊','🔥','⚡','❄️','🌈','☀️','🌙','⭐','🌟','💫','✨','🦋','🐦','🦄','🐉','🐺','🦊','🌴'],
  objects:['💎','🎨','🎭','🎬','🎮','🎯','🎲','🧩','🏆','🥇','🎁','🎀','🎊','🎉','🔮','💡','🔑','⚔️','🛡️','🪄','🧿','💻','📱','🎵','🎶','🎸','🎹','🥁','🎺','🪩','🎪','🎠'],
  symbols:['⭐','🌟','💫','✨','⚡','🔥','💥','❤️','💔','💯','✅','❌','⚠️','💠','🔷','🔶','🔴','🟠','🟡','🟢','🔵','🟣','⚫','⚪','🏁','🚩','♾️','🔁','🔺','🔻','🔄','▶️'],
  food:['🍕','🍔','🌮','🌯','🥗','🍜','🍣','🍩','🧁','🎂','🍰','🍪','🍫','🍭','🍦','🧋','☕','🥂','🍷','🍸','🍹','🍓','🍇','🍊','🍋','🍑','🍒','🥝','🍉','🥭','🍍','🫐'],
  travel:['🚀','✈️','🛸','🚁','⛵','🚢','🏎️','🚂','🏙️','🗼','🏰','🗽','🌋','🏔️','🏖️','🏜️','🌃','🌆','🌇','🌉','🎡','🎢','⛪','🕌','🌐','🗺️','🧭','🛕','🏛️','🎠','🚠','🛤️'],
  telugu:['🪔','🕉️','🪷','🌺','🎊','🪅','🥳','🎉','🎈','🌸','🍬','🎁','💐','🌻','🎶','✨','🌟','💎','🏆','👑','🙏','🪭','🎵','🫶','💖','🌈','🌙','☀️','⭐','🦚','🐘','🌴'],
};

// ═══════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════
const S={
  els:[],selId:null,curFil:'none',curStyle:'',
  iZoom:1,iRot:0,iOX:0,iOY:0,iFH:false,iFV:false,
  gridOn:true,snapOn:false,floAll:false,gloAll:false,
  fBgGrad:'linear-gradient(135deg,#1a1a25,#2a2a3a)',
  hist:[],fut:[],
  dragMode:false,imgSrc:null,
  ts:{bold:false,italic:false,shadow:false,align:'left'},
  eqScale:1,
};
let eid=0;
const SNAP_SIZE=40; // pixels for snap grid

// ═══════════════════════════════════════════════════
// SCRIPT / LANGUAGE DETECTION
// ═══════════════════════════════════════════════════
function detectScript(t){
  if(!t) return 'english';
  if(/[\u0C00-\u0C7F]/.test(t)) return 'telugu';
  if(/[\u0900-\u097F]/.test(t)) return 'hindi';
  if(/[\u0600-\u06FF]/.test(t)) return 'arabic';
  if(/[\u4E00-\u9FFF]/.test(t)) return 'chinese';
  if(/[\u3040-\u30FF]/.test(t)) return 'japanese';
  if(/[\uAC00-\uD7AF]/.test(t)) return 'korean';
  if(/[\u0400-\u04FF]/.test(t)) return 'russian';
  if(/[\u0B80-\u0BFF]/.test(t)) return 'tamil';
  return 'english';
}

const SCRIPT_DISPLAY={telugu:'Telugu తెలుగు',hindi:'Hindi हिंदी',arabic:'Arabic عربي',chinese:'Chinese 中文',japanese:'Japanese 日本語',korean:'Korean 한국어',russian:'Russian',tamil:'Tamil தமிழ்',english:'English'};
const SCRIPT_FONT={telugu:"'Noto Sans Telugu',sans-serif",hindi:"'Noto Sans Devanagari',sans-serif",arabic:"'Noto Sans Arabic',sans-serif",english:"'DM Sans',sans-serif"};
const NOTO_URLS={telugu:'https://fonts.googleapis.com/css2?family=Noto+Sans+Telugu:wght@400;700&display=swap',hindi:'https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;700&display=swap',arabic:'https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;700&display=swap'};
const SCRIPT_SPEECH={telugu:'te-IN',hindi:'hi-IN',arabic:'ar-SA',chinese:'zh-CN',japanese:'ja-JP',korean:'ko-KR',russian:'ru-RU',tamil:'ta-IN'};

function loadFont(sc){
  const url=NOTO_URLS[sc]; if(!url) return;
  if(!document.querySelector(`link[href="${url}"]`)){const l=document.createElement('link');l.rel='stylesheet';l.href=url;document.head.appendChild(l);}
}

// ═══════════════════════════════════════════════════
// VOICE — ANY LANGUAGE
// ═══════════════════════════════════════════════════
let vRec=null, vOn=false;

function initVoice(){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){
    document.getElementById('vbtn').style.opacity='.45';
    document.getElementById('vst').textContent='⚠ Voice not supported in this browser (try Chrome)';
    return;
  }
  buildRec('');
}

function buildRec(lang){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR) return;
  vRec=new SR();
  vRec.continuous=false;vRec.interimResults=true;vRec.maxAlternatives=3;
  vRec.lang=lang||'';
  vRec.onresult=e=>{
    let txt='';let final=false;
    for(let i=e.resultIndex;i<e.results.length;i++){txt+=e.results[i][0].transcript;if(e.results[i].isFinal)final=true;}
    document.getElementById('pi').value=txt;
    const sc=detectScript(txt);
    document.getElementById('lbg').textContent=SCRIPT_DISPLAY[sc]||sc;
    document.getElementById('ldb').classList.add('show');
    if(final){
      setVSt('✓ Captured! Click Generate Image.','done');
      loadFont(sc);
      if(sc!=='english') document.getElementById('tf').value=SCRIPT_FONT[sc]||SCRIPT_FONT.english;
      updPrev();
      // Rebuild recognition with detected language for better accuracy next time
      const lc=SCRIPT_SPEECH[sc]||'';
      setTimeout(()=>buildRec(lc),300);
    } else {
      setVSt('🎤 '+txt.substring(0,55)+(txt.length>55?'…':''),'act');
    }
  };
  vRec.onend=()=>stopVoice();
  vRec.onerror=e=>{
    console.warn('Voice err:',e.error);
    stopVoice();
    if(e.error==='no-speech'){notif('No speech detected. Try again.');}
    else if(e.error==='not-allowed'){notif('⚠ Microphone permission denied.');}
    else {notif('⚠ Voice error: '+e.error);}
  };
}

function toggleVoice(){vOn?stopVoice():startVoice();}
function startVoice(){
  if(!vRec){notif('⚠ Voice not supported');return;}
  try{vRec.start();}catch(e){notif('⚠ '+e.message);return;}
  vOn=true;
  document.getElementById('vbtn').classList.add('listening');
  document.getElementById('vic').textContent='🔴';
  document.getElementById('vtxt').textContent='Listening… (tap to stop)';
  setVSt('🌐 Speak in any language…','act');
  document.getElementById('ldb').classList.remove('show');
}
function stopVoice(){
  vOn=false;
  if(vRec){try{vRec.stop();}catch(e){}}
  document.getElementById('vbtn').classList.remove('listening');
  document.getElementById('vic').textContent='🎤';
  document.getElementById('vtxt').textContent='Speak in Any Language';
  if(!document.getElementById('pi').value){
    setVSt('తెలుగు, हिंदी, English, العربية… auto-detects','');
  }
}
function setVSt(txt,cls){const el=document.getElementById('vst');el.textContent=txt;el.className='vst'+(cls?' '+cls:'');}

// ═══════════════════════════════════════════════════
// PROMPT TYPE DETECTION
// ═══════════════════════════════════════════════════
function onPromptType(){
  const v=document.getElementById('pi').value;
  if(!v.trim()){document.getElementById('ldb').classList.remove('show');return;}
  const sc=detectScript(v);
  if(sc!=='english'){
    document.getElementById('lbg').textContent=SCRIPT_DISPLAY[sc]||sc;
    document.getElementById('ldb').classList.add('show');
    loadFont(sc);
  } else {
    document.getElementById('ldb').classList.remove('show');
  }
}

// ═══════════════════════════════════════════════════
// TRANSLATION via Puter AI (FREE, no API key needed)
// Translates non-English prompts to English for image gen
// ═══════════════════════════════════════════════════
async function translatePrompt(raw){
  const hasNonLatin=/[^\x00-\x7F]/.test(raw);
  if(!hasNonLatin) return {imgPr:raw, overlay:null, lang:'English'};

  const sc=detectScript(raw);
  const langName=SCRIPT_DISPLAY[sc]||'Unknown';
  setLT('Translating '+langName+'…','Converting to English for image generation…');

  try{
    // Use puter.ai.chat for translation — free, no API key needed
    const resp=await puter.ai.chat(
      `You are a translation assistant. The user typed this in ${langName}: "${raw}"

Please respond ONLY with valid JSON (no markdown, no explanation):
{
  "imgPr": "English description of the scene/image to generate (visual description only, no text elements)",
  "overlay": "The original text in ${langName} for overlay on image (keep it short, 1-2 lines max, use original script)",
  "lang": "${langName}"
}`,
      {model:'claude-sonnet-4-20250514'}
    );

    let txt='';
    if(typeof resp==='string') txt=resp;
    else if(resp&&resp.message&&resp.message.content) txt=resp.message.content[0]?.text||'';
    else if(resp&&resp.content) txt=resp.content[0]?.text||resp.content||'';

    // Clean JSON
    txt=txt.replace(/```json|```/g,'').trim();
    const parsed=JSON.parse(txt);

    // Show translation result
    const tb=document.getElementById('trbox');
    tb.innerHTML=`<b>🎨 Image scene (EN):</b> ${parsed.imgPr.substring(0,80)}${parsed.imgPr.length>80?'…':''}<br><b>✎ Text overlay:</b> ${parsed.overlay||'none'}`;
    tb.classList.add('show');
    return parsed;
  } catch(e){
    console.warn('Translation via puter.ai failed:',e);
    // Fallback: use prompt as-is, just translate via simple prompt
    const tb=document.getElementById('trbox');
    tb.innerHTML=`<b>Note:</b> Could not translate — using original prompt`;
    tb.classList.add('show');
    return {imgPr:raw, overlay:null, lang:langName};
  }
}

function setLT(txt,sub){
  document.getElementById('lt').textContent=txt;
  document.getElementById('ls2').textContent=sub;
}

// ═══════════════════════════════════════════════════
// IMAGE GENERATION
// ═══════════════════════════════════════════════════
const RNDPROMPTS=['mystical enchanted forest with glowing fireflies at twilight','futuristic neon cyberpunk city at night rain reflections','majestic snowy mountain peak at golden hour','deep bioluminescent ocean floor alien creatures','fantasy floating island waterfalls crystal towers','aurora borealis frozen tundra lone wolf','cherry blossom festival Japanese garden sunrise','ancient ruins glowing magical symbols jungle'];
const STYLE_MAP={'':'highly detailed professional photography','photorealistic':'photorealistic 8k DSLR sharp focus','digital art':'digital art concept art artstation vibrant','oil painting':'oil painting impressionist painterly brushstrokes','cinematic':'cinematic movie still dramatic lighting','anime':'anime style studio ghibli vibrant clean linework'};

function randPrompt(){document.getElementById('pi').value=RNDPROMPTS[Math.floor(Math.random()*RNDPROMPTS.length)];notif('✦ Random prompt loaded!');}
function fillP(el){document.getElementById('pi').value=el.textContent.replace(/^[^\s]+\s/,'').trim();}

document.querySelectorAll('.stb').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.stb').forEach(x=>x.classList.remove('on'));b.classList.add('on');S.curStyle=b.dataset.s;});});

async function genImg(){
  const raw=document.getElementById('pi').value.trim();
  if(!raw){notif('⚠ Please enter a prompt');return;}
  const lo=document.getElementById('lo'),btn=document.getElementById('genbtn');
  lo.classList.add('show');btn.disabled=true;
  btn.innerHTML='<div style="width:13px;height:13px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .9s linear infinite;display:inline-block;margin-right:5px"></div>Generating…';
  const msgs=['Translating…','Painting pixels…','Imagining worlds…','Weaving light…','Crafting details…','Almost there…'];
  let mi=0;const tmr=setInterval(()=>setLT(msgs[mi++%msgs.length],''),2200);
  const rst=()=>{clearInterval(tmr);lo.classList.remove('show');btn.disabled=false;btn.innerHTML='<span>✦</span> Generate Image';};
  setStatus(`Generating: "${raw.substring(0,35)}…"`);
  try{
    // Translate if non-English
    const ip=raw;
    const ov=null;

    setLT('Generating image…','DALL·E 3 processing… 20-40 sec');
    const style=STYLE_MAP[S.curStyle]||STYLE_MAP[''];
    const full=`${ip}, ${style}, no text in image, no letters or writing, clean visual scene`;
    const imgEl=await puter.ai.txt2img(full,{model:'dall-e-3'});
    if(!imgEl||!imgEl.src) throw new Error('No image returned');
    S.imgSrc=imgEl.src;S.iZoom=1;S.iRot=0;S.iOX=0;S.iOY=0;S.iFH=false;S.iFV=false;
    const fi=document.getElementById('fi');
    fi.src=imgEl.src;fi.style.display='block';
    document.getElementById('ph').style.display='none';
    rst();updIT();updIF();confetti();

    if(ov&&ov.trim()){
      setTimeout(()=>addAutoOv(ov),800);
      notif('✦ Image generated! Text overlay added automatically.');
      setStatus('Done! Text overlay added — drag to reposition.');
    } else {
      notif('✦ Image generated successfully!');
      setStatus('Generated! Add text & emoji on top.');
    }
    saveL();updLL();
  }catch(err){
    rst();console.error('Gen error:',err);
    if(/auth|login|sign/i.test(String(err))) notif('🔑 Puter sign-in needed — a popup may appear');
    else notif('⚠ Generation failed — '+String(err).substring(0,60));
    setStatus('Generation failed. Please retry.');
  }
}

function addAutoOv(txt){
  saveHist();
  const sc=detectScript(txt);
  const font=SCRIPT_FONT[sc]||"'DM Sans',sans-serif";
  loadFont(sc);
  const fr=document.getElementById('df').getBoundingClientRect();
  const cr=document.getElementById('center').getBoundingClientRect();
  const id=++eid;
  const el={id,kind:'text',text:txt,font,size:28,
    x:Math.round(fr.left-cr.left+fr.width/2-120),
    y:Math.round(fr.top-cr.top+fr.height*.62),
    color:'#ffffff',shadowColor:'#000',strokeWidth:2,strokeColor:'#000000',
    spacing:1,bold:true,italic:false,shadow:true,align:'center',
    opacity:1,zIndex:60+id,locked:false,hidden:false,floating:false,glowing:false,rotation:0
  };
  S.els.push(el);
  setTimeout(()=>{rEl(el);selEl(id);updLL();saveL();},400);
}

// ═══════════════════════════════════════════════════
// TEXT HELPERS
// ═══════════════════════════════════════════════════
function onTxtInput(){
  const v=document.getElementById('tc').value;
  const sc=detectScript(v);
  if(sc!=='english'){document.getElementById('tf').value=SCRIPT_FONT[sc]||SCRIPT_FONT.english;loadFont(sc);}
  updPrev();
}
function setQT(txt){
  document.getElementById('tc').value=txt;
  const sc=detectScript(txt);
  if(sc!=='english'){document.getElementById('tf').value=SCRIPT_FONT[sc];loadFont(sc);}
  updPrev();
}
function updPrev(){
  const txt=document.getElementById('tc').value||'Preview';
  const p=document.getElementById('tprev');
  p.style.fontFamily=document.getElementById('tf').value;
  p.style.fontSize=Math.min(parseInt(document.getElementById('tsz').value),36)+'px';
  p.style.color=document.getElementById('tcol').value;
  p.style.fontWeight=S.ts.bold?'bold':'normal';
  p.style.fontStyle=S.ts.italic?'italic':'normal';
  const st=parseInt(document.getElementById('tst').value);
  p.style.webkitTextStroke=st>0?`${st}px ${document.getElementById('tstc').value}`:'';
  p.style.textShadow=S.ts.shadow?`2px 2px 6px ${document.getElementById('tshc').value}`:'';
  p.textContent=txt;
}
function togTS(type){
  S.ts[type]=!S.ts[type];
  const map={bold:'bld-btn',italic:'ita-btn',shadow:'shd-btn'};
  const b=document.getElementById(map[type]);
  if(b){b.style.borderColor=S.ts[type]?'var(--acc2)':'';b.style.color=S.ts[type]?'var(--acc2)':'';}
  updPrev();
  // Apply to selected text element
  if(S.selId){const el=S.els.find(e=>e.id===S.selId&&e.kind==='text');if(el){el[type]=S.ts[type];rEl(el);saveL();}}
}
function setAl(a){
  S.ts.align=a;
  ['left','center','right'].forEach(x=>{const b=document.getElementById('al-'+x.charAt(0));if(b)b.classList.toggle('on',x===a);});
  updPrev();
}

// ═══════════════════════════════════════════════════
// ADD TEXT
// ═══════════════════════════════════════════════════
function addTxt(){
  const txt=document.getElementById('tc').value.trim();
  if(!txt){notif('⚠ Enter text first');return;}
  saveHist();
  const sc=detectScript(txt);loadFont(sc);
  const fr=document.getElementById('df').getBoundingClientRect();
  const cr=document.getElementById('center').getBoundingClientRect();
  const id=++eid;
  const el={
    id,kind:'text',text:txt,
    x:snapV(Math.round(fr.left-cr.left+fr.width/2+(Math.random()-.5)*80)),
    y:snapV(Math.round(fr.top-cr.top+fr.height/2+(Math.random()-.5)*60)),
    font:document.getElementById('tf').value,
    size:parseInt(document.getElementById('tsz').value),
    color:document.getElementById('tcol').value,
    shadowColor:document.getElementById('tshc').value,
    strokeWidth:parseInt(document.getElementById('tst').value),
    strokeColor:document.getElementById('tstc').value,
    spacing:0,bold:S.ts.bold,italic:S.ts.italic,shadow:S.ts.shadow,align:S.ts.align,
    opacity:1,zIndex:20+id,locked:false,hidden:false,floating:false,glowing:false,rotation:0,
  };
  S.els.push(el);rEl(el);selEl(id);updLL();
  notif('✎ Text added — drag to move, double-click to edit');
  setStatus('Text added!');saveL();
}

// ═══════════════════════════════════════════════════
// ADD EMOJI
// ═══════════════════════════════════════════════════
function addEmoji(em){
  saveHist();
  const fr=document.getElementById('df').getBoundingClientRect();
  const cr=document.getElementById('center').getBoundingClientRect();
  const id=++eid;
  const el={
    id,kind:'emoji',emoji:em,
    x:snapV(Math.round(fr.left-cr.left+fr.width/2+(Math.random()-.5)*120)),
    y:snapV(Math.round(fr.top-cr.top+fr.height/2+(Math.random()-.5)*80)),
    size:parseInt(document.getElementById('esz').value),
    opacity:1,zIndex:20+id,locked:false,hidden:false,floating:false,glowing:false,rotation:0,
  };
  S.els.push(el);rEl(el);selEl(id);updLL();notif(em+' added');saveL();
}

// ═══════════════════════════════════════════════════
// ADD SHAPE
// ═══════════════════════════════════════════════════
const SCOLS=['#7c6aff','#ff6ab0','#6affd4','#ffd46a','#ff8c6a','#6aadff','#ff6a6a','#b06aff'];
function addSh(type){
  saveHist();
  const fr=document.getElementById('df').getBoundingClientRect();
  const cr=document.getElementById('center').getBoundingClientRect();
  const id=++eid;
  const el={
    id,kind:'shape',type,
    x:snapV(Math.round(fr.left-cr.left+fr.width/2+(Math.random()-.5)*100)),
    y:snapV(Math.round(fr.top-cr.top+fr.height/2+(Math.random()-.5)*100)),
    w:type==='rect'?100:70,h:70,
    color:document.getElementById('scol').value,
    opacity:parseInt(document.getElementById('sop').value)/100,
    borderColor:document.getElementById('sbcol').value,
    borderWidth:parseInt(document.getElementById('sbw').value),
    zIndex:10+id,locked:false,hidden:false,floating:S.floAll,glowing:S.gloAll,clickCount:0,rotation:0,
  };
  S.els.push(el);rEl(el);selEl(id);updLL();saveL();
}

// ═══════════════════════════════════════════════════
// SNAP HELPER
// ═══════════════════════════════════════════════════
function snapV(v){return S.snapOn?Math.round(v/SNAP_SIZE)*SNAP_SIZE:v;}

// ═══════════════════════════════════════════════════
// RENDER ELEMENTS
// ═══════════════════════════════════════════════════
function rEl(el){if(el.kind==='shape')rShape(el);else if(el.kind==='text')rTxt(el);else if(el.kind==='emoji')rEmoji(el);}

function rShape(el){
  let d=document.getElementById('el-'+el.id);
  if(!d){
    d=document.createElement('div');d.id='el-'+el.id;
    document.getElementById('ca').appendChild(d);
    mkDrag(d,el);
    // Click to cycle color
    d.addEventListener('click',e=>{
      e.stopPropagation();
      if(el.locked)return;
      // Only cycle if not dragging (check by data attr)
      if(d.dataset.dragging==='1')return;
      el.clickCount=(el.clickCount||0)+1;
      el.color=SCOLS[el.clickCount%SCOLS.length];
      selEl(el.id);rEl(el);
    });
  }
  if(el.hidden){d.style.display='none';return;}
  const W=el.w||70,H=el.h||70;
  d.style.cssText=`position:absolute;left:${el.x}px;top:${el.y}px;width:${W}px;height:${H}px;z-index:${el.zIndex};opacity:${el.opacity};color:${el.color};transform:rotate(${el.rotation||0}deg);cursor:grab;user-select:none`;
  d.className='cel'+(el.id===S.selId?' sel':'')+(el.floating?' flo':'')+(el.glowing?' glo':'');
  const ns='http://www.w3.org/2000/svg';
  const sv=document.createElementNS(ns,'svg');
  sv.setAttribute('width',W);sv.setAttribute('height',H);sv.style.display='block';
  const bw=el.borderWidth||0,bc=el.borderColor||'transparent';
  function mk(tag,attrs){
    const e=document.createElementNS(ns,tag);
    Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));
    e.setAttribute('fill',el.color);
    if(bw>0){e.setAttribute('stroke',bc);e.setAttribute('stroke-width',bw*2);}
    return e;
  }
  if(el.type==='square'||el.type==='rect') sv.appendChild(mk('rect',{x:'4',y:'4',width:W-8,height:H-8,rx:'4'}));
  else if(el.type==='circle') sv.appendChild(mk('ellipse',{cx:W/2,cy:H/2,rx:W/2-4,ry:H/2-4}));
  else if(el.type==='triangle') sv.appendChild(mk('polygon',{points:`${W/2},4 ${W-4},${H-4} 4,${H-4}`}));
  else if(el.type==='star') sv.appendChild(mk('polygon',{points:starPts(W/2,H/2,5,W/2-4,W/5)}));
  else if(el.type==='diamond') sv.appendChild(mk('polygon',{points:`${W/2},4 ${W-4},${H/2} ${W/2},${H-4} 4,${H/2}`}));
  else if(el.type==='pentagon') sv.appendChild(mk('polygon',{points:regPoly(W/2,H/2,W/2-4,5)}));
  else if(el.type==='hexagon') sv.appendChild(mk('polygon',{points:regPoly(W/2,H/2,W/2-4,6)}));
  else if(el.type==='arrow') sv.appendChild(mk('polygon',{points:`4,${H*.35} ${W*.65},${H*.35} ${W*.65},4 ${W-4},${H/2} ${W*.65},${H-4} ${W*.65},${H*.65} 4,${H*.65}`}));
  else if(el.type==='heart'){
    const p=document.createElementNS(ns,'path');
    p.setAttribute('d',`M${W/2},${H*.85} C${W/2},${H*.85} 4,${H*.58} 4,${H*.32} C4,${H*.14} ${W*.2},4 ${W*.35},${H*.14} C${W*.43},${H*.2} ${W*.48},${H*.28} ${W/2},${H*.34} C${W*.52},${H*.28} ${W*.57},${H*.2} ${W*.65},${H*.14} C${W*.8},4 ${W-4},${H*.14} ${W-4},${H*.32} C${W-4},${H*.58} ${W/2},${H*.85} ${W/2},${H*.85} Z`);
    p.setAttribute('fill',el.color);if(bw>0){p.setAttribute('stroke',bc);p.setAttribute('stroke-width',bw*2);}sv.appendChild(p);
  }
  d.innerHTML='';d.appendChild(sv);
  addRH(d,el);addROH(d,el);addDH(d,el);
}

function starPts(cx,cy,n,or,ir){let r=(Math.PI/2)*3,s=Math.PI/n,p='';for(let i=0;i<n;i++){p+=`${cx+Math.cos(r)*or},${cy+Math.sin(r)*or} `;r+=s;p+=`${cx+Math.cos(r)*ir},${cy+Math.sin(r)*ir} `;r+=s;}return p.trim();}
function regPoly(cx,cy,r,n){let p=[];for(let i=0;i<n;i++){const a=(i*2*Math.PI/n)-Math.PI/2;p.push(`${cx+r*Math.cos(a)},${cy+r*Math.sin(a)}`);}return p.join(' ');}

function rTxt(el){
  let d=document.getElementById('el-'+el.id);
  if(!d){
    d=document.createElement('div');d.id='el-'+el.id;
    document.getElementById('ca').appendChild(d);
    mkDrag(d,el);
    d.addEventListener('dblclick',e=>{e.stopPropagation();if(!el.locked)startEdit(d,el);});
    d.addEventListener('click',e=>{e.stopPropagation();if(!el.locked)selEl(el.id);});
  }
  if(el.hidden){d.style.display='none';return;}
  const st=el.strokeWidth||0;
  d.style.cssText=`position:absolute;left:${el.x}px;top:${el.y}px;z-index:${el.zIndex};opacity:${el.opacity};font-family:${el.font};font-size:${el.size}px;color:${el.color};font-weight:${el.bold?'bold':'normal'};font-style:${el.italic?'italic':'normal'};letter-spacing:${el.spacing||0}px;text-align:${el.align||'left'};-webkit-text-stroke:${st>0?st+'px '+el.strokeColor:''};text-shadow:${el.shadow?'2px 3px 8px '+(el.shadowColor||'#000'):''};cursor:grab;min-width:20px;max-width:480px;white-space:pre-wrap;line-height:1.3;transform:rotate(${el.rotation||0}deg);user-select:none;pointer-events:all`;
  d.className='ctel'+(el.id===S.selId?' sel':'')+(el.floating?' flo':'')+(el.glowing?' glo':'');
  if(d.contentEditable!=='true') d.textContent=el.text;
  addRH(d,el,true);addROH(d,el);addDH(d,el);
}

function rEmoji(el){
  let d=document.getElementById('el-'+el.id);
  if(!d){
    d=document.createElement('div');d.id='el-'+el.id;
    document.getElementById('ca').appendChild(d);
    mkDrag(d,el);
    d.addEventListener('click',e=>{e.stopPropagation();if(!el.locked)selEl(el.id);});
  }
  if(el.hidden){d.style.display='none';return;}
  d.style.cssText=`position:absolute;left:${el.x}px;top:${el.y}px;z-index:${el.zIndex};opacity:${el.opacity};font-size:${el.size||48}px;line-height:1;cursor:grab;user-select:none;transform:rotate(${el.rotation||0}deg);pointer-events:all`;
  d.className='ceil'+(el.id===S.selId?' sel':'')+(el.floating?' flo':'')+(el.glowing?' glo':'');
  d.textContent=el.emoji;
  addRH(d,el,true);addROH(d,el);addDH(d,el);
}

// ─── HANDLES ───────────────────────────────────────
function addRH(d,el,isTxt){
  // Remove existing and re-add to ensure fresh
  const old=d.querySelector('.rh');if(old)old.remove();
  const h=document.createElement('div');h.className='rh';
  d.appendChild(h);
  let dn=false,sx,sy,sw,sh;
  h.addEventListener('mousedown',e=>{
    e.stopPropagation();e.preventDefault();dn=true;sx=e.clientX;sy=e.clientY;
    sw=isTxt?(el.size||32):(el.w||70);sh=el.h||70;
    const mm=ev=>{
      if(!dn)return;
      const dx=ev.clientX-sx,dy=ev.clientY-sy;
      if(isTxt||el.kind==='emoji'){el.size=Math.max(8,Math.round(sw+(dx+dy)/2));}
      else{el.w=Math.max(20,Math.round(sw+dx));el.h=Math.max(20,Math.round(sh+dy));}
      rEl(el);updSPP();
    };
    const mu=()=>{dn=false;document.removeEventListener('mousemove',mm);document.removeEventListener('mouseup',mu);saveL();};
    document.addEventListener('mousemove',mm);document.addEventListener('mouseup',mu);
  });
}

function addROH(d,el){
  const old=d.querySelector('.roh');if(old)old.remove();
  const h=document.createElement('div');h.className='roh';
  d.appendChild(h);
  let dn=false,sa;
  h.addEventListener('mousedown',e=>{
    e.stopPropagation();e.preventDefault();dn=true;
    const r=d.getBoundingClientRect();
    sa=Math.atan2(e.clientY-(r.top+r.height/2),e.clientX-(r.left+r.width/2))*180/Math.PI-(el.rotation||0);
    const mm=ev=>{
      if(!dn)return;
      const r2=d.getBoundingClientRect();
      let angle=Math.round(Math.atan2(ev.clientY-(r2.top+r2.height/2),ev.clientX-(r2.left+r2.width/2))*180/Math.PI-sa);
      // Snap rotation to 15° increments when snap enabled
      if(S.snapOn) angle=Math.round(angle/15)*15;
      el.rotation=angle;
      rEl(el);
    };
    const mu=()=>{dn=false;document.removeEventListener('mousemove',mm);document.removeEventListener('mouseup',mu);saveL();};
    document.addEventListener('mousemove',mm);document.addEventListener('mouseup',mu);
  });
}

// DELETE HANDLE — red X on top-left of selected element
function addDH(d,el){
  const old=d.querySelector('.dh');if(old)old.remove();
  const h=document.createElement('div');h.className='dh';h.textContent='✕';h.title='Delete';
  d.appendChild(h);
  h.addEventListener('mousedown',e=>{e.stopPropagation();e.preventDefault();});
  h.addEventListener('click',e=>{
    e.stopPropagation();e.preventDefault();
    // Force select then delete
    S.selId=el.id;
    delSel();
  });
}

// ═══════════════════════════════════════════════════
// DRAG — with SNAP support
// ═══════════════════════════════════════════════════
function mkDrag(d,el){
  let dn=false,ox=0,oy=0,moved=false;
  d.addEventListener('mousedown',e=>{
    if(el.locked||d.contentEditable==='true'||e.detail>1)return;
    if(e.target.classList.contains('rh')||e.target.classList.contains('roh')||e.target.classList.contains('dh'))return;
    dn=true;moved=false;
    ox=e.clientX-el.x;oy=e.clientY-el.y;
    d.style.cursor='grabbing';
    d.dataset.dragging='0';
    selEl(el.id);e.preventDefault();
  });
  document.addEventListener('mousemove',e=>{
    if(!dn)return;
    moved=true;
    d.dataset.dragging='1';
    let nx=e.clientX-ox,ny=e.clientY-oy;
    // SNAP TO GRID when snap is enabled
    if(S.snapOn){
      nx=Math.round(nx/SNAP_SIZE)*SNAP_SIZE;
      ny=Math.round(ny/SNAP_SIZE)*SNAP_SIZE;
    }
    el.x=nx;el.y=ny;
    d.style.left=nx+'px';d.style.top=ny+'px';
    updCB();
  });
  document.addEventListener('mouseup',()=>{
    if(dn){
      dn=false;d.style.cursor='grab';
      setTimeout(()=>{d.dataset.dragging='0';},50);
      saveL();
    }
  });
}

// ═══════════════════════════════════════════════════
// SELECTION & CONTEXT BAR
// ═══════════════════════════════════════════════════
function selEl(id){
  S.selId=id;
  S.els.forEach(el=>{
    const d=document.getElementById('el-'+el.id);if(!d)return;
    const s=el.id===id,f=el.floating?' flo':'',g=el.glowing?' glo':'';
    if(el.kind==='text')d.className='ctel'+(s?' sel':'')+f+g;
    else if(el.kind==='emoji')d.className='ceil'+(s?' sel':'')+f+g;
    else d.className='cel'+(s?' sel':'')+f+g;
  });
  updLL();updCB();updSPP();
}

function updCB(){
  const bar=document.getElementById('ecb');
  if(!S.selId){bar.classList.remove('show');return;}
  const el=S.els.find(e=>e.id===S.selId);if(!el){bar.classList.remove('show');return;}
  const d=document.getElementById('el-'+el.id);if(!d)return;
  const dr=d.getBoundingClientRect(),cr=document.getElementById('center').getBoundingClientRect();
  bar.style.left=(dr.left-cr.left)+'px';
  bar.style.top=Math.max(0,dr.top-cr.top-46)+'px';
  bar.classList.add('show');
  // Show edit button only for text
  document.getElementById('editcb').style.display=el.kind==='text'?'':'none';
}

function updSPP(){
  const p=document.getElementById('spp');
  if(!S.selId){p.innerHTML='<div style="text-align:center;color:var(--txt3);font-size:.7rem;padding:7px">Select an element to edit</div>';return;}
  const el=S.els.find(e=>e.id===S.selId);if(!el)return;
  if(el.kind==='text'){
    p.innerHTML=`
      <label class="fl">Color</label><input type="color" value="${el.color}" oninput="updSel('color',this.value)"/>
      <label class="fl">Size <span id="sp-sz">${el.size}px</span></label>
      <input type="range" min="8" max="140" value="${el.size}" oninput="document.getElementById('sp-sz').textContent=this.value+'px';updSel('size',+this.value)"/>
      <label class="fl">Rotation <span id="sp-rt">${el.rotation||0}°</span></label>
      <input type="range" min="-180" max="180" value="${el.rotation||0}" oninput="document.getElementById('sp-rt').textContent=this.value+'°';updSel('rotation',+this.value)"/>
      <label class="fl">Opacity <span id="sp-op">${Math.round(el.opacity*100)}%</span></label>
      <input type="range" min="10" max="100" value="${Math.round(el.opacity*100)}" oninput="document.getElementById('sp-op').textContent=this.value+'%';updSel('opacity',this.value/100)"/>
      <div class="bg2">
        <button class="btn bs bsm" onclick="editSelTxt()">✎ Edit Text</button>
        <button class="btn bd bsm" onclick="delSel()">🗑 Delete</button>
      </div>`;
  } else if(el.kind==='emoji'){
    p.innerHTML=`
      <div style="text-align:center;font-size:2.6rem;padding:4px">${el.emoji}</div>
      <label class="fl">Size <span id="sp-es">${el.size}px</span></label>
      <input type="range" min="20" max="150" value="${el.size}" oninput="document.getElementById('sp-es').textContent=this.value+'px';updSel('size',+this.value)"/>
      <label class="fl">Rotation <span id="sp-er">${el.rotation||0}°</span></label>
      <input type="range" min="-180" max="180" value="${el.rotation||0}" oninput="document.getElementById('sp-er').textContent=this.value+'°';updSel('rotation',+this.value)"/>
      <label class="fl">Opacity <span id="sp-eo">${Math.round(el.opacity*100)}%</span></label>
      <input type="range" min="10" max="100" value="${Math.round(el.opacity*100)}" oninput="document.getElementById('sp-eo').textContent=this.value+'%';updSel('opacity',this.value/100)"/>
      <button class="btn bd bsm" onclick="delSel()">🗑 Delete</button>`;
  } else {
    p.innerHTML=`
      <label class="fl">Fill Color</label><input type="color" value="${el.color}" oninput="updSel('color',this.value)"/>
      <label class="fl">Opacity <span id="sp-so">${Math.round(el.opacity*100)}%</span></label>
      <input type="range" min="10" max="100" value="${Math.round(el.opacity*100)}" oninput="document.getElementById('sp-so').textContent=this.value+'%';updSel('opacity',this.value/100)"/>
      <label class="fl">Rotation <span id="sp-sr">${el.rotation||0}°</span></label>
      <input type="range" min="-180" max="180" value="${el.rotation||0}" oninput="document.getElementById('sp-sr').textContent=this.value+'°';updSel('rotation',+this.value)"/>
      <button class="btn bd bsm" onclick="delSel()">🗑 Delete</button>`;
  }
}

function updSel(prop,val){
  const el=S.els.find(e=>e.id===S.selId);if(!el)return;
  el[prop]=val;rEl(el);saveL();
}

// ═══════════════════════════════════════════════════
// DELETE — FIXED: works even without context bar click
// ═══════════════════════════════════════════════════
function delSel(){
  if(!S.selId){
    // Flash all elements to hint user to click one
    notif('👆 Click any element on canvas first, then delete');
    // Wiggle all elements as visual hint
    S.els.forEach(el=>{
      const d=document.getElementById('el-'+el.id);
      if(!d)return;
      d.style.transition='outline .15s';
      d.style.outline='2px solid #ff7070';
      d.style.outlineOffset='4px';
      setTimeout(()=>{d.style.outline='';d.style.outlineOffset='';},800);
    });
    // Also flash the bottom delete button red
    const btn=document.getElementById('del-bottom-btn');
    if(btn){btn.style.background='rgba(255,60,60,.35)';setTimeout(()=>btn.style.background='',600);}
    return;
  }
  saveHist();
  const d=document.getElementById('el-'+S.selId);
  if(d)d.remove();
  S.els=S.els.filter(e=>e.id!==S.selId);
  S.selId=null;
  document.getElementById('ecb').classList.remove('show');
  updLL();updSPP();notif('🗑 Deleted');saveL();
}

function clearAll(){
  if(!confirm('Clear all canvas elements?'))return;
  saveHist();
  S.els.forEach(e=>{const d=document.getElementById('el-'+e.id);if(d)d.remove();});
  S.els=[];S.selId=null;
  document.getElementById('ecb').classList.remove('show');
  updLL();updSPP();notif('Canvas cleared');saveL();
}

function dupSel(){
  if(!S.selId){notif('⚠ Select an element first');return;}
  saveHist();
  const o=S.els.find(e=>e.id===S.selId);if(!o)return;
  const c=JSON.parse(JSON.stringify(o));
  c.id=++eid;c.x+=24;c.y+=24;c.zIndex+=1;
  S.els.push(c);rEl(c);selEl(c.id);updLL();saveL();notif('⧉ Duplicated ✓');
}

function togSelFlo(){if(!S.selId){notif('Select element first');return;}const el=S.els.find(e=>e.id===S.selId);if(!el)return;el.floating=!el.floating;rEl(el);saveL();notif(el.floating?'⟳ Float ON':'Float OFF');}
function togSelGlo(){if(!S.selId){notif('Select element first');return;}const el=S.els.find(e=>e.id===S.selId);if(!el)return;el.glowing=!el.glowing;rEl(el);saveL();notif(el.glowing?'✦ Glow ON':'Glow OFF');}

// Deselect on background click
document.getElementById('ca').addEventListener('click',e=>{
  const ids=['ca','df','fi','ph'];
  if(ids.includes(e.target.id)||e.target.closest('#ph')){
    S.selId=null;
    S.els.forEach(el=>{const d=document.getElementById('el-'+el.id);if(!d)return;const f=el.floating?' flo':'',g=el.glowing?' glo':'';if(el.kind==='text')d.className='ctel'+f+g;else if(el.kind==='emoji')d.className='ceil'+f+g;else d.className='cel'+f+g;});
    document.getElementById('ecb').classList.remove('show');
    updLL();updSPP();
  }
});

// ═══════════════════════════════════════════════════
// LAYERS
// ═══════════════════════════════════════════════════
function updLL(){
  const list=document.getElementById('ll');list.innerHTML='';
  const imgi=document.createElement('div');imgi.className='li';
  imgi.innerHTML=`<span style="color:var(--txt3);font-size:.7rem">⠿</span><span class="ln">🖼 Image Layer</span><div class="las"><button class="lab" onclick="togImgVis(this)" title="Toggle visibility">👁</button></div>`;
  list.appendChild(imgi);
  const icons={square:'■',rect:'▬',circle:'●',triangle:'▲',star:'★',diamond:'◆',pentagon:'⬠',hexagon:'⬡',arrow:'➤',heart:'♥'};
  [...S.els].reverse().forEach(el=>{
    const item=document.createElement('div');
    item.className='li'+(el.id===S.selId?' sl':'');
    const icon=el.kind==='text'?'✎':el.kind==='emoji'?el.emoji:(icons[el.type]||'◆');
    const nameRaw=el.kind==='text'?el.text.substring(0,10).replace(/\n/g,' '):el.kind==='emoji'?'emoji':el.type;
    const name=el.kind==='text'?`"${nameRaw}${el.text.length>10?'…':''}"`:`${nameRaw} #${el.id}`;
    item.innerHTML=`<span style="color:var(--txt3);font-size:.7rem">⠿</span><span class="ln">${icon} ${name}</span><div class="las"><button class="lab" title="Toggle visibility" onclick="event.stopPropagation();togEV(${el.id})">👁</button><button class="lab" title="Lock/Unlock" onclick="event.stopPropagation();togEL(${el.id})">🔒</button><button class="lab" style="color:#ff7070" title="Delete" onclick="event.stopPropagation();delE(${el.id})">✕</button></div>`;
    item.addEventListener('click',()=>selEl(el.id));
    list.appendChild(item);
  });
  if(!S.els.length){const e=document.createElement('div');e.style.cssText='text-align:center;color:var(--txt3);font-size:.7rem;padding:9px';e.textContent='No elements yet';list.appendChild(e);}
}

function togImgVis(b){const img=document.getElementById('fi');const h=img.style.visibility==='hidden';img.style.visibility=h?'visible':'hidden';b.style.opacity=h?'1':'.4';}
function togEV(id){const el=S.els.find(e=>e.id===id);if(!el)return;el.hidden=!el.hidden;rEl(el);updLL();}
function togEL(id){const el=S.els.find(e=>e.id===id);if(!el)return;el.locked=!el.locked;updLL();notif(el.locked?'🔒 Layer locked':'🔓 Layer unlocked');}
function delE(id){
  saveHist();
  const d=document.getElementById('el-'+id);if(d)d.remove();
  S.els=S.els.filter(e=>e.id!==id);
  if(S.selId===id){S.selId=null;document.getElementById('ecb').classList.remove('show');}
  updLL();updSPP();notif('🗑 Deleted');saveL();
}
function fwd(){if(!S.selId)return;const el=S.els.find(e=>e.id===S.selId);if(el){el.zIndex+=1;rEl(el);updLL();}}
function bwd(){if(!S.selId)return;const el=S.els.find(e=>e.id===S.selId);if(el){el.zIndex=Math.max(1,el.zIndex-1);rEl(el);updLL();}}

// ═══════════════════════════════════════════════════
// INLINE TEXT EDIT
// ═══════════════════════════════════════════════════
function startEdit(d,el){
  d.classList.add('edt');d.contentEditable='true';d.style.cursor='text';d.focus();
  const rng=document.createRange();rng.selectNodeContents(d);const sel=window.getSelection();sel.removeAllRanges();sel.addRange(rng);
  const fin=()=>{
    d.contentEditable='false';d.classList.remove('edt');d.style.cursor='grab';
    el.text=d.textContent||el.text;rTxt(el);saveL();notif('✓ Text updated');
  };
  d.addEventListener('blur',fin,{once:true});
  d.addEventListener('keydown',e=>{
    if(e.key==='Escape')d.blur();
    if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();d.blur();}
    e.stopPropagation();
  });
}
function editSelTxt(){
  if(!S.selId)return;
  const el=S.els.find(e=>e.id===S.selId&&e.kind==='text');
  if(!el){notif('Select a text element first');return;}
  const d=document.getElementById('el-'+el.id);
  if(d)startEdit(d,el);
}

// ═══════════════════════════════════════════════════
// SHAPE CONTROLS
// ═══════════════════════════════════════════════════
function updSop(v){
  document.getElementById('sopv').textContent=v+'%';
  if(S.selId){const el=S.els.find(e=>e.id===S.selId&&e.kind==='shape');if(el){el.opacity=v/100;rEl(el);saveL();}}
}
function togAnim(t){
  if(!S.selId){notif('Select an element first');return;}
  const el=S.els.find(e=>e.id===S.selId);if(!el)return;
  if(t==='float')el.floating=!el.floating;
  if(t==='glow')el.glowing=!el.glowing;
  rEl(el);saveL();notif(t==='float'?(el.floating?'⟳ Float ON':'Float OFF'):(el.glowing?'✦ Glow ON':'Glow OFF'));
}
function floAll(){S.floAll=!S.floAll;S.els.forEach(el=>{el.floating=S.floAll;rEl(el);});document.getElementById('flobtn').style.borderColor=S.floAll?'var(--acc)':'';notif(S.floAll?'⟳ Float All ON':'Float All OFF');}
function gloAll(){S.gloAll=!S.gloAll;S.els.forEach(el=>{el.glowing=S.gloAll;rEl(el);});document.getElementById('gloBtn').style.borderColor=S.gloAll?'var(--acc)':'';notif(S.gloAll?'✦ Glow All ON':'Glow All OFF');}

// ═══════════════════════════════════════════════════
// FRAME
// ═══════════════════════════════════════════════════
function posFrame(){
  const c=document.getElementById('center'),f=document.getElementById('df');
  const sz=parseInt(document.getElementById('fsz').value);
  const w=Math.min(sz,c.clientWidth-36),h=Math.min(Math.round(sz*.75),c.clientHeight-72);
  f.style.width=w+'px';f.style.height=h+'px';
  f.style.left=Math.round((c.clientWidth-w)/2)+'px';f.style.top=Math.round((c.clientHeight-h)/2)+'px';
}
function updFrame(){
  const f=document.getElementById('df');
  const rn=document.getElementById('frn').value,bw=document.getElementById('fbw').value,sh=document.getElementById('fsh').value;
  const bg=document.getElementById('fbg').value,bc=document.getElementById('fbc').value;
  const gc=document.getElementById('gcol').value,gs=document.getElementById('gsz').value;
  document.getElementById('rnv').textContent=rn+'px';
  document.getElementById('bwv').textContent=bw+'px';
  document.getElementById('shv').textContent=sh;
  document.getElementById('gsv').textContent=gs;
  f.style.borderRadius=rn+'px';f.style.borderWidth=bw+'px';f.style.borderStyle='solid';f.style.borderColor=bc;
  f.style.background=S.fBgGrad||bg;
  f.style.boxShadow=`0 ${Math.round(sh*.3)}px ${Math.round(sh*.8)}px rgba(0,0,0,${(sh/100).toFixed(2)}),0 0 ${gs}px rgba(${h2r(gc)},${gs>0?.5:0})`;
  saveL();
}
function updFSz(){document.getElementById('fsv').textContent=document.getElementById('fsz').value;posFrame();}
function applyGrad(el,c1,c2){document.querySelectorAll('.gb').forEach(b=>b.classList.remove('on'));el.classList.add('on');S.fBgGrad=`linear-gradient(135deg,${c1},${c2})`;updFrame();}
function resetFrame(){
  [['frn',16],['fbw',3],['fsh',40],['fsz',500]].forEach(([id,v])=>document.getElementById(id).value=v);
  document.getElementById('fbg').value='#1a1a25';document.getElementById('fbc').value='#ffffff';
  S.fBgGrad='linear-gradient(135deg,#1a1a25,#2a2a3a)';
  S.iZoom=1;S.iRot=0;S.iOX=0;S.iOY=0;S.iFH=false;S.iFV=false;
  updFrame();updFSz();updIT();resetIF();notif('Frame reset ✓');
}

// ═══════════════════════════════════════════════════
// IMAGE FILTERS & TRANSFORM
// ═══════════════════════════════════════════════════
const FCSS={'none':'','cartoon':'saturate(2) contrast(1.5) brightness(1.1)','anime':'saturate(1.8) contrast(1.3) hue-rotate(10deg)','cyberpunk':'saturate(3) hue-rotate(200deg) contrast(1.4) brightness(1.2)','vintage':'sepia(.6) contrast(1.1) brightness(.9) saturate(.8)','watercolor':'saturate(1.5) blur(.5px) opacity(.9) brightness(1.1)','noir':'grayscale(1) contrast(1.5) brightness(.8)','golden':'sepia(.4) saturate(1.5) brightness(1.1) hue-rotate(-10deg)'};

function applyF(b,f){document.querySelectorAll('.fb').forEach(x=>x.classList.remove('on'));b.classList.add('on');S.curFil=f;updIF();}
function updIF(){
  const img=document.getElementById('fi');
  const bl=document.getElementById('ibl').value,br=document.getElementById('ibr').value;
  const co=document.getElementById('ico').value,sa=document.getElementById('isa').value,hu=document.getElementById('ihu').value;
  document.getElementById('blv').textContent=bl+'px';
  document.getElementById('brv').textContent=br+'%';
  document.getElementById('cov').textContent=co+'%';
  document.getElementById('sav').textContent=sa+'%';
  document.getElementById('huv').textContent=hu+'°';
  img.style.filter=[`blur(${bl}px) brightness(${br}%) contrast(${co}%) saturate(${sa}%) hue-rotate(${hu}deg)`,FCSS[S.curFil]].filter(Boolean).join(' ');
}
function resetIF(){
  [['ibl',0],['ibr',100],['ico',100],['isa',100],['ihu',0]].forEach(([id,v])=>document.getElementById(id).value=v);
  S.curFil='none';document.querySelectorAll('.fb').forEach(b=>b.classList.remove('on'));
  document.querySelector('.fb[onclick*="\'none\'"]')?.classList.add('on');
  updIF();notif('Filters reset ✓');
}
function updIT(){
  const img=document.getElementById('fi');
  const sx=S.iFH?-1:1,sy=S.iFV?-1:1;
  img.style.transform=`scale(${S.iZoom*sx},${S.iZoom*sy}) rotate(${S.iRot}deg) translate(${S.iOX}px,${S.iOY}px)`;
  document.getElementById('zbdg').textContent=Math.round(S.iZoom*100)+'%';
}
function zoom(d){S.iZoom=Math.max(.2,Math.min(5,S.iZoom+d));updIT();notif(`Zoom: ${Math.round(S.iZoom*100)}%`);}
function rotImg(d){S.iRot+=d;updIT();}
function flipImg(a){if(a==='h')S.iFH=!S.iFH;else S.iFV=!S.iFV;updIT();notif(a==='h'?'Flipped horizontal':'Flipped vertical');}

let iD=false,iDS={x:0,y:0};
document.getElementById('fi').addEventListener('mousedown',e=>{if(!S.dragMode)return;iD=true;iDS={x:e.clientX-S.iOX,y:e.clientY-S.iOY};e.preventDefault();});
document.addEventListener('mousemove',e=>{if(!iD)return;S.iOX=e.clientX-iDS.x;S.iOY=e.clientY-iDS.y;updIT();});
document.addEventListener('mouseup',()=>{iD=false;});
function togDrag(){
  S.dragMode=!S.dragMode;
  const b=document.getElementById('dragbtn');
  b.style.borderColor=S.dragMode?'var(--acc)':'';
  b.style.color=S.dragMode?'var(--acc)':'';
  document.getElementById('fi').style.cursor=S.dragMode?'grab':'default';
  notif(S.dragMode?'↔ Image drag mode ON (click image to drag)':'Image drag mode OFF');
}

// ═══════════════════════════════════════════════════
// GRID / SNAP / THEME — FIXED toggle functions
// ═══════════════════════════════════════════════════
function toggleGrid(){
  S.gridOn=!S.gridOn;
  document.getElementById('center').classList.toggle('goff',!S.gridOn);
  document.getElementById('grid-btn').classList.toggle('on',S.gridOn);
  notif(S.gridOn?'⊞ Grid ON':'Grid OFF');
}

function toggleSnap(){
  S.snapOn=!S.snapOn;
  document.getElementById('snap-btn').classList.toggle('on',S.snapOn);
  document.getElementById('snap-ind').classList.toggle('show',S.snapOn);
  notif(S.snapOn?`⊹ Snap ON (${SNAP_SIZE}px grid) — elements snap to grid when dragged`:'Snap OFF');
  saveL();
}

function toggleTheme(){
  const isDark=document.documentElement.dataset.theme==='dark';
  document.documentElement.dataset.theme=isDark?'light':'dark';
  document.getElementById('theme-btn').classList.toggle('on',!isDark);
  notif(isDark?'☀ Light theme':'◐ Dark theme');
  saveL();
}

// ═══════════════════════════════════════════════════
// UNDO / REDO
// ═══════════════════════════════════════════════════
function saveHist(){S.hist.push(JSON.stringify(S.els.map(e=>({...e}))));if(S.hist.length>30)S.hist.shift();S.fut=[];}
function undo(){if(!S.hist.length){notif('Nothing to undo');return;}S.fut.push(JSON.stringify(S.els.map(e=>({...e}))));restEls(JSON.parse(S.hist.pop()));notif('↩ Undone');}
function redo(){if(!S.fut.length){notif('Nothing to redo');return;}S.hist.push(JSON.stringify(S.els.map(e=>({...e}))));restEls(JSON.parse(S.fut.pop()));notif('↪ Redone');}
function restEls(data){
  S.els.forEach(e=>{const d=document.getElementById('el-'+e.id);if(d)d.remove();});
  S.els=data;S.els.forEach(e=>{if(e.id>=eid)eid=e.id+1;rEl(e);});
  updLL();notif('State restored');
}

// ═══════════════════════════════════════════════════
// SAVE / LOAD
// ═══════════════════════════════════════════════════
function saveProj(){
  saveL();
  const b=document.getElementById('save-btn');
  b.classList.add('ok');b.textContent='✓ Saved!';
  setTimeout(()=>{b.classList.remove('ok');b.textContent='💾 Save';},2000);
  notif('✓ Project saved!');
}
function saveL(){
  try{
    localStorage.setItem('visio_v6',JSON.stringify({
      els:S.els,theme:document.documentElement.dataset.theme,
      fBgGrad:S.fBgGrad,iZoom:S.iZoom,iRot:S.iRot,iOX:S.iOX,iOY:S.iOY,iFH:S.iFH,iFV:S.iFV,
      imgSrc:S.imgSrc,curFil:S.curFil,snapOn:S.snapOn,
      frn:document.getElementById('frn').value,fbw:document.getElementById('fbw').value,
      fsh:document.getElementById('fsh').value,fsz:document.getElementById('fsz').value,
      fbg:document.getElementById('fbg').value,fbc:document.getElementById('fbc').value,
      ibl:document.getElementById('ibl').value,ibr:document.getElementById('ibr').value,
      ico:document.getElementById('ico').value,isa:document.getElementById('isa').value,ihu:document.getElementById('ihu').value,
    }));
  }catch(e){}
}
function loadL(){
  try{
    const raw=localStorage.getItem('visio_v6');if(!raw)return;
    const d=JSON.parse(raw);
    if(d.theme)document.documentElement.dataset.theme=d.theme;
    if(d.fBgGrad)S.fBgGrad=d.fBgGrad;
    ['iZoom','iRot','iOX','iOY','iFH','iFV','curFil'].forEach(k=>{if(d[k]!==undefined)S[k]=d[k];});
    if(d.snapOn){S.snapOn=true;document.getElementById('snap-btn').classList.add('on');document.getElementById('snap-ind').classList.add('show');}
    const sv=(id,v)=>{if(v!==undefined){const el=document.getElementById(id);if(el)el.value=v;}};
    sv('frn',d.frn);sv('fbw',d.fbw);sv('fsh',d.fsh);sv('fsz',d.fsz);sv('fbg',d.fbg);sv('fbc',d.fbc);
    sv('ibl',d.ibl);sv('ibr',d.ibr);sv('ico',d.ico);sv('isa',d.isa);sv('ihu',d.ihu);
    updFrame();updFSz();updIT();updIF();
    if(d.imgSrc){
      S.imgSrc=d.imgSrc;
      const fi=document.getElementById('fi');
      fi.src=d.imgSrc;fi.style.display='block';
      document.getElementById('ph').style.display='none';
    }
    if(d.els&&d.els.length){
      S.els=d.els;
      S.els.forEach(e=>{if(e.id>=eid)eid=e.id+1;rEl(e);});
      updLL();
    }
    notif('✓ Session restored');
  }catch(e){console.warn('Load err:',e);}
}

// ═══════════════════════════════════════════════════
// EMOJI GRID
// ═══════════════════════════════════════════════════
function rendEG(cat){
  const g=document.getElementById('egr');g.innerHTML='';
  (EC[cat]||[]).forEach(em=>{
    const d=document.createElement('div');d.className='ei';d.textContent=em;d.title='Add '+em;
    d.onclick=()=>addEmoji(em);g.appendChild(d);
  });
}
function swEC(b,cat){document.querySelectorAll('.ecb').forEach(x=>x.classList.remove('on'));b.classList.add('on');rendEG(cat);}

// ═══════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════
function setEQ(s){S.eqScale=s;document.getElementById('e1x').classList.toggle('on',s===1);document.getElementById('e2x').classList.toggle('on',s===2);}
function showEM(){document.getElementById('em').classList.add('show');}
function closeEM(){document.getElementById('em').classList.remove('show');}

async function dlCanvas(fmt){
  notif('Preparing download…');closeEM();
  const fr=document.getElementById('df'),img=document.getElementById('fi');
  const cv=document.getElementById('xc');const sc=S.eqScale||1;
  const r=fr.getBoundingClientRect();
  cv.width=Math.round(r.width*sc);cv.height=Math.round(r.height*sc);
  const ctx=cv.getContext('2d');ctx.scale(sc,sc);
  // BG
  if(S.fBgGrad){
    const m=S.fBgGrad.match(/#[0-9a-f]{6}/gi);
    if(m&&m.length>=2){const g=ctx.createLinearGradient(0,0,r.width,r.height);g.addColorStop(0,m[0]);g.addColorStop(1,m[1]);ctx.fillStyle=g;}
    else ctx.fillStyle='#1a1a25';
  }else{ctx.fillStyle=document.getElementById('fbg').value;}
  ctx.fillRect(0,0,r.width,r.height);
  // Image
  if(img.src&&img.style.display!=='none'&&img.style.visibility!=='hidden'){
    try{
      ctx.save();
      const cx=r.width/2,cy=r.height/2;ctx.translate(cx,cy);ctx.rotate(S.iRot*Math.PI/180);
      const sx=S.iFH?-1:1,sy=S.iFV?-1:1;ctx.scale(S.iZoom*sx,S.iZoom*sy);ctx.translate(-cx+S.iOX,-cy+S.iOY);
      const bl=document.getElementById('ibl').value,br=document.getElementById('ibr').value;
      const co=document.getElementById('ico').value,sa=document.getElementById('isa').value;
      ctx.filter=`blur(${bl}px) brightness(${br}%) contrast(${co}%) saturate(${sa}%) ${FCSS[S.curFil]||''}`.trim();
      ctx.drawImage(img,0,0,r.width,r.height);ctx.restore();
    }catch(e){console.warn('Image draw err:',e);}
  }
  // Elements
  [...S.els].filter(e=>!e.hidden).sort((a,b)=>a.zIndex-b.zIndex).forEach(el=>{
    const d=document.getElementById('el-'+el.id);if(!d)return;
    const dr=d.getBoundingClientRect();const x=dr.left-r.left,y=dr.top-r.top;
    ctx.save();ctx.globalAlpha=el.opacity||1;
    if(el.rotation){
      const ex=x+dr.width/2,ey=y+dr.height/2;
      ctx.translate(ex,ey);ctx.rotate(el.rotation*Math.PI/180);ctx.translate(-ex,-ey);
    }
    if(el.kind==='shape'){
      ctx.fillStyle=el.color;
      if((el.borderWidth||0)>0){ctx.strokeStyle=el.borderColor||'#fff';ctx.lineWidth=el.borderWidth*2;}
      if(el.type==='square'||el.type==='rect'){ctx.fillRect(x+2,y+2,dr.width-4,dr.height-4);if(el.borderWidth>0)ctx.strokeRect(x+2,y+2,dr.width-4,dr.height-4);}
      else if(el.type==='circle'){ctx.beginPath();ctx.arc(x+dr.width/2,y+dr.height/2,Math.min(dr.width,dr.height)/2-3,0,Math.PI*2);ctx.fill();if(el.borderWidth>0)ctx.stroke();}
      else if(el.type==='triangle'){ctx.beginPath();ctx.moveTo(x+dr.width/2,y+3);ctx.lineTo(x+dr.width-3,y+dr.height-3);ctx.lineTo(x+3,y+dr.height-3);ctx.closePath();ctx.fill();}
      else if(el.type==='diamond'){ctx.beginPath();ctx.moveTo(x+dr.width/2,y);ctx.lineTo(x+dr.width,y+dr.height/2);ctx.lineTo(x+dr.width/2,y+dr.height);ctx.lineTo(x,y+dr.height/2);ctx.closePath();ctx.fill();}
      else if(el.type==='heart'){ctx.beginPath();const hx=x+dr.width/2;ctx.moveTo(hx,y+dr.height*.85);ctx.bezierCurveTo(hx,y+dr.height*.85,x,y+dr.height*.58,x,y+dr.height*.32);ctx.bezierCurveTo(x,y+dr.height*.14,x+dr.width*.2,y,x+dr.width*.35,y+dr.height*.14);ctx.bezierCurveTo(x+dr.width*.43,y+dr.height*.2,x+dr.width*.48,y+dr.height*.28,hx,y+dr.height*.34);ctx.bezierCurveTo(x+dr.width*.52,y+dr.height*.28,x+dr.width*.57,y+dr.height*.2,x+dr.width*.65,y+dr.height*.14);ctx.bezierCurveTo(x+dr.width*.8,y,x+dr.width,y+dr.height*.14,x+dr.width,y+dr.height*.32);ctx.bezierCurveTo(x+dr.width,y+dr.height*.58,hx,y+dr.height*.85,hx,y+dr.height*.85);ctx.fill();}
    }else if(el.kind==='text'){
      const fam=el.font.replace(/'/g,'').split(',')[0].trim();
      ctx.font=`${el.italic?'italic ':''} ${el.bold?'bold ':''} ${el.size}px "${fam}"`;
      ctx.fillStyle=el.color;ctx.textAlign=el.align||'left';
      if(el.shadow){ctx.shadowColor=el.shadowColor||'#000';ctx.shadowBlur=8;ctx.shadowOffsetX=2;ctx.shadowOffsetY=3;}
      if((el.strokeWidth||0)>0){ctx.strokeStyle=el.strokeColor;ctx.lineWidth=el.strokeWidth*2;}
      const lines=el.text.split('\n');
      lines.forEach((ln,i)=>{
        const ty=y+el.size+(i*el.size*1.35);
        if(el.strokeWidth>0)ctx.strokeText(ln,x,ty);
        ctx.fillText(ln,x,ty);
      });
    }else if(el.kind==='emoji'){
      ctx.font=`${el.size||48}px serif`;ctx.textAlign='left';ctx.fillText(el.emoji,x,y+el.size);
    }
    ctx.restore();
  });
  const mime=fmt==='jpg'?'image/jpeg':'image/png';
  cv.toBlob(blob=>{
    if(!blob){notif('⚠ Export failed');return;}
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download=`visio-art-${Date.now()}.${fmt}`;a.click();
    URL.revokeObjectURL(url);notif(`✓ Downloaded ${fmt.toUpperCase()}!`);
  },mime,fmt==='jpg'?.92:1);
}

async function cpClip(){
  closeEM();
  try{
    await dlCanvas('png');
    const cv=document.getElementById('xc');
    cv.toBlob(async b=>{
      await navigator.clipboard.write([new ClipboardItem({'image/png':b})]);
      notif('✓ Copied to clipboard!');
    });
  }catch(e){notif('⚠ Clipboard: '+e.message);}
}

// ═══════════════════════════════════════════════════
// CONFETTI
// ═══════════════════════════════════════════════════
function confetti(){
  const cols=['#7c6aff','#ff6ab0','#6affd4','#ffd46a','#ff8c6a','#6aadff'];
  for(let i=0;i<65;i++){
    setTimeout(()=>{
      const p=document.createElement('div');p.className='cp';
      p.style.left=Math.random()*100+'vw';
      p.style.background=cols[Math.floor(Math.random()*cols.length)];
      p.style.animationDuration=(1.4+Math.random())+'s';
      p.style.animationDelay=(Math.random()*.4)+'s';
      const s=(5+Math.random()*8)+'px';p.style.width=s;p.style.height=s;
      p.style.borderRadius=Math.random()>.5?'50%':'2px';
      document.body.appendChild(p);setTimeout(()=>p.remove(),3000);
    },i*17);
  }
}


// ═══════════════════════════════════════════════════
// CONTROLS PANEL
// ═══════════════════════════════════════════════════
function toggleCtrl(h){
  const b=document.getElementById('ctrl-body');
  const open=h.classList.contains('open');
  h.classList.toggle('open',!open);
  b.style.display=open?'none':'flex';
}

// Reset — clears image filters, zoom, rotation back to defaults
function resetAll(){
  // Reset image transform
  S.iZoom=1;S.iRot=0;S.iOX=0;S.iOY=0;S.iFH=false;S.iFV=false;
  updIT();
  // Reset all filter sliders
  const ids={ibl:'blv',ibr:'brv',ico:'cov',isa:'sav',ihu:'huv'};
  const vals={ibl:0,ibr:100,ico:100,isa:100,ihu:0};
  const suf={ibl:'px',ibr:'%',ico:'%',isa:'%',ihu:'°'};
  Object.keys(vals).forEach(id=>{
    const el=document.getElementById(id);
    if(el){el.value=vals[id];const lbl=document.getElementById(ids[id]);if(lbl)lbl.textContent=vals[id]+suf[id];}
  });
  S.curFil='none';
  document.querySelectorAll('.fb').forEach(b=>b.classList.toggle('on',b.textContent.trim()==='None'||b.getAttribute('onclick')||''.includes("'none'")));
  resetIF();
  updIF();
  notif('⟳ Reset to defaults');
}

// Clear canvas — removes generated image output only (keeps elements)
function clearCanvas(){
  if(!S.imgSrc && !document.getElementById('fi').src){notif('Nothing to clear');return;}
  if(!confirm('Clear the generated image from canvas?'))return;
  const fi=document.getElementById('fi');
  fi.src='';fi.style.display='none';
  document.getElementById('ph').style.display='flex';
  S.imgSrc=null;
  S.iZoom=1;S.iRot=0;S.iOX=0;S.iOY=0;S.iFH=false;S.iFV=false;
  updIT();updIF();
  notif('🗑 Canvas output cleared');
  setStatus('Canvas cleared — generate a new image!');
  saveL();
}

// ═══════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════
function togglePan(h){
  const b=h.nextElementSibling;const o=h.classList.contains('open');
  h.classList.toggle('open',!o);if(b)b.style.display=o?'none':'flex';
}
function setStatus(m){
  const s=document.getElementById('sb');s.textContent=m;s.style.opacity='1';
  clearTimeout(s._t);s._t=setTimeout(()=>s.style.opacity='0',4000);
}
let nT;
function notif(m){
  const n=document.getElementById('notif');n.textContent=m;n.classList.add('show');
  clearTimeout(nT);nT=setTimeout(()=>n.classList.remove('show'),2800);
}
function h2r(h){return`${parseInt(h.slice(1,3),16)},${parseInt(h.slice(3,5),16)},${parseInt(h.slice(5,7),16)}`;}

// ═══════════════════════════════════════════════════
// KEYBOARD SHORTCUTS
// ═══════════════════════════════════════════════════
document.addEventListener('keydown',e=>{
  const a=document.activeElement;
  if(a&&(a.tagName==='TEXTAREA'||a.tagName==='INPUT'||a.contentEditable==='true'))return;
  const k=e.key.toLowerCase();
  if(e.ctrlKey||e.metaKey){
    if(k==='z'){e.preventDefault();undo();}
    if(k==='y'){e.preventDefault();redo();}
    if(k==='s'){e.preventDefault();saveProj();}
    if(k==='d'){e.preventDefault();dupSel();}
  }else{
    if(k==='delete'||k==='backspace'){e.preventDefault();delSel();}
    if(k==='escape'){
      S.selId=null;
      document.getElementById('ecb').classList.remove('show');
      S.els.forEach(el=>{
        const d=document.getElementById('el-'+el.id);if(!d)return;
        const f=el.floating?' flo':'',g=el.glowing?' glo':'';
        if(el.kind==='text')d.className='ctel'+f+g;
        else if(el.kind==='emoji')d.className='ceil'+f+g;
        else d.className='cel'+f+g;
      });
      updLL();updSPP();
    }
    if(k==='+'||k==='=')zoom(.1);
    if(k==='-')zoom(-.1);
    if(k==='g')toggleGrid();
    if(k==='f')flipImg('h');
    if(k==='s'&&!e.ctrlKey)toggleSnap();
    if(k==='?')notif('Shortcuts: Del=Delete · Ctrl+Z=Undo · Ctrl+D=Dup · +/-=Zoom · G=Grid · S=Snap · F=Flip · Esc=Deselect');
  }
});

// Auto-save every 20 seconds
setInterval(saveL,20000);

// ═══════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════
window.addEventListener('load',()=>{
  posFrame();updFrame();updLL();updPrev();rendEG('smileys');initVoice();loadL();
  // Preload Noto fonts for Indian languages
  ['telugu','hindi','arabic'].forEach(loadFont);
  setStatus('Welcome to VISIO ✦ — Speak Telugu or any language, generate & design!');
  window.addEventListener('resize',posFrame);
});