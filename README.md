# Personal Website

A clean, modern personal website built with HTML, CSS, and JavaScript using a component-based architecture with standardized page layouts and responsive design.

## File Structure

```
jennikimfer.github.io/
├── index.html              # Home page template (legacy - now using standardized system)
├── about.html              # About page template (legacy - now using standardized system)
├── README.md              # This file
├── build.js               # Build script for static generation
├── package.json           # Project configuration
├── pages-config.json      # Page configuration and metadata
├── components/            # Reusable HTML components
│   ├── navbar.html        # Navigation component
│   ├── footer.html        # Footer component
│   ├── page-layout.html   # Standardized page layout template
│   ├── home-content.html  # Home page content
│   └── about-content.html # About page content
└── assets/                # Static assets
    ├── css/
    │   └── style.css      # Main stylesheet
    ├── js/
    │   ├── main.js        # Main JavaScript functionality
    │   └── components.js  # Component loader
    └── images/            # Image assets
        └── about/         # Page-specific images
```

## Features

- **Standardized Page Layout**: All pages follow the same structure and format
- **Component-Based Architecture**: Reusable navbar, footer, and page layout components
- **Static Site Generation**: Build script to generate complete static HTML files
- **Fully Responsive Design**: Uses relative units (rem, %, vw) for optimal scaling
- **Modern UI**: Clean, professional design with pastel olive brown theme
- **Pink Link Theme**: Consistent pink color scheme for all links
- **Image Support**: Automatic image copying and responsive image handling
- **Custom Text Selection**: Light pink highlighting for selected text
- **Fast Loading**: Optimized for performance
- **SEO Friendly**: Proper meta tags and semantic HTML
- **Accessibility**: Proper alt text and semantic HTML structure

## Development

### Prerequisites
- Node.js (for build script)

### Setup
1. Clone or download this repository
2. Install dependencies (if any): `npm install`

### Development Workflow
1. **Edit page content** in the `components/` folder (e.g., `home-content.html`, `about-content.html`)
2. **Edit page metadata** in `pages-config.json`
3. **Edit components** in the `components/` folder
4. **Edit styles** in `assets/css/style.css`
5. **Add images** to `assets/images/` folder
6. **Test locally** by running the build script and opening files in your browser

### Standardized Page System
The website uses a standardized page layout system:

- **`components/page-layout.html`** - Master template for all pages
- **`components/*-content.html`** - Page-specific content components
- **`pages-config.json`** - Page metadata and configuration

### Component System
The website uses a JavaScript-based component system:
- **`components/navbar.html`** - Navigation sidebar
- **`components/footer.html`** - Footer content
- **`assets/js/components.js`** - Loads components into pages

## Building Static Pages

### Generate Static Files
```bash
# Run the build script
npm run build
# or
node build.js
```

### Build Output
The build script creates a `dist/` folder containing:
- Complete static HTML files (no JavaScript component loading needed)
- All assets (CSS, JS, images)
- Ready-to-deploy website

### What the Build Does
1. Reads the standardized page layout template
2. Loads page-specific content from content components
3. Applies page metadata from configuration
4. Embeds navbar and footer components
5. Removes JavaScript component loader
6. Copies all assets (including images) to `dist/` folder recursively
7. Creates complete static HTML files

## Adding New Pages

### Method 1: Using the Standardized System (Recommended)

1. **Create a content component** in `components/` folder:
   ```html
   <!-- components/contact-content.html -->
   <h2>Contact Me</h2>
   <p>Get in touch with me...</p>
   <p>Email: your.email@example.com</p>
   ```

2. **Add page configuration** to `pages-config.json`:
   ```json
   {
     "pages": {
       "contact.html": {
         "title": "Contact",
         "description": "Contact Your Name - Get in touch",
         "section": "contact",
         "contentFile": "components/contact-content.html"
       }
     }
   }
   ```

3. **Run the build script**:
   ```bash
   npm run build
   ```

### Method 2: Legacy Template Approach

1. Create a new HTML file (e.g., `contact.html`)
2. Use the same structure as existing pages
3. Add `<div id="navbar"></div>` and `<div id="footer"></div>` placeholders
4. Include the component loader script
5. Add the page to the build script's pages array

## Adding Images

### Adding Images to Pages
1. **Place images** in `assets/images/` folder (organize by page if needed)
2. **Add to content** using HTML:
   ```html
   <figure>
       <img src="assets/images/your-image.jpg" alt="Description" class="about-image">
       <figcaption>Your caption here</figcaption>
   </figure>
   ```
3. **Style inline** if needed:
   ```html
   <img src="assets/images/your-image.jpg" style="max-width: 50%; margin: 1rem auto; display: block;">
   ```

### Image Styling
- **Responsive**: Images automatically scale with screen size
- **Rounded corners**: Matches site design
- **Captions**: Use `<figure>` and `<figcaption>` for semantic captions
- **Automatic copying**: Images are automatically copied to `dist/` during build

## Deployment

### GitHub Pages
1. Run the build script: `npm run build`
2. Copy contents of `dist/` folder to your repository root
3. Push to GitHub
4. Enable GitHub Pages in repository settings

### Other Hosting
1. Run the build script: `npm run build`
2. Upload the entire `dist/` folder contents to your web server

### Local Testing
```bash
# Navigate to dist folder
cd dist

# Start local server
python3 -m http.server 8000

# Visit http://localhost:8000
```

## Customization

### Colors
The main colors used in this template are:
- **Background**: `#e6e8d4` (Pastel olive with green undertone)
- **Content Boxes**: `#f0f2e2` (Lighter pastel olive)
- **Links**: `#d4a5a5` (Muted pastel pink)
- **Link Hover**: `#b88a8a` (Darker pink)
- **Text**: `#4a4a4a` (Dark gray)
- **Headings**: `#6b5b47` (Warm brown)
- **Text Selection**: `rgba(248, 209, 209, 0.6)` (Transparent light pink)

### Typography
- **Primary Font**: Oxygen (Google Fonts)
- **Base Size**: 16px (for rem calculations)
- **Responsive**: All text scales with viewport and user preferences

### Responsive Design
- **Relative Units**: Uses rem, %, vw, vh for all measurements
- **Mobile-First**: Responsive breakpoints at 48rem (768px)
- **Flexible Layout**: Adapts to all screen sizes
- **Accessible**: Respects user's browser font size preferences

### Adding New Components
1. Create a new HTML file in `components/` folder
2. Add a loading method to `assets/js/components.js`
3. Add a placeholder div to your pages
4. Update the build script to include the new component

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## License

This template is free to use for personal and commercial projects.

## Contributing

Feel free to fork this template and customize it for your needs. If you make improvements, consider sharing them back! 