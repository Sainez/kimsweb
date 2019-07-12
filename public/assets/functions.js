$(document).ready(function(){



//---------- On Load Function ----------------

//------ Navigation-------------
    $('#about_form').show();
    $('#about a').css("color", "#e8491d").css("font-weight", "bolder");
    $('#career_form').hide();
    $('#contact_form').hide();






//---------- About ----------------

$('#about').on('click', function () {

        $('#career_form').slideUp(function(){

            $('#contact_form').slideUp(function(){

                $('#about_form').slideDown(1000);
                $('#about a').css("color","#e8491d").css("font-weight", "bolder");
                $('#career a').css("color","rgb(44, 156, 221)").css("font-weight", "100");
                $('#contact a').css("color","rgb(44, 156, 221)").css("font-weight", "100");

            });

        });

});

//---------- Career ----------------

$('#career').on('click', function () {

    $('#about_form').slideUp(function(){

        $('#contact_form').slideUp(function(){

            $('#career_form').slideDown(1000);
            $('#about a').css("color","rgb(44, 156, 221)").css("font-weight", "100");
            $('#career a').css("color","#e8491d").css("font-weight", "bolder");
            $('#contact a').css("color","rgb(44, 156, 221)").css("font-weight", "100");

        });

    });

});


//---------- Contact ----------------

$('#contact').on('click', function () {

    $('#about_form').slideUp(function(){

        $('#career_form').slideUp(function(){

            $('#contact_form').slideDown(1000);
            $('#about a').css("color","rgb(44, 156, 221)").css("font-weight", "100");
            $('#career a').css("color","rgb(44, 156, 221)").css("font-weight", "100");
            $('#contact a').css("color","#e8491d").css("font-weight", "bolder");

        });

    });

});

//-------- Login -------------
$('#logcli_form').show();
$('#logadmin_form').hide();


//--- On Clinician Click ----
$('#a1').on('click', function(){

    $('#logcli_form').show();
    $('#logadmin_form').hide();

});

//--- On Clinician Click ----
$('#a2').on('click', function(){

    $('#logcli_form').hide();
    $('#logadmin_form').show();


});

//============ Registration =======================

$('#reg_cli_form').show();
$('#reg1').css("color", "#e8491d").css("font-weight", "bolder");
$('#reg_adm_form').hide();


$('#reg1').on('click', function(){

    $('#reg_adm_form').slideUp(function(){

        $('#reg_cli_form').slideDown(1000);
        $('#reg1').css("color", "#e8491d").css("font-weight", "bolder");
        $('#reg2').css("color","rgb(44, 156, 221)").css("font-weight", "100");


    });



});



$('#reg2').on('click', function(){

    $('#reg_cli_form').slideUp(function(){

        $('#reg_adm_form').slideDown(1000);
        $('#reg2').css("color", "#e8491d").css("font-weight", "bolder");
        $('#reg1').css("color","rgb(44, 156, 221)").css("font-weight", "100");

    });



});






//--------------------------------------------

});
