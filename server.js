const express = require('express');
const bodyParser = require('body-parser');
const { ApolloServer } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');

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
            return {
                id,
                firstName: 'James',
                age: 22
            }
        }
    }
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new ApolloServer({ schema });

const app = express();
server.applyMiddleware({ app });

app.listen(4000, () => { console.log('Server started at http://localhost:4000'); });