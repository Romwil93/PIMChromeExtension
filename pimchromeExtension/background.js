chrome.runtime.onInstalled.addListener(() => {
    console.log("Hello, World!!")

    //receiving a message
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
        console.log(sender.tab ?
                    "from a content script:" + sender.tab.url :
                    "from the extension");
        if (request.greeting === "hello")
            sendResponse({farewell: "goodbye"});
        }
    );


    //create another contect menu entry. If I click on pdf link like that "https://www.belimo.com/mam/corporate-communications/corporate-governance/articles_en.pdf"
    // I want to get the text from the pdf file name "article_en.pdf" on wikipedia.
    chrome.contextMenus.create({
        id: "PIMSearch",
        title: "Search PDF on PIM",
        contexts: ["link"],
        targetUrlPatterns: ["https://*/*.pdf"],

      
    })


});



//listener for context menu
chrome.contextMenus.onClicked.addListener(function(info, tab){
    //the URL that will be added to based on the selection
    baseURL = "https://pim.belimo.ch/mamfile.php?file=";

    // Retrieve the URL of the link that was clicked
    var url = info.linkUrl;

    // Extract the filename from the URL
    var filename = url.substring(url.lastIndexOf('/') + 1);

    var newURL = baseURL + filename;
    //create the new URL in the user's browser
    chrome.tabs.create({ url: newURL });
})