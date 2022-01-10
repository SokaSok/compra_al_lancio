/**
 * Ritorna millisecondi
 * @param {Date} dt1 
 * @param {Date} dt2 
 * @returns {number}
 */
function differenzaDate(dt1,dt2) {
    if (!dt1) dt1 = new Date(0,0,0);
    if (!dt2) dt2 = new Date(0,0,0);
    if (typeof dt1 == 'string') dt1 = new Date(dt1);
    if (typeof dt2 == 'string') dt2 = new Date(dt2);
    return dt1.getTime() - dt2.getTime();
}

/**
 * Ritorna giorni
 * @param {Date} dt1 
 * @param {Date} dt2 
 * @returns {number}
 */
function giorniDaDate(dt1,dt2) {
    if (!dt2) dt2 = new Date(0,0,0);
    if (!dt1) dt1 = new Date(dt2);

    var millisecondi = Math.floor(differenzaDate(dt1,dt2));
    return millisecondi / 1000 / 60 / 60 / 24;
}

/**
 * ritorna TRUE se dt compresa, altrimenti FALSE
 * @param {Date} dt - Data da confrontare
 * @param {Date} inizio - Prima data
 * @param {Date} fine - Ultima data
 * @returns {boolean}
 */
 function dataCompresa(dt,inizio,fine) {  
    return differenzaDate(dt,inizio) >= 0 && differenzaDate(fine,dt) >= 0;
}

module.exports = {
    differenzaDate,
    giorniDaDate,
    dataCompresa
}