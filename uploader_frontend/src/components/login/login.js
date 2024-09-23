import { useState } from "react";
import React from "react";
import "./login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [serverResponse, setServerResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      //const SERVER_URL = "http://141.99.126.94:5000/api/upload";
      const SERVER_URL = "http://localhost:3002/upload";

      const response = await fetch(SERVER_URL, {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      if (!response.ok) {
        throw new Error("Login failed");
      }
      const data = await response.json(); // Parse the JSON response
      setServerResponse(data); // Storing the received JSON object
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Login error", error);
      setError("Invalid username or password");
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {serverResponse && (
        <div>
          <h3>Server Response</h3>
          <ul>
            {Object.keys(serverResponse).map((key) => (
              <li key={key}>
                {key}: {serverResponse[key]}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
export default Login;
