# About
This repository hosts the source code of the "[Ricerca su Treccani](https://addons.mozilla.org/it/firefox/addon/ricerca-su-treccani/)"
Firefox extension, which lets you search the [Treccani online corpus](http://www.treccani.it) directly from the browser address bar.

# Building the extension from source
The source code has been built on Windows 10 Home Edition, version 1909 (build 18363.1016), using the following tools:
* Node.js version 12.16.2;
* npm version 6.14.4;
* Typescript version 3.6.2.

You should be able to build the project on other platforms and with different versions, too.

## Prerequisites
To build this project, you first need to download and install [Node.js](https://nodejs.org/en/) (which includes
[npm](https://www.npmjs.com/get-npm)), [Typescript](https://www.typescriptlang.org/) and optionally [Git](https://git-scm.com/).
For more information on how to install these tools, please see the links above.

## Get the code
[Download this repository](https://github.com/giuse94/TreccaniSearch/archive/firefox.zip) or clone it with Git:
`git clone https://github.com/giuse94/TreccaniSearch.git`. If you opted for the download, unzip the folder (extract its content)
in a folder of your choice.

## Build the project
Open your favourite terminal and set the `ts` folder (which you find inside the folder you created in the previous step) as your
working directory. Download and install [this package](https://www.npmjs.com/package/@types/firefox-webext-browser)
via npm: `npm install @types/firefox-webext-browser`. Now you can build the project by simply running `tsc`. As a result, the
`package` folder will be filled with the JavaScript files you need to run the extension in your browser.
