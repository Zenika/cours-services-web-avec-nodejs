module.exports = function repositoryWithUpdate(repository) {
  return {
    ...repository,
    async update(id, newContact) {
      await repository.remove(id);
      await repository.add(newContact);
    },
  };
};

module.exports.callbacks = function repositoryWithUpdate(repository) {
  return {
    ...repository,
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
  };
};
