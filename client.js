const TYPE_ENTER = 0;//rappresenta che c'è qlcn entrato
const TYPE_LEAVE = 1;//rappresenta che c'è qlcn andato
const TYPE_MSG = 2;//chat
const TYPE_SERVER_MSG = 3;//Messaggio da parte server
const TYPE_GAMERESTART = 4;

var btnInvia = document.getElementById('btn_invia');
var divMostra = document.getElementById('div_mostra');
var inputMessaggi = document.getElementById('input_messaggi');
var divMostraNumero = document.getElementById('div_mostraNumero');

var numeroMin = 1;
var numeroMax = 100;

//mostrare numero casuale
divMostraNumero.innerHTML = "Il numero da indovinare è tra: " + numeroMin + " e " + numeroMax;

//1.collegare con il server
var webSocket = new WebSocket('ws://localhost:8000')

//2.listen, se scopre che c'è qlcn connesso, allora:
webSocket.addEventListener('open',function(){
    divMostra.innerHTML = 'connesso qualcuno'
})

//3.inviare messaggi dal client(browser) a server
btnInvia.addEventListener('click', function(){
    
    var messaggio = inputMessaggi.value
    messaggio = Number(messaggio);//cambiare forzamente in Number

    if(isNaN(messaggio)){////isNaN: se non è un numero, ritorna true
        alert("Devi inserire un numero")
    }
    else if(messaggio===0){
        alert("Devi inserire un numero tra " + numeroMin + " e " + numeroMax)
    }else{
        webSocket.send(messaggio)
    }

    inputMessaggi.value = ''
})

//4. ricevere i messaggi inviati dal server
webSocket.addEventListener('message', function(messaggio){
    //console.log(messaggio.data)
    var data = JSON.parse(messaggio.data)//messaggio.data转换成对象
    //divMostra.innerHTML = msg.data

    //creare un div che salva i messaggi
    var divSalva = document.createElement('div')
    divSalva.innerText = data.msg
    if(data.type === TYPE_ENTER){
        divSalva.style.color = 'green'
    } else if(data.type === TYPE_LEAVE){
        divSalva.style.color = 'red'
    }else if(data.type === TYPE_SERVER_MSG || data.type === TYPE_GAMERESTART){
        divSalva.style.color = 'blue'
    }else{
        divSalva.style.color = 'black'
    }

    //poi AGGIUNGERE i messeggi al div che mostra (e non aggiornare i messaggi, cioè cancellare i messaggi precedenti)
    divMostra.appendChild(divSalva)
})

//5. close
webSocket.addEventListener('close', function(){
    console.log("disconnesso")
})

