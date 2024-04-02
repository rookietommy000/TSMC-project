
$('#addModal').on('click', function () {
    $('#loginModal').modal('hide'); 
    $('#registerModal').modal('show');
});
fetch('footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer').innerHTML = data;
    })
    .catch(error => {
        console.error('Error fetching footer:', error);
    });
// 監聽確認
var flag_username = false;
var flag_password = false;
var flag_re_password = false;
var flag_email = false;
var flag_chk01 = false;

// 即時監聽 #username
$("#username").bind("input propertychange", function () {
    // console.log($(this).val().length); is-invalid
    if ($(this).val().length > 3 && $(this).val().length < 8) {
        //符合規定，傳遞參數到後端檢查帳號是否有存在
        var dataJSON = {};
        dataJSON["Username"] = $("#username").val();
        console.log(JSON.stringify(dataJSON));

        $.ajax({
            type: "POST",
            url: "api/member_check-api.php",
            data: JSON.stringify(dataJSON),
            dataType: "json",
            success: showdata_username,
            error: function () {
                alert("error-api/member_check-api.php");
            }
        });

        // $(this).removeClass('is-invalid');
        // $(this).addClass('is-valid');
        // flag_username = true;
    } else {
        //不符合規定
        $(this).removeClass('is-valid');
        $(this).addClass('is-invalid');
        flag_username = false;
    }
});

// 即時監聽 #password
$("#password").bind("input propertychange", function () {
    // console.log($(this).val().length); is-invalid
    if ($(this).val().length > 5 && $(this).val().length < 10) {
        //符合規定
        $(this).removeClass('is-invalid');
        $(this).addClass('is-valid');
        flag_password = true;
    } else {
        //不符合規定
        $(this).removeClass('is-valid');
        $(this).addClass('is-invalid');
        flag_password = false;
    }
});
// 即時監聽 #re_password
$("#re_password").bind("input propertychange", function () {
    if ($(this).val() == $("#password").val()) {
        //符合規定
        $(this).removeClass('is-invalid');
        $(this).addClass('is-valid');
        flag_re_password = true;
    } else {
        //不符合規定
        $(this).removeClass('is-valid');
        $(this).addClass('is-invalid');
        flag_re_password = false;
    }
});

// 即時監聽 #email
$("#email").bind("input propertychange", function () {
    // console.log($(this).val().length); is-invalid
    if ($(this).val().length > 6 && $(this).val().length < 20) {
        //符合規定
        $(this).removeClass('is-invalid');
        $(this).addClass('is-valid');
        flag_email = true;
    } else {
        //不符合規定
        $(this).removeClass('is-valid');
        $(this).addClass('is-invalid');
        flag_email = false;
    }
});

// 監聽 checkbox #chk01
$("#chk01").change(function () {
    if ($(this).is(":checked")) {
        //console.log("遵守");
        flag_chk01 = true;
    } else {
        //console.log("不遵守");  
        flag_chk01 = false;
    }
});
// 註冊按鈕監聽 #reg_btn
$("#reg_btn").click(function () {
    // console.log("test");

    if (flag_username && flag_password && flag_re_password && flag_email && flag_chk01) {
        //{"Username":"XX", "Password":"XXX", "Email":"XXXXX"}
        var dataJSON = {};
        dataJSON["Username"] = $("#username").val();
        dataJSON["Password"] = $("#password").val();
        dataJSON["Email"] = $("#email").val();

        // 傳遞至後端執行註冊行為
        $.ajax({
            type: "POST",
            url: "api/member_create-api.php",
            data: JSON.stringify(dataJSON),
            dataType: "json",
            success: showdata_reg,
            error: function () {
                alert("error-api/member_create-api.php")
            }
        });

    } else {
        alert("欄位有錯請修正!");
    }
});

function showdata_reg(data) {
    console.log(data);
    if (data.state) {
        Swal.fire({
            position: "center-center",
            icon: "success",
            title: "(data.message)",
            showConfirmButton: false,
            timer: 1500
        });
        
    } else {
        alert(data.message);
    }
}





function showdata_username(data) {
    console.log(data);
    if (data.state) {
        //帳號不存在, 可以使用!
        $("#username").removeClass('is-invalid');
        $("#username").addClass('is-valid');
        flag_username = true;
        // 顯示帳號符合規則的訊息
        $("#username + .valid-feedback").text("帳號不存在，可以使用").show();

        // 隱藏帳號不符合規則的訊息
        $("#username + .invalid-feedback").hide();
    } else {
        //帳號存在, 不可以使用!
        $("#username").removeClass('is-valid');
        $("#username").addClass('is-invalid');
        flag_username = false;

        $("#username + .invalid-feedback").text("帳號存在，不可以使用!").show();

        // 隱藏帳號符合規則的訊息
        $("#username + valid-feedback").hide();
    }
}
$(function () {
    // 判斷是否登入
    if (getCookie("UID01") != "") {
        // UID01存在，傳遞至後端api，判斷是否合法
        var dataJSON = {};
        dataJSON["UID01"] = getCookie("UID01");
        console.log(JSON.stringify(dataJSON));
        $.ajax({
            type: "POST",
            url: "api/member-check_UID01-api.php",
            data: JSON.stringify(dataJSON),
            dataType: "json",
            success: showdata_Check_UID,
            error: function () {
                alert("error-member-Check_UID-api.php");
            }
        });
    }

    // 登出按鈕監聽 #loginoutButton
    $("#loginoutButton").click(function () {
        setCookie("UID01", "", 7);
        location.reload();
    });

    // 登入按鈕監聽 #login_btn
    $("#login_btn").click(function () {
        console.log($("#login_username").val() + $("#login_password").val());
        // {"Username":"XX", "Password":"XXX"}
        var dataJSON = {};
        dataJSON["Username"] = $("#login_username").val();
        dataJSON["Password"] = $("#login_password").val();
        console.log(JSON.stringify(dataJSON));

        // 傳遞至後端執行登入行為
        $.ajax({
            type: "POST",
            url: "api/member_login-api.php",
            data: JSON.stringify(dataJSON),
            dataType: "json",
            success: showdata_login,
            error: function () {
                alert("api/member_login-api.php");
            }
        });
    });
});

// w3s存入cookie
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

//w3s
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function showdata_login(data) {
    console.log(data);
    if (data.state) {
        Swal.fire(data.message);
        // console.log(data.data[0].UID01);
        var uid01 = data.data[0].UID01;
        // 將UID01放入cookie
        setCookie("UID01", uid01, 7);
        $("#loginModal").modal("hide");
        $("#user_message").text(data.data[0].Username + "登入中！").addClass("text-light");

        // 隱藏註冊按鈕和登入按鈕
        $("#loginButton").hide();
        $("#registerButton").hide();
        $("#member_btn").removeClass("disabled");

        // 顯示高級功能
        $("#s02_member_btn02").removeClass("disabled");
        $("#s02_member_btn03").removeClass("disabled");

        // 顯示登出按鈕
        $("#loginoutButton").removeClass("d-none");

        // 顯示s04
        $("#s04").removeClass("d-none")
    } else {
        Swal.fire(data.message);
    }
}


function showdata_Check_UID(data) {
    console.log(data);
    if (data.state) {
        //驗證成功
        $("#user_message").text(data.data[0].Username + "登入中!").addClass("text-light");
        $("#loginButton").hide();
        $("#registerButton").hide();
        $("#member_btn").removeClass("disabled");

        // // 顯示高級功能
        
        // $("#s02_member_btn02").removeClass("disabled");
        // $("#s02_member_btn03").removeClass("disabled");

        // 顯示登出按鈕
        $("#loginoutButton").removeClass("d-none");

        // 顯示s04
        $("#s04").removeClass("d-none")
    }
}


