<?php

$data = file_get_contents("php://input", "r");
if ($data != "") {
    $mydata = array();
    $mydata = json_decode($data, true);
    if (isset($mydata["Username"]) && isset($mydata["Password"]) && $mydata["Username"] != "" && $mydata["Password"] != "") {
        $p_Username = $mydata["Username"];
        $p_Password = $mydata["Password"];

        $servername = "localhost";
        $username = "owner01";
        $password = "123456";
        $dbname = "project";

        $conn = mysqli_connect($servername, $username, $password, $dbname);
        if (!$conn) {
            die("連線失敗" . mysqli_connect_error());
        }

        // 第一次查詢資料
        $sql = "SELECT Username, Password, Email, State FROM member WHERE Username = '$p_Username'";
        $result = mysqli_query($conn, $sql);
        if (mysqli_num_rows($result) == 1) {
            // 確認帳號符合，密碼不確定
            $row = mysqli_fetch_assoc($result);
            $state = $row['State'];
            if (password_verify($p_Password, $row["Password"])) {
                // 密碼比對正確，撈取不包含密碼的使用者資料並產生UID
                $uid = substr(hash("sha256", uniqid(time())), 0, 8);
                // 更新uid至資料庫
                $sql = "UPDATE member SET UID01 = '$uid' WHERE Username = '$p_Username'";
                if (mysqli_query($conn, $sql)) {

                    if($state == 1){

                        $sql = "SELECT Username, Email, UID01 FROM member WHERE Username = '$p_Username'";
                        $result = mysqli_query($conn, $sql);
                        $row = mysqli_fetch_assoc($result);
                        $mydata = array();
                        $mydata[] = $row;
                    
                        echo '{"state" :true, "data": ' . json_encode($mydata) . '  ,"message" : "登入成功！"}';

                    }else{
                        echo '{"state" : false, "message" : "此帳號已停權"}';
                    } 
            } else {
                // uid更新錯誤
                echo '{"state" :false, "message" : "登入失敗！, uid更新錯誤"}';
            }
        } else {
            // 確認帳號不符和，登入失敗
            echo '{"state" :false, "message" : "登入失敗！"}';
        }
        mysqli_close($conn);
    } else {
        echo '{"state" : false, "message" : "傳遞參數格式錯誤!"}';
    }
} else {
    echo '{"state" : false, "message" : "未傳遞任何參數!"}';
}
}