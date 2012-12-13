var result="";
var selfname= "";
var rports={};
var lports={};
var bgtabid=0;
var robjs={};
var lobjs ={};

function dealPort(port) {
	bgtabid = port.sender.tab.id;	
	if(port.name =="left"){		
		lports[bgtabid] = port;		
		port.onMessage.addListener(function(msg){			
			selfname = msg.selfname;
			lobjs[bgtabid] = msg.result;
			showPopup({},port.sender.tab.id);
		});		 
	}else{
		rports[bgtabid] = port;
		port.onMessage.addListener(function(msg){
			robjs[bgtabid] = msg;
			result = msg;
			showPopup({},port.sender.tab.id);
	  });
	}
}
chrome.extension.onConnect.addListener(dealPort);

function onMessage(message,sender,response){	
	if(message.ask=="right"){
		rports[bgtabid].postMessage(message.message);
	}else if(message.ask=="left"){		
		for(var i in lports){			
			lports[i].postMessage(message.message);
		}
	}else if(message.ask=="getResult"){		
		var rp = function(rpp){result=rpp.result};
		chrome.tabs.sendMessage(bgtabid,{ask:"getResult"},rp);		
	}else if(message.ask=="rtime"){
		for(var i in rports){			
			rports[i].postMessage(message.message);
		}
	}else if(message.ask=="niming"){
		for(var i in rports){			
			rports[i].postMessage(message.message);
		}
	}
}
chrome.extension.onMessage.addListener(onMessage);

chrome.tabs.onSelectionChanged.addListener(function(id,obj){
	chrome.tabs.sendMessage(id,{ask:"getResult"},function(response){
		bgtabid = id;
//p(id+":in background");
		result = response.result;
	});
});

function showPopup(re,id){	
	chrome.pageAction.show(id);
}

function p(obj){	
	console.log(obj);
	alert(obj);
}