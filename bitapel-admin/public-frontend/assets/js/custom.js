(function($) {

	// prettyPhoto
	jQuery(document).ready(function(){
		jQuery('a[data-gal]').each(function() {
			jQuery(this).attr('rel', jQuery(this).data('gal'));
		});  	
		jQuery("a[data-rel^='prettyPhoto']").prettyPhoto({animationSpeed:'slow',theme:'light_square',slideshow:false,overlay_gallery: false,social_tools:false,deeplinking:false});
	}); 

	$('#registerButton').click(function(e){

		e.preventDefault();

		var firstName = $('#firstName').val();
		var lastName = $('#lastName').val();
		var email = $('#email').val();
		var password = $('#password').val();
		var confirmPassword = $('#confirmPassword').val();

		if(password !== confirmPassword){
			alert("Passwords don not match !");
			return;
		}

		var newUser = {
			"firstName" : firstName,
			"lastName" : lastName,
			"email" : email,
			"password" : password
		}

		$.ajax({
			type: 'POST',
			url: '/api/user/register',
			contentType: "application/json",
			dataType: 'json',			
			data: JSON.stringify(newUser),
			success: function(data) {
				if(data._id.length > 0){
					window.location = "/admin-frontend/index.html";	
				}
			}
		});
	});
		
})(jQuery);