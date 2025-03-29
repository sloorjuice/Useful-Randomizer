import "../css/form.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { auth } from "../services/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../services/firebase"; // Import Firestore
import { doc, setDoc } from "firebase/firestore"; // Import Firestore functions

function Register() {
    const [username, setUsername] = useState(""); // Add username state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate(); // Initialize useNavigate

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Add user to Firestore
            await setDoc(doc(db, "users", user.uid), {
                username: username,
                email: email,
            });

            alert("Account Created Successfully!");
            navigate("/"); // Redirect to home page
        } catch (error) {
            setError(error.message); // Display error message
        }
    };

    return (
        <div className="form-container">
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
                <input 
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required 
                />
                <input 
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                />
                <button type="submit">Register</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <p>Already have an account? <a href="/login">Login</a></p>
        </div>
    );
}

export default Register;