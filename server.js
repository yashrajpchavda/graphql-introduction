const express = require('express');
const bodyParser = require('body-parser');
const { ApolloServer } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');

const typeDefs = [`
    type Query {
        hello: String
    }

    schema {
        query: Query
    }
`];

const resolvers = {
    Query: {
        hello: () => 'Hello World!'
    }
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new ApolloServer({ schema });

const app = express();
server.applyMiddleware({ app });

app.listen(4000, () => { console.log('Server started at http://localhost:4000'); });