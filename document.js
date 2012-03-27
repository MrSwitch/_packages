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
						setTimeout( function(){ eval(pre.innerText); }, 100);
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