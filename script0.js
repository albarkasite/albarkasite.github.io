
function fixli(lists, maxLength) {
return lists.map(sublist => {
return sublist.slice(0, maxLength);
});
}
async function saveData(dbName, data) {
var storeName = String(dbName);
return new Promise((resolve, reject) => {
let request = indexedDB.open(dbName);

request.onsuccess = function(event) {
let db = event.target.result;
let transaction = db.transaction(storeName, "readwrite");
let store = transaction.objectStore(storeName, { keyPath: "id", autoIncrement: true });
store.clear()

data.forEach(item => {
let obj = {};
item.forEach((value, index) => {
  obj[`field${index}`] = value;
});
store.put(obj);
});

transaction.oncomplete = function() {
resolve("Data saved or updated successfully");
};

transaction.onerror = function() {
reject("Error saving or updating data");
};
};

request.onerror = function() {
reject("Error opening database");
};
});
}
function findBarcode(text) {
const regex = /barCodes":\[([^\]\[]*)]/;
const match = text.match(regex);
return match ? match[1] : '';
}
async function findData(dbName) {
var storeName = String(dbName);
return await new Promise((resolve, reject) => {
let request = indexedDB.open(dbName);

request.onupgradeneeded = function(event) {
// If the database is being created for the first time, create the object store
let db = event.target.result;
db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
};

request.onsuccess = function(event) {
let db = event.target.result;
if (!db.objectStoreNames.contains(storeName)) {
resolve([]); // Return empty list if the object store does not exist
return [];
}
let transaction = db.transaction(storeName, "readonly");
let store = transaction.objectStore(storeName);
let getAllRequest = store.getAll();

getAllRequest.onsuccess = function() {
let data = getAllRequest.result.map(item => Object.values(item));
resolve(data);
return data
};

getAllRequest.onerror = function() {
reject("Error retrieving data");
};
};

request.onerror = function() {
resolve([]); // Return empty list if there is an error opening the database
};
});
}



function extr(parentId) {
var parent = parentId;
let htmlContent = parent.innerHTML;

// Replace block-level tags with newline characters
htmlContent = htmlContent.replace(/<\/?(div|p|br|li|h[1-6])[^>]*>/gi, '\n');

// Remove all other HTML tags
htmlContent = htmlContent.replace(/<\/?[^>]+(>|$)/g, '');

// Replace multiple consecutive newlines with a single newline
let textWithLineBreaks = htmlContent.replace(/\n+/g, '\n').trim();

return textWithLineBreaks;
}
async function collectData(substring, cssSelectors) {
// Initialize an empty list to store the collected data
let collectedData = [window.location.href];

// Iterate over each CSS selector in the list
for (let selector of cssSelectors) {
let data = '';

// Check if the selector starts with 'link:', 'src:', or 'html:'
if (selector.startsWith('link:')) {
  let element = document.querySelector(selector.replace('link:', ''));
  data = element ? element.href : '';
} else if (selector.startsWith('src:')) {
  let element = document.querySelector(selector.replace('src:', ''));
  data = element ? element.src : '';
} else if (selector.startsWith('html:')) {
  let element = document.querySelector(selector.replace('html:', ''));
  data = element ? element.innerHTML : '';
}else if (selector.startsWith('barcode:')) {
let element = document.querySelector(selector.replace('barcode:', ''));
data = element ? findBarcode(extr(element)) : '';
} else {
  let element = document.querySelector(selector);
  data = element ? extr(element) : '';
}

// Add the collected data to the list
collectedData.push(data);
}

// Retrieve the existing list from browser storage or create a new one if it doesn't exist
let existingList=[]
await findData(substring).then(value => {
existingList = fixli(value,selectors.length)
}) 
console.log(existingList)
//let existingList = JSON.parse(localStorage.getItem(substring)) || [];

// Add the collected data to the existing list
existingList.push(collectedData);

// Save the updated list back to browser storage
await saveData(substring,existingList)
//localStorage.setItem(substring, JSON.stringify(existingList));

// Create a new element with class "done" and append it to the body
let doneElement = document.createElement('div');
doneElement.className = 'done';
document.body.appendChild(doneElement);
console.log('collected')
}
function loadXlsxLibrary(callback) {
let script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js';
script.onload = callback;
document.head.appendChild(script);
}

async function downloadAsXlsx(substring) {
let data = []

await findData(substring).then(value => {
data = fixli(value,14)
console.log(data)
}) 
loadXlsxLibrary(() => {
// Retrieve the list of lists from localStorage
//let data = JSON.parse(localStorage.getItem(substring));

if (!data) {
    console.error('No data found for the given substring.');
    return;
}

// Create a new workbook and add the data to a worksheet
let workbook = XLSX.utils.book_new();
console.log(data)
let worksheet = XLSX.utils.aoa_to_sheet(data);
XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

// Generate a binary string representation of the workbook
let binaryString = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });

// Convert the binary string to a Blob
let blob = new Blob([s2ab(binaryString)], { type: 'application/octet-stream' });

// Create a link element and trigger the download
let link = document.createElement('a');
link.href = URL.createObjectURL(blob);
link.download = `${substring}.xlsx`;
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
});
}

function s2ab(s) {
let buf = new ArrayBuffer(s.length);
let view = new Uint8Array(buf);
for (let i = 0; i < s.length; i++) {
view[i] = s.charCodeAt(i) & 0xFF;
}
return buf;
}

async function apply(){
  
    let para=window.parent.localStorageDict
    console.log(para)
    let projectName=para['projectName']
    let nextlink=para['nextlink']
    let awaitedelement=para['awaitedelement']
    let selectors=para["selectors"]
    if (selectors==["download"]){downloadAsXlsx(projectName)}
    while(document.querySelector(awaitedelement)==null){console.log(awaitedelement); await new Promise((resolve) => setTimeout(resolve,500));}
    await collectData(projectName, selectors)
    window.parent.localStorageLink=nextlink+''
    if (!nextlink){downloadAsXlsx(projectName)}
}
apply()
