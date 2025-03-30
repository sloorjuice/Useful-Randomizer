import "../css/profile.css";
import { useState, useEffect } from "react";
import { auth, db } from "../services/firebase";
import { onAuthStateChanged, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
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

    const handleDeleteProfile = async () => {
        if (window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
            try {
                // Reauthenticate the user
                const credential = EmailAuthProvider.credential(user.email, prompt("Please enter your password to confirm:"));
                await reauthenticateWithCredential(user, credential);

                // Delete user data from Firestore
                const userRef = doc(db, "users", user.uid);
                await deleteDoc(userRef);

                // Delete user authentication account
                await deleteUser(user);

                alert("Your profile has been deleted.");
                navigate("/"); // Redirect to the homepage or login page
            } catch (error) {
                console.error("Error deleting profile:", error.code, error.message);
                if (error.code === "auth/requires-recent-login") {
                    alert("Please log in again to delete your profile.");
                } else {
                    alert("Failed to delete profile. Please try again.");
                }
            }
        }
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
                    <button className="delete-profile-button" onClick={handleDeleteProfile}>
                        Delete Profile
                    </button>
                </div>
            ) : (
                <p>Please log in to view your profile.</p>
            )}
        </div>
    );
}

export default Profile;