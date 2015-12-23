

window.onload = function(){
	$('body').fadeIn(3000, function() {
        //alert('ani done');
        var vl = $('nav').children();
        var cnt =0,lgt=20;
       	vlinks=setInterval(function () {
       		$(vl[cnt]).css("left",lgt+"%");
   			lgt=lgt+15;
        	$(vl[cnt]).slideDown(300, function() {
   			 	++cnt;

   			 	if(cnt==4)clearInterval(vlinks);;
  			});
    	}, 400);
			loadthree();
      });
      	var myVar = setInterval(function(){myTimer();}, 5000);

		function myTimer() {
		 	var r = Math.floor(Math.random() * 256);
		    document.getElementById("apear").innerHTML =  "<span id='stdone' style='font-family:Wingdings;display:none;'>"+String.fromCharCode(r)+"</span>";
		    $('#stdone').fadeIn(4000);
		}
    $('#welcon').css("display","block");
  var str=window.location.toString().split("#")[1];
  $("#"+str+"link").click();

};

function checkactive(e){
  var str=$(e).attr('href');
  $('html, body').animate({
       scrollTop: $(str).offset().top
   }, 2000);
  var tri=$(".activelink").siblings('#activeind');
  $(".activelink").siblings('br').remove();
  $(".activelink").removeClass('activelink');
  $(e).addClass('activelink');
  $(e).parent().append("<br/>");
  $(e).parent().append(tri);
}

function loadcon (e) {
	$("#sideholder").children(".activebutton").removeClass("activebutton");
	$(e).addClass("activebutton");
  	$('#conholder').children(".selected").fadeOut(1000).removeClass("selected");
  	var a = $(e).attr("datafld");
	$('#'+a).fadeIn(2000).addClass("selected");
}
