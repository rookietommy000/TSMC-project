<?php
//   input:{"ID":"1","Pname":"奶茶", "Price":"50"}
//   input: {"ID":"XX", "Email":"XXXXX"}
//   {"state" : true, "message" : "更新成功!"}
//   {"state" : false, "message" : "更新失敗!"}
//   {"state" : false, "message" : "傳遞參數格式錯誤!"}
//   {"state" : false, "message" : "未傳遞任何參數!"}
    $data = file_get_contents("php://input", "r");
    if($data != ""){
        $mydata = array();
        $mydata = json_decode($data, true);
        if(isset($mydata["ID"]) && isset($mydata["Email"]) && isset($mydata["State"]) && $mydata["ID"] != "" && $mydata["Email"] != "" && $mydata["State"] != ""){
            $p_ID = $mydata["ID"];
            $p_Email = $mydata["Email"];
            $p_State = $mydata["State"];


            $servername = "localhost";
            $username = "owner01";
            $password = "123456";
            $dbname = "project";

            $conn = mysqli_connect($servername, $username, $password, $dbname);
            if(!$conn){
                die("連線失敗".mysqli_connect_error());
            }

            $sql = "UPDATE member SET Email = '$p_Email', State = '$p_State' WHERE ID = '$p_ID'";
            if(mysqli_query($conn, $sql)){
                //更新成功
                echo '{"state" : true, "message" : "更新成功!"}';
            }else{
                //更新失敗
                echo '{"state" : false, "message" : "更新失敗!"}';
            }
            mysqli_close($conn);
        }else{
            echo '{"state" : false, "message" : "傳遞參數格式錯誤!"}';
        }
    }else{
        echo '{"state" : false, "message" : "未傳遞任何參數!"}';
    }
?>


