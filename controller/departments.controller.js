const db = require('../db');

class DepartmentController {
    async createDepartment(req, res){
        try{
            const { name } = req.body;
            if (!name) {
                return res.status(400).json({ message: "Укажите название департамента" });
            }

            const existingDepartment = await db.query(
                "SELECT * FROM departments WHERE name = $1", 
                [name]
            );
            if (existingDepartment.rows.length > 0) {
                return res.status(400).json({ message: "Департамент с таким названием уже существует" });
            }

            const newDepartment = await db.query(" INSERT INTO departments (name) values ($1) RETURNING *", [name]);
            return res.status(201).json(newDepartment.rows[0]);
        }
        catch(error){
            return res.status(500).json({ message: "Ошибка сервера", error: error.message })
        }
    };

    async getDepartments(req, res){
        try{
            const allDepartments = await db.query("SELECT * FROM departments");
            return res.json(allDepartments.rows);
        }
        catch(error){
          return res.status(500).json({ message: "Ошибка сервера", error: error.message });
        }
    };

    async getOneDepartment(req, res){
        try{
            const { id } = req.params;
            const currentDepartment = await db.query("SELECT * FROM departments Where id = $1", [id]);
        
            if(currentDepartment.rows.length === 0 ){
                return res.status(404).json({message: "Департамент не найден"});
            };

            return res.json(currentDepartment.rows[0]);
        }
        catch(error){
            return res.status(500).json({message: "Ошибка сервера", error: error.message})
        }
    }

    async changeDepartment(req, res){
        try{
            const { id } = req.params;
            const { name } = req.body;
            const updatedDepartment = await db.query("UPDATE departments SET name = $2 WHERE id = $1 RETURNING *", [id, name])
            
            if(updatedDepartment.rows.length === 0){
                return res.status(404).json({message: `Департамент с id= ${id}  не найден`})
            }

            return res.json(updatedDepartment.rows[0]);
        }
        catch(error){
            return res.status(500).json({message: "Ошибка сервера", error: error.message})
        }
    };

    async deleteDepartment(req, res){
        try{
            const { id } = req.params;
            const deletedDepartment = await db.query("DELETE FROM departments WHERE id = $1 RETURNING *", [id]);

            if(deletedDepartment.rows.length === 0){
                return res.status(404).json({ message: `Департамент с id = ${id} не найден` });
            }

            return res.json({ 
                message: "Департамент успешно удален", 
                department: deletedDepartment.rows[0] 
            });
        }
        catch(error){
            return res.status(500).json({message: "Ошибка сервера", error: error.message})
        }
    }

};

module.exports = new DepartmentController();