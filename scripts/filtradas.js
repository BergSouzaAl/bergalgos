function realizaBusca(){
document.getElementById("tituloh2").innerHTML = "ANALISANDO TODAS AS CORRIDAS, POR FAVOR AGUARDE!";
var url = "https://bergalgosapi.herokuapp.com/corridasfull";//Sua URL

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

    for(var i = 0; i < 1; i++){
        var pista = pistas[i];
        if(pista.tvShortName != ""){
            var corridasDaPista = pistas[i].races;
            for(var o = 0; o < corridasDaPista.length; o++){
                corridas.push(corridasDaPista[o]);
            }
        }
    }
    corridas.sort( compare );
    
    var fCategoria = "A";
    var fGalgosMinCorrida = 4;
    var fGalgosMinCalculos = 5;
    var fPosicaoMTGalgo = 6;
    var fPosicaoMSGalgo = 4;
    var fPosicaoTSGalgo = 3;
    var fPosicaoTGalgo = 5;
    var fPosicaoSGalgo = 4;
    /*fCategoria = localStorage.getItem('fCategoria');
    fGalgosMinCorrida = parseInt(localStorage.getItem('fGalgosMinCorrida'));
    fGalgosMinCalculos = parseInt(localStorage.getItem('fGalgosMinCalculos'));
    fPosicaoMTGalgo = parseInt(localStorage.getItem('fPosicaoMTGalgo'));
    fPosicaoMSGalgo = parseInt(localStorage.getItem('fPosicaoMSGalgo'));
    fPosicaoTSGalgo = parseInt(localStorage.getItem('fPosicaoTSGalgo'));
    fPosicaoTGalgo = parseInt(localStorage.getItem('fPosicaoTGalgo'));
    fPosicaoSGalgo = parseInt(localStorage.getItem('fPosicaoSGalgo'));
*/
    for(var i = 0; i < corridas.length;i++){
        var corrida = corridas[i];
        var horarioAux = corrida.raceDate.split(" ")[1];
        var horarioSplit = horarioAux.split(":");
        var hora = horarioSplit[0];
        var minuto = horarioSplit[1];
        var hora = parseInt(hora)-4;
        var horario = hora+":"+minuto;
        var galgolay = 2
        if(corrida.raceGrade[0] == fCategoria){
            
            function verificaRank(array, galgo, ordem, corrida){
                console.log("entrou GALGO "+galgo);
                r = galgo;
                var rank = qntGalgos;
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
                console.log("CORRIDA: "+corrida+", GALGO "+galgo+", RANK:"+rank);
                console.log("ARAY USADO: "+array);
                return rank;
            }
            
                try{
                    var racefull = corrida.infoC;
                }catch(error){
                    continue;
                }
                
                var header = racefull['card-header'];
                var title = racefull['card-title'];
                var tabs = racefull['card-tabs'];
                var card = racefull['card'];
                
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

                var qntGalgos = card.dogs.length;

                if(qntGalgos >= fGalgosMinCorrida){
                    var galgosOk = 0;
                    for(var d = 0; d < qntGalgos; d++){
                        var tempos = [];
                        var splits = [];
                        var galgo = racefull.card.dogs[d];
                        for(var c = 0; c < galgo.info.details.forms.length; c++){
                            var galgoForms = galgo.info.details.forms[c];
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
                                
                            }
                        }

                        tempos.sort();
                        splits.sort();
                        melhorTempo = tempos[0];
                        melhorSplit = splits[0];
                        melhoresTempos.push(melhorTempo);
                        melhoresSplits.push(melhorSplit);
                        topsSpeeds.push(parseInt(galgo.topSpeed));
                        if(tempos.length >= 7){
                            galgosOk = galgosOk+1;
                            media5Tempos = ((tempos[0]+tempos[1]+tempos[2]+tempos[3]+tempos[4])/5).toFixed(3);
                            media5Splits = ((splits[0]+splits[1]+splits[2]+splits[3]+splits[4])/5).toFixed(3);
                            mediasSplits.push(media5Splits);
                            mediasTempos.push(media5Tempos); 
                        }else{
                            mediasTempos.push(0);
                            mediasSplits.push(0);
                            if(melhorTempo == undefined){
                                melhorTempo = "Não Possui";
                            }
                            if(melhorSplit == undefined){
                                melhorSplit = "Não Possui";
                            }
                        }
                    }

                    //verificarank
                    var galgosLay = [];
                    for(var gg = 1; gg <= qntGalgos; gg++){
                        var vms = verificaRank(melhoresSplits, gg, true, horario);
                        var vmt = verificaRank(melhoresTempos, gg, true, horario);
                        var vmts = verificaRank(mediasTempos, gg, true, horario);
                        var vmss = verificaRank(mediasSplits, gg, true, horario);
                        var vts = verificaRank(topsSpeeds, gg, false, horario);
                        if( vms >= fPosicaoSGalgo 
                            && vmt >= fPosicaoTGalgo
                            && vmts >= fPosicaoMTGalgo
                            && vmss >= fPosicaoMSGalgo
                            && vts >= fPosicaoTSGalgo
                            && galgosOk >= fGalgosMinCalculos
                        ){
                            galgosLay.push(gg);
                        }
                    }
                    if(galgosLay.length != 0){
                        render += "<a href='corrida.php?id="+corrida.raceId+"''><tr><td><div class='d-flex px-2 py-1'>"
                        +"<h6 class=mb-0 text-sm>"+horario+"</h6></div>"
                        +"<td><p class='text-xs font-weight-bold mb-0'>"+corrida.trackName+ "</p>"
                        +"</td><td><p class='text-xs font-weight-bold mb-0'>"+corrida.raceGrade+"</p>"
                        +"</td><td><p class='text-xs font-weight-bold mb-0'>"+corrida.distance+"</p>"
                        +"</td><td><p class='text-xs font-weight-bold mb-0'>"+galgosLay+"</p>"
                        +"<td><a href='corrida.html?id="+corrida.raceId+"''><p class='text-xs font-weight-bold mb-0'>ACESSAR</p></a></td></a>";
                    }  
                }       
            }
        }
    document.getElementById("renderTabelaCorridas").innerHTML = "";
    document.getElementById("renderTabelaCorridas").innerHTML = render;
 };

}
function changeMain(elemento,idAux,novoValor){
    var antigo = localStorage.getItem(elemento);
    document.getElementById(idAux+antigo).classList.remove('active');
    localStorage.setItem(elemento,novoValor);
    var novo = localStorage.getItem(elemento);
    document.getElementById(idAux+novo).classList.add('active');
}
function changeCategoriaF(categoria){
    changeMain('fCategoria','btnCCF',categoria);
}
function changeQMinimaGalgos(quantidade){
    changeMain('fGalgosMinCorrida','btnCQG',quantidade);
}
function changeGalgosMinCalculos(a){
    changeMain('fGalgosMinCalculos','tnCCM',a);
}
function changePosicaoMTGalgo(a){
    changeMain('fPosicaoMTGalgo','btnCMT',a);
}
function changePosicaoMSGalgo(a){
    changeMain('fPosicaoMSGalgo','btnCMS',a);
}
function changePosicaoTSGalgo(a){
    changeMain('fPosicaoTSGalgo','btnCTS',a);
}
function changePosicaoTGalgo(a){
    changeMain('fPosicaoTGalgo','btnCT',a);
}
function changePosicaoSGalgo(a){
    changeMain('fPosicaoSGalgo','btnCS',a);
}
var categoriaF = localStorage.getItem('fCategoria');
document.getElementById('btnCCF'+categoriaF).classList.add('active');

var BA = localStorage.getItem('fGalgosMinCorrida');
document.getElementById('btnCQG'+BA).classList.add('active');

var BC = localStorage.getItem('fGalgosMinCalculos');
document.getElementById('tnCCM'+BC).classList.add('active');

var BD = localStorage.getItem('fPosicaoMTGalgo');
document.getElementById('btnCMT'+BD).classList.add('active');

var BE = localStorage.getItem('fPosicaoMSGalgo');
document.getElementById('btnCMS'+BE).classList.add('active');

var BR = localStorage.getItem('fPosicaoTSGalgo');
document.getElementById('btnCTS'+BR).classList.add('active');

var BG = localStorage.getItem('fPosicaoTGalgo');
document.getElementById('btnCT'+BG).classList.add('active');

var BH = localStorage.getItem('fPosicaoSGalgo');
document.getElementById('btnCS'+BH).classList.add('active');
