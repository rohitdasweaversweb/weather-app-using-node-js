const http = require('http');
const fs = require('fs');
var requests = require('requests');
const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceval = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%humidity%}", orgVal.main.humidity);
    temperature = temperature.replace("{%wind%}", orgVal.wind.speed);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);



    // console.log(temperature);
    return temperature;
}

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests('https://api.openweathermap.org/data/2.5/weather?q=kolkata&units=metric&appid=b1004f3a4814f740ff8da2e16ddcccd9')
            .on('data', (chunk) => {
                const objData = JSON.parse(chunk);
                const arrData = [objData];
                const realTimedata = arrData.map((value) => replaceval(homeFile, value)).join("");
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(realTimedata);
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);
                res.end();
            });   
    }
});

server.listen(8000, "127.0.0.1");
