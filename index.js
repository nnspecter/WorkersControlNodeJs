const express = require("express");
const usersRouter = require("./routes/user.routes");
const departmentsRouter = require("./routes/departments.routes")
const authRouter = require("./routes/auth.routes")
const activitiesRouter = require("./routes/activities.routes")
const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.json());
app.use('/api', usersRouter);
app.use('/api', departmentsRouter);
app.use('/api', authRouter);
app.use('/api', activitiesRouter);

app.listen(PORT, ()=>{
    console.log(`Server starts work: http://localhost:${PORT}/`)
})