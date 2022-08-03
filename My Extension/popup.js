
let changeColor = document.getElementById("changeColor");

chrome.storage.sync.get("color", ({
    color
}) => {
    changeColor.style.backgroundColor = color;
});



changeColor.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setPageBackgroundColor,
  });
});



// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    chrome.scripting.executeScript({
        target: {
            tabId: tab.id
        },
        function: setPageBackgroundColor,
    });

});

// The body of this function will be executed as a content script inside the
// current page
function setPageBackgroundColor() {
    // console.log(chrome.storage.local.get());
    console.log('hello');
    // chrome.storage.sync.get("color", ({color}) => {
    //     document.body.style.backgroundColor = color;
    // });

    var formElement = document.querySelector("form");
    var formData = new FormData(formElement);

    formData.delete("secret_user_data"); // don't include this one!
    if (formData.has("include_favorite_color")) {
        formData.set("color", userPrefs.getColor());
    }
    // log all values like <input name="widget">
    console.info("User selected widgets", formData.getAll("widget"));
    window.fetch(window.location.href, {
        method: 'POST',
        body: formData
    });
    console.log(formData);
}


function sendRequest(theFormElement) {
    var formData = new FormData(theFormElement);
    formData.delete("secret_user_data"); // don't include this one!
    if (formData.has("include_favorite_color")) {
        formData.set("color", userPrefs.getColor());
    }
    // log all values like <input name="widget">
    console.info("User selected widgets", formData.getAll("widget"));
    window.fetch(window.location.href, {
        method: 'POST',
        body: formData
    });
    console.log(formData);
};
