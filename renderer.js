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
  const numValores = 50;
  const ESP = [
    { vendorId: '1A86', productIds: ['7584', '5584', '5523', '752d', '7523', 'e008', '7522'] },
    { vendorId: '10C4', productIds: ['EA60'] }
  ];
  // --- Elementos UI --- 
  const PORTID = document.getElementById("port");
  const Datos = document.getElementById("Datos");
  const toggleBtn = document.getElementById("Modo Oscuro");
  const Graficar1 = document.getElementById("btnGraficarTabla1");
  const tablaBody1 = document.querySelector("#tablaValores1 tbody");
  const tablaBody2 = document.querySelector("#tablaValores2 tbody");
  const tablaBody3 = document.querySelector("#tablaValores3 tbody");
  const tablaBody4 = document.querySelector("#tablaValores4 tbody");
  const tablaBody5 = document.querySelector("#tablaValores5 tbody");
  const tablaBody6 = document.querySelector("#tablaValores6 tbody");
  const tablaModal = document.querySelector("#tablaModal tbody");
  const modal = document.getElementById('myModal');

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

  const iconoModo = document.getElementById("icono-modo");
  const textoModo = document.getElementById("texto-modo");

  const Save = document.getElementById("Save");
  const Mode = document.getElementById("mode");
  const time = document.getElementById("time");

  function CreateChart(chartId) {
    const ctx = document.getElementById(chartId).getContext("2d");

    return new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [{
          backgroundColor: "rgba(0, 0, 255, 0.6)",
          pointBackgroundColor: "rgba(0, 0, 255, 0.6)",
          lineBackgroundColor: "rgba(130, 178, 251, 0.7)",
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
            title: { display: true, text: 'Aceleracion Z', color: "#222" },
            ticks: { color: "#222" }
          },
          x: {
            beginAtZero: true,
            max: 50,
            title: { display: true, text: 'Segundos', color: "#222" },
            ticks: { color: "#222" }
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
    PORTID.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Buscando TCEM 300M`;
    PORTID.className = "badge bg-warning text-dark p-2 fs-6";
    Datos.disabled = true;
  }
  // --- Chart ---
  const myChart = CreateChart("myChart");
  const myChart2 = CreateChart("myChart2");
  const myChart3 = CreateChart("myChart3");
  const myChart4 = CreateChart("myChart4");
  const myChart5 = CreateChart("myChart5");
  const myChart6 = CreateChart("myChart6");
  const myChart7 = CreateChart("myChart7");
  const myChart8 = CreateChart("myChart8");
  const myChart9 = CreateChart("myChart9");
  const myChart10 = CreateChart("myChart10");
  const myChart11 = CreateChart("myChart11");
  const myChart12 = CreateChart("myChart12");

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
        Datos.disabled = false;
        PORTID.textContent = `TremmorBench conectado en ${matchingPort.path}`;
        PORTID.className = "badge bg-success text-light p-2 fs-6";

        // Cancelamos el interval porque ya tenemos el puerto abierto
        clearInterval(scanIntervalId);

        // TODO: Activar la laectura de datos en otro lado
        //LecturaData();

      } catch (error) {
        console.error("Error al abrir el puerto serie:", error);
        Datos.disabled = true;
      }
    }, 500);
  }

  window.apiSerial.onSerialClosed(() => {
    console.log("OnSerialClose event received");
    Datos.disabled = true;
    PORTID.textContent = "TremmorBench desconectado";
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
          actualizarTabla(tablaBody1, estado.dataVector1);
          Graficar(myChart, estado.dataVector1, estado.aux)
          if (estado.dataVector1.length === numValores) Graficar1.disabled = false;

        }
        else if (estado.receivingVector === 2 && estado.dataVector2.length < numValores) {
          estado.dataVector2.push(numericData);
          actualizarTabla(tablaBody2, estado.dataVector2);
          Graficar(myChart2, estado.dataVector2, estado.aux)
          if (estado.dataVector2.length === numValores) Graficar1.disabled = false;
        } else if (estado.receivingVector === 3 && estado.dataVector3.length < numValores) {
          estado.dataVector3.push(numericData);
          actualizarTabla(tablaBody3, estado.dataVector3);
          Graficar(myChart3, estado.dataVector3, estado.aux)
          if (estado.dataVector3.length === numValores) Graficar1.disabled = false;
        } else if (estado.receivingVector === 4 && estado.dataVector4.length < numValores) {
          estado.dataVector4.push(numericData);
          actualizarTabla(tablaBody4, estado.dataVector4);
          Graficar(myChart4, estado.dataVector4, estado.aux)
          if (estado.dataVector4.length === numValores) Graficar1.disabled = false;
        } else if (estado.receivingVector === 5 && estado.dataVector5.length < numValores) {
          estado.dataVector5.push(numericData);
          actualizarTabla(tablaBody5, estado.dataVector5);
          Graficar(myChart5, estado.dataVector5, estado.aux)
          if (estado.dataVector5.length === numValores) Graficar1.disabled = false;
        } else if (estado.receivingVector === 6 && estado.dataVector6.length < numValores) {
          estado.dataVector6.push(numericData);
          actualizarTabla(tablaBody6, estado.dataVector6);
          Graficar(myChart6, estado.dataVector6, estado.aux)
          if (estado.dataVector6.length === numValores) Graficar1.disabled = false;
        }
      } else if (estado.MPU === 2) {
        if (estado.receivingVector === 7 && estado.dataVector7.length < numValores) {
          estado.dataVector7.push(numericData);
          actualizarTabla(tablaBody1, estado.dataVector7);
          Graficar(myChart7, estado.dataVector7, estado.aux)
          if (estado.dataVector7.length === numValores) Graficar1.disabled = false;
        } else if (estado.receivingVector === 8 && estado.dataVector8.length < numValores) {
          estado.dataVector8.push(numericData);
          actualizarTabla(tablaBody2, estado.dataVector8);
          Graficar(myChart8, estado.dataVector8, estado.aux)
          if (estado.dataVector8.length === numValores) Graficar1.disabled = false;
        } else if (estado.receivingVector === 9 && estado.dataVector9.length < numValores) {
          estado.dataVector9.push(numericData);
          actualizarTabla(tablaBody3, estado.dataVector9);
          Graficar(myChart9, estado.dataVector9, estado.aux)
          if (estado.dataVector9.length === numValores) Graficar1.disabled = false;
        } else if (estado.receivingVector === 10 && estado.dataVector10.length < numValores) {
          estado.dataVector10.push(numericData);
          actualizarTabla(tablaBody4, estado.dataVector10);
          Graficar(myChart10, estado.dataVector10, estado.aux)
          if (estado.dataVector10.length === numValores) Graficar1.disabled = false;
        } else if (estado.receivingVector === 11 && estado.dataVector11.length < numValores) {
          estado.dataVector11.push(numericData);
          actualizarTabla(tablaBody5, estado.dataVector11);
          Graficar(myChart11, estado.dataVector11, estado.aux)
          if (estado.dataVector11.length === numValores) Graficar1.disabled = false;
        } else if (estado.receivingVector === 12 && estado.dataVector12.length < numValores) {
          estado.dataVector12.push(numericData);
          actualizarTabla(tablaBody6, estado.dataVector12);
          Graficar(myChart12, estado.dataVector12, estado.aux);
          if (estado.dataVector12.length >= 50) {
            const body = document.body;
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



  function Graficar(chart, dataArray, label) {
    chart.data.labels = dataArray.map((_, i) => i); // agrega los labels para eje X
    chart.data.datasets[0].data = dataArray.slice();
    chart.data.datasets[0].label = label;
    chart.update();
    estado.aux++;
  }

  // --- Eventos UI ---
  Datos.addEventListener("click", () => {
    if (estado.port && estado.port.writable) {
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
      Graficar1.disabled = true;
      // Graficar2.disabled = true;
      // Graficar3.disabled = true;
      // Graficar4.disabled = true;
      // Graficar5.disabled = true;
      // Graficar6.disabled = true;
      // Graficar7.disabled = true;
      // Graficar8.disabled = true;
      // Graficar9.disabled = true;
      // Graficar10.disabled = true;
      // Graficar11.disabled = true;
      // Graficar12.disabled = true;

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
      tablaBody7.innerHTML = "";
      tablaBody8.innerHTML = "";
      tablaBody9.innerHTML = "";
      tablaBody10.innerHTML = "";
      tablaBody11.innerHTML = "";
      tablaBody12.innerHTML = "";

      estado.port.write("START\n", (err) => {
        if (err) {
          console.error("Error al enviar START:", err.message);
        }
      });
    }
  });
  Save.addEventListener("click", () => {
    window.apiSerial.enviarDato(Mode.value + ',');
    window.apiSerial.enviarDato(time.value + '\n');
  });
  

  Graficar1.addEventListener("click", () => {
    if (estado.dataVector1.length > 0) {
      Graficar(estado.dataVector1, "Tabla 1");
    }
  });

  toggleBtn.addEventListener("click", alternarTema);


  inicializarUI();
  cargarTemaGuardado();
  EscaneoESP();
});

