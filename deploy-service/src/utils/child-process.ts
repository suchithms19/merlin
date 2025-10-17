import { exec } from "child_process";
import fs from "fs";
import path from "path";

export function buildProject(id: string) {
    return new Promise((resolve, reject) => {
        
        const project_dir = path.join(process.cwd(), 'downloads', 'repos', id);

        if (!fs.existsSync(project_dir)) {
            return reject(new Error(`Project directory not found: ${project_dir}`));
        }

        const child = exec(`npm install && npm run build`, { cwd: project_dir, windowsHide: true });

        child.stdout?.on('data', function(data) {
            console.log('stdout: ' + data);
        });
        child.stderr?.on('data', function(data) {
            console.log('stderr: ' + data);
        });

        child.on('error', (err) => reject(err));
        child.on('close', function(code) {
            if (code === 0) return resolve("");
            reject(new Error(`build exited with code ${code}`));
        });
    })
}