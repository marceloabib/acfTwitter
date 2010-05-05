/*
 * jQuery acfTwitter plugin 1.0
 *
 * Copyright (c) 2010-2012 André Ferraro - aferrarobr@gmail.com
 *
 * Licencidado sob MIT licence
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * jquery.acfTwitter.js 2010-05-05 18:45GMT-3 andreferraro
 *
 * -----------------------------------------------------------
 * Original
 *
 * http://coda.co.za/blog/2008/10/26/jquery-plugin-for-twitter
 * jquery.twitter.js
 * -----------------------------------------------------------
 * Melhorias
 *
 * - Adicionado suporte a hashtags apontando diretamente para a
 * busca do Twitter;
 *
 * - Funcionalidade de Re-Tweet
 *
 * -Adiciona thumbnail de imagens adicionadas via Twitpic
 *
 */
(function($) {

	$.fn.getTwitter = function(options) {
		var o = $.extend({}, $.fn.getTwitter.defaults, options);

		// hide container element
		$(this).hide();

		// add heading to container element
		if (o.showHeading) {
			$(this).append('<h2>'+o.headingText+'</h2>');
		}

		// add twitter list to container element
		$(this).append('<ul id="twitter_update_list"><li></li></ul>');

		// hide twitter list
		$("ul#twitter_update_list").hide();

		// add preLoader to container element
		var pl = $('<p id="'+o.preloaderId+'">'+o.loaderText+'</p>');
		$(this).append(pl);

		// add Twitter profile link to container element
		if (o.showProfileLink) {
			$(this).append('<div id="twitter-footer"><span>siga-me:</span> <a class="tweet-profile" href="http://twitter.com/'+o.userName+'" target="_blank">http://twitter.com/'+o.userName+'</a></div>');
		}

		// show container element
		$(this).show();

    $.getScript("http://twitter.com/javascripts/blogger.js");
		$.getScript("http://twitter.com/statuses/user_timeline/"+o.userName+".json?callback=twitterCallback2&count="+o.numTweets, function() {
			// remove preLoader from container element
			$(pl).remove();
			$('ul#twitter_update_list li').each(function(){

			  //adiciona rel=external para validação xHTML 1.1 de target=_blank
			  $(this).find('a').each(function(){
			    linkHRef=$(this).attr('href');
			    if (linkHRef.indexOf('twitter.com') > 0) $(this).addClass('tweet-friend');
          $(this).attr('target','_blank');
          if (linkHRef.indexOf('twitpic.com') > 0) {
            $(this).addClass('tweet-twitpic');
            twitpicID = linkHRef.replace('http://twitpic.com/','')
            $(this).attr('title',twitpicID);
          }
			  });

			  //suporte a hashtag
			  $(this).find('span').each(function(){
			    buscaHash = $(this).html();
			    buscaHash = buscaHash.replace('#',' #');
			    buscaHash = buscaHash.replace(/([^\w])\#([\w\-]+)/gm,'$1<a href="http://search.twitter.com/search?q=%23$2" target="_blank" class="tweet-hash">#$2</a>');
			    $(this).html(buscaHash);
			  });

        //substitui texto em inglês para português
				texto = $(this).find('a:last').html();
				texto = texto.replace('about','aproximadamente');
				texto = texto.replace('less than','menos de');
				texto = texto.replace(' a ',' um ');
				texto = texto.replace('minute','minuto');
				texto = texto.replace('hour','hora');
				texto = texto.replace('day','dia');
				texto = texto.replace('week','semana');
				texto = texto.replace('months','meses');
				texto = texto.replace('month','mês');
				texto = texto.replace('ago','atrás');
				$(this).find('a:last').html(texto);
				$(this).find('a:last').removeClass('tweet-friend');
				$(this).find('a:last').addClass('tweet-date');
				$(this).find('a:last').before('<br>')
			});
			// show twitter list
			if (o.slideIn) {
				$("ul#twitter_update_list").slideDown(1000);
			}
			else {
				$("ul#twitter_update_list").show();
			}

			// give first list item a special class
			$("ul#twitter_update_list li:first").addClass("firstTweet");

			// give last list item a special class
			$("ul#twitter_update_list li:last").addClass("lastTweet");

      $("ul#twitter_update_list li").hover(
        function () {
          nMsg = "RT @" + o.userName + ": " + $(this).find('span').text();
          nMsg = nMsg.replace('#','');
          nURL = "http://twitter.com/home?status=" + nMsg;
          $(this).append($("<div id='retweet-panel'><a href=\"" + encodeURI(nURL) + "\" class='tweet-retweet' target='_blank'>retweet</a></div>"));
          $(this).addClass("selTweet");
        },
        function () {
          $(this).find("div:last").remove();
          $(this).removeClass("selTweet");
        }
      );

        $('.tweet-twitpic').mouseover(function() {
          $(this).after('<div id=' + $(this).attr('title') + ' class="tweet-twitpic-box"><img class="tweet-twitpic-img" src=http://twitpic.com/show/thumb/' + $(this).attr('title') + '></div>');
        }).mouseout(function(){
          $('#'+$(this).attr('title')).remove();
        });

		});
	};

	// plugin defaults
	$.fn.getTwitter.defaults = {
		userName: null,
		numTweets: 5,
		preloaderId: "preloader",
		loaderText: "Loading tweets...",
		slideIn: false,
		showHeading: true,
		headingText: "Latest Tweets",
		showProfileLink: true
	};
})(jQuery);

