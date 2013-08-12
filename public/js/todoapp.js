jQuery(function($){
	'use strict';
	
	/*
	|==========================================================
	| Core da aplicacao feito em JQuery.
	| Todas as accoes feitas na aplicacao sao assincronas,
	| pelo que em cada pedido, a mudanca e' feita no servidor,
	| atingindo assim o conceito de "single page application"
	|==========================================================
	*/

	var global_user, global_active = 0;

	var TodoApp = {
		/*
		|==========================================================
		| Inicia a aplicacao e verifica se o utilizador existe.
		| Se existir vai buscar os seus todos.
		| Se nao existir, e' criado um novo utilizador. 
		|==========================================================
		*/
		init: function(){
			var $setUpUser = $.ajax({
				type: "POST",
				url: "controllers/UserController.php",
				data: { action: "setUpUser" }
			});

			$setUpUser.success(function( user ){
				global_user = jQuery.parseJSON(user);
				TodoApp.getItems();
			});

			this.bindElements();
			this.bindEvents();
		},

		// funcao que associa elementos do DOM a variaveis
		bindElements: function(){
			this.$newTodo = $('.new-todo');
			this.$todoList = $('.todo-list');
			this.$activeItemsNumber = $('.activeItemsNumber');
			this.$header = $('#header');
		},

		// funcao que associa eventos a variaveis do DOM
		bindEvents: function(){
			this.$newTodo.on('keypress', this.createItem);
			this.$todoList.on('dblclick', '.view-todo', this.editItem);
			this.$todoList.on('keypress', '.edit-todo', this.blurItemOnEnter);
			this.$todoList.on('blur', '.edit-todo', this.updateItem);
			this.$todoList.on('click', '.destroy-todo', this.removeItem);
			this.$todoList.on('change', '.complete-todo', this.completeItem);
			this.$header.on('click', '.activeItems', this.getActiveItems);
			this.$header.on('click', '.doneItems', this.getDoneItems);
			this.$header.on('click', '.allItems', this.getItems);
		},

		/*
		|==========================================================
		| Funcao que tem o objectivo de ir buscar os 'todos'
		| do utilizador, inserindo-os no DOM
		|==========================================================
		*/
		getItems: function(){
			var activeCount = 0; 
			$('.allItems').addClass('activo').siblings().removeClass('activo');
			$('.new-todo').fadeIn();

			$.ajax({
				type: "POST",
				beforeSend: function(){ 
					$('.allItems').find('.loaderList').toggle(); 
					TodoApp.$todoList.empty().fadeOut(); 
				},
				url: "controllers/ItemController.php",
				data: { action: "getItems", user_id: global_user.fb_id },
				success: function(items){
					$('.allItems').find('.loaderList').toggle();
					TodoApp.appendItem( jQuery.parseJSON( items ) );
					TodoApp.$todoList.fadeIn();
					activeCount = TodoApp.activeCount();
					TodoApp.$activeItemsNumber.html(activeCount);
					$('.initLoader').fadeOut(function(){
						$('.settings').fadeIn();
						$('.items').fadeIn();
					});
				}
			});
		},

		/* 
			Funcao que vai buscar os 'todos' do utilizador, 
			que ainda se encontram por fazer
		*/
		getActiveItems: function(){
			var activeCount = 0;
			$('.activeItems').addClass('activo').siblings().removeClass('activo');
			$('.new-todo').fadeIn();

			$.ajax({
				type: "POST",
				beforeSend: function(){ 
					$('.activeItems').find('.loaderList').toggle(); 
					TodoApp.$todoList.empty().fadeOut();
				},
				url: "controllers/ItemController.php",
				data: { action: "getActiveItems", user_id: global_user.fb_id },
				success: function(items){
					$('.activeItems').find('.loaderList').toggle();
					TodoApp.appendItem( jQuery.parseJSON( items ) );
					TodoApp.$todoList.fadeIn();
					activeCount = TodoApp.activeCount();
					TodoApp.$activeItemsNumber.html(activeCount);
				}
			});
		},

		/* 
			Funcao que vai buscar os 'todos' do utilizador, 
			que ja se encontram feitos.
		*/
		getDoneItems: function(){
			$('.doneItems').addClass('activo').siblings().removeClass('activo');
			$('.new-todo').fadeOut();

			$.ajax({
				type: "POST",
				beforeSend: function(){ 
					$('.doneItems').find('.loaderList').toggle(); 
					TodoApp.$todoList.empty().fadeOut();
				},
				url: "controllers/ItemController.php",
				data: { action: "getDoneItems", user_id: global_user.fb_id },
				success: function(items){
					$('.doneItems').find('.loaderList').toggle();
					TodoApp.appendItem( jQuery.parseJSON( items ) );
					TodoApp.$todoList.fadeIn();
					TodoApp.$activeItemsNumber.html(global_active);
				}
			});
		},

		// Funcao que conta o numero de 'todos' que se encontram por fazer
		activeCount: function(){
			global_active = 0;
			$.each(this.$todoList.find('li'), function(){
				if( $(this).attr('data-completed') == 'false' ) global_active++;
			});
			
			return global_active;
		},

		// Funcao que cria um 'todo' e o insere no DOM
		createItem: function(e){
			var $input_val = $.trim($(this).val());

			if( e.which !== 13 || !$input_val ) return;

			$.ajax({
				type: "POST",
				beforeSend: function(){ $('.loaderNewTodo').toggle(); },
				url: "controllers/ItemController.php",
				data: { action: 'addItem', item_title: $input_val, item_status: false, user_id: global_user.user_id },
				success: function(item_id){
					var parsed_item = jQuery.parseJSON(item_id);
					var data = [{ item_id: parsed_item.item_id, item_title: $input_val, item_status: 'false' }];
					$('.loaderNewTodo').toggle();
					TodoApp.appendItem(data);
					TodoApp.$activeItemsNumber.html(++global_active);
				}
			});

			$(this).val('');
		},

		// Funcao responsavel por inserir um 'todo' no DOM
		appendItem: function(data){
			var i = 0, view, status;
			for( i = 0; i < data.length; i++ ){
				view = this.processView(data[i]);

				$('.todo-list').prepend(
					'<li data-itemID="'+ data[i].item_id +'" data-completed="'+ data[i].item_status +'">'
						+ '<input class="edit-todo">'
						+ '<div class="view-todo">'
		    				+ view
		                + '</div>'
		                + '<div class="loaderItems"></div>'
		                + '<div class="alerta">Updated</div>'
		                + '<div class="triangle"></div>'
	                + '</li>'
	            );
			}
		},

		// Funcao auxiliar que decide que estilo utilizar para o tudo baseando-se no seu estado
		processView: function(data){
			var notcomplete = '<input type="checkbox" class="complete-todo"><label>' + data.item_title + '</label><p class="destroy-todo">x</p>',
				complete = '<input type="checkbox" class="complete-todo" checked="checked"><label class="complete">' + data.item_title + '</label><p class="destroy-todo">x</p>';
			
			return data.item_status == 'false' ? notcomplete: complete;
		},

		/*
		|==========================================================
		| As 3 funcoes seguintes fazem parte do mesmo processo: edicao de um 'todo'
		| editItem: processa um duplo click no 'todo' e actualiza o seu valor quando o utilizador carrega no enter
		| blurItemOnEnter: quando o utilizador carrega no enter despoleta uma chamada 'a funcao seguinte
		| updateItem: por fim, o 'todo' e' actualizado e surge uma informacao visual de que tal sucedeu
		|==========================================================
		*/
		editItem: function(){
			var $editable = $(this).closest('li').addClass('editing').find('.edit-todo');
			var $label = $(this).closest('li').find('label');
			$editable.val($label.html()).focus();
		},

		blurItemOnEnter: function(e){
			if( e.which == 13 ){
				$(this).blur();
			}
		},

		updateItem: function(){
			var $item = $(this).closest('li'),
				$itemLabel =  $item.find('label'),
				$oldValue = $itemLabel.html(),
				$newValue = $(this).val();

			if( $oldValue === $newValue ) { $item.removeClass('editing'); return; }

			$itemLabel.html( $newValue );
			$item.removeClass('editing');

			$.ajax({
				type: "POST",
				beforeSend: function(){ TodoApp.toggleLoader( $item ); },
				url: "controllers/ItemController.php",
				data: { action: 'updateItem', 
						item_id: $item.attr('data-itemid'), 
						item_title: $newValue, 
						item_status: $itemLabel.hasClass('complete') },
				success: function(items){
					var alerta = $item.find('.alerta');
					var triangle = $item.find('.triangle');

					alerta.animate({
						opacity: 1,
						left: '-70px'
					}, 500);


					triangle.animate({
						opacity: 1,
						left: '-20px'
					}, 500);

					setTimeout(function(){
						alerta.animate({
							opacity: 0,
							left: '-60px'
						}, 500);


						triangle.animate({
							opacity: 0,
							left: '-10px'
						}, 500);
					}, 1000);

					TodoApp.toggleLoader($item);
				}
			});
		},

		// remove um 'todo' por completo e tambem do DOM
		removeItem: function(){
			var $parent = $(this).closest('li'),
				$parent_clone = $parent.clone();
			
			$.ajax({
				type: "POST",
				beforeSend: function(){ TodoApp.toggleLoader($parent); },
				url: "controllers/ItemController.php",
				data: { action: 'removeItem', 
						item_id: $parent.attr('data-itemid') },
				success: function(){
					TodoApp.toggleLoader($parent);

					$parent.slideUp("fast", function(){
						$(this).remove();
					});

					if( $parent_clone.attr('data-completed') == 'false' ) 
						TodoApp.$activeItemsNumber.html(--global_active);
				}
			});
		},


		// Funcao que actualiza o estilo do texto do 'todo' quando se carrega na checkbox
		completeItem: function(){
			var $itemLabel = $(this).parent().find('label');
			$(this).is(':checked') ? $itemLabel.addClass('complete') : $itemLabel.removeClass('complete');
			
			TodoApp.updateComplete($(this));
		},

		// Funcao que actualiza o estado do 'todo'
		updateComplete: function($item){
			var that = this, $parent = $item.closest('li'),
				$itemLabel = $parent.find('label'),
				$item_complete = $itemLabel.hasClass('complete');
				
			$item_complete ? 
				$parent.attr('data-completed', 'true') : $parent.attr('data-completed', 'false'); 

			$.ajax({
				type: "POST",
				beforeSend: function(){ that.toggleLoader($parent);	},
				url: "controllers/ItemController.php",
				data: { action: 'updateItem', 
						item_id: $parent.attr('data-itemid'), 
						item_title: $itemLabel.html(), 
						item_status:  $item_complete },
				success: function(items){
					var alerta = $parent.find('.alerta');
					var triangle = $parent.find('.triangle');

					alerta.animate({
						opacity: 1,
						left: '-70px'
					}, 500);


					triangle.animate({
						opacity: 1,
						left: '-20px'
					}, 500);

					setTimeout(function(){
						alerta.animate({
							opacity: 0,
							left: '-60px'
						}, 500);


						triangle.animate({
							opacity: 0,
							left: '-10px'
						}, 500);
					}, 1000);


					setTimeout(function(){
						if( $('.activeItems').hasClass('activo') ){
							$parent.slideUp("fast", function(){
								$(this).remove();
							});
						}

						if( $('.doneItems').hasClass('activo') ){
							$parent.slideUp("fast", function(){
								$(this).remove();
							});
						}
					}, 1500);

					that.toggleLoader($parent);
					
					$parent.attr('data-completed') == 'false' ? 
						that.$activeItemsNumber.html(++global_active) : that.$activeItemsNumber.html(--global_active);
				}
			});
		},

		// Hide/show do loader dos 'todos'
		toggleLoader: function( el ){
			el.find('.loaderItems').toggle();
		}
	}

	TodoApp.init();

	/*
	|==========================================================
	| Lidar com logouts. 
	| Faz pedido assincrono para limpar e destruir a sessao.
	|==========================================================
	*/
	$('.logout').hover(function(){
		$('.logoutHelper').animate({ opacity: 1, left: '30px' });
	}, function(){
		$('.logoutHelper').animate({ opacity: 0, left: '25px' });
	});

	$('.logoutBtn').on('click', function(e){
		e.preventDefault();

		var link = $(this).attr('href');

		$.ajax({ 
			url: "public/logout.php", 
			success: function(data){ window.location.href = link; }
		});
	});

	$('.logoutHelper').on('click', function(e){
		e.preventDefault();

		var link = $(this).attr('href');

		$.ajax({ 
			url: "public/logout.php", 
			success: function(data){ window.location.href = link; }
		});
	});
});