$(document).ready(function(){
    console.log('loaded');
     var json = {"Account1":[
	{"Number":"1234567","Amount":"20.00", "Type":"Chequing"},
	{"Number":"1234568","Amount":"60.00", "Type":"Chequing"},
	{"Number":"1234569","Amount":"70.00", "Type":"Savings"},
	{"Number":"1234560","Amount":"75.00", "Type":"Savings"},
	{"Number":"1234564","Amount":"80.00", "Type":"Savings"}
]};
     console.log(json);
   
});

var confirmEnable = false;

function addString(string,id) {
	var value = $('#pinText').val();

	if (value.length + 1 <= 4){
		$(id).val(value + string);
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

