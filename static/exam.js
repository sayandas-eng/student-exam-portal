(() => {
 const cfg=window.EXAM_CONFIG, form=document.getElementById('examform'), timer=document.getElementById('timer');
 let locked=false;
 const sendEvent=(event)=>fetch(`/api/attempt/${cfg.attemptId}/event`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event})}).catch(()=>{});
 const save=async(el)=>{if(locked)return;const qid=el.name.replace('q','');const value=el.type==='radio'?(form.querySelector(`input[name="${el.name}"]:checked`)||{}).value||'':el.value;const badge=document.getElementById('saved'+qid);try{const r=await fetch(`/api/attempt/${cfg.attemptId}/answer`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question_id:Number(qid),answer:value})});if(r.ok&&badge)badge.textContent='Saved';else if(badge)badge.textContent='Not saved';}catch(e){if(badge)badge.textContent='Offline — retrying';}};
 form.querySelectorAll('[name^="q"]').forEach(el=>{el.addEventListener('change',()=>save(el));if(el.tagName==='TEXTAREA'||el.type==='text')el.addEventListener('blur',()=>save(el));});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){sendEvent('tab_hidden');document.getElementById('notice').textContent='You left the examination tab. This activity has been recorded.';}});
 window.addEventListener('blur',()=>sendEvent('window_blur'));
 document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement)sendEvent('fullscreen_exited');});
 // Best-effort finalization if the student closes, reloads, or navigates away.
 let leaving=false;
 const submitOnExit=()=>{if(leaving||locked)return;leaving=true;try{navigator.sendBeacon(`/api/attempt/${cfg.attemptId}/leave`,new Blob([], {type:'application/octet-stream'}));}catch(e){sendEvent('page_exit_submission_attempted');}};
 window.addEventListener('pagehide',submitOnExit);
 window.addEventListener('beforeunload',()=>{if(!leaving&&!locked)submitOnExit();});
 const tick=()=>{const now=Date.now(), d=Date.parse(cfg.deadline), rd=Date.parse(cfg.reviewDeadline);let remain=d-now;let label='Answering time';if(remain<=0){remain=rd-now;label='Review time';}if(remain<=0){timer.textContent='00:00';locked=true;form.requestSubmit();return;}timer.textContent=label+' · '+String(Math.floor(remain/60000)).padStart(2,'0')+':'+String(Math.floor(remain%60000/1000)).padStart(2,'0');};
 tick();setInterval(tick,1000);
 form.addEventListener('submit',()=>{locked=true;});
})();
