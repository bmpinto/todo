<?php
	/*
	|==========================================================
	| Controller responsavel por todas as accoes que tem em conta com os 'todos'.
	| Mediante o pedido assincrono por parte do cliente, decide que accao tera' de tomar.
	| Faz o processamento e validacao dos dados e invoca funcoes do Model, que e' responsavel
	| pela interaccao com a base de dados.
	| 
	| Accoes:
	|	getItems: vai buscar todos os 'todos'.
	|	getActiveItems: vai buscar so os 'todos' que estao por fazer.
	|	getDoneItems: vai buscar so os 'todos' que ja estao feitos.
	|	addItem: adicionar um 'todo' a lista do proprio utilizador. 
	|	updateItem: actualiza um 'todo'.
	|	removeItem: apaga um 'todo'.
	|==========================================================
	*/

	session_start();

	require('../config.php');
	require('../models/Item.php');

	class ItemCtrl {
		protected $item;

		public function __construct($config){
			$this->item = new Item($config);
		}

		public function getItems($fb_id){
			if( isset($fb_id) && $fb_id != "") 
			{
					$fb_id = addslashes( $fb_id );
					return $this->item->getItems( $fb_id ); 
			}
		}

		public function getActiveItems($fb_id){
			if( isset($fb_id) && $fb_id != "") 
			{
					$fb_id = addslashes( $fb_id );
					return $this->item->getActiveItems( $fb_id ); 
			}
		}

		public function getDoneItems($fb_id){
			if( isset($fb_id) && $fb_id != "") 
			{
					$fb_id = addslashes( $fb_id );
					return $this->item->getDoneItems( $fb_id ); 
			}
		}

		public function addItem( $item_title, $item_status, $item_user_id ){
			if( (isset($item_title) && $item_title != "")
				&& (isset($item_status) && $item_status != "")
				&& (isset($item_user_id) && $item_user_id != "") ) 
			{
					$item_title = addslashes( $item_title );
					$item_status = addslashes( $item_status );
					$item_user_id = addslashes( $item_user_id );
					return $this->item->addItem( $item_title, $item_status, $item_user_id );
			}
		}

		public function updateItem( $item_id, $item_title, $item_status ){
			if( (isset($item_id) && $_POST['item_id'] != "")
				&& (isset($item_title) && $item_title != "")
				&& (isset($item_status) && $item_status != "") ) 
			{
					$item_id = addslashes( $item_id );
					$item_title = addslashes( $item_title );
					$item_status = addslashes( $item_status );
					return $this->item->updateItem( $item_id, $item_title, $item_status );
			}
		}

		public function removeItem( $item_id ){
			if( isset($item_id) && $item_id != "") 
			{
					$item_id = addslashes( $item_id );
					return $this->item->removeItem( $item_id );
			}
		}
	}

	$ItemCtrl = new ItemCtrl($config);

	if( !isset($_POST['action']) && $_POST['action'] !='' ){
		echo 'Ocorreu um erro';
	}

	switch( $_POST['action'] ){
		case 'getItems' : 
			echo $ItemCtrl->getItems( $_POST['user_id'] ); 
		break;

		case 'getActiveItems' : 
			echo $ItemCtrl->getActiveItems( $_POST['user_id'] ); 
		break;

		case 'getDoneItems' : 
			echo $ItemCtrl->getDoneItems( $_POST['user_id'] ); 
		break;

		case 'addItem' : 
			echo $ItemCtrl->addItem( $_POST['item_title'], $_POST['item_status'], $_POST['user_id'] );
		break;

		case 'updateItem' : 
			echo $ItemCtrl->updateItem( $_POST['item_id'], $_POST['item_title'], $_POST['item_status'] );
		break;

		case 'removeItem' : 
			echo $ItemCtrl->removeItem( $_POST['item_id'] );
		break;
	}

	exit();
?>