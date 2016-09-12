function Record(obj) {
  Object.keys(obj).forEach((k) => {
    if (obj instanceof Record || Object.prototype.hasOwnProperty.call(obj, k)) {
      Object.defineProperty(this, k, { value: obj[k], enumerable: true, writable: true, configurable: true });
    }
  });
}

Record.prototype = Object(null);

export default Record;
