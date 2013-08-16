<?php

	$config = "pgsql:"
		    . "host=ec2-54-221-203-200.compute-1.amazonaws.com;"
		    . "dbname=". getenv("dbname") .";"
		    . "user=". getenv("dbuser") .";"
		    . "port=5432;"
		    . "sslmode=require;"
		    . "password=". getenv("dbpw");

?>