const express = require('express');
const cors = require('cors');
require('dotenv').config();
const {sequelize} = require('./config/database');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);


app.get('/api/health', (req, res) => {
    res.json({status: 'OK', message: 'Server is running'});
});

sequelize.sync({alter: true})
    .then(()=> console.log('Database synced'))
    .catch(err=>console.error('Database sync error: ', err));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})