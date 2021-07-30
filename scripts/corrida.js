function organizaRanks(array, elemento, ordem){
    for(var r =  1; r <= array.length; r++){
        var rank = totalGalgos;
        if(ordem){
            rank = 1;
        }
            
        for(rr = 1; rr <= array.length; rr++){
            if(array[r-1] >= array[rr-1] && ordem && r != rr){
                rank = rank+1;
            }
            if(array[r-1] >= array[rr-1] && !ordem && r != rr){
                rank = rank-1;
            }
        }
        try{
            document.getElementById(elemento+r).innerHTML = rank;
        }catch(error){
            console.log(error);
        }
    }
}

const queryString = window.location.search;
var id = queryString.split("id=")[1];
var url = "https://bergalgosapi.herokuapp.com/corridafull/"+id;//Sua URL
//console.log(id);

//console.log("VAISEFUDER");
var xhttp = new XMLHttpRequest();
xhttp.responseType = 'json';
xhttp.open("GET", url, true);
xhttp.send();//A execução do script pára aqui até a requisição retornar do servidor
var render = "";
var totalGalgos = 0;
xhttp.onload  = (res) => {
    var jsonResponse = xhttp.response;
    // do something with jsonResponse
    var conteudo = jsonResponse;
    var header = conteudo['card-header'];
    var title = conteudo['card-title'];
    var tabs = conteudo['card-tabs'];
    var card = conteudo['card'];

    //console.log(header);
    var nomePista = tabs.trackName;
    var postPick = title.postPick;
    var horarioSplit = tabs.raceDateTime.split(":");
    var hora = horarioSplit[0];
    var minutos = horarioSplit[1];
    hora = parseInt(hora)-4;
    var horario = hora+":"+minutos;
    var categoria = tabs.raceGrade;
    var distancia = tabs.distance;

    var melhoresTempos = [];
    var melhoresSplits = [];
    var mediasSplits = [];
    var mediasTempos = [];
    var topsSpeeds = [];

    document.getElementById("nomePista").innerHTML = "<h2>"+nomePista+" ["+horario+"] - POST PICK: "+postPick+" - "+categoria+" "+distancia+" metros</h2><br>[INFORMAÇÕES DO GALGO NESSA PISTA E DISTANCIA (APENAS CORRIDAS OFICIAIS!)]";
    document.getElementById("titulo").innerHTML = nomePista+" ["+horario+"]";
    for(var o = 0; o < card.dogs.length; o++){
        totalGalgos = totalGalgos+1;
        render += "<table class='table align-items-center mb-0' >";
        var galgo = card.dogs[o];
        var tempos = [];
        var splits = [];
        render += "<div class='row'>"
        +"<div class='col-xl-2 col-sm-6 mb-xl-0 mb-4'>"
        +"<div class='card'>"
            +"<div class='card-body p-3'>"
            +"<div class='row'>"
                +"<div class='col-8'>"
                +"<div class='numbers'>"
                    +"<h5 class='font-weight-bolder mb-0'>"
                    +galgo.dogName
                    +"</h5>"
                +"</div>"
                +"</div>"
                +"<div class='col-4 text-end'>"
                +"<div class='icon icon-shape shadow text-center border-radius-md'>"
                    +"<i text-lg opacity-10'><img src='assets/img/"+galgo.trapNum+".png' width='100%'></i>"
                +"</div>"
                +"</div>"
            +"</div>"
            +"</div>"
        +"</div>"
        +"</div></div>"+
        "<thead>"+
            "<tr>"
            +"<th class='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7'>Data</th>"
            //+"<th class='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2'>Pista</th>"
            //+"<th class='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2'>Distancia</th>"
            +"<th class='text-secondary opacity-7'>Bends</th>"
            +"<th class='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7'>Chegada</th>"
            //+"<th class='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2'>Diferença</th>"
            //+"<th class='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2'>Vencedor/Segundo</th>"
            +"<th class='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2'>Trap</th>"
            //+"<th class='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2'>Tempo do Vencedor</th>"
            +"<th class='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2'>Remarks</th>"
            +"<th class='text-secondary opacity-7'>GNG</th>"
            +"<th class='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7'>Peso</th>"
            +"<th class='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7'>Grade</th>"
            +"<th class='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2'>Split</th>"
            +"<th class='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2'>Tempo Final</th>"
            +"</tr>"
        +"</thead><tbody>";
        for(var g = 0; g < galgo.info.details.forms.length; g++){
            var galgoForms = galgo.info.details.forms[g];
            //if(galgo.infos.length >= 5){
                var distanciaV = galgoForms.distMetre;
                var categoriaS = galgoForms.rGradeCde;
                var galgoTempo = parseFloat(galgoForms.calcRTimeS);
                var galgoSplit = parseFloat(galgoForms.secTimeS);
                var galgoData = galgoForms.raceTime.split(" ")[0];
                var galgoBends = galgoForms.bndPos;
                var galgoFin = galgoForms.rOutcomeId;
                var galgoTrap = galgoForms.trapNum;
                var galgoRemarks =galgoForms.remarks;
                var galgoPeso = galgoForms.weight;
                var galgoGng = galgoForms.goingType;
                var galgoCategoria = galgoForms.rGradeCde;
                //console.log(categoriaS+" e "+categoria);
                //console.log(distancia+" e "+distanciaV);
                //console.log(galgoForms.trackId+" e "+galgo.trackId);
                if(distanciaV == distancia && categoriaS[0] == categoria[0] && galgoForms.trackId == galgo.trackId){
                    //console.log("SIM É A MSM PISTA PORRA!!!!");
                    if(galgoTempo > 0.0){
                        tempos.push(parseFloat(galgoTempo));
                    }
                    if(galgoSplit > 0.0){
                        splits.push(parseFloat(galgoSplit));
                    }
                    render += "<tr><td><div class='d-flex px-2 py-1'><div></div><div class='d-flex flex-column justify-content-center'>"
                    +"<h6 class=mb-0 text-sm>"+galgoData+"</h6></div></div></td>"
                    //+"<td><p class='text-xs font-weight-bold mb-0'>"+galgoStats.Track+"</p></td>"
                    //+"<td><p class='text-xs font-weight-bold mb-0'>"+galgoStats.Dis+"</p></td>"
                    +"<td><p class='text-xs font-weight-bold mb-0'>"+galgoBends+"</p></td>"
                    +"<td><p class='text-xs font-weight-bold mb-0'>"+galgoFin+"</p></td>"
                    //+"<td><p class='text-xs font-weight-bold mb-0'>"+galgoStats.By+"</p></td>"
                    //+"<td><p class='text-xs font-weight-bold mb-0'>"+galgoStats.WinSec+"</p></td>"
                    +"<td><p class='text-xs font-weight-bold mb-0'>"+galgoTrap+"</p></td>"
                    //+"<td><p class='text-xs font-weight-bold mb-0'>"+galgoStats.WnTm+"</p></td>"
                    +"<td><p class='text-xs font-weight-bold mb-0'>"+galgoRemarks+"</p></td>"
                    +"<td><p class='text-xs font-weight-bold mb-0'>"+galgoGng+"</p></td>"
                    +"<td><p class='text-xs font-weight-bold mb-0'>"+galgoPeso+"</p></td>"
                    +"<td><p class='text-xs font-weight-bold mb-0'>"+galgoCategoria+"</p></td>"
                    +"<td><p class='text-xs font-weight-bold mb-0'>"+galgoSplit+"</p></td>"
                    +"<td><p class='text-xs font-weight-bold mb-0'>"+galgoTempo+"</p></td>"
                    +"</tr>";
                //}
            }
        }
        
        //console.log(tempos);
        //console.log(splits);
        tempos.sort();
        splits.sort();
        melhorTempo = tempos[0];
        melhorSplit = splits[0];
        melhoresTempos.push(melhorTempo);
        melhoresSplits.push(melhorSplit);
        topsSpeeds.push(parseInt(galgo.topSpeed));
        if(tempos.length >= 7){
            media5Tempos = ((tempos[0]+tempos[1]+tempos[2]+tempos[3]+tempos[4])/5).toFixed(3);
            media5Splits = ((splits[0]+splits[1]+splits[2]+splits[3]+splits[4])/5).toFixed(3);
            mediasSplits.push(media5Splits);
            mediasTempos.push(media5Tempos);
            document.getElementById("informacoesGalgos").innerHTML += "<br><div class='row'>"
                +"<div class='col-xl-2 col-sm-6 mb-xl-0 mb-4'>"
                +"<div class='card'>"
                    +"<div class='card-body p-3'>"
                    +"<div class='row'>"
                        +"<div class='col-8'>"
                        +"<div class='numbers'>"
                            +"<h5 class='font-weight-bolder mb-0'>"
                            +galgo.dogName
                            +"</h5>"
                        +"</div>"
                        +"</div>"
                        +"<div class='col-4 text-end'>"
                        +"<div class='icon icon-shape shadow text-center border-radius-md'>"
                            +"<i text-lg opacity-10'><img src='assets/img/"+galgo.trapNum+".png' width='100%'></i>"
                        +"</div>"
                        +"</div>"
                    +"</div>"
                    +"</div>"
                +"</div>"
                +"</div>"  
                +"<div class='col-xl-2 col-sm-6 mb-xl-0 mb-4'>"
                +"<div class='card'>"
                    +"<div class='card-body p-3'>"
                    +"<div class='row'>"
                        +"<div class='col-8'>"
                        +"<div class='numbers'>"
                            +"<p class='text-sm mb-0 text-capitalize font-weight-bold'>Top Speed</p>"
                            +"<h5 class='font-weight-bolder mb-0'>"
                            +galgo.topSpeed
                            +"</h5>"
                        +"</div>"
                        +"</div>"
                        +"<div class='col-4 text-end'>"
                        +"<div class='icon icon-shape bg-gradient-primary shadow text-center border-radius-md'>"
                            +"<i class='text-lg opacity-10' aria-hidden='true' id='rankTS"+galgo.trapNum+"'></i>"
                        +"</div>"
                        +"</div>"
                    +"</div>"
                    +"</div>"
                +"</div>"
                +"</div>"     
                +"<div class='col-xl-2 col-sm-6 mb-xl-0 mb-4'>"
                +"<div class='card'>"
                    +"<div class='card-body p-3'>"
                    +"<div class='row'>"
                        +"<div class='col-8'>"
                        +"<div class='numbers'>"
                            +"<p class='text-sm mb-0 text-capitalize font-weight-bold'>Melhor Split</p>"
                            +"<h5 class='font-weight-bolder mb-0'>"
                            +melhorSplit
                            +"</h5>"
                        +"</div>"
                        +"</div>"
                        +"<div class='col-4 text-end'>"
                        +"<div class='icon icon-shape bg-gradient-primary shadow text-center border-radius-md'>"
                        +"<i class='opacity-10' aria-hidden='true' id='rankS"+galgo.trapNum+"'></i>"
                        +"</div>"
                        +"</div>"
                    +"</div>"
                    +"</div>"
                +"</div>"
                +"</div>"                   
                +"<div class='col-xl-2 col-sm-6 mb-xl-0 mb-4'>"
                +"<div class='card'>"
                    +"<div class='card-body p-3'>"
                    +"<div class='row'>"
                        +"<div class='col-8'>"
                        +"<div class='numbers'>"
                            +"<p class='text-sm mb-0 text-capitalize font-weight-bold'>Melhor Tempo</p>"
                            +"<h5 class='font-weight-bolder mb-0'>"
                            +melhorTempo
                            +"</h5>"
                        +"</div>"
                        +"</div>"
                        +"<div class='col-4 text-end'>"
                        +"<div class='icon icon-shape bg-gradient-primary shadow text-center border-radius-md'>"
                            +"<i class='opacity-10' aria-hidden='true' id='rankT"+galgo.trapNum+"'></i>"
                        +"</div>"
                        +"</div>"
                    +"</div>"
                    +"</div>"
                +"</div>"
                +"</div>"
                +"<div class='col-xl-2 col-sm-6'>"
                +"<div class='card'>"
                    +"<div class='card-body p-3'>"
                    +"<div class='row'>"
                        +"<div class='col-8'>"
                        +"<div class='numbers'>"
                            +"<p class='text-sm mb-0 text-capitalize font-weight-bold'>Média 5 M Splits</p>"
                            +"<h5 class='font-weight-bolder mb-0'>"
                            +media5Splits
                            +"</h5>"
                        +"</div>"
                        +"</div>"
                        +"<div class='col-4 text-end'>"
                        +"<div class='icon icon-shape bg-gradient-primary shadow text-center border-radius-md'>"
                        +"<i class='opacity-10' aria-hidden='true' id='rankMS"+galgo.trapNum+"'></i>"
                        +"</div>"
                        +"</div>"
                    +"</div>"
                    +"</div>"
                +"</div>"
                +"</div>"
                +"<div class='col-xl-2 col-sm-6 mb-xl-0 mb-4'>"
                +"<div class='card'>"
                    +"<div class='card-body p-3'>"
                    +"<div class='row'>"
                        +"<div class='col-8'>"
                        +"<div class='numbers'>"
                            +"<p class='text-sm mb-0 text-capitalize font-weight-bold' style='font-size: 8pt'>Média 5 M Tempos</p>"
                            +"<h5 class='font-weight-bolder mb-0'>"
                            +media5Tempos
                            +"</h5>"
                        +"</div>"
                        +"</div>"
                        +"<div class='col-4 text-end'>"
                        +"<div class='icon icon-shape bg-gradient-primary shadow text-center border-radius-md'>"
                        +"<i class='opacity-10' aria-hidden='true' id='rankMT"+galgo.trapNum+"'></i>"
                        +"</div>"
                        +"</div>"
                    +"</div>"
                    +"</div>"
                +"</div>"
                +"</div>"
            +"</div";    
        }else{
            mediasTempos.push(0);
            mediasSplits.push(0);
            if(melhorTempo == undefined){
                melhorTempo = "Não Possui";
            }
            if(melhorSplit == undefined){
                melhorSplit = "Não Possui";
            }
            document.getElementById("informacoesGalgos").innerHTML += "<br><div class='row'>"
            +"<div class='col-xl-2 col-sm-6 mb-xl-0 mb-4'>"
            +"<div class='card'>"
                +"<div class='card-body p-3'>"
                +"<div class='row'>"
                    +"<div class='col-8'>"
                    +"<div class='numbers'>"
                        +"<h5 class='font-weight-bolder mb-0'>"
                        +galgo.dogName
                        +"</h5>"
                    +"</div>"
                    +"</div>"
                    +"<div class='col-4 text-end'>"
                    +"<div class='icon icon-shape shadow text-center border-radius-md'>"
                        +"<i text-lg opacity-10'><img src='assets/img/"+galgo.trapNum+".png' width='100%'></i>"
                    +"</div>"
                    +"</div>"
                +"</div>"
                +"</div>"
            +"</div>"
            +"</div>"  
            +"<div class='col-xl-2 col-sm-6 mb-xl-0 mb-4'>"
                +"<div class='card'>"
                    +"<div class='card-body p-3'>"
                    +"<div class='row'>"
                        +"<div class='col-8'>"
                        +"<div class='numbers'>"
                            +"<p class='text-sm mb-0 text-capitalize font-weight-bold'>Top Speed</p>"
                            +"<h5 class='font-weight-bolder mb-0'>"
                            +galgo.topSpeed
                            +"</h5>"
                        +"</div>"
                        +"</div>"
                        +"<div class='col-4 text-end'>"
                        +"<div class='icon icon-shape bg-gradient-primary shadow text-center border-radius-md'>"
                        +"<i class='text-lg opacity-10' aria-hidden='true' id='rankTS"+galgo.trapNum+"'></i>"
                        +"</div>"
                        +"</div>"
                    +"</div>"
                    +"</div>"
                +"</div>"
            +"</div>"   
            +"<div class='col-xl-2 col-sm-6 mb-xl-0 mb-4'>"
            +"<div class='card'>"
                +"<div class='card-body p-3'>"
                +"<div class='row'>"
                    +"<div class='col-8'>"
                    +"<div class='numbers'>"
                        +"<p class='text-sm mb-0 text-capitalize font-weight-bold'>Melhor Split</p>"
                        +"<h5 class='font-weight-bolder mb-0'>"
                        +melhorSplit
                        +"</h5>"
                    +"</div>"
                    +"</div>"
                    +"<div class='col-4 text-end'>"
                    +"<div class='icon icon-shape bg-gradient-primary shadow text-center border-radius-md'>"
                    +"<i class='opacity-10' aria-hidden='true' id='rankS"+galgo.trapNum+"'></i>"
                    +"</div>"
                    +"</div>"
                +"</div>"
                +"</div>"
            +"</div>"
            +"</div>"
            +"<div class='col-xl-2 col-sm-6 mb-xl-0 mb-4'>"
            +"<div class='card'>"
                +"<div class='card-body p-3'>"
                +"<div class='row'>"
                    +"<div class='col-8'>"
                    +"<div class='numbers'>"
                        +"<p class='text-sm mb-0 text-capitalize font-weight-bold'>Melhor Tempo</p>"
                        +"<h5 class='font-weight-bolder mb-0'>"
                        +melhorTempo+"<i id='rankTempo"+galgo.trapNum+"'></i>"
                        +"</h5>"
                    +"</div>"
                    +"</div>"
                    +"<div class='col-4 text-end'>"
                    +"<div class='icon icon-shape bg-gradient-primary shadow text-center border-radius-md'>"
                    +"<i class='opacity-10' aria-hidden='true' id='rankT"+galgo.trapNum+"'></i>"
                    +"</div>"
                    +"</div>"
                +"</div>"
                +"</div>"
            +"</div>"
            +"</div>"
            +"<div class='col-xl-4 col-sm-6 mb-xl-0 mb-4'>"
            +"<div class='card'>"
                +"<div class='card-body p-3'>"
                +"<div class='row'>"
                    +"<div class='col-8'>"
                    +"<div class='numbers'>"
                        +"<p class='text-sm mb-0 text-capitalize font-weight-bold'>Não é Possível Calcular</p>"
                        +"<h5 class='font-weight-bolder mb-0'>"
                        +"<p>Não possui o mínimo necessário</p>"
                        +"</h5>"
                    +"</div>"
                    +"</div>"
                    +"<div class='col-4 text-end'>"
                    +"<div class='icon icon-shape bg-gradient-primary shadow text-center border-radius-md'>"
                        +"<i class='ni ni-fat-remove text-lg opacity-10' aria-hidden='true'></i>"
                    +"</div>"
                    +"</div>"
                +"</div>"
                +"</div>"
            +"</div>"
            +"</div>"
        }

        render += "</tbody></table>";
    }

    //verificarank
    organizaRanks(melhoresSplits, "rankS", true);
    organizaRanks(melhoresTempos, "rankT", true);
    organizaRanks(mediasTempos, "rankMT", true);
    organizaRanks(mediasSplits, "rankMS", true);  
    organizaRanks(topsSpeeds, "rankTS", false);  

    document.getElementById("renderTabela").innerHTML = render;

}
