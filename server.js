
//import http from 'http';
import express from 'express'
import cors from 'cors'
import axios from 'axios';


//const http = require('http');

const app = express();
app.use(cors());
app.use(cors({
    origin: '*',
    methods: 'GET,POST',
    credentials: true
}))

const port = 4000;

app.get('/getToken', async (req, res) => {
    let token = "";
    {
        let url = "https://lbl-dev.mdm.stibosystems.com/graphqlv2/auth?userId=#STEPID#&password=#STEPPASSWORD#";
        url = url.replaceAll("#STEPID#", "infowise").replaceAll("#STEPPASSWORD#", "1234");
        await axios
            .post(url, {}, { headers: { "Content-Type": "application/x-www-form-urlencoded" } }).then((response) => {
                if (response.status == 200) {
                    token = "Bearer " + response.data;
                }
            }).catch((err) => {
                console.log("getTokenERR==" + err)
            });
    }
    res.json({ token: token });
    res.end();
})

app.listen(port, () => {
    console.log("Sever is running")
})

// const server = http.createServer((req, res) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     res.end('Hello World\n');
// })

// server.listen(port, hostname, () => {
//     console.log('Server running at http://${hostname}:${port}')
// })