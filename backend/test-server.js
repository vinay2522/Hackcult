const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/users/register', (req, res) => {
  console.log('Received registration request:', req.body);
  res.json({ message: 'Registration successful', user: req.body });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Test server running on port ${PORT}`));