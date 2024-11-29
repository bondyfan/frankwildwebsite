// netlify/functions/youtube-stats.js
var fs = require("fs");
var path = require("path");
var CACHE_FILES = [
  path.join(__dirname, "../../youtube-cache.json"),
  path.join(__dirname, "../../../.netlify/functions-serve/youtube-stats/youtube-cache.json")
];
var DEFAULT_DATA = {
  lastUpdate: (/* @__PURE__ */ new Date()).toISOString(),
  data: {
    "Up\xEDr Dex": 0,
    "Vezmu Si T\u011B Do Pekla": 0,
    "Hafo": 0,
    "Zabil Jsem Svou Holku": 0,
    "Bunny Hop": 0,
    "HOT": 0
  }
};
exports.handler = async function(event, context) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET"
  };
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: ""
    };
  }
  try {
    let stats = null;
    for (const cacheFile of CACHE_FILES) {
      if (fs.existsSync(cacheFile)) {
        try {
          const fileContent = fs.readFileSync(cacheFile, "utf8");
          const parsedContent = JSON.parse(fileContent);
          stats = parsedContent.data || parsedContent;
          stats = { ...DEFAULT_DATA.data, ...stats };
          break;
        } catch (error) {
          console.error("Error reading cache file:", error);
        }
      }
    }
    if (!stats) {
      stats = DEFAULT_DATA.data;
    }
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(stats)
    };
  } catch (error) {
    console.error("Error reading YouTube stats:", error);
    return {
      statusCode: 200,
      // Return 200 with default data instead of 500
      headers,
      body: JSON.stringify(DEFAULT_DATA.data)
    };
  }
};
//# sourceMappingURL=youtube-stats.js.map
