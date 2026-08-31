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

// 1. dashboard_screen.dart (remove `Map<String, dynamic>? _monthlyConduct;`)
modifyFile(path.join(libDir, 'screens', 'dashboard_screen.dart'), content => {
    let newContent = content.replace(/Map<String, dynamic>\?\s*_monthlyConduct;/g, '// Map<String, dynamic>? _monthlyConduct;');
    newContent = newContent.replace(/onTap: \(\) \{\s*Navigator.push\(context, MaterialPageRoute\(builder: \(context\) => SettingsScreen\(\)\)\);\s*\}/, "onTap: () async { if (!mounted) return; Navigator.push(context, MaterialPageRoute(builder: (context) => SettingsScreen())); }");
    return newContent;
});

// 2. news_screen.dart (remove print(e))
modifyFile(path.join(libDir, 'screens', 'news_screen.dart'), content => {
    return content.replace(/print\(e\);/g, '// print(e);');
});

// 3. teacher_dashboard_screen.dart
modifyFile(path.join(libDir, 'screens', 'teacher_dashboard_screen.dart'), content => {
    return content.replace(/onTap: \(\) \{\s*Navigator.push\(context, MaterialPageRoute\(builder: \(context\) => SettingsScreen\(\)\)\);\s*\}/, "onTap: () async { if (!mounted) return; Navigator.push(context, MaterialPageRoute(builder: (context) => SettingsScreen())); }");
});

// 4. settings_provider.dart
modifyFile(path.join(libDir, 'providers', 'settings_provider.dart'), content => {
    return content.replace(/\.value/g, (match, offset, str) => {
        if (str.substring(offset - 12, offset) === '_themeColor.') {
            return '.toARGB32()';
        }
        return match;
    });
});
