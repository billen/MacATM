$(document).ready(function(){
    console.log('loaded');

});

var confirmEnable = false;

function addString(string) {
	var value = $('#pinText').val();

	if (value.length + 1 <= 4){
		$('#pinText').val(value + string);
		if (value.length + 1 == 4){
		  $('#confirmButton').removeClass('btn-inverse').addClass('btn-success');
		  confirmEnable = true;	
		}
	}




}

function correct() {
	var value = $('#pinText').val();
	$('#pinText').val(value.substring(0,value.length-1));
	 $('#confirmButton').addClass('btn-inverse').removeClass('btn-success');
}

function cancel () {
	$('#pinText').val("");
	 $('#confirmButton').addClass('btn-inverse').removeClass('btn-success');
}

function confirm () {
	value = $('#pinText').val();
	if (value.length == 4 && confirmEnable == true)
	{
		
		$('#atm_page_login').toggle('slide');
   	 	$(pages['home']).show().removeClass('atm_hide');
	}
   
    
}

 var pages = {
        login: '#atm_page_login',
        home: '#atm_account_select',
        
    
    }
function pageViewManager() {
    
   
    var currentPage;
    var nextPage;
    var prevPage;
    
} 

