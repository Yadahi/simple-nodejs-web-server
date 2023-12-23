const fs = require("fs");

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>Enter Message</title><head>");
    res.write(
      '<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>'
    );
    res.write("</html>");
    return res.end();
  }

  if (url === "/message" && method === "POST") {
    // An empty array body is created to store chunks of data from the request body.
    const body = [];

    // An event listener is set up for the 'data' event, which is triggered whenever a new chunk of data is received in the request.
    req.on("data", (chunk) => {
      // In the 'data' event handler, each chunk is pushed into the
      body.push(chunk);
    });

    // Another event listener is set up for the 'end' event, which is triggered when all data has been received.
    return req.on("end", () => {
      // is executed only after the asynchronous operation (writing to "message.txt") is complete.
      // In the 'end' event handler, the chunks are concatenated into a single Buffer, converted to a string (parsedBody), and then split based on "=", and the second part is extracted as the message.
      const parsedBody = Buffer.concat(body).toString();

      const message = parsedBody.split("=")[1];

      fs.writeFile("message.txt", message, (err) => {
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  }

  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<h1>TEST</h1>");
  res.write("</html>");
  res.end();
};

module.exports = requestHandler;
