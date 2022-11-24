const net = require("net");
const client1 = new net.Socket();

const fs = require("fs");
const { parse } = require("csv-parse");
let data = [];
let csvData = [];
let interval = 30000;

fs.createReadStream("./HistoricalExample.csv")
  .pipe(parse({ delimiter: ",", from_line: 1 }))
  .on("data", function (row) {
    csvData.push(row);
  })
  .on("error", function (error) {
    console.log(error.message);
  })
  .on("end", function () {
    client1.connect(process.env.TCP_PORT,process.env.TCP_HOST, function () {
      csvData.forEach(function (el, index) {
        setTimeout(function () {
          stringEl = el.join("|");
          //Log when the connection is established
          console.log(`Client 1 :Connected to server on port ${port}`);

          //Try to send data to the server
          client1.write(stringEl);
          console.log(`index: ${index}, Data sent: ${stringEl}`);
        }, index * interval);
      });
    });
    client1.on("data", function (data) {
      console.log(`from server : ${data}`);
    });
    // Handle connection close
    client1.on("close", function () {
      console.log("Client 1 :Connection Closed");
    });
    client1.on("error", function (error) {
      console.error(`Connection Error ${error}`);
    });
  });


