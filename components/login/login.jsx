"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "password") {
      sessionStorage.setItem("isAdminLoggedIn", "true");
      router.push("/add"); // Redirect to admin page
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div style={styles.mainContainer}>
    <h1 style={styles.logo}>Quaid-e-Awam University of Engineering, Sciences and Technology Nawabshah</h1>
    <div style={styles.container}>
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>
    </div>
    </div>
  );
};

const styles = {
  mainContainer : {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  container: {
    width: "30%",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
    logo: {
    fontSize: "1.75rem",
    fontWeight: "500",
    margin: "1rem auto"
  },
};

export default Login;
