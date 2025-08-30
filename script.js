// Basic runtime: inline-editable admin & contact submissions
  (function(){
    document.getElementById('year').textContent = new Date().getFullYear();

    // Lightbox
    window.openModal = function(src){
      const lb = document.getElementById('lightbox');
      document.getElementById('lightbox-img').src = src;
      lb.style.display='flex';
    }
    document.getElementById('lightbox').onclick = function(){ this.style.display='none' }

    // Contact form storage
    const form = document.getElementById('contact-form');
    const submissionsKey = 'demo_site_submissions_v1';

    function loadSubs(){
      const raw = localStorage.getItem(submissionsKey) || '[]';
      try{return JSON.parse(raw)}catch(e){return []}
    }
    function saveSubs(arr){ localStorage.setItem(submissionsKey, JSON.stringify(arr)) }

    function renderSubs(){
      const list = loadSubs();
      const el = document.getElementById('submissions-list');
      if(!list.length){ el.innerHTML = '<div class="muted">Koi submission nahin mila.</div>'; return }
      el.innerHTML = '<table style="width:100%;border-collapse:collapse"><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Message</th></tr></thead><tbody>' + list.map(s=>`<tr><td style="padding:6px">${escapeHtml(s.name)}</td><td style="padding:6px">${escapeHtml(s.email)}</td><td style="padding:6px">${escapeHtml(s.phone)}</td><td style="padding:6px">${escapeHtml(s.message)}</td></tr>`).join('') + '</tbody></table>'
    }
    renderSubs();

    form.addEventListener('submit', function(e){
      e.preventDefault();
      const data = {name:document.getElementById('c-name').value.trim(),email:document.getElementById('c-email').value.trim(),phone:document.getElementById('c-phone').value.trim(),message:document.getElementById('c-msg').value.trim(),time:new Date().toISOString()}
      const arr = loadSubs(); arr.unshift(data); saveSubs(arr);
      document.getElementById('form-status').textContent = 'Message saved locally. You can download submissions from Admin.'
      form.reset(); renderSubs();
    })
    document.getElementById('clear-form').addEventListener('click',()=>form.reset())
    document.getElementById('download-csv').addEventListener('click',()=>{
      const arr = loadSubs(); if(!arr.length){alert('No submissions');return}
      const csv = toCSV(arr);
      const blob = new Blob([csv],{type:'text/csv'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href=url; a.download='submissions.csv'; a.click(); URL.revokeObjectURL(url);
    })
    document.getElementById('clear-sub').addEventListener('click',()=>{ if(confirm('Clear all submissions?')){saveSubs([]);renderSubs();}})

    function escapeHtml(t){return (t+'').replace(/[&<>"]/g, function(m){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[m]}) }
    function toCSV(arr){
      const keys=['name','email','phone','message','time'];
      const esc = v => '"'+((v||'').toString().replace(/"/g,'""'))+'"';
      return keys.join(',') + '\n' + arr.map(r=>keys.map(k=>esc(r[k])).join(',')).join('\n');
    }

    // Admin / Edit-in-place
    let editMode=false;
    document.getElementById('edit-mode').addEventListener('click',()=>{
      editMode = !editMode; this.textContent = editMode? 'Save' : 'Edit';
      toggleEditable(editMode);
    })
    function toggleEditable(on){
      const editableEls = ['site-title','site-tag','hero-title','hero-sub','about-text','services-list','owner-name','owner-role','phone-text','email-text','address-text','footer-title','footer-social'];
      editableEls.forEach(id=>{
        const el=document.getElementById(id); if(!el) return; el.contentEditable = on; el.style.outline = on? '2px dashed rgba(0,0,0,.06)':'none';
      })
    }

    // Admin open -> simple password prompt then show small modal (inline prompt implemented as prompt)
    document.getElementById('admin-open').addEventListener('click',()=>{
      const pwd = prompt('Enter admin password to open admin (default: admin123)');
      if(pwd !== 'admin123'){ alert('Wrong password'); return }
      // present actions
      const action = prompt('Admin actions:\n1) Export site JSON\n2) Import site JSON\n3) Clear local submissions\nEnter 1,2 or 3')
      if(action === '1'){
        const siteState = captureSiteState();
        const blob = new Blob([JSON.stringify(siteState, null, 2)],{type:'application/json'});
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'site-content.json'; a.click();
      }else if(action==='2'){
        const raw = prompt('Paste site JSON here to import'); try{ const obj = JSON.parse(raw); applySiteState(obj); alert('Imported') }catch(e){alert('Failed to parse JSON')}
      }else if(action==='3'){
        if(confirm('Clear saved submissions?')){ localStorage.removeItem(submissionsKey); renderSubs(); alert('Cleared') }
      }
    })

    function captureSiteState(){
      return {
        siteTitle:document.getElementById('site-title').textContent,
        siteTag:document.getElementById('site-tag').textContent,
        heroTitle:document.getElementById('hero-title').textContent,
        heroSub:document.getElementById('hero-sub').textContent,
        aboutText:document.getElementById('about-text').textContent,
        services: Array.from(document.querySelectorAll('#services-list li')).map(li=>li.textContent),
        ownerName:document.getElementById('owner-name').textContent,
        ownerRole:document.getElementById('owner-role').textContent,
        phone:document.getElementById('phone-text').textContent,
        email:document.getElementById('email-text').textContent,
        address:document.getElementById('address-text').textContent,
        footerTitle:document.getElementById('footer-title').textContent,
        footerSocial:document.getElementById('footer-social').textContent
      }
    }
    function applySiteState(s){
      if(!s) return;
      if(s.siteTitle) document.getElementById('site-title').textContent = s.siteTitle;
      if(s.siteTag) document.getElementById('site-tag').textContent = s.siteTag;
      if(s.heroTitle) document.getElementById('hero-title').textContent = s.heroTitle;
      if(s.heroSub) document.getElementById('hero-sub').textContent = s.heroSub;
      if(s.aboutText) document.getElementById('about-text').textContent = s.aboutText;
      if(s.services && Array.isArray(s.services)){
        const ul = document.getElementById('services-list'); ul.innerHTML = ''; s.services.forEach(it=>{ const li=document.createElement('li'); li.textContent = it; ul.appendChild(li) })
      }
      if(s.ownerName) document.getElementById('owner-name').textContent = s.ownerName;
      if(s.ownerRole) document.getElementById('owner-role').textContent = s.ownerRole;
      if(s.phone) document.getElementById('phone-text').textContent = s.phone;
      if(s.email) document.getElementById('email-text').textContent = s.email;
      if(s.address) document.getElementById('address-text').textContent = s.address;
      if(s.footerTitle) document.getElementById('footer-title').textContent = s.footerTitle;
      if(s.footerSocial) document.getElementById('footer-social').textContent = s.footerSocial;
    }

  })()