//1.1 bug修正 ui  只显示视频 跳楼 逆序 主楼折叠 引用折叠 我回复后的 时间标 挖坑人
//自动缩图 自动匿名
//关注 左方列表关注
//修正background的onrequest,getArticle方法,每次打开直接获取正确的result
var names = {};
$(document).ready(function(){
	//alert('docuement ready fired.');
	setTimeout(function(){
		getArticle(function(article){
			//p("in documentready:"+article.title);
			if(article){	
				$("#title").html(article.title);
				$("#jump").val("<="+article.maxfloor);
			}else{
				$("#title").html("正在读取中或右侧尚未打开帖子");			
			}		
		});
	}, 50);
	///////////////////////////各种事件处理//////////////////////
	setTimeout(check, 50);	
	setTimeout(lcheckAuthor, 50);	
	//alert('init.');


	$("#jump").click(function(){
		if($(this).val().indexOf("<")>-1){
			$(this).val("");
		}
	});
	
	$("#jump").keydown(function(event){
		if(event.keyCode==13){
			jumpFloor();
		}
	});
	
	$("#showtime").click(function(){
		if($(this).attr("checked") == "checked"){
			localStorage.setItem("tie_time",1);
			showTime();
		}else {
			localStorage.setItem("tie_time",0);
			noTime();
		}
	});
	
	$("#lshowtime").click(function(){	
		if($(this).attr("checked") == "checked"){		
			localStorage.setItem("ltie_time",1);
			lshowTime();
		}else{
			localStorage.setItem("ltie_time",0);
			lnoTime();
		}
	});
	
	$("#lshowauthor").click(function(){	
		if($(this).attr("checked") == "checked"){
			localStorage.setItem("ltie_author",1);
			lshowAuthor();
		}else{
			localStorage.setItem("ltie_author",0);
			lnoAuthor();
		}
	});
	
	$("#niming").click(function(){	
		if($(this).attr("checked") == "checked"){
			localStorage.setItem("tie_niming",1);
			showNiming();
		}else{
			localStorage.setItem("tie_niming",0);
			noNiming();
		}
	});

	$("#fromHighToLow").click(fromHighToLow);
	$("#fromLowToHigh").click(fromLowToHigh);
	$("#lnormal").click(lnormal);

	$("#onlyLouPig").click(onlyLouPig);
	$("#onlyta").click(onlyTa);
	$("#reverse").click(reverse);
	$("#resizePic" ).click(resizePic);
	$("#onlyPic" ).click(onlyPic);
	$("#onlyVideo" ).click(onlyVideo);
	$("#yama" ).click(yama);
	$("#onlyYama" ).click(onlyYama);
	$("#jumpSelf" ).click(jumpSelf);
	$("#zlPucker" ).click(zlPucker);
	$("#yyPucker" ).click(yyPucker);
	$("#digHole").click(digHole);
	$("#normal").click(normal);
	$("#testS").click(testS);
	
});

function onlyLouPig(){	
	var temp = [];
	getArticle(function(article){
		var comments = article.comments;
		for(var i in comments){
			if(comments[i].name == article.author){
				temp[temp.length] = i;
			}
		}	
		doSend({ask:"show",result:temp}, function(res){});	
		window.close();
	});
}

function onlyTa(){	
	getArticle(function(article){
		var comments = article.comments;
		for(var i in comments) {
			var tn = comments[i].name;		
			if(typeof names[tn] !="undefined"){			
				names[tn][names[tn].length]=comments[i].floor;
			}else{						
				names[tn] = [];
				names[tn][names[tn].length]=comments[i].floor;
			}
		}
		var trtd="";
		for(var i in names){
			trtd+= btrtd(i);
		}	
		var table = "<table id=\"table\">"+trtd+"</table>";
		$("#result").html("");
		$("#result").append("只看Ta:<br />"+table);	
		
		$("tr").bind("click",function(){		
			var n = $(this).children("td").html();		
			confirmTa(n);	
		});
		
		$("tr").bind("mouseover",function(){
			$(this).css("cursor","pointer");
			colorSelected($(this));
		});
		
		$("tr").bind("mouseout",function(){
			colorNotSelected($(this));
		});
	});	
} 

function reverse(){
	getArticle(function(article){
		var max = article.maxfloor;
		var temp = [];
		for(var i=max;i>0;i--){
			temp[temp.length] = i;
		}
		doSend({ask:"show",result:temp}, function(res){});
		window.close();
	});	
}

function confirmTa(name){	
	var temp = names[name];	
	doSend({ask:"show",result:temp}, function(res){});
}

function resizePic(){
	doSend({ask:"suotu"}, function(res){});
	warn("图已缩");
}

function onlyPic(){
	var temp = [];
	getArticle(function(article){
		var comments = article.comments;
		for(var i in comments) {		
			if(comments[i].img == 1) {	
				//new/ball new/face
				var ball = "new/ball";
				var face = "new/face";
				var flag = "new/flag";
				var reg = /<img.+?src=.+?>/ig;
				var match = comments[i].orgstr.match(reg);
				for(var y in match){
					if(match[y].indexOf(ball)>-1 || match[y].indexOf(face)>-1 || match[y].indexOf(flag)>-1 ) {
						continue;
					}else{
						temp[temp.length] =comments[i].floor;
						break;
					}
				}
			}
		}	
		if(temp.length == 0) {
			warn("当前页回复中没有图片!");
			return;
		}
		doSend({ask:"show",result:temp}, function(res){});
		window.close();
	});	
}

function onlyVideo(){
	var temp = [];
	getArticle(function(article){
		var comments = article.comments;
		for(var i in comments) {		
			if(comments[i].orgstr.indexOf("<embed")>-1){
				temp[temp.length] = comments[i].floor; 
			}
		}	
		if(temp.length == 0) {
			warn("当前页面回复中没有视频!");
			return;
		}
		doSend({ask:"show",result:temp}, function(res){});
		window.close();
	});	
}


function yama(){
	doSend({ask:"yama"}, function(){});	
}

function onlyYama(){
	var temp = [];
	getArticle(function(article){
		var comments = article.comments;
		for(var i in comments) {
			if(comments[i].yama == 1) {
				temp[temp.length]= comments[i].floor;
			}
		}	
		doSend({ask:"show",result:temp}, function(res){});
	});	
}

function jumpFloor(number){
	if(number){
		doSend({ask:"jump",result:number}, function(res){});		
		return;
	}
	getArticle(function(article){		
		var max = article.maxfloor;	
		var jump = document.getElementById("jump");
		var num = jump.value;	
		var reg = /\d+/;	
		if( ! (reg.test(num)) || num <= 0 || num>max) {
			warn("请输入正确数字!");
			return;
		}
		doSend({ask:"jump",result:num}, function(res){});
		window.close();
	});	
}

function jumpSelf(){
	var myname = getSelfName();	
	var temp = [];
	getArticle(function(article){
		var comments = article.comments;
		for(var i in comments){
			if(comments[i].name == myname){
				temp[temp.length] = comments[i].floor;
			}
		}
		if(temp.length==0){
			warn("当前帖子找不到你的名称或你使用了匿名回复!");
			return;
		}
		var num = temp[temp.length-1];	
		//p(num);
		doSend({ask:"jump",result:num}, function(res){});
	});
}

function zlPucker(){	
	doSend({ask:"pucker",result:"zlPucker();"}, function(res){});
	window.close();
}

function yyPucker(){
	doSend({ask:"pucker",result:"yyPucker();"}, function(res){});
	window.close();
}

function showTime(){
	var message = {ask:"time",result:true};
	chrome.extension.sendMessage({ask:"rtime",message:message},function(res){});	
}

function noTime(){
	var message = {ask:"time",result:false};
	chrome.extension.sendMessage({ask:"rtime",message:message},function(res){});
}

function showNiming(){
	var message = {ask:"niming",result:true};
	chrome.extension.sendMessage({ask:"niming",message:message},function(res){});	
}

function noNiming(){
	var message = {ask:"niming",result:false};
	chrome.extension.sendMessage({ask:"niming",message:message},function(res){});	
}

function lshowTime(){
	var message = {ask:"time",result:true};
	ldoSend(message, function(res){});
}

function lnoTime(){
	var message = {ask:"time",result:false};
	ldoSend(message, function(res){});
}

function lshowAuthor(){
	var message = {ask:"author",result:true};
	ldoSend(message, function(res){});
}

function lnoAuthor(){
	var message = {ask:"author",result:false};
	ldoSend(message, function(res){});
} 

function digHole(){
	getArticle(function(article){
		var comments = article.comments;	
		var temp={};
		var count=1;
		var tempts = 0;
		var dhcount = 0;
		for(var i in comments){		
			var timestr = comments[i].time;
			if(timestr==0){continue;}
			var thistime = dealTime(timestr);
			if(count==1){			
				//
			}else{
				if((thistime-tempts)>15552000){
					temp[comments[i].name] = comments[i].floor;
					dhcount++;
				}
			}
			tempts = thistime;
			count++;
		}
		if(dhcount==0){warn("没有挖超过半年坟的家伙!"); return;}
		if($("#table")[0]){$("#table").remove();}
	//p("remove table后");
		var trtd="";
		for(var i in temp){
			trtd+= "<tr><td floor=\""+temp[i]+"\">"+i+"</td></tr>";		
		}
	//p("trtd:"+trtd);
		var table = "<table id=\"table\">"+trtd+"</table>";
		$("#result").html("");
		$("#result").append("查看跳楼者:<br />"+table);
		
		$("tr").bind("click",function(){		
			var floor = $(this).children("td").attr("floor");
			jumpFloor(floor);
		});
		
		$("tr").bind("mouseover",function(){
			$(this).css("cursor","pointer");
			colorSelected($(this));
		});
		
		$("tr").bind("mouseout",function(){
			colorNotSelected($(this));
		});
	});	
}

function fromHighToLow(){
	var message = {ask:"compositer",result:"fromHighToLow()"};
	ldoSend(message, function(res){});
}

function fromLowToHigh(){
	var message = {ask:"compositer",result:"fromLowToHigh()"};
	ldoSend(message, function(res){});
}
	

function dealTime(timestr){	
    var d = new Date(timestr.replace(/-/g, '/')); // 需要先把年-月-日改成年/月/日，否则 Invalid Date
    var ts = parseInt(d / 1000);
    return ts;
    //31536000 一年    
}

function normal(){
	doSend({ask:"normal"}, function(res){});
	window.close();
}

function lnormal(){
	ldoSend({ask:"normal"}, function(res){});
	window.close();
}

function doSend(message,response){	
	chrome.extension.sendMessage({ask:"right",message:message},response);	
}

function ldoSend(message,response){
	chrome.extension.sendMessage({ask:"left",message:message},response);	
}

function testS() {
	chrome.tabs.getSelected(null, function(tab){
		alert("Selected tab ID: " + tab.id);
	});
}

function getArticle(fn){
	//var article = chrome.extension.getBackgroundPage().result;
	chrome.tabs.getSelected(null,function(tab){
		var article = chrome.extension.getBackgroundPage().robjs[tab.id];
		if(fn){fn(article);}
	});
}



function getSelfName(){
	var myname = chrome.extension.getBackgroundPage().selfname;
	//p(selfname+"in gsn");
	return myname;
}

function warn(str){
	$("#warn").html(str);
}

//下面是通用无关紧要////////////////////////////////////////////
function p(obj){	
	console.log(obj);
	alert(obj);
}
	
function colorSelected(element){
	element.children().each(function(){
		$(this).css("background","#e3eaf2");
	});
}

function colorNotSelected(element){
	element.children().each(function(){
		$(this).css("background","#ffffff");
	});
}

function btrtd(str){
	return "<tr>"+"<td>"+str+"</td></td>";
}	

function check(){
//p("r:"+localStorage.getItem("tie_time")+"\nl:"+localStorage.getItem("ltie_time"));
	//alert('check.');
	if(localStorage.getItem("tie_time")==1){
		$("#showtime").attr("checked",true);
	}else{
		$("#showtime").attr("checked",false);
	}
	
	if(localStorage.getItem("ltie_time")==1){
		$("#lshowtime").attr("checked",true);
	}else{
		$("#lshowtime").attr("checked",false);
	}
	
	if(localStorage.getItem("tie_niming")==1){
		$("#niming").attr("checked",true);
	}else{
		$("#niming").attr("checked",false);
	}
}


function lcheckAuthor(){
	//alert('lcheckAuthor');
	if(localStorage.getItem("ltie_author")==1){
		$("#lshowauthor").attr("checked",true);
	}else{
		$("#lshowauthor").attr("checked",false);
	}
}

function ldisabled(){
	$("#left").find("input").each(function(){
		$(this).attr("disabled","disabled");
	});
}

function disabled(){
	$("#right").find("input").each(function(){
		$(this).attr("disabled","disabled");
	});
}

function checkDisabled(){
	
}

	
	
	