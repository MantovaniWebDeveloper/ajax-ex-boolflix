$(document).ready(function(){
  //attivo al click la ricerca
  $("#btnCerca").click(function(){
    //alert("vivo");
    //recupero il valore dalla barra di ricerca
    var valBarraRicerca = $("#barraRicerca").val();
    console.log(valBarraRicerca);
  });
});
