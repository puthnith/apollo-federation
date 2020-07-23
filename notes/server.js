const { ApolloServer, gql } = require("apollo-server")
const { buildFederatedSchema } = require("@apollo/federation")

const typeDefs = gql`
  type Note @key(fields: "id") {
    id: ID!
    content: ID!
    tags: [Tag!]!
  }

  extend type Query {
    notes: [Note!]!
    note(id: ID!): Note
  }

  extend type Tag @key(fields: "id") {
    id: ID! @external
    notes: [Note!]! @requires(fields: "id")
  }
`

const samples = [
  {
    id: "1",
    content: "Apple",
    tagIds: ["1", "2"],
  },
  {
    id: "2",
    content: "Banana",
    tagIds: ["1"],
  },
  {
    id: "3",
    content: "Cherry",
    tagIds: [],
  },
]

function lookup(id) {
  return samples.find(each => each.id === id)
}

function lookupTags(id) {
  return samples.filter(each => each.tagIds.includes(id))
}

const resolvers = {
  Query: {
    notes() {
      return samples
    },
    note(_, args) {
      console.log("query id:", args)
      return lookup(args.id)
    },
  },
  Tag: {
    notes: tag => {
      console.log(`tag:`, tag)
      const { __typename, id } = tag
      return lookupTags(id)
    },
  },
  Note: {
    __resolveReference(note) {
      console.log(`(resolveReference) note:`, note)
      return lookup(note.id)
    },
    tags(note) {
      console.log(`note:`, note)
      return note.tagIds.map(id => ({ id }))
    },
  },
}

const server = new ApolloServer({ schema: buildFederatedSchema([{ typeDefs, resolvers }]) })
server.listen(5001).then(({ url }) => {
  console.log(`"notes" up and running ${url}`)
})
