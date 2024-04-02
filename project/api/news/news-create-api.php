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
        if (isset($mydata["Title"]) && isset($mydata["Heading"]) && isset($mydata["content"]) && $mydata["Title"] != "" && $mydata["Heading"] != "" && $mydata["content"] != "") {
            $p_Title = $mydata["Title"];
            $p_Heading = $mydata["Heading"];
            $p_content = $mydata["content"];

            $servername = "localhost";
            $username = "owner01";
            $password = "123456";
            $dbname = "project";

            $conn = mysqli_connect($servername, $username, $password, $dbname);
            if (!$conn) {
                die("連線失敗" . mysqli_connect_error());
            }

            $sql = "INSERT INTO news(Title, Heading, content) VALUES('$p_Title', '$p_Heading', '$p_content')";
            if (mysqli_query($conn, $sql)) {
                //新增成功
                echo '{"state" : true, "message" : "新增消息成功!"}';
            } else {
                //新增失敗
                echo '{"state" : false, "message" : "新增消息失敗!"}';
            }
            mysqli_close($conn);
        } else {
            echo '{"state" : false, "message" : "傳遞參數格式錯誤!"}';
        }
    } else {
        echo '{"state" : false, "message" : "未傳遞任何參數!"}';
    }
