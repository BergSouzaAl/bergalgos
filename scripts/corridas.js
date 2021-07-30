var url = "https://bergalgosapi.herokuapp.com/corridas";//Sua URL

var xhttp = new XMLHttpRequest();
xhttp.responseType = 'json';
xhttp.open("GET", url, true);
xhttp.send();//A execução do script pára aqui até a requisição retornar do servidor

xhttp.onload  = function() {
    var jsonResponse = xhttp.response;
    var conteudo = jsonResponse.list;
    var pistas = conteudo.items;
    
    // do something with jsonResponse
    var render = "";
    var corridas = [];

    function compare( a, b ) {
        if ( a.raceDate < b.raceDate ){
          return -1;
        }
        if ( a.raceDate > b.raceDate ){
          return 1;
        }
        return 0;
      }      

    for(var i = 0; i < pistas.length; i++){
        var pista = pistas[i];
        if(pista.tvShortName != ""){
            var corridasDaPista = pistas[i].races;
            for(var o = 0; o < corridasDaPista.length; o++){
                corridas.push(corridasDaPista[o]);
            }
        }
    }
    corridas.sort( compare );
    //console.log(corridas);
    for(var i = 0; i < corridas.length;i++){
        var corrida = corridas[i];
        var horarioAux = corrida.raceDate.split(" ")[1];
        var horarioSplit = horarioAux.split(":");
        var hora = horarioSplit[0];
        var minuto = horarioSplit[1];
        var hora = parseInt(hora)-4;
        var horario = hora+":"+minuto;
        render += "<a href='corrida.php?id="+corrida.raceId+"''><tr><td><div class='d-flex px-2 py-1'>"
        +"<h6 class=mb-0 text-sm>"+horario+"</h6></div>"
        +"<td><p class='text-xs font-weight-bold mb-0'>"+corrida.trackName+ "</p>"
        +"</td><td><p class='text-xs font-weight-bold mb-0'>"+corrida.raceGrade+"</p>"
        +"</td><td><p class='text-xs font-weight-bold mb-0'>"+corrida.distance+"</p>"
        +"<td><a href='corrida.html?id="+corrida.raceId+"''><p class='text-xs font-weight-bold mb-0'>ACESSAR</p></a></td></a>";
    }

    document.getElementById("renderTabelaCorridas").innerHTML = render;
 };

