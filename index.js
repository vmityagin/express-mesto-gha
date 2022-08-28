const express = require('express');

const { PORT = 3000} = process.env;

const app = express(); 

app.listen(PORT, () => {
    console.log(`${PORT} установлен`);
})

app.get('/', (req, res) => {
    res.status(200).send(`
    <html>
    <body>
        <p>Ответ на сигнал из далёкого космоса</p>
    </body>
    </html>
    `)

})