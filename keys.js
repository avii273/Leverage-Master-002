// Configuration for GitHub backend
const GITHUB_TOKEN = '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'; // Create this in GitHub settings
const DATA_REPO = 'avii273/Leverage-Master-002'; // Your private repo for data
const KEYS_PATH = 'data/keys.json'; // Path to your keys file
const USERS_PATH = 'data/users.json'; // Path to your users file
const SESSIONS_PATH = 'data/sessions.json'; // Path to sessions file

// Fix the updateGitHubData function
async function updateGitHubData(path, content, sha) {
  try {
    const response = await fetch(`https://api.github.com/repos/${DATA_REPO}/contents/${path}`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Update data',
        content: btoa(unescape(encodeURIComponent(JSON.stringify(content))),
        sha: sha
      })
    });
    
    if (!response.ok) throw new Error('Failed to update data');
    return await response.json();
  } catch (error) {
    console.error("Error updating GitHub:", error);
    return null;
  }
}
