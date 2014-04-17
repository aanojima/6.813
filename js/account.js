/**
 * account.js for Uchi
 */

(function(win, doc){
    
    $(doc).ready(function() {

        // Goes back to the homepage when the brand is clicked
        $(".navbar-left").click(function(e) {
            window.location.href = "index.html";
        });
        
        // "New Search" button event handler
        $("#btn-search").click(function(e) {
            window.location.href = "results.html";
        });
        
    });
    
}(window, document));