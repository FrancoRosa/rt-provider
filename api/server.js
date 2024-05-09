const express = require("express");
const socket = require("socket.io");
const app = express();
const port = 8000;
const server = app.listen(port, () => {
  console.log(`...listening on ${port}`);
});

const io = socket(server);
let clients_count = 0;
let clients = [];

const timestamp = () => {
  z = new Date();
  return z.toLocaleString("sv");
};

app.get("/", (req, res) => {
  res.send(
    `<pre>${JSON.stringify({ count: clients_count, clients }, null, 2)}</pre>`
  );
});

io.on("connection", (socket) => {
  console.log(timestamp(), "... client connected");
  clients_count += 1;

  socket.on("disconnect", () => {
    console.log(timestamp(), "... client disconnected", socket.id);
    clients_count -= 1;
    clients = clients.filter((c) => !socket.id.includes(c.id));
  });

  socket.on("msg", (msg) => {
    if (clients.map((c) => c.id).includes(msg.id)) {
      clients = clients.map((c) => (c.id == msg.id ? { ...msg } : c));
    } else {
      clients.push(msg);
    }
    socket.broadcast.emit("brc", msg);
  });
});

setInterval(() => {
  console.log(`${timestamp()}, cl: ${clients_count}`);
}, 1000);
