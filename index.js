import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import models from './models';

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schemas')));
const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname, './resolvers')),
);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const graphqlEndpoint = '/graphql';

// const myGraphQLSchema = // ... define or import your schema here!
const app = express();

app.use('/graphql', bodyParser.json());
// bodyParser is needed just for POST.
app.use(
  '/graphql',
  (req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true);
    res.header(
      'Access-Control-Allow-Headers',
      'content-type, authorization, content-length, x-requested-with, accept, origin',
    );
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.header('Allow', 'POST, GET, OPTIONS');
    res.header('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  },
  graphqlExpress({
    schema,
    context: {
      models,
      user: {
        id: 1,
      },
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
