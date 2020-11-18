######################## Base Page Class #####################################

class Page
	constructor: (@pageId, @pageTitle) ->
		@create()
		
	create: ->
		unless @elm()[0]
			elm = $("<div/>", {
				id: @pageId
				'data-role': 'page'
				'data-title': @pageTitle
			})
			elm.append('<div data-role="header"><h1></h1></div>').
				append('<div data-role="content" />')
			$('body').append(elm)
		$(@footerHtml).appendTo(@elm())
		@setTitle @pageTitle
		@insertNavbar()
		@populate()
	
	elm: ->
		return $('#' + @pageId)
		
	insertNavbar: ->
		locs = {home: 'Home', cards: 'Cards', heros: 'Heros'}
		links = for url, name of locs
			"<a data-role=\"button\" href=\"\##{url}\" data-transition=\"fade\">#{name}</a>"
		navbar = $('<div class="navgrp" data-role="controlgroup" data-type="horizontal">' + links.join('') + '</div>')
		@elm().children('div[data-role="header"]').append(navbar)
		
	setTitle: (title)->
		@elm().children('div[data-role="header"]').children('h1').text(title)
	
	footerHtml: '''
		<div data-role="footer" data-theme="c">
			<h4 class="footer">
				All Content is from 
				<a href="http://sanguoshaenglish.blogspot.com/">sanguoshaenglish.blogspot.com</a>
			</h4>
		</div>
	'''
	
	populate: ->

############################ Home Page Class ###############################

class HomePage extends Page
	constructor: ->
		super('home', 'SanGuoSha English Reference')
		
############################ Cards List Page Class ##############################			
			
class CardsListPage extends Page
	constructor: (pageId, title, @subcardData, @subcardClass) ->
		super(pageId, title)
	
	populate: ->
		unless @populated
			content = @elm().children('div[data-role="content"]').addClass('cards_page')
			@subcards = []
			for category, subcards of @subcardData
				$("<h2>#{category}</h2>").appendTo content
				for subcard in subcards
					subcardLink = $("<a/>", { href: '#' + IdGenerator.generateId(subcard.name) }).appendTo content
					$("<img/>", {src: subcard.local_image, class: 'card_image' }).appendTo subcardLink
					@subcards.push(new @subcardClass(subcard))
		@populated = true	
		
############################ Heros and Cards Page Classes ##############################			
			
class HerosPage extends CardsListPage
	constructor: (heroData) ->
		super('heros', 'SanGuoSha Heros', heroData, HeroPage)
		
class CardsPage extends CardsListPage
	constructor: (cardData) ->
		super('cards', 'SanGuoSha Cards', cardData, CardPage)

					
		
######################## Hero Page Class ######################################
			
class HeroPage extends Page
	constructor: (@cardOptions) ->
		super(IdGenerator.generateId(@cardOptions.name), @cardOptions.name)
		
	populate: ->
		unless @populated
			@elm().addClass('hero_page subpage')
			@setTitle @cardOptions.name
			content = @elm().children('div[data-role="content"]')
			content.append($("<img />", {src: @cardOptions.local_image, class: 'card_image'}))
			abilities = $("<div />", {class: 'abilities'}).appendTo(content)
			for ability in @cardOptions.abilities
				abilities.append($("<h4>#{ability.name}</h4>"))
				abilities.append($("<p>#{ability.description}</p>"))
			$('<div class="cleared" />').appendTo content
			if @cardOptions.faq_text
				content.append($('<h4>FAQ</h4>'))
				formattedFaq = @cardOptions.faq_text.replace(/Ans\:/g, "<b>Ans:</b>")
				
				content.append($("<p>#{formattedFaq}</p>"))
			@populated = true
			
######################## Hero Page Class ######################################
			
class CardPage extends Page
	constructor: (@cardOptions) ->
		super(IdGenerator.generateId(@cardOptions.name), @cardOptions.name)
		
	populate: ->
		unless @populated
			@elm().addClass('card_page subpage')
			@setTitle @cardOptions.name
			content = @elm().children('div[data-role="content"]')
			$("<img />", {src: @cardOptions.local_image, class: 'card_image'}).appendTo content
			$("<div class='description'>#{@cardOptions.description}</div>").appendTo content
			
			@populated = true

IdGenerator = {
	generateId: (name) ->
		oldLength = name.length
		newId = name.replace(/[^a-zA-Z0-9]/gi, '')
		newId += newId.length - oldLength
		return newId
}

############################ Main #####################################
window.HeroPage = HeroPage
window.HerosPage = HerosPage
window.CardPage = CardPage
window.CardsPage = CardsPage
window.Page = Page

$ ->
	window.homePage = new HomePage()
	window.herosPage = new HerosPage(data.heros)
	window.cardsPage = new CardsPage(data.cards)
	
$(document).bind "mobileinit", () ->
	$.mobile.page.prototype.options.addBackBtn = true