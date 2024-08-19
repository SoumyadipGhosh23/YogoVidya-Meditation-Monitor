import dotenv from "dotenv";
import os from "os";
import { connectDB } from "./src/db/db.js";
import { app } from "./src/app.js";

// Load environment variables from .env file
dotenv.config({
  path: './.env'
})

const PORT = process.env.PORT || 4000;

// Function to get the local IP address
const getLocalIPAddress = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip over non-IPv4 and internal (i.e., 127.0.0.1) addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost'; // fallback to localhost if no IP found
};

connectDB().then(() => {
  app.listen(PORT, () => {
    const localIP = getLocalIPAddress();
    console.log(`Listening on http://${localIP}:${PORT}`);
  });
}).catch((err) => {
  console.log(err);
});

app.get('/', (req, res) => {
  res.send("Welcome to Meditation App API");
});
