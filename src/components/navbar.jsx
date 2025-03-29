import "../css/navbar.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../services/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

function Navbar() {
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState(""); // State to store the username
    const [dropdownVisible, setDropdownVisible] = useState(false);

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

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            alert("You have been signed out.");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const toggleDropdown = () => {
        setDropdownVisible((prev) => !prev);
    };

    return (
        <nav className="navbar">
            <div className="navbar__container">
                <Link to="/" className="navbar__logo">
                    Randomizer
                </Link>
                <ul className="navbar__menu">
                    <li>
                        <Link to="/randomizer" className="navbar__link">
                            Randomizer
                        </Link>
                    </li>
                    {user ? (
                        <li className="navbar__dropdown">
                            <span
                                className="navbar__link"
                                onClick={toggleDropdown}
                            >
                                Welcome, {username || "User"}
                            </span>
                            {dropdownVisible && (
                                <div className="navbar__dropdown-menu">
                                    <Link to="/profile" className="navbar__dropdown-item">
                                        Profile
                                    </Link>
                                    <button
                                        className="navbar__dropdown-item"
                                        onClick={handleSignOut}
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </li>
                    ) : (
                        <li>
                            <Link to="/register" className="navbar__link">
                                Register
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;