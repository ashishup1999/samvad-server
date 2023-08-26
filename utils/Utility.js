const deleteNullUndefinedFromObj = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === null || obj[key] === undefined) {
      delete obj[key];
    }
  });
};

const isObjectEmpty = (obj) => {
  if (Object.keys(obj).length === 0) return false;
  return true;
};

module.exports = { deleteNullUndefinedFromObj, isObjectEmpty };
