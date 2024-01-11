const express = require('express');
const cors = require('cors');
const SerialPort = require('serialport').SerialPort;
const {ReadlineParser} = require('@serialport/parser-readline');
const app = express();
app.use(cors());

const port = 3000;

const server = require('http').createServer(app);
const io = require('socket.io')(server);




getTime = () => {
    let time = new Date();
    let tiempo = time.getDate()+'/'+(time.getMonth()+1)+'/'+time.getFullYear()+'-'+time.getHours()+':'+time.getMinutes()+':'+time.getSeconds();    
    return tiempo;
}

obtenerUltimosDiezElementos = (array) => {
    if (Array.isArray(array)) {
      if (array.length > 10) {
        // Si el array tiene más de 10 elementos, devolver los últimos 10
        return array.slice(-10);
      } else {
        // Si el array tiene 10 o menos elementos, devolver el array completo
        return array;
      }
    } else {
      // Manejar el caso en que no se proporciona un array
      throw new Error('Se esperaba un array como entrada.');
    }
}

getData = () => {
    return [
        { TemperatureC: 28.2, Date: getTime() },
        { TemperatureC: 27.34, Date: getTime() },
        { TemperatureC: 18.2, Date: getTime() },
        { TemperatureC: 10.32, Date: getTime() },
        { TemperatureC: 27, Date: getTime() },
        { TemperatureC: 5.344, Date: getTime() },
        { TemperatureC: 9, Date: getTime() },
        { TemperatureC: 18.32, Date: getTime() },
        { TemperatureC: 13, Date: getTime() },
        { TemperatureC: 32.23, Date: getTime() },
        { TemperatureC: 24.2, Date: getTime() },
        { TemperatureC: -2, Date: getTime() },
    ];
}

let dummyData = [];
let sensorData;

// Configurar el puerto serie (ajusta el nombre del puerto según tu configuración)
const arduinoPort = new SerialPort({ 
  path: 'COM3',
  baudRate: 9600 
});

// Configurar el parser para leer líneas del puerto serie
const parser = arduinoPort.pipe(new ReadlineParser({ delimiter: '\r\n' }));

// Manejar los datos leídos desde el puerto serie
parser.on('data', (data) => {
  console.log('Datos desde Arduino:', data);
  sensorData = data;

  // Enviar los datos a través de WebSocket a todos los clientes conectados
  io.emit('arduinoData', data);
});


// Ruta "/" de tipo GET que devuelve un JSON con datos ficticios
app.get('/', (req, res) => {
  dummyData = [{TemperatureC: sensorData, Date: getTime()}];
  res.json(dummyData);
});


// Configuración de Socket.IO para la comunicación en tiempo real
io.on('connection', (socket) => {
  console.log('Cliente conectado');
});

// Iniciar el servidor en el puerto especificado
server.listen(port, () => {
  console.log(`Servidor Express escuchando en http://localhost:${port}`);
});