/**
 * @description UI模块
 * @author Kai
 */

define(['selector'], function(s) {

  var UI = function() {
    this.chat = null;
  }

  UI.prototype = {
    constructor: UI,

    init: function(chat) {
      this.chat = chat;
      this.showLogin();
      // this.showChat();
      this.bindSend();
      this.bindLogin();
      this.bindInputSend();
      this.bindSendImage();
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
    },

    bindInputSend: function() {
      var self = this;

      $(s.message).on('keydown', function(e) {
        var msg = $(s.message).val();
        

        if (e.keyCode === 13) {
          e.preventDefault();
          $(s.message).val('');
          self.chat.sendText(msg);
        }
      })
    },

    bindSendImage: function() {
      var self = this;

      $(s.inputImage).on('change', function() {
        
        if ($(this).val() !== '') {
          self.chat.sendPic(s.inputImage.substring(1));
        }

      })
    },
  }

  return new UI();
});