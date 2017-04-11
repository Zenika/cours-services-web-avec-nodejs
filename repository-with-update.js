module.exports = function repositoryWithUpdate(repository) {
  return Object.assign({}, repository, {
    async update(id, newContact) {
      await repository.remove(id);
      await repository.add(newContact);
    },
  });
};

module.exports.callbacks = function repositoryWithUpdate(repository) {
  return Object.assign({}, repository, {
    update(id, newContact, callback) {
      repository.remove(id, (removeErr) => {
        if (removeErr) {
          callback(removeErr);
        } else {
          repository.add(newContact, (addErr) => {
            if (addErr) {
              callback(addErr);
            } else {
              callback(null);
            }
          });
        }
      });
    },
  });
};
