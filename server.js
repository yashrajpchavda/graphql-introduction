const express = require('express');
const bodyParser = require('body-parser');
const { ApolloServer } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');

const { fetchData } = require('./api');

const typeDefs = [`
    type User {
        id: ID
        firstName: String
        age: Int
        company: Company
    }

    type Company {
        id: ID
        name: String
        description: String
        users: [User]
    }

    type Query {
        user(id: ID!): User
        company(id: ID!): Company
    }

    schema {
        query: Query
    }
`];

const resolvers = {
    Query: {
        user: (parentValue, { id }, context, info) => {
            return fetchData(`users/${id}`);
        },
        company: (parentValue, { id }, context, info) => {
            return fetchData(`companies/${id}`);
        }
    },
    User: {
        company: ({ companyId }) => {
            return fetchData(`companies/${companyId}`);
        }
    },
    Company: {
        users: ({ id: companyId }) => {
            return fetchData(`companies/${companyId}/users`);
        }
    }
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new ApolloServer({ schema });

const app = express();
server.applyMiddleware({ app });

const port = 4000;

app.listen(port, () => { 
    console.log(`Server started at http://localhost:${port}`); 
});