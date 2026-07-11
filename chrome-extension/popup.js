const baseUrl = "https://my-helper.app";

document.querySelectorAll("button[data-path]").forEach((button) => {
  button.addEventListener("click", () => {
    const path = button.getAttribute("data-path") || "/";
    chrome.tabs.create({ url: `${baseUrl}${path}` });
  });
});
