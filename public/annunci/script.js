let announcements = [];
let olders = [];

const ann_bx = document.getElementById('announcements_bx');

window.onload = e => {
    load_announcement(false);
}

function load_announcement(hide_loading) {
    post('/announcement',undefined,update_announcement,show_error,undefined,hide_loading);
}

function update_announcement(resp) {
    if (resp.code != 200) return show_error(resp);
    
    // filter recent and hot ones
    let hots = resp.items.filter(i => i.hot == 1);
    let now = (new Date()).getTime();
    
    announcements = hots.map(h => {
        h.full_name = h.title.split(' (')[0];
        h.symbol = h.title.split(' (')[1].split(')')[0];
        h.p_time = new Date(h.summary
        .replace('Trading: ','')
        .replace(' on ',' ')
        .replace('(UTC)','')
        .replace(',','')); 
        h.active = h.p_time.getTime() > now;
        return h;
    });

    show_announcements();
}

function show_error(resp) {
    console.error(resp)

}

function show_announcements() {
    const dt_option = {weekday : 'short', day: '2-digit', month : '2-digit', year : '2-digit'};
    const tm_option = {hours: '2-digit',minutes : '2-digit'};
    
    ann_bx.innerHTML = announcements.map((a,i) => 
        `<div class="announcement ${a.active?'active':''}"
            style="--delay:${i*30}ms">
            <div class="summary">
                <h1 class="info">
                    <div data-prop="name">
                        <span data-prop="full">${a.full_name}</span>
                        <span data-prop="symbol">${a.symbol}</span>
                    </div>                
                </h1>
                <h2 data-prop="publishing">
                    <span data-prop="date">${a.p_time.toLocaleDateString(lang,dt_option)}</span>
                    <span data-prop="time">${a.p_time.toLocaleTimeString(lang,tm_option)}</span>
                </h2>
            </div>
            <img src="${a.images[0]}">
        </div>`).join('')
}