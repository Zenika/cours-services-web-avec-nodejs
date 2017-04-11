/* eslint-env browser */

fetch('http://localhost:3232/contacts')
  .then(response => response.json())
  .then((contacts) => {
    contacts
      .map((contact) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `${contact.firstName} ${contact.lastName}`;
        return listItem;
      })
      .forEach((contactListItem) => {
        document.querySelector('#contactList').appendChild(contactListItem);
      });
  });
