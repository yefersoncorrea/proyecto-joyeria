const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

//api para agregar una nueva categoria
router.post('/add', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    let categoria = req.body;
    query = "insert into categoria (nombre) values(?)";
    connection.query(query, [categoria.nombre], (err, results) => {
        if (!err) {
            return res.status(200).json({ message: "Categoria agregada con exito" });
        }
        else {
            return res.status(500).json(err);
        }
    })
})

//api para obtener todas las categorias
router.get('/get', auth.authenticateToken, (req, res, next) => {
    var query = "select *from categoria order by nombre";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.patch('/update', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    let producto = req.body;
    var query = "update categoria set nombre=? where id=?";
    connection.query(query, [producto.nombre, producto.id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "id de categoria no encontrada" });
            }
            return res.status(200).json({ message: "Categoria actualizada exitosamente" });
        }
        else {
            return res.status(500).json(err);
        }
    })
})

module.exports = router;