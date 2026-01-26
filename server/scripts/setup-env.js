
const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const ENV_PATH = path.join(__dirname, '../../.env');

function runCommand(command, ignoreError = false) {
    try {
        return execSync(command, { encoding: 'utf8', stdio: 'pipe' }).trim();
    } catch (error) {
        if (!ignoreError) {
            console.error(`Error running: ${command}`);
            console.error(error.message);
        }
        return null;
    }
}

function runInteractive(command, args) {
    const result = spawnSync(command, args, { stdio: 'inherit', shell: true });
    return result.status === 0;
}

async function ask(question) {
    return new Promise(resolve => rl.question(question, resolve));
}

async function main() {
    console.log("=== AUTO SETUP: FIREBASE & VERCEL ===");
    console.log("This script will help you login and auto-fill your .env file.\n");

    // 1. Firebase Login
    console.log("--> Checking Firebase Login...");
    let user = runCommand('firebase login:list', true);
    if (!user || user.includes('No project active') || user.includes('not logged in')) {
        console.log("Please login to Firebase in the browser window that opens...");
        runInteractive('firebase', ['login']);
    }

    // 2. Select Project
    console.log("\n--> Fetching Firebase Projects...");
    const projectsRaw = runCommand('firebase projects:list --json');
    let projectId = '';

    try {
        const projects = JSON.parse(projectsRaw);
        if (projects.length === 0) {
            console.log("No projects found. Please create one in Firebase Console first.");
            process.exit(1);
        }
        console.log("Found projects:");
        projects.forEach((p, i) => console.log(`${i + 1}. ${p.projectId} (${p.displayName})`));

        const selection = await ask("\nEnter number to select (or type Project ID): ");
        const index = parseInt(selection) - 1;
        if (index >= 0 && index < projects.length) {
            projectId = projects[index].projectId;
        } else {
            projectId = selection.trim();
        }
    } catch (e) {
        projectId = await ask("Could not list projects automatically. Please enter your Firebase Project ID: ");
    }

    if (!projectId) {
        console.error("Project ID required.");
        process.exit(1);
    }

    console.log(`\nSelected Project: ${projectId}`);
    runCommand(`firebase use ${projectId}`);

    // 3. Get Web Config
    console.log("\n--> Fetching Web App Config...");
    let appsRaw = runCommand('firebase apps:list --json');
    let appId = '';
    let appConfig = null;

    try {
        let apps = JSON.parse(appsRaw);
        let webApps = apps.filter(a => a.platform === 'WEB');

        if (webApps.length === 0) {
            console.log("No Web App found in this project. Creating one...");
            const alias = await ask("Enter a name for your Web App (e.g. MyWeb): ") || "MyWeb";
            const createRes = runCommand(`firebase apps:create web ${alias} --json`);
            const newApp = JSON.parse(createRes);
            appId = newApp.appId;
        } else {
            appId = webApps[0].appId; // Pick first one
        }

        console.log(`Using App ID: ${appId}`);
        const configRaw = runCommand(`firebase apps:sdkconfig web ${appId}`);
        // Parse the output which looks like valid JS/JSON-like
        // A simpler way: use regex to extract values
        appConfig = {
            apiKey: configRaw.match(/apiKey: "(.*?)"/)?.[1],
            authDomain: configRaw.match(/authDomain: "(.*?)"/)?.[1],
            projectId: configRaw.match(/projectId: "(.*?)"/)?.[1],
            storageBucket: configRaw.match(/storageBucket: "(.*?)"/)?.[1],
            messagingSenderId: configRaw.match(/messagingSenderId: "(.*?)"/)?.[1],
            appId: configRaw.match(/appId: "(.*?)"/)?.[1],
        };

    } catch (e) {
        console.error("Failed to fetch app config:", e.message);
    }

    // 4. Update .env
    console.log("\n--> Updating .env file...");
    let envContent = fs.existsSync(ENV_PATH) ? fs.readFileSync(ENV_PATH, 'utf8') : '';

    if (appConfig) {
        envContent = envContent.replace(/VITE_FIREBASE_API_KEY=".+"/g, `VITE_FIREBASE_API_KEY="${appConfig.apiKey}"`);
        envContent = envContent.replace(/VITE_FIREBASE_AUTH_DOMAIN=".+"/g, `VITE_FIREBASE_AUTH_DOMAIN="${appConfig.authDomain}"`);
        envContent = envContent.replace(/VITE_FIREBASE_PROJECT_ID=".+"/g, `VITE_FIREBASE_PROJECT_ID="${appConfig.projectId}"`);
        envContent = envContent.replace(/VITE_FIREBASE_STORAGE_BUCKET=".+"/g, `VITE_FIREBASE_STORAGE_BUCKET="${appConfig.storageBucket}"`);
        envContent = envContent.replace(/VITE_FIREBASE_MESSAGING_SENDER_ID=".+"/g, `VITE_FIREBASE_MESSAGING_SENDER_ID="${appConfig.messagingSenderId}"`);
        envContent = envContent.replace(/VITE_FIREBASE_APP_ID=".+"/g, `VITE_FIREBASE_APP_ID="${appConfig.appId}"`);
        // Handle placeholders if they weren't replaced (e.g. if file had 'your-api-key')
        if (!envContent.includes(appConfig.apiKey)) {
            // Append or force replace
            const keys = Object.keys(appConfig);
            keys.forEach(k => {
                const envKey = `VITE_FIREBASE_${k.toUpperCase().replace('APPID', 'APP_ID').replace('MESSAGINGSENDERID', 'MESSAGING_SENDER_ID').replace('STORAGEBUCKET', 'STORAGE_BUCKET').replace('AUTHDOMAIN', 'AUTH_DOMAIN').replace('PROJECTID', 'PROJECT_ID').replace('APIKEY', 'API_KEY')}`;
                // Basic replace for standard placeholders
                envContent = envContent.replace(new RegExp(`${envKey}="your-.*?"`), `${envKey}="${appConfig[k]}"`);
            });
        }
    }

    fs.writeFileSync(ENV_PATH, envContent);
    console.log("✅ .env file updated successfully!");

    // 5. Vercel Login
    console.log("\n--> Checking Vercel Login...");
    // Vercel login is hard to check programmatically without side effects, usually 'vercel whoami'
    // but 'vercel --version' is safe.
    console.log("Please run 'vercel login' globally if you haven't.");
    console.log("Then you can run 'vercel' to deploy.");

    rl.close();
}

main();
