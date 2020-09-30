// Restore user preference or default option value when opening the options page.
document.addEventListener("DOMContentLoaded", () => {
  browser.storage.local.get("alwaysNewTab").then( (item: { [key: string]: boolean }) => {
    let checkBoxElement = document.getElementById("alwaysNewTabOption") as HTMLInputElement;
    checkBoxElement.checked = item?.alwaysNewTab ?? true;
  });
});

// Store user preference when submitting the form (by clicking on "Save" button).
document.querySelector("button")!.addEventListener("click", () => {
  let checkBoxElement = document.getElementById("alwaysNewTabOption") as HTMLInputElement;
  let optionValue = checkBoxElement.checked ? true : false;
  browser.storage.local.set({alwaysNewTab: optionValue});
});
