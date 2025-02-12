(function () {
    function findTradeHistoryData() {
        let scriptTags = document.getElementsByTagName("script");
        let rawData = null;

        for (let script of scriptTags) {
            if (script.innerHTML.includes("var g_rgHistoryInventory")) {
                rawData = script.innerHTML.split("var g_rgHistoryInventory = ")[1]?.split("}};")[0] + "}}";
                break;
            }
        }

        if (!rawData) {
            console.error("Could not find trade history inventory data.");
            return null;
        }

        try {
            return JSON.parse(rawData)["730"]["2"];
        } catch (error) {
            console.error("Error parsing trade history data:", error);
            return null;
        }
    }

    function addInspectButtons(itemList) {
 
        g_steamID = getSteamIDFromPage();

        for(let key in itemList) {
            if ("market_actions" in itemList[key]) {
                let marketActionLink = itemList[key].market_actions[0]?.link;
                if (marketActionLink && marketActionLink.includes("%D")) {

                    let inspect = `steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S${g_steamID}A${key}D${marketActionLink.split("%D")[1]}`;
                    let numbers = getTradeNumbers(itemList[key].id);
                    for (object in numbers) {

                        let itemElement = document.getElementById(numbers[object]);

                        if (itemElement) {
                            if (!itemElement.querySelector(".inspect-button")) {
                                // Create the Inspect button
                                let button = document.createElement("a");
                                button.href = inspect;
                                button.textContent = "Inspect in Game...";
                                button.className = "btn_small btn_grey_white_innerfade";
                                button.style.marginLeft = "12px"
                                button.style.marginRight = "12px";
                                button.style.marginBottom = "16px";
                                button.style.borderRadius = "2px";
                                button.style.padding = "0 15px"
                                button.style.fontSize = "12px"
                                button.style.lineHeight = "20px"

                                // Add click event to open the inspect link
                                button.onclick = function(event) {
                                    event.preventDefault();  // Prevent default link behavior
                                    window.location.href = inspect;
                                };
                                // Append the button next to the item's name (assuming item name has class 'history_item_name')
                                itemElement.appendChild(button);
                            }
                        }
                    }
                }
            }
        };
    }

    function getSteamIDFromPage() {
        let scriptTags = document.getElementsByTagName("script");
        let rawData = null;

        for (let script of scriptTags) {
            if (script.innerHTML.includes("g_steamID")) {
                rawData = script.innerHTML.split("g_steamID = ")[1]?.split(';')[0];
                break;
            }
        }

        if (!rawData) {
            console.error("Could not find trade history inventory data.");
            return null;
        }

        try {
            return rawData.replace(/\"/g, "");
        } catch (error) {
            console.error("Error parsing trade history data:", error);
            return null;
        }
    }
    function getTradeNumbers(itemID) {
        let scripts = document.getElementsByTagName("script");
        let tradeNumbers = [];
    
        for (let script of scripts) {
            let regex = new RegExp(`HistoryPageCreateItemHover\\s*\\(\\s*'([^']+)'\\s*,\\s*730\\s*,\\s*'2'\\s*,\\s*'${itemID}'`, "g");
            let match;
    
            while ((match = regex.exec(script.innerHTML)) !== null) {
                tradeNumbers.push(match[1]); // Collect all trade numbers
            }
        }
    
        return tradeNumbers.length > 0 ? tradeNumbers : null; // Return null if no matches
    }
    function initExtension() {
        let itemList = findTradeHistoryData();
        if (itemList) {
            addInspectButtons(itemList);
    }
}

    // Run the script after the page loads
    window.addEventListener("load", initExtension);
})();