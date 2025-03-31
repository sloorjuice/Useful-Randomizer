import "../css/home.css";
import { fetchSteamLibrary } from "../services/steam";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { db, auth } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";


function Home() {
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState("");
    const [steamId, setSteamId] = useState("");
    const [randomGame, setRandomGame] = useState(null);

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
                        setSteamId(userDoc.data().steamId || ""); // Set the Steam ID if available
                    } else {
                        console.error("No such document!");
                    }
                } catch (error) {
                    console.error("Error fetching username:", error);
                }
            } else {
                setUsername(""); // Clear the username if the user logs out
                setSteamId(""); // Clear the Steam ID if the user logs out
            }
        });

        return () => unsubscribe(); // Cleanup subscription on unmount
    }, []);

    const handleRandomizeGame = async () => {
        if (!steamId) {
            alert("Please link your Steam account to use this feature.");
            return;
        } 
        try {
            const games = await fetchSteamLibrary(steamId, import.meta.env.VITE_STEAM_API_KEY);
            const randomGame = games[Math.floor(Math.random() * games.length)];
            const gameCoverUrl = `https://cdn.cloudflare.steamstatic.com/steam/apps/${randomGame.appid}/header.jpg`;
            setRandomGame({ ...randomGame, coverUrl: gameCoverUrl });
        } catch (error) {
            console.error("Error fetching Steam library:", error);
        }
    };

    return (
        <div className="home">
            <h1>Welcome to the Useful Randomizer (WIP)</h1>
            {user ? (
                <>
                    <p>Welcome, {username}!</p>
                    {steamId && (
                        <>
                            <button onClick={handleRandomizeGame}>Randomize Game</button>
                            {randomGame && (
                                <div className="random-game">
                                    <img src={randomGame.coverUrl} alt={`${randomGame.name} cover`} className="random-game__cover" />
                                    <p><strong>Random Game:</strong> {randomGame.name}</p>
                                </div>
                            )}
                        </>
                    )}
                </>
            ) : (
                <p>Discover and randomly select games from your library!</p>
            )}
            <p>Coming soon: Link playstation and xbox accounts</p>
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