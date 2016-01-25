/* Navigation*/
var nav = (function () {
	var navelements = document.getElementById('navigation-list').getElementsByTagName('li'),
		currentpage = location.pathname.match(/[^/]*$/);

	if (navelements.length>0 ) {
        for(var i = 0, len = navelements.length;  i<len; i++) {

			if (currentpage[0] === "" ) {
				currentpage = "index.html";
			}

            if (navelements[i].querySelector('a').href.indexOf(currentpage) !=-1) {
                navelements[i].className += " current";

            }
        }
    }
})();
