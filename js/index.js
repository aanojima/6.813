/**
 * index.js for Uchi
 */

(function(win, doc){
    
    $(doc).ready(function() {
        
        // "My Account" button event handler
        $("#btn-account").click(function(e) {
            window.location.href = "account.html";
        });
        
        // Search button event handler
        $("#inp_submit").click(function(e) {
            var room = $("#inp_room").val();
            window.location.href = "results.html?r="+room;
        });
        
    });
    
}(window, document));