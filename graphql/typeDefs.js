const { gql } = require('apollo-server');

const typeDefs = gql`
  type Contact {
    id: String!
    firstName: String
    lastName: String
  }

  input ContactInput {
    id: String!
    firstName: String
    lastName: String
  }

  type Mutation {
    addContact(contact: ContactInput): Contact
    deleteContact(id: String): String
    updateContact(contact: ContactInput): Contact
  }

  type Query {
    contacts: [Contact]
  }
`;

module.exports = typeDefs;
