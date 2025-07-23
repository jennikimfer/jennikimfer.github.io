const fs = require('fs');
const path = require('path');

// Read component files
function readComponent(componentPath) {
    try {
        return fs.readFileSync(componentPath, 'utf8');
    } catch (error) {
        console.error(`Error reading component ${componentPath}:`, error);
        return '';
    }
}

// Read page configuration
function readPageConfig() {
    try {
        const configContent = fs.readFileSync('pages-config.json', 'utf8');
        return JSON.parse(configContent);
    } catch (error) {
        console.error('Error reading pages-config.json:', error);
        return { pages: {} };
    }
}

// Adjust paths based on page location
function adjustPaths(content, pageName) {
    const depth = (pageName.match(/\//g) || []).length;
    const prefix = depth > 0 ? '../'.repeat(depth) : '';
    
    // Adjust asset paths
    content = content.replace(/href="assets\//g, `href="${prefix}assets/`);
    content = content.replace(/src="assets\//g, `src="${prefix}assets/`);
    
    // Adjust navigation links
    content = content.replace(/href="(index|about|eggs)\.html"/g, `href="${prefix}$1.html"`);
    
    return content;
}

// Generate breadcrumb navigation based on file path
function generateBreadcrumb(pageName) {
    const pathParts = pageName.split('/');
    const fileName = pathParts[pathParts.length - 1].replace('.html', '');
    
    let breadcrumb = '';
    
    // Build breadcrumb for each directory level
    for (let i = 0; i < pathParts.length - 1; i++) {
        const dirName = pathParts[i];
        const dirPath = pathParts.slice(0, i + 1).join('/') + '.html';
        const prefix = '../'.repeat(pathParts.length - i - 2);
        breadcrumb += `<a href="${prefix}${dirPath}">${dirName}</a>`;
        if (i < pathParts.length - 2) {
            breadcrumb += ' > ';
        }
    }
    
    // Add current page (not linked, wrapped in span for styling)
    breadcrumb += `<span>${fileName}</span>`;
    
    return breadcrumb;
}

// Build page using standardized layout
function buildPage(pageName, pageConfig, navbar, footer, customContent = null) {
    // Choose layout template based on page type
    let layoutTemplate;
    if (pageConfig.layout === 'egg') {
        layoutTemplate = readComponent('components/shared/egg-layout.html');
    } else {
        layoutTemplate = readComponent('components/shared/page-layout.html');
    }
    
    // Read the page content (or use custom content if provided)
    const pageContent = customContent || readComponent(pageConfig.contentFile);
    
    // Generate breadcrumb if this is an egg layout page
    let breadcrumb = '';
    if (pageConfig.layout === 'egg') {
        breadcrumb = generateBreadcrumb(pageName);
    }
    
    // Replace placeholders in the layout (using global replace for multiple occurrences)
    let pageLayout = layoutTemplate
        .replace(/{{PAGE_TITLE}}/g, pageConfig.title)
        .replace(/{{PAGE_DESCRIPTION}}/g, pageConfig.description)
        .replace(/{{PAGE_SECTION}}/g, pageConfig.section)
        .replace(/{{PAGE_CONTENT}}/g, pageContent)
        .replace('<div id="navbar"></div>', navbar)
        .replace('<div id="footer"></div>', footer)
        .replace('<script src="assets/js/components.js"></script>', '<!-- Components loaded statically -->');
    
    // Replace breadcrumb if it exists
    if (breadcrumb) {
        pageLayout = pageLayout.replace(/<nav class="breadcrumb">[\s\S]*?<\/nav>/g, `<nav class="breadcrumb">${breadcrumb}</nav>`);
    }
    
    // Replace egg-specific placeholders if they exist
    if (pageConfig.subtitle) {
        pageLayout = pageLayout.replace(/{{PAGE_SUBTITLE}}/g, pageConfig.subtitle);
    }
    if (pageConfig.date) {
        pageLayout = pageLayout.replace(/{{PAGE_DATE}}/g, pageConfig.date);
    }
    
    // Adjust paths based on page location
    pageLayout = adjustPaths(pageLayout, pageName);
    
    return pageLayout;
}

// Scan eggs directory and build nested structure
function scanEggsDirectory(pageConfig) {
    const eggsPages = {};
    
    // Find all egg pages (excluding eggs.html itself)
    Object.keys(pageConfig.pages).forEach(pageName => {
        if (pageName.startsWith('eggs/') && pageName !== 'eggs.html') {
            const config = pageConfig.pages[pageName];
            const pathParts = pageName.split('/');
            const fileName = pathParts[pathParts.length - 1].replace('.html', '');
            
            // Build nested structure
            let current = eggsPages;
            for (let i = 1; i < pathParts.length - 1; i++) {
                const dirName = pathParts[i];
                if (!current[dirName]) {
                    current[dirName] = { children: {} };
                }
                current = current[dirName].children;
            }
            
            // Add the file
            current[fileName] = {
                title: config.title,
                path: pageName,
                children: {}
            };
        }
    });
    
    return eggsPages;
}

// Generate HTML for nested list
function generateEggsList(eggsPages, depth = 0) {
    let html = '';
    
    Object.keys(eggsPages).sort().forEach(key => {
        const item = eggsPages[key];
        const linkPath = item.path ? item.path : key;
        
        html += '<li>\n';
        if (item.title) {
            // This is a file with content
            html += `  <a href="${linkPath}">${key}: ${item.title}</a>\n`;
        } else {
            // This is a directory
            html += `  ${key}:\n`;
        }
        
        // Add children if any
        if (Object.keys(item.children).length > 0) {
            html += '  <ul>\n';
            html += generateEggsList(item.children, depth + 1);
            html += '  </ul>\n';
        }
        
        html += '</li>\n';
    });
    
    return html;
}

// Update eggs.html content with generated list
function updateEggsContent(pageConfig) {
    const eggsPages = scanEggsDirectory(pageConfig);
    const eggsListHtml = generateEggsList(eggsPages);
    
    // Read the current eggs content
    const eggsContent = readComponent('components/contents/eggs/eggs.html');
    
    // Replace the content with the generated list
    const updatedContent = eggsContent.replace(
        /<ul>[\s\S]*<\/ul>/,
        `<ul>\n${eggsListHtml}</ul>`
    );
    
    // Write the updated content back
    fs.writeFileSync('components/contents/eggs/eggs.html', updatedContent);
    console.log('✓ Updated eggs.html content with generated list');
}

// Generate eggs list HTML for dist
function generateEggsListForDist(pageConfig) {
    const eggsPages = scanEggsDirectory(pageConfig);
    const eggsListHtml = generateEggsList(eggsPages);
    
    // Read the current eggs content
    const eggsContent = readComponent('components/contents/eggs/eggs.html');
    
    // Replace the content with the generated list
    const updatedContent = eggsContent.replace(
        /<ul>[\s\S]*<\/ul>/,
        `<ul>\n${eggsListHtml}</ul>`
    );
    
    return updatedContent;
}

// Main build function
function build() {
    console.log('Building static pages with standardized layout...');
    
    // Read page configuration
    const pageConfig = readPageConfig();
    
    // Read components
    const navbar = readComponent('components/shared/navbar.html');
    const footer = readComponent('components/shared/footer.html');
    
    // Build each page
    Object.keys(pageConfig.pages).forEach(pageName => {
        const config = pageConfig.pages[pageName];
        console.log(`Building ${pageName}...`);
        
        let builtPage;
        
        // Special handling for eggs.html - generate list dynamically
        if (pageName === 'eggs.html') {
            const eggsContent = generateEggsListForDist(pageConfig);
            builtPage = buildPage(pageName, config, navbar, footer, eggsContent);
        } else {
            builtPage = buildPage(pageName, config, navbar, footer);
        }
        
        // Write to dist folder
        const distPath = path.join('dist', pageName);
        const distDir = path.dirname(distPath);
        fs.mkdirSync(distDir, { recursive: true });
        fs.writeFileSync(distPath, builtPage);
        console.log(`✓ Built ${distPath}`);
    });
    
    // Copy assets
    console.log('Copying assets...');
    copyAssets();
    
    console.log('Build complete! Static files are in the dist/ folder');
}

// Copy assets folder
function copyAssets() {
    const assetsPath = 'assets';
    const distAssetsPath = 'dist/assets';
    
    if (fs.existsSync(assetsPath)) {
        fs.mkdirSync(distAssetsPath, { recursive: true });
        
        // Copy CSS
        if (fs.existsSync('assets/css')) {
            fs.mkdirSync('dist/assets/css', { recursive: true });
            fs.copyFileSync('assets/css/style.css', 'dist/assets/css/style.css');
        }
        
        // Copy JS (excluding components.js since it's not needed in static build)
        if (fs.existsSync('assets/js')) {
            fs.mkdirSync('dist/assets/js', { recursive: true });
            if (fs.existsSync('assets/js/main.js')) {
                fs.copyFileSync('assets/js/main.js', 'dist/assets/js/main.js');
            }
        }
        
        // Copy images recursively
        if (fs.existsSync('assets/images')) {
            copyDirectoryRecursive('assets/images', 'dist/assets/images');
        }
    }
}

// Helper function to copy directories recursively
function copyDirectoryRecursive(source, destination) {
    if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
    }
    
    const files = fs.readdirSync(source);
    
    files.forEach(file => {
        const sourcePath = path.join(source, file);
        const destPath = path.join(destination, file);
        
        const stat = fs.statSync(sourcePath);
        
        if (stat.isDirectory()) {
            copyDirectoryRecursive(sourcePath, destPath);
        } else {
            fs.copyFileSync(sourcePath, destPath);
        }
    });
}

// Run build
build(); 