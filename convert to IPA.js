const wordsRegex = /\w+/g
const stressRegex = /ˈ|ˌ/g
const syllabificationRegex = /\./g
const tagsNamesDoNotConvert = ['SCRIPT', 'STYLE', 'PRE']

//to get IPA from chrome.storage.local
const getValueFromBrowserStorage = (key) => {
  return new Promise((resolve) => {
    chrome.storage.local.get('dictionary', (res) => {
      return resolve(res.dictionary[key])
    })
  })
}

//replace words in a string using an object/dictionary 
function replaceWordsInString(string, dictionary) {
  let convertedString = string.replace(wordsRegex, (match) => {
    let matchLowerCase = match.toLowerCase()
    let replaceBy = dictionary[matchLowerCase]
    if (!replaceBy) {
      return match
    }
    return replaceBy
  })
  return convertedString
}
//replace for async function
async function replaceAsync(str, regex, asyncFn) {
  const promises = [];
  str.replace(regex, (match, ...args) => {
    const promise = asyncFn(match, ...args);
    promises.push(promise);
  });
  const data = await Promise.all(promises);
  return str.replace(regex, () => data.shift());
}

//when dictionary is stored in browser storage
async function replaceWordsInStringBrowserAsync(string, syllabification = true, stress = true) {
  let convertedString = await replaceAsync(string, wordsRegex, async function (match) {
    if (match.length !== 1) {
      match = match.toLowerCase()
    }
    let replaceBy = await getValueFromBrowserStorage(match)
    if (!replaceBy || replaceBy === undefined) {
      return match
    }
    if (syllabification === false) {
      replaceBy = await replaceAsync(replaceBy, syllabificationRegex, match => '')
    }
    if (stress === false) {
      replaceBy = await replaceAsync(replaceBy, stressRegex, match => '')
    }
    return replaceBy
  })
  return convertedString
}

async function traverseDOMAndConvert(rootNode, callback, syllabification = true, stress = true) {
  console.time('text to IPA conversion time')
  let nodesLeft = [rootNode]
  let children = []
  while (nodesLeft.length !== 0) {
    for (let node of nodesLeft) {
      if (node.nodeName === '#text') {
        text = new String(node.textContent)
        node.textContent = await replaceWordsInStringBrowserAsync(text, syllabification, stress)
      }
      if (node.hasChildNodes() && !tagsNamesDoNotConvert.includes(node.nodeName)) {
        let childrenNodeList = node.childNodes
        for (let i = 0; i < childrenNodeList.length; i++) {
          children.push(childrenNodeList[i])
        }
      }
    }
    nodesLeft = []
    nodesLeft.push(...children)
    children = []
  }
  console.timeEnd('text to IPA conversion time')
  callback()
}

console.log('loaded content script: convert to IPA.js')