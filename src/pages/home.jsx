import "../css/home.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { db, auth } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";


function Home() {
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                try {
                    // Fetch the username from Firestore
                    const userRef = doc(db, "users", currentUser.uid);
                    const userDoc = await getDoc(userRef);

                    if (userDoc.exists()) {
                        setUsername(userDoc.data().username); // Set the username
                    } else {
                        console.error("No such document!");
                    }
                } catch (error) {
                    console.error("Error fetching username:", error);
                }
            } else {
                setUsername(""); // Clear the username if the user logs out
            }
        });

        return () => unsubscribe(); // Cleanup subscription on unmount
    }, []);

    return (
        <div className="home">
            <h1>Welcome to the Useful Randomizer</h1>
            {user ? (
                <p>Welcome, {username}!</p>
            ) : (
                <p>Discover and randomly select games from your library!</p>
            )}
            <div className="home__links">
                {!user && (
                    <>
                        <Link to="/register" className="home__button">Register</Link>
                        <Link to="/login" className="home__button">Login</Link>
                    </>
                )}
            </div>
        </div>
    );
}

export default Home;