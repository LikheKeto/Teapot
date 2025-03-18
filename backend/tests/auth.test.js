const request = require("supertest");
const sinon = require("sinon");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  registerHandler,
  loginHandler,
  verifyHandler,
} = require("../src/controllers/authController");
const {
  createUser,
  checkStatus,
  findUserByEmail,
  declareVerified,
} = require("../src/models/userModel");
const { sendVerificationMail } = require("../src/utils/mail");
const logger = require("../src/utils/logger");

jest.mock("../src/models/userModel");
jest.mock("../src/utils/mail");
jest.mock("../src/utils/logger");

describe("Auth Controller - Register Handler", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        username: "testuser",
        email: "test@example.com",
        password: "SecurePass123!",
      },
    };
    res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    sinon.stub(bcrypt, "hash").resolves("hashed_password");
  });

  afterEach(() => {
    sinon.restore();
  });

  test("should register a new user and send verification email", async () => {
    checkStatus.mockResolvedValue({ existing: false, pendingApproval: false });
    createUser.mockResolvedValue({
      id: 1,
      username: "testuser",
      email: "test@example.com",
    });
    sendVerificationMail.mockResolvedValue({ id: "email_sent_id" });

    await registerHandler(req, res);

    expect(createUser).toHaveBeenCalledWith(
      "testuser",
      "test@example.com",
      "hashed_password",
      expect.any(String)
    );
    expect(sendVerificationMail).toHaveBeenCalledWith(
      "test@example.com",
      expect.any(String),
      "testuser"
    );
    expect(res.status.calledWith(201)).toBeTruthy();
    expect(
      res.json.calledWithMatch({
        username: "testuser",
        email: "test@example.com",
      })
    ).toBeTruthy();
  });

  test("should return 409 if email already exists", async () => {
    checkStatus.mockResolvedValue({ existing: true, pendingApproval: false });

    await registerHandler(req, res);

    expect(res.status.getCall(0).args[0]).toBe(409);
    expect(res.json.getCall(0).args[0]).toEqual({
      error: { email: "User with this email already exists" },
    });
  });

  test("should return 400 if validation fails", async () => {
    req.body = { email: "invalid" };
    await registerHandler(req, res);

    expect(res.status.getCall(0).args[0]).toBe(400);
    expect(res.json.getCall(0).args[0]).toEqual({
      error: {
        email: ["Email is not a valid email"],
        password: ["Password can't be blank"],
        username: ["Username can't be blank"],
      },
    });
  });

  test("should return 500 if there is a database error", async () => {
    checkStatus.mockResolvedValue({ existing: false, pendingApproval: false });
    createUser.mockRejectedValue(new Error("Database connection error"));

    await registerHandler(req, res);

    expect(res.status.getCall(0).args[0]).toBe(500);
    expect(res.json.getCall(0).args[0]).toEqual({
      error: "Database connection error",
    });
  });
});

describe("Auth Controller - Login Handler", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        email: "user@example.com",
        password: "password123",
      },
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    };
    sinon.stub(jwt, "sign").returns("fake_jwt_token");
  });

  afterEach(() => {
    sinon.restore();
  });

  test("should return 200 and a token if login is successful", async () => {
    findUserByEmail.mockResolvedValue({
      id: 1,
      email: "user@example.com",
      password: await bcrypt.hash("password123", 10),
      verified: true,
    });

    await loginHandler(req, res);

    expect(res.status.calledWith(200)).toBeTruthy();
    expect(
      res.json.calledWith({
        token: "fake_jwt_token",
      })
    ).toBeTruthy();
  });

  test("should return 400 if password is incorrect", async () => {
    findUserByEmail.mockResolvedValue({
      id: 1,
      email: "user@example.com",
      password: await bcrypt.hash("password", 10),
      verified: true,
    });

    await loginHandler(req, res);

    expect(res.status.calledWith(400)).toBeTruthy();
    expect(
      res.json.calledWith({
        error: "Invalid email or password",
      })
    ).toBeTruthy();
  });

  test("should return 400 if email does not exist", async () => {
    findUserByEmail.mockResolvedValue(null);

    await loginHandler(req, res);

    expect(res.status.calledWith(400)).toBeTruthy();
    expect(
      res.json.calledWith({
        error: "Invalid email or password",
      })
    ).toBeTruthy();
  });

  test("should return 400 if email is not verified", async () => {
    findUserByEmail.mockResolvedValue({
      id: 1,
      email: "user@example.com",
      password: await bcrypt.hash("password123", 10),
      verified: false,
    });

    await loginHandler(req, res);

    expect(res.status.calledWith(400)).toBeTruthy();
    expect(
      res.json.calledWith({
        error: "Invalid email or password",
      })
    ).toBeTruthy();
  });

  test("should return 400 if validation fails", async () => {
    req.body = { email: "invalid" };
    await loginHandler(req, res);

    expect(res.status.calledWith(400)).toBeTruthy();
    expect(
      res.json.calledWith({
        error: {
          email: ["Email is not a valid email"],
          password: ["Password can't be blank"],
        },
      })
    ).toBeTruthy();
  });

  test("should return 500 if there is a database error", async () => {
    findUserByEmail.mockRejectedValue(new Error("Database failure"));

    await loginHandler(req, res);

    expect(res.status.calledWith(500)).toBeTruthy();
    expect(
      res.json.calledWith({
        error: "Database failure",
      })
    ).toBeTruthy();
  });
});

describe("Auth Controller - Verify Handler", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        email: "user@example.com",
        token: "fake_token",
      },
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  test("should return 200 and verify the user if the token is correct", async () => {
    findUserByEmail.mockResolvedValue({
      id: 1,
      email: "user@example.com",
      verified: false,
      verificationToken: "fake_token",
    });
    declareVerified.mockResolvedValue({
      id: 1,
      email: "user@example.com",
      verified: true,
    });

    await verifyHandler(req, res);

    expect(res.status.calledWith(200)).toBeTruthy();

    expect(declareVerified).toHaveBeenCalledWith("user@example.com");

    expect(
      res.json.calledWith({
        id: 1,
        email: "user@example.com",
        verified: true,
      })
    ).toBeTruthy();
  });

  test("should return 400 if user is already verified", async () => {
    findUserByEmail.mockResolvedValue({
      id: 1,
      email: "user@example.com",
      verified: true,
    });

    await verifyHandler(req, res);

    expect(res.status.calledWith(400)).toBeTruthy();

    expect(
      res.json.calledWith({
        error: "User doesn't exist or is already verified",
      })
    ).toBeTruthy();
  });

  test("should return 400 if the verification token is incorrect", async () => {
    findUserByEmail.mockResolvedValue({
      id: 1,
      email: "user@example.com",
      verified: false,
      verificationToken: "different_fake_token",
    });

    await verifyHandler(req, res);

    expect(res.status.calledWith(400)).toBeTruthy();

    expect(
      res.json.calledWith({
        error: "Invalid token",
      })
    ).toBeTruthy();
  });

  test("should return 400 if the user does not exist", async () => {
    findUserByEmail.mockResolvedValue(null);

    await verifyHandler(req, res);

    expect(res.status.calledWith(400)).toBeTruthy();

    expect(
      res.json.calledWith({
        error: "User doesn't exist or is already verified",
      })
    ).toBeTruthy();
  });

  test("should return 400 if validation fails", async () => {
    req.body = { email: "invalid", token: "" };

    await verifyHandler(req, res);

    expect(res.status.calledWith(400)).toBeTruthy();

    expect(
      res.json.calledWith({
        error: {
          email: ["Email is not a valid email"],
        },
      })
    ).toBeTruthy();
  });
});
