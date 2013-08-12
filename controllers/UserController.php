<?php
	session_start();

	require('../config.php');
	require('../models/User.php');

	class UserCtrl {
		protected $user;

		public function __construct($config){
			$this->user = new User($config);
		}

		public function setUpUser($user){
			if( isset($user) && $user != "" ) 
			{
				$user = addslashes( $user );
				$user_id = $this->user->getUser( $user );
				
				return $user_id != 'false' ? $user_id : $this->addUser( $user );
			}
		}

		public function addUser( $user ){
			return $this->user->addUser( $user );
		}
	}

	$UserCtrl = new UserCtrl($config);

	if( !isset($_POST['action']) && $_POST['action'] !='' ){
		echo 'Ocorreu um erro';
	}

	switch( $_POST['action'] ){
		case 'setUpUser' : 
			echo $_SESSION['user_id']; //$UserCtrl->setUpUser( $_SESSION['user_id'] );
		break;
	}

	exit();
?>