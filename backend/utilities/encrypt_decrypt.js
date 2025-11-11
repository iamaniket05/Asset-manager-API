const crypto = require('crypto');
const CryptoJS = require("crypto-js");
var Sha256 = require("crypto-js/sha256");
var Hex = require('crypto-js/enc-hex');
var Utf8 = require('crypto-js/enc-utf8');
var Base64 = require('crypto-js/enc-base64');
var AES = require("crypto-js/aes");
var base64 = require('base-64');

const encrypt_decrypt = {
  encrypt: (nor_text) => {
    let string = nor_text.toString();
    let secret_key = process.env.SECRET_KEY;
    let secret_iv = process.env.SECRET_IV;
    var key = Sha256(secret_key).toString(Hex).substr(0, 32);
    var iv = Sha256(secret_iv).toString(Hex).substr(0, 16);
    var output = false;

    output = AES.encrypt(string, Utf8.parse(key), {
      iv: Utf8.parse(iv),
    }).toString();
    output = Utf8.parse(output).toString(Base64);
    return output;
  },

  decrypt: (cipher_text) => {
    try {
      let string = cipher_text.toString();
      let secret_key = process.env.SECRET_KEY;
      let secret_iv = process.env.SECRET_IV;
      var key = Sha256(secret_key).toString(Hex).substr(0, 32);
      var iv = Sha256(secret_iv).toString(Hex).substr(0, 16);
      var output = false;

      string = base64.decode(string);

      output = AES.decrypt(string, Utf8.parse(key), {
        iv: Utf8.parse(iv),
      }).toString(Utf8);
      return output;
    } catch (error) {
      return false;
    }
  },
};

module.exports = encrypt_decrypt;
