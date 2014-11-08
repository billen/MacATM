$(document).ready(function(){
    console.log('loaded');
});

function addString(string) {
	var value = $('#pinText').val();

	if (value.length + 1 <= 4){
		$('#pinText').val(value + string);
		if (value.length + 1 == 4)
		  $('#confirmButton').removeClass('btn-inverse').addClass('btn-success');	
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
    $('#atm_page_login').hide("slow");
    $('#atm_page_home').show();
    
}


function pageViewManager() {
    
    var pages = {
        login: 'atm_page_login',
        home: 'atm_page_home',
        
    
    }
    var currentPage;
    var nextPage;
    var prevPage;
    
    
}