module.exports = (typeCode) => {
  let code = Math.floor(Math.random() * 1000000 + Date.now() / 100000000);
  while (code < 100000 || code > 999999) {
    code = Math.floor(Math.random() * 1000000 + Date.now() / 100000000);
  }
  return typeCode + "-" + code;
};
