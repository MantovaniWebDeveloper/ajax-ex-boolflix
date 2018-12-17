$(document).ready(function(){
  //attivo al click la ricerca
  $("#btnCerca").click(function(){
    //alert("vivo");
    //recupero il valore dalla barra di ricerca
    var valoreRicerca = $("#barraRicerca").val();
    console.log(valoreRicerca);
    cercaFilm(valoreRicerca);
  });
  //funzione con chimata ajx che prende come argomento
  //il valore della barra di ricerca
  function cercaFilm(valoreRicerca){
    $.ajax({
      url: 'https://api.themoviedb.org/3/search/movie',
      method: 'GET',
      data: {
        api_key: '625a162fa4a03ee07f61388c8fe99cd2',
        language: 'it',
        query: valoreRicerca
      },
      success: function(data, stato) {
        console.log(data)

      },
      error: function(richiesta, stato, errori) {
        console.log("c'è stato un errore " + errori);
      }
    });
  }


});
