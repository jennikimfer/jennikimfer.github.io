// Component loader for common elements
class ComponentLoader {
    static async loadComponent(elementId, componentPath) {
        try {
            const response = await fetch(componentPath);
            const html = await response.text();
            document.getElementById(elementId).innerHTML = html;
        } catch (error) {
            console.error('Error loading component:', error);
        }
    }

    static loadNavbar() {
        this.loadComponent('navbar', 'components/navbar.html');
    }

    static loadFooter() {
        this.loadComponent('footer', 'components/footer.html');
    }
}

// Load components when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    ComponentLoader.loadNavbar();
    ComponentLoader.loadFooter();
}); 