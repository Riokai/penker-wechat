requirejs.config({
  baseUrl: '/js/lib',
  paths: {
    // sdk: '../assets/web-im-1.0.7.2/sdk',
    // Easemob: '../../assets/web-im-1.0.7.2/sdk/easemob.im-1.0.7',
    // Strophe: '../../assets/web-im-1.0.7.2/sdk/strophe',
    // json2: '../../assets/web-im-1.0.7.2/sdk/json2'
  },
  shim: {
    // Easemob: {
    //   deps: ['Strophe', 'json2'],
    //   exports: 'Easemob'
    // },
    // json2: {
    //   exports: 'json2'
    // },
    // Strophe: {
    //   exports: 'Strophe'
    // }
  },
  urlArgs: 'dev=' + (new Date()).getTime()
});

require(['chat', 'ui'], function(Chat, ui) {

  var chat = new Chat({
    name: user_id,
    password: user_password,
    to: guide_id
  });
  
  ui.init(chat);
  chat.init();
});

