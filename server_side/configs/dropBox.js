const Dropbox = require('dropbox').Dropbox;
const fetch = require('isomorphic-fetch'); // Dropbox SDK requires fetch
const dbxAcess = require('../configs/dotenv').DROPBOX_ACCESS_TOKEN

const dbx = new Dropbox({
  accessToken: dbxAcess,
  fetch: fetch
});

module.exports = dbx;