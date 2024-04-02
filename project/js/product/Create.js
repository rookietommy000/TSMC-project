
    var mapProductType = new Map();
    var num01 = 1; //記錄數量
    var flag_pname = false;
    var flag_content = false;
    var flag_pprice = true; //已有價格初始值
    var flag_type = false;
    var flag_upload = false;
    var switch01 = "未上架";
    var imgName = "";
    var dataJSON = {};

    $(function () {
      // 取得資料
      getProductType();
    });

    function getProductType() {
      $.ajax({
        type: "GET",
        url: "api/product-type/product-type_read-api.php",
        dataType: "json",
        async: false,
        success: showData_productType,
        error: function () {
          alert("error: b_productType_read_api.php");
        }
      });
    }

    function showData_productType(data) {
      if (data.state) {
        data.data.forEach(function (item) {
          mapProductType.set(item["ID"], item["Name"]);
          var html = '<option value="' + item["ID"] + '">' + item["Name"] + '</option>'
          $("#addType").append(html);
        });
      } else {
        alert(data.message);
      }
    }

    //監聽_即時監聽 #pname
    $("#pname").bind("input propertychange", function () {
      console.log($(this).val().length);
      if ($(this).val().length > 0 && $(this).val().length < 15) {
        //字數符合規定
        $(this).removeClass("is-invalid");
        $(this).addClass("is-valid");
        flag_pname = true;
      } else {
        //字數不符合規定
        $(this).removeClass("is-valid");
        $(this).addClass("is-invalid");
        flag_pname = false;
      }
    });

    //監聽_即時監聽 #price
    $("#pprice").bind("input propertychange", function () {
      console.log($(this).val());
      if ($(this).val() > 0 && $(this).val() < 100000) {
        // 價格符合規定
        $(this).removeClass("is-invalid");
        $(this).addClass("is-valid");
        flag_price = true;
      } else {
        // 價格不符合規定
        $(this).removeClass("is-valid");
        $(this).addClass("is-invalid");
        flag_pprice = false;
      }
    });

    //監聽_即時監聽 #type
    $(document).on('change', '#addType', function () {
      console.log($(this).val());
      if ($(this).val() != "") {
        //已選擇分類
        $(this).removeClass("is-invalid").addClass("is-valid");
        flag_type = true;
      } else {
        //未選擇分類
        $(this).removeClass("is-valid").addClass("is-invalid");
        flag_type = false;
      }
    });


    // 及時監聽 #num01
    $("#num01").bind("input propertychange", function () {
      console.log($(this).val());
      $("#num01_text").text($(this).val());
      num01 = $(this).val();
    });

    // 監聽switch上架
    $("#switch01").click(function () {
      // this現在的動作
      console.log($(this).is(":checked"));
      if ($(this).is(":checked")) {
        $(this).next().text("已上架");
        switch01 = "已上架";
      } else {
        $(this).next().text("未上架");
        switch01 = "未上架";
      }
    });

    //監聽_即時監聽 #content
    $("#content").bind("input propertychange", function () {
      console.log($(this).val().length);
      if ($(this).val().length > 0 && $(this).val().length < 100) {
        //字數符合規定
        $(this).removeClass("is-invalid");
        $(this).addClass("is-valid");
        flag_content = true;
      } else {
        //字數不符合規定
        $(this).removeClass("is-valid");
        $(this).addClass("is-invalid");
        flag_content = false;
      }
    });
    // 監聽_圖片 #image
    $("#fileupload").change(function () {
      console.log(fileupload);
      console.log(fileupload.files[0]);
      console.log(fileupload.files[0].name);
      console.log(fileupload.files[0].size);
      console.log(fileupload.files[0].type);
      // fileupload.files
      // 圖片於瀏覽器的暫存路徑
      console.log(URL.createObjectURL(fileupload.files[0]));

      if (
        fileupload.files[0].type == "image/jpeg" ||
        fileupload.files[0].type == "image/png"
      ) {
        // 顯示預覽圖
        $("#prevImg").removeClass("d-none");
        // attr換參數
        $("#prevImg").attr("src", URL.createObjectURL(fileupload.files[0]));
        flag_upload = true;
      } else {
        alert("圖片格式不符合");
        flag_upload = false;
      }
    });
    // 按鈕監聽
    $("#ok_button").click(function () {
      event.preventDefault(); // 阻止表單預設提交行為

      if (
        flag_pname &&
        flag_pprice &&
        flag_type &&
        flag_content &&
        flag_upload &&
        switch01 &&
        num01
      ) {

        var formdata = new FormData();
        formdata.append("file", fileupload.files[0]);
        console.log(formdata);
        // 傳遞formdata至後端api
        $.ajax({
          type: "POST",
          url: "api/product/product_fileupload-api.php",
          data: formdata,
          dataType: "json",
          cache: false,
          contentType: false,
          processData: false,
          success: showdata_image,
          error: function (xhr, status, error) {
            console.log(xhr.responseText);
            alert("error-api/product/product_fileupload-api.php");
          },
        });
      } else {
        Swal.fire({
          position: "center-center",
          icon: "error",
          title: "欄位有誤請修正",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });

    function showdata_image(data) {
      console.log(data);

      if (data.state) {
        dataJSON["pimage"] = data.data.serverfilename; 
        console.log("Server File Name: " + dataJSON["pimage"]);

        dataJSON["pname"] = $("#pname").val();
        dataJSON["pprice"] = $("#pprice").val();
        dataJSON["content"] = $("#content").val();
        dataJSON["num01"] = num01;
        dataJSON["state"] = switch01;
        dataJSON["type-id"] = $("#addType").val();
        console.log(JSON.stringify(dataJSON));

      } else {
        alert("錯誤訊息: " + data.message);
      }

      $.ajax({
        type: "POST",
        url: "api/product/product_create-api.php",
        data: JSON.stringify(dataJSON),
        contentType: "application/json;chartset=utf-8",
        dataType: "json",
        success: showdata,
        error: function () {
          alert("error-api/product/product_create-api.php");
        },
      });
    }

    function showdata(data) {
      if (data.state) {
        //顯示成功訊息
        Swal.fire({
          title: data.message,
          showDenyButton: false,
          showCancelButton: false,
          confirmButtonText: "確定",
          confirmButtonColor: "#7a6890",
        }).then((result) => {
          if (result.isConfirmed) {
            location.reload();
          }
        });
      } else {
        //顯示錯誤訊息
        Swal.fire(data.message);
      }
    }