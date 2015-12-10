/**
 * @description UI模块
 * @author Kai
 */

define(['selector'], function(s) {

  var UI = function() {
    this.chat = null;
    this.hasEmotion = false;
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
      this.bindEmotionToggle();
      this.bindEmotionSelect();
    },
    
    showLogin: function() {
      $(s.login).show();
      $(s.chat).hide();
    },

    showChat: function() {
      $(s.login).hide();
      $(s.chat).show();
      this.focusInputMessage();
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

    bindEmotionToggle: function() {
      var self = this;

      $(s.emotionToggle).on('click', function() {
        if (!self.hasEmotion) {
          self.createEmotion();
        }

        self.hasEmotion = true;
        self.toggleEmotion();

      });
    },

    bindEmotionSelect: function() {
      var self = this;
      var $eleInput = $(s.message);

      $(s.emotionContainer).on('click', 'img', function() {
        
        $eleInput.val( $eleInput.val() + this.id );

        self.focusInputMessage();

        self.toggleEmotion();

      });
    },

    scrollToBottom: function() {
      var $ele = $(s.messageContainer);

      $ele.scrollTop($ele[0].scrollHeight);
    },

    toggleEmotion: function() {
      $(s.emotionContainer).toggle();
    },

    createEmotion: function() {
      var data = Easemob.im.Helper.EmotionPicData;

      for (var key in data) {
        var emotions = $('<img>').attr({
          'id': key,
          'src': data[key]
        });

        $('<li>').append(emotions).appendTo($(s.emotionContainer));
      }

      console.log(data);
    },

    focusInputMessage: function() {
      $(s.message).focus();
    }
  }

  return new UI();
});