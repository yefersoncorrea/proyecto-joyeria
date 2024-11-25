const express = require("express");
const connection = require("../connection");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();
var auth = require("../services/authentication");
var checkRole = require("../services/checkRole");

//API de registro de usuario
router.post("/signup", async (req, res) => {
  const user = req.body;

  // Expresión regular para validar la contraseña
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

  // Validar formato de la contraseña
  if (!passwordRegex.test(user.contrasena)) {
    return res.status(400).json({
      message:
        "La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, una letra minúscula y un número.",
    });
  }

  // Verificar si el email ya está registrado
  const query = "SELECT email FROM user WHERE email=?";
  connection.query(query, [user.email], async (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length) {
      return res.status(400).json({ message: "Correo electrónico ya registrado." });
    }

    try {
      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(user.contrasena, 10);

      // Insertar usuario en la base de datos
      const insertQuery =
        "INSERT INTO user(nombre, numeroContacto, email, contrasena, status, rol) VALUES (?, ?, ?, ?, 'false', 'user')";
      connection.query(
        insertQuery,
        [user.nombre, user.numeroContacto, user.email, hashedPassword],
        (err, results) => {
          if (!err) {
            return res.status(200).json({ message: "Usuario registrado con éxito." });
          } else {
            return res.status(500).json(err);
          }
        },
      );
    } catch (hashError) {
      return res.status(500).json({ message: "Error al encriptar la contraseña." });
    }
  });
});


//API de inicio de sesion
router.post("/login", async (req, res) => {
  const user = req.body;

  // Buscar usuario por email
  const query = "SELECT email, contrasena, rol, status FROM user WHERE email=?";
  connection.query(query, [user.email], async (err, results) => {
    if (err) return res.status(500).json(err);

    if (!results.length) {
      return res.status(401).json({ message: "Usuario o contraseña incorrectos." });
    }

    const dbUser = results[0];

    try {
      // Comparar la contraseña ingresada con el hash en la base de datos
      const isPasswordMatch = await bcrypt.compare(user.contrasena, dbUser.contrasena);

      if (!isPasswordMatch) {
        return res.status(401).json({ message: "Usuario o contraseña incorrectos." });
      }

      if (dbUser.status === "false") {
        return res
          .status(401)
          .json({ message: "Espere la aprobación del administrador." });
      }

      // Generar token de acceso con JWT
      const response = { email: dbUser.email, rol: dbUser.rol };
      const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, {
        expiresIn: "8h",
      });

      return res.status(200).json({ token: accessToken });
    } catch (compareError) {
      return res.status(500).json({ message: "Error al verificar la contraseña." });
    }
  });
});


var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

router.post("/forgotPassword", (req, res) => {
  const user = req.body;
  query = "select email,contrasena from user where email=?";
  connection.query(query, [user.email], (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        return res.status(200).json({
          mesage: "Contraseña enviada correctamente a su correo electronico.",
        });
      } else {
        var mailOptions = {
          from: process.env.EMAIL,
          to: results[0].email,
          subject: "Contraseña del proyecto Joyeria Gamma",
          html:
            "<p><b>Sus datos para el inicio de sesion para el proyecto joyeria</b><br><b>Correo electronico: </b>" +
            results[0].email +
            "<br><b>Contraseña: </b>" +
            results[0].contrasena +
            '<br><a href="http://localhost:4200/">Click aqui para iniciar sesion</a></p>',
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Enviar un correo electronico: " + info.response);
          }
        });
        return res.status(200).json({
          mesage: "Contraseña enviada correctamente a su correo electronico.",
        });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});

//api para obtener todos los usuarios
router.get("/get", auth.authenticateToken, checkRole.checkRole, (req, res) => {
  var query =
    "select id,nombre,email,numeroContacto,status from user where rol='user'";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json(results);
    } else {
      return res.status(500).json(err);
    }
  });
});

//api de actualizacion de estatus
router.patch(
  "/update",
  auth.authenticateToken,
  checkRole.checkRole,
  (req, res) => {
    let user = req.body;
    var query = "update user set status=? where id=?";
    connection.query(query, [user.status, user.id], (err, results) => {
      if (!err) {
        if (results.affectedRows == 0) {
          return res
            .status(404)
            .json({ message: "El id del usuario no existe" });
        }
        return res
          .status(200)
          .json({ message: "Usuario actualizado exitosamente" });
      } else {
        return res.status(500).json(err);
      }
    });
  },
);

router.get("/checkToken", auth.authenticateToken, (req, res) => {
  return res.status(200).json({ mensaje: "true" });
});

//api de cambio de contraseña
router.post("/changePassword", auth.authenticateToken, async (req, res) => {
  const user = req.body;
  const email = res.locals.email;

  const query = "SELECT contrasena FROM user WHERE email=?";
  connection.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length <= 0) {
      return res.status(400).json({ message: "Usuario no encontrado." });
    }

    const storedPassword = results[0].contrasena;

    try {
      // Verificar si la contraseña es encriptada o texto plano
      const isPasswordMatch =
        storedPassword.startsWith("$2b$")
          ? await bcrypt.compare(user.oldPassword, storedPassword) // Comparar hash
          : storedPassword === user.oldPassword; // Comparar texto plano

      if (!isPasswordMatch) {
        return res.status(400).json({ message: "La contraseña anterior es incorrecta." });
      }

      // Validar formato de la nueva contraseña
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (!passwordRegex.test(user.newPassword)) {
        return res.status(400).json({
          message:
            "La nueva contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, una letra minúscula y un número.",
        });
      }

      // Encriptar la nueva contraseña
      const newHashedPassword = await bcrypt.hash(user.newPassword, 10);

      // Actualizar la contraseña en la base de datos
      const updateQuery = "UPDATE user SET contrasena=? WHERE email=?";
      connection.query(updateQuery, [newHashedPassword, email], (err, results) => {
        if (err) return res.status(500).json(err);

        return res.status(200).json({ message: "La contraseña se actualizó con éxito." });
      });
    } catch (error) {
      return res.status(500).json({ message: "Error al procesar la solicitud." });
    }
  });
});



module.exports = router;
