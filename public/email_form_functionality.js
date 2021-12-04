$(document).ready(function() {
    $("#submit_button").click(function() {

        let email_data = {
            full_name: $("#full_name").val(),
            phone_number: $("#phone_number").val(),
            email: $("#email").val(),
            subject: $("#subject").val(),
            text: $("#textarea").val()
        }
        

        $.ajax({
            url: '/email_form',
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                alert(data.message);
            },
            data: JSON.stringify(email_data)
        });
    });
});


$(document).ready(function() {
    $("#login_button").click(function() {

        let login_data = {
            email: $("#email").val(),
            password: $("#password").val()
        }
        
        console.log(login_data.email);
        console.log(login_data.password);

        $.ajax({
            url: '/login',
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                if(data.success == -1){
                    $("#error_text").text(data.message);
                    $(".error_field").css("visibility", "visible"); 
                } else {
                    window.location = `http://localhost:3000/${data.message}`;
                }
                
            },
            data: JSON.stringify(login_data)
        });
    });
});