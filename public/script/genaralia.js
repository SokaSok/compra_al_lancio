/** @param {string} url - url dello script,
 * @param {any} parametri - coppie di chiave-valore da passare come parametri,
 * @param {function} okFun - callback function per risultato positivo,
 * @param {function} koFun - callback function per risultato negativo,
 */
 function post(url,parametri = {},okFun,koFun,parent,notLoading,contentType = 'application/json; charset=UTF-8') {
    console.log(parametri)

    if (!notLoading) loading(true,parent);
    let promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", contentType);
        xhr.onload = () => resolve(xhr.responseText);
        xhr.onerror = () => reject(xhr.statusText);                
        xhr.send(JSON.stringify(parametri));
        //xhr.send(parametri);
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

// DOM
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
