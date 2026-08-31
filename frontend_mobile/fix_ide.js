const fs = require('fs');
const path = require('path');
const libDir = path.join(__dirname, 'lib');

function replaceLine(filePath, lineNumber, replacer) {
    if (!fs.existsSync(filePath)) return;
    let lines = fs.readFileSync(filePath, 'utf8').split('\n');
    if (lineNumber - 1 < lines.length) {
        lines[lineNumber - 1] = replacer(lines[lineNumber - 1]);
        fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
        console.log('Fixed', filePath, ':', lineNumber);
    }
}

// 1. dashboard_screen.dart
const dsh = path.join(libDir, 'screens', 'dashboard_screen.dart');
replaceLine(dsh, 116, line => line.replace(/dynamic _monthlyConduct;/, ''));
replaceLine(dsh, 134, line => line.replace(/_monthlyConduct = conduct;/, ''));
replaceLine(dsh, 310, line => {
    if (!line.includes('mounted')) {
        return line.replace(/Navigator\.push/, 'if (!mounted) return; Navigator.push');
    }
    return line;
});

// 2. settings_provider.dart
const sp = path.join(libDir, 'providers', 'settings_provider.dart');
replaceLine(sp, 44, line => line.replace(/\.value/g, '.toARGB32()'));

// 3. news_screen.dart
const ns = path.join(libDir, 'screens', 'news_screen.dart');
replaceLine(ns, 34, line => line.replace(/print/, '// print'));

// 4. student_payments_screen.dart
const sps = path.join(libDir, 'screens', 'student_payments_screen.dart');
replaceLine(sps, 44, line => line.replace(/\/\/ TODO: Dynamic translations for the title/, ''));

// 5. teacher_classes_screen.dart
const tcs = path.join(libDir, 'screens', 'teacher_classes_screen.dart');
replaceLine(tcs, 92, line => line.replace(/\/\/ TODO: Navigate to Class students list/, ''));

// 6. teacher_dashboard_screen.dart
const tds = path.join(libDir, 'screens', 'teacher_dashboard_screen.dart');
replaceLine(tds, 277, line => {
    if (!line.includes('mounted')) {
        return line.replace(/Navigator\.push/, 'if (!mounted) return; Navigator.push');
    }
    return line;
});
