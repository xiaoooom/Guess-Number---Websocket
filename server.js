
const ws = require('nodejs-websocket')
const PORT = 8000

const TYPE_ENTER = 0;//rappresenta che c'è qlcn entrato
const TYPE_LEAVE = 1;//rappresenta che c'è qlcn andato
const TYPE_MSG = 2;//chat
const TYPE_SERVER_MSG = 3;//Messaggio da parte server
const TYPE_GAMERESTART = 4;

var numPersonConn = 0;//numero di persone connesse

var numeroMin = 1;
var numeroMax = 100;

/* --------------------- numero casuale ----------------------*/
//random tra minNum e maxNum
function randomNum(minNum,maxNum){ 
    switch(arguments.length){ 
        case 1: 
            return parseInt(Math.random()*minNum+1,10); 
        break; 
        case 2: 
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
        break; 
            default: 
                return 0; 
            break; 
    } 
} 

//creare numero casuale
var numeroIndovina = randomNum(numeroMin, numeroMax);


//creare un server
const server = ws.createServer(connect => {

    /*
        type：tipo di messaggio
        msg：contenuto del messaggio
    */


    console.log("c'è qualcuno connesso")
    numPersonConn++;//tot persone connesse +1
    connect.userName = "user" + numPersonConn;//nome utente

    //1.comunicazione broadcast a tutti che c'è qlcn connessoù
    //broadcast(connect.userName + " è connesso");
    broadcast({
        type: TYPE_ENTER,
        msg: connect.userName + " è connesso",
    })

    //2.riceve i dati dal browser (client)
    connect.on('text', data => {
        //convertire i dati in tipo numero
        data = Number(data);
        
        //broadcast(data)
        broadcast({
            type: TYPE_MSG,
            msg: connect.userName + ": " + data,
        })

        if(data > numeroIndovina){//se il numero inserito è maggiore, allora:
            //broadcast("il numero è minore di " + data)//comunica che è minore del numero da indovinare
            broadcast({
                type: TYPE_SERVER_MSG,
                msg: "il numero è minore di " + data,
            })
        }else if(data < numeroIndovina){//se il numero inserito è minore, allora:
            //broadcast("il numero è maggiore di " + data)//comunica che è maggiore del numero da indovinare
            broadcast({
                type: TYPE_SERVER_MSG,
                msg: "il numero è maggiore di " + data,
            })
        }else if(data === numeroIndovina){//se il numero inserito dal client è uguale al numero da indovinare, allora comunica che ha vinto
            //broadcast(connect.userName + " ha vinto")
            broadcast({
                type: TYPE_SERVER_MSG,
                msg: connect.userName + " ha vinto",
            })

            //reimposta il numero da indovinare
            numeroIndovina = randomNum(numeroMin, numeroMax);

            broadcast({
                type: TYPE_GAMERESTART,
                msg: "------------------- Il gioco ricomincia -------------------"
            })
        }



    })

    //3.quando c'è qlcn disconnette
    connect.on('close', data => {
        console.log("disconnessa")
        numPersonConn--;//tot persone connesse -1
        //broadcast(connect.userName + " è disconnessa")
        broadcast({
            type: TYPE_LEAVE,
            msg: connect.userName + " è disconnessa",
        })
    })

    //4.quando ci sono i errori
    connect.on('error', data => {
        console.log("errore")
    })
})

//broadcast: mandare messaggi a tutti gli utenti
function broadcast(msg) {

    //server.connections: tutti gli utenti connessi
    server.connections.forEach(item => {
        item.send(JSON.stringify(msg))//mandare a ogni utente il messaggio ricevuto(msg)
    })
}

//ascoltare la porta 8000
server.listen(PORT, ()=> {
    console.log("websocket server acceso e ascolta sulla porta " + PORT);
})

