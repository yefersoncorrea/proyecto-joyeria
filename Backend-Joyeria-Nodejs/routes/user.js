const express = require('express');
const connection = require('../connection');
const router = express.Router();

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

//API de registro de usuario
router.post('/signup', (req, res) => {
    let user = req.body;
    query = "select email,contrasena,rol,status from user where email=?";
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                query = "insert into user(nombre,numeroContacto,email,contrasena,status,rol) values(?,?,?,?,'false','user')";
                connection.query(query, [user.nombre, user.numeroContacto, user.email, user.contrasena], (err, results) => {
                    if (!err) {
                        return res.status(200).json({ message: "Registrado con exito." });
                    }
                    else {
                        return res.status(500).json(err);
                    }
                })
            }
            else {
                return res.status(400).json({ message: "Correo Electronico ya existe." });
            }
        }
        else {
            return res.status(500).json(err);
        }
    })
})


//API de inicio de sesion
router.post('/login', (req, res) => {
    const user = req.body;
    query = "select email,contrasena,rol,status from user where email=?";
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0 || results[0].contrasena != user.contrasena) {
                return res.status(401).json({ message: "Usuario o Contraseña incorrectos" });
            }
            else if (results[0].status === 'false') {
                return res.status(401).json({ message: "Espere la aprobación del administrador" });
            }
            else if (results[0].contrasena == user.contrasena) {
                const response = { email: results[0].email, rol: results[0].rol }
                const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: '8h' })
                res.status(200).json({ token: accessToken });
            }
            else {
                return res.status(400).json({ message: "Algo salio mal. Por favor intentelo de nuevo mas tarde" });
            }
        }
        else {
            return res.status(500).json(err);
        }
    })
})


//API de recuperacion de contraseña
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

router.post('/forgotPassword', (req, res) => {
    const user = req.body;
    query = "select email,contrasena from user where email=?";
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                return res.status(200).json({ mesage: "Contraseña enviada correctamente a su correo electronico." });
            }
            else {
                var mailOptions = {
                    from: process.env.EMAIL,
                    to: results[0].email,
                    subject: 'Contraseña del proyecto joyeria',
                    html: '<p><b>Sus datos para el inicio de sesion para el proyecto joyeria</b><br><b>Correo electronico: </b>' + results[0].email + '<br><b>Contraseña: </b>' + results[0].contrasena + '<br><a href="http://localhost:4200/">Click aqui para iniciar sesion</a></p>'
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        console.log('Enviar un correo electronico: ' + info.response);
                    }
                });
                return res.status(200).json({ mesage: "Contraseña enviada correctamente a su correo electronico." });
            }
        }
        else {
            return res.status(500).json(err);
        }
    })
})

//api para obtener todos los usuarios
router.get('/get', auth.authenticateToken, checkRole.checkRole, (req, res) => {
    var query = "select id,nombre,email,numeroContacto,status from user where rol='user'";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

//api de actualizacion de estatus
router.patch('/update', auth.authenticateToken, checkRole.checkRole, (req, res) => {
    let user = req.body;
    var query = "update user set status=? where id=?";
    connection.query(query, [user.status, user.id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ mensaje: "El id del usuario no existe" });
            }
            return res.status(200).json({ mensaje: "Usuario actualizado exitosamente" });
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.get('/checkToken', auth.authenticateToken, (req, res) => {
    return res.status(200).json({ mensaje: "true" });
})

//api de cambio de contraseña
router.post('/changePassword', auth.authenticateToken, (req, res) => {
    const user = req.body;
    const email = res.locals.email;
    console.log(email);
    var query = "select *from user where email=? and contrasena=?";
    connection.query(query, [email, user.oldPassword], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                return res.status(400).json({ mensaje: "La contraseña anterior es incorrecta" });
            }
            else if (results[0].contrasena == user.oldPassword) {
                query = "update user set contrasena=? where email=?";
                connection.query(query, [user.newPassword, email], (err, results) => {
                    if (!err) {
                        return res.status(200).json({ mensaje: "La contraseña se actualizo con exito" })
                    }
                    else {
                        return res.status(500).json(err);
                    }
                })
            }
            else {
                return res.status(400).json({ mensaje: "Algo salio mal. Intentelo de nuevo mas tarde" });
            }
        }
        else {
            return res.status(500).json(err);
        }
    })
})



module.exports = router;