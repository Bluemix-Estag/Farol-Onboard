$(document).ready(function () {

    $('select').material_select();
    let id = window.location.href.split('/editproject?id=')[1];
    getDetails(id);
    $('ul.tabs').tabs();
//    var obj = (getSession('userInfo'));
//    $('#owner_edit').val(obj.emailaddress);
    




});

function getDetails(id) {
    xhrGet('/getprojectbyid?id=' + id, function (result) {
        status(result['market'], result['offer'], result['id'], result['customer'], result['story'], result['g2g'], result['mrr'], result['tcv']);
        dates(result['DATE'], result['eta']);
        cdd(result['cdd0'], result['cdd1'], result['cdd2'], result['cdd3'], result['cdd4'], result['cdd5'], result['cdd6'], result['cdd7'], result['cdd8'], result['cdd9'], result['cdd10'], result['cdd11'], result['cdd12'], result['cdd13'])


        for (let obj of result['names']) {
            console.log(obj);
            names(obj['state'], obj['name'], obj['email'], obj['idnotes'], obj['phone'])
        }
//        alert(result['_id']);

        refreshSelect();
    }, function (err) {

    });
}

function status(imt, offer, uniqueid, customer, last_actions, g2g, mrr, tcv) {
    $('#imt').val(imt);
    $('#offer').val(offer);
    $('#unique-id').val(uniqueid);
    $('#customer').val(customer);
    document.getElementById('last_actions_status').value = last_actions;
    document.getElementById('g2g_status').value = g2g;
    document.getElementById('mrr').value = mrr;
    document.getElementById('tcv').value = tcv;
}

function refreshSelect() {
    Materialize.updateTextFields();
}

function cdd(cdd0, cdd1, cdd2, cdd3, cdd4, cdd5, cdd6, cdd7, cdd8, cdd9, cdd10, cdd11, cdd12, cdd13) {
    table_title(cdd0);
    table_body(cdd1,1);
    table_body(cdd2,2);
    table_body(cdd3,3);
    table_body(cdd4,4);
    table_body(cdd5,5);
    table_body(cdd6,6);
    table_body(cdd7,7);
    table_body(cdd8,8);
    table_body(cdd9,9);
    table_body(cdd10,10);
    table_body(cdd11,11);
    table_body(cdd12,12);
    table_body(cdd13,13);
}

function table_title(cdd0) {
    let tableHead;
    for (var obj in cdd0) {
        tableHead += '<th class="black-text">' + cdd0[obj] + '</th> <input type="hidden" name="cdd0" value="'+cdd0[obj]+'"/>';
    }
    //    document.getElementById('table_input').value = tableHead;
    $('#table_input_body').prepend(tableHead);
}

function table_body(cdd,i) {
    
    let tableBody = '<tr>';
    for (var obj in cdd) {
        tableBody += '<td class="black-text">' + cdd[obj] + '</td><input type="hidden" name="cdd'+i+'" value="'+cdd[obj]+'"/>';
    }
    tableBody += '</tr>'
    $('#table_input_body').append(tableBody);
}


function dates(date, eta) {
    document.getElementById('date').value = date;
    document.getElementById('eta').value = eta;
}

function names(type, name, email, idnotes, phone) {
    let names_input = '<div class="row"><div class="input-field col s3">' +
        '<select name="state" class="browser-default" required>' +
        '<option value="' + type + '" selected>Valor atual:' + type + '</option>' +
        '<option value="Seller">Seller</option>' +
        '<option value="TechSeller">TechSeller</option>' +
        '<option value="CloudPM">Cloud PM</option>' +
        '<option value="LocalPM">Local PM</option>' +
        '<option value="CloudPM">Cloud PM</option>' +
        '<option value="CloudDPE">Cloud DPE</option>' +
        '<option value="LocalDPE">Local DPE</option>' +
        '<option value="Customer">Customer</option>' +
        '</select></div>' +
        '<div class="input-field col s3"><input id="name" name="name" type="text" class="validate" value="' + name + '">' +
        '<label for="name">Name</label></div><div class="input-field col s2">' +
        '<input id="email" name="email" type="text" class="validate" value="' + email + '"><label for="email">Email</label></div>' +
        '<div class="input-field col s2"><input id="idnotes" name="idnotes" type="text" class="validate" value="' + idnotes + '">' +
        '<label for="idnotes">ID Notes</label></div><div class="input-field col s2">' +
        '<input id="phone" name="phone" type="tel" class="validate" value="' + phone + '"><label for="phone">Phone</label>' +
        '</div></div></div></div></div>';
    $('#names_input').append(names_input);

}



function historicCard(lastUpdatedHistoric, lastStatus, lastActionsHistoric, lastG2G, lastOwner) {
    let card = '<div class="row"><div class="col s12"><div class="card"><div class="card-content white-text">' +
        '<span class="card-title black-text" style="font-size: 14pt">Updated at: <span id="last_updated_historic">' + lastUpdatedHistoric + '</span> -- With Status:<span class="circle ' + lastStatus + '" id="circle_status_historic"></span></span><div class="row"><div class="col s12"><div class="row">' +
        '<div class="col s12"><div class="row"><div class="input-field col s12"><textarea id="last_actions_historic" class="materialize-textarea">' + lastActionsHistoric + '</textarea><label for="last_actions">Last Actions</label></div></div></div>' +
        '<div class="input-field col s6"><input id="g2g_historic" type="tel" class="validate" value="' + lastG2G + '"><label for="g2g_historic">G2G</label>' +
        '</div><div class="input-field col s6"><input id="owner_historic" type="tel" class="validate" value="' + lastOwner + '"><label for="owner_historic">Owner</label></div></div></div></div></div></div></div></div>';
    $('#historic').append(card);
}

function lastUpdated(date, color) {
    document.getElementById('last_updated').innerHTML = date;
    document.getElementById('last_updated_names').innerHTML = date;
    document.getElementById('last_updated_status').innerHTML = date;
    $('#circle_status').addClass(color);
    $('#circle_status_status').addClass(color);
    $('#circle_status_names').addClass(color);
}
