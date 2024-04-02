<?php
//input: {"Username":"XX", "Password":"XXX"}
// {"state" : true, "data": "登入後的帳號資料(密碼除外)", "message" : "登入成功!"}
// {"state" : false, "message" : "登入失敗!"}
// {"state" : false, "message" : "傳遞參數格式錯誤!"}
// {"state" : false, "message" : "未傳遞任何參數!"}

$data = file_get_contents("php://input", "r");
if ($data != "") {
    $mydata = array();
    $mydata = json_decode($data, true);
    if (isset($mydata["UserId"]) && isset($mydata["Password"]) && $mydata["UserId"] != "" && $mydata["Password"] != "") {
        $p_Username = $mydata["UserId"];
        $p_Password = $mydata["Password"];


        $servername = "localhost";
        $username = "owner01";
        $password = "123456";
        $dbname = "project";

        $conn = mysqli_connect($servername, $username, $password, $dbname);
        if (!$conn) {
            die("連線失敗" . mysqli_connect_error());
        }

        $sql = "SELECT userID, Password FROM manager WHERE userId = '$p_Username'";
        $result = mysqli_query($conn, $sql);
        if (mysqli_num_rows($result) == 1) {
            //確認帳號符合, 密碼不確定
            $row = mysqli_fetch_assoc($result);
            if (password_verify($p_Password, $row["Password"])) {
                //密碼比對正確, 撈取不包含密碼的使用者資料並產生uid
                $uid = substr(hash("sha256", uniqid(time())), 0, 8);
                //更新uid至資料庫
                $sql = "UPDATE manager SET UID01 = '$uid' WHERE UserId = '$p_Username'";
                if (mysqli_query($conn, $sql)) {
                    $sql = "SELECT UserId,  UID01 FROM manager WHERE UserId = '$p_Username'";
                    $result = mysqli_query($conn, $sql);
                    $row = mysqli_fetch_assoc($result);
                    $mydata = array();
                    $mydata[] = $row;

                    echo '{"state" : true, "data": ' . json_encode($mydata) . ', "message" : "登入成功!"}';
                } else {
                    //uid更新錯誤
                    echo '{"state" : false, "message" : "登入失敗, uid更新錯誤"}';
                }
            } else {
                //密碼比對錯誤
                echo '{"state" : false, "message" : "登入失敗1"}';
            }
        } else {
            //確認帳號不符合, 登入失敗
            echo '{"state" : false, "message" : "登入失敗0"}';
        }
        mysqli_close($conn);
    } else {
        echo '{"state" : false, "message" : "傳遞參數格式錯誤!"}';
    }
} else {
    echo '{"state" : false, "message" : "未傳遞任何參數!"}';
}
