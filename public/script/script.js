const icone = { 
    hidden : 'menu',
    shown : 'menu_open',
    sincronizzazione : 'sync',
    sinc_ko : 'sync_problem',
    sinc_ok : 'done',
    ok : 'check_circle',
    ko : 'error',
    visualizza : 'edit_off',
    modifica : 'edit',
    coordinatore : 'engineering',
    docente : 'person',
    esterno : 'person_off',
    staff : 'admin_panel_settings',
    consegnato : 'archive',
    cartella : 'folder',
    file : 'insert_drive_file',
    presenza : 'groups',
    dad : 'phonelink',
    mista : 'person_remove',
    asincrona : 'access_time',
    'non assegnato' : 'report_problem'
}

// ----------- Google sign-in -------------
function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    var auth = googleUser.getAuthResponse(true);
    if (profile) {
        var img = document.querySelector('.userBlock img');
        if (img && profile.getImageUrl()) { 
            img.setAttribute('src',profile.getImageUrl());
            img.style.display = 'block';
            document.querySelector('.userBlock .image .material-icons').style.display = 'none';
        }
        var name = document.querySelector('.userBlock .name');
        if (name && profile.getName()) name.innerText = profile.getName();
        var email = document.querySelector('.userBlock .email');
        if (email && profile.getEmail()) email.innerText = profile.getEmail();

        var signinBtn = document.querySelector('.g-signin2');
        signinBtn.style.display = 'none';
        document.querySelector('.userBlock .logout').style.display = 'flex';
        document.querySelector('.userBlock .image').style.display = 'flex';
        document.querySelector('.userBlock .log').style.display = 'block';

        user = {
            name : profile.getName(),
            email : profile.getEmail(),
            id : profile.getId(),
            token: auth.id_token 
        }
    }
}

  function g_signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
        var signinBtn = document.querySelector('.g-signin2');
        [...document.querySelectorAll('.userBlock > div')].forEach(div => {
            div.style.display = div == signinBtn ? 'block' : 'none';
        });
        document.querySelector('.userBlock img').setAttribute('src','');
        document.querySelector('.userBlock .name').innerText = '';
        document.querySelector('.userBlock .email').innerText = '';
        return true;
    });
  }

// ------------ DEVICE --------------

function isMobile() {
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
        return true;
    } else {
        return false;
    }
}

// ----------- COMANDI --------------

/** @param {string} url - url dello script,
 * @param {string[][]} parametri - coppie di chiave-valore da passare come parametri,
 * @param {function} okFun - callback function per risultato positivo,
 * @param {function} koFun - callback function per risultato negativo,
 */
function post(url,parametri = {},okFun,koFun,parent,notLoading,contentType = 'application/json; charset=UTF-8') {
    var data = parametri;
    console.log(data);
    if (!notLoading) loading(true,parent);
    let promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
   
        
        //xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Content-type", contentType);
        xhr.onload = () => resolve(xhr.responseText);
        xhr.onerror = () => reject(xhr.statusText);                
        xhr.send(JSON.stringify(data));
        //xhr.send(data);
    });
    promise.then((resp)=>{     
        //console.log(resp);
        resp = JSON.parse(resp);
        okFun(resp);
        if (!notLoading) loading(false,parent);
    },            
    (resp)=>{
        if (koFun) koFun(resp);
        else console.log(resp);
        if (!notLoading) loading(false,parent);
    });
}

// ------------ GAS ------------------

/** @param {[][]} fn - Array contenente il nome della funzione su GAS e l'array dei parametri */
function load(fn,parent,notLoading) {
    if (!notLoading) loading(true,parent);
    return new Promise((resolve,reject) => {        
        google.script.run
        .withSuccessHandler(data => {
            if (!notLoading) loading(false,parent);            
            resolve(JSON.parse(data))})
        .withFailureHandler(ex => {
            if (!notLoading) loading(false,parent);
            reject(ex)})
        .ppp(fn.join('{{__SEPARATORE__}}'))   
    })
} 

// --------------- Macro el -----------------
function aggiornaUserInfo(utente) {
    if (utente) {
        var ub = document.querySelector('.userBlock');
        ub.querySelector('.name').innerText = utente.nome + ' ' + utente.cognome;
        ub.querySelector('.email').innerText = utente.mail;
        var ib = ub.querySelector('.image');
        ib.querySelector('span.material-icons').style.display = 'none'; 
        ib.querySelector('span.abbreviazione').style.display = utente.image ? 'none' : 'flex';
        ib.querySelector('span.abbreviazione').innerText = (utente.nome[0]).toUpperCase();
        ib.querySelector('img').style.display = utente.image ? 'block' : 'none';
        if (utente.image) ib.querySelector('img').setAttribute('src', utente.image);                
    } 
}
function LogOut() {  
    var newWindow = window.open('https://mail.google.com/mail/?logout&hl=fr',
    'Disconnettiti da Google',
    'width=500,height=400,menubar=no,status=no,location=no,toolbar=no,scrollbars=no,top=200,left=200');
    setTimeout( _ => {
        if (newWindow) newWindow.close();
        window.open(url+'?page=asincrone', '_top')
    }, 3000); 
}

// ---------------- DOM ---------------------
function prependHeader() {
    const id_client = '510127362811-i7434uhv84hprkouk7mugboc2hemife4.apps.googleusercontent.com';
    
    document.body.prepend(creaElemento('header', {
        innerHTML : `<div class="menuBtn">
            <div class="alt superiore iniziale" alt="Mostra menu" data-state="hidden">
                <button id="menuBtn" class="material-icons">menu</button>
            </div>
        </div>
        <div class="bottoniera">
            <div class="alt superiore iniziale" alt="Impostazioni">
                <button id="setBtn" class="material-icons">settings</button>
            </div>
            <div>
                <button id="labelBtn" class="material-icons">help</button>
            </div>
        </div> 
         <div class="messages">            
            <div id="loadState" class="sincronizzazione caricamento"></div> 
            <div class="aggiornamento">
                <a class="ultimo"></a>
            </div>           
        </div>
        <div class="info nascosto"></div>
        <div class="userBlock">
            <div class="g-signin2" data-onsuccess="onSignIn"></div>

            <div class="image" style="display:none;">
                <img src="" alt="Icona utente">
                <span class="material-icons">face</span>
                <span class="abbreviazione"></span>
            </div>
            <div class="log" tabindex="-1" style="display:none;">
                <div class="name">Nome Cognome</div>
                <div class="email">mail@mail.com</div>  
            </div>
            <div class="logout alt finale superiore" alt="Disconnettiti" style="display:none;">
                <button id="logoutBtn" class="material-icons">exit_to_app</button>
            </div>
        </div>`
    }));
    var header = document.querySelector('header');

    header.querySelector('.userBlock .image').addEventListener('click',e=>{
        document.querySelector('.userBlock .log').classList.add('mostra');
        document.querySelector('.userBlock .log').focus();
    });

    header.querySelector('.userBlock .log').addEventListener('focusout',e=>{
        e.target.classList.remove('mostra');
    });

    header.querySelector('#logoutBtn').addEventListener('click',g_signOut);

    header.querySelector('.menuBtn button').addEventListener('click', e => {
        var parent = menuBtn.parentNode;            
        var state = parent.getAttribute('data-state') == 'hidden' ? 'shown' : 'hidden';
        parent.setAttribute('alt',(state == 'hidden' ? 'Mostra menu' : 'Nascondi menu'))
        var menu = document.querySelector('.menu');
        parent.setAttribute('data-state',state);
        e.target.innerText = icone[state];
        menu.setAttribute('data-state',state);  
        document.querySelector('.main').setAttribute('data-state',(state == 'hidden' ? 'shown' : 'hidden'));               
    });
    
    if (typeof mostraImpostazioniHdl === 'function') 
    document.getElementById('setBtn').addEventListener('click', mostraImpostazioniHdl); // ogni pagina ha il suo metodo !!!
    else document.getElementById('setBtn').parentNode.style.display = 'none';

    document.getElementById('labelBtn').addEventListener('click',labelBtnHdl);
    document.getElementById('labelBtn').parentNode.style.display = (isMobile() ? 'flex' : 'none');
    return header;
}
function prependMenu(parent) {
    parent.prepend(creaElemento('div', {
        classes : 'menu',
        attributes : { 'data-state' : 'hidden' },
        innerHTML : `
        <div class="menuWrapper">
            <div class="nascosto closeBtn"><button class="round material-icons">close</button></div>
            <ul>
                <li>Home</li>
                <li>Abbinamenti</li>
            </ul>
        </div>`
    }));

    var menu = document.querySelector('.menu');
    menu.querySelector('.closeBtn button').addEventListener('click',e => {
        e.preventDefault();
        document.getElementById('menuBtn').click();
    })
    return menu;
}
function loading(start,parent) {
    parent = parent || document.body;
    if (start && !parent.querySelector(':scope > .loading')) {
        parent.appendChild( creaElemento('div',{ 
            classes : 'loading' + (parent != document.body ? ' material-icons' : ''),
            innerText : parent != document.body ? 'sync' : ''
        }) );        
        if (parent != document.body) [...parent.parentNode.querySelectorAll('.postLoad')]
        .forEach(el => el.style.display = 'none');
    } else if (!start && parent.querySelector(':scope > .loading')) {
        parent.querySelector('.loading').remove();
        if (parent != document.body) [...parent.parentNode.querySelectorAll('.postLoad')]
        .forEach(el => el.style.display = 'flex');
    }
    if (parent == document.body) blackScreen(!start,parent);
}
function blackScreen(rimuovi,parent) {
    parent = parent || document.body;
    if (!rimuovi && !parent.querySelector('.blackScreen')) {
        parent.appendChild( creaElemento('div',{ classes : 'blackScreen' }) );
    } else if (rimuovi && parent.querySelector('.blackScreen')) {
        parent.querySelector('.blackScreen').remove();
    }
}
function creaAltEl(classi,alt,figli = undefined) {
    return creaElemento('div', { 
        classes : ['alt'].concat(classi).join(' '), 
        attributes : { alt },
        figli
    });
}
function creaElemento(tag,varie) {
    var elem = document.createElement(tag);
    if (varie) {
        if (varie.classes) elem.className = varie.classes;
        if (varie.attributes) Object.keys(varie.attributes).forEach(k=>{
            elem.setAttribute(k,varie.attributes[k]);
        });
        if (varie.properties) Object.keys(varie.properties).forEach(k=>{
            elem.style.setProperty(k,varie.properties[k]);
        });
        if (varie.triggers) Object.keys(varie.triggers).forEach(k=>{
            elem.addEventListener(k,varie.triggers[k]);
        });
        if (varie.figli) varie.figli.forEach(el=>{
            elem.appendChild(el);
        });
        else if (varie.innerText) elem.innerText = varie.innerText;
        else if (varie.innerHTML) elem.innerHTML = varie.innerHTML;
        else if (varie.outerHTML) elem.outerHTML = varie.outerHTML;
    }
    return elem;
}
function creaFinestra(titolo,id,classe,closeEvent) {
    var finestra = creaElemento('div', {
        classes : 'dettaglio finestra', 
        innerHTML : `<div class="alt superiore finale closeBtn" alt="Chiudi">
            <button class="material-icons round">close</button>
        </div>
        <div class="">
            <h2>
                <div class="title"></div>
                <div><button class="material-icons mostraInfo">help</button></div>
            </h2>
            <div></div>
        </div>`
    });
    finestra.setAttribute('id',id);
    finestra.querySelector('h2 .title').innerHTML = titolo;
    finestra.querySelector('.closeBtn button').addEventListener('click', (closeEvent || (e => {
        e.preventDefault();
        parentEl(e.target,'dettaglio',true).remove();
    })));
    finestra.querySelector('button.mostraInfo').addEventListener('click',labelBtnHdl);
    if (classe) finestra.querySelector(':scope > div:not(.closeBtn)').classList.add(classe);
    finestra.querySelector('button.mostraInfo').parentNode.style.display = mobile ? 'flex' : 'none';        
    return finestra;
} 
function creaMenuItem(id,titolo,opzioni) {
    rimuoviElemento(id);
    var cont = creaFinestra(titolo,id,'opzioni',e => {
        e.preventDefault();
        if (parentEl(e.target,'dettaglio',true) == document.getElementById('impostazioni'))
        rimuoviElemento('impostazioni');
        else {
            document.getElementById('impostazioni').style.display = 'flex';
            parentEl(e.target,'dettaglio',true).remove();
        }
    });
    var delay = 0;
    Object.keys(opzioni).forEach(k => {
        if (opzioni[k].auth) {
            var div = cont.querySelector('h2 + div').appendChild(creaElemento('div',{
                classes : 'opzione',
                figli : [
                    creaAltEl('finale '+(delay == 0 ? 'superiore' : 
                    (delay < Object.keys(opzioni).length - 1 ? 'sovrapposto' : 'inferiore')),
                        opzioni[k].alt,[creaElemento('button',{
                        innerHTML : k,
                        triggers : { click : opzioni[k].trigger }
                    })])
                ]
            }))
            div.style.setProperty('--delay',delay++);
        }
    });
    [...cont.querySelectorAll('.opzione')].forEach(el => {
        el.addEventListener('mouseenter', e => {
            [...parentEl(e.target,'opzioni',true).querySelectorAll('.opzione')]
            .forEach(s => s.style.zIndex = (e.target == s ? 2 : 1))
        })
    })
    nascondiAlt(!isMobile(),cont);
    document.body.appendChild(cont);
}
function creaMenuItemInput(id,titolo,opzioni) {
    rimuoviElemento(id);
    var cont = creaFinestra(titolo,id,'opzioni',e => {
        e.preventDefault();
        if (parentEl(e.target,'dettaglio',true) == document.getElementById('impostazioni'))
        rimuoviElemento('impostazioni');
        else {
            document.getElementById('impostazioni').style.display = 'flex';
            parentEl(e.target,'dettaglio',true).remove();
        }
    });
    var delay = 0;
    Object.keys(opzioni).forEach(k => {
        if (opzioni[k].auth) {
            var figli = [
                creaElemento('span',{ classes : 'testo', innerHTML : k}), 
                creaElemento('span',{classes : 'input', figli : opzioni[k].input}),                   
                creaAltEl('finale '+(delay == 0 ? 'superiore' : 
                    (delay < Object.keys(opzioni).length - 1 ? 'sovrapposto' : 'inferiore')),
                        opzioni[k].alt,[creaElemento('button',{
                        innerHTML : 'Esegui',
                        triggers : { click : opzioni[k].trigger }
                    })])
            ];
            var div = cont.querySelector('h2 + div').appendChild(creaElemento('div',{
                classes : 'opzione input',
                figli
            }))
            div.style.setProperty('--delay',delay++);
        }
    });
    [...cont.querySelectorAll('.opzione')].forEach(el => {
        el.addEventListener('mouseenter', e => {
            [...parentEl(e.target,'opzioni',true).querySelectorAll('.opzione')]
            .forEach(s => s.style.zIndex = (e.target == s ? 2 : 1))
        })
    })
    nascondiAlt(!isMobile(),cont);
    document.body.appendChild(cont);
}
function creaSwitch(classi,id,checked,opzioni,opzioniAlt,click) {
    return creaElemento('div',{
        classes : classi,   
        attributes : { alt : opzioniAlt ? opzioniAlt[(checked ? 1 : 0)] : undefined },
        figli : [ 
            creaElemento('input',{
                attributes : { id, type : 'checkbox' },
                triggers : { click : e => {     
                        var contenitore = (opzioni ? parentEl(e.target,'alt',true) : undefined);              
                        if (opzioni && opzioniAlt) {                        
                            var i_opz = !e.target.checked ? 0 : 1; 
                            contenitore.setAttribute('alt',opzioniAlt[i_opz]);
                            contenitore.querySelector('label > span').innerHTML = opzioni[i_opz]; 
                        }
                        click();
                    }
                }
            }),
            creaElemento('label', { 
                attributes : { for : id },
                innerHTML : (opzioni ? '<span>'+opzioni[(checked ? 1 : 0)]+'</span>' : '')
            })
        ]
    })
}
function mostraAlert(messaggio,tipo) {
    blackScreen(false);
    var tipi = [{
        titolo : 'Azione eseguita',
        tipo : 'ok',
        icon : 'done'
    },{
        titolo : 'Errore',
        tipo : 'error',
        icon : 'error'
    },{
        titolo : 'Attenzione',
        tipo : 'warning',
        icon : 'warning'
    },{
        titolo : 'Info',
        tipo : 'info',
        icon : 'info'
    }];
    tipo = tipi.filter(el=>el.tipo==tipo)[0];
    var msgBox = document.querySelector('body').appendChild(
        creaElemento('div',{
            classes : 'messageBox '+tipo.tipo, 
            attributes : {'tabindex':-1, id : 'messageBox'}, 
            figli : [
            creaElemento('fieldset',{ figli : [
                creaElemento('legend',{ innerText : tipo.titolo }),
                creaElemento('div',{ innerHTML : '<button class="material-icons mostraInfo">help</button>' }),
                creaElemento('div', {classes : 'messageWrapper', figli : [
                    creaElemento('div',{classes : 'messageBody', figli : [
                        creaElemento('p',{innerHTML : messaggio}),
                        creaElemento('span', {classes : 'material-icons messageIco', innerText : tipo.icon})
                    ]}),
                    creaElemento('div',{classes : 'messageButtons', figli : [
                        creaElemento('button',{
                            classes : 'okBtn',
                            innerText : 'Ok', 
                            triggers : { click : e=>{
                                e.preventDefault(); 
                                parentEl(e.target,'messageBox',true).remove();
                                blackScreen(true);
                                loading(false);
                            }
                        }})
                    ]})
                ]})
            ]})
        ], triggers : {
            click : e=>e.target.focus(),
            keydown : e=>{
                if (e.key == 'Escape' || e.key == 'Delete') 
                e.target.remove();
                blackScreen(true);
                loading(false);
            }
        }})
    )
    msgBox.querySelector('button.mostraInfo').addEventListener('click',labelBtnHdl);
    var mobile = isMobile();
    msgBox.querySelector('button.mostraInfo').parentNode.style.display = mobile ? 'flex' : 'none'; 
    nascondiAlt(!mobile,msgBox); 
    msgBox.querySelector('.okBtn').focus();
    return msgBox;
}
function nascondiAlt(mostra,parent) {    
    var classe = 'altNascosto';
    parent = parent || document;
    ([...parent.querySelectorAll('.alt')]).forEach(el => {
        if (mostra && el.classList.contains(classe))
        el.classList.remove(classe)
        else if (!mostra && !el.classList.contains(classe))
        el.classList.add(classe)
    })
}
function nascondiNoMobile(parent) {    
    var classe = '.noMobile';
    parent = parent || document;
    ([...parent.querySelectorAll(classe)]).forEach(el => {
        el.style.display = isMobile() ? 'none' : 'flex';
    })
}
function notificaScorrimento(parent) {
    (parent || document.body).appendChild(creaElemento('div', {
        classes : 'notificaGuida',
        attributes : {id : 'notificaScorrimento'},
        innerHTML : 
        `<div class="testo">Scorri verso l'alto per visualizzare la barra in basso</div>
        <div class="icone">
            <span class="material-icons">keyboard_arrow_up</span>
            <span class="material-icons">keyboard_arrow_up</span>
            <span class="material-icons">keyboard_arrow_up</span>
        </div>`
    }));

    var tmr = setInterval(() => {
        rimuoviElemento('notificaScorrimento',false,true);
        clearInterval(tmr);
    }, 5000);
}
function parentEl(element,name,isClass) {
    while (element) {
        if (!isClass) {
            if (element.tagName == name.toUpperCase())
            return element;
        } else {
            if (element.classList.contains(name))
            return element;
        }
        element = element.parentElement;
    }
}
function mostraTimer(dt1,dt2,rimuovi) {
    var differenza = differenzaDate(dt2,dt1);
    var h = pad(Math.floor(differenza / 1000 / 60 / 60) % 24);
    var m = pad(Math.floor(differenza / 1000 / 60) % 60);
    var s = pad(Math.floor(differenza / 1000) % 60);

    if (rimuovi) { 
        console.log(
            '%cTempo impiegato: %s : %s : %s\nMillisecondi: %s',
            'color:yellow;background:black;padding:3px',
            h,m,s,differenza);
        return rimuoviElemento('timer');
    }

    var timerDv = document.getElementById('timer') || document.body.appendChild(creaElemento('div', {
        attributes : { id : 'timer' },
        figli : [
            creaElemento('div', { 
                classes : 'normalizzato', 
                innerHTML : '<span data-rif="ore"></span><span data-rif="minuti"></span><span data-rif="secondi"></span>' }),
            creaElemento('div', { classes : 'millisecondi' })
        ]
    }));
    timerDv.querySelector('.millisecondi').innerHTML = differenza;
    timerDv.querySelector('span[data-rif="ore"]').innerHTML = h;
    timerDv.querySelector('span[data-rif="minuti"]').innerHTML = m;
    timerDv.querySelector('span[data-rif="secondi"]').innerHTML = s;
    return timerDv;
}
function rimuoviElemento(id,nascondi,animazione) {
    var trovato = document.getElementById(id);
    if (trovato && !nascondi) {
        if (animazione) {
            var duration = 300;
            trovato.animate({ opacity : [1,0] }, {fill : 'forwards', duration, easing : 'ease-in-out'});
            var tmr = setInterval( _ => {
                trovato.remove();
                clearInterval(tmr);
            }, duration)
        } else trovato.remove();
    } else if (trovato && nascondi) trovato.style.display = 'none';
}

// --------------- TRIGGERS ------------

function fireTrigger(input,evntName) {                
    if ("createEvent" in document) {
        let evt = new Event (evntName,
            {bubbles:false,cancelable:true});
        input.dispatchEvent(evt);
    } else input.fireEvent(cmd);
}

function labelBtnHdl(e) {
    e.preventDefault();            
    if (!isMobile()) return
    var labelBtn = document.getElementById('labelBtn'); 
    console.log(labelBtn);
    var mostraLabel = e.target.getAttribute('data-active') == 'true';
    [...(e.target == labelBtn ? document : parentEl(e.target,'dettaglio',true) || parentEl(e.target,'messageBox',true))
    .querySelectorAll('.alt')].forEach(el => {
        if (!mostraLabel) {
            if (!getComputedStyle(el).getPropertyValue('--delayHelp')) el.style.setProperty('--delayHelp',Math.floor(Math.random() * 10));
            if (!el.classList.contains('mostraLabel')) el.classList.add('mostraLabel');
            el.addEventListener('click',mostraEtichettaHdl);
            if (el.querySelector('button')) el.querySelector('button').style.pointerEvents = 'none';
            if (el.querySelector('button')) el.querySelector('button').style.pointerEvents = 'none';
            if (el.querySelector('select')) el.querySelector('select').disabled = true;
            if (el.querySelector('input')) el.querySelector('input').disabled = true;
            e.target.setAttribute('data-active','true')
        } else {
            if (el.classList.contains('mostraLabel')) el.classList.remove('mostraLabel');
            el.removeEventListener('click',mostraEtichettaHdl);
            if (el.classList.contains('mostra')) el.classList.remove('mostra');
            if (el.querySelector('button')) el.querySelector('button').style.pointerEvents = 'all';
            if (el.querySelector('select')) el.querySelector('select').disabled = false;
            if (el.querySelector('input')) el.querySelector('input').disabled = false;
            e.target.setAttribute('data-active','false')
        } 
    })
}

function mostraEtichettaHdl(e) {
    var labelBtn = document.getElementById('labelBtn');
    if (e.target != labelBtn && !e.target.classList.contains('mostraInfo')) {
        var node = parentEl(e.target,'alt',true);     
        [...document.querySelectorAll('.alt.mostraLabel')].forEach(el => {
            if (el == node) {
                if (!el.classList.contains('mostra'))
                el.classList.add('mostra');
            } else {
                if (el.classList.contains('mostra'))
                el.classList.remove('mostra');
            }
        })     
    } 
}

function mostraLogHdl() {
    rimuoviElemento('impostazioni',true);
    rimuoviElemento('logs');
    var cont = creaFinestra('Logs','logs','logs',e => {
        var imp = document.getElementById('impostazioni');
        if (imp) imp.style.display = 'flex';
        parentEl(e.target,'dettaglio',true).remove();
    });

    let setValore = (k,valore) => {
        if (k == 'url' || k == 'destinazione') return '<a href="'+valore+'" target="_black">link</a>';
        if (k =='aggiornamento') return getDataOraStringa(valore);
        return valore;
    }
    var ks = 'error,messaggio'.split(',');
    for (var i = logs.length - 1; i >= 0; i--) {
        var log = logs[i];   
        var logDiv = creaElemento('div', {
            classes : 'log',
            figli : [
                creaElemento('span', { classes : 'messaggio', innerHTML : log ? log.messaggio : 'Log vuoto (?)' }),
                creaElemento('span', { classes : 'varie' }),
                creaElemento('span', { classes : 'stato', 
                innerHTML : '<span class="material-icons '+(!log || log.error ? 'error' : 'ok')+'">'+icone[!log || log.error ? 'ko' :'ok']+'</span>' })
            ]
        }); 
        if (log) {  
            Object.keys(log).forEach(k => {
                if (ks.indexOf(k) == -1) {                
                    logDiv.querySelector('.varie').appendChild(
                        creaElemento('span',{ innerHTML : '<span class="proprieta">'+k+':</span><span class="valore">'+
                        setValore(k,log[k])+'</span>' }))
                }
            });
        }
        cont.querySelector('.logs > div').appendChild(logDiv);
    }
    nascondiAlt(!mobile,cont);
    document.body.appendChild(cont);
}

const inViewport = (entries, observer) => {  
    entries.forEach(entry => {
        entry.target.classList.toggle("is-inViewport", entry.isIntersecting);       
    });
};
 

// --------- FORMATAZIONE ----------

function pad(val,length,symb) {
    symb = symb || '0';
    length = length || 2;
    val = val.toString();
    while (val.length < length) {
        val = symb+val;
    }
    return val;
}

function capitalizeFirstChar(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function abbreviazioneCognomeNome(cognome,nome) {  
    nome = nome.split(' ').map(n => n[0].toUpperCase() + n.substring(1,n.length).toLowerCase()).join('');
    cognome = cognome.split(' ').map(c => 
      c[0].toUpperCase() + c.substring(1,c.length).toLowerCase()).join(''); 
    var cognNorm = cognome
      .split(' ').join('')
      .split('\'').join('')
      .split('`').join('');
      
    if (cognNorm.length > 7) cognNorm = cognNorm.substring(0,6) + '.';
    return cognNorm + ' ' + nome.substring(0,2)+'.';
  }

// ----------------- DATE -----------

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

function getMonday(dt) {
    dt = dt || new Date();
    var dt1 = new Date(new Date(dt.valueOf()).setHours(0,0,0,0));
    return dt1.addDays((dt1.getDay()-1)*-1);  
}

function differenzaDate(dt1,dt2) {
    if (!dt1) dt1 = new Date(0,0,0);
    if (!dt2) dt2 = new Date(0,0,0);
    if (typeof dt1 == 'string') dt1 = new Date(dt1);
    if (typeof dt2 == 'string') dt2 = new Date(dt2);
    return dt1.getTime() - dt2.getTime();
}

function giorniDaDate(dt1,dt2) {
    if (!dt2) dt2 = new Date(0,0,0);
    if (!dt1) dt1 = new Date(dt2);

    var millisecondi = Math.floor(differenzaDate(dt1,dt2));
    return millisecondi / 1000 / 60 / 60 / 24;
}

/**
 * @param {Date} dt - Data da confrontare
 * @param {Date} inizio - Prima data
 * @param {Date} fine - Ultima data
 * @returns {boolean}
 */
 dataCompresa = (dt,inizio,fine) => {  
    return differenzaDate(dt,inizio) >= 0 && differenzaDate(fine,dt) >= 0;
}

function getDataOraStringa(dt,soloData) {
    const DF_options = { month: '2-digit', day: '2-digit', year : '2-digit' };
    if (typeof dt == 'string') dt = new Date(dt);
    return dt.toLocaleDateString('it-IT',DF_options) + (!soloData ? ' ' +
        dt.toLocaleTimeString('it-IT') : '')
}
function getDateForInputDate(dt) {
    if (typeof dt == 'string') dt = new Date(dt);
    return dt.getFullYear()+'-'+pad(dt.getMonth()+1)+'-'+pad(dt.getDate());
}
function getDateForInputTime(dt) {
    if (typeof dt == 'string') dt = new Date(dt);
    return pad(dt.getHours())+':'+pad(dt.getMinutes());
}
function getDateForDatetime(d) {
    if (typeof d == 'string') d = new Date(d);
    return [d.getFullYear(),pad(d.getMonth()+1),pad(d.getDate())].join('-') +
    'T' +
       [pad(d.getHours()),pad(d.getMinutes()),pad(d.getSeconds())]
    .join(':');
}
function getWeekNumber(d) {
    // Copy date so don't modify original
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    // Get first day of year
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    // Return array of year and week number
    return weekNo;
}
function stessoGiorno(d1,d2) {
    if (typeof d1 == 'string') d1 = new Date(d1);
    if (typeof d2 == 'string') d2 = new Date(d2);
    return (d1.getDate() == d2.getDate() &&
    d1.getMonth() == d2.getMonth() &&
    d1.getFullYear() == d2.getFullYear() )
}

/**
 * 
 * @param {number} ora 
 * @param {Date} data 
 * @param {{
 *  nome : string,
 *  abbreviazione : string,
 *  inizio : string,
 *  fine : string,
 *  oreder : number
 * }} orari 
 * @returns {
 *  inizio : Date,
 *  fine : Date
 * }
 */
function formattaOrario(ora,data,orari) {
    //console.log(arguments);
    if (typeof data == 'string') data = new Date(data);
    var orario = orari.filter(o => o.abbreviazione+'' == ora+'')[0]
    var inizio = orario.inizio.split(':');
    var fine = orario.fine.split(':');
    return {
        inizio : new Date(data.setHours(inizio[0],inizio[1],0,0)),
        fine : new Date(data.setHours(fine[0],fine[1],0,0))
    }
}

/**
 * 
 * @param {{
 *  orario : {
 *      inizio : Date,
 *      fine : Date
 *  }
 * }} ev1 
 * @param {{
 *  orario : {
 *      inizio : Date,
 *      fine : Date
 *  }
 * }} ev2 
 * @returns {{
 *  coincidente : boolean?,
 *  intersecati : boolean?,
 *  esclusi : boolean?
 * }}
 */
 confrontaOrari = (ev1,ev2) => {

     var stesso_inizio = differenzaDate(ev1.orario.inizio,ev2.orario.inizio) == 0;
     var stessa_fine = differenzaDate(ev1.orario.fine,ev2.orario.fine) == 0;

     if (stesso_inizio && stessa_fine) 
     return {coincidenti : true};

     var primo_dopo = dataCompresa(
         ev1.orario.inizio,
         ev2.orario.inizio,
         ev2.orario.fine);

     var secondo_dopo = dataCompresa(
         ev2.orario.inizio,
         ev1.orario.inizio,
         ev1.orario.fine);

     var primo_compreso = primo_dopo && 
         dataCompresa(
             ev1.orario.fine,
             ev2.orario.inizio,
             ev2.orario.fine);

     var secondo_compreso = secondo_dopo && 
         dataCompresa(
             ev2.orario.fine,
             ev1.orario.inizio,
             ev1.orario.fine);
     
     let intersecati = (primo_dopo || secondo_dopo);
     if (intersecati)
     return {
         intersecati,
         primo_dopo,
         secondo_dopo,
         primo_compreso,
         secondo_compreso
     };
     
     return {esclusi : true}
 }

// ---------------- AZIONI --------------------
async function copia(txt,is_container = true) {
    /*var temp = document.createElement('input');
    document.body.appendChild(temp);
    var testo = is_container ? txt.innerText : txt;
    temp.value = testo;
    temp.select();
    document.execCommand("copy");
    document.body.removeChild(temp);
    return testo  */ 
    const text = is_container ? txt.innerText : txt;
    var result = await navigator.clipboard.writeText(text);
    return result;
}