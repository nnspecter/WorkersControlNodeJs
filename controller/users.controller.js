const db = require('../db');
const bcrypt = require('bcryptjs');

class UsersController {
    async createUser(req, res){
        try{
            const { email, password, role, full_name, position, department_id } = req.body;

            const existingUser = await db.query(
                "SELECT * FROM users WHERE email = $1", 
                [email]
            );
            if (existingUser.rows.length > 0) {
                return res.status(400).json({ message: "Пользователь с таким email уже существует" });
            }

            if(department_id){
                const findDepartment = await db.query("SELECT * FROM departments WHERE id = $1", [department_id]);
                if(findDepartment.rows.length === 0){
                    return res.status(404).json({message: "Департамента не существует"})
                } 
            }

            const hashPassword = await bcrypt.hash(password, 10);
    
            const newPerson = await db.query(
                "INSERT INTO users (email, password, role, full_name, position, department_id) values ($1, $2, $3, $4, $5, $6) RETURNING id, email, role, full_name, position, department_id",
                [email, hashPassword, role, full_name, position, department_id]
            );
            return res.status(201).json(newPerson.rows[0]);
        }
        catch(error){
            return res.status(500).json({ message: "Ошибка сервера", error: error.message });
        }
    }

    async getUsers(req, res){
        try{
            const allUsers = await db.query("SELECT id, email, role, full_name, position, department_id FROM users");
            return res.json(allUsers.rows);
        }
        catch(error){
            return res.status(500).json({ message: "Ошибка сервера", error: error.message });
        }
    }

    async getOneUser(req, res){
        try{
            const { id } = req.params;
            const currentUser = await db.query("SELECT id, email, role, full_name, position, department_id FROM users WHERE id = $1", [id])
            if(currentUser.rows.length === 0){
                return res.status(404).json({ message: `Пользователь c id=${id} не найден` });
            }
            return res.json(currentUser.rows[0]);
        }
        catch(error){
            return res.status(500).json({ message: "Ошибка сервера", error: error.message });
        }
    }

    async changeUser(req, res){
        try{
            const { id } = req.params;
            const { email, password, role, full_name, position, department_id } = req.body;

            //проверка на отсутствие полей
            const requiredFields = { email, password, role, full_name, position, department_id };
            const missingFields = Object.entries(requiredFields)
                .filter(([_, value]) => value === undefined || value === null || value === "")
                .map(([key]) => key);
            if (missingFields.length > 0) {
                return res.status(400).json({ 
                    message: "Не заполнены обязательные поля", 
                    fields: missingFields 
                });
            }

            const findDepartment = await db.query("SELECT * FROM departments WHERE id = $1", [department_id]);
            if(findDepartment.rows.length === 0){
                return res.status(404).json({message: "Департамента не существует"});
            } 
            
            const existingUser = await db.query(
                "SELECT id FROM users WHERE email = $1 AND id != $2", 
                [email, id]
            );
            if (existingUser.rows.length > 0) {
                return res.status(400).json({ message: "Пользователь с таким email уже существует" });
            }
            
            const hashPassword = await bcrypt.hash(password, 10);

            const updatedUser = await db.query(
                "UPDATE users SET (email, password, role, full_name, position, department_id) = ($2, $3, $4, $5, $6, $7) WHERE id = $1 RETURNING id, email, role, full_name, position, department_id",
                [id, email, hashPassword, role, full_name, position, department_id]
            ); 
            if(updatedUser.rows.length === 0){
                return res.status(404).json({ message: `Пользователь c id=${id} не найден` });
            }
            return res.json(updatedUser.rows[0]);
        }
        catch(error){
            return res.status(500).json({ message: "Ошибка сервера", error: error.message });
        }
    }

    async deleteUser(req, res){
        let client;

        try{
            //пулл соединений для изоляции операции
            client = await db.connect();
            const { id } = req.params;

            await client.query("BEGIN");
            const deletedActivities = await client.query(
                "DELETE FROM activities WHERE user_id = $1 RETURNING *",
                [id]
            );
            const deletedUser = await client.query(
                "DELETE FROM users WHERE id=$1 RETURNING *",
                [id]
            );
            if(deletedUser.rows.length === 0 ){
                await client.query("ROLLBACK");
                return res.status(404).json({ message: `Пользователь c id=${id} не найден` });
            }

            await client.query('COMMIT');

            return res.json({ 
                message: "Пользователь успешно удален", 
                user: deletedUser.rows[0],
                activities: deletedActivities.rows 
            });
        }
        catch(error){
            if (client) {
                try{
                    await client.query("ROLLBACK");
                }
                catch(rollbackError){
                    console.error("Ошибка при откате", rollbackError);
                }
            }
            return res.status(500).json({ message: "Ошибка сервера", error: error.message });
        }
        finally{
            if (client) {
                client.release();
            }
        }
    }

};

module.exports = new UsersController();