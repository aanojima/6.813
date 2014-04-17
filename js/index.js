/**
 * index.js for Uchi
 */

(function(win, doc){
    
    $(doc).ready(function() {
        
        // Search button event handler
        $("#inp_submit").click(function(e) {
            var room = $("#inp_room").val();
            window.location.href = "results.html?r="+room;
        });
        
    });
    
}(window, document));