let chart;

function gerarGrafico(passantes){

  let labels = [];
  let dados = [];
  let ideal = [];
  let limite = [];

  // 🔵 IDEAL REAL
  let padraoIdeal = {
    "4.75":98,
    "4":90,
    "2":10,
    "1":2
  };

  // 🟡 LIMITE (tolerância)
  let padraoLimite = {
    "4.75":95,
    "4":85,
    "2":40,
    "1":5
  };

  for(let p in passantes){
    if(p !== "Fundo"){
      labels.push(p + " mm");
      dados.push(passantes[p]);
      ideal.push(padraoIdeal[p]);
      limite.push(padraoLimite[p]);
    }
  }

  const canvas = document.getElementById("grafico");

  if(chart){
    chart.destroy();
  }

  chart = new Chart(canvas, {

    type: 'line',

    data: {
      labels: labels,
      datasets: [

        {
          label: "Resultado",
          data: dados,
          borderColor: "#2980b9",
          borderWidth: 3,
          tension: 0.3,
          pointRadius: 5
        },

        {
          label: "Ideal",
          data: ideal,
          borderColor: "#27ae60",
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 4
        },

        {
          label: "Limite",
          data: limite,
          borderColor: "#f39c12",
          borderDash: [6,6],
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 3
        }

      ]
    },

    options: {
      responsive: true,

      interaction: {
        mode: 'index',
        intersect: false
      },

      plugins: {
        legend: {
          position: 'top'
        },
        tooltip: {
          callbacks: {
            label: function(context){
              return context.dataset.label + ": " + context.raw.toFixed(2) + "%";
            }
          }
        },
        zoom: {
          zoom: {
            wheel: { enabled: true },
            pinch: { enabled: true }
          },
          pan: {
            enabled: true
          }
        }
      },

      scales: {
        y: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 10
          }
        }
      }
    }

  });

}