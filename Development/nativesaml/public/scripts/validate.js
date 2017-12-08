$(document).ready(function () {
    
    var obj = getSession('userInfo');
    
    if (obj == null) {
        window.location.replace('usernotautorized');
    }
    
});