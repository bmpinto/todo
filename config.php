<?php

	$config = "pgsql:"
		    . "host=". getenv("dbhost") .";"
		    . "dbname=". getenv("dbname") .";"
		    . "user=". getenv("dbuser") .";"
		    . "port=5432;"
		    . "sslmode=require;"
		    . "password=". getenv("dbpw");

?