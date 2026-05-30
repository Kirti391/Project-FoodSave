const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
// REGISTER
router.post('/register', async (req, res) => {

    try {

        const {

            name,
            email,
            password,
            phone,
            role

        } = req.body;

        // CHECK USER EXISTS

        const checkSql = 'SELECT * FROM users1 WHERE email = ?';

        db.query(checkSql, [email], async (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({

                    success: false,
                    message: 'Database Error'

                });

            }

            // USER EXISTS

            if (result.length > 0) {

                return res.json({

                    success: false,
                    message: 'User Already Exists'

                });

            }

            // HASH PASSWORD

            const hashedPassword = await bcrypt.hash(password, 10);

            // INSERT USER

            const sql = `

                INSERT INTO users1(

                    name,
                    email,
                    password,
                    phone,
                    role

                )

                VALUES (?, ?, ?, ?, ?)

            `;

            db.query(

                sql,

                [

                    name,
                    email,
                    hashedPassword,
                    phone,
                    role

                ],

                (err) => {

                    if (err) {

                        console.log(err);

                        return res.status(500).json({

                            success: false,
                            message: 'Registration Failed'

                        });

                    }

                    res.json({

                        success: true,
                        message: 'User Registered Successfully'

                    });

                }

            );

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,
            message: 'Server Error'

        });

    }

});
// LOGIN

router.post('/login', (req, res) => {

    try {

        const {

            email,
            password

        } = req.body;

        const sql = 'SELECT * FROM users1 WHERE email = ?';

        db.query(sql, [email], async (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({

                    success: false,
                    message: 'Database Error'

                });

            }

            // USER NOT FOUND

            if (result.length === 0) {

                return res.json({

                    success: false,
                    message: 'Invalid Email'

                });

            }

            const user = result[0];

            // CHECK PASSWORD

            const isMatch = await bcrypt.compare(

                password,
                user.password

            );

            if (!isMatch) {

                return res.json({

                    success: false,
                    message: 'Invalid Password'

                });

            }

            // JWT TOKEN

            const token = jwt.sign(

                {

                    id: user.id,
                    role: user.role

                },

                'foodsave_secret',

                {

                    expiresIn: '7d'

                }

            );

            // SUCCESS

            res.json({

                success: true,

                message: 'Login Successful',

                token,

                user: {

                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role

                }

            });

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,
            message: 'Server Error'

        });

    }

});

module.exports = router;