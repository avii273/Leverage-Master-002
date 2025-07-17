// Configuration for GitHub backend
const GITHUB_TOKEN = 'your_personal_access_token'; // Create this in GitHub settings
const DATA_REPO = 'yourusername/your-repo-name'; // Your private repo for data
const KEYS_PATH = 'data/keys.json'; // Path to your keys file
const USERS_PATH = 'data/users.json'; // Path to your users file
const SESSIONS_PATH = 'data/sessions.json'; // Path to sessions file

// Sample keys (fallback)
const accessKeys = {
  monthly: ["MON123-456-789", "MON987-654-321"],
  threeMonths: ["3MO123-456-789", "3MO987-654-321"],
  lifetime: ["LIF123-456-789", "LIF987-654-321"],
  admin: ["ADMIN123SECRET"] // Your secret admin key
};

// GitHub API functions
async function fetchGitHubData(path) {
  try {
    const response = await fetch(`https://api.github.com/repos/${DATA_REPO}/contents/${path}`, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3.raw'
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch data');
    return await response.json();
  } catch (error) {
    console.error("Error fetching from GitHub:", error);
    return null;
  }
}

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

// Data management functions
async function loadData() {
  let users = [];
  let sessions = [];
  let keys = accessKeys;
  
  // Try to load from GitHub
  try {
    const githubUsers = await fetchGitHubData(USERS_PATH);
    if (githubUsers) users = githubUsers;
    
    const githubSessions = await fetchGitHubData(SESSIONS_PATH);
    if (githubSessions) sessions = githubSessions;
    
    const githubKeys = await fetchGitHubData(KEYS_PATH);
    if (githubKeys) keys = {...accessKeys, ...githubKeys};
  } catch (error) {
    console.log("Using fallback data due to error:", error);
  }
  
  // Fallback to localStorage
  if (users.length === 0) {
    const localUsers = localStorage.getItem('users');
    if (localUsers) users = JSON.parse(localUsers);
  }
  
  if (sessions.length === 0) {
    const localSessions = localStorage.getItem('sessions');
    if (localSessions) sessions = JSON.parse(localSessions);
  }
  
  return { users, sessions, keys };
}

async function saveData(users, sessions, keys) {
  // Try to save to GitHub
  try {
    const currentUsers = await fetchGitHubData(USERS_PATH);
    const currentSessions = await fetchGitHubData(SESSIONS_PATH);
    const currentKeys = await fetchGitHubData(KEYS_PATH);
    
    await updateGitHubData(USERS_PATH, users, currentUsers?.sha);
    await updateGitHubData(SESSIONS_PATH, sessions, currentSessions?.sha);
    if (keys) await updateGitHubData(KEYS_PATH, keys, currentKeys?.sha);
  } catch (error) {
    console.log("Failed to save to GitHub, using localStorage fallback:", error);
  }
  
  // Fallback to localStorage
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('sessions', JSON.stringify(sessions));
  if (keys) localStorage.setItem('keys', JSON.stringify(keys));
}

export { accessKeys, loadData, saveData };