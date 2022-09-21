const cors = require('cors');
const app = require('./app');

const { PORT = 3000 } = process.env;
app.use(cors());

app.listen(PORT, () => {
  console.log(`${PORT}`);
});
