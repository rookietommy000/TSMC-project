<?php
//   input:{"ID":"1","Title":"XXXX", "Heading":"50", "content":"XXXXX"}
//   output:
//   {"state" : true, "message" : "更新成功!"}
//   {"state" : false, "message" : "更新失敗!"}
//   {"state" : false, "message" : "傳遞參數格式錯誤!"}
//   {"state" : false, "message" : "未傳遞任何參數!"}
    $data = file_get_contents("php://input");
    echo $data;
    file_put_contents('php_input.txt', $data);
    if($data != ""){
        $mydata = array();
        $mydata = json_decode($data, true);
        if(isset($mydata["ID"]) && isset($mydata["pname"]) && isset($mydata["pprice"]) && isset($mydata["type-id"]) && isset($mydata["num01"]) && isset($mydata["content"]) && isset($mydata["state"]) && $mydata["ID"] != "" && $mydata["pname"] != "" && $mydata["pprice"] != "" && $mydata["type-id"] != "" && $mydata["num01"] != "" && $mydata["content"] != "" && $mydata["state"] != ""){
            $p_ID = $mydata["ID"];
            $p_Pname = $mydata["pname"];
            $p_Price = $mydata["pprice"];
            $p_Num   = $mydata["num01"];
            $p_Content = $mydata["content"];
            $p_State = $mydata["state"];
            $p_Type = $mydata["type-id"];
            $p_Pimage = $mydata["pimage"];

            $servername = "localhost";
            $username = "owner01";
            $password = "123456";
            $dbname = "project";

            $conn = mysqli_connect($servername, $username, $password, $dbname);
            if(!$conn){
                die("連線失敗".mysqli_connect_error());
            }

            $sql = "UPDATE product SET pname = '$p_Pname', pprice = '$p_Price', pimage = '$p_Pimage', `type-id` = '$p_Type', num01 = '$p_Num', content = '$p_content', state = '$p_State' WHERE ID = '$p_ID'";
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





