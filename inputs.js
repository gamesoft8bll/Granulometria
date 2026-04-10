function criarInputs(){

  let metodo = document.getElementById("metodo").value;

  let peneiras = metodo == "1"
    ? ["4.75","2","1","Fundo"]
    : ["4.75","4","2","1","Fundo"];

  let html = `
  <table>
    <tr>
      <th>Peneira</th>
      <th>Vazia (g)</th>
      <th>Cheia (g)</th>
    </tr>
  `;

  peneiras.forEach(p=>{
    html += `
    <tr>
      <td>${p} mm</td>
      <td><input id="v${p}"></td>
      <td><input id="c${p}"></td>
    </tr>
    `;
  });

  html += "</table>";

  document.getElementById("inputs").innerHTML = html;
}