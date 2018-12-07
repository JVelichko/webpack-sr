import './index.scss';

$(function () {

    // init the validator
    // validator files are included in the download package
    // otherwise download from http://1000hz.github.io/bootstrap-validator

    $("#form_phone").inputmask({
			mask: "+7 (999) 999-9999",
			greedy: true,
			keepStatic: true/* ,
			"oncomplete": function(){
			$( "#phone_num" ).removeClass( "incomplete_p" );
			$( "#phone_num" ).addClass( "complete_p" );
				console.log('inputmask complete');
			},
			"onincomplete": function(){
			$( "#phone_num" ).removeClass( "complete_p" );
			$( "#phone_num" ).addClass( "incomplete_p" );
				console.log('inputmask incomplete');
			} */
		});


$('#contact-form').validator({

    custom: {
        'distance': function() {
            if( $("#form_phone").inputmask("isComplete") == false){
                console.log("ERROR")
                return "Введите номер телефона";
            }
        }
    },
    errors: {
        'distance': "Nope"
    }
})


    // when the form is submitted
    $('#contact-form').on('submit', function (e) {

        // if the validator does not prevent form submit
        if (!e.isDefaultPrevented()) {
            var url = "/inc/contact-2.php";

            // POST values in the background the the script URL
            $.ajax({
                type: "POST",
                url: url,
                data: $(this).serialize(),
                success: function (data)
                {
                    // data = JSON object that contact.php returns

                    // we recieve the type of the message: success x danger and apply it to the
                    var messageAlert = 'alert-' + data.type;
                    var messageText = data.message;

                    // let's compose Bootstrap alert box HTML
                    var alertBox = '<div class="alert ' + messageAlert + ' alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + messageText + '</div>';

                    // If we have messageAlert and messageText
                    if (messageAlert && messageText) {
                        // inject the alert to .messages div in our form
                        $('#contact-form').find('.messages').html(alertBox);
                        // empty the form
                        $('#contact-form')[0].reset();
                    }
                }
            });
            return false;
        }
    })
});
