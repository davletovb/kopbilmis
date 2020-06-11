var token = 'TOKEN';

function doPost(e) {
  // Make sure to only reply to json requests
  if(e.postData.type == "application/json") {
    
    // Parse the update sent from Telegram
    var update = JSON.parse(e.postData.contents);

    // Instantiate our bot passing the update 
    var bot = new Bot(token, update);
    
    // Building commands
    var bus = new CommandBus();
    bus.on(/\/salam Köpbilmiş/, function () {
      this.replyToSender("Salam, men Köpbilmiş. Öwrenmek isleýän maglumatyň bar bolsa /gozlet diýip bir söz ýazyň. Türkmen dilinde bir sözüň manysyny öwrenmek üçin /enedilim diýip sorap bilersiňiz. Aýdym saz gözletmek üçin /aydym diýip bir söz ýazsaňyz aýdym w studiýu bolýar. ");
    });
    
    bus.on(/\/joke\s*([A-Za-z0-9_]+)?\s*([A-Za-z0-9_]+)?/, randomJoke);
    
    bus.on(/\/gozlet\s*([a-zA-ZŽžÄäŇňÖöŞşÜüÇçÝýÀ-ÿ]+)?/, getSearchResults);
    
    bus.on(/\/enedilim\s*([a-zA-ZŽžÄäŇňÖöŞşÜüÇçÝýÀ-ÿ]+)?/, getEnedilim);
    
    bus.on(/\/english\s*([a-zA-ZŽžÄäŇňÖöŞşÜüÇçÝýÀ-ÿ]+)?/, getEnglish);
    
    bus.on(/\/turkmen\s*([a-zA-ZŽžÄäŇňÖöŞşÜüÇçÝýÀ-ÿ]+)?/, getTurkmen);
    
    bus.on(/\/kitap\s*([a-zA-ZŽžÄäŇňÖöŞşÜüÇçÝýÀ-ÿ]+)?/, getKitap);
    
    bus.on(/\/aydym\s*([a-zA-ZŽžÄäŇňÖöŞşÜüÇçÝýÀ-ÿ]+)?/, getSongs);
    
    // Register the command bus
    bot.register(bus);
    
    // If the update is valid, process it
    if (update) {
      bot.process();
    }   
  }      
}

function getEnglish(q) {
  
  logQuery("english",q);
  
  var html = UrlFetchApp.fetch('http://www.ajapsozluk.com/dictionary/turkmen-english/'+q, {muteHttpExceptions: true}).getContentText();
  var fromText = "<div id='category_dv'>";
  var toText = "<img src='images2/search_image.png' width='16' height='16' border='0' align=absmiddle hspace=2 alt='google image duwmesi'/></a></td></tr></table><br/>"; 
  var scraped = Parser.data(html).from(fromText).to(toText).build();
  var text = scraped.replace(/<[^>]+>/g, "");
  var pos=text.search("sözüniň manysy AjapSozluk.com");
  if (pos<0) {
    text=text.replace(/&nbsp;/g, ' ');
    text=text.replace(/Türkmençe-Iňlisçe/g, 'Türkmençe-Iňlisçe sözlük: ');
    text=text.replace(/\[Umumy[^\]]*]/g, '');
    this.replyToSender(text);
  } else {
    this.replyToSender("Türkmen dilinde '" + q + "' diýip bir söz menä bilemok entek. Ýalňyş düşünme, hemme temadan başym çykýar. Emma welin bu sözden habarym ýok. Başga bir söz soraý-da. :)");
  }

}

function getTurkmen(q) {
  
  logQuery("turkmen",q);
  
  var html = UrlFetchApp.fetch('http://www.ajapsozluk.com/dictionary/english-turkmen/'+q, {muteHttpExceptions: true}).getContentText();
  var fromText = "<div id='category_dv'>";
  var toText = "<img src='images2/search_image.png' width='16' height='16' border='0' align=absmiddle hspace=2 alt='google image duwmesi'/></a></td></tr></table><br/>"; 
  var scraped = Parser.data(html).from(fromText).to(toText).build();
  var text = scraped.replace(/<[^>]+>/g, "");
  var pos=text.search("sözüniň manysy AjapSozluk.com");
  if (pos<0) {
    text=text.replace(/&nbsp;/g, ' ');
    text=text.replace(/Iňlisçe-Türkmençe/g, 'Iňlisçe-Türkmençe sözlük: ');
    text=text.replace(/\[Umumy[^\]]*]/g, '');
    this.replyToSender(text);
  } else {
    this.replyToSender("Iňlis dilinde '" + q + "' diýip bir söz menä bilemok entek. Ýalňyş düşünme, hemme temadan başym çykýar. Emma welin bu sözden habarym ýok. Başga bir söz soraý-da. :)");
  }

}

function scrapeData() {
  // Retrieve table as a string using Parser.
  var url = "http://www.ajapsozluk.com/dictionary/turkmen-english/life";
  var fromText = "<div id='category_dv'>";
  var toText = "<img src='images2/search_image.png' width='16' height='16' border='0' align=absmiddle hspace=2 alt='google image duwmesi'/></a></td></tr></table><br/>";
  var content = UrlFetchApp.fetch(url, {muteHttpExceptions: true}).getContentText();
  //Logger.log(content);
  var scraped = Parser.data(content).from(fromText).to(toText).build();
  //Logger.log(scraped);
  // Modify values
  //scraped = scraped.replace(/=([a-zA-Z0-9\%-:]+)/g, "=\"$1\"").replace(/nowrap/g, "");
  //var xml = '<?xml version="1.0"?><sampleContents>' + scraped + '</sampleContents>';
  var text = scraped.replace(/<[^>]+>/g, "");
  var pos=text.search("sözüniň manysy AjapSozluk.com");
  if (pos<0) {
    text=text.replace(/&nbsp;/g, ' ');
    text=text.replace(/Türkmençe-Iňlisçe/g, 'Türkmençe-Iňlisçe sözlük: ');
    text=text.replace(/\[Umumy[^\]]*]/g, '');
    Logger.log(text);
  } else {
    Logger.log("Beyle bir soz yok");
  }
  // Parse table using XmlService.
  //var root = XmlService.parse(scraped).getRootElement();
  //Logger.log(root);
  // Retrieve header and modify it.
  //var headerTr = root.getChild("thead").getChildren();
  //var res = headerTr.map(function(e) {return e.getChildren().map(function(f) {return f.getValue()})});
  //res[0].splice(7, 0, "Change");

  // Retrieve values.
  //var values = root.getChild("tbody").getChildren();
  //var values = valuesTr.map(function(e) {return e.getChildren().map(function(f) {return f.getValue()})});
  //Array.prototype.push.apply(res, values);
  // Put the result to the active spreadsheet.
  //var ss = SpreadsheetApp.getActiveSheet();
  //ss.getRange(1, 1, res.length, res[0].length).setValues(res);
}

function getEnedilim(q) {
  
  logQuery("enedilim",q);
  
  var html = UrlFetchApp.fetch('http://enedilim.com/sozluk/soz/'+q,{contentType : 'text/html; charset=utf-8',muteHttpExceptions: true}).getContentText();
  var searchstring = '<div class="def">';
  var searchstring2 = '<hr />';
  var index = html.search(searchstring);
  if (index >= 0) {
    var pos = index + searchstring.length;
    var pos2 = html.search(searchstring2);
    var def = html.substring(pos, pos2);
    var text = def.replace(/<[^>]+>/g, " ");
    if (text.length>512){
      text=text.substring(0,600);
    }
    this.replyToSender(text);
    //Logger.log(text);
  } else {
    this.replyToSender("Türkmen dilinde '" + q + "' diýip bir söz menä bilemok entek. Ýalňyş düşünme, hemme temadan başym çykýar. Emma welin bu sözden habarym ýok. Başga bir söz soraý-da. :)");
    //Logger.log("Beyle bir soz bilemoga");
  }
  
  //html = html.replace(/(<!doctype.*tk")>/gi, '$1 "">');
  //var doc = XmlService.parse(html);
  //var html = doc.getRootElement();
  //var def = getElementsByClassName(html, 'def')[0];
  //var output = '';
  //var defsInDef = getElementsByTagName(def, 'p');
  //for(d in defsInDef) output+= defsInDef[i]+' ';
  //Logger.log(text);
}

function getKitap(q) {
  var html = UrlFetchApp.fetch('https://www.kitaphana.net/book/search?q=sosiologi'+q,{contentType : 'text/html; charset=utf-8'}).getContentText();
  var doc = XmlService.parse(html);
  var html = doc.getRootElement();
  var title = getElementsByClassName(html, 'book-title');
  var author= getElementsByClassName(html, 'book-author');
  var year= getElementsByClassName(html, 'book-publishing-year');
  var link='';
  var list = '';
  //var bookInList = getElementsByTagName(def, 'p');
  //for(d in bookInList) list+= bookInList[i]+' ';
  for (var i=0; i<title.length;i++) {
    Logger.log(title[i]);
  }
    //this.replyToSender(text);
}

function getSongs(q) {
  
  logQuery("aydym",q);

  var url = 'http://www.jadyly.com/api/search?search='+q;
  //http://www.jadyly.com/get-song-info?id=1266?type=lq
  //"/api/songs/" + id + "/download/" + type + "?name=" + downloadName;
  
  var results = JSON.parse(UrlFetchApp.fetch(url).getContentText());
  
  if (results.length > 0) {
    var count = results.length;
    for (var i=0; i < count; i++) {
      str=results[i].file+"";
      if (results[i].type=="audio")
        link = "http://www.jadyly.com/media/" + str.substring(0, str.length-4) + "-low.mp3";
        if (getStatusCode(link)!=200)
          link = "http://www.jadyly.com/media/" + str.substring(0, str.length-4) + ".mp3";
      if (results[i].type=="video")
        link = "http://www.jadyly.com/media/" + str.substring(0, str.length-4) + "-low.mp4";
      this.replyToSender(results[i].singer.name + " - " + results[i].name + " - "+link);
    }
  } else {
    this.replyToSender("Sungat 'intelligensiýamyz' entek beýle bir aýdym çykarmady. Sen çykaraý bolmasa. :)");
  }
  // Save the page title, description and hyperlink

}

function getSearchResults(q) {
  
  logQuery("gozlet",q);
  
  var url = 'https://www.googleapis.com/customsearch/v1?key={}&cx={}&q='+q;
  
  var results = JSON.parse(UrlFetchApp.fetch(url).getContentText());
  
     if (results.searchInformation.totalResults > 0) {

        var count = results.items.length;

        for (var i = 0; i < count; i++) {

          // Save the page title, description and hyperlink

          this.replyToSender(results.items[i].snippet + " " + results.items[i].link);

        }
     } else {
       this.replyToSender("Bah. " + q + " barada hiç zat bilemoklaý men çota. Dogry ýazdyňmyka özi?");
     }
}

function logQuery(f, q) {
  var sheet = SpreadsheetApp.openById('ID').getSheetByName('Sheet1');
  var nextRow = sheet.getLastRow() + 1;
  var date = new Date();
  sheet.getRange('A' + nextRow ).setValue(f);
  sheet.getRange('B' + nextRow ).setValue(q);
  sheet.getRange('C' + nextRow ).setValue(date);
}

function setWebhook() {
  var bot = new Bot(token, {});
  var result = bot.request('setWebhook', {
    url: ScriptApp.getService().getUrl()
  });
  
  Logger.log(result);
}

function randomJoke(name, surname) {
  var firstName = name || null;
  var lastName = surname || null;
      
  var url = 'http://api.icndb.com/jokes/random?escape=javascript';
  
  if (firstName) url += '&firstName=' + firstName;
  if (lastName) url += '&lastName=' + lastName;
  
  var data = JSON.parse(UrlFetchApp.fetch(url).getContentText());

  this.replyToSender(data.value.joke);
}

function Bot (token, update) {
  this.token = token;
  this.update = update;
  this.handlers = [];
}

Bot.prototype.register = function ( handler) {
  this.handlers.push(handler);
}

Bot.prototype.process = function () {  
  for (var i in this.handlers) {
    var event = this.handlers[i];
    var result = event.condition(this);
    if (result) {
      return event.handle(this);
    }
  }
}

Bot.prototype.request = function (method, data) {
  var options = {
    'method' : 'post',
    'contentType': 'application/json',
    'payload' : JSON.stringify(data)
  };
  
  var response = UrlFetchApp.fetch('https://api.telegram.org/bot' + this.token + '/' + method, options);
    
  if (response.getResponseCode() == 200) {
    return JSON.parse(response.getContentText());
  }
  
  return false;
}

Bot.prototype.replyToSender = function (text) {
  return this.request('sendMessage', {
    'chat_id': this.update.message.from.id,
    'text': text
  });
}

function CommandBus() {
  this.commands = [];
}

CommandBus.prototype.on = function (regexp, callback) {
  this.commands.push({'regexp': regexp, 'callback': callback});
}

CommandBus.prototype.condition = function (bot) {
  return bot.update.message.text.charAt(0) === '/';
}

CommandBus.prototype.handle = function (bot) {  
  for (var i in this.commands) {
    var cmd = this.commands[i];
    var tokens = cmd.regexp.exec(bot.update.message.text);
    if (tokens != null) {
      return cmd.callback.apply(bot, tokens.splice(1));
    }
  }
  return bot.replyToSender("Invalid command");
}

function getElementsByClassName(element, classToFind) {  
  var data = [];
  var descendants = element.getDescendants();
  descendants.push(element);  
  for(i in descendants) {
    var elt = descendants[i].asElement();
    if(elt != null) {
      var classes = elt.getAttribute('class');
      if(classes != null) {
        classes = classes.getValue();
        if(classes == classToFind) data.push(elt);
        else {
          classes = classes.split(' ');
          for(j in classes) {
            if(classes[j] == classToFind) {
              data.push(elt);
              break;
            }
          }
        }
      }
    }
  }
  return data;
}

function getElementsByTagName(element, tagName) {  
  var data = [];
  var descendants = element.getDescendants();  
  for(i in descendants) {
    var elt = descendants[i].asElement();     
    if( elt !=null && elt.getName()== tagName) data.push(elt);      
  }
  return data;
}

function getElementById(element, idToFind) {  
  var descendants = element.getDescendants();  
  for(i in descendants) {
    var elt = descendants[i].asElement();
    if( elt !=null) {
      var id = elt.getAttribute('id');
      if( id !=null && id.getValue()== idToFind) return elt;    
    }
  }
}

function getStatusCode(url){
   var options = {
     'muteHttpExceptions': true,
     'followRedirects': false
   };
   var url_trimmed = url.trim();
   var response = UrlFetchApp.fetch(url_trimmed, options);
   return response.getResponseCode();
}
