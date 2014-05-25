/**
 * Document.js
 * Adds document navigation to a page.
 */

(function(window, document){

	// fix HTML5 in IE
	var a = "header,section,datalist,option,footer,nav,menu,aside,article,style,script".split(",");
	for( var i=0;i<a.length;i++){
		document.createElement(a[i]);
	}

	// Add mobile ag to page.

	// Insert Meta Tag
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(create('meta',{
		name:'viewport',
		content:'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
	}), s);

	var loaded = document.readyState === 'complete';

	// Insert on Document Load
	addEvent(document, loaded || "DOMContentLoaded", function(){

		var pres, i;

		var repo_path,
			paths = (window.location.pathname||'').replace(/^\/|\/[^\/]*$/g,'').split(/\//),
			repo = paths[0];

		if(repo){
			repo_path = "https://github.com/MrSwitch/"+repo;
		}


		var url = window.location.href,
			social_btns = '<a href="'+repo_path+'" class="github-star-button" target="_blank" title="Stars"><i class="icon-github"></i><span class="speeach-bubble"></span></a><span class="period"></span><a href="https://twitter.com/share" class="twitter-share-button" target="_blank" data-via="@setData" title="Tweet"><i class="icon-twitter"></i><span class="speeach-bubble"></span></a>';


		// Add Footer link to repo
		document.body.appendChild(create('footer',{
				html : 'Authored by <a href="http://adodson.com" rel="author">Andrew Dodson</a> '+ (repo_path?'<span class="period"></span><a href="'+repo_path+'">Source and Comments on GitHub</a> <div class="pull-right">'+ social_btns +'<div class="clearfix"></div></div>':'')
			}
		));

		// Add Social buttons to the top
		if(repo){

			var breadcrumbs = '';

			if([].map){
				breadcrumbs = paths.map( function(val, index){
					return '<a href="/'+ paths.slice(0,index+1).join('/') +'/">'+ val +'</a>';
				}).join(' ');
			}

			document.body.insertBefore(create('aside',{
					'class' : 'toolbar',
					'html' : '<div class="breadcrumbs pull-left"><a href="/">Andrew Dodson</a> '+breadcrumbs+'</div> <div class="pull-right"><a href="'+repo_path+'" target="_blank">Open Source</a><span class="period"></span>'+ social_btns +' <div class="clearfix"></div></div>'
				}
			),document.body.firstElementChild);
		}

		// Repo
		if(repo_path){

			// Install the twitter widget
			// Probably could make this a little more ajaxy
			jsonp('http://urls.api.twitter.com/1/urls/count.json?url='+encodeURIComponent(url),function(r){
				// Add value to twitter icon
				each('.twitter-share-button span.speeach-bubble', function(){
					this.innerHTML = r.count || '';
				});
			});

			// Install the GitHub widget
			// Probably could make this a little more ajaxy
			jsonp('https://api.github.com/repos/MrSwitch/'+repo+'?',function(r){
				// Add value to twitter icon
				// Add value to twitter icon
				each('.github-star-button span.speeach-bubble', function(){
					this.innerHTML = r.data.watchers || '';
				});
			});
		}

		//
		// Add event to twitter button
		addEvent(document.querySelectorAll('.twitter-share-button'),'click',function(e){
			
			e.preventDefault();

			var w = 550,
				h = 250,
				l = (screen.width/2)-(w/2),
				t = (screen.height/2)-(h/2);

			window.open("http://twitter.com/share?text="+encodeURIComponent(document.title + " by " + this.getAttribute('data-via')), 'twitter', 'width='+w+',height='+h+',left='+l+'px,top='+t+'px');
		});


		//
		function tryitButton(pre,func){
			var btn = create('button',{html:'tryit','class':'tryit'});
			insertAfter(btn, pre);

			addEvent(btn, 'click', function(){
				if(func){
					func();
				}
				else if(typeof(tryit)==='function'&&!tryit(pre.innerText)){
					return;
				}else{
					setTimeout( function(){ eval(pre.innerText); }, 100);
				}
			});

			if(!func){
				pre.setAttribute('contenteditable', true);
			}
		}


		// TryIt
		pres = document.getElementsByTagName('pre');
		for(i=0;i<pres.length;i++){
			if(pres[i].className === 'tryit'||pres[i].className === 'tryitoffline'){
				// Create a button and insert it after the pre tag
				tryitButton(pres[i]);
			}
		}

		// TryIt, View
		pres = document.getElementsByTagName('script');
		for(i=0;i<pres.length;i++){
			(function(script){
				var func = script.getAttribute('data-tryit');

				if(func){
					// Create a button and insert it after the pre tag
					tryitButton(script,window[func]);
				}

				if(script.getAttribute('src')){

					// Add click event to open in new window
					addEvent(script, 'click', function(){
						window.open(script.getAttribute('src'), '_blank');
					});
				}
			})(pres[i]);
		}

		pres = document.getElementsByTagName('link');
		for(i=0;i<pres.length;i++){
			(function(script){
				if(script.getAttribute('href')){

					// Add click event to open in new window
					addEvent(script, 'click', function(){
						window.open(script.getAttribute('href'), '_blank');
					});
				}
			})(pres[i]);
		}


		if(!document.querySelector){
			// degrade gracefully
			return;
		}


		// TOC
		var last_depth = 0,
			headings = document.querySelectorAll('h1,h2'),
			toc = document.querySelector('nav.toc'),
			_toc = toc;



		for(i=0;i<headings.length;i++){
			var tag = headings[i];
			// Create
			var depth = parseInt(tag.tagName.match(/[0-9]/)[0], 10),
				text = (tag.innerText||tag.textContent||tag.innerHTML),
				ref = text.toLowerCase().replace(/\s/g,'-').replace(/[^a-z0-9\_\-]/g, '');

			// Add anchor
			tag.id = ref;
			tag.insertBefore(create('a',{name:ref, href:"#" +ref, "class":"anchor"}),tag.firstChild);

			if(toc){

				var li = create('li', {html: create('a', {href:"#" +ref, text: text }), id : "toc_"+ref});

				if(last_depth < depth){
					var ul = create('ul');
					toc.appendChild(ul);
					ul.appendChild(li);
				}
				else if (last_depth > depth){
					insertAfter(li, toc.parentNode.parentNode);
				}
				else{
					insertAfter(li,toc);
				}

				if(toc){
					toc = li;
				}

				last_depth = depth;
			}
		}

		// Go back
		toc = _toc;


		//
		// Is there a TOC
		if(toc){
			// Lets add a class to the body
			document.documentElement.className += " toc";
		}


		var _prevScrollTop = document.body.scrollTop;

		// Add scroll event listeners
		addEvent(window, 'scroll', function(e){

			var scrollTop = Math.max(document.body.scrollTop,0);
			var scrollingDown = _prevScrollTop < scrollTop;
			_prevScrollTop = scrollTop;

			// Add a class to the documentElement describing the direction of the scroll
			var clist = document.documentElement.classList;
			if(clist){
				clist.add( scrollingDown ? 'scrolledDown' : 'scrolledUp' );
				clist.remove( !scrollingDown ? 'scrolledDown' : 'scrolledUp' );
			}



			// from the list of items
			// find the one which is in view on the page
			var T = window.scrollY || window.pageYOffset,
				H = ("screen" in window ? window.screen.availHeight : 500);

			for(var i=0;i<headings.length;i++){
				var tag = headings[i],
					text = (tag.innerText||tag.innerHTML),
					ref = tag.getElementsByTagName('a')[0];

				if(ref){
					ref = ref.getAttribute('href').replace(/^#/,'');
				}


				var t = findPos(tag)[1] + 100,
					h = (tag.outerHeight||tag.innerHeight) + 50;

				if( T < t && T+H > t ){
	
					if(toc){
						var _toc = document.getElementById('toc_'+ref);

						if(_toc.className!=='active'){

							// Activate this one
							_toc.className='active';

							var a = toc.querySelectorAll('.active');
							for(var j=0;j<a.length;j++){
								if(a[j]!==_toc){
									a[j].className = '';
								}
							}
						}
					}

					// Change the current window hash
					if( "history" in window && "replaceState" in window.history && window.location.hash !== '#'+ref ){
						history.replaceState({}, document.title, "#"+ref);
					}

					// Stop looping
					return;
				}
			}
		});

		function findPos(obj) {
			var curleft = 0,
				curtop = 0;
			if (obj.offsetParent) {
				do {
					curleft += obj.offsetLeft;
					curtop += obj.offsetTop;
				} while ((obj = obj.offsetParent));
			}
			return [curleft,curtop];
		}
	});

	//
	// Insert After
	function insertAfter(el,ref){
		ref.nextSibling?ref.parentNode.insertBefore(el,ref.nextSibling):ref.parentNode.appendChild(el);
	}

	//
	// Create and Append new Dom elements
	// @param node string
	// @param attr object literal
	// @param dom/stringx
	//
	function create(node,attr){

		var n = typeof(node)==='string' ? document.createElement(node) : node;

		if(typeof(attr)==='object' ){
			if( "tagName" in attr ){
				target = attr;
			}
			else{
				for(var x in attr){if(attr.hasOwnProperty(x)){

					if(x === 'text'){
						n.appendChild(document.createTextNode(attr[x]));
					}
					else if(x === 'html'){
						if(typeof(attr[x])==='string'){
							n.innerHTML = attr[x];
						}
						else{
							n.appendChild(attr[x]);
						}
					}
					else if(typeof(attr[x])==='object'){
						for(var y in attr[x]){if(attr[x].hasOwnProperty(y)){
							n[x][y] = attr[x][y];
						}}
					}
					else {
						n.setAttribute(x, attr[x]);
					}
				}}
			}
		}
		return n;
	}

	function addEvent(obj, eventName, listener) { //function to add event
		if(obj instanceof window.NodeList ){
			for(var i=0;i<obj.length;i++){
				addEvent( obj[i], eventName, listener );
			}
			return;
		}
		if(eventName===true){
			// execue immediatley
			listener();
			return;
		}
		if(!obj){
			return;
		}
		if (obj.addEventListener) {
			obj.addEventListener(eventName, listener, false);
		} else if(obj.attachEvent){
			obj.attachEvent("on" + eventName, listener);
		}
	}


	//
	// JSONP
	var jsonp_counter = 0;
	function jsonp(url, callback){
		// JSONP
		// Make the anonymous function. not anonymous
		var callback_name = 'jsonp_document_' + jsonp_counter++;

		window[callback_name] = callback;
		// find a place to insert the script tag
		var sibling = document.getElementsByTagName('script')[0];
		// Create the script tag
		var script = document.createElement('script');
		// Update the path with the callback name
		script.src = (url+"&callback="+callback_name);
		// Append
		sibling.parentNode.insertBefore(script,sibling);
	}



	function each(matches, callback){
		matches = document.querySelectorAll(matches);

		for(var i=0;i<matches.length;i++){
			callback.call(matches[i]);
		}
	}


})(window, document);


// Google Analytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-35317561-1']);
_gaq.push(['_trackPageview']);

(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();