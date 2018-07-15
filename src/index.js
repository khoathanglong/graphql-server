import { GraphQLServer } from 'graphql-yoga';
const { Prisma } = require('prisma-binding');
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import AuthPayload from './resolvers/AuthPayload'
import Subscription from './resolvers/Subscription'
import Feed from './resolvers/Feed'
// 1
const resolvers = {
  Query,
  Mutation,
  AuthPayload,
  Subscription,
  Feed
}
// 3
const server = new GraphQLServer({
  typeDefs:'./src/schema.graphql',
  resolvers,
  context: req=>({
    ...req,
    db:new Prisma ({
      typeDefs:'src/generated/prisma.graphql',
      endpoint:'https://eu1.prisma.sh/long-khoa-5e9590/kd-graphql/dev',
      secret: 'kdgraphqldragon', //this should be here as well
      debug:true
    })
  })
})
server.start(() => console.log(`Server is running on http://localhost:4000`))