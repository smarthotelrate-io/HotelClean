const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const path = require('path');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
console.log(process.env.NODE_ENV );

const PORT = process.env.PORT || 3099;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.set('port', PORT);
app.set('env', NODE_ENV);

app.use(logger('tiny'));
app.use(bodyParser.json());

app.use('/api/clean-hotel-api', require(path.join(__dirname, 'routes/cleanHotel')));

const swaggerUi = require('swagger-ui-express');
const cleanHotelAPI = require(`./clean-hotel-api.json`);
const cleanHotelApiHtml = swaggerUi.generateHTML(cleanHotelAPI);
console.log(cleanHotelApiHtml);
app.use(`/api/clean-hotel-api/doc`, swaggerUi.serveFiles(cleanHotelAPI));
app.get(`/api/clean-hotel-api/doc`, (req, res) => { res.send(cleanHotelApiHtml) });


app.use((req, res, next) => {
  const err = new Error(`${req.method} ${req.url} Not Found`);
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
});



app.listen(PORT, () => {
  console.log(
    `Express Server started on Port ${app.get(
      'port'
    )} | Environment : ${app.get('env')}`
  );
});