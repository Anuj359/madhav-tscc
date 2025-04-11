// Add to top of main.js
console.log("Script loaded");
alert("Script loaded");
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM fully loaded");
  
  // Get elements
  const form = document.getElementById('queryForm');
  const toast = document.getElementById('toast');
  
  console.log("Form element:", form);
  
  if (!form) {
    console.error("Form with ID 'queryForm' not found!");
    return;
  }
  
  form.addEventListener('submit', async function(e) {
    console.log("Form submission triggered");
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    
    console.log("Form data:", { name, email, phone });

    if (!name || !email || !phone.match(/^[0-9]{10}$/)) {
      alert("Please enter valid details.");
      return;
    }
    
    // Show processing message
    console.log("Processing submission...");
    showToast("Processing your submission...");

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
    const token = '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'; // Replace with your actual token
    
    try {
      console.log("Sending request to GitHub API...");
      
      // Fetch existing file
      const getFileResponse = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json'
        }
      });
      
      console.log("GitHub API response status:", getFileResponse.status);
      
      let content = '';
      let sha = null;
      
      if (getFileResponse.status === 404) {
        // File doesn't exist, will create new
        console.log("File doesn't exist yet, will create new file");
      } else if (getFileResponse.status === 401) {
        throw new Error("GitHub authentication failed. Check your token.");
      } else if (!getFileResponse.ok) {
        throw new Error(`GitHub API error: ${getFileResponse.status}`);
      } else {
        // File exists
        const fileData = await getFileResponse.json();
        content = atob(fileData.content);
        sha = fileData.sha;
        console.log("Existing file found with SHA:", sha);
      }
      
      const updatedContent = btoa(content + csvLine);
      
      console.log("Updating file on GitHub...");
      
      // Create or update file on GitHub
      const updateResponse = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
        method: 'PUT',
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'Add new query entry',
          content: updatedContent,
          sha: sha
        })
      });
      
      console.log("Update response status:", updateResponse.status);
      
      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        console.error("GitHub error details:", errorData);
        throw new Error(`GitHub update failed: ${updateResponse.status}`);
      }
      
      console.log("Submission successful!");
      showToast("Query submitted successfully!");
      form.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      showToast("Failed to submit: " + error.message, "error");
    }
  });

  // Toast notification function
  function showToast(message, type = "success") {
    console.log("Showing toast:", message);
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
