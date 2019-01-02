const express = require('express');
const bodyParser = require('body-parser');
const { ApolloServer } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');

const { fetchData, postData, deleteData, patchData } = require('./api');

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

    input AddUserInput {
        firstName: String!
        age: Int!
        companyId: Int
    }

    input EditUserInput {
        id: ID!
        firstName: String
        age: Int
        companyId: Int
    }

    union SearchResult = User | Company

    type Query {
        user(id: ID!): User
        company(id: ID!): Company,
        search(text: String): [SearchResult]
    }

    type Mutation {
        addUser(user: AddUserInput): User
        editUser(user: EditUserInput): User
        deleteUser(id: ID!): User
    }

    schema {
        query: Query
        mutation: Mutation
    }
`];

const resolvers = {
    Query: {
        user: (parentValue, { id }, context, info) => {
            return fetchData(`users/${id}`);
        },
        company: (parentValue, { id }, context, info) => {
            return fetchData(`companies/${id}`);
        },
        search: (parentValue, { text }, context, info) => {
            return [
                {
                    "firstName": "Douglas",
                    "age": 50,
                    "companyId": 2,
                    "id": "odPx6EN"
                },
                {
                    "id": 1,
                    "name": "Google",
                    "description": "Google is awesome!"
                }
            ]
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
    },
    SearchResult: {
        __resolveType: (obj, context, info) => {
            if (obj.name) {
                return 'Company';
            }
            
            if (obj.firstName) {
                return 'User';
            }

            return null;
        }
    },
    Mutation: {
        addUser: (parentValue, { user }, context, info) => {
            return postData(`users`, { ...user });
        },
        deleteUser: (parentValue, { id }) => {
            return deleteData(`users/${id}`);
        },
        editUser: (parentValue, { user }) => {
            return patchData(`users/${user.id}`, user);
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