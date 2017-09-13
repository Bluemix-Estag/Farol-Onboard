/**
 * Module dependencies.
 */

var hostname = "http://localhost:3000";

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var fs = require('fs');

var saml2 = require('saml2-js');
var Saml2js = require('saml2js');
var cfenv = require('cfenv');
var cookieParser = require('cookie-parser');

var app = express();
var db;
var cloudant;
var fileToUpload;
var dbCredentials = {
    url: 'https://7a3452e3-0a87-4f2a-816a-10e4f5fdc3bc-bluemix:9325e5d50d8e8ff192aa123357dd6f574402fb193eb5ac093d2fa50a5ed5045f@7a3452e3-0a87-4f2a-816a-10e4f5fdc3bc-bluemix.cloudant.com'
};
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var multipart = require('connect-multiparty')
var multipartMiddleware = multipart();
var session = require('express-session')
var request = require('request');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use('/style', express.static(path.join(__dirname, 'views/style')));
app.use(cookieParser());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'secret'
}));

var sess;

// Create service provider
var sp_options = {
    entity_id: "https://farolonboard.mybluemix.net:443/metadata.xml",
    private_key: fs.readFileSync("cert/key.pem").toString(),
    certificate: fs.readFileSync("cert/cert.pem").toString(),
    assert_endpoint: "https://farolonboard.mybluemix.net/assert"
};
var sp = new saml2.ServiceProvider(sp_options);

//

var idp_options = {
    sso_login_url: " https://w3id.alpha.sso.ibm.com/auth/sps/samlidp/saml20/logininitial?RequestBinding=HTTPPost&PartnerId=https://farolonboard.mybluemix.net:443/metadata.xml&NameIdFormat=email&Target=http://farolonboard.mybluemix.net",


    certificates: fs.readFileSync("cert/w3id.sso.ibm.com").toString()
};
var idp = new saml2.IdentityProvider(idp_options);

// ------ Define express endpoints ------
// Endpoint to retrieve metadata
app.get("/metadata.xml", function (req, res) {
    res.type('application/xml');
    res.send(sp.create_metadata());
});

// Starting point for login
app.get("/login", function (req, res) {
    //console.log(idp);
    sp.create_login_request_url(idp, {}, function (err, login_url, request_id) {
        if (err != null)
            return res.send(500);
        console.log(login_url);
        res.redirect(login_url);
    });
});

// Assert endpoint for when login completes
app.post("/assert", function (req, res) {
    sess = req.session;
    var options = {
        request_body: req
    };
    console.log("Options: " + options);
    var response = new Buffer(req.body.SAMLResponse || req.body.SAMLRequest, 'base64');
    console.log(response);
    var parser = new Saml2js(response);

    //return res.json(parser.toObject());
    sess.users = parser.toObject();
    console.log("Session" + sess);
    res.render('home.html', {
        user: parser.toObject(),
        projects: null
    });

});

app.get('/codebakeryuser', function (req, res) {
    sess = req.session;

    var data = {
        url: hostname + "/api/user?w3id=rafamos@br.ibm.com&env=codebakery",
        headers: {
            Accept: 'text/json'
        }
    };

    request(data, function (error, response, body) {
        res.render('codebakeryuserpanel.html', {
            projects: JSON.parse(body),
            user: sess.users
        });
    });
})

app.get('/onboarduserp', function (req, res) {
    res.redirect('/getprojects')
})


app.post("/confirminsert", function (req, res) {
    var formIn = req.body;
    formIn.w3id_owner = 'carfer@br.ibm.com';

    var headers = {
        'url': dbCredentials.url,
        'Content-Type': 'application/json'
    }
    var names = {
        'seller': {
            'name': formIn.name[0],
            'email': formIn.email[0],
            'idnotes': formIn.idnotes[0],
            'phone': formIn.phone[0]
        },
        'techseller': {
            'name': formIn.name[1],
            'email': formIn.email[1],
            'idnotes': formIn.idnotes[1],
            'phone': formIn.phone[1]
        },
        'cloudpm': {
            'name': formIn.name[2],
            'email': formIn.email[2],
            'idnotes': formIn.idnotes[2],
            'phone': formIn.phone[2]
        },
        'localpm': {
            'name': formIn.name[3],
            'email': formIn.email[3],
            'idnotes': formIn.idnotes[3],
            'phone': formIn.phone[3]
        },
        'cloudpe': {
            'name': formIn.name[4],
            'email': formIn.email[4],
            'idnotes': formIn.idnotes[4],
            'phone': formIn.phone[4]
        },
        'customer': {
            'name': formIn.name[5],
            'email': formIn.email[5],
            'idnotes': formIn.idnotes[5],
            'phone': formIn.phone[5]
        }
    }

    formIn.names = names;

    delete formIn.name;
    delete formIn.email
    delete formIn.idnotes;
    delete formIn.phone;

    var updateDate = new Date().toISOString().replace(/T/, ' '). // replace T with a space
    replace(/\..+/, '') // delete the dot and everything after;

    formIn.lastUpdated = updateDate;
    var options = {
        url: 'http://manageio.mybluemix.net/api/project/onboarding/create',
        method: 'POST',
        headers: headers,
        form: formIn
    }

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            setTimeout(function () {
                res.redirect('/getprojects');
            }, 4000);
        } else {
            console.log('erro no request');
            res.status(500).send('Error in INSERT. Please try again with another UNIQUE ID or try it later');
            
         }

    })

});

app.post("/confirmupdate", function (req, res) {
    var formIn = req.body;
    formIn.w3id_owner = 'carfer@br.ibm.com';

    var headers = {
        'url': dbCredentials.url,
        'Content-Type': 'application/json'
    }
    var names = {
        'seller': {
            'name': formIn.name[0],
            'email': formIn.email[0],
            'idnotes': formIn.idnotes[0],
            'phone': formIn.phone[0]
        },
        'techseller': {
            'name': formIn.name[1],
            'email': formIn.email[1],
            'idnotes': formIn.idnotes[1],
            'phone': formIn.phone[1]
        },
        'cloudpm': {
            'name': formIn.name[2],
            'email': formIn.email[2],
            'idnotes': formIn.idnotes[2],
            'phone': formIn.phone[2]
        },
        'localpm': {
            'name': formIn.name[3],
            'email': formIn.email[3],
            'idnotes': formIn.idnotes[3],
            'phone': formIn.phone[3]
        },
        'cloudpe': {
            'name': formIn.name[4],
            'email': formIn.email[4],
            'idnotes': formIn.idnotes[4],
            'phone': formIn.phone[4]
        },
        'customer': {
            'name': formIn.name[5],
            'email': formIn.email[5],
            'idnotes': formIn.idnotes[5],
            'phone': formIn.phone[5]
        }
    }

    formIn.names = names;

    delete formIn.name;
    delete formIn.email
    delete formIn.idnotes;
    delete formIn.phone;



    var updateDate = new Date().toISOString().replace(/T/, ' '). // replace T with a space
    replace(/\..+/, '') // delete the dot and everything after;

    formIn.lastUpdated = updateDate;

    var options = {
        url: 'http://manageio.mybluemix.net/api/project/onboarding/' + formIn.id + '/update',
        method: 'POST',
        headers: headers,
        form: formIn
    }

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);

            setTimeout(function () {
                res.redirect('/getprojects');
            }, 4000);
        } else {
            console.log('erro no request');
            console.log(body);
        }

    })

});


app.get("/getprojects", function (req, res) {

    var headers = {
        'url': dbCredentials.url,
        'Content-Type': 'application/json'
    }
    var options = {
        url: 'http://manageio.mybluemix.net/api/project/onboarding/all',
        method: 'GET',
        headers: headers
    }

    request(options, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            console.log(body);
            res.render('onboarduserpanel.html', {
                projects: JSON.parse(body)
            });

        } else {
            console.log('error no request get projects');
        }
    })


});

app.get("/getprojectbyid", function (req, res) {

    var id = req.query.id;

    var headers = {
        'url': dbCredentials.url,
        'Content-Type': 'application/json'
    }

    var options = {
        url: 'http://manageio.mybluemix.net/api/project/onboarding?id=' + id,
        method: 'GET',
        headers: headers
    }

    request(options, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            console.log(JSON.parse(body));

            res.render('onboardprojectinfo.html', {
                project: JSON.parse(body)
            });
        }
    })

});

app.get("/getclosedproject", function (req, res) {

    var id = req.query.id;

    var headers = {
        'url': dbCredentials.url,
        'Content-Type': 'application/json'
    }

    var options = {
        url: 'http://manageio.mybluemix.net/api/project/onboarding?id=' + id,
        method: 'GET',
        headers: headers
    }

    request(options, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            console.log(JSON.parse(body));

            res.render('closedprojectInfo.html', {
                project: JSON.parse(body)
            });
        }
    })

});

app.get("/editproject", function (req, res) {

    var id = req.query.id;

    var headers = {
        'url': dbCredentials.url,
        'Content-Type': 'application/json'
    }

    var options = {
        url: 'http://manageio.mybluemix.net/api/project/onboarding?id=' + id,
        method: 'GET',
        headers: headers
    }

    request(options, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            res.render('editprojectpage.html', {
                project: JSON.parse(body)
            });
        }
    })

});

app.get("/getprojectusers", function (req, res) {
    var projectname = req.query.query;

    var headers = {
        'url': dbCredentials.url,
        'Content-Type': 'application/json'
    }

    var options = {
        url: 'http://manageio.mybluemix.net/api/project/onboarding/' + projectname + '/users',
        method: 'GET',
        headers: headers
    }

    request(options, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            console.log(body);
        }
    })

});


app.post("/deleteproject", function (req, res) {
    var projectid = req.query.id;

    var admin = {
        "w3id": "carfer@br.ibm.com"
    }

    var headers = {
        'url': dbCredentials.url,
        'Content-Type': 'application/json'
    }

    var options = {
        url: 'http://manageio.mybluemix.net/api/project/onboarding/' + projectid + "/delete",
        method: 'POST',
        headers: headers,
        form: admin
    }
    request(options, function (error, response, body) {

        if (!error && response.statusCode == 200) {

            setTimeout(function () {
                res.redirect('/getprojects');
            }, 2000)
        } else {
            console.log(options);
            console.log("erro na hora do request delete");
        }
    })

});
app.post("/closeproject", function (req, res) {
    var projectid = req.query.id;
    var formIn = req.body;

    var headers = {
        'url': dbCredentials.url,
        'Content-Type': 'application/json'
    }
    
    var updateDate = new Date().toISOString().replace(/T/, ' '). // replace T with a space
    replace(/\..+/, '') // delete the dot and everything after;

    formIn.lastUpdated = updateDate;
    
    var options = {
        url: 'http://manageio.mybluemix.net/api/project/onboarding/' + projectid + '/update',
        method: 'POST',
        headers: headers,
        form: {
            "isClosed": 'true',
            "dateClosed" : updateDate,
            "whoClose" : formIn.closedBy,
            "rev": formIn.rev,
            "id": projectid
        }
    }
    
    request(options, function (error, response, body) {

        if (!error && response.statusCode == 200) {

            setTimeout(function () {
                res.redirect('/getprojects');
            }, 2000)
        } else {
            console.log(options);
            console.log("erro na hora do request delete");
        }
    })

});

app.get('/assert', function (req, res) {
    res.render('codebakery.html');
})

app.get('/insert', function (req, res) {
    var showID = 1;
    sess = req.session;
    console.log(sess.users);
    console.log("Show ID: " + showID);
    res.render('insertform.html', {
        user: sess.users,
        showid: showID

    });
})


app.get('/', function (req, res) {
    res.render('index.html');
})

app.get('/hoome', function (req, res) {

    var userS = {

            "cn": "Carlos",
            "emailaddress": "carlos@gm"

    }
    res.render('home.html', {
        user: userS
    });
})

app.post('/getxls', function (req, res) {
    var body = req.body;
    console.log(JSON.stringify(body));
    request(data, function (error, response, body) {
        res.redirect('/onboarduserp');
    });
});



http.createServer(app).listen(app.get('port'), '0.0.0.0', function () {
    console.log('Express server listening on port ' + app.get('port'));
});
