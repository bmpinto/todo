<?php

	class Item{
		private $db; 
		private $config;

		public function __construct($config){
			try{
				$this->config = $config;
				$this->db = new PDO("mysql:host=localhost;dbname=todo", $this->config['DB_USERNAME'], $this->config['DB_PASSWORD']);
				$this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			} catch(PDOException $e){
				echo 'ERROR: ' . $e->getMessage();
				exit();
			}
		}

		public function getItems($fb_id){
			$stmt = $this->db->prepare("SELECT * FROM user u, items i WHERE u.user_id = i.user_id AND u.fb_id = :fb_id");
			$stmt->bindParam(':fb_id', $fb_id, PDO::PARAM_STR);
		    $stmt->execute();
		    return json_encode( $stmt->fetchAll() );
		}

		public function getActiveItems($fb_id){
			$stmt = $this->db->prepare("SELECT * FROM user u, items i WHERE u.user_id = i.user_id AND u.fb_id = :fb_id AND i.item_status = 'false'");
			$stmt->bindParam(':fb_id', $fb_id, PDO::PARAM_STR);
		    $stmt->execute();
		    return json_encode( $stmt->fetchAll() );
		}

		public function getDoneItems($fb_id){
			$stmt = $this->db->prepare("SELECT * FROM user u, items i WHERE u.user_id = i.user_id AND u.fb_id = :fb_id AND i.item_status = 'true'");
			$stmt->bindParam(':fb_id', $fb_id, PDO::PARAM_STR);
		    $stmt->execute();
		    return json_encode( $stmt->fetchAll() );
		}

		public function addItem( $item_title, $item_status, $item_user_id ){
			$stmt = $this->db->prepare("INSERT INTO items(item_title, item_status, user_id) VALUE(:item_title, :item_status, :item_user_id)");
			$stmt->bindParam(':item_title', $item_title, PDO::PARAM_STR);
			$stmt->bindParam(':item_status', $item_status, PDO::PARAM_STR);
			$stmt->bindParam(':item_user_id', $item_user_id, PDO::PARAM_STR);
			$stmt->execute();
			return json_encode( $this->db->lastInsertId() );
		}

		public function updateItem( $item_id, $item_title, $item_status ){
			$stmt = $this->db->prepare("UPDATE items SET item_title = :item_title, item_status = :item_status WHERE item_id = :item_id");
			$stmt->bindParam(':item_id', $item_id, PDO::PARAM_INT);
			$stmt->bindParam(':item_title', $item_title, PDO::PARAM_STR);
			$stmt->bindParam(':item_status', $item_status, PDO::PARAM_STR);
			$stmt->execute();
			return 'OK#UPDATE';
		}

		public function removeItem( $item_id ){
			$stmt = $this->db->prepare("DELETE FROM items WHERE item_id = :item_id");
			$stmt->bindParam(':item_id', $item_id, PDO::PARAM_INT);
			$stmt->execute();
			return 'OK#DELETE';
		}
	}

?>