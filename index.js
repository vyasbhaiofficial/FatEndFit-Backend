require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const { user_auth } = require('./middleware/authorization/authorization.js');
const { check_validation } = require('./utils/validateRequest.js');
const swaggerSpec = require('./utils/swagger.js');
const route = require('./src/routes/index.route.js');
require('./middleware/database/connectDatabase.js');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(`${process.env.API_COMMON_ROUTE}/uploads`, express.static(path.join(__dirname, 'uploads')));

app.use(`${process.env.API_COMMON_ROUTE}/api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(`${process.env.API_COMMON_ROUTE}`, user_auth, check_validation, route);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Magic happens on port ${PORT}`);
});
