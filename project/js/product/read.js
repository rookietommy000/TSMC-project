
    // read

    var newData = [];
    $(function () {
      $.ajax({
        type: "GET",
        url: "api/product/product_read-api.php",
        dataType: "json",
        success: showdataRead,
        error: function () {
          alert("error-api/product/product_read-api.php");
        }
      });
    });

    function showdataRead(data) {
      console.log(data);
      data.data.forEach(function (item, key) {
        console.log(data.data);
        if (key % 5 == 0) {
          newData.push([]);
        }
        var page = parseInt(key / 5);
        newData[page].push(item);

      });
      drawTable(0);
      console.log(newData);

      //產生頁碼
      $("#pageList").empty();
      newData.forEach(function (item, key) {
        var thisPage = key + 1;
        var strHTML = '<li class="page-item"><a class="page-link" href="#" onclick="drawTable(' + key + ')">' + thisPage + '</a></li>';
        $("#pageList").append(strHTML);
      });
    }

    function drawTable(page) {
      $("#mydata").empty();
      newData[page].forEach(function (item) {

        var strHTML = '';
        console.log(item.ID);
        strHTML += '<tr><td class="py-4">'
          + item.ID + '</td><td class="py-4">'
          + item.pname + '</td><td class="py-4"> <img src="/project/upload/'
          + item.pimage + '" alt="" class="mt-1 mb-1 bg-cover box01"></td><td class="py-4">'
          + item.pprice + '</td><td class="py-4">'
          + item.Name + '</td><td class="py-4">'
          + item.num01 + '</td><td class="py-4">'
          + item.content + '</td><td class="py-4">'
          + item.state + '</td><td class="text-center py-4">'
          + item.Create_time + '</td><td class="text-center py-4"><div class="d-flex align-content-center justify-content-center"><button class="btn btn-success me-2" data-bs-toggle="modal" data-bs-target="#updateModal" data-id="' 
          + item.ID +
          '" data-name="' 
          + item.pname +
          '" data-image="' 
          + item.pimage +
          '"  data-price="' 
          + item.pprice +
          '"  data-number="' 
          + item.num01 +
          '"  data-type="' 
          + item.Name +
          '"  data-content="' 
          + item.content +
          '"  data-state="' 
          + item.state +
          '"  id="update_btn">更新</button><button class="btn btn-danger" data-id="' + item.ID + '"  id="delete_btn">刪除</button></div></td></tr>';
        $("#mydata").append(strHTML);
      });
    }

    // 刪除
    // 監聽 #delete_btn
    $("#mydata").on("click", "#delete_btn", function () {
        var button = $(this); // 存儲當前點擊的按鈕
  
        Swal.fire({
          title: "確定要刪除？",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#630DFA",
          cancelButtonColor: "#d33",
          confirmButtonText: "確認！",
          cancelButtonText: "取消"
        }).then((result) => {
          if (result.isConfirmed) {
            // 如果用戶確認刪除，則進行 AJAX 請求
            var dataJSON = { "ID": button.data("id") };
            console.log(JSON.stringify(dataJSON));
  
            $.ajax({
              type: "POST",
              url: "api/product/product_delete-api.php",
              data: JSON.stringify(dataJSON),
              dataType: "json",
              success: function (data) {
                console.log(data);
                if (data.state) {
                  Swal.fire({
                    title: "已刪除",
                    text: "檔案已不存在！",
                    icon: "success"
                  }).then(() => {
                    location.href = "admin-product.html"; 
                  });
                } else {
                  alert(data.message); // 顯示錯誤消息
                }
              },
              error: function () {
                alert("error-api/product/product_delete-api.php");
              }
            });
          }
        });
      });
  