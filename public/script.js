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
  // -------------------------------------

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
    iframe.setAttribute("height", "600");
    iframe.setAttribute("frameborder", "0");

    // Append iframe
    document.getElementById("viewer").appendChild(iframe);
  } else {
    document.getElementById("content").innerHTML = "<p style='color:red;'>Missing 'doc' or title parameter in the URL.</p>";
  }

