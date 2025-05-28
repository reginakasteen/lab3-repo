import React from "react";
import { render, waitFor } from "@testing-library/react";
import AuthContext, { AuthProvider } from "../../context/AuthContext";
import { BrowserRouter } from "react-router-dom";

jest.mock("jwt-decode", () => jest.fn(() => ({
  user_id: 1,
  exp: Date.now() / 1000 + 1000, 
})));

const fakeJwt =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
  "eyJ1c2VyX2lkIjoxLCJleHAiOjQ3NjMyNDgwMDB9." +
  "signaturepart";

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();

  global.fetch = jest.fn((url) => {
    if (url.endsWith("/token/")) {
      return Promise.resolve({
        status: 200,
        json: async () => ({
          access: fakeJwt,
          refresh: fakeJwt,
        }),
      });
    }
    if (url.endsWith("/set-online/")) {
      return Promise.resolve({
        status: 200,
        json: async () => ({}),
      });
    }
    return Promise.reject(new Error("Unknown fetch call: " + url));
  });
});

test("loginUser updates context and localStorage", async () => {
  function TestComponent() {
    const { loginUser, authTokens, user } = React.useContext(AuthContext);

    React.useEffect(() => {
      (async () => {
        await loginUser("test@example.com", "password");
      })();
    }, [loginUser]);

    return (
      <div>
        <div>Tokens: {authTokens ? "Set" : "Unset"}</div>
        <div>User ID: {user?.user_id}</div>
      </div>
    );
  }

  const { getByText } = render(
    <BrowserRouter>
      <AuthProvider disableTokenCheck={true}>
        <TestComponent />
      </AuthProvider>
    </BrowserRouter>
  );

  await waitFor(() => {
    expect(localStorage.getItem("authTokens")).toBeTruthy();
    expect(getByText(/Tokens: Set/i)).toBeInTheDocument();
    expect(getByText(/User ID: 1/i)).toBeInTheDocument();
  });

  const tokenCalls = fetch.mock.calls.filter(([url]) =>
    url.endsWith("/token/")
  );
  const onlineCalls = fetch.mock.calls.filter(([url]) =>
    url.endsWith("/set-online/")
  );

  expect(tokenCalls.length).toBeGreaterThanOrEqual(1);
  expect(onlineCalls.length).toBeGreaterThanOrEqual(1);
});
