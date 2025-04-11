
document.getElementById('query-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const entry = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    timestamp: new Date().toISOString()
  };

  const csvLine = `"\${entry.name}","\${entry.email}","\${entry.phone}","\${entry.timestamp}"\n`;

  const repo = 'YOUR_GITHUB_USERNAME/YOUR_REPO_NAME';
  const filePath = 'queries.csv';
  const token = 'YOUR_GITHUB_PERSONAL_ACCESS_TOKEN';

  const getFile = await fetch(`https://api.github.com/repos/\${repo}/contents/\${filePath}`, {
    headers: {
      Authorization: `token \${token}`
    }
  });

  const fileData = await getFile.json();
  const content = atob(fileData.content);
  const updatedContent = btoa(content + csvLine);

  await fetch(`https://api.github.com/repos/\${repo}/contents/\${filePath}`, {
    method: 'PUT',
    headers: {
      Authorization: `token \${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: 'Add new query entry',
      content: updatedContent,
      sha: fileData.sha
    })
  });

  alert('Query submitted!');
  e.target.reset();
});
