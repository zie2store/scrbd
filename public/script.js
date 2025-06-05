let recentDocs = JSON.parse(localStorage.getItem('recentDocs')) || [];

function convertUrl() {
    const inputUrl = document.getElementById('inputUrl').value.trim();
    const baseUrl = 'https://scrbd.vercel.app/viewer.html?doc=';

    const match = inputUrl.match(/\/(doc|document|presentation)\/(\d+)\/([\w-]+)/);

    if (match) {
        const [, type, id, slug] = match;

        const title = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        const convertedUrl = `${baseUrl}${id}&${slug}`;

        document.getElementById('docTitle').textContent = title;
        const link = document.getElementById('downloadLink');
        link.href = convertedUrl;
        link.textContent = 'download';
        document.getElementById('resultSection').style.display = 'block';

        // Update recent documents
        recentDocs.unshift({ title, link: convertedUrl });
        recentDocs = recentDocs.slice(0, 10);
        localStorage.setItem('recentDocs', JSON.stringify(recentDocs));

        updateRecentTable();
    } else {
        alert('Invalid URL format');
    }

    document.getElementById('inputUrl').value = '';
}

function updateRecentTable() {
    const tableBody = document.getElementById('recentTableBody');
    tableBody.innerHTML = '';

    if (recentDocs.length > 0) {
        document.getElementById('recentSection').style.display = 'block';
        recentDocs.forEach((doc, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${doc.title}</td>
                <td><a href="${doc.link}" target="_blank">download</a></td>
            `;
            tableBody.appendChild(row);
        });
    } else {
        document.getElementById('recentSection').style.display = 'none';
    }
}

// ⏱ Show table on page load if data exists
window.onload = () => {
  updateRecentTable();

  document.getElementById('inputUrl').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      convertUrl();
    }
  });

  // Accordion toggle
  document.querySelectorAll('.accordion-header').forEach(button => {
    button.addEventListener('click', () => {
      button.classList.toggle('active');
    });
  });
};

// Footer
document.addEventListener("DOMContentLoaded", function () {
  fetch('/footer.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('footer-container').innerHTML = data;
    })
    .catch(error => console.error('Error loading footer:', error));
});

// belows are script for viewer.html
  // --- Manual Prefix/Suffix Settings ---
  const titlePrefix = "Download ";
  const titleSuffix = ""; // You can set e.g., " | Scribd Viewer"
  const headingPrefix = "PDF ";
  const headingSuffix = ""; // You can set something if needed

  // Extract 'doc' and title parameters from URL
  const urlParams = new URLSearchParams(window.location.search);
  const docId = urlParams.get('doc');

  // Extract the raw title after 'doc=' and '&'
  const rawQuery = window.location.search;
  const match = rawQuery.match(/doc=\d+&(.+)/);
  const docRawTitle = match ? match[1] : '';

  if (docId && docRawTitle) {
    const formattedTitle = docRawTitle.replace(/-/g, ' ');

    // Set the visible heading and page <title> with prefix/suffix
    const finalHeading = `${headingPrefix}${formattedTitle}${headingSuffix}`;
    const finalPageTitle = `${titlePrefix}${formattedTitle}${titleSuffix}`;

    document.getElementById("docTitle").textContent = finalHeading;
    document.title = finalPageTitle;

    // Set download URL
    const downloadUrl = `https://ilide.info/docgeneratev2?fileurl=https://scribd.vdownloaders.com/pdownload/${docId}/${docRawTitle}`;
    document.getElementById("downloadLink").href = downloadUrl;

    // Create iframe
    const iframe = document.createElement("iframe");
    iframe.className = "scribd_iframe_embed";
    iframe.src = `https://www.scribd.com/embeds/${docId}/content?start_page=1&view_mode=scroll`;
    iframe.setAttribute("tabindex", "0");
    iframe.setAttribute("data-auto-height", "true");
    iframe.setAttribute("data-aspect-ratio", "0.7080062794348508");
    iframe.setAttribute("scrolling", "no");
    iframe.setAttribute("width", "100%");
    iframe.setAttribute("height", "1000px");
    iframe.setAttribute("frameborder", "0");

    // Append iframe
    document.getElementById("viewer").appendChild(iframe);
  } else {
    document.getElementById("content").innerHTML = "<p style='color:red;'>Missing 'doc' or title parameter in the URL.</p>";
  }


// SCRIPT TO SHOW RANDOM LINKS
// URL of the document.txt
// SCRIPT TO SHOW RANDOM LINKS
// URL of the document.txt
const documentUrl = 'https://raw.githubusercontent.com/zie2store/scrbd/refs/heads/main/public/document.txt';

// Function to fetch the document and extract links
async function fetchLinks() {
try {
// Fetch the document.txt file
const response = await fetch(documentUrl);
const text = await response.text();

// Use a regex to match URLs from the document
const linkPattern = /https?:\/\/\S+/g;
const links = text.match(linkPattern);

if (links) {
// Display random 10 links from the fetched data
displayLinks(getRandomLinks(links, 10));
} else {
alert('No links found in the document.');
}
} catch (error) {
console.error('Error fetching the document:', error);
}
}

// Function to get 10 random links from the list
function getRandomLinks(links, count) {
let randomLinks = [];
while (randomLinks.length < count) {
const randomIndex = Math.floor(Math.random() * links.length);
const link = links[randomIndex];
if (!randomLinks.includes(link)) {
randomLinks.push(link);
}
}
return randomLinks;
}

// Function to extract and clean the title from the URL
function extractTitle(url) {
const urlParts = url.split('&');
if (urlParts.length > 1) {
// Extract the title part after the '&'
const title = urlParts[1];
// Clean the title by replacing hyphens and decoding URL-encoded characters
return decodeURIComponent(title.replace(/-/g, ' ').replace(/%20/g, ' '));
}
return url; // If no '&' symbol found, return the full URL
}

// Function to display the random links on the webpage
function displayLinks(randomLinks) {
const linkList = document.getElementById('link-list');
randomLinks.forEach(link => {
const listItem = document.createElement('li');
const cleanTitle = extractTitle(link); // Get clean title
const anchorTag = document.createElement('a');
anchorTag.href = link;
anchorTag.textContent = cleanTitle;
listItem.appendChild(anchorTag);
linkList.appendChild(listItem);
});
}

// Call the function to fetch and display the links
fetchLinks();
