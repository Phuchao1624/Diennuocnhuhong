import { execSync, spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function runCommand(command, cwd) {
    console.log(`> Running: ${command} in ${cwd || 'root'}`);
    execSync(command, { stdio: 'inherit', cwd: cwd ? path.join(__dirname, cwd) : __dirname });
}

async function main() {
    try {
        console.log('--- STARTING LOCAL DEPLOYMENT ---');

        // 1. Install Root Dependencies
        console.log('\n[1/4] Installing Frontend Dependencies...');
        runCommand('npm install');

        // 2. Install Server Dependencies
        console.log('\n[2/4] Installing Backend Dependencies...');
        runCommand('npm install', 'server');

        // 3. Build Frontend
        console.log('\n[3/4] Building Frontend...');
        runCommand('npm run build');

        // 4. Start Server
        console.log('\n[4/4] Starting Production Server...');
        const serverPath = path.join(__dirname, 'server');

        // Use spawn to keep the server running
        const server = spawn('npm', ['start'], {
            cwd: serverPath,
            stdio: 'inherit',
            shell: true
        });

        server.on('error', (err) => {
            console.error('Failed to start server:', err);
        });

    } catch (error) {
        console.error('Deployment Failed:', error);
        process.exit(1);
    }
}

main();
