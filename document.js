/**
 * Document.js
 * Adds document navigation to a page.
 */



	// fix HTML5 in IE
	(function(){
		var a = "header,section,datalist,option".split(",");
		for( var x in a ){
			if(a.hasOwnProperty(x)){
				document.createElement(a[x]);
			}
		}
	})();

	// Add mobile ag to page.

	// Insert Meta Tag
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(create('meta',{
		name:'viewport',
		content:'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
	}), s);
	//$('script:first').after('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />');



	// on ready
	$(function(){
		$('body .demo').each(function(){
			var html;

			// get outerHTML
			if(this.tagName === 'SCRIPT'){
				html = $(this).prop('outerHTML') || (function(n){
						var div = document.createElement('div'), h;
						div.appendChild( n.cloneNode(true) );
						h = div.innerHTML;
						div = null;
						return h;
					})(this);
			}
			else{
				return;
			}
			if (!html) {
				html = $(this).html();
			}

			//
			html = html.replace(' class="demo"','');
			
			// remove any unwanted sections
			html = html.replace(/<<<[\s\S]+>>>/, '').replace(/\/\*+\//, '');

			var $pre = $('<pre></pre>').insertBefore(this).text(html);
			
			html = $pre.html().replace(/(src\=[\"\'])(.*?)([\"\'])/ig, function(m,a,b,c){
				return a + b.link(b) +c;
			});
			
			$pre.html(html);

		});
		$('pre[class^=tryit]').each(function(){
			var pre = this;
			$("<button class=tryit>tryit</button>")
				.click(function(){

						if(typeof(tryit)==='function'&&!tryit(pre.innerText)){
							return
						}else{
							setTimeout( function(){ eval(pre.innerText); }, 100);
						}

					})
				.attr('contenteditable',true)
				.insertAfter(pre);
		});
		
		//
		// Create TOC
		var last_depth = 0
			$nav = $('nav.toc');

		var $headings = $('h1,h2,h3').each(function(){
			// Create an 
			var depth = parseInt(this.tagName.match(/[0-9]/)[0], 10),
				ref = $(this).text().replace(/\W/ig,'');

			var $li = $('<li><a href="#'+ ref +'">'+ $(this).text() +'</a></li>').attr('data-ref', ref);

			if(last_depth < depth){
				$('<ul></ul>').appendTo($nav).append($li);
			}
			else if (last_depth > depth){
				$nav.parent().parent().after($li);
			}
			else{
				$nav.after($li);
			}
			$nav = $li;

			// Add anchor
			$(this).prepend('<a name="' + ref + '"></a>' );

			last_depth = depth;
		});

		$(window).scroll(function(){
			// from the list of items
			// find the one which is in view on the page
			var T = window.scrollY || window.pageYOffset,
				H = ("screen" in window ? window.screen.availHeight : 500);

			var b = false;
			$headings.each(function(){
				if(b){
					return;
				}
				var t = $(this).position().top + 100,
					h = $(this).height() + 50;

				if( T < t && T+H > t ){
					$('nav.toc li').removeClass('active');
					$('nav.toc li').filter('[data-ref="'+ $(this).text().replace(/\W/ig, '') +'"]').addClass('active');
					b=true;
				}
			});
		});

		var repo = (window.location.pathname||'').match(/[^\/]+/);
		if(repo){
			repo = "https://github.com/MrSwitch/"+repo[0]+"";
		}

		$('body').append('<footer>Authored by <a href="http://adodson.com" rel="author">Andrew Dodson</a> (@mr_switch) '+ (repo?'[<a href="'+repo+'">Source and Comments on GitHub</a>]':'') +'</footer>');
	});


	/**
	 * Dump the response from the server after a given element
	 */
	function dump(r,target){
		var $log = $('<pre />');
		
		//console.log('Dump');
		
		if($(target).get(0).tagName !== 'PRE'){
			if( $(target).next().get(0).tagName === 'PRE' ){
				$log = $(target).next();
			}
			else {
				$(target).after($log);
			}
		}else{
			$log = $(target);
		}

		var i=0;
		$((function drilldown(name, json){
			var link;
			if(typeof(json)!=='object'||json===null||json.length==0){ 
				return '<b>'+name + '<\/b>: <span class="'+ typeof(json) +'">' + json + '<\/span>';
			}
			var s='';
			for ( var x in json ){
				s += '<li>'+drilldown(x,json[x])+'<\/li>';
			}
			return '<div><a href="javascript:void(0);" class="toggle">'+ name +'</a>: <ul class="hide">' + s + '<\/ul></div>';
		})(typeof(r),r))
		.find('a.toggle')
		.click(function(){
			$(this).next('ul').toggleClass("hide");
		})
		.end()
		.appendTo($log);
	}

	//
	// Create and Append new Dom elements
	// @param node string
	// @param attr object literal
	// @param dom/string 
	//
	function create(node,attr){

		var n = typeof(node)==='string' ? document.createElement(node) : node;

		if(typeof(attr)==='object' ){
			if( "tagName" in attr ){
				target = attr;
			}
			else{
				for(var x in attr){if(attr.hasOwnProperty(x)){
					if(typeof(attr[x])==='object'){
						for(var y in attr[x]){if(attr[x].hasOwnProperty(y)){
							n[x][y] = attr[x][y];
						}}
					}
					else{
						n.setAttribute(x, attr[x]);
					}
				}}
			}
		}
		return n;
	}

	// Google Analytics
	var _gaq = _gaq || [];
	_gaq.push(['_setAccount', 'UA-35317561-1']);
	_gaq.push(['_trackPageview']);

	(function() {
		var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	})();
