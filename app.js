const debug = require('debug')('app:inicio');
const usuarios = require('./routes/usuarios');
const  express = require('express');
const config = require('config');
const  morgan = require('morgan');

const app = express();

//llamados de middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'));
app.use('/api/usuarios', usuarios);

//Configuracion de entornos
console.log('Aplicación: ' + config.get('nombre'));
console.log('BD server: ' + config.get('configDB.host'));


//uso de middleware de tercero - Morgan
if(app.get('env') === 'development')
{
    app.use(morgan('tiny'));
    debug('Morgan esta habilitado')
}

//trabajos con db
debug('Conectando con la base de datos');


//peti
app.get('/', (req,res) => {
    res.send('Mi nombre es Rickson Plancher');
}); 


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Escuchando en le puerto ${port}`);
});