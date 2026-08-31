const fs = require('fs');
const path = require('path');

const libDir = path.join(__dirname, 'lib', 'screens');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Fix library_private_types_in_public_api
    // Regex matches: _ClassNameState createState() => _ClassNameState();
    // Replaces with: State<ClassName> createState() => _ClassNameState();
    content = content.replace(/_([A-Za-z0-9]+State)\s+createState\(\)\s*=>\s*_\1\(\);/g, (match, p1) => {
        const className = p1.replace(/State$/, '');
        return `State<${className}> createState() => _${p1}();`;
    });

    // Fix deprecated withOpacity -> withValues(alpha: ...)
    // Note: this assumes standard usage like color.withOpacity(0.5)
    content = content.replace(/\.withOpacity\(([^)]+)\)/g, '.withValues(alpha: $1)');

    // Fix value is deprecated to toARGB32()
    content = content.replace(/\.value/g, (match, offset, string) => {
      // only replace if it looks like a color.value (crude heuristic)
      if (string.substring(offset - 6, offset).match(/Color/i) || string.substring(offset - 1, offset) === ')') {
          // It's too complex to safely regex .value -> .toARGB32(), I'll leave this or target exactly what analyze reported
          // "Use component accessors like .r or .g, or toARGB32 for an explicit conversion - lib\screens\settings_screen.dart:59"
          return match;
      }
      return match;
    });

    // Fix control_flow_in_finally (in teacher_attendance_screen and teacher_homework_screen)
    content = content.replace(/finally\s*{\s*if\s*\(!mounted\)\s*return;\s*setState\(\(\)\s*=>\s*_isLoading\s*=\s*false\);\s*}/g, 'finally { if (mounted) setState(() => _isLoading = false); }');

    // Fix unused local variable user in teacher_grading_screen.dart:107
    if (filePath.includes('teacher_grading_screen.dart')) {
        content = content.replace(/final\s+user\s*=\s*Provider\.of<AuthProvider>\(context,\s*listen:\s*false\)\.user;/g, '// Removed unused user');
    }

    if (original !== content) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${path.basename(filePath)}`);
    }
}

function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.dart')) {
            processFile(fullPath);
        }
    }
}

walkDir(libDir);

// Settings screen had `.value` usage:
const settingsPath = path.join(libDir, 'settings_screen.dart');
if (fs.existsSync(settingsPath)) {
    let settingsContent = fs.readFileSync(settingsPath, 'utf8');
    settingsContent = settingsContent.replace(/Color\(([^)]+)\)\.value/g, 'Color($1).toARGB32()');
    settingsContent = settingsContent.replace(/primaryColor\.value/g, 'primaryColor.toARGB32()');
    fs.writeFileSync(settingsPath, settingsContent, 'utf8');
    console.log('Special fix applied to settings_screen.dart');
}

// Fix use_build_context_synchronously manually because it requires careful insertion
// I will run the script, then handle remaining context warnings
