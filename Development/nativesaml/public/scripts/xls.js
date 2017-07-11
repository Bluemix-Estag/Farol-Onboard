var oFileIn;

$(function () {
    oFileIn = document.getElementById('my_file_input');
    if (oFileIn.addEventListener) {
        oFileIn.addEventListener('change', filePicked, false);
    }
});


function filePicked(oEvent) {
    // Get The File From The Input
    var oFile = oEvent.target.files[0];
    var sFilename = oFile.name;
    // Create A File Reader HTML5
    var reader = new FileReader();

    // Ready The Event For When A File Gets Selected
    reader.onload = function (e) {
        var data = e.target.result;
        var count = 0;
        var cfb = XLS.CFB.read(data, {
            type: 'binary'
        });
        var wb = XLS.parse_xlscfb(cfb);
        // Loop Over Each Sheet
        wb.SheetNames.forEach(function (sheetName) {
            // Obtain The Current Row As CSV
            var sCSV = XLS.utils.make_csv(wb.Sheets[sheetName]);
            var data = XLS.utils.sheet_to_json(wb.Sheets[sheetName], {
                header: 1
            });
            $.each(data, function (indexR, valueR) {
                var sRow = "<tr name = cdd"+count+">";
                $.each(data[indexR], function (indexC, valueC) {
                    if (indexC == 0 || indexR == 0) {
                        sRow = sRow + "<td class=' blue lighten-2' id='tablegr'>" + valueC + "</td><input type='hidden'name='cdd"+count+"' value='"+valueC+"'/>";
                    } else if (indexR == 10 || indexC == 0 && indexR == 10) {
                        sRow = sRow + "<td id='tablegr' class=' light-green accent-4'>" + valueC + "</td><input type='hidden'name='cdd"+count+"' value='"+valueC+"'/>";

                    } else {
                        sRow = sRow + "<td id='tablegr'>" + valueC + "</td><input type='hidden'name='cdd"+count+"' value='"+valueC+"'/>";

                    }
                });
                sRow = sRow + "</tr>";
                $("#my_file_output").append(sRow);
                count++;
            });
        });
    };

    // Tell JS To Start Reading The File.. You could delay this if desired
    reader.readAsBinaryString(oFile);
}
