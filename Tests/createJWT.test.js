const jwt = require("jsonwebtoken");
const token = require("../createJWT.js");

jest.mock("jsonwebtoken");

describe("createJWT module", () => {
  const dummyPayload = {
    id: 1,
    user: "testuser",
    name: "Test User",
    email: "test@example.com",
    rank: 2,
    streak: 5,
    progressW: 6,
    progressY: 4,
    progressO: 3,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createToken", () => {
    it("should create a token successfully", () => {
      jwt.sign.mockReturnValue("signedToken");

      const result = token.createToken(
        dummyPayload.id,
        dummyPayload.user,
        dummyPayload.name,
        dummyPayload.email,
        dummyPayload.rank,
        dummyPayload.streak,
        dummyPayload.progressW,
        dummyPayload.progressY,
        dummyPayload.progressO
      );

      expect(jwt.sign).toHaveBeenCalledWith(
        dummyPayload,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30m" }
      );
      expect(result).toEqual({ accessToken: "signedToken" });
    });

    it("should return error object if jwt.sign throws", () => {
      jwt.sign.mockImplementation(() => {
        throw new Error("sign error");
      });

      const result = token.createToken(
        dummyPayload.id,
        dummyPayload.user,
        dummyPayload.name,
        dummyPayload.email,
        dummyPayload.rank,
        dummyPayload.streak,
        dummyPayload.progressW,
        dummyPayload.progressY,
        dummyPayload.progressO
      );

      expect(result).toEqual({ error: "sign error" });
    });
  });

  describe("isExpired", () => {
    it("should return false if token is valid", () => {
      jwt.verify.mockImplementation((token, secret, cb) => cb(null, {}));
      const result = token.isExpired("validToken");
      expect(jwt.verify).toHaveBeenCalledWith(
        "validToken",
        process.env.ACCESS_TOKEN_SECRET,
        expect.any(Function)
      );
      expect(result).toBe(false);
    });

    it("should return true if token is invalid/expired", () => {
      jwt.verify.mockImplementation((token, secret, cb) =>
        cb(new Error("invalid token"), null)
      );
      const result = token.isExpired("invalidToken");
      expect(result).toBe(true);
    });
  });

  describe("refresh", () => {
    it("should decode token and call _createToken with decoded data", () => {
      const decodedPayload = {
        id: 10,
        user: "refreshedUser",
        name: "Refreshed Name",
        email: "refreshed@example.com",
        rank: 3,
        streak: 1,
        progressW: 7,
        progressY: 8,
        progressO: 9,
      };

      jwt.decode.mockReturnValue({ payload: decodedPayload });
      jwt.sign.mockReturnValue("newAccessToken");

      const result = token.refresh("someToken");

      expect(jwt.decode).toHaveBeenCalledWith("someToken", { complete: true });
      expect(jwt.sign).toHaveBeenCalledWith(
        decodedPayload,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30m" }
      );
      expect(result).toEqual({ accessToken: "newAccessToken" });
    });

    it("should handle missing payload gracefully", () => {
      jwt.decode.mockReturnValue(null);
      // Since payload is missing, accessing payload properties throws error, so mock _createToken to handle it
      // But _createToken is private, so here we expect error thrown or test failure
      expect(() => token.refresh("badToken")).toThrow();
    });
  });
});