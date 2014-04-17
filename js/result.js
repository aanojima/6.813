(function(win, doc) {
    $(doc).ready(function(){
        
        // Goes back to the homepage when the brand is clicked
        $(".navbar-left").click(function(e) {
            window.location.href = "index.html";
        });
        
        // "My Account" button event handler
        $("#btn-account").click(function(e) {
            window.location.href = "account.html";
        });
        
        getUrlVars = function() {
            var vars = [], hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars;
        };
        
        getUrlVar = function(name) {
            return getUrlVars()[name];
        };
        
        var design = win.data[parseInt(getUrlVar("id"),10)];
        
        $("#res-title").text(design.information.name);
        $("#res-designer").text("by "+design.information.designer);
        $("#res-description").text(design.information.description);
        $("#res-image").css({
            "background": "url('"+design.information.image+"')",
            "background-size": "cover",
            "background-position": "center"
        });
        
        // Goes back to the homepage when the brand is clicked
        $("#btn-similar").click(function(e) {
            var r = design.filters.room.replace(" ","_");
            var c = design.filters.colors.join(",");
            var s = design.filters.styles.join(",");
            window.location.href = "results.html?r="+r+"&c="+c+"&s="+s;
        });
        
    });
}(window, document));