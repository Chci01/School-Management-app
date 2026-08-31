const fs = require('fs');
const path = require('path');

const libDir = path.join(__dirname, 'lib');

function modifyFile(filePath, replacer) {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = replacer(content);
        if (newContent !== content) {
            fs.writeFileSync(filePath, newContent, 'utf8');
        }
    }
}

// 1. settings_provider.dart
modifyFile(path.join(libDir, 'providers', 'settings_provider.dart'), content => {
    return content.replace(/_themeColor\.value/g, '_themeColor.toARGB32()');
});

// 2. dashboard_screen.dart
modifyFile(path.join(libDir, 'screens', 'dashboard_screen.dart'), content => {
    content = content.replace(/Map<String, dynamic>\? _monthlyConduct;/g, '// Removed _monthlyConduct');
    let lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('Navigator.push(') && lines[i].includes('context') && i > 300) {
            if (!lines[i].includes('mounted')) {
                lines[i] = 'if (!mounted) return; ' + lines[i];
            }
        }
    }
    return lines.join('\n');
});

// 3. login_screen.dart
modifyFile(path.join(libDir, 'screens', 'login_screen.dart'), content => {
    let lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('Navigator.pushReplacement(') || lines[i].includes('ScaffoldMessenger.of(context)')) {
            if (!lines[i].includes('mounted') && (i === 0 || !lines[i-1].includes('mounted'))) {
                lines[i] = lines[i].replace(/(ScaffoldMessenger\.of\(context\)|Navigator\.pushReplacement)/, 'if (!mounted) return; $1');
            }
        }
    }
    return lines.join('\n');
});

// 4. news_screen.dart
modifyFile(path.join(libDir, 'screens', 'news_screen.dart'), content => {
    return content.replace(/\bprint\(e\);/g, '// print(e);');
});

// 5. teacher_dashboard_screen.dart
modifyFile(path.join(libDir, 'screens', 'teacher_dashboard_screen.dart'), content => {
    let lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('Navigator.push(') && lines[i-2] && lines[i-2].includes('MaterialPageRoute')) {
           // wait, we can just replace Navigator.push(context if it's there
           if (!lines[i].includes('mounted') && !lines[i-1].includes('mounted') && !lines[i-2].includes('mounted') && !lines[i-3].includes('mounted')) {
                lines[i] = lines[i].replace(/Navigator\.push\(context/, 'if (!mounted) return; Navigator.push(context');
           }
        }
    }
    return lines.join('\n');
});

// 6. settings_screen.dart (toARGB32)
modifyFile(path.join(libDir, 'screens', 'settings_screen.dart'), content => {
    return content.replace(/\.value/g, (match, offset, string) => {
        if (string.substring(offset - 6, offset).includes('Color') || string.substring(offset - 20, offset).includes('themeColor')) {
            return '.toARGB32()';
        }
        return match;
    });
});
