$(document).ready(function(){
    console.log('loaded');
    
    /*enable key pad for the ids below*/
    initAtmKeyPad(['#accessCardText', '#pinText']);
    
    //viewController.goToPage(viewController.startPage, $('#accessCardText').focus);
    
    
    $('#accessCardText').focus();
    
    
    /*fous on accesscard inout field on page load*/
    //();
    
    /*json of mock user accounts data*/
    var jsonArray = {"accounts": [
            {"Number":"123-45-67","Amount":"$20000", "Type":"Chequing"},
            {"Number":"123-45-68","Amount":"$6000", "Type":"Chequing"},
            {"Number":"123-45-69","Amount":"$7000", "Type":"Savings"},
            {"Number":"123-45-61","Amount":"$7500", "Type":"Savings"},
    ]};

    addAttribute(['#accountNum1','#accountNum2','#accountNum3','#accountNum4'],jsonArray,"Number");
    addAttribute(['#amountNum1','#amountNum2','#amountNum3','#amountNum4'],jsonArray,"Amount");
   
});

/*Globals/CONSTANTS
*************/

/*parent container for the ATM*/
var ATM_UI_WINDOW = '#atm_master_container';


var confirmEnable = false;

/*Page view manageer functions and variables*/
var viewController = new PageViewManager({
    pages : {
        login: '#atm_page_login',
        home: '#atm_account_select',
        account: '#atm_single_account_view',
        trans_withdraw: '#atm_withdraw',
        trans_deposit: '#atm_deposit',
        
    },
    navBar : {
        home: {
            /*logout: function(){
                goToPage('login');
            },
            account: function(){
                goToPage('trans_withdraw');
            }*/
        },
        account: {
            back: goBackOnePage
        },
        trans_withdraw: {
            back: goBackOnePage
        },
        trans_deposit: {
            back: goBackOnePage
        },
        
        
    },
    startPage : 'login'
                                     
});


/*
main helper functions for controlling calender view
*******************************************************/
/*Page navigation helpers*/
function goToPage(pageName, callback) {
    viewController.goToPage(pageName, callback);
}

/*Page navigation helpers*/
function goBackOnePage(callback) {
    viewController.goBack(callback);
}

/*end main helper functions for controlling calender view
*****************************************************/

function addString(input, targetId) {
    
    targetId = '#'+targetId;
    
	var value = $(targetId).val();
    var string = $(input).html();

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

/*
******************************************************
helper function for authenticating login
*******************************************************/
function confirm () {
	value = $('#pinText').val();
	//if (value.length == 4 && confirmEnable == true){	
		goToPage("home");
	//} 
}
/*
End Globals/CONSTANTS
*************************************************************************************************************/


/*
******************************************************
Page navigation classes/functions
*******************************************************/

function PageViewManager(options) {
    var t = this;
    /*Current page*/
    t.currPage = options.startPage;
    t.nextPage = t.currPage;
    t.prevPage = t.currPage;
    t._pageList = new PageList(options.pages);
    t.startPage = options.startPage;
    
    t.goToPage = function(pageName, callback) {
        var ret = undefined;
        if(options.pages && options.pages[pageName]){
            t.prevPage = t.currPage;
            t.currPage = pageName;
       
            $(options.pages[t.prevPage]).hide();//toggle('slide');
   	 	    $(options.pages[t.currPage]).show('slow').removeClass('atm_hide');
            
        }
        
        if(options.navBar && options.navBar[pageName]){
            
            showAtmNavBar(options.navBar[pageName]);
        }else{
            removeAtmNavBar();
        }
        
        if(callback && typeof callback == 'function') {
            //callback();
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
/*
******************************************************************************************/


/*
********************************************************
HTML Object/Builder functions for dynamic content/behaviour
********************************************************/


/*
*  inputIDs = the ids for the html elements that you want to replace with account numbers
*  json = The json which will contain the account numbers, and balances. JSON should be ordered aligning with the inputIDs
*/

function addAttribute(inputIDs,json,attribute) {
    
    data = json.accounts;
    count = 0;
    for (id in inputIDs) {
        $(inputIDs[id]).html(data[count][attribute]);
        count++;

    }

}

function showAtmKeyPad(elem, keypadClick) {
    removeAtmKeyPad();
    var keyPad = $(getKeyPad(elem));
    
    $(keyPad).click(keypadClick);
    
    $(elem).parent().append(keyPad);
}

function removeAtmKeyPad() {
    $('#atm_keypad_span').remove();
}

function showAtmNavBar(navItems/*object containing nav bar and callback function*/) {
    removeAtmNavBar();
    $('#atm_nav_bar').append(getAtmNavBar(navItems));
}

function removeAtmNavBar() {
    $('#atm_nav_bar').find('.navbar').remove();
}

function getKeyPad(elem) {
    /*the ID of the input elemnt to append keypad input to*/
    var targetElemId = $(elem).attr('id');
    
    var keyPad = $('<table class = ""/>');
    
    /*num is the key pad number starting from 1*/
    var num = 1;
    var row = undefined;
    
    /*For loop to define the first three columns ie 1-9*/
    for(var i = 0; i < 3; i++) {
        
        row = $('<tr />');
        
        for(var c = 0; c < 3; c++){
            var e = $('<td class="btn btn-info"/>');
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
    
    
    var e = $('<td class="btn btn-danger"/>');
    e.html("Clear");
    $(e).click(function(){
        cancel(targetElemId);
    });
        
    $(row).append(e);
    
    e = $('<td class="btn btn-info"/>');
    e.html(0);
    $(e).click(function(){
        addString(this, targetElemId);
    });
        
    $(row).append(e);
    
    e = $('<td class="btn btn-warning"/>');
    e.html("Correct");
    $(e).click(function(){
        correct(targetElemId);
    });
        
    $(row).append(e);
    
    $(keyPad).append(row);
    
   /* <div class="alert alert-danger alert-dismissible fade in" role="alert">
      <button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
      <button type="button" class="btn btn-danger">Take this action</button>
      <button type="button" class="btn btn-default">Or do this</button>
    </div>*/
        
    var ret = $('<span id="atm_keypad_span"/>').append($('<div id="atm_keypad" class="alert"/>')
                                                       .append('<button type="button" class="close" onclick="removeAtmKeyPad()"><span >×&nbsp;&nbsp;</span><span class="sr-only">Close</span></button>')
                                                       .append(keyPad));
    
    //ret.offset().top = elem.offsetBottom;
    var _top = elem.offsetTop + ($(elem).outerHeight());
    var _left = $(ATM_UI_WINDOW).offset().left + 50; // atm window offset + 5px for padding;
    var _width = $(ATM_UI_WINDOW).outerWidth() - 100; //atm window width - 5 for padding  - 5 to correct for left offset
    
    $(ret).css({position: 'absolute', top: (_top+'px') , left: (_left+'px'), margin: '0', width: (_width+'px'), height: 'auto'});
    
    return  ret;  
}

var keepKeypadAlive = false;

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
        .focusout(function(event){
            //console.log(event);
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

/*ATM nav bar*/
function getAtmNavBar(navItems/*array of nav options*/) {
    
    var nav = $('<nav class="navbar navbar-default" role="navigation">');
    
    var temp_div_container = $('<div class="container">');
    
    var temp_div = $('<div class="navbar-header">')
        .append(
            $('<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-7">')
                .append('<span class="sr-only">Toggle navigation</span>')
                .append('<span class="icon-bar"></span>')
                .append('<span class="icon-bar"></span>')
                .append('<span class="icon-bar"></span>'))
        .append(
            $('<a class="navbar-brand" href="" title="logout"><span style="width: 150px;white-space:wrap;">Return your card</a>')
                .click(function(){goToPage('login');})
                .mouseover(function(){$(this).css('color', 'green');})
                .mouseout(function(){$(this).css('color', '#777');})
               
               );
    
    temp_div_container.append(temp_div);  
    
    temp_div = $('<div class="collapse navbar-collapse" >');
    var temp_list = $('<ul class="nav navbar-nav">');
                //.append('<li class="active"><a href="javascript:console.log(\'home\')">Home</a></li>')
                //.append('<li><a href="#">Link</a></li>'));
    
    for(var key in navItems){
        temp_list.append($('<li class=""><a href="#" >'+key+'</a></li>').click(navItems[key]));
    }
    
    temp_div.append(temp_list);
    temp_div_container.append(temp_div);  
    nav.append(temp_div_container);
    
    return nav;
            
            
          //  <li><a href="#">Link</a></li>
          //</ul>
        //</div><!-- /.navbar-collapse -->
      //</div>
            
            
      /*
    var nav = $('<div class="container-fluid">');

    //nav.append($('<div class="navbar-header"><a class="navbar-brand" href="#">Home</a></div>'));

    //nav.append($('<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">'));

    var nav_ul = $('<ul class="nav navbar-nav navbar-right">')
        
        .append($('<li class="dropdown">')
                .append($('<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Dropdown <span class="caret"></span></a>'))
                .append($('<ul class="dropdown-menu" role="menu"><li><a href="#">Action</a></li></ul>')))
                  
       // </li>
                  
        .append($('<li><a href="#">Link</a></li>'));
     // </ul>
        
   // </div><!-- /.navbar-collapse -->
 // </div><!-- /.container-fluid -->
//</nav>
    nav.append(nav_ul);
   
   */
}




/*
End HTML Object/Builder functions for dynamic content/behaviour
*************************************************************************************************************/

