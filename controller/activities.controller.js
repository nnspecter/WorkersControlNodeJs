const db = require('../db');

//статус можно менять каждые полчаса, если полчаса не прошло, изменяется старая запись
class ActivitiesController {
    async createActivity(req, res){
        try{
            const { id } = req.user;
            const { status } = req.body;

            if (!status) {
                return res.status(400).json({ message: "Вы не отправили статус" });
            }

            const userLastActivity = await db.query("SELECT * FROM activities WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1", [id]);
            const lastActivity = userLastActivity.rows[0];
            const msToChange = 30 * 60 * 1000;
            const nowDate = new Date();
            
            if(lastActivity && (nowDate - new Date(lastActivity.updated_at)) < msToChange){
                const updatedActivity = await db.query(
                    "UPDATE activities SET status = $1, date = CURRENT_DATE, updated_at = NOW() WHERE id= $2 RETURNING *",
                    [status, lastActivity.id]
                );
                return res.status(200).json({message: "Запись обновлена", data: updatedActivity.rows[0] })
            }

            const newActivity = await db.query(" INSERT INTO activities (user_id, status) values ($1, $2) RETURNING *", [id, status]);
            return res.status(201).json({message: "Запись добавлена", data: newActivity.rows[0]});
        }
        catch(error){
            return res.status(500).json({ message: "Ошибка сервера", error: error.message })
        }
    };

    async getActivities(req, res){
        
        try{
            const { id, role } = req.user;
            if(role === "ADMIN"){
                const allActivities = await db.query("SELECT * FROM activities");
                return res.json(allActivities.rows);
            }
            const allActivities = await db.query("SELECT * FROM activities WHERE user_id = $1", [id]);
            return res.json(allActivities.rows);
        }
        catch(error){
          return res.status(500).json({ message: "Ошибка сервера", error: error.message });
        }
    };

    async getOneActivity(req, res){
        try{
            const { id } = req.user;
            const { activityId } = req.params;
            const currentActivity = await db.query("SELECT * FROM activities WHERE user_id = $1, id = $2", [id, activityId]);
        
            if(currentActivity.rows.length === 0 ){
                return res.status(404).json({message: "Запись не найдена"});
            };

            return res.json(currentDepartment.rows[0]);
        }
        catch(error){
            return res.status(500).json({message: "Ошибка сервера", error: error.message})
        }
    }


    async deleteActivity(req, res){
        try{
            const { id } = req.params;
            const deletedActivity = await db.query("DELETE FROM activities WHERE id = $1 RETURNING *", [id]);

            if(deletedActivity.rows.length === 0){
                return res.status(404).json({ message: `Активность с id = ${id} не найдена` });
            }

            return res.json({ 
                message: "Активность удалена", 
                department: deletedDepartment.rows[0] 
            });
        }
        catch(error){
            return res.status(500).json({message: "Ошибка сервера", error: error.message})
        }
    }

};

module.exports = new ActivitiesController();