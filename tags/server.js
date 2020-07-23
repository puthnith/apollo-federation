const { ApolloServer, gql } = require("apollo-server")
const { buildFederatedSchema } = require("@apollo/federation")

const typeDefs = gql`
  type Tag @key(fields: "id") {
    id: ID!
    name: String!
  }

  extend type Query {
    tags: [Tag!]!
    tag(id: ID!): Tag
  }
`

const samples = [
  {
    id: "1",
    name: "Red",
  },
  {
    id: "2",
    name: "Green",
  },
  {
    id: "3",
    name: "Blue",
  },
]

function lookup(id) {
  return samples.find(each => each.id === id)
}

const resolvers = {
  Query: {
    tags() {
      return samples
    },
    tag(_, args) {
      return lookup(args.id)
    },
  },
  Tag: {
    __resolveReference(tag) {
      console.log(`(resolveReference) tag:`, tag)
      return lookup(tag.id)
    },
  },
}

const server = new ApolloServer({ schema: buildFederatedSchema([{ typeDefs, resolvers }]) })
server.listen(5002).then(({ url }) => {
  console.log(`"tags" up and running ${url}`)
})
