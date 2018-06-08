import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import typeDefs from './schema';
import resolvers from './resolvers';
import models from './models';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const graphqlEndpoint = '/graphql';

// const myGraphQLSchema = // ... define or import your schema here!
const app = express();

// bodyParser is needed just for POST.
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
app.use('/graphiql', graphiqlExpress({ endpointURL: graphqlEndpoint }));

models.sequelize.sync({ force: true }).then(() => {
  app.listen(8080);
});
