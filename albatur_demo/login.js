function login() {
    var email = $('#email_login').val();
    var pass = $('#pass_login').val();
    var data = {
        'email': email,
        'pass': pass
    }



    $.getData(
        'POST',
        'Person/login',
        data,
        function (response) {

            localStorage.setItem("token", response.data.token);           
            

            Swal.fire("Yönlendiriliyorsunuz", "Giriş Başarılı Yönlendiriliyorsunuz ", "success");

            window.location = "index";
            console.log(response.data.token);
        }

        //Deneme

    );
}
$('#pass_login').keypress(function (e) {
    var key = e.which;
    if (key == 13) {


        login();
        return false;
    }
});
$('#email_login').keypress(function (e) {
    var key = e.which;
    if (key == 13) {


        login();
        return false;
    }
});