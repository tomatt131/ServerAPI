const express = require('express');
const cors = require('cors');
const Web3 = require('web3');
const bodyParser = require('body-parser');
const ethers = require('ethers');
//////////////////////////////////////////////


function getCurrentUTCTime() {
    let currentDate = new Date();
    let timeStamp = parseInt("" + currentDate.getUTCDate() + currentDate.getUTCMonth() + currentDate.getUTCFullYear() + currentDate.getUTCHours() + currentDate.getUTCMinutes() + currentDate.getUTCSeconds());
    return timeStamp
}

async function checkSignatureValidity(expectedAddress, signatureHash){
    let serverStamp = Math.floor(new Date().getTime()/1000);
    let match = false;
    console.log("server", serverStamp, signatureHash, expectedAddress);
    for (let i = 0; i < 16; i++) {
        serverStamp -= 1;
        var verifyMessage = ""+serverStamp
        let recoveredSigner = ethers.utils.verifyMessage(verifyMessage, signatureHash);
        console.log("recovered", recoveredSigner, expectedAddress);
        if (recoveredSigner.toLowerCase() == expectedAddress.toLowerCase()) {
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


app.use(cors({origin: '*'}));

app.get('/', function(req, res) {
    res.send("<style>html {background: black;}</style><h1 style='font-size:60px;color:white;margin:auto;display:block;width:max-content;height:max-content;margin-top:40%;margin-bottom:50%;font-family:Roboto,serif;'>Server</h1>"); //Display the response on the website
});

app.use(bodyParser.json())
app.use(express.json({
    type: ['application/json', 'text/plain']
}))
app.post('/test', async function(req, res) {
    console.log(req.body);
    console.log(req.body.Vaild);
    res.send("HELLO");
})


app.post('/auth', async function(req, res) {
    console.log(req.body);
    let response = await checkSignatureValidity(req.body.Signer, req.body.SignatureHash);
    res.json({Valid:"TEST"});
})


app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function() {
    console.log('we are listening on: ',
        app.get('port'))
});
