$(document).ready(function () {


    //Validate User
    // validateUser()


    //Modal-Filter
    $('.modal').modal();

    //Tabs
    $('ul.tabs').tabs();

    //Select
    $('select').material_select();
    $('.tooltipped').tooltip({delay: 50});



    var currentTab = getCurrentTab();

    $('#choose-filter').click(function () {
        var option = $('#options-filter').val();
        console.log('Opção: ' + option);

        // applyFilter()
        switch (option) {
            case '1':
                $('#engagement-section-global').removeClass('hide');
                $('#engagement-section-brazil').removeClass('hide');
                $('#engagement-section-ssa').removeClass('hide');
                $('#engagement-section-mexico').removeClass('hide');
                $('#engagement-section-closed').removeClass('hide');

                $('#onboard-section-global').addClass('hide');
                $('#onboard-section-brazil').addClass('hide');
                $('#onboard-section-ssa').addClass('hide');
                $('#onboard-section-mexico').addClass('hide');
                $('#onboard-section-closed').addClass('hide');

                $('#steady-section-global').addClass('hide');
                $('#steady-section-brazil').addClass('hide');
                $('#steady-section-ssa').addClass('hide');
                $('#steady-section-mexico').addClass('hide');
                $('#steady-section-closed').addClass('hide');

                break;
            case '2':
                $('#engagement-section-global').addClass('hide');
                $('#engagement-section-brazil').addClass('hide');
                $('#engagement-section-mexico').addClass('hide');
                $('#engagement-section-ssa').addClass('hide');
                $('#engagement-section-closed').addClass('hide');


                $('#onboard-section-global').removeClass('hide');
                $('#onboard-section-brazil').removeClass('hide');
                $('#onboard-section-ssa').removeClass('hide');
                $('#onboard-section-mexico').removeClass('hide');
                $('#onboard-section-closed').removeClass('hide');



                $('#steady-section-global').addClass('hide');
                $('#steady-section-brazil').addClass('hide');
                $('#steady-section-ssa').addClass('hide');
                $('#steady-section-mexico').addClass('hide');
                $('#steady-section-closed').addClass('hide');


                break;
            case '3':
                $('#engagement-section-global').addClass('hide');
                $('#engagement-section-brazil').addClass('hide');
                $('#engagement-section-ssa').addClass('hide');
                $('#engagement-section-mexico').addClass('hide');
                $('#engagement-section-closed').addClass('hide');

                $('#onboard-section-global').addClass('hide');
                $('#onboard-section-brazil').addClass('hide');
                $('#onboard-section-ssa').addClass('hide');
                $('#onboard-section-mexico').addClass('hide');
                $('#onboard-section-closed').addClass('hide');


                $('#steady-section-global').removeClass('hide');
                $('#steady-section-brazil').removeClass('hide');
                $('#steady-section-ssa').removeClass('hide');
                $('#steady-section-mexico').removeClass('hide');
                $('#steady-section-closed').removeClass('hide');

                break;
            default:
                $('#engagement-section-global').removeClass('hide');
                $('#engagement-section-brazil').removeClass('hide');
                $('#engagement-section-ssa').removeClass('hide');
                $('#engagement-section-mexico').removeClass('hide');
                $('#engagement-section-closed').removeClass('hide');


                $('#onboard-section-global').removeClass('hide');
                $('#onboard-section-brazil').removeClass('hide');
                $('#onboard-section-ssa').removeClass('hide');
                $('#onboard-section-mexico').removeClass('hide');
                $('#onboard-section-closed').removeClass('hide');


                $('#steady-section-global').removeClass('hide');
                $('#steady-section-brazil').removeClass('hide');
                $('#steady-section-ssa').removeClass('hide');
                $('#steady-section-mexico').removeClass('hide');
                $('#steady-section-closed').removeClass('hide');

                break;
        }

    })


    var validated = false;
    var obj = (getSession('userInfo'));
    //         alert(obj.emailaddress);


    //    xhrGet('/validateUser?user=' + obj.emailaddress, function (result) {
    xhrGet('/validateUser?user=carfer@br.ibm.com', function (result) {

        console.log(JSON.stringify(result));
        //        alert(JSON.stringify(result));
        if (result.message == "Access Granted") {
            //                    alert(JSON.stringify(result));
            console.log("xhr 200");
            validated = true;
            xhrGet('/getprojects', function (result) {
                console.log('Tipo: ' + typeof result);
                var steadyCountGlobal = 0;
                var onboardCountGlobal = 0;
                var engagementCountGlobal = 0;
                var steadyCountBR = 0;
                var onboardCountBR = 0;
                var engagementCountBR = 0;
                var steadyCountSSA = 0;
                var onboardCountSSA = 0;
                var engagementCountSSA = 0;
                var steadyCountMX = 0;
                var onboardCountMX = 0;
                var engagementCountMX = 0;

                for (card of result) {
                    if (card.isClosed == 'false') {
                        if (card.history === undefined) {
                            if (card.market == 'Brazil') {
                                if (card.project_state == 'engagement') {
                                    engagementCountBR++;
                                    createCard('engagement-section-brazil', card.id, card.customer, card.lastUpdated, card.situation);

                                } else if (card.project_state == 'onboard') {
                                    onboardCountBR++;
                                    createCard('onboard-section-brazil', card.id, card.customer, card.lastUpdated, card.situation);
                                } else {
                                    steadyCountBR++;
                                    createCard('steady-section-brazil', card.id, card.customer, card.lastUpdated, card.situation);
                                }

                            } else if (card.market == 'SSA') {
                                if (card.project_state == 'engagement') {
                                    engagementCountSSA++;
                                    createCard('engagement-section-ssa', card.id, card.customer, card.lastUpdated, card.situation);
                                } else if (card.project_state == 'onboard') {
                                    onboardCountSSA++;
                                    createCard('onboard-section-ssa', card.id, card.customer, card.lastUpdated, card.situation);
                                } else {
                                    steadyCountSSA++;
                                    createCard('steady-section-ssa', card.id, card.customer, card.lastUpdated, card.situation);
                                }
                            } else if (card.market == 'Mexico') {
                                if (card.project_state == 'engagement') {
                                    engagementCountMX++;
                                    createCard('engagement-section-mexico', card.id, card.customer, card.lastUpdated, card.situation);

                                } else if (card.project_state == 'onboard') {
                                    onboardCountMX++;
                                    createCard('onboard-section-mexico', card.id, card.customer, card.lastUpdated, card.situation);

                                } else {
                                    steadyCountMX++;
                                    createCard('steady-section-mexico', card.id, card.customer, card.lastUpdated, card.situation);
                                }
                            }
                            if (card.project_state == 'engagement') {
                                engagementCountGlobal++;
                                createCard('engagement-section-global', card.id, card.customer, card.lastUpdated, card.situation);

                            } else if (card.project_state == 'onboard') {
                                onboardCountGlobal++;
                                createCard('onboard-section-global', card.id, card.customer, card.lastUpdated, card.situation);

                            } else {
                                steadyCountGlobal++;
                                createCard('steady-section-global', card.id, card.customer, card.lastUpdated, card.situation);
                            }
                        } else {
                            var numberOfUpdates = card.history.length - 1;
                            if (card.market == 'Brazil') {
                                engagementCountBR++;
                                steadyCountBR++;
                                onboardCountBR++;
                                if (card.project_state == 'engagement') {
                                    engagementCountBR++;
                                    createCardHistory('engagement-section-brazil', card.id, card.customer, card.lastUpdated, card.history[numberOfUpdates].lastUpdated, card.situation, card.history[numberOfUpdates].situation);

                                } else if (card.project_state == 'onboard') {
                                    onboardCountBR++;
                                    createCardHistory('onboard-section-brazil', card.id, card.customer, card.lastUpdated, card.history[numberOfUpdates].lastUpdated, card.situation, card.history[numberOfUpdates].situation);
                                } else {
                                    steadyCountBR++;
                                    createCardHistory('steady-section-brazil', card.id, card.customer, card.lastUpdated, card.history[numberOfUpdates].lastUpdated, card.situation, card.history[numberOfUpdates].situation);
                                }
                            } else if (card.market == 'SSA') {


                                if (card.project_state == 'engagement') {

                                    engagementCountSSA++;
                                    createCardHistory('engagement-section-ssa', card.id, card.customer, card.lastUpdated, card.history[numberOfUpdates].lastUpdated, card.situation, card.history[numberOfUpdates].situation);

                                } else if (card.project_state == 'onboard') {

                                    createCardHistory('onboard-section-ssa', card.id, card.customer, card.lastUpdated, card.history[numberOfUpdates].lastUpdated, card.situation, card.history[numberOfUpdates].situation);

                                    onboardCountSSA++;

                                } else {
                                    steadyCountSSA++;
                                    createCardHistory('steady-section-ssa', card.id, card.customer, card.lastUpdated, card.history[numberOfUpdates].lastUpdated, card.situation, card.history[numberOfUpdates].situation);

                                }


                            } else if (card.market == 'Mexico') {

                                if (card.project_state == 'engagement') {
                                    engagementCountMX++;
                                    createCardHistory('engagement-section-mexico', card.id, card.customer, card.lastUpdated, card.history[numberOfUpdates].lastUpdated, card.situation, card.history[numberOfUpdates].situation);


                                } else if (card.project_state == 'onboard') {
                                    onboardCountMX++;
                                    createCardHistory('onboard-section-mexico', card.id, card.customer, card.lastUpdated, card.history[numberOfUpdates].lastUpdated, card.situation, card.history[numberOfUpdates].situation);


                                } else {
                                    steadyCountMX++;
                                    createCardHistory('steady-section-mexico', card.id, card.customer, card.lastUpdated, card.history[numberOfUpdates].lastUpdated, card.situation, card.history[numberOfUpdates].situation);
                                }


                            }
                            if (card.project_state == 'engagement') {
                                engagementCountGlobal++;
                                createCardHistory('engagement-section-global', card.id, card.customer, card.lastUpdated, card.history[numberOfUpdates].lastUpdated, card.situation, card.history[numberOfUpdates].situation);

                            } else if (card.project_state == 'onboard') {
                                onboardCountGlobal++;
                                createCardHistory('onboard-section-global', card.id, card.customer, card.lastUpdated, card.history[numberOfUpdates].lastUpdated, card.situation, card.history[numberOfUpdates].situation);

                            } else {
                                steadyCountGlobal++;
                                createCardHistory('steady-section-global', card.id, card.customer, card.lastUpdated, card.history[numberOfUpdates].lastUpdated, card.situation, card.history[numberOfUpdates].situation);
                            }

                        }
                    } else {

                        var numberOfUpdates = card.history.length - 1;
                        createCard('engagement-section-closed', card.id, card.customer, card.history[numberOfUpdates].lastUpdated, card.history[numberOfUpdates].situation);
                        createCard('onboard-section-closed', card.id, card.customer, card.history[numberOfUpdates].lastUpdated, card.history[numberOfUpdates].situation);
                        createCard('steady-section-closed', card.id, card.customer, card.history[numberOfUpdates].lastUpdated, card.history[numberOfUpdates].situation);
                    }
                }
                 $('.tooltipped').tooltip({delay: 50});

                updateBadges(steadyCountBR, onboardCountBR, engagementCountBR, "brazil");
                updateBadges(steadyCountSSA, onboardCountSSA, engagementCountSSA, "ssa");
                updateBadges(steadyCountMX, onboardCountMX, engagementCountMX, "mexico");
                updateBadges(steadyCountGlobal, onboardCountGlobal, engagementCountGlobal, "global");

            }, function (err) {
                createErrorCard('engagement-section-global');
                createErrorCard('onboard-section-global');
                createErrorCard('steady-section-global');
            });

        } else {
            //
            alert(JSON.stringify(result));
            alert("Entrou no else");
            console.log("xhr 401");
            window.location.replace('usernotautorized');

        }


    });


    
});




function updateBadges(steadyCountGlobal, onboardCountGlobal, engagementCountGlobal, section) {
    document.getElementById('sizeof-steady-' + section).innerHTML = steadyCountGlobal;
    document.getElementById('sizeof-onboard-' + section).innerHTML = onboardCountGlobal;
    document.getElementById('sizeof-engagement-' + section).innerHTML = engagementCountGlobal;

}


function createCard(elementId, cardID ,cardName, lastUpdated, situation) {

    var card = '<a href="/onboardprojectinfo?id=' + cardID + '"><div class="col s3"><div class="card">' +
        '<div class="card-content white-text">' +
        '<img src="https://res.cloudinary.com/dacg0wegv/image/upload/t_media_lib_thumb/v1463989969/squares_dylwo9.png" class="responsive-img"/>' +
        '<br><span class="indigo-text text-lighten-1"><h5 class="custom_title">' + cardName + '</h5></span></div><div class="card-action">' +
        '<span class="card-title" style="text-align: center !important; font-size: 16pt !important;">' +
        '<b style="font-size: 11px;">Current: ' + lastUpdated + ' GMT <span class="circle ' + situation + '"></span></b></br>' +
        '<b style="font-size: 11px;">Previous: This project never got an update.' +
        '<span class="circle"></span></b>' +
        '</span></div></div></div></a>';

    document.getElementById(elementId).innerHTML += card;

    console.log(card);

}


function createCardHistory(elementId,cardID, cardName, lastUpdated, lastUpdatedHistory, situation, situationHistory) {
//  <!-- data-delay controls delay before tooltip shows (in milliseconds)-->
//  <a class="btn tooltipped" data-position="bottom" data-delay="50" data-tooltip="I am a tooltip">Hover me!</a>
     
    var card = '<a href="/onboardprojectinfo?id=' + cardID + '" ><div class="col s3"><div class="card">' +
        '<div class="card-content white-text" id="card_content_'+cardName+'" >' +
        '<img src="https://res.cloudinary.com/dacg0wegv/image/upload/t_media_lib_thumb/v1463989969/squares_dylwo9.png" class="responsive-img"/>' +
        '<br><span class="indigo-text text-lighten-1"><h5 class="custom_title " id="custom_title_'+cardName+'">' + cardName + '</h5></span></div><div class="card-action">' +
        '<span class="card-title" style="text-align: center !important; font-size: 16pt !important;">' +
        '<b style="font-size: 11px;">Current:' + lastUpdated + ' GMT <span class="circle ' + situation + '"></span></b> </br>' +
        '<b style="font-size: 11px;">Previous Update: ' + lastUpdatedHistory +
        ' GMT<span class="circle ' + situationHistory + '"></span></b></span></div></div></div></a>';

    document.getElementById(elementId).innerHTML += card;
    
   


}


function createErrorCard(elementId) {
    var card = '<div class="col s4 offset s4"><div class="card">' +
        '<div class="card-content white-text">' +
        '<br><span class="indigo-text text-lighten-1"><h5>Tente novamente mais tarde.</h5></span></div></div></div>';

    document.getElementById(elementId).innerHTML += card;
}


function getCurrentTab() {
    var active = $('ul.tabs .active').attr('href');
    // $('.tabs-content ' + active).show();
    return active;
}

function applyFilter(currentTab, option) {
    console.log('Na tab: ' + currentTab);

}

function validateUser() {
    var obj = (getSession('userInfo'));

    document.getElementById('emailUser').innerHTML = "&nbsp; User: &nbsp;" + obj.emailaddress;
//    document.getElementById('nameUser').innerHTML = "&nbsp; Usuario: &nbsp; &nbsp;" + obj.cn;
}
