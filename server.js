const cors = require('cors');
const app = require('./app');

const corsOptions = {
  origin: 'http://localhost:3000',
};

const { PORT = 3000 } = process.env;
app.use(cors(corsOptions));

app.listen(PORT, () => {
  console.log(`${PORT}`);
});
