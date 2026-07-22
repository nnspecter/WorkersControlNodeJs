const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY || "SECRET_KEY_RANDOM_12345";

const generateAccessToken = (id, email, role) => {
    return jwt.sign(
        { id, email, role },
        SECRET_KEY,
        { expiresIn: '24h' } 
    );
};

class AuthController{

    async startRegistration(req, res){
        try{

            const { email, password, role, full_name, position, department_id } = req.body;
            
            const candidate = await db.query("SELECT * FROM users WHERE email = $1", [email]);    
            if (candidate.rows.length > 0) {
                return res.status(400).json({ message: "Пользователь с таким email уже существует" });
            }
    
            if (!password || password.length < 8) {
                return res.status(400).json({ message: "Пароль должен содержать минимум 8 символов" });
            }
            const hashPassword = await bcrypt.hash(password, 10);
    
            if (department_id) {
                const findDepartment = await db.query("SELECT * FROM departments WHERE id = $1", [department_id]);
                if (findDepartment.rows.length === 0) {
                    return res.status(404).json({ message: "Указанного департамента не существует" });
                }
            }
            
            const userRole = role || 'WORKER';

            const newUser = await db.query(
                "INSERT INTO users (email, password, role, full_name, position, department_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, role, full_name, position, department_id",
                [email, hashPassword, userRole, full_name, position, department_id || null]
            );

            const token = generateAccessToken(
                newUser.rows[0].id, 
                newUser.rows[0].email, 
                newUser.rows[0].role
            );

            return res.status(201).json({
                token,
                user: newUser.rows[0]
            });

        }

        catch (error) {
            return res.status(500).json({ message: "Ошибка при регистрации", error: error.message });
        }
    }

    async startLogin(req, res){
        try {
            const { email, password } = req.body;

            if (!password || password.length < 8) {
                return res.status(400).json({ message: "Пароль должен содержать минимум 8 символов" });
            }

            const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);
            if (user.rows.length === 0) {
                return res.status(400).json({ message: `Неверный email или пароль` });
            }

            const validPassword = await bcrypt.compare(password, user.rows[0].password);
            if (!validPassword) {
                return res.status(400).json({ message: "Неверный email или пароль" });
            }

            const token = generateAccessToken(
                user.rows[0].id,
                user.rows[0].email,
                user.rows[0].role
            );

            const { password: _, ...userData } = user.rows[0];
            return res.json({ token, user: userData });

        } catch (error) {
            return res.status(500).json({ message: "Ошибка при входе", error: error.message });
        }
    }

    async check(req, res) {
        const token = generateAccessToken(req.user.id, req.user.email, req.user.role);
        return res.json({ token, user: req.user });
    }
};

module.exports = new AuthController();