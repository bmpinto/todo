<?php

	class User{
		private $db; 
		private $config;

		public function __construct($config){
			try{
				$this->config = $config;
				$this->db = new PDO( $this->config );
				$this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			} catch(PDOException $e){
				echo 'ERROR: ' . $e->getMessage();
				exit();
			}
		}

		public function getUser($fb_id){
			$stmt = $this->db->prepare("SELECT * FROM utilizador WHERE fb_id = :fb_id");
			$stmt->bindParam(':fb_id', $fb_id, PDO::PARAM_INT);
		    $stmt->execute();
		    return json_encode( $stmt->fetch() );
		}

		public function addUser( $fb_id ){
			/*
			$ret = $fb_id;
			$stmt = $this->db->prepare("INSERT INTO utilizador(fb_id) VALUE(:fb_id)");
			$stmt->bindParam(':fb_id', $fb_id, PDO::PARAM_STR);
			$stmt->execute();
			*/
			return 'este e o id do fb: ' . $ret;
		}
	}

?>