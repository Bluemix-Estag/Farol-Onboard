$(document).ready(function () {

    $('select').material_select();
    let id = window.location.href.split('/onboardprojectinfo?id=')[1];
    getDetails(id);
    let idEdit = window.location.href.split('/editproject?id=')[1];
    getDetails(idEdit);
    $('ul.tabs').tabs();



});

function getDetails(id) {
    xhrGet('/getprojectbyid?id=' + id, function (result) {
        $('#title-nav').append('Cloud Onboarding Tracker - '+result['customer']);
        lastUpdated(result['lastUpdated'], result['situation'])
        overview(result['id'], result['offer'], result['customer'], result['market'], result['mrr'], result['tcv']);
        status(result['story'], result['g2g'], result['owner']);
        dates(result['DATE'], result['eta']);
        cdd(result['cdd0'], result['cdd1'], result['cdd2'], result['cdd3'], result['cdd4'], result['cdd5'], result['cdd6'], result['cdd7'], result['cdd8'], result['cdd9'], result['cdd10'], result['cdd11'], result['cdd12'], result['cdd13'])
        for (let obj of result['names']) {
            console.log(obj);
            names(obj['state'], obj['name'], obj['email'], obj['idnotes'], obj['phone'])
        }
        for (let historic in result['history']) {
            let objH = result['history'][historic];
            historicCard(objH['lastUpdated'], objH['situation'], objH['story'], objH['g2g'], objH['owner']);
        }
        document.getElementById("edit-button").href = "/editproject?id=" + result['id'];

        refreshSelect();
    }, function (err) {

    });
}

function refreshSelect() {
    Materialize.updateTextFields();
}

function cdd(cdd0, cdd1, cdd2, cdd3, cdd4, cdd5, cdd6, cdd7, cdd8, cdd9, cdd10, cdd11, cdd12, cdd13) {
    table_title(cdd0);
    table_body(cdd1);
    table_body(cdd2);
    table_body(cdd3);
    table_body(cdd4);
    table_body(cdd5);
    table_body(cdd6);
    table_body(cdd7);
    table_body(cdd8);
    table_body(cdd9);
    table_body(cdd10);
    table_body(cdd11);
    table_body(cdd12);
    table_body(cdd13);
}

function table_title(cdd0) {
    let tableHead;
    for (var obj in cdd0) {
        tableHead += '<th id="tablegr" class="black-text">' + cdd0[obj] + '</th>';
    }
    //    document.getElementById('table_input').value = tableHead;
    $('#table_input_title').append(tableHead);
}

function table_body(cdd) {
    let tableBody = '<tr>';
    for (var obj in cdd) {
        tableBody += '<td id="tablegr" class="black-text">' + cdd[obj] + '</td>';
    }
    tableBody += '</tr>'
    $('#table_input_body').append(tableBody);
}

function overview(client_name, offer, customer, imt, mrr, tcv) {
    document.getElementById('client_name').value = client_name;
    document.getElementById('offer').value = offer;
    document.getElementById('customer').value = customer;
    document.getElementById('imt').value = imt;
    document.getElementById('mrr').value = mrr;
    document.getElementById('tcv').value = tcv;
}

function dates(date, eta) {
    document.getElementById('date').value = date;
    document.getElementById('eta').value = eta;
}

function names(type, name, email, idnotes, phone) {
    let names_input = '<div class="row"><div class="input-field col s3 black-text">' +
        '<input id="type" type="text" class="validate black-text" value="' + type + '" disabled><label for="phone">Type</label></div>' +
        '<div class="input-field col s3 black-text"><input id="name" type="text" class="validate black-text" value="' + name + '" disabled>' +
        '<label for="name">Name</label></div><div class="input-field col s2 black-text">' +
        '<input id="email" type="text" class="validate black-text" value="' + email + '" disabled><label for="email">Email</label></div>' +
        '<div class="input-field col s2 black-text"><input id="idnotes" type="text" class="validate black-text" value="' + idnotes + '" disabled>' +
        '<label for="idnotes">ID Notes</label></div><div class="input-field col s2 black-text">' +
        '<input id="phone" type="tel" class="validate black-text" value="' + phone + '" disabled><label for="phone">Phone</label>' +
        '</div></div></div></div></div>';
    $('#names_input').append(names_input);

}

function status(last_actions, g2g, owner) {
    document.getElementById('last_actions_status').value = last_actions;
    $('#last_actions_status').trigger('autoresize');
    document.getElementById('g2g_status').value = g2g;
    document.getElementById('owner_status').value = owner;
}


function historicCard(lastUpdatedHistoric, lastStatus, lastActionsHistoric, lastG2G, lastOwner) {
    var card = $('#action-card').clone();
    $('#status-history').prepend(card);
    
    var title = 'Updated at: <span id="last_updated_historic">' + lastUpdatedHistoric + '</span> GMT -- With Status:<span class="circle ' + lastStatus + '" id="circle_status_historic"></span>';
    
    
    $(card).find('.card-title').html(title);
    $(card).find('#g2g_status').html(lastG2G);
    $(card).find('#owner_status').html(lastOwner);
    $(card).find('textarea').val(lastActionsHistoric);
    $(card).trigger('autoresize');
}

function lastUpdated(date, color) {
    document.getElementById('last_updated').innerHTML = date;
    document.getElementById('last_updated_dates_cdd').innerHTML = date;
    document.getElementById('last_updated_dates_dates').innerHTML = date;
    document.getElementById('last_updated_names').innerHTML = date;
    document.getElementById('last_updated_status').innerHTML = date;
    $('#circle_status').addClass(color);
    $('#circle_status_dates_cdd').addClass(color);
    $('#circle_status_dates_dates').addClass(color);
    $('#circle_status_status').addClass(color);
    $('#circle_status_names').addClass(color);
}

var opened = false;

function changeTrigger() {
    if (opened == false) {
        $('#change_state').removeClass('hide');
        opened = true;
    } else {

        $('#change_state').addClass('hide');
        opened = false;
    }
}

function teste() {
    $('select').material_select();
    let stateToChange = document.getElementById('selectState').value;
    //    alert(state);
    let idURL = window.location.href.split('/onboardprojectinfo?id=')[1];
    //    alert(id);
    let body = {
        'id': idURL,
        'project_state': stateToChange
    }

    let confirmVar = confirm('Do you really want to change the current state to ' + stateToChange + '?');
    if (confirmVar) {
        console.log(JSON.stringify(body));
        xhrPost('/updateInput', body, function (result) {
            window.location.href = '/panel';
        }, function (err) {
            console.log(err);
        })
    }

}
