const db = require('../db');

class UsersController {
    async createUser(req, res){
        try{
            const { email, password, role, full_name, position, department_id } = req.body;
    
            if(department_id){
                const findDepartment = await db.query("SELECT * FROM departments WHERE id = $1", [department_id]);
                if(findDepartment.rows.length === 0){
                    return res.status(404).json({message: "Департамента не существует"})
                } 
            }
    
            const newPerson = await db.query(
                "INSERT INTO users (email, password, role, full_name, position, department_id) values ($1, $2, $3, $4, $5, $6) RETURNING *",
                [email, password, role, full_name, position, department_id]
            );
            return res.status(201).json(newPerson.rows[0]);
        }
        catch(error){
            return res.status(500).json({ message: "Ошибка сервера", error: error.message });
        }
    }

    async getUsers(req, res){
        try{
            const allUsers = await db.query("SELECT * FROM users");
            return res.json(allUsers.rows);
        }
        catch(error){
            return res.status(500).json({ message: "Ошибка сервера", error: error.message });
        }
    }

    async getOneUser(req, res){
        try{
            const { id } = req.params;
            const currentUser = await db.query("SELECT * FROM users WHERE id = $1", [id])
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
            if(department_id){
                const findDepartment = await db.query("SELECT * FROM departments WHERE id = $1", [department_id]);
                if(findDepartment.rows.length === 0){
                    return res.status(404).json({message: "Департамента не существует"})
                } 
            }

            const updatedUser = await db.query(
                "UPDATE users SET (email, password, role, full_name, position, department_id) = ($2, $3, $4, $5, $6, $7) WHERE id = $1 RETURNING *",
                [id, email, password, role, full_name, position, department_id]
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
        try{
            const { id } = req.params;
            const deletedUser = await db.query("DELETE FROM users WHERE id=$1 RETURNING *",[id]);

            if(deletedUser.rows.length === 0 ){
                return res.status(404).json({ message: `Пользователь c id=${id} не найден` });
            }

            return res.json({ 
                message: "Пользователь успешно удален", 
                user: deletedUser.rows[0] 
            });
        }
        catch(error){
            return res.status(500).json({ message: "Ошибка сервера", error: error.message });
        }
    }

};

module.exports = new UsersController();