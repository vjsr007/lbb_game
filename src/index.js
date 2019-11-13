import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { runWithAdal } from 'react-adal';
import { authContext } from './adalConfig';

const DO_NOT_LOGIN = false;
 
runWithAdal(authContext, () => {
    ReactDOM.render(<App />, document.getElementById('root')); 
},DO_NOT_LOGIN);

/*
const payLoad = {
    grant_type: "client_credentials",
    client_id: "a84e5e06-543b-450a-9a81-49a1d34196d4",
    client_secret: "@xniq@nX]4J[PPcxmuWPLG0JAJh9AXP1",
    resource: "https://vault.azure.net"
}

var query = '';
for (const key in payLoad) {
    query += key+"="+payLoad[key]+"&";
}
query = query.slice(0, -1);

fetch("https://login.microsoftonline.com/35efb83b-341d-467a-a856-376201d3ab91/oauth2/token", {
method: 'POST',
body: query,
headers: {
    Pragma: 'no-cache',
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/x-www-form-urlencoded'
}
}).then((response) => {
    console.log(response);
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
})
.then((response) =>{
    console.log(response);
    response.json();
})
.catch((res) => { console.log('Error in Get Token',res); });
*/
serviceWorker.unregister();
