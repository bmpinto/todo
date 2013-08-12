<?php
	if (isset($_SESSION['user_id'])) {       
        require_once('public/app.php');
    }
    else
    {
    	echo 1;
    }
?>