<?php
	if (isset($_SESSION['user_id'])) {        
        require_once('app.php');
    }
    else
    {
    	return 1;
    }
?>