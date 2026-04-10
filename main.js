document.getElementById("metodo").innerHTML = `
<option value="1">Método 1</option>
<option value="2">Método 2</option>
`;

document.getElementById("metodo").onchange = criarInputs;

criarInputs();
inicializarGrafico();