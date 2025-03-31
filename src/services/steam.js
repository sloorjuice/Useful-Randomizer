/**
 * Fetch the user's Steam Library using the Steam Web API.
 * @param {string} steamId - The Steam ID of the user.
 * @param {string} apiKey - The Steam Web API key.
 * @returns {Promise<Object>} - A promise that resolves to the user's Steam library data.
 */

export async function fetchSteamLibrary(steamId, apiKey) {
    const url = `/api/steam-library/IPlayerService/GetOwnedGames/v1/?key=${apiKey}&steamid=${steamId}&include_appinfo=true`;

    try {
        const response = await fetch(url);
        const text = await response.text(); // Get the raw response as text
        console.log("Raw Response:", text); // Log the raw response

        if (!response.ok) {
            throw new Error(`Error fetching Steam library: ${response.statusText}`);
        }

        const data = JSON.parse(text); // Parse the raw response as JSON
        return data.response.games || [];
    } catch (error) {
        console.error("Error fetching Steam library:", error);
        throw error;
    }
}