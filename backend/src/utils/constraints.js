const registerConstraints = {
  username: {
    presence: true,
    length: {
      minimum: 3,
      maximum: 30,
    },
    format: {
      pattern: "[a-zA-Z0-9]+",
      message: "Username can only contain alphanumeric characters.",
    },
  },
  password: {
    presence: true,
    length: {
      minimum: 6,
      maximum: 30,
    },
  },
  email: {
    presence: true,
    email: true,
  },
};

const loginConstraints = {
  password: {
    presence: true,
    length: {
      minimum: 6,
      maximum: 30,
    },
  },
  email: {
    presence: true,
    email: true,
  },
};

const noteConstraints = {
  title: {
    presence: true,
    length: {
      minimum: 3,
      maximum: 255,
    },
  },
  content: {
    presence: true,
    length: {
      minimum: 10,
    },
  },
};

const categoryConstraints = {
  name: {
    presence: true,
    length: {
      minimum: 3,
      maximum: 255,
    },
  },
};

const assignConstraints = {
  noteId: {
    presence: true,
    numericality: {
      onlyInteger: true,
    },
  },
  categoryId: {
    presence: true,
    numericality: {
      onlyInteger: true,
    },
  },
};

const verifyConstraints = {
  email: {
    presence: true,
    email: true,
  },
  token: {
    presence: true,
  },
};

module.exports = {
  registerConstraints,
  loginConstraints,
  noteConstraints,
  categoryConstraints,
  assignConstraints,
  verifyConstraints,
};
