let passantesGlobais;

// ===== CALCULO PRINCIPAL =====
function calcular(){

  let metodo = document.getElementById("metodo").value;

  let peneiras = metodo == "1"
    ? ["4.75","2","1","Fundo"]
    : ["4.75","4","2","1","Fundo"];

  let retidos = {};
  let total = 0;

  peneiras.forEach(p=>{
    let v = parseFloat(document.getElementById("v"+p).value || 0);
    let c = parseFloat(document.getElementById("c"+p).value || 0);

    let r = c - v;

    retidos[p] = r;
    total += r;
  });

  let acumulado = 0;
  let passantes = {};
  let texto = "<h3>Resultado</h3>";

  peneiras.forEach(p=>{
    acumulado += retidos[p];

    let pass = ((total - acumulado) / total) * 100;
    passantes[p] = pass;

    if(p !== "Fundo"){

      let cor = "green";

      if(p=="4.75") cor = pass>=95?"green":"red";
      if(p=="4") cor = pass>=85?"green":"red";
      if(p=="2") cor = pass<=40?"green":"red";
      if(p=="1") cor = pass<=5?"green":"red";

      texto += `<div class="${cor}">${p} mm: ${pass.toFixed(2)}%</div>`;
    }
  });

  passantesGlobais = passantes;

  let iqp = calcularIQP(passantes, metodo);
  let classe = classificar(passantes, iqp, metodo);

  let emoji;

  if(classe.nome.includes("A")) emoji="🟢";
  else if(classe.nome.includes("B")) emoji="🟡";
  else emoji="🔴";

  texto += `<hr>
  <b>IQP:</b> ${iqp.toFixed(2)}<br>
  <b>Classe:</b> ${classe.nome} ${emoji}<br>
  ${classe.texto}`;

  document.getElementById("resultado").innerHTML = texto;

  gerarGrafico(passantes);
}


// ===== IQP COM PESOS (IGUAL EXCEL) =====
function calcularIQP(p, metodo){

  function n475(v){ return v>=99?9.5:v>=98?8:v>=97?6:v>=96?5:3; }
  function n4(v){ return v>=95?9.5:v>=92?8:v>=90?6:v>=85?5:3; }
  function n2(v){ return v<=10?9.5:v<=15?9:v<=20?7:v<=35.9?5:3; }
  function n1(v){ return v<=1?9.5:v<=2?8:v<=4?6:3; }

  let nota475 = n475(p["4.75"]);
  let nota2 = n2(p["2"]);
  let nota1 = n1(p["1"]);

  if(metodo == "2"){

    let nota4 = n4(p["4"]);

    // ✔ PESOS EXATOS DA PLANILHA
    return (
      nota475 * 0.25 +
      nota4   * 0.15 +
      nota2   * 0.40 +
      nota1   * 0.20
    );

  } else {

    // ✔ AJUSTE AUTOMÁTICO SEM 4MM
    return (
      nota475 * 0.294 +
      nota2   * 0.471 +
      nota1   * 0.235
    );
  }
}


// ===== CLASSIFICAÇÃO =====
function classificar(p, iqp, metodo){

  function n475(v){ return v>=99?9.5:v>=98?8:v>=97?6:v>=96?5:3; }
  function n4(v){ return v>=95?9.5:v>=92?8:v>=90?6:v>=85?5:3; }
  function n2(v){ return v<=10?9.5:v<=15?9:v<=20?7:v<=35.9?5:3; }
  function n1(v){ return v<=1?9.5:v<=2?8:v<=4?6:3; }

  let notas = [
    n475(p["4.75"]),
    n2(p["2"]),
    n1(p["1"])
  ];

  if(metodo == "2"){
    notas.splice(1,0,n4(p["4"]));
  }

  // 🔥 REGRA CRÍTICA DO EXCEL
  if(Math.min(...notas) <= 3){
    return {
      nome: "Classe D – Crítico",
      texto: "Produto com granulometria ruim, ação corretiva necessária."
    };
  }

  if(iqp >= 8.5){
    return {
      nome: "Classe A – Ideal",
      texto: "Produto homogêneo, saudável, sem desvios relevantes."
    };
  }

  if(iqp >= 7){
    return {
      nome: "Classe B – Aceitável",
      texto: "Produto bom, mas não ideal."
    };
  }

  if(iqp >= 5.5){
    return {
      nome: "Classe C – Atenção",
      texto: "Produto com desvios visíveis, requer acompanhamento."
    };
  }

  return {
    nome: "Classe D – Crítico",
    texto: "Produto com granulometria ruim, ação corretiva necessária."
  };
}