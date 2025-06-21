---
type: "project"
title: "File Path Test Project"
createTime: "2025-06-16T15:09:07.246Z"
description: "Testing various file path references in markdown content"
tags: ["test", "file-paths", "markdown"]
category: "testing"
coverImage: "/background/default_proj.jpg"
---

# File Path Test Project

This project tests various file path references in markdown content to ensure they work correctly with the base URL configuration.

## Image Tests

### Test 1: Background Images
This should show the default project background:
![Default Project Background](/background/default_proj.jpg)

### Test 2: Global Background
Testing global background image:
![Global Background](/background/global.png)

### Test 3: Hero Background
Testing hero background image:
![Hero Background](/background/hero.jpg)

### Test 4: Blog Default Background
Testing blog default background:
![Blog Background](/background/default_blog.png)

### Test 5: Favicon
Testing favicon reference:
![Favicon](/favicon.png)

### Test 6: Default Cover
Testing default cover image:
![Default Cover](/default_cover.jpg)

## PDF File Test
Testing PDF file reference:
[Sample Resume PDF](/Alex_Demo_Resume.pdf)

## Audio File Test
Testing audio file reference (if exists):
[Audio File](/audio/sample.mp3)

## Relative Path Tests

### Test with absolute paths starting with /
- Image: ![Test Image](/background/default_proj.jpg)
- Link: [PDF Link](/Alex_Demo_Resume.pdf)

### Test with relative paths (should also work)
- Image: ![Test Image](../../../background/default_proj.jpg)
- Link: [PDF Link](../../../Alex_Demo_Resume.pdf)

## File Types Test

### Images
- PNG: ![PNG Image](/favicon.png)
- JPG: ![JPG Image](/background/hero.jpg)

### Documents
- PDF: [Resume PDF](/Alex_Demo_Resume.pdf)

### 404 Page Test
- HTML: [404 Page](/404.html)

## Expected Behavior

All these file references should be properly processed with the base URL (`/my-portfolio1111/`) when built, so they resolve to paths like:
- `/my-portfolio1111/background/default_proj.jpg`
- `/my-portfolio1111/favicon.png`
- `/my-portfolio1111/Alex_Demo_Resume.pdf`

## Technical Notes

The markdown processing should handle these public file references and prepend the correct base URL for deployment.

## Testing Instructions

1. View this project page in development mode
2. Check that all images load correctly
3. Verify that PDF links work
4. Test in built/deployed version to ensure base URL is applied
5. Check browser developer tools to see the actual resolved URLs

## Current Base URL Configuration

- Development: Should work with relative paths
- Production: Should include `/my-portfolio1111/` prefix
- Base URL from config: {{baseUrl}}
