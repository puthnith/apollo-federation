const { ApolloServer } = require("apollo-server")
const { ApolloGateway } = require("@apollo/gateway")

async function run() {
  const gateway = new ApolloGateway({
    serviceList: [
      { name: "Notes", url: "http://localhost:5001" },
      { name: "Tags", url: "http://localhost:5002" },
    ],
  })
  const { schema, executor } = await gateway.load()
  const server = new ApolloServer({ schema, executor })
  server.listen(5000).then(({ url }) => {
    console.log(`"gateway" up and running ${url}`)
  })
}

run()
