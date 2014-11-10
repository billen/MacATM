$(document).ready(function(){
    console.log('loaded');
    
    /*enable key pad for the ids below*/
    initAtmKeyPad(['#accessCardText', '#pinText']);
    
    /*fous on accesscard inout field on page load*/
    $('#accessCardText').focus();
    
    /*json of mock user accounts data*/
    var json = {
        "Account1":[
            {"Number":"1234567","Amount":"20.00", "Type":"Chequing"},
            {"Number":"1234568","Amount":"60.00", "Type":"Chequing"},
            {"Number":"1234569","Amount":"70.00", "Type":"Savings"},
            {"Number":"1234560","Amount":"75.00", "Type":"Savings"},
            {"Number":"1234564","Amount":"80.00", "Type":"Savings"}
    ]};
   
});

/*Page view manageer functions and variables*/
var viewController = new PageViewManager({
    pages : {
        login: '#atm_page_login',
        home: '#atm_account_select',
        account: '#atm_single_account_view',
        trans_withdraw: '#atm_withdraw',
        trans_deposit: '#atm_deposit',
        
    },
    
    startPage : 'login'
                                     
});

/*Page navigation helpers*/
function goToPage(pageName) {
    viewController.goToPage(pageName);
}

/*Page navigation helpers*/
function goBackOnePage() {
    viewController.goBack();
}


var confirmEnable = false;

function addString(input, targetId) {
    
    targetId = '#'+targetId;
    
	var value = $(targetId).val();
    var string = $(input).html();
    
    console.log(value);

	if (value.length + 1 <= 4){
		$(targetId).val(value + string);
		if (value.length + 1 == 4){
		  $('#confirmButton').removeClass('btn-inverse').addClass('btn-success');
		  confirmEnable = true;	
		}
	}

}

function correct(targetId) {
    targetId = '#'+targetId;
	var value = $(targetId).val();
	$(targetId).val(value.substring(0,value.length-1));
	 $('#confirmButton').addClass('btn-inverse').removeClass('btn-success');
}

function cancel (targetId) {
    targetId = '#'+targetId;
	$(targetId).val("");
	 $('#confirmButton').addClass('btn-inverse').removeClass('btn-success');
}

function confirm () {
	value = $('#pinText').val();
	//if (value.length == 4 && confirmEnable == true){	
		goToPage("home");
	//} 
}



function PageViewManager(options) {
    var t = this;
    /*Current page*/
    t.currPage = options.startPage;
    t.nextPage = t.currPage;
    t.prevPage = t.currPage;
    t._pageList = new PageList(options.pages);
    
    t.goToPage = function(pageName) {
        if(options.pages && options.pages[pageName]){
            t.prevPage = t.currPage;
            t.currPage = pageName;
       
            $(options.pages[t.prevPage]).toggle('slide');
   	 	    $(options.pages[t.currPage]).show().removeClass('atm_hide');
        }
    };
    
    t.goBack = function(){
        t.goToPage(t.prevPage);
    }
   
}

function PageList(listItems) {
    var t = this;
    t.list = [];
    //t.listItems = listItems;
    
    /*Set list of pages*/
    t.setList = function(_listItems) {
        t.listItems = _listItems;
        if(typeof t.listItems == 'object') {
            for(key in t.listItems) {        
                t.list[key] = t.listItems[key];
            }
        }
    };
    
    /*Get item by name or by index. TODO: fix bug when getting by age index*/
    t.getItem = function(item) {
        if(typeof item == 'number' && t.list.length > item) {
            var count = 0;
            for(key in t.list) {
                if(count == item) return t.list[key];
                count = count + 1;
            }
        }else {
            return t.list[item];
        }
    };
    
    t.setList(listItems);
}

/*parent container for the ATM*/
var ATM_UI_WINDOW = '#atm_master_container';

function getKeyPad(elem) {
    /*the ID of the input elemnt to append keypad input to*/
    var targetElemId = $(elem).attr('id');
    
    var keyPad = $('<table class = "table table-bordered"/>');
    
    /*num is the key pad number starting from 1*/
    var num = 1;
    var row = undefined;
    
    /*For loop to define the first three columns ie 1-9*/
    for(var i = 0; i < 3; i++) {
        
        row = $('<tr />');
        
        for(var c = 0; c < 3; c++){
            var e = $('<td />');
            e.html(num);
            num = num + 1;
            $(e).click(function(){
                addString(this, targetElemId);
            });
        
            $(row).append(e);
        }
    
        $(keyPad).append(row);

    }
    
    /*add the last row: Cancel 0 Correct*/
    
    row = $('<tr  />');
    
    var e = $('<td />');
    e.html("Correct");
    $(e).click(function(){
        correct(targetElemId);
    });
        
    $(row).append(e);
    
    e = $('<td />');
    e.html(0);
    $(e).click(function(){
        addString(this, targetElemId);
    });
        
    $(row).append(e);
    
    e = $('<td />');
    e.html("Cancel");
    $(e).click(function(){
        cancel(targetElemId);
    });
        
    $(row).append(e);
    
    $(keyPad).append(row);
    
    
    var ret = $('<span id="atm_keypad_span"/>').append($('<div id="atm_keypad" />').append(keyPad));
    
    //ret.offset().top = elem.offsetBottom;
    var _top = elem.offsetTop + ($(elem).outerHeight());
    var _left = $(ATM_UI_WINDOW).offset().left + 5; // atm window offset + 5px for padding;
    var _width = $(ATM_UI_WINDOW).outerWidth() - 10; //atm window width - 5 for padding  - 5 to correct for left offset
    
    $(ret).css({position: 'absolute', top: (_top+'px') , left: (_left+'px'), margin: '0', width: (_width+'px'), height: 'auto'});
    
    return  ret;  
}

var keepKeypadAlive = false;

function showAtmKeyPad(elem, keypadClick){
    var keyPad = $(getKeyPad(elem));
    
    $(keyPad).click(keypadClick);
    
    $(elem).parent().append(keyPad);
}

function removeAtmKeyPad(){
    $('#atm_keypad_span').remove();
}

function initAtmKeyPad(inputIds/*array containing ids of input that require the key pad*/) {
    
    $(inputIds).each(function(key, value){
        $(value).focus(function(event){
            showAtmKeyPad(this, function () {
                //console.log('click keypad');
                //console.log(arguments);
                if(!keepKeypadAlive){
                    keepKeypadAlive = true;
                }
            });
            
            keepKeypadAlive = true;
        })
        .focusout(function(){
            keepKeypadAlive = false;
        });
    });
    
    $(document).click(function () {
        //console.log('click document');
        //console.log(arguments);
        if (!keepKeypadAlive){
            removeAtmKeyPad();
        }else{
            keepKeypadAlive = false;
        }
    });
}