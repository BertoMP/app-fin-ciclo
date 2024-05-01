const { closeServer } = require('../app');

after(() => {
  closeServer();
});