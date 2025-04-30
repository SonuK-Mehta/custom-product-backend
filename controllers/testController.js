let data = [];

// CREATE (POST)
export const testPostController = (req, res) => {
  const { name } = req.body;

  if (!name) return res.status(400).send("Name is required!");

  data.push(name);
  res.status(200).send(`Hello ${name} Welcome to node.js World :D`);
};
