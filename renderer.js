document.addEventListener("DOMContentLoaded", () => {
  const { SerialPort } = require("serialport");

  // --- Estado y constantes ---
  const estado = {
    buffer: "",
    port: null,
    dataVector1: [],
    dataVector2: [],
    dataVector3: [],
    receivingVector: 1,
    aux: 0
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
  const iconoModo = document.getElementById("icono-modo");
  const textoModo = document.getElementById("texto-modo");
  const ctx = document.getElementById("myChart").getContext("2d");
  const ctx2 = document.getElementById("myChart2").getContext("2d");
  const ctx3 = document.getElementById("myChart3").getContext("2d");

  // --- Inicialización UI ---
  function inicializarUI() {
    PORTID.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Buscando TCEM 300M`;
    PORTID.className = "badge bg-warning text-dark p-2 fs-6";
    Datos.disabled = true;
    Graficar1.disabled = true;
  }

  // --- Chart ---
  const myChart = new Chart(ctx, {
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
          max: 20,
          min: -20,
          title: { display: true, text: 'Aceleracion', color: "#222" },
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
  });
  const myChart2 = new Chart(ctx2, {
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
          max: 20,
          min: -20,
          title: { display: true, text: 'Aceleracion', color: "#222" },
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
  });
  const myChart3 = new Chart(ctx3, {
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
          max: 20,
          min: -20,
          title: { display: true, text: 'Aceleracion', color: "#222" },
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
  });

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
    setInterval(async () => {
      if (estado.port && estado.port.readable) return;
      try {
        const ports = await SerialPort.list();
        const matchingPort = ports.find(TcemEncontrado);

        if (!matchingPort) {
          PORTID.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Buscando TCEM 300M`;
          PORTID.className = "badge bg-warning text-dark p-2 fs-6";
          return;
        }

        estado.port = new SerialPort({
          path: matchingPort.path,
          baudRate: 115200
        });

        estado.port.on("open", () => {
          Datos.disabled = false;
          PORTID.textContent = `TCEM 300M conectado en ${matchingPort.path}`;
          PORTID.className = "badge bg-success text-light p-2 fs-6";
          console.log("Leyendo datos");
          LecturaData();
        });

        estado.port.on("close", () => {
          Datos.disabled = true;
          PORTID.textContent = "TCEM 300M desconectado";
          PORTID.className = "badge bg-danger text-light p-2 fs-6";
          estado.port = null;
        });

      } catch (err) {
        console.error("Error al escanear puertos:", err);
        PORTID.textContent = `Error al buscar puertos: ${err.message}`;
      }
    }, 1000);
  }

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

  function LecturaData() {
    estado.port.on("readable", () => {
      let chunk = estado.port.read();
      if (estado.dataVector1.length >= numValores) return;
      if (!chunk) return;
      estado.buffer += chunk.toString();
      let lines = estado.buffer.split("\n");
      estado.buffer = lines.pop();
      lines.forEach(line => {
        const data = line.trim();
        if (!data) return;
        console.log("Data received:", data);
        if (data.toUpperCase() === "ACELZ") {
          estado.receivingVector = 1;
          return;
        } else if (data.toUpperCase() === "ACELY") {
          estado.receivingVector = 2;
          return;
        } else if (data.toUpperCase() === "GYROZ") {
          estado.receivingVector = 3;
          return;
        }
        const numericData = parseFloat(data);
        if (isNaN(numericData)) {
          return;
        }
        if (estado.receivingVector === 1 && estado.dataVector1.length < numValores) {
          estado.dataVector1.push(numericData);
          actualizarTabla(tablaBody1, estado.dataVector1);
          Graficar(estado.dataVector1, estado.aux)
          if (estado.dataVector1.length === numValores) Graficar1.disabled = false;
        } else if (estado.receivingVector === 2 && estado.dataVector2.length < numValores) {
          estado.dataVector2.push(numericData);
          actualizarTabla(tablaBody1, estado.dataVector2);
          Graficar2(estado.dataVector2, estado.aux)
          if (estado.dataVector2.length === numValores) Graficar2.disabled = false;
        } else if (estado.receivingVector === 3 && estado.dataVector3.length < numValores) {
          estado.dataVector3.push(numericData);
          actualizarTabla(tablaBody1, estado.dataVector3);
          Graficar3(estado.dataVector3, estado.aux)
          if (estado.dataVector3.length === numValores) Graficar3.disabled = false;
        }
      });
    });
  }

  function Graficar(dataArray, label) {
    myChart.data.labels = dataArray.map((_, i) => i); // agrega los labels para eje X
    myChart.data.datasets[0].data = dataArray.slice();
    myChart.data.datasets[0].label = label;
    myChart.update();
    estado.aux++;
  }
  function Graficar2(dataArray, label) {
    myChart2.data.labels = dataArray.map((_, i) => i); // agrega los labels para eje X
    myChart2.data.datasets[0].data = dataArray.slice();
    myChart2.data.datasets[0].label = label;
    myChart2.update();
    estado.aux++;
  }
  function Graficar3(dataArray, label) {
    myChart3.data.labels = dataArray.map((_, i) => i); // agrega los labels para eje X
    myChart3.data.datasets[0].data = dataArray.slice();
    myChart3.data.datasets[0].label = label;
    myChart3.update();
    estado.aux++;
  }

  // --- Eventos UI ---
  Datos.addEventListener("click", () => {
    if (estado.port && estado.port.writable) {
      estado.dataVector1 = [];
      estado.receivingVector = 1;
      Graficar1.disabled = true;
      myChart.data.datasets[0].data = [];
      myChart.update();
      tablaBody1.innerHTML = "";

      estado.port.write("START\n", (err) => {
        if (err) {
          console.error("Error al enviar START:", err.message);
        }
      });
    }
  });

  Graficar1.addEventListener("click", () => {
    if (estado.dataVector1.length > 0) {
      Graficar(estado.dataVector1, "Tabla 1");
    }
  });

  toggleBtn.addEventListener("click", alternarTema);

  // --- Inicialización general ---
  inicializarUI();
  cargarTemaGuardado();
  EscaneoESP();
});

