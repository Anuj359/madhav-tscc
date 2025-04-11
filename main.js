document.getElementById('query-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const entry = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    timestamp: new Date().toISOString()
  };

  const csvLine = `"${entry.name}","${entry.email}","${entry.phone}","${entry.timestamp}"\n`;

  const repo = 'Anuj359/madhav-tscc';
  const filePath = 'queries.csv';
  const token = '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';

  const getFile = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
    headers: {
      Authorization: `token ${token}`
    }
  });

  const fileData = await getFile.json();
  const content = atob(fileData.content);
  const updatedContent = btoa(content + csvLine);

  await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
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

  alert('Query submitted!');
  e.target.reset();
});
