import "../css/profile.css";
import { useState, useEffect } from "react";
import { auth, db } from "../services/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { onAuthStateChanged, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { doc, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

function Profile() {
    const [user, setUser] = useState(null);
    const [profileData, setProfileData] = useState({});
    const [steamId, setSteamId] = useState(""); // State for Steam ID
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                try {
                    const userRef = doc(db, "users", currentUser.uid);
                    const userDoc = await getDoc(userRef);

                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        setProfileData(data);
                        setSteamId(data.steamId || ""); // Set Steam ID from Firestore
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

    const handleLinkSteam = async () => {
        if (!user) return;

        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, { steamId });
            alert("Steam account linked successfully!");
        } catch (error) {
            console.error("Error linking Steam account:", error);
            alert("Failed to link Steam account. Please try again.");
        }
    };

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
                    <p><strong>Steam ID:</strong></p> {profileData.steamId || "Not linked"}
                    <div className="steam-linking">
                        <input 
                            type="text" 
                            placeholder="Enter your Steam ID"
                            value={steamId}
                            onChange={(e) => setSteamId(e.target.value)}
                        />
                    </div>
                    <button className="link-steam-button" onClick={handleLinkSteam}>
                        Link Steam Account
                    </button>
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