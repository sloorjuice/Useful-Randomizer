exports.handler = async (event) => {
    const { steamId } = event.queryStringParameters;
    const apiKey = event.queryStringParameters.apiKey || process.env.STEAM_API_KEY;

    console.log("Received request with steamId:", steamId, "and apiKey:", apiKey ? "Provided" : "Not Provided");

    if (!steamId || !apiKey) {
        console.error("Missing steamId or apiKey");
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Missing steamId or apiKey" }),
        };
    }

    const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${apiKey}&steamid=${steamId}&include_appinfo=true`;

    console.log("Fetching URL:", url);

    try {
        const response = await fetch(url); // Use native fetch
        console.log("Response status:", response.status);

        if (!response.ok) {
            console.error("Steam API error:", response.statusText);
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: `Steam API error: ${response.statusText}` }),
            };
        }

        const data = await response.json();
        console.log("Response data:", data);

        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        console.error("Error fetching Steam library:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};