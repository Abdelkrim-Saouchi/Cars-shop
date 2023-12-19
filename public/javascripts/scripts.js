// implement browse button action
const btn = document.querySelector("#browse-btn");

if (btn) {
  btn.addEventListener("click", () => {
    window.location.assign("/cars");
  });
}
