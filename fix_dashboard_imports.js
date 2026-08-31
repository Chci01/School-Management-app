const fs = require('fs');
const path = require('path');
const dashboardPath = path.join(__dirname, 'frontend-web', 'src', 'pages', 'Dashboard.tsx');

let content = fs.readFileSync(dashboardPath, 'utf8');
// import { ... Calendar as CalendarIcon, FileText } from 'lucide-react';
content = content.replace(/Calendar as CalendarIcon,\s*/, '').replace(/FileText,\s*/, '');
fs.writeFileSync(dashboardPath, content, 'utf8');
