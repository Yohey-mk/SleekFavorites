document.addEventListener("DOMContentLoaded", function () {
    const saveButton = document.getElementById("save-favorite");
    const closeButton = document.getElementById("close-popup");

    saveButton.addEventListener("click", function () {
        const siteName = document.getElementById("site-name").value.trim();
        const siteURL = document.getElementById("site-url").value.trim();

        if (siteName === "" || siteURL === "") {
            alert("Enter the website and URL");
            return;
        }

        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        favorites.push({ name: siteName, url: siteURL });
        localStorage.setItem("favorites", JSON.stringify(favorites));

        chrome.runtime.sendMessage({ action: "updateFavorites" });

        document.getElementById("site-name").value = "";
        document.getElementById("site-url").value = "";
        window.close();
    });

    closeButton.addEventListener("click", function () {
        window.close();
    });
});