const debug = require('debug')('app:inicio');
//const dbDebug = require('debug')('app:db');
const  express = require('express');
const config = require('config');
//const logger =  require('./logger')
const  morgan = require('morgan');
const Joi = require('@hapi/joi');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'));

//Configuracion de entornos
console.log('Aplicación: ' + config.get('nombre'));
console.log('BD server: ' + config.get('configDB.host'));


//uso de middleware de tercero - Morgan
if(app.get('env') === 'development')
{
    app.use(morgan('tiny'));
    //console.log('Morgan habilitado');
    debug('Morgan esta habilitado')
}

//trabajos con db
debug('Conectando con la base de datos');

const usuarios = [
    {id:1, nombre:'Rose Nadine'},
    {id:2, nombre:'Aleysha'},
    {id:3, nombre:'Maya Denisha'}
];

//peticion
app.get('/', (req,res) => {
    res.send('Mi nombre es Rickson Plancher');
}); 

app.get('/api/usuarios', (req,res) => {
    res.send(usuarios);
}); 

app.get('/api/usuarios/:id', (req,res) => {
    let usuario = usuarios.find(u => u.id === parseInt(req.params.id));
    if(!usuario) res.status(404).send('El usuario no fue encontrado');
    res.send(usuario);
}); 

//envio datos
app.post('/api/usuarios', (req, res) => {

    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    });

    const {error, value} = schema.validate({ nombre: req.body.nombre });
    if(!error){
        const usuario = {
            id: usuarios.length + 1,
            nombre: value.nombre
        };

        usuarios.push(usuario);
        res.send(usuario);
    }else{
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
    }
});

//actualizacion
app.put('/api/usuarios/:id', (req, res) =>{
    //Encontrar si existe el objeto usuario
    //let usuario = usuarios.find(u => u.id === parseInt(req.params.id));
    let usuario = existeUsuario(req.params.id);
    
    if(!usuario){
        res.status(404).send('El usuario no fue encontrado');
        return;
    } 

    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    });

    const {error, value} = schema.validate({ nombre: req.body.nombre });
    if(error){
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
        return;
    }

    usuario.nombre = value.nombre;
    res.send(usuario);
});

//eliminacion
app.delete('/api/usuarios/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if(!usuario){
        res.status(404).send('El usuario no fue encontrado');
        return;
    }

    const index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1);

    res.send(usuario);
});

function existeUsuario(id){
    let usuario = usuarios.find(u => u.id === parseInt(id));
}

function  validarUsuario(nom) {
    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    });
    return (schema.validate({nombre: nom}));
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Escuchando en le puerto ${port}`);
});