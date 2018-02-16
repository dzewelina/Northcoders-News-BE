const app = require('./server');

let PORT;
if (process.env.NODE_ENV === 'production') PORT = process.env.PORT;
else PORT = require('./config').PORT[process.env.NODE_ENV];

app.listen(PORT, function () {
  console.log(`listening on port ${PORT}`);
});