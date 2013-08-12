<div class="wrapper">
  <div class="container-init">
    <div class="content">
        <div class="greeting">
          <p class="dare">DARE</p>
          <p class="organizing">TO ORGANIZE</p>
          <p class="yourlife">YOUR LIFE!</p>
          <p class="loginTitle">Login with:</p>
          <a class="fb" data-href="<?php echo $loginUrl; ?>"></a>
        </div>
        <div class="arrow_down_init"></div>
    </div>
  </div>
</div>
<script>
	 $('.fb').on('click', function(e){
	    e.preventDefault();

	    var link = $(this).attr('data-href');

	    $.ajax({ 
	      url: "public/login.php", 
	      success: function(data){ if(data) { window.location.href = link; } }
	    });
	  });
</script>