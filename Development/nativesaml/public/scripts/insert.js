function createName() {

    var name = '<div class="row">' +
        '<div class="input-field inline col s2">' +
        '<select name="state" class="browser-default" required>' +
        '<option value="" disabled selected>Choose Project Role</option>' +
        '<option value="Seller">Seller</option>' +
        '<option value="TechSeller">TechSeller</option>' +
        '<option value="CloudPM">Cloud PM</option>' +
        '<option value="LocalPM">Local PM</option>' +
        '<option value="CloudDPE">Cloud DPE</option>' +
        '<option value="LocalDPE">Local DPE</option>' +
        '<option value="Customer">Customer</option>' +
        '</select></div>' +
        '<div class="input-field inline col s3">' +
        '<input name="name" id="name" type="text" class="validate" value="none" required>' +
        '<label for="name">Name</label></div>' +
        '<div class="input-field inline  col s3">' +
        '<input name="email" id="email" type="text" class="validate" value="none" required>' +
        '<label for="email">Email</label></div>' +
        '<div class="input-field inline col s2">' +
        '<input name="idnotes" id="idnotes" type="text" class="validate" value="none" required>' +
        '<label for="idnotes">ID Notes</label></div>' +
        '<div class="input-field inline col s2">' +
        '<input name="phone" id="phone" type="text" class="validate" value="none" required>' +
        '<label for="phone">Phone</label></div></div>';

    $('#names-tab').append(name);
}



function refreshSelect() {
    Materialize.updateTextFields()
}
