$(document).ready(function() {

  //attivo al click la ricerca
  $("#btnCerca").click(function() {
    //alert("vivo");
    //recupero il valore dalla barra di ricerca
    var valoreRicerca = $("#barraRicerca").val();
    console.log(valoreRicerca);
    cercaFilm(valoreRicerca);
  });
  //attivo al invio della tastiera la ricerca
  $("#barraRicerca").keypress(function(event) {
    if (event.which == 13) {
      //recupero il valore dalla barra di ricerca
      var valoreRicerca = $("#barraRicerca").val();
      console.log(valoreRicerca);
      cercaFilm(valoreRicerca);
    }
  });

  //funzione gestione stelle
  function cambioStelle(votoArrotondato) {
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
  function gestioneBandiera(bandiera) {
    var stampaHtml = "";
    var sigleNazioni = ["it", "en", "de"];

    if (sigleNazioni.includes(bandiera)) {
      stampaHtml += "<img class='bandieraNazione' src='" + './assets/' + bandiera + ".svg' />";
    }
    return stampaHtml;
  }
  //funzione stampa copertina
  function stampaCopertina(copertinaFilm) {
    if (copertinaFilm == null) {
      console.log("img non disponibile");
    } else {
      var stampaHtml = "";
      stampaHtml += "<img class='copertinaFilm' src='" + 'https://image.tmdb.org/t/p/w342/' + copertinaFilm + "' />"
    }

    return stampaHtml;
  }
  //Funzione per la stampa di tutti i risutlati in html
  function renderHtml(filmTrovato) {
    for (var i = 0; i < filmTrovato.length; i++) {
      //converto il valore di voto da decimale ad intero
      //e parsandolo


      var voto = filmTrovato[i].vote_average;
      var votoArrotondato = Math.round(voto / 2);
      var bandiera = filmTrovato[i].original_language;
      var copertinaFilm = filmTrovato[i].poster_path;
      var overView = filmTrovato[i].overview;
      var titoloFilm = filmTrovato[i].title;
      var titoloOriginaleFilm = filmTrovato[i].original_title;

      console.log(titoloFilm);
      console.log(titoloOriginaleFilm);

      var templateBase = $('#filmInfo').html();
      var templateCompilato = Handlebars.compile(templateBase);

      //eseguo il controllo se i due titoli sono uguali
      if (titoloFilm == titoloOriginaleFilm) {

        $(this).hide();
        //passo i dati del film al context
        var context = {
          titolo: filmTrovato[i].title,
          bandieraStampata: gestioneBandiera(bandiera),
          voti: cambioStelle(votoArrotondato),
          copertina: stampaCopertina(copertinaFilm),
          overview: overView
        };
      } else {
        //passo i dati del film al context
        var context = {
          titolo: filmTrovato[i].title,
          titoloOriginale: filmTrovato[i].original_title,
          bandieraStampata: gestioneBandiera(bandiera),
          voti: cambioStelle(votoArrotondato),
          copertina: stampaCopertina(copertinaFilm),
          overview: overView
        };
      }


      var htmlStampato = templateCompilato(context);
      $('#filmInfoResult').append(htmlStampato);



    }

    //aggiunta click che dovrà far apparire il testo del film
    $('.card').mouseover(function() {
      console.log($(this));
      $(this).children('.infoText').css("display", "block");
      $(this).children('.copertinaFilm').css("display", "none");

    });
    //gestione dell'uscita del mouse dalla card
    $('.card').mouseout(function() {
      console.log($(this));
      $(this).children('.infoText').hide();
      $(this).children('.copertinaFilm').css("display", "block");

    });
  }
  //funzione per la chimata ajax al api sui film
  function cercaFilm(valoreRicerca) {
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
        if (filmTrovato == 0) {
          console.log("non ho trovato niente");
          $("#filmInfoResult").html("Mi spiace non ho trovato il film cercato..");
        } {
          //FUNZIONE CHE STAMPERA IN HTML TUTTI I RISULTATI COERENTI
          //DEL VALORE DI RICERCA PER I FILM
          renderHtml(filmTrovato);
          /*****************************************************/
          //FUNZIONE CHE CERCHERA' LE SERIE TV (CAMPI DIVERSI JSON)
          cercaSerie(valoreRicerca);
        }


      },
      error: function(richiesta, stato, errori) {
        //localizzare il codice di errore
        console.log(richiesta.status);

        if (richiesta.status == 422) {
          alert('inserisci il film  da cercare!');
        }


      }
    });
  }
  //funzione per la chimata ajax al api sulle serie tv
  function cercaSerie(valoreRicerca) {
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
      success: function(data, stato) {

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
          var overView = serieLoop.overview;



          serieLoop.title = serieLoop.name;
          serieLoop.original_title = serieLoop.original_name;
          var templateBaseSerie = $('#filmInfo').html();
          var templateCompilatoSerie = Handlebars.compile(templateBaseSerie);

          var context = {
            titolo: serieTrovata[i].title,
            titoloOriginale: serieTrovata[i].original_title,
            bandieraStampata: gestioneBandiera(bandiera),
            voti: cambioStelle(votoArrotondato),
            copertina: stampaCopertina(copertinaSerie),
            overview: overView
          };

          var htmlStampatoSerie = templateCompilatoSerie(context);
          $('#filmInfoResult').append(htmlStampatoSerie);

        }

        //aggiunta click che dovrà far apparire il testo del film
        $('.card').mouseover(function() {
          console.log($(this));
          $(this).children('.infoText').css("display", "block");
          $(this).children('.copertinaFilm').css("display", "none");

        });
        //gestione dell'uscita del mouse dalla card
        $('.card').mouseout(function() {
          console.log($(this));
          $(this).children('.infoText').hide();
          $(this).children('.copertinaFilm').css("display", "block");

        });
      },
      error: function(richiesta, stato, errori) {
        //localizzare il codice di errore
        console.log(richiesta.status);
        if (richiesta.status == 422) {
          alert('inserisci la serie da cercare!');
        }

      }
    });
    /*****************************************************/
    /*****************************************************/
    /*****************************************************/
    /*****************************************************/
  };







});
