/**
 * Fetch the user's Steam Library using the Steam Web API.
 * @param {string} steamId - The Steam ID of the user.
 * @param {string} apiKey - The Steam Web API key.
 * @returns {Promise<Object>} - A promise that resolves to the user's Steam library data.
 */

export async function fetchSteamLibrary(steamId, apiKey) {
    const url = `/.netlify/functions/fetchSteamLibrary?steamId=${steamId}&apiKey=${apiKey}`;

    try {
        console.log("Fetching URL:", url);
        const response = await fetch(url);

        console.log("Response status:", response.status);
        if (!response.ok) {
            throw new Error(`Error fetching Steam library: ${response.statusText}`);
        }

        const data = await response.json();
        if (!data.response || !data.response.games) {
            throw new Error("No games found or Steam profile is private.");
        }
        return data.response.games;
    } catch (error) {
        console.error("Error fetching Steam library:", error);
        throw error;
    }
}