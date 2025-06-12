import cron from "node-cron";
const crobfunction = () => {
  cron.schedule("*/14 * * * *", () => {
    const keepAliveUrl = `https://todo-express-4.onrender.com/api/keep-alive`;
    console.log(`Performing self-ping to: ${keepAliveUrl}`);

    fetch(keepAliveUrl)
      .then((res) =>
        console.log(`Keep-alive ping successful (Status: ${res.status})`)
      )
      .catch((err) => console.error("Keep-alive ping failed:", err));
  });
};

export default crobfunction;
