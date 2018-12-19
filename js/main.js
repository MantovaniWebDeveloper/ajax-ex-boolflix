$(document).ready(function(){
  //attivo al click la ricerca
  $("#btnCerca").click(function(){
    //alert("vivo");
    //recupero il valore dalla barra di ricerca
    var valoreRicerca = $("#barraRicerca").val();
    console.log(valoreRicerca);
    cercaFilm(valoreRicerca);
  });
  //funzione gestione stelle
  function cambioStelle(votoArrotondato){
    var stelleFilm = [];
    console.log(votoArrotondato);
    for (var k = 1; k <= votoArrotondato; k++) {
      nuovoStella = {
        stella: votoArrotondato
      }
        stelleFilm.push(nuovoStella);

    }
    return stelleFilm
  }
  //funzione gestione bandiera
  function gestioneBandiera(bandiera){
    var stampaHtml = "";
    var sigleNazioni = ["it","en","de"];

    if(sigleNazioni.includes(bandiera)){
      stampaHtml += "<img class='bandieraNazione' src='" + './assets/'+bandiera+".svg' />";
    }
    return stampaHtml;
  }
  //funzione stampa copertina
  function stampaCopertina(copertinaFilm){
    var stampaHtml = "";
    stampaHtml += "<img class='copertinaFilm' src='" + 'https://image.tmdb.org/t/p/w185/'+copertinaFilm+"' />"
    return stampaHtml;
  }
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
         //e parsandolo

         var voto = filmTrovato[i].vote_average;
         var votoArrotondato = Math.round(voto / 2);
         var bandiera = filmTrovato[i].original_language;
         var copertinaFilm = filmTrovato[i].poster_path;

         console.log(copertinaFilm);

         var templateBase = $('#filmInfo').html();
         var templateCompilato = Handlebars.compile(templateBase);

         //eseguo il controllo se i due titoli sono uguali
         if(filmTrovato[i].title == filmTrovato[i].original_title) {
           //passo i dati del film al context
           var context = {
             titolo : filmTrovato[i].title,
             bandieraStampata : gestioneBandiera(bandiera),
             voti: cambioStelle(votoArrotondato),
             copertina: stampaCopertina(copertinaFilm)
           };
         }
         else {
           //passo i dati del film al context
           var context = {
             titolo : filmTrovato[i].title,
             titoloOriginale: filmTrovato[i].original_title,
             bandieraStampata : gestioneBandiera(bandiera),
             voti: cambioStelle(votoArrotondato),
             copertina: stampaCopertina(copertinaFilm)

           };
         }


         var htmlStampato = templateCompilato(context);
         $('#filmInfoResult').append(htmlStampato);

       }
       /*****************************************************/
       /*****************************************************/
       /*****************************************************/
       //seconda chiamata per serie tv
       /*****************************************************/
       /*****************************************************/

       $.ajax({

           url: 'https://api.themoviedb.org/3/search/tv',
           method: 'GET',
           data: {
             api_key: '1c33f84afe90ca7fb1317a2320a21c48',
             language: 'it',
             query: valoreRicerca,
           },
           success: function(data,stato) {

             var serieTrovata = data.results
             console.log("serie: " + serieTrovata);

             for (var i = 0; i < serieTrovata.length; i++) {
               //genero una serie dal loop
               console.log(serieTrovata[i]);
               var serieLoop = serieTrovata[i];

               var voto = serieLoop.vote_average;
               var votoArrotondato = Math.round(voto / 2);
               console.log("voto serie " + votoArrotondato);
               var bandiera = serieLoop.original_language;
               var copertinaSerie = serieLoop.poster_path;


               serieLoop.title = serieLoop.name;
               serieLoop.original_title = serieLoop.original_name;
               var templateBaseSerie = $('#filmInfo').html();
               var templateCompilatoSerie = Handlebars.compile(templateBaseSerie);

               var context = {
                 titolo : serieTrovata[i].title,
                 titoloOriginale: serieTrovata[i].original_title,
                 bandieraStampata : gestioneBandiera(bandiera),
                 voti: cambioStelle(votoArrotondato),
                 copertina: stampaCopertina(copertinaSerie)

               };

               var htmlStampatoSerie = templateCompilatoSerie(context);
               $('#filmInfoResult').append(htmlStampatoSerie);

             }


     },
     error: function(richiesta, stato, errori) {
       //localizzare il codice di errore
       console.log(richiesta.status);
       if(richiesta.status == 422){
         alert('inserisci la serie da cercare!');
       }

     }
   });
   /*****************************************************/
   /*****************************************************/
   /*****************************************************/
   /*****************************************************/



     },
     error: function(richiesta, stato, errori) {
       //localizzare il codice di errore
       console.log(richiesta.status);
       if(richiesta.status == 422){
         alert('inserisci il film  da cercare!');
       }

     }
   });
 }




});
