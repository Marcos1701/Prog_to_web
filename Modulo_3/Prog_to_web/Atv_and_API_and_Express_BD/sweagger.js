const swaggerAutogen = require('swagger-autogen')()

const newLocal = './swagger.json';
swaggerAutogen(newLocal, ['./Atv_com_bd.js']);