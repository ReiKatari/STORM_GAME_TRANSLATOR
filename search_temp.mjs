import fs from 'fs';
import path from 'path';

const searchStr = /gamestringer/i;
const ignoreDirs = ['node_modules', '.git', 'dist', 'out', 'build', '.next', 'playwright-report', 'test-results'];

function search(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            if (!ignoreDirs.includes(file)) {
                search(fullPath);
            }
        } else {
            if (fullPath.match(/\.(ts|tsx|js|jsx|json|md|html|css|rs)$/i)) {
                const content = fs.readFileSync(fullPath, 'utf-8');
                if (content.match(searchStr)) {
                    console.log(fullPath);
                }
            }
        }
    }
}

search('.');
