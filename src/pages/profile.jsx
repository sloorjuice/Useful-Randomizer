import "../css/profile.css";
import { useState, useEffect } from "react";
import { auth, db } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

function Profile() {
    const [user, setUser] = useState(null);
    const [profileData, setProfileData] = useState({});
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                try {
                    const userRef = doc(db, "users", currentUser.uid);
                    const userDoc = await getDoc(userRef);

                    if (userDoc.exists()) {
                        setProfileData(userDoc.data());
                    } else {
                        console.error("No such document!");
                    }
                } catch (error) {
                    console.error("Error fetching profile data:", error);
                }
            }
        });

        return () => unsubscribe();
    }, []);

    const handlePasswordReset = () => {
        navigate("/forgot-password"); // Redirect to the password reset page
    };

    return (
        <div className="profile-container">
            <h1>Profile</h1>
            {user ? (
                <div className="profile-details">
                    <p><strong>Username:</strong> {profileData.username || "N/A"}</p>
                    <p><strong>Email:</strong> {profileData.email || "N/A"}</p>
                    <button className="reset-password-button" onClick={handlePasswordReset}>
                        Reset Password
                    </button>
                </div>
            ) : (
                <p>Please log in to view your profile.</p>
            )}
        </div>
    );
}

export default Profile;