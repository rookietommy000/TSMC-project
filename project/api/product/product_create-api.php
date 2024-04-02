<?php
    //input: {"Pname":"奶茶", "Price":"50", "Sugar":"全糖", "Num":"10", "Delivery":"true", "Added":"珍珠","Pay":"刷卡","Total":"500"}
    // $data = '{"Pname":"奶茶QQQ", "Price":"150", "Sugar":"半糖", "Num":"20", "Delivery":"false", "Added":"珍珠","Pay":"刷卡","Total":"5000"}';

    $data = file_get_contents("php://input", "r");
    if($data != ""){
        $mydata = array();
        $mydata = json_decode($data, true);
        if(isset($mydata["pname"]) && isset($mydata["pprice"]) && isset($mydata["type-id"]) && isset($mydata["num01"]) && isset($mydata["content"]) && isset($mydata["state"]) && $mydata["pname"] != "" && $mydata["pprice"] != "" && $mydata["type-id"] != "" && $mydata["num01"] != "" && $mydata["content"] != "" && $mydata["state"] != ""){
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

            $sql = "INSERT INTO product(pname, pprice, pimage, `type-id`, num01, content, `state`) VALUES ('$p_Pname', '$p_Price', '$p_Pimage', '$p_Type', '$p_Num', '$p_Content', '$p_State')";

            if(mysqli_query($conn, $sql)){
                //新增成功
                echo '{"state" : true, "message" : "新增成功!"}';
            }else{
                //新增失敗
                echo '{"state" : false, "message" : "新增失敗!: ' . mysqli_error($conn) . '"}';
            }
            mysqli_close($conn);
        }else{
            echo '{"state" : false, "message" : "傳遞參數格式錯誤!"}';
        }
    }else{
        echo '{"state" : false, "message" : "未傳遞任何參數!"}';
    }
?>