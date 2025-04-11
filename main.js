document.addEventListener('DOMContentLoaded', () => {
  // Get elements
  const form = document.getElementById('queryForm');
  const toast = document.getElementById('toast');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate form data
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();

    if (!name || !email || !phone.match(/^[0-9]{10}$/)) {
      alert("Please enter valid details.");
      return;
    }

    // Prepare data for GitHub
    const entry = {
      name: name,
      email: email,
      phone: phone,
      timestamp: new Date().toISOString()
    };

    const csvLine = `"${entry.name}","${entry.email}","${entry.phone}","${entry.timestamp}"\n`;

    const repo = 'Anuj359/madhav-tscc';
    const filePath = 'queries.csv';
    const token = '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'; // Replace with your token in production

    const trimmedToken = token.trim();
    headers.Authorization = `token ${trimmedToken}`;

    const headers = {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json'
    };

    try {
      // Fetch existing file
      const getFile = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, { headers });

      if (!getFile.ok) {
        throw new Error(`GitHub API error: ${getFile.status}`);
      }

      const fileData = await getFile.json();
      const content = atob(fileData.content);
      const updatedContent = btoa(content + csvLine);

      // Update file on GitHub
      const updateResponse = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
        method: 'PUT',
        headers: {
          Authorization: `token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'Add new query entry',
          content: updatedContent,
          sha: fileData.sha
        })
      });

      if (!updateResponse.ok) {
        throw new Error(`GitHub update error: ${updateResponse.status}`);
      }

      // Show success message
      showToast("Query submitted successfully!");
      form.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      showToast("Failed to submit. Please try again later." + error.message, "error");
    }
  });

  // Toast notification function
  function showToast(message, type = "success") {
    toast.innerText = message;
    if (type === "error") {
      toast.style.backgroundColor = "#f44336";
    } else {
      toast.style.backgroundColor = "#4CAF50";
    }
    
    toast.style.display = 'block';
    toast.style.opacity = '0';

    setTimeout(() => {
      toast.style.opacity = '1';
    }, 100);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.style.display = 'none', 500);
    }, 3000);
  }
});