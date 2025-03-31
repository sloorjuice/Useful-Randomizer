/**
 * Fetch the user's Steam Library using the Steam Web API.
 * @param {string} steamId - The Steam ID of the user.
 * @param {string} apiKey - The Steam Web API key.
 * @returns {Promise<Object>} - A promise that resolves to the user's Steam library data.
 */

export async function fetchSteamLibrary(steamId, apiKey) {
    const url = `/api/steam-library/IPlayerService/GetOwnedGames/v1/?key=${apiKey}&steamid=${steamId}&include_appinfo=true`;

    try {
        console.log("Fetching URL:", url);
        const response = await fetch(url);

        console.log("Response status:", response.status);
        if (!response.ok) {
            throw new Error(`Error fetching Steam library: ${response.statusText}`);
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            if (!data.response || !data.response.games) {
                throw new Error("No games found or Steam profile is private.");
            }
            return data.response.games;
        } else {
            console.error("Unexpected response format:", text);
            throw new Error("Unexpected response format from Steam API");
        }
    } catch (error) {
        console.error("Error fetching Steam library:", error);
        throw error;
    }
}