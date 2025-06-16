#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

function colorize(text: string, color: string): string {
  return `${color}${text}${colors.reset}`;
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('en-US', options);
}

function createChangeLogTemplate(dateStr: string, displayDate: string): string {
  const templatePath = path.join(__dirname, 'templates', 'change-log-template.md');
  
  try {
    const template = fs.readFileSync(templatePath, 'utf8');
    return template
      .replace(/{{displayDate}}/g, displayDate)
      .replace(/{{dateStr}}/g, dateStr);
  } catch {
    // Fallback to hardcoded template if file doesn't exist
    return `# Change Log - ${displayDate}

## Summary
Brief overview of today's development work.

## Changes Made

### 1. Feature/Fix Title
Description of the change made.

### 2. Another Change
Description of another change made.

## Benefits

### ✅ Improvements
- **User Experience**: How changes improve the user experience
- **Developer Experience**: Improvements for development workflow
- **Performance**: Any performance gains achieved

### ✅ Technical Benefits
- **Code Quality**: Improvements to codebase maintainability
- **Architecture**: Structural improvements
- **Testing**: Test coverage or reliability improvements

## Next Steps
1. **Immediate**: What needs to be done next
2. **Short-term**: Near-future development priorities
3. **Long-term**: Strategic development goals

---

*Log created: ${displayDate}*
*Development status: In progress*
`;
  }
}

function createDeveloperLogTemplate(dateStr: string, displayDate: string): string {
  const templatePath = path.join(__dirname, 'templates', 'developer-log-template.md');
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  try {
    const template = fs.readFileSync(templatePath, 'utf8');
    return template
      .replace(/{{displayDate}}/g, displayDate)
      .replace(/{{dateStr}}/g, dateStr)
      .replace(/{{currentDate}}/g, currentDate);
  } catch {
    // Fallback to hardcoded template if file doesn't exist
    return `# Developer Log - ${displayDate}

## Implementation Summary

### Problem Statement
Describe the main technical challenges addressed today.

### Solution Overview
High-level description of the technical approach taken.

## Technical Implementations

### 1. Feature/Fix Name

#### Problem Analysis
- **Issue**: Description of the specific problem
- **Root Cause**: Technical analysis of why the issue occurred
- **Impact**: How this affected users or development

#### Solution Design
- **Approach**: Technical strategy chosen
- **Architecture**: How the solution fits into the overall system
- **Alternatives Considered**: Other approaches that were evaluated

#### Implementation Details
\`\`\`typescript
// Code examples and technical details
// Include relevant code snippets that demonstrate the solution
\`\`\`

#### Files Modified
- \`path/to/file1.ts\` - Description of changes
- \`path/to/file2.tsx\` - Description of changes

#### Testing Results
- ✅ Unit tests passing
- ✅ Integration tests verified
- ✅ Manual testing completed
- ✅ Cross-browser compatibility checked

## Performance Impact

### Before/After Metrics
- **Performance**: Measurable improvements
- **Bundle Size**: Any changes to build output
- **Memory Usage**: Impact on runtime performance

### Optimization Notes
- **Code Efficiency**: Improvements to algorithm or implementation
- **Resource Usage**: Better utilization of system resources
- **User Experience**: Perceived performance improvements

## Future Considerations

### Technical Debt
- **Identified**: Any technical debt discovered
- **Planned**: Debt reduction strategies

### Potential Improvements
- **Short-term**: Quick wins and minor improvements
- **Long-term**: Architectural improvements and major features

### Architecture Notes
- **Patterns**: Design patterns used or established
- **Dependencies**: New dependencies added or removed
- **Interfaces**: API or interface changes

---

*Technical implementation completed: ${displayDate}*
*Documentation updated: ${currentDate}*
`;
  }
}

async function createDailyLog(dateStr?: string) {
  let targetDate: Date;
  
  if (dateStr) {
    // Parse the date string properly to avoid timezone issues
    const [year, month, day] = dateStr.split('-').map(Number);
    targetDate = new Date(year, month - 1, day); // month is 0-indexed
  } else {
    targetDate = new Date();
  }
  
  const formattedDate = formatDate(targetDate);
  const displayDate = formatDisplayDate(targetDate);

  const logsDir = path.join(process.cwd(), 'public', 'devlogs');
  const dayDir = path.join(logsDir, formattedDate);

  // Create directories if they don't exist
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
    console.log(colorize(`📁 Created logs directory: ${logsDir}`, colors.blue));
  }

  if (!fs.existsSync(dayDir)) {
    fs.mkdirSync(dayDir, { recursive: true });
    console.log(colorize(`📁 Created daily directory: ${dayDir}`, colors.blue));
  }

  const changeLogPath = path.join(dayDir, 'change-log.md');
  const devLogPath = path.join(dayDir, 'developer-log.md');

  // Create change-log.md if it doesn't exist
  if (!fs.existsSync(changeLogPath)) {
    const changeLogContent = createChangeLogTemplate(formattedDate, displayDate);
    fs.writeFileSync(changeLogPath, changeLogContent);
    console.log(colorize(`📝 Created change log: ${changeLogPath}`, colors.green));
  } else {
    console.log(colorize(`📝 Change log already exists: ${changeLogPath}`, colors.yellow));
  }

  // Create developer-log.md if it doesn't exist
  if (!fs.existsSync(devLogPath)) {
    const devLogContent = createDeveloperLogTemplate(formattedDate, displayDate);
    fs.writeFileSync(devLogPath, devLogContent);
    console.log(colorize(`📝 Created developer log: ${devLogPath}`, colors.green));
  } else {
    console.log(colorize(`📝 Developer log already exists: ${devLogPath}`, colors.yellow));
  }

  console.log(colorize(`\n✅ Daily logs ready for ${displayDate}`, colors.green + colors.bright));
  console.log(colorize(`   Change Log: public/devlogs/${formattedDate}/change-log.md`, colors.gray));
  console.log(colorize(`   Developer Log: public/devlogs/${formattedDate}/developer-log.md`, colors.gray));
}

function showUsage() {
  console.log(colorize('📅 Daily Log Creator for Portfolio Development', colors.cyan + colors.bright));
  console.log('');
  console.log(colorize('Usage:', colors.yellow + colors.bright));
  console.log(`  ${colorize('npm run', colors.gray)} ${colorize('log', colors.blue)}`);
  console.log(`  ${colorize('npm run', colors.gray)} ${colorize('log', colors.blue)} ${colorize('YYYY-MM-DD', colors.magenta)}`);
  console.log('');
  console.log(colorize('Examples:', colors.yellow + colors.bright));
  console.log(`  ${colorize('npm run', colors.gray)} ${colorize('log', colors.blue)} ${colorize('# Creates logs for today', colors.gray)}`);
  console.log(`  ${colorize('npm run', colors.gray)} ${colorize('log', colors.blue)} ${colorize('2025-06-07', colors.magenta)} ${colorize('# Creates logs for specific date', colors.gray)}`);
  console.log('');
  console.log(colorize('What it creates:', colors.yellow + colors.bright));
  console.log(`  ${colorize('public/devlogs/YYYY-MM-DD/change-log.md', colors.green)}     ${colorize('# High-level daily changes', colors.gray)}`);
  console.log(`  ${colorize('public/devlogs/YYYY-MM-DD/developer-log.md', colors.green)}  ${colorize('# Detailed technical notes', colors.gray)}`);
}

async function main() {
  const args = process.argv.slice(2);
  
  // Handle help command
  if (args.length > 0 && (args[0] === '--help' || args[0] === '-h' || args[0] === 'help')) {
    showUsage();
    process.exit(0);
  }

  if (args.length > 1) {
    console.error(colorize('❌ Error: Too many arguments', colors.red + colors.bright));
    console.log('');
    showUsage();
    process.exit(1);
  }

  const dateArg = args[0];

  // Validate date format if provided
  if (dateArg && !/^\d{4}-\d{2}-\d{2}$/.test(dateArg)) {
    console.error(colorize('❌ Error: Date must be in YYYY-MM-DD format', colors.red + colors.bright));
    console.log('');
    showUsage();
    process.exit(1);
  }

  try {
    await createDailyLog(dateArg);
  } catch (error) {
    console.error(colorize('❌ Error:', colors.red + colors.bright), error);
    process.exit(1);
  }
}

// Run the script
main();
