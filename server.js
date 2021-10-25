const express = require('express');
const cors = require('cors');
const Web3 = require('web3');
//////////////////////////////////////////////



function getCurrentUTCTime() {
    let currentDate = new Date();
    let timeStamp = parseInt("" + currentDate.getUTCDate() + currentDate.getUTCMonth() + currentDate.getUTCFullYear() + currentDate.getUTCHours() + currentDate.getUTCMinutes() + currentDate.getUTCSeconds());
    console.log(timeStamp);
    return timeStamp
}

async function checkSignatureValidity(expectedAddress, signatureHash){
    let web3 = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org/'));
    let serverStamp = getCurrentUTCTime();
    let match = false;
    console.log("server", serverStamp);
    for (let i = 0; i < 16; i++) {
        serverStamp -= 1;
        let recoveredSigner = await web3.eth.personal.ecRecover(""+serverStamp, signatureHash);
        if (recoveredSigner == expectedAddress.toLowerCase()) {
            console.log("Signature is valid");
            match = true;
            return true
        }
    }
    if (!match){
        return false;
    }
}




//////////////////////////////////////////////
app = express();
app.use(cors());
app.options('*', cors());

app.get('/', function(req, res) {
    res.send("<style>html {background: black;}</style><h1 style='font-size:60px;color:white;margin:auto;display:block;width:max-content;height:max-content;margin-top:40%;margin-bottom:50%;font-family:Roboto,serif;'>Server</h1>"); //Display the response on the website
});

app.get('/test', async function(req, res) {
    res.send("HELLO");
    console.log(req)
})


app.get('/auth', async function(req, res) {
    let response = await checkSignatureValidity(req.signer, req.signatureHash);
    res.send({"Vaild":response});
})

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function() {
    console.log('we are listening on: ',
        app.get('port'))
});
