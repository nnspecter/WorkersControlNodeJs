const express = require("express");
const usersRouter = require("./routes/user.routes");
const departmentsRouter = require("./routes/departments.routes")
const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.json());
app.use('/api', usersRouter);
app.use('/api', departmentsRouter);

app.listen(PORT, ()=>{
    console.log(`Server starts work: http://localhost:${PORT}/`)
})