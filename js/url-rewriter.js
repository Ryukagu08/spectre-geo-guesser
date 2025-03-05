/**
 * URL Rewriter for Spectre Divide Geoguessr
 * Changes /game.html to /guessr and /index.html to /home in the URL bar
 * 
 * Include this script in both game.html and index.html before the closing </body> tag:
 * <script src="js/url-rewriter.js"></script>
 */

(function() {
    // Function to change URL without page reload
    function updateURL() {
      try {
        // Get current URL
        const currentPath = window.location.pathname;
        let newPath = currentPath;
        
        // Check which page we're on and update accordingly
        if (currentPath.includes('game.html')) {
          newPath = currentPath.replace('game.html', 'guessr');
        } 
        else if (currentPath.includes('index.html')) {
          newPath = currentPath.replace('index.html', 'home');
        }
        // If we're at the root URL (/) or /index without .html, also redirect to /home
        else if (currentPath === '/' || currentPath === '/index') {
          newPath = '/home';
        }
        
        // Only update if the path changed
        if (newPath !== currentPath) {
          // Update the URL without reloading the page
          window.history.replaceState(
            { path: newPath }, 
            document.title, 
            newPath
          );
          
          console.log('URL updated to:', window.location.href);
        }
      } catch (error) {
        console.error('Error updating URL:', error);
      }
    }
  
    // Run when DOM is fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', updateURL);
    } else {
      // DOM already loaded, run immediately
      updateURL();
    }
  })();