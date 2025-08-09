"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import imagePath from "../../public/University_logo.png"

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "password") {
      sessionStorage.setItem("isAdminLoggedIn", "true");
      router.push("/add");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div style={styles.mainContainer}>
      <div style={styles.header}>
        <Image src={imagePath} alt="University Logo" style={styles.logoImage} />
        <h1 style={styles.universityName}>
          Quaid-e-Awam University of Engineering, Sciences and Technology Nawabshah
        </h1>
      </div>

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
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "30px",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "20px",
    textAlign: "center",
  },
  logoImage: {
    width: "100px",
    height: "100px",
    objectFit: "contain",
    marginBottom: "10px",
  },
  universityName: {
    fontSize: "1.5rem",
    fontWeight: "600",
    maxWidth: "700px",
    lineHeight: "1.4",
  },
  container: {
    width: "30%",
    minWidth: "300px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    textAlign: "center",
    backgroundColor: "#f9f9f9",
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
    fontSize: "16px",
  },
};

export default Login;
