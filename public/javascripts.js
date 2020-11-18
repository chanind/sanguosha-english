(function() {
  var CardPage, CardsListPage, CardsPage, HeroPage, HerosPage, HomePage, IdGenerator, Page;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Page = (function() {
    function Page(pageId, pageTitle) {
      this.pageId = pageId;
      this.pageTitle = pageTitle;
      this.create();
    }
    Page.prototype.create = function() {
      var elm;
      if (!this.elm()[0]) {
        elm = $("<div/>", {
          id: this.pageId,
          'data-role': 'page',
          'data-title': this.pageTitle
        });
        elm.append('<div data-role="header"><h1></h1></div>').append('<div data-role="content" />');
        $('body').append(elm);
      }
      $(this.footerHtml).appendTo(this.elm());
      this.setTitle(this.pageTitle);
      this.insertNavbar();
      return this.populate();
    };
    Page.prototype.elm = function() {
      return $('#' + this.pageId);
    };
    Page.prototype.insertNavbar = function() {
      var links, locs, name, navbar, url;
      locs = {
        home: 'Home',
        cards: 'Cards',
        heros: 'Heros'
      };
      links = (function() {
        var _results;
        _results = [];
        for (url in locs) {
          name = locs[url];
          _results.push("<a data-role=\"button\" href=\"\#" + url + "\" >" + name + "</a>");
        }
        return _results;
      })();
      navbar = $('<div class="navgrp" data-role="controlgroup" data-type="horizontal">' + links.join('') + '</div>');
      return this.elm().children('div[data-role="header"]').append(navbar);
    };
    Page.prototype.setTitle = function(title) {
      return this.elm().children('div[data-role="header"]').children('h1').text(title);
    };
    Page.prototype.footerHtml = '<div data-role="footer" data-theme="c">\n	<h4 class="footer">\n		All Content is from \n		<a href="http://sanguoshaenglish.blogspot.com/">sanguoshaenglish.blogspot.com</a>\n	</h4>\n</div>';
    Page.prototype.populate = function() {};
    return Page;
  })();
  HomePage = (function() {
    __extends(HomePage, Page);
    function HomePage() {
      HomePage.__super__.constructor.call(this, 'home', 'SanGuoSha English Reference');
    }
    return HomePage;
  })();
  CardsListPage = (function() {
    __extends(CardsListPage, Page);
    function CardsListPage(pageId, title, subcardData, subcardClass) {
      this.subcardData = subcardData;
      this.subcardClass = subcardClass;
      CardsListPage.__super__.constructor.call(this, pageId, title);
    }
    CardsListPage.prototype.populate = function() {
      var category, content, subcard, subcardLink, subcards, _i, _len, _ref;
      if (!this.populated) {
        content = this.elm().children('div[data-role="content"]').addClass('cards_page');
        this.subcards = [];
        _ref = this.subcardData;
        for (category in _ref) {
          subcards = _ref[category];
          $("<h2>" + category + "</h2>").appendTo(content);
          for (_i = 0, _len = subcards.length; _i < _len; _i++) {
            subcard = subcards[_i];
            subcardLink = $("<a/>", {
              href: '#' + IdGenerator.generateId(subcard.name)
            }).appendTo(content);
            $("<img/>", {
              src: subcard.local_image,
              "class": 'card_image'
            }).appendTo(subcardLink);
            this.subcards.push(new this.subcardClass(subcard));
          }
        }
      }
      return this.populated = true;
    };
    return CardsListPage;
  })();
  HerosPage = (function() {
    __extends(HerosPage, CardsListPage);
    function HerosPage(heroData) {
      HerosPage.__super__.constructor.call(this, 'heros', 'SanGuoSha Heros', heroData, HeroPage);
    }
    return HerosPage;
  })();
  CardsPage = (function() {
    __extends(CardsPage, CardsListPage);
    function CardsPage(cardData) {
      CardsPage.__super__.constructor.call(this, 'cards', 'SanGuoSha Cards', cardData, CardPage);
    }
    return CardsPage;
  })();
  HeroPage = (function() {
    __extends(HeroPage, Page);
    function HeroPage(cardOptions) {
      this.cardOptions = cardOptions;
      HeroPage.__super__.constructor.call(this, IdGenerator.generateId(this.cardOptions.name), this.cardOptions.name);
    }
    HeroPage.prototype.populate = function() {
      var abilities, ability, content, formattedFaq, _i, _len, _ref;
      if (!this.populated) {
        this.elm().addClass('hero_page subpage');
        this.setTitle(this.cardOptions.name);
        content = this.elm().children('div[data-role="content"]');
        content.append($("<img />", {
          src: this.cardOptions.local_image,
          "class": 'card_image'
        }));
        abilities = $("<div />", {
          "class": 'abilities'
        }).appendTo(content);
        _ref = this.cardOptions.abilities;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          ability = _ref[_i];
          abilities.append($("<h4>" + ability.name + "</h4>"));
          abilities.append($("<p>" + ability.description + "</p>"));
        }
        $('<div class="cleared" />').appendTo(content);
        if (this.cardOptions.faq_text) {
          content.append($('<h4>FAQ</h4>'));
          formattedFaq = this.cardOptions.faq_text.replace(/Ans\:/g, "<b>Ans:</b>");
          content.append($("<p>" + formattedFaq + "</p>"));
        }
        return this.populated = true;
      }
    };
    return HeroPage;
  })();
  CardPage = (function() {
    __extends(CardPage, Page);
    function CardPage(cardOptions) {
      this.cardOptions = cardOptions;
      CardPage.__super__.constructor.call(this, IdGenerator.generateId(this.cardOptions.name), this.cardOptions.name);
    }
    CardPage.prototype.populate = function() {
      var content;
      if (!this.populated) {
        this.elm().addClass('card_page subpage');
        this.setTitle(this.cardOptions.name);
        content = this.elm().children('div[data-role="content"]');
        $("<img />", {
          src: this.cardOptions.local_image,
          "class": 'card_image'
        }).appendTo(content);
        $("<div class='description'>" + this.cardOptions.description + "</div>").appendTo(content);
        return this.populated = true;
      }
    };
    return CardPage;
  })();
  IdGenerator = {
    generateId: function(name) {
      var newId, oldLength;
      oldLength = name.length;
      newId = name.replace(/[^a-zA-Z0-9]/gi, '');
      newId += newId.length - oldLength;
      return newId;
    }
  };
  window.HeroPage = HeroPage;
  window.HerosPage = HerosPage;
  window.CardPage = CardPage;
  window.CardsPage = CardsPage;
  window.Page = Page;
  $(function() {
    window.homePage = new HomePage();
    window.herosPage = new HerosPage(data.heros);
    return window.cardsPage = new CardsPage(data.cards);
  });
  $(document).bind("mobileinit", function() {
    	$.mobile.defaultPageTransition = 'none'
	return $.mobile.page.prototype.options.addBackBtn = true;
  });
}).call(this);
