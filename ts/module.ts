export const BaseURL = "https://www.treccani.it";
export const AutoCompleteUrl = "https://frontend-api.treccani.it/autocomplete";
export const SearchUrl = BaseURL + "/enciclopedia/ricerca/";
const Hints = ['zeugma', 'pangolino', 'resipiscenza', 'trumeau', 'colbacco', 'frattale', 'collibo', 'ottante', 'criolite'];
let currentHint: string;

/**
 * Picks a random hint and sets it as the default suggestion shown in the address bar.
 */
export function setRandomDefaultSuggestion() {
  currentHint = Hints[Math.floor(Math.random() * Hints.length)]; // Choose a random hint.
  browser.omnibox.setDefaultSuggestion({
    description: "Cerca un termine su Treccani (prova a digitare: " + currentHint + ")"
  });
}

/**
 * Returns the hint currently shown in the address bar.
 */
export function getCurrentHint(): string { 
  return currentHint;
}

/**
 * Represents an entity in Treccani Opus as described in the JSON returned by
 * the server. It only contains the properties used to create the suggestions
 * in the address bar.
 */
export interface OpusEntity {
  /** URL relative to http://www.treccani.it (starts with "/"). */
  link: string;
  /** Short description provided when the entity refers to a person. */
  activity: string;
  /** Short description of the entity (always present). */
  label: string;
  /** The section containing the entity. */
  opera_online: string;
  /** The section containing the entity. */
  opera_online3: string;
}
