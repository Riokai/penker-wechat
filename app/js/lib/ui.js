define(['selector'], function(s) {

  var UI = function() {
    this.chat = null;
  }

  UI.prototype = {
    constructor: UI,

    init: function(chat) {
      this.chat = chat;
      this.showLogin();
      this.bindLogin();
      this.bindSend();
    },
    showLogin: function() {
      $(s.login).show();
      $(s.chat).hide();
    },

    showChat: function() {
      $(s.login).hide();
      $(s.chat).show();
    },
    // 绑定登录事件
    bindLogin: function() {
      var self = this;

      $(s.btnLogin).on('click', function() {
        var name = $(s.inputName).val();
        var pwd = $(s.inputPass).val();

        self.chat.login(name, pwd);
      });
    },

    bindSend: function() {
      var self = this;

      $(s.btnSend).on('click', function() {
        var $msg = $(s.message);
        var msg = $msg.val();

        $msg.val('');

        self.chat.sendText(msg);
      })
    }
  }

  return new UI();
});