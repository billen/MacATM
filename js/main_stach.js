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

/*Page view manageer functions and variables*/
var viewController = PageViewManager({
    pages : {
        login: 'atm_page_login',
        home: 'atm_page_home'
    },
    
    startPage : 'login'
                                     
});

function PageViewManager(options) {

    /*Current page*/
    var currPage = options.startPage;
    var nextPage;
    var prevPage;
    var _pageList = new PageList(options.pages);
    
    console.log(_pageList.list);
    console.log(_pageList.getItem(0) + ' 0th index in the list');
    
}


function PageList(listItems) {
    var t = this;
    t.list = [];
    t.listItems = {};
    
    t.setList = function(listItems) {
        
        t.listItems = listItems;
    
        if(typeof listItems == 'object') {
            for(key in listItems) {
                console.log(key);
                t.list[key] = listItems[key];
            }
        }
    }
    
    t.getItem = function(item) {
        
        if(typeof item == 'number' && t.list.length > item) {
            var count = 0;
            for(key in t.list) {
                console.log(key);
                if(count == item) return t.list[key];
                count = count + 1;
            }
        }
        
        else return t.list[item];
    }
    
    this.setList(listItems);
}
