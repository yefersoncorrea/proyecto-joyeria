const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

//api de producto
router.post('/add', auth.authenticateToken, checkRole.checkRole, (req, res) => {
    let producto = req.body;
    var query = "insert into producto (nombre,categoriaId,descripcion,precio,status) values(?,?,?,?,'true')";
    connection.query(query, [producto.nombre, producto.categoriaId, producto.descripcion, producto.precio], (err, results) => {
        if (!err) {
            return res.status(200).json({ mensaje: "El producto se agrego exitosamente." });
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.get('/get', auth.authenticateToken, (req, res, next) => {
    var query = "select p.id,p.nombre,p.descripcion,p.precio,p.status,c.id as categoriaId,c.nombre as nombreCategoria from producto as p INNER JOIN categoria as c where p.categoriaId = c.id";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.get('/getByCategoria/:id', auth.authenticateToken, (req, res, next) => {
    const id = req.params.id;
    var query = "select id,nombre from producto where categoriaId= ? and status= 'true'";
    connection.query(query, [id], (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.get('/getById/:id', auth.authenticateToken, (req, res, next) => {
    const id = req.params.id;
    var query = "select id,nombre,descripcion,precio from producto where id = ?";
    connection.query(query, [id], (err, results) => {
        if (!err) {
            return res.status(200).json(results[0]);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

//api para actualizar el producto
router.patch('/update', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    let producto = req.body;
    var query = "update producto set nombre=?,categoriaId=?,descripcion=?,precio=? where id=?";
    connection.query(query, [producto.nombre, producto.categoriaId, producto.descripcion, producto.precio, producto.id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ mensaje: "id de producto no encontrado" });
            }
            return res.status(200).json({ mensaje: "Poducto actualizado exitosamente." });
        }
        else {
            return res.status(500).json(err);
        }
    })
})

//api para eliminar un producto
router.delete('/delete/:id', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    const id = req.params.id;
    var query = "delete from producto where id=?";
    connection.query(query, [id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ mensaje: "id del producto no se encuentra." });
            }
            return res.status(200).json({ mensaje: "El producto se elimino correctamente." });
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.patch('/updateStatus',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
    let user = req.body;
    var query = "update producto set status=? where id=?";
    connection.query(query,[user.status,user.id],(err,results)=>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({mensaje:"id del producto no se encuentra."});
            }
            return res.status(200).json({mensaje:"Estado del producto actualizado correctamente."});
        }
        else{
            return res.status(500).json(err);
        }
    })
})

module.exports = router;