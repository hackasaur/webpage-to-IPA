# webpage to IPA convertor(chrome plugin)
A chromium browser plugin(or extension) which converts any webpage to IPA(International Phonetic Alphabet). Only English language is supported as of now.
![webpage to IPA plugin screenshot](https://github.com/hackasaur/webpage-to-IPA/blob/f02d217163444f9de544e30b8e1a9495dce1cb54/webpage%20to%20IPA%20wikipedia.png)

The plugin is not available on chrome web store but you can still use it, here are the steps:
1. Clone the repo `git clone git@github.com:hackasaur/webpage-to-IPA.git`
2. In your chromium-based browser, open the Extension Management page by navigating to `chrome://extensions`
3. Enable Developer Mode by clicking the toggle switch next to Developer mode. Click the LOAD UNPACKED button and select the extension directory where you coned the repo.
4. Now it should be available in your browser extensions

if steps are not clear you can see <https://developer.chrome.com/docs/extensions/mv3/getstarted/> the steps to add an extension with screenshot is shown.

## how it works
A dicitonary containing top 10000 most used words in English with it's IPA equivalent is used to replace words in each tag of the HTML DOM with it's IPA equivalent.
The dictionary was created by scraping IPA pronunciations from <https://www.wiktionary.org> for the top 10000 most used words in English according to <https://en.m.wiktionary.org/wiki/Wiktionary:Frequency_lists> using python libraries beautifulSoup and Requests.