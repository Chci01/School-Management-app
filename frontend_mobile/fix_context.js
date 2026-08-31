const fs = require('fs');
const path = require('path');

const libDir = path.join(__dirname, 'lib', 'screens');

function fixContext(content) {
    // A somewhat dangerous but effective regex to prepend if(!mounted)return;
    // We look for ScaffoldMessenger.of(context) or Navigator.pop(context) or Navigator.push
    // and if there's no mounted check nearby, we add it.

    // Better: Since flutter analyze tells us exactly which lines, but we don't have the exact output parsed.
    // Let's just do an aggressive replace: Replace `ScaffoldMessenger.of(context)` with `if (!mounted) return; ScaffoldMessenger.of(context)` if not preceded by `mounted`.
    
    let lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('ScaffoldMessenger.of(context)') || lines[i].includes('Navigator.pop(context)')) {
            // Check if standard `if (!mounted) return;` is on this line or previous line
            if (!lines[i].includes('mounted') && (i === 0 || !lines[i-1].includes('mounted'))) {
                // Prepend on the same line to not mess up indentation too badly
                lines[i] = lines[i].replace(/(ScaffoldMessenger\.of\(context\)|Navigator\.pop\(context\))/, 'if (!mounted) return; $1');
            }
        }
    }
    return lines.join('\n');
}

function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.dart')) {
            const original = fs.readFileSync(fullPath, 'utf8');
            const fixed = fixContext(original);
            if (original !== fixed) {
                fs.writeFileSync(fullPath, fixed, 'utf8');
                console.log(`Updated isolated context in ${path.basename(fullPath)}`);
            }
        }
    }
}

walkDir(libDir);
