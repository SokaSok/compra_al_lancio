const port = 3000;
const express = require('express');
const app = express();

app.listen(port, _ => console.log('Ascolto in 3000'));
app.use(express.static('public'));
app.use(express.json({limit:'1mb'}));
app.set('view engine','pug');

// prova request.params
app.get('/dati',async (req,res) => {
    //console.log(req.params.crypto);
    let kucoin = require('./kucoin');
    
    let data = await kucoin();
    
    res.json(data);
})

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
  
