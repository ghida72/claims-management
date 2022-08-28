const prompt = (message, callback) => {
  if (window.confirm(message)) {
    callback();
  }
};

export default prompt;
