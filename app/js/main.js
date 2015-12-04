requirejs.config({
  baseUrl: './js/lib'
});

require(['chat', 'ui'], function(Chat, ui) {

  var chat = new Chat();
  
  ui.init(chat);
  chat.init();
});

