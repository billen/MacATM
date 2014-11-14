$(document).ready(function(){
    console.log('loaded');
    
    /*enable key pad for the ids below*/
    initAtmKeyPad(['#accessCardText', '#pinText','#onlineAccessText','#onlinePinText','#onlineOtherAccount','#onlineAmount']);
    
    //viewController.goToPage(viewController.startPage, $('#accessCardText').focus);
    
    
    $('#accessCardText').focus();
    
    
    /*fous on accesscard inout field on page load*/
    //();


    addAttribute(['#accountNum1','#accountNum2','#accountNum3','#accountNum4'],jsonArray,"Number");
    addAttribute(['#amountNum1','#amountNum2','#amountNum3','#amountNum4'],jsonArray,"Amount");
    addAttribute(['#online_services_account_from'],jsonArray,"Number");
    addAttribute(['#online_services_account_balance'],jsonArray,"Amount");
});


function showAtmAccounts(){
    //console.log('showing accounts');
    $('#atm_account_select').find('#atm_account_select_wrap').remove();
    $('#atm_account_select').append(getAtmAccounts());
}
    
    
    
/*Globals/CONSTANTS
*************/


   /*json of mock user accounts data*/
    var jsonArray = {"accounts": [
            {"Number":"123-45-67","Amount":"100", "Type":"Chequing"},
            {"Number":"123-45-68","Amount":"6000", "Type":"Chequing"},
            {"Number":"123-45-69","Amount":"7000", "Type":"Savings"},
            {"Number":"123-45-61","Amount":"7500", "Type":"Savings"},
    ]};

/*parent container for the ATM*/
var ATM_UI_WINDOW = '#atm_master_container';

var confirmEnable = false;

var keepKeypadAlive = false;

/*Page view manageer functions and variables*/
var viewController = new PageViewManager({
    pages : {
        login: '#atm_page_login',
        home: '#atm_account_select',
        account: '#atm_single_account_view',
        trans_withdraw: '#atm_withdraw',
        trans_deposit: '#atm_deposit',
        online_services_home: '#atm_online_services_home',
        success: '#success_page'
        
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
            back: function(){goToPage('home')}
        },
        trans_withdraw: {
            back: function(){goToPage('account')}
        },
        trans_deposit: {
            back:  function(){goToPage('account')}
        },     
        online_services_home: {
            back:  function(){goToPage('home')}
        }
        
    },
    onPageShow : {

        home: showAtmAccounts
        
    },
    startPage : 'login'
                                     
});


/*
main helper functions for controlling calender view
*******************************************************/
/*Page navigation helpers*/
function goToPage(pageName, callback, args) {
    console.log(typeof args);
    if(viewController.currPage == 'home') {
        var acc_args = args;
        if(!callback){
            callback = function(){
                console.log('setting callback ');
                console.log($(viewController._pageList.getItem('account')));
                $(viewController._pageList.getItem('account')).find('#accountNum3').html(acc_args);
                $(pageName).find('#atm_acc_num').val();
                
            }
        }
        
    }
    console.log('going to page');
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
    var max_len = $(targetId).attr('maxlength');

	if (value.length + 1 <= max_len){
		$(targetId).val(value + string);
		if (value.length + 1 == max_len){
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
helper functions
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
    
    t.goToPage = function(pageName, callback, args) {
        var ret = undefined;
            
        if(options.onPageShow && typeof options.onPageShow[pageName] == 'function') {
            options.onPageShow[pageName]();
        }
    
        if(options.pages && options.pages[pageName]){
            console.log('pages');
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
            //console.log(callback);
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

function notify (message,type) {
    $('.top-right').notify({
                     message: { text: message },
                     fadeOut: { enabled: true, delay: 3000 },
                     type:type
                  }).show();
}

/*
* Withdraw / deposit money
*/
function transaction (amount, accountNumber, secondAccountNumber, type, amountID){
    
    switch (type) {
        case 'w':
                
            if (secondAccountNumber != "")
            {
                var index = parseInt(searchTextinJSON(jsonArray,accountNumber));    
                var amountInAccount = parseInt(jsonArray.accounts[index]["Amount"]);
                if (amount > amountInAccount) {
                    notify("Insufficient funds","warning");
                } else {
                    console.log(amount);
                    if (!isNaN(amount)){
                          jsonArray.accounts[index]["Amount"] = amountInAccount - amount;
                          $('#'+amountID).html(jsonArray.accounts[index]["Amount"]);
                          notify ("Funds transferred","success");
                    } else {
                        notify ("No amount to transfer was added","warning");
                } 
                    }
            }  else {
                notify("Account Number missing","warning");
            }
         
            break;
        case 'd':
            notify ('Insert Money Please','success');
            var delay=3000;//1 seconds
            setTimeout(function(){
                notify ('Inserting Successful','success');
                var index = parseInt(searchTextinJSON(jsonArray,accountNumber)); 
                var amountInAccount = parseInt(jsonArray.accounts[index]["Amount"]);
                jsonArray.accounts[index]["Amount"] = amountInAccount + amount;
                notify ("Deposit successful","success")
                goToPage('home');
            },delay); 
            
            break;
        case 't':
            break;
        case 'ww':
             var index = parseInt(searchTextinJSON(jsonArray,accountNumber)); 
                var amountInAccount = parseInt(jsonArray.accounts[index]["Amount"]);
                if (amount > amountInAccount) {
                     notify("Insufficient funds","warning");
                 } else {
                     notify("Dispensing Money Now","success");
                     var delay=3000;//1 seconds
                    setTimeout(function(){
                     jsonArray.accounts[index]["Amount"] = amountInAccount - amount;
                     notify ("Withdraw Successful ","success")
                    goToPage('home');
                },delay); 
                 }
           

            break;
        default: 
             console.log("Incorrect type used for transaction function. Use either 'w' or 'd' or 't' for withdraw, deposit, and transfer respectively");
            break;
    }
}

// Returns the index in the json array where the text exists
function searchTextinJSON(json,attr,text){
    jsonArr = json.accounts;
    for (i in jsonArr){
        if(jsonArr[i][attr] == text)
            return i;
    }
}

function transactionWrapper (amountID,accountID,secondAccountID, type,amountDisplayID) {
    var amount = $('#'+amountID).val();
    var account = $('#'+accountID).html();
    var secondAccount = $('#'+secondAccountID).val();
    transaction(parseInt(amount),account,secondAccount,type,amountDisplayID);

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
    
   // $(ret).css({position: 'absolute', top: (_top+'px') , left: (_left+'px'), margin: '0', width: (_width+'px'), height: 'auto'});
    
    return  ret;  
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
            $('<a class="navbar-brand" href="" title="logout"><span>CARD INSERTED - EJECT YOUR CARD</span></a>')
                .click(function(){goToPage('login');})
                .mouseover(function(){$(this).css('color', 'green');})
                .mouseout(function(){$(this).css('color', '#FFF');})
               
               );
       
    temp_div_container.append(temp_div);  
    
    temp_div = $('<div class="collapse navbar-collapse" >');
    var temp_list = $('<ul class="nav navbar-nav">');
                //.append('<li class="active"><a href="javascript:console.log(\'home\')">Home</a></li>')
                //.append('<li><a href="#">Link</a></li>'));
    
    for(var item in navItems){
        temp_list.append(
            $('<li class=""><a href="#" >'+item+'</a></li>').click(navItems[item])
        );
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


function getAtmAccounts() {
    var acc = $('<div class="atm_account atm_account_chequing">');
    
    var acc_table_cheq = $('<table id="accounts_chequing" class="table table-hover">');
    
    
    var acc_table_sav = $('<table id="accounts_savings" class="table table-hover">');
    
    var acc_table_cheq_body = $('<tbody />');
    var acc_table_sav_body = $('<tbody />');
    
    var acc_table_body_tr;

    for(var profile in jsonArray) {
        for(var account in jsonArray[profile]){
            acc_table_body_tr = $('<tr />')
                .click(function(){goToPage('account');});
            
            for(var prop in jsonArray[profile][account]){
                if(prop == 'Type') continue;
                acc_table_body_tr.append('<td>'+jsonArray[profile][account][prop]+'</td>');
                
            }
            acc_table_body_tr
            .append(
                $('<td><span class="btn btn-default btn-sml">Withdraw</td>')
                    .click(function(event){
                        goToPage('trans_withdraw');
                        event.stopPropagation();
                    })
            )
            .append(
                $('<td><span class="btn btn-default btn-sml">Deposit</td>')
                    .click(function(event){
                        goToPage('trans_deposit');
                        event.stopPropagation();
                    })
            ).append(
                $('<td><span class="btn btn-default btn-sml">Quick Withdraw</td>')
                    .click(function(event){
                        goToPage('trans_withdraw');
                        event.stopPropagation();
                    })
            );
                           // .append('<td><span class="btn btn-default btn-sml">Deposit</td> ')
                            //.append('<td><span class="btn btn-default btn-sml">Last Transaction</td>');
            
            if(jsonArray[profile][account]['Type'] == 'Chequing') {
                acc_table_cheq_body.append(acc_table_body_tr);
            }else {
                acc_table_sav_body.append(acc_table_body_tr);
            }
        }
    }
    
    acc_table_cheq.append('<thead><tr><th>Account #</th><th colspan="4">Account balance</th></tr></thead>')
                    .append(acc_table_cheq_body);
    
    acc_table_sav.append('<thead><tr><th>Account #</th><th colspan="4">Account balance</th></tr></thead>')
                    .append(acc_table_sav_body);
    
    acc.append('<span class="">Chequing</span>')
        .append(acc_table_cheq)
        .append('<span class="">Saving</span>')
        .append(acc_table_sav);
    
    return $('<div id="atm_account_select_wrap" />').append(acc);
}

function printBalance() {
    notify ('Printing Balance','success');
     var delay=3000;//1 seconds
    setTimeout(function(){
         goToPage('login');
    },delay); 
   
}


/*
End HTML Object/Builder functions for dynamic content/behaviour
*************************************************************************************************************/

