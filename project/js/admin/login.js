
    

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
            alert("error-api/manager-check_UID01-api.php");
          }
        });
      }

      // 登出按鈕監聽 #loginoutButton
      $("#loginoutButton").click(function () {
        setCookie("UID01", "", 7);
        location.href = "manager-login.html";
      });
    });
    function showdata_Check_UID(data) {
      console.log(data);
      if (data.state) {
        // 顯示登出按鈕
        $("#user_message").text("登入中！");
      }
    }


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