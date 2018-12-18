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
        console.log(data);
        //reults è un array di risultati corretti
        var filmTrovato = data.results;
        console.log(filmTrovato);
        //svuoto il div #filmInfoResult
        $('#filmInfoResult').html("");
        //ciclo filmTrovato per estrapolare le propietà
        // e stamparle in html
        for (var i = 0; i < filmTrovato.length; i++) {
          //converto il valore di voto da decimale ad intero
          var voto = filmTrovato[i].vote_average;
          var votoArrotondato = Math.round(voto);

          var templateBase = $('#filmInfo').html();
          var templateCompilato = Handlebars.compile(templateBase);

          //eseguo il controllo se i due titoli sono uguali
          if(filmTrovato[i].title == filmTrovato[i].original_title) {
            //passo i dati del film al context
            var context = {
              titolo : filmTrovato[i].title,
              lingua: filmTrovato[i].original_language,
              voto: votoArrotondato
            };
          }
          else {
            //passo i dati del film al context
            var context = {
              titolo : filmTrovato[i].title,
              titoloOriginale: filmTrovato[i].original_title,
              lingua: filmTrovato[i].original_language,
              voto: votoArrotondato
            };
          }

          var htmlStampato = templateCompilato(context);
          $('#filmInfoResult').append(htmlStampato);

        }



      },
      error: function(richiesta, stato, errori) {
        //localizzare il codice di errore
        console.log(richiesta.status);
        if(richiesta.status == 422){
          alert('inserisci il film o la serie da cercare!');
        }

      }
    });
  }


});
