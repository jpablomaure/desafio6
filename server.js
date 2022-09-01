/* ---------------------- Modulos ----------------------*/
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');

/* ---------------------- Instancia de servidor ----------------------*/
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

/* ---------------------- Middlewares ---------------------- */
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Motor de plantillas
app.engine('hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: 'hbs'
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


/*---------------------- Base de datos ----------------------*/
const DB_MENSAJES = []

const DB_PRODUCTOS = [
]

/* ---------------------- Rutas ----------------------*/
app.get('/', (req, res) => {
    // res.sendFile(path.join(__dirname, './public', 'index.html'));
    res.render('vista', {DB_PRODUCTOS});
});

app.get('/cargados', (req, res)=>{
    res.render('cargados', {DB_PRODUCTOS});
});

app.post('/productos', (req, res)=>{
    DB_PRODUCTOS.push(req.body);
    console.log(DB_PRODUCTOS);
    res.redirect('/cargados');
});

/* ---------------------- Servidor ----------------------*/
const PORT = 3001;
const server = httpServer.listen(PORT, ()=>{
    console.log(`Servidor escuchando en el puerto ${server.address().port}`)
})

/* ---------------------- WebSocket ----------------------*/
io.on('connection', (socket)=>{
    console.log(`Nuevo cliente conectado! ${socket.id}`);
    socket.emit('from-server-mensajes', {DB_MENSAJES});

    socket.on('from-client-mensaje', mensaje => {
        DB_MENSAJES.push(mensaje);
        io.sockets.emit('from-server-mensajes', {DB_MENSAJES});
    });
})
