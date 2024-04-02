<?php
    // input: {"Username":"XX", "Password":"XXX", "Email":"XXXXX"}
    // {"state" : true, "message" : "註冊成功!"}
    // {"state" : false, "message" : "註冊失敗!"}
    // {"state" : false, "message" : "傳遞參數格式錯誤!"}
    // {"state" : false, "message" : "未傳遞任何參數!"}
    $data = file_get_contents("php://input", "r");
    if ($data != "") {
        $mydata = array();
        $mydata = json_decode($data, true);
        if (isset($mydata["Name"]) && $mydata["Name"] != "") {
            $p_Name = $mydata["Name"];

            $servername = "localhost";
            $username = "owner01";
            $password = "123456";
            $dbname = "project";

            $conn = mysqli_connect($servername, $username, $password, $dbname);
            if (!$conn) {
                die("連線失敗" . mysqli_connect_error());
            }

            $sql = "INSERT INTO `product-type`(Name) VALUES('$p_Name')";
            if (mysqli_query($conn, $sql)) {
                //新增成功
                echo '{"state" : true, "message" : "新增種類成功!"}';
            } else {
                //新增失敗
                echo '{"state" : false, "message" : "新增種類失敗!"}';
            }
            mysqli_close($conn);
        } else {
            echo '{"state" : false, "message" : "傳遞參數格式錯誤!"}';
        }
    } else {
        echo '{"state" : false, "message" : "未傳遞任何參數!"}';
    }
