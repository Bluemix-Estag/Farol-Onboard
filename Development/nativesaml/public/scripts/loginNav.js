$(document).ready(function () {
    var obj = (getSession('userInfo'));

    document.getElementById('emailUser').innerHTML = "&nbsp; &nbsp; User: &nbsp;" + obj.emailaddress + "&nbsp; &nbsp;";
//    document.getElementById('nameUser').innerHTML = "&nbsp; Usuario: &nbsp; &nbsp;" + obj.cn;
    //                document.getElementById('ownerEdit').innerHTML = obj.cn;

})
