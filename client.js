const { io } = require("socket.io-client");
const socket = io("ws://localhost:8000");
let id;
const getPeriod = () => {
  arr = [7, 11, 15, 19, 23];
  index = Date.now() % arr.length;
  return arr[index];
};

const period = getPeriod();

socket.on("connect", () => {
  id = socket.id.slice(0, 5);
  console.log("...connected:", id);
  console.log({ id, period });
});

socket.on("disconnect", () => {
  console.log("...disconnect", id);
});

setInterval(() => {
  const payload = { id, pl: parseInt(Date.now() / 1000) % 1000 };
  socket.emit("msg", payload);
  console.log("tx:", payload);
}, getPeriod() * 1000);

socket.on("brc", (data) => {
  console.log("rx:", data);
});
