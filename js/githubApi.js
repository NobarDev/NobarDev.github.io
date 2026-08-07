/**
 * githubApi.js — GitHub REST API Integration
 * Replaces fileStore.js by storing metadata and files in GitHub repository.
 */

const GITHUB_REPO = 'NobarDev/NobarDev.github.io'; // As per memory
const DATA_JSON_PATH = 'data/publicaciones.json';

// Helper to get GitHub token
function getGitHubToken() {
    return sessionStorage.getItem('github_token');
}

// Request token if not present
function checkAuth() {
    let token = getGitHubToken();
    if (!token) {
        token = prompt("🔒 Área Privada: Introduce tu GitHub Personal Access Token (PAT) con permisos sobre el repositorio:");
        if (token) {
            sessionStorage.setItem('github_token', token);
        } else {
            alert("No se ha introducido un token. No podrás publicar ni gestionar archivos.");
        }
    }
}

// Ensure auth check is called early
checkAuth();

async function githubApiRequest(path, method = 'GET', body = null) {
    const token = getGitHubToken();
    if (!token) throw new Error("No GitHub token available");

    const headers = {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
    };

    const options = { method, headers };
    if (body) {
        options.body = JSON.stringify(body);
        headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`, options);
    if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `GitHub API error: ${res.status}`);
    }
    return await res.json();
}

/**
 * Reads a file as Base64 string
 */
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
    });
}

/**
 * Upload a file to GitHub
 * @param {string} path - path like 'assets/uploads/filename.png'
 * @param {File} file - File object
 */
async function uploadFileToGitHub(path, file) {
    const content = await fileToBase64(file);
    let sha = null;
    
    // Check if file exists to get sha for update/overwrite (optional, but good practice)
    try {
        const existing = await githubApiRequest(path, 'GET');
        sha = existing.sha;
    } catch (e) {
        // file does not exist, safe to create
    }

    const payload = {
        message: `Upload ${file.name} via gestor`,
        content: content
    };
    if (sha) payload.sha = sha;

    return await githubApiRequest(path, 'PUT', payload);
}

/**
 * Get data/publicaciones.json
 */
async function getPublicacionesJSON() {
    // Load local file as fallback/seed
    let localContent = { portafolio: [], proyectos: [] };
    try {
        const res = await fetch('data/publicaciones.json');
        if (res.ok) {
            localContent = await res.json();
        }
    } catch (e) {
        console.warn("Could not load local publicaciones.json", e);
    }

    try {
        const data = await githubApiRequest(DATA_JSON_PATH, 'GET');
        // Decode base64 content
        const jsonStr = decodeURIComponent(escape(atob(data.content)));
        const remoteContent = JSON.parse(jsonStr);

        const remoteIsEmpty = (!remoteContent.portafolio || remoteContent.portafolio.length === 0) &&
                              (!remoteContent.proyectos || remoteContent.proyectos.length === 0);

        if (remoteIsEmpty) {
            console.log("Remote JSON is empty. Seeding with local defaults.");
            return { sha: data.sha, content: localContent };
        }

        return { sha: data.sha, content: remoteContent };
    } catch (e) {
        console.error("Error getting remote publicaciones JSON, using local copy", e);
        return { sha: null, content: localContent };
    }
}

/**
 * Save data/publicaciones.json
 */
async function savePublicacionesJSON(jsonContent, sha) {
    const jsonStr = JSON.stringify(jsonContent, null, 2);
    // encode to base64 properly handling unicode
    const b64 = btoa(unescape(encodeURIComponent(jsonStr)));
    
    const payload = {
        message: `Update publicaciones.json via gestor`,
        content: b64
    };
    if (sha) payload.sha = sha;
    
    return await githubApiRequest(DATA_JSON_PATH, 'PUT', payload);
}

/**
 * Delete file from GitHub
 */
async function deleteFileFromGitHub(path) {
    try {
        const existing = await githubApiRequest(path, 'GET');
        const payload = {
            message: `Delete ${path} via gestor`,
            sha: existing.sha
        };
        return await githubApiRequest(path, 'DELETE', payload);
    } catch (e) {
        console.warn(`File ${path} could not be deleted or doesn't exist`, e);
    }
}

window.GitHubAPI = {
    checkAuth,
    uploadFileToGitHub,
    getPublicacionesJSON,
    savePublicacionesJSON,
    deleteFileFromGitHub
};
