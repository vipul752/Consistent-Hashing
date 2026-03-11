const { getServerForKey } = require("./registry");

const keys = ["user1", "user2", "user3", "user4", "user5"];

keys.forEach((key) => {
  const server = getServerForKey(key);

  console.log(key, "->", server);
});
