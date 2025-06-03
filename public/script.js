let recentDocs = JSON.parse(localStorage.getItem('recentDocs')) || [];

function convertUrl() {
    const inputUrl = document.getElementById('inputUrl').value.trim();
    const baseUrl = 'https://ilide.info/docgeneratev2?fileurl=https://scribd.vdownloaders.com/pdownload/';

    const match = inputUrl.match(/\/(doc|document|presentation)\/(\d+)\/([\w-]+)/);

    if (match) {
        const [, type, id, slug] = match;

        const title = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        const convertedUrl = `${baseUrl}${id}/${slug}`;

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
};

