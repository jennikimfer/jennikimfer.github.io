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

// Build page using standardized layout
function buildPage(pageName, pageConfig, navbar, footer) {
    // Read the page layout template
    let pageLayout = readComponent('components/page-layout.html');
    
    // Read the page content
    const pageContent = readComponent(pageConfig.contentFile);
    
    // Replace placeholders in the layout
    pageLayout = pageLayout
        .replace('{{PAGE_TITLE}}', pageConfig.title)
        .replace('{{PAGE_DESCRIPTION}}', pageConfig.description)
        .replace('{{PAGE_SECTION}}', pageConfig.section)
        .replace('{{PAGE_CONTENT}}', pageContent)
        .replace('<div id="navbar"></div>', navbar)
        .replace('<div id="footer"></div>', footer)
        .replace('<script src="assets/js/components.js"></script>', '<!-- Components loaded statically -->');
    
    return pageLayout;
}

// Main build function
function build() {
    console.log('Building static pages with standardized layout...');
    
    // Read components
    const navbar = readComponent('components/navbar.html');
    const footer = readComponent('components/footer.html');
    
    // Read page configuration
    const pageConfig = readPageConfig();
    
    // Build each page
    Object.keys(pageConfig.pages).forEach(pageName => {
        const config = pageConfig.pages[pageName];
        console.log(`Building ${pageName}...`);
        
        const builtPage = buildPage(pageName, config, navbar, footer);
        
        // Write to dist folder
        const distPath = path.join('dist', pageName);
        fs.mkdirSync('dist', { recursive: true });
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