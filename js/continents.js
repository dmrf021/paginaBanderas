document.querySelectorAll(".region-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const region = btn.dataset.region;
        localStorage.setItem("regionSeleccionada", region);
        window.location.href = "game.html";
    });
});
