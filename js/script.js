/* Author:
*/
var _position_array = [
                   [42,35,28,21,14,7,0,1,2,3,4,5,6,13,20,27,34,41,48,47,46,45,44,43],
                   [36,29,22,15,8,9,10,11,12,19,26,33,40,39,38,37],
                   [30,23,16,17,18,25,32,31],
                   [24]
                   ],
_data_array = [],_currentProjet_int = 0,_isFirstLoad_bool=true,_isAnimateOut_bool=false,_isImgLoaded_bool=false,_currentUrl_str='',_lastId_int,_isContactOpen=false;
function Utils(){
	this.settings_obj = {
		html:null,
		window:null,
		document:null,
		isIe6_bool:false,
		isIe7_bool:false,
		isIe8_bool:false,
		isTouch_bool:false
	}
	this.init = function (){
		this.settings_obj.window = $(window);
		this.settings_obj.html = $('html');
		this.settings_obj.document = $('document');
		if(this.settings_obj.html.hasClass('ie6'))this.settings_obj.isIe6_bool = true;
		if(this.settings_obj.html.hasClass('ie7'))this.settings_obj.isIe7_bool = true;
		if(this.settings_obj.html.hasClass('ie8'))this.settings_obj.isIe8_bool = true;
		if(this.settings_obj.html.hasClass('touch'))this.settings_obj.isTouch_bool = true;
	}
	this.debug = function($value_str){
		if (window.console) {
			console.log($value_str);
		}else {
			alert($value_str);
		}
	}
}

function setSquare(){
	var posX=0,posY=0;
	$('#front').find('li').each(function (index){
		posX = (index%4)*150;		
		$(this).css({'top':posY+'px',left:posX+'px'})
		if(posX == 450)posY+=150;
	})
	posX=0,posY=0;
	$('#back').find('li').each(function (index){
		posX = (index%4)*150;
		
		$(this).css({'top':posY+'px',left:posX+'px'})
		if(posX == 450)posY+=150;
	})
	$('.fleche-next').live('click',function (e){
		e.preventDefault();
		goNext();

	});
	$('.fleche-prev').live('click',function (e){
		e.preventDefault();
		goPrev();
	});
	animateIn();
}
function goNext(){
	if(!$('#front').hasClass('open'))return;
	var projet_int = _currentProjet_int + 1;		
	if(projet_int > _data_array.length-1)projet_int=0;
	document.location.hash = '!/'+_data_array[projet_int]['id'];	
}
function goPrev(){
	if(!$('#front').hasClass('open'))return;
	var projet_int = _currentProjet_int - 1;	
	if(projet_int < 0)projet_int=_data_array.length-1;		
	document.location.hash = '!/'+_data_array[projet_int]['id'];	
}
function animateOut(){
	_isAnimateOut_bool = false;
	_isImgLoaded_bool = false;
	loadImg();	
	$('#front').removeClass('open');
	$('.fleche-next,.fleche-prev ').fadeOut(500,'easeInOutCubic');
	setTimeout(animateSquareOut,300);
}

function animateSquareOut(){
	var i,j,square,delay,id,array,square_ul = $('#square-ul');
	for (  i = 0; i < _position_array.length; i++) {
		array = _position_array[i];
		delay = i*200;
		for ( j = 0; j < array.length; j++) {
			id=array[j];
			square = square_ul.find('.square').eq(id);
			square.unbind('mouseenter');
			square.unbind('mouseleave');
			square.unbind('click');
			if(i==3){
				square.stop(true,true).delay(delay).fadeOut(400,'easeInOutCubic',function(){_isAnimateOut_bool=true;checkIfAnimateIn();});
			}else{
				square.stop(true,true).delay(delay).fadeOut(400,'easeInOutCubic');
			}
		}		
	}

}
function animateIn(){
	var square,counter,c=-1,r=-1,id_img=1;
	if(_currentProjet_int==-1)return;
	$('#square-ul').find('.square').each(function (i){		
		c++;
		if(i%7==0){
			r++;
			c=0;	
		}
		
		$(this).css({'display':'block','opacity':1,'left':3*150+'px','top':3*150+'px','background-image':'url("img/'+_data_array[_currentProjet_int]['img']+'")','background-position-x':'0px','background-position-y':'0px'});
		$(this).animate({'left':c*150+'px','top':r*150+'px','background-position-x':-c*150+'px','background-position-y':-r*150+'px'},1000,'easeInOutCubic');	
	})
	$('#front').find('li').each(function (i){		
		c++;
		if(i%4==0){
			r++;
			c=0;	
		}
		
			
		$(this).css({'background-image':'url("img/'+_data_array[_currentProjet_int]['img']+'")','background-position-x':-214-c*150+'px','background-position-y':-214-r*150+'px'});
	})
	
	$('#front').delay(500).queue(function(){
		$(this).addClass('open');
		$(this).dequeue();
		$(this).find('video>source').attr('src','video/'+_data_array[_currentProjet_int]['video']+'.mp4');
		$(this).find('video').get(0).load();	
		$(this).find('video').get(0).play();
		$(this).find('h2').empty().html(_data_array[_currentProjet_int]['titre']);
	})
	var back = $('#back');
	back.find('h3').html(_data_array[_currentProjet_int]['titre']);
	if(parseInt(back.find('h3').height(),10)>70)back.find('h3').css({'margin-top':'-10px'})
	back.find('p.client').html(_data_array[_currentProjet_int]['client']);
	back.find('p.idea').html(_data_array[_currentProjet_int]['idea']);
	back.find('p.code').html(_data_array[_currentProjet_int]['code']);
	back.find('p.nicePart').html(_data_array[_currentProjet_int]['nicePart']);
	back.find('p.link').html(_data_array[_currentProjet_int]['link']);

	
	$('.fleche-next,.fleche-prev').delay(1000).fadeIn(500,'easeInOutCubic');
	setTimeout(setSquareListener,1000);

}
function setSquareListener(){	
	var square,i;
	$('#square-ul').find('.square').each(function (i){
		
		$(this).bind('mouseenter',function (){$(this).stop(true,true).animate({'opacity':.5},500,'easeInOutCubic')});
		$(this).bind('mouseleave',function(){$(this).stop(true,true).animate({'opacity':1},500,'easeInOutCubic')});
	})
}
var x,y;
function setMouse(){
	var window_el = $(window);
	window_el.bind('mousemove',function(e){
		var width = window_el.width(),height=window_el.height(),posX,posY;
		
		if(!_isContactOpen){
			x = (width*.5 - e.clientX)/width * 90;
			y = -(height*.5 - e.clientY)/height * 90;	
		}
		movePlan(x,y);		
	})
}
function setKeyboard(){
	$(document).bind('keydown',function(e){
		console.log(e.keyCode)
		switch(e.keyCode){
			case 38:
				if($('#front').hasClass('open'))toggleMore();
			break;
			case 39:
				goNext()
			break;
			case 40:
				if(!$('#front').hasClass('open'))toggleMore();
			break;
			case 37:
				goPrev();
			break;
			case 32:
				toggleContact();
			break;
		}
	})
}
function disableProject(){
	x=(x-x/10);y=(y-y/10);
	movePlan(x,y);
	if(x>.5 || x<-0.5)setTimeout(disableProject,50);
}
function movePlan(x,y){
	document.getElementById('main').style.webkitTransform = "scale3d("+scale+","+scale+","+scale+") rotateX("+y+"deg) rotateY("+x+"deg)";
}


var _utils5g = new Utils();
$(function(){
	_utils5g.init();
	loadData();

});
function loadData(){
	$.ajax({
		url:'js/data/data.json',
		dataType:'json',
		cache:'false',
		success: function(data) {
			$.each(data.projets, function(key, val) {
    			_data_array.push(val);
		    });
		    var navigation_array = document.location.hash.split('/')
		    if(navigation_array[1]){
		    	checkId(navigation_array[1]);
		    }else{
		    	document.location.hash = '!/'+_data_array[_currentProjet_int]['id'];
		    }
		    _currentUrl_str = document.location.hash;
		    if($('html').hasClass('csstransforms3d')){
		   loadAllImg();	 
		$('video').gVideo();
			_utils5g.settings_obj.window.bind('resize',onResize);
			onResize();		
		}else{
			initSite();
		}
   		},
		error: function(data) {		
  		},
		complete: function(data) {		
  		}
  	});

}
function checkUrl(){
	if(_currentUrl_str != document.location.hash){
		_lastId_int = _currentProjet_int;
		_currentUrl_str = document.location.hash;
		var navigation_array = _currentUrl_str.split('/');
		checkId(navigation_array[1]);
		if(_currentProjet_int >= 0 && _lastId_int >=0){
			animateOut();
		}		
	}
	setTimeout(checkUrl,100);	
}
function checkId(new_id){
	_currentProjet_int = -1;
	for (var i = 0; i < _data_array.length; i++) {
		if(new_id == _data_array[i]['id']){
    		_currentProjet_int = i;
    		break;
    	}
	};
}
function loadImg(){
	var img = new Image();
	$(img).load(function (){onImgLoadComplete();})
	img.src = 'img/'+_data_array[_currentProjet_int]['img'];
}
function onImgLoadComplete(){
	if(_isFirstLoad_bool){
		_isFirstLoad_bool = false;
		setDisplay();
	}else{		
		_isImgLoaded_bool = true;
		checkIfAnimateIn();
	}
}
function checkIfAnimateIn(){
	if(!_isAnimateOut_bool)return;
	if(!_isImgLoaded_bool)return;
	animateIn();
}
function setDisplay(){
	$('#contact .read,#contact span').live('click',function (e){	
		e.preventDefault();	
		toggleContact();
	})
	
	$('.fleche-more').click(function (e){	
		e.preventDefault();	
		toggleMore();		
	})
	setSquare();
	setControl();
	$('.touch').find('video').attr('controls','')
}


function toggleMore(){
	var front = $('#front');
	var back = $('#back');
	if(front.hasClass('open')){
		front.removeClass('open');
		setTimeout(function(){$('#square-ul').toggleClass('more');},500);
		setTimeout(function(){back.addClass('open');},2000)
		$('.fleche-next,.fleche-prev').fadeOut(500,'easeInOutCubic');	
	}else{
		back.removeClass('open');
		setTimeout(function(){$('#square-ul').toggleClass('more');},500);
		setTimeout(function(){front.addClass('open');},2000);	
		$('.fleche-next,.fleche-prev').delay(2000).fadeIn(500,'easeInOutCubic');
	}	
}


function toggleContact(){
	$('#contact').toggleClass('open');
	_isContactOpen = !_isContactOpen;
	if(_isContactOpen){
		$('#contact .read').text('Read less!');
		$('video').get(0).pause();
		$('#contact.open article').css({'margin-top':-$('.text-cont').height()-40+'px'});
		$('#projet').animate({'opacity':.3},1000,'easeInOutCubic');
		disableProject();
	}else{
		$('#contact .read').text('Read more!');
		$('video').get(0).play();
		$('#contact article').css({'margin-top':0+'px'});
	$('#projet').animate({'opacity':1},1000,'easeInOutCubic')	
	}
}


var scale =1;
function onResize(){
	var width = _utils5g.settings_obj.window.width(),height=_utils5g.settings_obj.window.height();		
	var scaleX = (width/1200),scaleY = height/800;
	if(scaleX>1)scaleX=1;
	if(scaleY>1)scaleY=1;
	scale = Math.min(scaleX,scaleY);
	$('#main').css({'left':width*.5 - 550+'px','top':height*.5 - 550+'px'});
	movePlan(0,0);
	$('#contact').css({'top':height - 30+'px'});
	$('#contact.open article').css({'margin-top':-$('.text-cont').height()-40+'px'});
	$('#container #contact article p').width(width/4-40)
	$('.pourc').css('top',height*.5-200+'px');
}





_imgToLoad = 0;
function loadAllImg(){
	if(_imgToLoad==_data_array.length){
		$('.pourc').fadeOut(500,'easeInOutCubic');
		setTimeout(checkUrl,100);
		loadImg();	
		return;
	}
	var img = new Image();
	$(img).load(function (){loadAllImg();})
	img.src = 'img/'+_data_array[_imgToLoad]['img'];
	_imgToLoad++;	
	var pourc = Math.round((_imgToLoad/(_data_array.length))*100)
	$('.pourc').text(pourc+"%").css({'opacity':1-(pourc/100),'letter-spacing':-50-pourc+'px'});
}



function setControl(){

	var x = 0,y = 0,vx = 0,vy = 0,ax = 0,ay = 0,delay = 10,vMultiplier = 0.01;

	if (window.DeviceMotionEvent==undefined) {
		setMouse();
		setKeyboard();
	} else {
		window.ondeviceorientation  = function(event) {	
			ax = Math.round(event.beta)/2
			ay = Math.round(event.gamma)/2
			movePlan(ax,ay)
		}
	} 
}


function initSite(){
	$('#projet').remove()
	$('.read').remove()
	$('#contact').addClass('open')
	$('#container').css('position','relative')
	$('footer').css('top','inherit')
	$('footer').css('position','relative')
	var articles =$("<div id='articles'></div>")
	$('#container').prepend(articles)
	$('#container').prepend("<p>THIS SITE NEEDS CSS TRANSFORM 3D TOWORK PROPERLY!!!<p>")
	for (var i = 0; i < _data_array.length; i++) {
		var article = $('<article class="clearfix">')
		
		article.append('<h3>'+_data_array[i]['titre']+'</h3>');
		article.append('<video controls><source src="video/'+_data_array[i]['video']+'.mp4"></video>');
		text = $('<div class="proj-desc">')
		text.append('<p><strong>The client:</strong><br>'+_data_array[i]['client']+'</p>');
		text.append('<p><strong>The idea?</strong><br>'+_data_array[i]['ideo']+'</p>');
		text.append('<p><strong>What about the code!</strong><br>'+_data_array[i]['code']+'</p>');
		text.append('<p><strong>The nice part:</strong><br>'+_data_array[i]['nicePart']+'</p>');		
		text.append('<p><a href="'+_data_array[i]['link']+'" target="_blank">Visit website!</a>');
		article.append(text)
		_data_array[i]
		articles.append(article)
	};
}






























