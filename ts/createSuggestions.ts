// Typescript does not like using file extensions here, but the browser module
// loader can't locate the file if we do not provide its extension.
import * as TreccaniSearch from "./module.js"

TreccaniSearch.setRandomDefaultSuggestion();

// onInputStarted causes unexpexted behaviour: if the current hint is Hints[n]
// and the user clicks the default suggestion, the search page is for Hints[n + 1].
// Furthermore, the event is called twice if the user enters two spaces after the
// keyword which starts the extension. Thus, we choose this event to update the
// default suggestion.
browser.omnibox.onInputCancelled.addListener(TreccaniSearch.setRandomDefaultSuggestion);

// Update the suggestions whenever the input is changed.
browser.omnibox.onInputChanged.addListener(
(text: string, addSuggestions: ((suggestions: browser.omnibox.SuggestResult[]) => void)) => {
  // If we send a request with no query field, the response status code is 204 (No Content),
  // so response.json() - called in createSuggestionsFromResponse() - would raise
  // an error (unexpected end of data). Then we do not send a request.
  text = text.trim();
  if (text === "") {
    return;
  }

  let headers = new Headers({"Accept": "application/json"});
  let init: RequestInit = {method: "POST", body: `{ "query": "${text}" }`, headers};
  // The text is appended to the URL to easily retrieve it in createSuggestionsFromResponse().
  let url = TreccaniSearch.AutoCompleteUrl + "/?q=" + text;
  let request = new Request(url, init);

  fetch(request)
    .then(createSuggestionsFromResponse)
    // Handle connection errors by showing a message in the address bar:
    // if the user is offline, ask to check Internet connection;
    // if the server does not respond, you can still try to search.
    .catch( (exception: any): Promise<browser.omnibox.SuggestResult[]> => {
      if (exception instanceof TypeError) {
        return new Promise( (resolve: (value: browser.omnibox.SuggestResult[]) => void) => {
          if (!navigator.onLine) {
            console.error(`Couldn't connect to ${TreccaniSearch.BaseURL}: check Internet conncetion.`)
            return resolve([{
              content: TreccaniSearch.BaseURL,
              description: "Nessun suggerimento disponibile: controlla la connessione a Internet"
            }]);
          }
          console.error(`Couldn't retrieve suggestions from ${url}.`)
          return resolve([{
            content: TreccaniSearch.SearchUrl + text,
            description: `Nessun suggerimento disponibile: cerca "${text}" su Treccani`
          }]);
        });
      }
      else {
        throw exception;
      }
    })
    .then(addSuggestions);
});

// Open the page based on how the user clicks on a suggestion.
browser.omnibox.onInputEntered.addListener(
(text: string, disposition: browser.omnibox.OnInputEnteredDisposition) => {
  // If the user did not enter any search term, we use the current hint.
  if (text.trim() === "") {
    text = TreccaniSearch.getCurrentHint();
  }

  let url = text;
  // If the user clicks on the default suggestion, text contains the query typed,
  // so we need to build the URL.
  if (!text.startsWith(TreccaniSearch.BaseURL)) {
    url = TreccaniSearch.SearchUrl + text;
  }

  // Get user preference (or default option value) and open the page accordingly.
  browser.storage.local.get(["alwaysNewTab", "backgroundNewTab"]).then( (item: { [key: string]: boolean }) => {
    if (item?.alwaysNewTab ?? true) {
      disposition = "newForegroundTab";
    }
    if ((item?.backgroundNewTab ?? false) && disposition !== "currentTab") {
      disposition = "newBackgroundTab";
    }
    switch (disposition) {
      case "currentTab":
        browser.tabs.update({url});
        break;
      case "newForegroundTab":
        browser.tabs.create({url});
        break;
      case "newBackgroundTab":
        browser.tabs.create({url, active: false});
        break;
    }
  });
});

function createSuggestionsFromResponse(response: Response) {
  return new Promise( (resolve: (value: browser.omnibox.SuggestResult[]) => void) => {    
    response.json().then( (json: TreccaniSearch.OpusEntity[]) => {
      // Up to six suggestions only are shown in the address bar, including the
      // default suggestion (if set).
      const MaxNumberOfSuggestions = 6;
      // We subtract 1 since the default suggestion is set.
      let numberOfSuggestionsToShow = Math.min(MaxNumberOfSuggestions - 1, json.length);
      if (numberOfSuggestionsToShow === 0) {
        // Recall URL: http://www.treccani.it/autocomplete/?q=
        let responseURL = response.url;
        let queryTyped = decodeURIComponent(responseURL.substr(responseURL.indexOf('=') + 1));
        return resolve([{  
          content: TreccaniSearch.SearchUrl + queryTyped,
          description: `Nessun suggerimento. Cerca lo stesso "${queryTyped.trim()}" su Treccani`
        }]);
      }

      let suggestions: browser.omnibox.SuggestResult[] = [];
      for (let i = 0; i < numberOfSuggestionsToShow; i++) {
        let entry = json[i];
        let fullURL = TreccaniSearch.BaseURL + entry.link;
        let description = entry.label + " – ";
        if (entry.opera_online3 === "Sinonimi e Contrari") {
          description += entry.opera_online3;
        }
        else {
          description += entry.activity === "" ?
            entry.opera_online : entry.activity + " – " + entry.opera_online;
        }
        suggestions.push({
          content: fullURL,
          description
        });
      }
      return resolve(suggestions);
    })
  });
}
