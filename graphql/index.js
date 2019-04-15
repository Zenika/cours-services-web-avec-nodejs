const { ApolloServer } = require('apollo-server');
const merge = require('lodash/merge');
const remove = require('lodash/remove');
const typeDefs = require('./typeDefs');

const contacts = [
  {
    id: 'EktuXZAKl',
    lastName: 'Wayne',
    firstName: 'Bruce',
  },
  {
    id: 'N1BtXbAte',
    lastName: 'Parker',
    firstName: 'Peter',
  },
];

const resolvers = {
  Mutation: {
    addContact: (_, { contact }) => {
      contacts.push(contact);
      return contact;
    },
    updateContact: (_, { contact }) => {
      let result;
      contacts.forEach((c) => {
        if (c.id === contact.id) {
          result = merge(c, contact);
        }
      });
      if (!result) {
        result = contact;
        contacts.push(contact);
      }
      return result;
    },
    deleteContact: (_, { id }) => {
      remove(contacts, { id });
      return id;
    },
  },
  Query: {
    getContacts: () => contacts,
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
