const port = 3000;
const express = require('express');
const app = express();

app.listen(port, _ => console.log('Ascolto in 3000'));
app.use(express.static('public'));
app.use(express.json({limit:'1mb'}));
app.set('view engine','pug');

// prova request.params
app.get('/test',async (req,res) => {
    let kucoin = require('./kucoin');    
    let data = await kucoin.test();    
    res.json(data);
});

/**
 * @param {{
 *  cr1 : string,
 *  cr2 : string
 * }} req 
 */
app.post('/ticker',async (req,res) => {
    console.log(req.body);
    let cr1 = req.body.cr1;
    let cr2 = req.body.cr2;

    let symbol = `${cr1}-${cr2}`; // alt dx + 096
        
    let kucoin = require('./kucoin');    
    let data = await kucoin.get_ticker(symbol);    
    res.json(data);
});
app.post('/symbols',async (req,res) => {
    let kucoin = require('./kucoin');    
    let data = await kucoin.get_symbols();    
    res.json(data);
});
app.post('/announcement',async (req,res) => {
    let kucoin = require('./kucoin');    
    let data = await kucoin.get_announcement();    
    res.json(data);
});

// prova template engines
/**
 * la funzione render utilizza il template passato come primo parametro e
 * collocato nella cartella 'views'
 */
app.get('/template/:title/:h1/:nome', (req, res) => {
    res.render('index', { 
        title: req.params.title, 
        message: req.params.h1, 
        nome: req.params.nome 
    })
})
  
