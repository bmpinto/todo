<?php

	$config = "pgsql:"
		    . "host=ec2-54-221-203-200.compute-1.amazonaws.com;"
		    . $_ENV['dbname']
		    . $_ENV['dbuser']
		    . ";port=5432;"
		    . "sslmode=require;"
		    . $_ENV['dbpw'];

?>