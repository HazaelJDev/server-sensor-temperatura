const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
app.use(cors());

const server = require('http').createServer(app);
const io = require('socket.io')(server);
const five = require('johnny-five');
var SerialPort = require("serialport").SerialPort;



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

// Configuración del puerto serial (ajusta el nombre del puerto según tu configuración)
//const arduinoPort = new five.Port({ port: "COM3" });
/*const arduinoPort = new SerialPort("COM3", {
  baudrate: 9600,
  buffersize: 1
});*/

// Inicializar el objeto de la placa
//const board = new five.Board({ port: arduinoPort });
const board = new five.Board({});


// Esperar a que la placa esté lista
board.on('ready', () => {
  console.log('Arduino está listo.');
  //serialPort = five.SerialPort(arduinoPort);
  serialPort = five.SerialPort({
    port: "COM3",
    baudrate: 9600,
  });

  serialPort.on('open', () => {
    console.log('Serial port opened!');
  });

  serialPort.on('data', (data) => {
    console.log(`Data received: ${data}`);
    sensorData = data;
    // Enviar el valor del sensor a través de Socket.IO
    io.emit('sensorData', data);
  });
  
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