const fs = require('fs');
const path = require('path');
const pagesDir = path.join(__dirname, 'frontend-web', 'src', 'pages');

function replaceFile(file, replacer) {
    if (!fs.existsSync(file)) return;
    let original = fs.readFileSync(file, 'utf8');
    let fixed = replacer(original);
    if (fixed !== original) {
        fs.writeFileSync(file, fixed, 'utf8');
    }
}

replaceFile(path.join(pagesDir, 'Exams.tsx'), str => str.replace(/Calendar,\s*/, ''));
replaceFile(path.join(pagesDir, 'Finances.tsx'), str => str.replace(/import React, \{/g, 'import {').replace(/import React from 'react';\n/g, ''));
replaceFile(path.join(pagesDir, 'Timetable.tsx'), str => str.replace(/Clock,\s*/, '').replace(/Users,\s*/, ''));
