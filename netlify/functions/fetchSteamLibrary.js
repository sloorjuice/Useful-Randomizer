const fetch = require('node-fetch');

exports.handler = async (event) => {
    const { steamId } = event.queryStringParameters;
    const apiKey = event.queryStringParameters.apiKey || process.env.STEAM_API_KEY;

    if (!steamId || !apiKey) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Missing steamId or apiKey" }),
        };
    }

    const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${apiKey}&steamid=${steamId}&include_appinfo=true`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: `Steam API error: ${response.statusText}` }),
            };
        }

        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};