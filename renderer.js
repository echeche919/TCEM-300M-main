document.addEventListener("DOMContentLoaded", () => {

  // --- Estado y constantes ---
  const estado = {
    buffer: "",
    port: null,
    dataVector1: [],
    dataVector2: [],
    dataVector3: [],
    dataVector4: [],
    dataVector5: [],
    dataVector6: [],
    dataVector7: [],
    dataVector8: [],
    dataVector9: [],
    dataVector10: [],
    dataVector11: [],
    dataVector12: [],
    Vector1Prom: 0,
    Vector2Prom: 0,
    Vector5Prom: 0,
    Vector6Prom: 0,
    Vector7Prom: 0,
    Vector8Prom: 0,
    Vector9Prom: 0,
    Vector10Prom: 0,
    Vector11Prom: 0,
    Vector12Prom: 0,

    receivingVector: 1,
    aux: 0,
    MPU: null
  };
  let numValores = 0;
  const ESP = [
    { vendorId: '1A86', productIds: ['7584', '5584', '5523', '752d', '7523', 'e008', '7522'] },
    { vendorId: '10C4', productIds: ['EA60'] }
  ]
  let prueba = 1, Xacel = 0, Yacel = 0, Zacel = 0, XGir = 0, YGir = 0, ZGir = 0, Xacel2 = 0, Yacel2 = 0, Zacel2 = 0, XGir2 = 0, YGir2 = 0, ZGir2 = 0;
  const labels = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20, 20.5, 21, 21.5, 22, 22.5, 23, 23.5, 24, 24.5, 25, 25.5, 26, 26.5, 27, 27.5, 28, 28.5, 29, 29.5, 30, 30.5, 31, 31.5, 32, 32.5, 33, 33.5, 34, 34.5, 35, 35.5, 36, 36.5, 37, 37.5, 38, 38.5, 39, 39.5, 40, 40.5, 41, 41.5, 42, 42.5, 43, 43.5, 44, 44.5, 45, 45.5, 46, 46.5, 47, 47.5, 48, 48.5, 49, 49.5, 50];
  // --- Elementos UI --- 
  const PORTID = document.getElementById("port");
  const toggleBtn = document.getElementById("Modo Oscuro");
  const tablaBody1 = document.querySelector("#tablaValores1 tbody");
  const tablaBody2 = document.querySelector("#tablaValores2 tbody");
  const tablaBody3 = document.querySelector("#tablaValores3 tbody");
  const tablaBody4 = document.querySelector("#tablaValores4 tbody");
  const tablaBody5 = document.querySelector("#tablaValores5 tbody");
  const tablaBody6 = document.querySelector("#tablaValores6 tbody");

  const tablaModal = document.querySelector("#tablaModal tbody");
  const modal = document.getElementById('myModal');
  const body = document.getElementById('Body');
  const valMostrado = document.getElementById('valMostrado');
  const valMostrado1 = document.getElementById('valMostrado1');
  const valMostrado2 = document.getElementById('valMostrado2');
  const valMostrado3 = document.getElementById('valMostrado3');
  const valMostrado4 = document.getElementById('valMostrado4');
  const valMostrado5 = document.getElementById('valMostrado5');
  const valMostrado6 = document.getElementById('valMostrado6');
  const valMostrado7 = document.getElementById('valMostrado7');
  const valMostrado8 = document.getElementById('valMostrado8');
  const valMostrado9 = document.getElementById('valMostrado9');
  const valMostrado10 = document.getElementById('valMostrado10');
  const valMostrado11 = document.getElementById('valMostrado11');

  const iconoModo = document.getElementById("icono-modo");
  const textoModo = document.getElementById("texto-modo");

  const Save = document.getElementById("Save");
  const Mode = document.getElementById("mode");
  const time = document.getElementById("time");

  function CreateChart(chartId, name) {
  const ctx = document.getElementById(chartId).getContext("2d");

    return new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          backgroundColor: "rgba(0, 0, 255, 0.6)",
          pointBackgroundColor: "hsla(30, 51%, 27%, 1) ",
          lineBackgroundColor: "hsla(26, 95%, 90%, 1)",
          data: []
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 30,
            min: -30,
            title: { display: true, text: name, color: "#222" },
            ticks: { color: "#222" }
          },
          x: {
            beginAtZero: true,
            max: 50,
            title: { display: true, text: 'Segundos', color: "#222" },
            ticks: { color: "#222", stepSize: 0.5 },
          }
        },
        plugins: {
          legend: { labels: { color: "#222" } }
        }
      }
    }
    );
  };


  // --- Inicialización UI ---
  function inicializarUI() {
    PORTID.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Buscando TromerBench`;
    PORTID.className = "badge bg-warning text-dark p-2 fs-6";
  }
  // --- Chart ---
  const myChart = CreateChart("myChart", "Aceleracion Z");
  const myChart2 = CreateChart("myChart2", "Aceleracion X");
  const myChart3 = CreateChart("myChart3", "Aceleracion Y");
  const myChart4 = CreateChart("myChart4", "Giroscopio X");
  const myChart5 = CreateChart("myChart5", "Giroscopio Y");
  const myChart6 = CreateChart("myChart6", "Giroscopio Z");
  const myChart7 = CreateChart("myChart7", "Aceleracion X");
  const myChart8 = CreateChart("myChart8", "Aceleracion Y");
  const myChart9 = CreateChart("myChart9", "Aceleracion Z");
  const myChart10 = CreateChart("myChart10", "Giroscopio Z");
  const myChart11 = CreateChart("myChart11", "Giroscopio X");
  const myChart12 = CreateChart("myChart12", "Giroscopio Y");

  // --- Tema ---
  function aplicarTema(modoOscuro) {
    if (modoOscuro) {
      document.body.classList.add("dark-mode");
      toggleBtn.classList.remove("tema-claro");
      toggleBtn.classList.add("tema-oscuro");
      iconoModo.textContent = "☀️";
      textoModo.textContent = "Modo Claro";
      myChart.options.scales.x.title.color = "rgb(255, 255, 255)";
      myChart.options.scales.y.title.color = "rgb(255, 255, 255)";
      myChart.options.scales.x.ticks.color = "rgb(255, 255, 255)";
      myChart.options.scales.y.ticks.color = "rgb(255, 255, 255)";
      myChart.data.datasets[0].backgroundColor = "rgba(0, 212, 255, 0.7)";
      myChart.options.plugins.legend.labels.color = "rgb(255, 255, 255)";
    } else {
      document.body.classList.remove("dark-mode");
      toggleBtn.classList.remove("tema-oscuro");
      toggleBtn.classList.add("tema-claro");
      iconoModo.textContent = "🌙";
      textoModo.textContent = "Modo Oscuro";
      myChart.options.scales.x.title.color = "#222";
      myChart.options.scales.y.title.color = "#222";
      myChart.options.scales.x.ticks.color = "#222";
      myChart.options.scales.y.ticks.color = "#222";
      myChart.data.datasets[0].backgroundColor = "rgba(0, 102, 255, 0.7)";
      myChart.options.plugins.legend.labels.color = "#222";
    }
    myChart.update();
  }

  function cargarTemaGuardado() {
    const temaGuardado = localStorage.getItem("tema");
    aplicarTema(temaGuardado === "oscuro");
  }

  function alternarTema() {
    toggleBtn.classList.add("animar");
    setTimeout(() => toggleBtn.classList.remove("animar"), 300);
    const modoOscuro = !document.body.classList.contains("dark-mode");
    aplicarTema(modoOscuro);
    localStorage.setItem("tema", modoOscuro ? "oscuro" : "claro");
  }

  // --- Serial ---
  function TcemEncontrado(p) {
    return ESP.some(device =>
      p.vendorId?.toUpperCase() === device.vendorId &&
      device.productIds.includes(p.productId?.toUpperCase())
    );
  }

  async function EscaneoESP() {
    const scanIntervalId = setInterval(async () => {
      if (estado.port && estado.port.readable) return;
      try {
        const ports = await window.apiSerial.listPorts();
        const matchingPort = ports.find(TcemEncontrado);

        if (!matchingPort) {
          PORTID.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Buscando TCEM 300M`;
          PORTID.className = "badge bg-warning text-dark p-2 fs-6";
          return;
        }

        try {
          const opened = await window.apiSerial.openSerialPort({
            path: matchingPort.path,
            baudRate: 9600
          });
          console.log("Port opened: ", opened);
        }
        catch (error) {
          console.error("Error opening port: ", error);
          // TODO: Controlar esta exception
          return;
        }

        // Serial port opened successfully, update UI directly
        PORTID.textContent = `TromerBench conectado en ${matchingPort.path}`;
        PORTID.className = "badge bg-success text-light p-2 fs-6";

        // Cancelamos el interval porque ya tenemos el puerto abierto
        clearInterval(scanIntervalId);

        // TODO: Activar la laectura de datos en otro lado
      } catch (error) {
        console.error("Error al abrir el puerto serie:", error);
      }
    }, 500);
  }

  window.apiSerial.onSerialClosed(() => {
    console.log("OnSerialClose event received");
    PORTID.textContent = "TromerBench desconectado";
    PORTID.className = "badge bg-danger text-light p-2 fs-6";
    estado.port = null;
  });

  window.apiSerial.onSerialOpened(() => {
    console.log("OnSerialOpened event received");
  });


  window.apiSerial.onSerialData((data) => {
    
    estado.buffer += data;
    let lines = estado.buffer.split("\n");
    estado.buffer = lines.pop();
    lines.forEach(line => {
      const data = line.trim();
      console.log(data);
      if (!data) return;
      if (data === "0x68") {
        estado.MPU = 1;
      } else if (data === "0x69") {
        estado.MPU = 2;
      }
      if (estado.MPU === 1) {
        if (data.toUpperCase() === "ACELZ") {
          estado.receivingVector = 1;
          return;
        } else if (data.toUpperCase() === "ACELY") {
          estado.receivingVector = 2;
          return;
        } else if (data.toUpperCase() === "ACELX") {
          estado.receivingVector = 3;
          return;
        } else if (data.toUpperCase() === "GYROX") {
          estado.receivingVector = 4;
          return;
        } else if (data.toUpperCase() === "GYROY") {
          estado.receivingVector = 5;
          return;
        } else if (data.toUpperCase() === "GYROZ") {
          estado.receivingVector = 6;
          return;
        }
      } else if (estado.MPU === 2) {
        if (data.toUpperCase() === "ACELZ") {
          estado.receivingVector = 7;
          return;
        } else if (data.toUpperCase() === "ACELY") {
          estado.receivingVector = 8;
          return;
        } else if (data.toUpperCase() === "ACELX") {
          estado.receivingVector = 9;
          return;
        } else if (data.toUpperCase() === "GYROX") {
          estado.receivingVector = 10;
          return;
        } else if (data.toUpperCase() === "GYROY") {
          estado.receivingVector = 11;
          return;
        } else if (data.toUpperCase() === "GYROZ") {
          estado.receivingVector = 12;
          return;
        }
      }
      
      const numericData = parseFloat(data);
      if (isNaN(numericData)) {
        return;
      }
      if (estado.MPU === 1) {
        if (estado.receivingVector === 1 && estado.dataVector1.length < numValores) {
          estado.dataVector1.push(numericData);
          Xacel = numericData;
          window.apiSerial.datoBase({ Sensor:"0x68", Prueba:prueba, AceleracionX:Xacel, AceleracionY:Yacel, AceleracionZ:Zacel, GiroscopioX:XGir, GiroscopioY:YGir, GiroscopioZ:ZGir});
          actualizarTabla(tablaBody1, estado.dataVector1);
          Graficar(myChart, estado.dataVector1);
        }else if (estado.receivingVector === 2 && estado.dataVector2.length < numValores) {
          estado.dataVector2.push(numericData);
          Yacel = numericData;
          window.apiSerial.datoBase({ Sensor:"0x68", Prueba:prueba, AceleracionX:Xacel, AceleracionY:Yacel, AceleracionZ:Zacel, GiroscopioX:XGir, GiroscopioY:YGir, GiroscopioZ:ZGir});
          actualizarTabla(tablaBody2, estado.dataVector2);
          Graficar(myChart2, estado.dataVector2);
        } else if (estado.receivingVector === 3 && estado.dataVector3.length < numValores) {
          estado.dataVector3.push(numericData);
          Zacel = numericData;
          window.apiSerial.datoBase({ Sensor:"0x68", Prueba:prueba,AceleracionX:Xacel, AceleracionY:Yacel, AceleracionZ:Zacel, GiroscopioX:XGir, GiroscopioY:YGir, GiroscopioZ:ZGir});
          actualizarTabla(tablaBody3, estado.dataVector3);
          Graficar(myChart3, estado.dataVector3);
        } else if (estado.receivingVector === 4 && estado.dataVector4.length < numValores) {
          estado.dataVector4.push(numericData);
          XGir = numericData;
          window.apiSerial.datoBase({ Sensor:"0x68", Prueba:prueba,AceleracionX:Xacel, AceleracionY:Yacel, AceleracionZ:Zacel, GiroscopioX:XGir, GiroscopioY:YGir, GiroscopioZ:ZGir});
          actualizarTabla(tablaBody4, estado.dataVector4);
          Graficar(myChart4, estado.dataVector4);
        } else if (estado.receivingVector === 5 && estado.dataVector5.length < numValores) {
          estado.dataVector5.push(numericData);
          YGir = numericData;
          window.apiSerial.datoBase({ Sensor:"0x68", Prueba:prueba,AceleracionX:Xacel, AceleracionY:Yacel, AceleracionZ:Zacel, GiroscopioX:XGir, GiroscopioY:YGir, GiroscopioZ:ZGir});
          actualizarTabla(tablaBody5, estado.dataVector5);
          Graficar(myChart5, estado.dataVector5);
        } else if (estado.receivingVector === 6 && estado.dataVector6.length < numValores) {
          estado.dataVector6.push(numericData);
          ZGir = numericData;
          window.apiSerial.datoBase({ Sensor:"0x68", Prueba:prueba, AceleracionX:Xacel, AceleracionY:Yacel, AceleracionZ:Zacel, GiroscopioX:XGir, GiroscopioY:YGir, GiroscopioZ:ZGir});
          actualizarTabla(tablaBody6, estado.dataVector6);
          Graficar(myChart6, estado.dataVector6);
        }
      } else if (estado.MPU === 2) {
        if (estado.receivingVector === 7 && estado.dataVector7.length < numValores) {
          estado.dataVector7.push(numericData);
          XAcel = numericData;
          window.apiSerial.datoBase({ Sensor:"0x69", Prueba:prueba, AceleracionX:Xacel, AceleracionY:Yacel, AceleracionZ:Zacel, GiroscopioX:XGir, GiroscopioY:YGir, GiroscopioZ:ZGir});
          actualizarTabla(tablaBody1, estado.dataVector7);
          Graficar(myChart7, estado.dataVector7);
        } else if (estado.receivingVector === 8 && estado.dataVector8.length < numValores) {
          estado.dataVector8.push(numericData);
          Yacel = numericData;
          window.apiSerial.datoBase({ Sensor:"0x69", Prueba:prueba, AceleracionX:Xacel, AceleracionY:Yacel, AceleracionZ:Zacel, GiroscopioX:XGir, GiroscopioY:YGir, GiroscopioZ:ZGir});
          actualizarTabla(tablaBody2, estado.dataVector8);
          Graficar(myChart8, estado.dataVector8);
        } else if (estado.receivingVector === 9 && estado.dataVector9.length < numValores) {
          estado.dataVector9.push(numericData);
          Zacel = numericData;
          window.apiSerial.datoBase({ Sensor:"0x69", Prueba:prueba, AceleracionX:Xacel, AceleracionY:Yacel, AceleracionZ:Zacel, GiroscopioX:XGir, GiroscopioY:YGir, GiroscopioZ:ZGir});
          actualizarTabla(tablaBody3, estado.dataVector9);
          Graficar(myChart9, estado.dataVector9);
        } else if (estado.receivingVector === 10 && estado.dataVector10.length < numValores) {
          estado.dataVector10.push(numericData);
          XGir = numericData;
          window.apiSerial.datoBase({ Sensor:"0x69", Prueba:prueba, AceleracionX:Xacel, AceleracionY:Yacel, AceleracionZ:Zacel, GiroscopioX:XGir, GiroscopioY:YGir, GiroscopioZ:ZGir});
          actualizarTabla(tablaBody4, estado.dataVector10);
          Graficar(myChart10, estado.dataVector10);
        } else if (estado.receivingVector === 11 && estado.dataVector11.length < numValores) {
          estado.dataVector11.push(numericData);
          YGir = numericData;
          window.apiSerial.datoBase({ Sensor:"0x69", Prueba:prueba, AceleracionX:Xacel, AceleracionY:Yacel, AceleracionZ:Zacel, GiroscopioX:XGir, GiroscopioY:YGir, GiroscopioZ:ZGir});
          actualizarTabla(tablaBody5, estado.dataVector11);
          Graficar(myChart11, estado.dataVector11);
        } else if (estado.receivingVector === 12 && estado.dataVector12.length < numValores) {
          estado.dataVector12.push(numericData);
          ZGir = numericData;
          window.apiSerial.datoBase({ Sensor:"0x69", Prueba:prueba, AceleracionX:Xacel, AceleracionY:Yacel, AceleracionZ:Zacel, GiroscopioX:XGir, GiroscopioY:YGir, GiroscopioZ:ZGir});
          actualizarTabla(tablaBody6, estado.dataVector12);
          Graficar(myChart12, estado.dataVector12);
          if (estado.dataVector12.length >= numValores) {
            modal.style.display = 'block';
            for (let i = 0; i < numValores; i++) {
              Vector1Prom = estado.dataVector1.reduce((a, b) => a + b, 0) / estado.dataVector1.length;
              valMostrado.textContent = Vector1Prom.toFixed(3);
              Vector2Prom = estado.dataVector2.reduce((a, b) => a + b, 0) / estado.dataVector2.length;
              valMostrado1.textContent = Vector2Prom.toFixed(3);
              Vector3Prom = estado.dataVector3.reduce((a, b) => a + b, 0) / estado.dataVector3.length;
              valMostrado2.textContent = Vector3Prom.toFixed(3);
              Vector4Prom = estado.dataVector4.reduce((a, b) => a + b, 0) / estado.dataVector4.length;
              valMostrado3.textContent = Vector4Prom.toFixed(3);
              Vector5Prom = estado.dataVector5.reduce((a, b) => a + b, 0) / estado.dataVector5.length;
              valMostrado4.textContent = Vector5Prom.toFixed(3);
              Vector6Prom = estado.dataVector6.reduce((a, b) => a + b, 0) / estado.dataVector6.length;
              valMostrado5.textContent = Vector6Prom.toFixed(3);
              Vector7Prom = estado.dataVector7.reduce((a, b) => a + b, 0) / estado.dataVector7.length;
              valMostrado6.textContent = Vector7Prom.toFixed(3);
              Vector8Prom = estado.dataVector8.reduce((a, b) => a + b, 0) / estado.dataVector8.length;
              valMostrado7.textContent = Vector8Prom.toFixed(3);
              Vector9Prom = estado.dataVector9.reduce((a, b) => a + b, 0) / estado.dataVector9.length;
              valMostrado8.textContent = Vector9Prom.toFixed(3);
              Vector10Prom = estado.dataVector10.reduce((a, b) => a + b, 0) / estado.dataVector10.length;
              valMostrado9.textContent = Vector10Prom.toFixed(3);
              Vector11Prom = estado.dataVector11.reduce((a, b) => a + b, 0) / estado.dataVector11.length;
              valMostrado10.textContent = Vector11Prom.toFixed(3);
              Vector12Prom = estado.dataVector12.reduce((a, b) => a + b, 0) / estado.dataVector12.length;
              valMostrado11.textContent = Vector12Prom.toFixed(3);
            }
          }
        }
      }

    });
  });


  // --- Tablas y datos ---
  function actualizarTabla(tablaBody, dataArray) {
    tablaBody.innerHTML = "";
    dataArray.forEach((valor, i) => {
      tablaBody.insertAdjacentHTML("beforeend", `
        <tr>
          <td>${i}</td>
          <td>${valor.toFixed(3)}</td>
        </tr>
      `);
    });
  }



  function Graficar(chart, dataArray) {
    chart.data.datasets[0].data = dataArray.slice();
    chart.update();
  }

  // --- Eventos UI ---
  Save.addEventListener("click", async () => {
    // ensure DB connection is established before querying/inserting
    await window.apiSerial.conectar();
    // wait for conexion() to fetch current max prueba
    await conexion();
    console.log("Prueba N°: " + prueba);
    //window.apiSerial.datoBase({ nombre:"nombre1", modo:"rapido", valor:"15"});

    console.log("Iniciando captura de datos...");
    window.apiSerial.enviarDato(Mode.value + ',');
    window.apiSerial.enviarDato(time.value + '\n');
    numValores = (parseInt(time.value)) * 2;

    estado.dataVector1 = [];
    estado.dataVector2 = [];
    estado.dataVector3 = [];
    estado.dataVector4 = [];
    estado.dataVector5 = [];
    estado.dataVector6 = [];
    estado.dataVector7 = [];
    estado.dataVector8 = [];
    estado.dataVector9 = [];
    estado.dataVector10 = [];
    estado.dataVector11 = [];
    estado.dataVector12 = [];

    if (estado.MPU === 1) {
      if (data.toUpperCase() === "ACELZ") {
        estado.receivingVector = 1;
        return;
      } else if (data.toUpperCase() === "ACELY") {
        estado.receivingVector = 2;
        return;
      } else if (data.toUpperCase() === "ACELX") {
        estado.receivingVector = 3;
        return;
      } else if (data.toUpperCase() === "GYROX") {
        estado.receivingVector = 4;
        return;
      } else if (data.toUpperCase() === "GYROY") {
        estado.receivingVector = 5;
        return;
      } else if (data.toUpperCase() === "GYROZ") {
        estado.receivingVector = 6;
        return;
      }
    } else if (estado.MPU === 2) {
      if (data.toUpperCase() === "ACELZ") {
        estado.receivingVector = 7;
        return;
      } else if (data.toUpperCase() === "ACELY") {
        estado.receivingVector = 8;
        return;
      } else if (data.toUpperCase() === "ACELX") {
        estado.receivingVector = 9;
        return;
      } else if (data.toUpperCase() === "GYROX") {
        estado.receivingVector = 10;
        return;
      } else if (data.toUpperCase() === "GYROY") {
        estado.receivingVector = 11;
        return;
      } else if (data.toUpperCase() === "GYROZ") {
        estado.receivingVector = 12;
        return;
      }
    }

    myChart.data.datasets[0].data = [];
    myChart2.data.datasets[0].data = [];
    myChart3.data.datasets[0].data = [];
    myChart4.data.datasets[0].data = [];
    myChart5.data.datasets[0].data = [];
    myChart6.data.datasets[0].data = [];
    myChart7.data.datasets[0].data = [];
    myChart8.data.datasets[0].data = [];
    myChart9.data.datasets[0].data = [];
    myChart10.data.datasets[0].data = [];
    myChart11.data.datasets[0].data = [];
    myChart12.data.datasets[0].data = [];

    myChart.update();
    myChart2.update();
    myChart3.update();
    myChart4.update();
    myChart5.update();
    myChart6.update();
    myChart7.update();
    myChart8.update();
    myChart9.update();
    myChart10.update();
    myChart11.update();
    myChart12.update();

    tablaBody1.innerHTML = "";
    tablaBody2.innerHTML = "";
    tablaBody3.innerHTML = "";
    tablaBody4.innerHTML = "";
    tablaBody5.innerHTML = "";
    tablaBody6.innerHTML = "";

  }
  );


  toggleBtn.addEventListener("click", alternarTema);

  async function conexion(){
    try {
      const res = await window.apiSerial.askBase('Prueba');
      // askBase now returns a numeric max Prueba (or 0). Ensure we coerce to number.
      const max = Number(res) || 0;
      prueba = max;
    } catch (err) {
      console.error('Error fetching Prueba from DB:', err);
      prueba = 0;
    }
    prueba++;
    return prueba;
  };

  inicializarUI();
  cargarTemaGuardado();
  EscaneoESP();
});

