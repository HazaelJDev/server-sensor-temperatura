const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());


let secondAdvance = 0;

getTime = () => {
    let time = new Date();
    let tiempo = time.getDate()+'/'+(time.getMonth()+1)+'/'+time.getFullYear()+'-'+time.getHours()+':'+time.getMinutes()+':'+(time.getSeconds()+secondAdvance);
    secondAdvance = secondAdvance + 1;
    if (secondAdvance >= 11) {
        secondAdvance = 0;
    }
    
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

// Ruta "/" de tipo GET que devuelve un JSON con datos ficticios
app.get('/', (req, res) => {
    dummyData = getData();
  res.json(dummyData);
});

// Iniciar el servidor en el puerto especificado
app.listen(port, () => {
  console.log(`Servidor Express escuchando en http://localhost:${port}`);
});