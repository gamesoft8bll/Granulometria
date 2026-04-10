function gerarPDF(){

  const { jsPDF } = window.jspdf;
  let doc = new jsPDF();

  let produto = document.getElementById("produto").value;
  let data = new Date().toLocaleString();

  let metodo = document.getElementById("metodo").value;

  let iqp = calcularIQP(passantesGlobais, metodo);
  let classe = classificar(passantesGlobais, iqp, metodo);

  doc.setFontSize(18);
  doc.text("RELATÓRIO GRANULOMÉTRICO", 20, 20);

  doc.setFontSize(11);
  doc.text(`Produto: ${produto}`, 20, 35);
  doc.text(`Data: ${data}`, 20, 45);

  doc.setFontSize(14);
  doc.text(`IQP: ${iqp.toFixed(2)}`, 20, 60);

  // barra visual
  doc.setFillColor(200,200,200);
  doc.rect(20, 65, 150, 6, "F");

  let largura = (iqp/10)*150;

  if(iqp >= 8.5) doc.setFillColor(0,180,0);
  else if(iqp >= 7) doc.setFillColor(240,180,0);
  else doc.setFillColor(200,0,0);

  doc.rect(20, 65, largura, 6, "F");

  doc.text(`${classe.nome}`, 20, 80);
  doc.text(`${classe.texto}`, 20, 90);

  let img = document.getElementById("grafico").toDataURL("image/png");

  doc.addPage();
  doc.text("Curva Granulométrica", 20, 20);
  doc.addImage(img, "PNG", 15, 30, 180, 100);

  doc.save("Relatorio_Granulometria.pdf");
}