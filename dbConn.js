const { Pool } = require("pg");

const clientDB = new Pool({
  user: "postgres",
  host: "localhost",
  database: "chat_server_db",
  password: "ashish",
  port: 5432,
});

const startDBServer = async () => {
  try {
    await clientDB.connect();
    console.log("DB SERVER ACTIVE ON PORT: ", 5432);
  } catch (e) {
    console.error(e);
  }
};

module.exports = { startDBServer, clientDB };
