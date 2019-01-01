const express = require('express');
const bodyParser = require('body-parser');
const { ApolloServer } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const find = require('lodash/find');

const { fetchData } = require('./api');

const users = [
    { id: '1', firstName: 'Alex', age: 22 },
    { id: '2', firstName: 'Robin', age: 34 },
    { id: '3', firstName: 'James', age: 29 }
];

const typeDefs = [`
    type User {
        id: ID
        firstName: String
        age: Int
    }

    type Query {
        user(id: ID!): User
    }

    schema {
        query: Query
    }
`];

const resolvers = {
    Query: {
        user: (parentValue, { id }) => {
            return fetchData(`users/${id}`);
        }
    }
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new ApolloServer({ schema });

const app = express();
server.applyMiddleware({ app });

app.listen(4000, () => { console.log('Server started at http://localhost:4000'); });