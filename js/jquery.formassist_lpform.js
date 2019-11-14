(function($){
    $(function(){
        //?????¨­å®?
        var class_id = $(":radio[name='class_id']");
        var class_check = $("*[name='class_check']");
        var order_name01 = $('#order_name01');
        var order_name02 = $('#order_name02');
        var order_kana01 = $('#order_kana01');
        var order_kana02 = $('#order_kana02');
        var order_zip01 = $('#order_zip01');
        var order_zip02 = $('#order_zip02');
        var order_pref = $('#order_pref');
        var order_addr01 = $('#order_addr01');
        var order_addr02 = $('#order_addr02');
        var order_tel01 = $('#order_tel01');
        var order_tel02 = $('#order_tel02');
        var order_tel03 = $('#order_tel03');
        var order_email = $('#order_email');
        var order_sex = $(":radio[name='order_sex']");
        var order_sex_check = $('#order_sex_check');
        var order_birth_year = $('#order_birth_year');
        var order_birth_month = $('#order_birth_month');
        var order_birth_day = $('#order_birth_day');
        var deliv_id = $(":radio[name='deliv_id']");
        var deliv_check = $("*[name='deliv_check']");
        var payment_id = $(":radio[name='payment_id']");
        var payment_check = $("*[name='payment_check']");

        var order_er_receipt_type = $(":radio[name='order_er_receipt_type']");
        var order_er_pref = $('#order_er_pref');
        var order_er_customer_addr = $('#order_er_customer_addr');
        var order_er_customer_identifier = $('#order_er_customer_identifier');
        var order_er_love_code = $('#order_er_love_code');

        var deliv_time_id0 = $('#deliv_time_id0');
        var message = $('#message');

        var err_dynamic_class_id = $('#err_dynamic_class_id');
        var err_dynamic_name = $('#err_dynamic_name');
        var err_dynamic_kana = $('#err_dynamic_kana');
        var err_dynamic_zip = $('#err_dynamic_zip');
        var err_dynamic_pref = $('#err_dynamic_pref');
        var err_dynamic_addr01 = $('#err_dynamic_addr01');
        var err_dynamic_addr02 = $('#err_dynamic_addr02');
        var err_dynamic_tel = $('#err_dynamic_tel');
        var err_dynamic_email = $('#err_dynamic_email');
        var err_dynamic_sex = $('#err_dynamic_sex');
        var err_dynamic_birth = $('#err_dynamic_birth');
        var err_dynamic_deliv = $('#err_dynamic_deliv');
        var err_dynamic_payment = $('#err_dynamic_payment');

        required_check();

        order_name01.focusin(function(){ err_check("class_id"); });
        order_name02.focusin(function(){ err_check("name01"); });
        order_kana01.focusin(function(){ err_check("name02"); });
        order_kana02.focusin(function(){ err_check("kana01"); });
        order_zip01.focusin(function(){ err_check("kana02"); });
        order_zip02.focusin(function(){ err_check("kana02"); });
        order_pref.focusin(function(){ err_check("zip"); });
        order_addr01.focusin(function(){ err_check("pref"); });
        order_addr02.focusin(function(){ err_check("addr01"); });
        order_tel01.focusin(function(){ err_check("addr02"); });
        order_tel02.focusin(function(){ err_check("addr02"); });
        order_tel03.focusin(function(){ err_check("addr02"); });
        order_email.focusin(function(){ err_check("tel"); });
        // order_sex.focusin(function(){ err_check("email"); });
        order_birth_year.focusin(function(){ err_check("sex"); });
        order_birth_month.focusin(function(){ err_check("sex"); });
        order_birth_day.focusin(function(){ err_check("sex"); });
        deliv_id.focusin(function(){ err_check("birth"); });
        payment_id.focusin(function(){ err_check("deliv"); });
        deliv_time_id0.focusin(function(){ err_check("payment"); });
        message.focusin(function(){ err_check("payment"); });

        order_er_receipt_type.focusin(function(){ err_check("addr02"); });
        order_er_customer_addr.focusin(function(){ err_check("addr02"); });
        order_er_customer_identifier.focusin(function(){ err_check("addr02"); });
        order_er_love_code.focusin(function(){ err_check("addr02"); });

        class_id.change(function(){ resetPaymentList(); required_check(); err_check("class_id"); });
        order_name01.focusout(function(){ required_check(); err_check("name01"); });
        order_name02.focusout(function(){ required_check(); err_check("name02"); });
        // order_kana01.focusout(function(){ required_check(); err_check("kana01"); });
        // order_kana02.focusout(function(){ required_check(); err_check("kana02"); });
        order_zip01.focusout(function(){ required_check(); err_check("kana02"); });
        order_zip02.focusout(function(){ required_check(); err_check("zip"); });
        order_pref.focusout(function(){ required_check(); err_check("pref"); });
        order_addr01.focusout(function(){ required_check(); err_check("addr01"); });
        order_addr02.focusout(function(){ required_check(); err_check("addr02"); });
        order_tel01.focusout(function(){ required_check(); err_check("addr02"); });
        order_tel02.focusout(function(){ required_check(); err_check("addr02"); });
        order_tel03.focusout(function(){ required_check(); err_check("tel"); });
        order_email.focusout(function(){ required_check(); err_check("email"); });
        // order_sex.focusout(function(){ required_check(); err_check("sex"); });
        order_birth_year.change(function(){ required_check(); err_check("sex"); });
        order_birth_month.change(function(){ required_check(); err_check("sex"); });
        order_birth_day.change(function(){ required_check(); err_check("birth"); });

        order_er_receipt_type.focusout(function(){ required_check(); err_check("addr02"); });
        order_er_pref.focusout(function(){ required_check(); err_check("addr02"); });
        order_er_customer_addr.focusout(function(){ required_check(); err_check("addr02"); });
        order_er_customer_identifier.focusout(function(){ required_check(); err_check("addr02"); });
        order_er_love_code.focusout(function(){ required_check(); err_check("addr02"); });

        order_er_receipt_type.change(function(){ required_check(); err_check("addr02"); });
        order_er_pref.change(function(){ required_check(); err_check("addr02"); });
        order_er_customer_addr.change(function(){ required_check(); err_check("addr02"); });
        order_er_customer_identifier.change(function(){ required_check(); err_check("addr02"); });
        order_er_love_code.change(function(){ required_check(); err_check("addr02"); });

        $('#Button1').click(function(){ required_check(); err_check("addr02"); });
        $('#Button2').click(function(){ required_check(); err_check("addr02"); });
        $('#Button1').focusout(function(){ required_check(); err_check("addr02"); });
        $('#Button2').focusout(function(){ required_check(); err_check("addr02"); });

        $(function() {
            // var topBtn = $('#required-box');
            // topBtn.hide();
            $(window).scroll(function () {
                var off = $('#form1').offset();
                if ($(this).scrollTop() > off.top - 1) {
                    required_check();
                }
            });
        });

        order_er_customer_addr.change(function(){ required_check(); });

        deliv_id.change(function(){ required_check(); err_check("deliv"); });
        payment_id.change(function(){ required_check(); err_check("payment"); });
        deliv_time_id0.change(function(){ required_check(); err_check("payment"); });
        message.focusout(function(){ required_check(); err_check("payment"); });

        payment_check.css("background", "#ffe8e8");
        deliv_check.css("background", "#ffe8e8");
            order_er_receipt_type.css("background", "#ffe8e8");
            order_er_customer_addr.css("background", "#ffe8e8");
            order_er_customer_identifier.css("background", "#ffe8e8");
            order_er_love_code.css("background", "#ffe8e8");
        order_birth_year.css("background", "#ffe8e8");
        order_birth_month.css("background", "#ffe8e8");
        order_birth_day.css("background", "#ffe8e8");
        order_email.css("background", "#ffe8e8");
        order_tel01.css("background", "#ffe8e8");
        order_tel02.css("background", "#ffe8e8");
        order_tel03.css("background", "#ffe8e8");
        order_addr02.css("background", "#ffe8e8");
        order_addr01.css("background", "#ffe8e8");
        order_pref.css("background", "#ffe8e8");
        order_zip01.css("background", "#ffe8e8");
        order_zip02.css("background", "#ffe8e8");
        order_kana01.css("background", "#ffe8e8");
        order_kana02.css("background", "#ffe8e8");
        order_name01.css("background", "#ffe8e8");
        order_name02.css("background", "#ffe8e8");
        class_check.css("background", "#ffe8e8");

        function err_check(check_level){
            switch(check_level){
                case "payment":
                    if(!$(":radio[name='payment_id']:checked").val()){
                        err_dynamic_payment.show();
                        payment_check.css("background", "#ffe8e8");
                    }
                    else{ 
                        err_dynamic_payment.hide(); 
                        payment_check.css("background", "#fff");
                    }
                case "deliv":
                    if(!$(":radio[name='deliv_id']:checked").val()){ 
                        err_dynamic_deliv.show(); 
                        deliv_check.css("background", "#ffe8e8");
                    }
                    else{
                        err_dynamic_deliv.hide();
                        deliv_check.css("background", "#fff");
                    }
                case "zip":
                    if(order_zip01.val() == ""){ 
                        err_dynamic_zip.show(); 
                        order_zip01.css("background", "#ffe8e8"); 
                        order_zip02.css("background", "#ffe8e8"); 
                    }
                    else{ 
                        err_dynamic_zip.hide(); 
                        order_zip01.css("background", "#fff"); 
                        order_zip02.css("background", "#fff"); 
                    }
                case "birth":
                    if(order_birth_year.val() == "" || order_birth_month.val() == "" || order_birth_day.val() == ""){ 
                        err_dynamic_birth.show(); 
                        order_birth_year.css("background", "#ffe8e8"); 
                        order_birth_month.css("background", "#ffe8e8"); 
                        order_birth_day.css("background", "#ffe8e8"); 
                    }
                    else{ 
                        err_dynamic_birth.hide(); 
                        order_birth_year.css("background", "#fff"); 
                        order_birth_month.css("background", "#fff"); 
                        order_birth_day.css("background", "#fff"); 
                    }
                case "email":
                    if(order_email.val() == "" || !order_email.val().match(/.+@.+\..+/)){ 
                        err_dynamic_email.show(); 
                        order_email.css("background", "#ffe8e8"); 
                    }
                    else{ 
                        err_dynamic_email.hide(); 
                        order_email.css("background", "#fff"); 
                    }
                case "tel":
                    if(order_tel01.val() == "" || !order_tel01.val().match("^[0-9]{8,13}$")){ 
                        err_dynamic_tel.show(); 
                        order_tel01.css("background", "#ffe8e8"); 
                        order_tel02.css("background", "#ffe8e8"); 
                        order_tel03.css("background", "#ffe8e8"); 
                    }
                    else{ 
                        err_dynamic_tel.hide(); 
                        order_tel01.css("background", "#fff"); 
                        order_tel02.css("background", "#fff"); 
                        order_tel03.css("background", "#fff"); 
                    }
                case "addr02":
                    if(order_addr02.val() == ""){ 
                        err_dynamic_addr02.show(); 
                        order_addr02.css("background", "#ffe8e8"); 
                    }
                    else{ 
                        err_dynamic_addr02.hide(); 
                        order_addr02.css("background", "#fff"); 
                    }
                case "addr01":
                    if(order_addr01.val() == ""){ 
                        err_dynamic_addr01.show(); 
                        order_addr01.css("background", "#ffe8e8"); 
                    }
                    else{ 
                        err_dynamic_addr01.hide(); 
                        order_addr01.css("background", "#fff"); 
                    }
                case "pref":
                    if(order_pref.val() == ""){ 
                        err_dynamic_pref.show(); 
                        order_pref.css("background", "#ffe8e8"); 
                    }
                    else{ 
                        err_dynamic_pref.hide(); 
                        order_pref.css("background", "#fff"); 
                    }
                case "zip":
                    if(order_zip01.val() == ""){ 
                        err_dynamic_zip.show(); 
                        order_zip01.css("background", "#ffe8e8"); 
                        order_zip02.css("background", "#ffe8e8"); 
                    }
                    else{ 
                        err_dynamic_zip.hide(); 
                        order_zip01.css("background", "#fff"); 
                        order_zip02.css("background", "#fff"); 
                    }
                case "name":
                    if(order_name01.val() == "" || order_name02.val() == ""){ 
                        err_dynamic_name.show(); 
                        order_name01.css("background", "#ffe8e8"); 
                        order_name02.css("background", "#ffe8e8"); 
                    }
                    else{ 
                        err_dynamic_name.hide(); 
                        order_name01.css("background", "#fff"); 
                        order_name02.css("background", "#fff"); 
                    }
                case "class_id":
                    if(!$(":radio[name='class_id']:checked").val()){
                        err_dynamic_class_id.show();
                        class_check.css("background", "#ffe8e8");
                    }
                    else{ 
                        err_dynamic_class_id.hide(); 
                        class_check.css("background", "#fff");
                    }
            }
        }
        function required_check(){
            no_inputs = 0;
            if(!$(":radio[name='payment_id']:checked").val()) no_inputs++;
            if(!$(":radio[name='order_er_receipt_type']:checked").val()) no_inputs++;
            if(order_birth_year.val() == "" || order_birth_month.val() == "" || order_birth_day.val() == "") no_inputs++;
            if(order_email.val() == "" || !order_email.val().match(/.+@.+\..+/)) no_inputs++;
            if(order_tel01.val() == "" || !order_tel01.val().match("^[0-9]{8,13}$")) no_inputs++;
            if(order_pref.val() == "" || order_addr01.val() == "") no_inputs++;
            if(order_zip01.val() == "") no_inputs++;
            if(order_name01.val() == "" || order_name02.val() == "") no_inputs++;

            if($('input[name=order_er_receipt_type]:checked').val() == 1) {
                if(order_er_pref.val() == "" || order_er_customer_addr.val() == "") no_inputs++;
            }
            if($('input[name=order_er_receipt_type]:checked').val() == 2) {
                ??if(order_er_customer_identifier.val() == "") no_inputs++;
            }
            if($('input[name=order_er_receipt_type]:checked').val() == 3) {
                ??if(order_er_love_code.val() == "") no_inputs++;
            }
            if(!$(":radio[name='class_id']:checked").val()) no_inputs++;
           
            if (no_inputs != 0) {
                $('#required-count').html("??????¨ã??   <br/>å°????<span> " +  no_inputs + "</span> ?????å¡«å¯«");
                $('#required-count').css("background", "rgba(255, 0, 0, 0.62)");
                $('#required-count').css("font-size", "15px");
                $("#css3button1").css("background-color", "gray");
                $("#css3button1").attr('disabled', 'disabled');
            } else {
                $('#required-count').html("è¾??????!  è¨???å·²ç??¡«å¯«å????");
                $('#required-count').css("background", "rgba(50, 205, 50, 0.64)");
                $('#required-count').css("font-size", "15px");
                $('#css3button1').css("background-color", "#65b714");
                $("#css3button1").removeAttr('disabled');

            }
        }

        function resetPaymentList() {
            if ($(":radio[name='payment_id']:checked").length != 0) {
                $(":radio[name='payment_id']:checked").attr('checked', false);
                err_check("payment");
            }
        }

    });
})(jQuery);