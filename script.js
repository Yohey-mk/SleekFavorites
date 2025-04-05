document.addEventListener("DOMContentLoaded", function () {

    let editMode = false;

    const addButton = document.getElementById("add-favorite");
    const editButton = document.getElementById("edit-favorite");
    const noteButton = document.getElementById("note-button");
    const favoritesContainer = document.getElementById("favorites-list");
    const addContainer = document.getElementById("add-favorite-container");
    const saveButton = document.getElementById("save-favorite");
    const cancelButton = document.getElementById("cancel-favorite");
    const memoContainer = document.getElementById("memo-container");

    noteButton.addEventListener("click", function () {
        memoContainer.classList.toggle("show");
        const isMemoVisible = memoContainer.classList.contains("show");
        localStorage.setItem("memoVisible", isMemoVisible ? "true" : "false");
    });

    function applyMemoState() {
        const isMemoVisible = localStorage.getItem("memoVisible") === "true";
        if (isMemoVisible) {
            memoContainer.classList.add("show");
        } else {
            memoContainer.classList.remove("show");
        }
    }

applyMemoState();

    document.getElementById("memo-area").addEventListener("input", function () {
        localStorage.setItem("savedMemo", this.value);
    });

    function loadMemo() {
        let savedMemo = localStorage.getItem("savedMemo") || "";
        document.getElementById("memo-area").value = savedMemo;
    }
    loadMemo();

    loadFavorites();

    addButton.addEventListener("click", function () {
        addContainer.classList.add("show");
    });

    cancelButton.addEventListener("click", function () {
        addContainer.classList.remove("show");
    });

    saveButton.addEventListener("click", function () {
        const siteName = document.getElementById("site-name").value.trim();
        const siteURL = document.getElementById("site-url").value.trim();

        if (siteName === "" || siteURL === "") {
            alert("Enter website and URL");
            return;
        }

        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        favorites.push({ name: siteName, url: siteURL });
        localStorage.setItem("favorites", JSON.stringify(favorites));

        loadFavorites();
        addContainer.classList.remove("show");
        document.getElementById("site-name").value = "";
        document.getElementById("site-url").value = "";
    });

    editButton.addEventListener("click", function () {
        editMode = !editMode;
        document.querySelectorAll(".edit-btn, .delete-btn").forEach(btn => {
            btn.style.display = editMode ? "inline-block" : "none";
        });
    });

    function loadFavorites() {
        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        favoritesContainer.innerHTML = "";

        favorites.forEach((fav, index) => {
            let item = document.createElement("div");
            item.classList.add("favorites-item");
            item.draggable = true;
            item.dataset.index = index;

            let link = document.createElement("a");
            link.href = fav.url;
            link.textContent = fav.name;
            link.target = "_blank";

            let editFavButton = document.createElement("button");
            editFavButton.textContent = "edit";
            editFavButton.classList.add("edit-btn");
            editFavButton.style.display = editMode ? "inline-block" : "none";
            editFavButton.addEventListener("click", function () {
                openEditForm(index, fav.name, fav.url);
            });

            let deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.classList.add("delete-btn");
            deleteButton.style.display = editMode ? "inline-block" : "none";
            deleteButton.addEventListener("click", function () {
                favorites.splice(index, 1);
                localStorage.setItem("favorites", JSON.stringify(favorites));
                loadFavorites();
            });

            item.appendChild(link);
            item.appendChild(editFavButton);
            item.appendChild(deleteButton);
            favoritesContainer.appendChild(item);
        });

        enableDragAndDrop();
    }

    function enableDragAndDrop() {
        const items = document.querySelectorAll(".favorites-item");

        items.forEach(item => {
            item.addEventListener("dragstart", function () {
                this.classList.add("dragging");
            });

            item.addEventListener("dragend", function () {
                this.classList.remove("dragging");
                saveNewOrder();
            });

            item.addEventListener("dragover", function (e) {
                e.preventDefault();
                const afterElement = getDragAfterElement(e.clientY);
                const currentDragging = document.querySelector(".dragging");

                if (afterElement == null) {
                    favoritesContainer.appendChild(currentDragging);
                } else {
                    favoritesContainer.insertBefore(currentDragging, afterElement);
                }
            });
        });
    }

    function getDragAfterElement(y) {
        const draggableElements = [...document.querySelectorAll(".favorites-item:not(.dragging)")];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - (box.top + box.height / 2);
            return offset < 0 && offset > closest.offset ? { offset, element: child } : closest;
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    function saveNewOrder() {
        const newOrder = [...document.querySelectorAll(".favorites-item a")].map(a => ({
            name: a.textContent,
            url: a.href
        }));
        localStorage.setItem("favorites", JSON.stringify(newOrder));
        loadFavorites();
    }

    function openEditForm(index, name, url) {
        let existingEditContainer = document.querySelector(".edit-container");
        if (existingEditContainer) {
            existingEditContainer.remove();
        }

        let editContainer = document.createElement("div");
        editContainer.classList.add("edit-container");

        let nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.value = name;

        let urlInput = document.createElement("input");
        urlInput.type = "url";
        urlInput.value = url;

        let saveEditButton = document.createElement("button");
        saveEditButton.textContent = "Save";
        saveEditButton.addEventListener("click", function () {
            saveEditedFavorite(index, nameInput.value, urlInput.value);
        });

        let cancelEditButton = document.createElement("button");
        cancelEditButton.textContent = "Cancel";
        cancelEditButton.addEventListener("click", function () {
            editContainer.remove();
        });

        editContainer.appendChild(nameInput);
        editContainer.appendChild(urlInput);
        editContainer.appendChild(saveEditButton);
        editContainer.appendChild(cancelEditButton);

        document.body.appendChild(editContainer);
    }

    function saveEditedFavorite(index, newName, newUrl) {
        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        if (newName.trim() === "" || newUrl.trim() === "") {
            alert("Enter the website and URL");
            return;
        }

        favorites[index].name = newName;
        favorites[index].url = newUrl;
        localStorage.setItem("favorites", JSON.stringify(favorites));

        setTimeout(() => {
            loadFavorites();
            document.querySelector(".edit-container")?.remove();
        }, 50);
    }

    document.getElementById("memo-area").addEventListener("input", function () {
        localStorage.setItem("savedMemo", this.value);
    });

    function loadMemo() {
        let savedMemo = localStorage.getItem("savedMemo") || "";
        document.getElementById("memo-area").value = savedMemo;
    }

});
