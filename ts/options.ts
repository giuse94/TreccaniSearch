// Restore user preference or default option value when opening the options page.
document.addEventListener("DOMContentLoaded", () => {
  browser.storage.local.get(["alwaysNewTab", "backgroundNewTab"]).then( (item: { [key: string]: boolean }) => {
    let alwaysNewTab_CBEl = document.getElementById("alwaysNewTabOption") as HTMLInputElement;
    alwaysNewTab_CBEl.checked = item?.alwaysNewTab ?? true;
    let backgroundNewTab_CBEl = document.getElementById("backgroundNewTabOption") as HTMLInputElement;
    backgroundNewTab_CBEl.checked = item?.backgroundNewTab ?? false;
  });
});

// Store user preference when submitting the form (by clicking on "Save" button).
document.querySelector("button")!.addEventListener("click", () => {
  let alwaysNewTab_CBEl = document.getElementById("alwaysNewTabOption") as HTMLInputElement;
  let alwaysNewTabOptionValue = alwaysNewTab_CBEl.checked ? true : false;
  let backgroundNewTab_CBEl = document.getElementById("backgroundNewTabOption") as HTMLInputElement;
  let backgroundNewTabOptionValue = backgroundNewTab_CBEl.checked ? true : false;
  browser.storage.local.set({
    alwaysNewTab: alwaysNewTabOptionValue,
    backgroundNewTab: backgroundNewTabOptionValue
  });
});
