jQuery(function($){
	'use strict';
	
	var global_user, global_active = 0;

	var TodoApp = {
		init: function(){
			var $setUpUser = $.ajax({
				type: "POST",
				url: "controllers/UserController.php",
				data: { action: "setUpUser" }
			});

			$setUpUser.success(function( user ){
				console.log(user);
				global_user = jQuery.parseJSON(user);
				TodoApp.getItems();
			});

			this.bindElements();
			this.bindEvents();
		},

		bindElements: function(){
			this.$newTodo = $('.new-todo');
			this.$todoList = $('.todo-list');
			this.$activeItemsNumber = $('.activeItemsNumber');
			this.$header = $('#header');
		},

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
					console.log(items);
				}
			});
		},

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

		activeCount: function(){
			global_active = 0;
			$.each(this.$todoList.find('li'), function(){
				if( $(this).attr('data-completed') == 'false' ) global_active++;
			});
			
			return global_active;
		},

		createItem: function(e){
			var $input_val = $.trim($(this).val());

			if( e.which !== 13 || !$input_val ) return;

			$.ajax({
				type: "POST",
				beforeSend: function(){ $('.loaderNewTodo').toggle(); },
				url: "controllers/ItemController.php",
				data: { action: 'addItem', item_title: $input_val, item_status: false, user_id: global_user.user_id },
				success: function(item_id){
					var data = [{ item_id: item_id, item_title: $input_val, item_status: 'false' }];
					$('.loaderNewTodo').toggle();
					TodoApp.appendItem(data);
					TodoApp.$activeItemsNumber.html(++global_active);
				}
			});

			$(this).val('');
		},

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

		processView: function(data){
			var notcomplete = '<input type="checkbox" class="complete-todo"><label>' + data.item_title + '</label><p class="destroy-todo">x</p>',
				complete = '<input type="checkbox" class="complete-todo" checked="checked"><label class="complete">' + data.item_title + '</label><p class="destroy-todo">x</p>';
			
			return data.item_status == 'false' ? notcomplete: complete;
		},

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

		completeItem: function(){
			var $itemLabel = $(this).parent().find('label');
			$(this).is(':checked') ? $itemLabel.addClass('complete') : $itemLabel.removeClass('complete');
			
			TodoApp.updateComplete($(this));
		},

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

		toggleLoader: function( el ){
			el.find('.loaderItems').toggle();
		}
	}

	TodoApp.init();

	$('.logout').hover(function(){
		$('.logoutHelper').animate({ opacity: 1, left: '30px' });
	}, function(){
		$('.logoutHelper').animate({ opacity: 0, left: '25px' });
	});

	$('.logoutBtn').on('click', function(e){
		e.preventDefault();

		var link = $(this).attr('href');

		$.ajax({ 
			url: "logout.php", 
			success: function(data){ window.location.href = link; }
		});
	});

	$('.logoutHelper').on('click', function(e){
		e.preventDefault();

		var link = $(this).attr('href');

		$.ajax({ 
			url: "logout.php", 
			success: function(data){ window.location.href = link; }
		});
	});
});