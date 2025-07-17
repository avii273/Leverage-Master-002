// Configuration for GitHub backend
const GITHUB_TOKEN = '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'; // Create this in GitHub settings
const DATA_REPO = 'avii273/Leverage-Master-002'; // Your private repo for data
const USERS_PATH = 'data/users.json';
const SESSIONS_PATH = 'data/sessions.json';

// Initialize repository with empty data if files don't exist
async function initRepo() {
    try {
        await Promise.all([
            ensureFileExists(USERS_PATH, { users: [] }),
            ensureFileExists(SESSIONS_PATH, { sessions: [] })
        ]);
    } catch (error) {
        console.error("Initialization failed:", error);
        throw error;
    }
}

async function ensureFileExists(path, defaultContent) {
    try {
        await fetchGitHubData(path);
    } catch (error) {
        if (error.message.includes('404')) {
            // File doesn't exist, create it
            await updateGitHubData(path, defaultContent);
        } else {
            throw error;
        }
    }
}

async function fetchGitHubData(path) {
    const response = await fetch(`https://api.github.com/repos/${DATA_REPO}/contents/${path}`, {
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3.raw'
        }
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`GitHub API Error: ${JSON.stringify(errorData)}`);
    }
    return await response.json();
}

async function updateGitHubData(path, content, sha = null) {
    const response = await fetch(`https://api.github.com/repos/${DATA_REPO}/contents/${path}`, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: 'Update data',
            content: btoa(unescape(encodeURIComponent(JSON.stringify(content)))),
            sha: sha
        })
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`GitHub API Error: ${JSON.stringify(errorData)}`);
    }
    return await response.json();
}

// Main data functions
async function loadData() {
    await initRepo(); // Ensure repo is initialized
    const [usersData, sessionsData] = await Promise.all([
        fetchGitHubData(USERS_PATH),
        fetchGitHubData(SESSIONS_PATH)
    ]);
    return {
        users: usersData.users,
        sessions: sessionsData.sessions
    };
}

async function saveData(users, sessions) {
    await Promise.all([
        updateGitHubData(USERS_PATH, { users }),
        updateGitHubData(SESSIONS_PATH, { sessions })
    ]);
}

// Sample keys (fallback - you should manage these in your GitHub repo)
const accessKeys = {
  monthly: ["MON123-456-789", "MON987-654-321"],
  threeMonths: ["3MO123-456-789", "3MO987-654-321"],
  lifetime: ["LIF123-456-789", "LIF987-654-321"],
  admin: ["ADMIN123SECRET"] // Your secret admin key
};

export { accessKeys, loadData, saveData };
