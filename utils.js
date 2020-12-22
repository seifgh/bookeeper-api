module.exports = {
  validatePassword(v) {
    // no spaces, length[8,128]
    return v && /^\S{8,128}$/.test(v);
  },
};
