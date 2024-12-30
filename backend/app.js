const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const companyRoutes = require('./routes/companyRoutes');
const communicationMethodRoutes = require('./routes/communicationRoutes'); 
const communicationLogRoutes = require('./routes/communicationLogRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true, 
}));

app.use('/api/auth', authRoutes);

app.use('/api', companyRoutes);

app.use('/api/communication-methods', communicationMethodRoutes); 

app.use('/api', communicationLogRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
