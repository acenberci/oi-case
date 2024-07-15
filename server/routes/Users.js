const express = require("express")
const router = express.Router()
const { Users } = require("../models")
const { validateToken } = require("../middlewares/AuthMiddleware.js")
const { sign } = require("jsonwebtoken")
const bcrypt = require('bcrypt');

router.post("/register", async (req, res) => {
    const { name, surname, email, password, phoneNumber,birthDate } = req.body
    const filteredUser2 = await Users.findOne({ where: { email: email } })

    if (!filteredUser2) {
        const filteredUser = await Users.findOne({ where: { phoneNumber: phoneNumber } })
        if (!filteredUser) {
            bcrypt.hash(password, 10, function (err, hash) {
                if (err) {
                    res.json("Şifre hashlenirken bir sorun oluştu.")
                } else {
                    Users.create({
                        name: name,
                        surname: surname,
                        email: email,
                        password: hash,
                        phoneNumber: phoneNumber,
                        birthDate: birthDate,
                    })
                    res.json("Başarılı Bir Şekilde Kayıt Oldunuz")
                }
            });
        }
        else {
            res.json({ error: "Sistemimize bu telefon numarası ile kayıtlı başka bir kullanıcı var." })
        }


    } else {
        res.json({ error: "Sistemimizde bu e-mail ile kayıtlı başka bir kullanıcı var." })
    }
})
router.post("/login", async (req, res) => {

    const { email, password } = req.body
    const filteredUser = await Users.findOne({ where: { email: email } })
    bcrypt.compare(password, filteredUser.password, function (err, result) {
        if (result) {
            const accessToken = sign({ name: filteredUser.name, surname: filteredUser.surname, email: filteredUser.email, id: filteredUser.id, password: filteredUser.password }, "USKEY")
            res.json({ token: accessToken, user: filteredUser })
        }
        else { res.json({ error: "Kullanıcı adı veya şifre hatalı." }) }

    })

})

router.get("/auth", validateToken, async (req, res) => {
    const loggedUser = await Users.findOne({ where: { email: req.user.email } })
    if (loggedUser) {
        if (loggedUser.password === req.user.password) {
            res.json(req.user)
        }
    } else {
        res.json({ error: "Data is not correct" })
    }
})

module.exports = router