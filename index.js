import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import models from './models';

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schemas')));
const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname, './resolvers')),
);

const SECRET = 'kakakakakafjsadfjarjafjak';
const SECRET2 = 'kakakafkak23498dfzz**';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const graphqlEndpoint = '/graphql';

const app = express();

app.use('/graphql', bodyParser.json());
app.use(
  '/graphql',
  cors('*'),
  graphqlExpress({
    schema,
    context: {
      models,
      user: {
        id: 1,
      },
      SECRET,
      SECRET2,
    },
  }),
);
app.use(
  '/graphiql',

  graphiqlExpress({ endpointURL: graphqlEndpoint }),
);

models.sequelize.sync().then(() => {
  app.listen(8080);
});
