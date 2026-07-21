const db = require('../db');

class UsersController {
    async createUser(req, res){
        try{
            const {email, password, role, full_name, position, department_id } = req.body;
    
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

    }

    async getOneUser(req, res){

    }

    async changeUser(req, res){

    }

    async deleteUser(req, res){

    }

};

module.exports = new UsersController();