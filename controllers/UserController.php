<?php
	/*
	|==========================================================
	| Controller responsavel por todas as accoes que tem em conta os utilizadores.
	| Mediante o pedido assincrono por parte do cliente, decide que accao tera' de tomar.
	| Faz o processamento e validacao dos dados e invoca funcoes do Model, que e' responsavel
	| pela interaccao com a base de dados.
	| 
	| Accoes:
	|	setUpUser: verifica se o utilizador se encontra na base de dados. caso se verifique, devolve o seu id.
	|			caso nao se verifique, chama a funcao addUser.
	|	addUser: adiciona um utilizador 'a tabela de utilizadores.
	|==========================================================
	*/

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
			echo $UserCtrl->setUpUser( $_SESSION['user_id'] );
		break;
	}

	exit();
?>