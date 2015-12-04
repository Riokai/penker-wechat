/**
 * @description 聊天模块：提供登录，发送消息等方法
 * @author Kai
 */

define(['selector', 'ui', 'config'], function(selector, ui) {

  var Chat = function() {
    this.connection = null;
    this.curUserId = '';
    this.curChatUserId = '';

    this.bothRoster = [];
    this.toRoster = [];

    this.textSending = false;

    this.picType = {
      jpg: true,
      gif: true,
      png: true,
      bmp: true
    };

  };

  Chat.prototype = {
    constructor: Chat,

    init: function() {
      
      var self = this;

      self.config();

      self.connection = new Easemob.im.Connection();

      self.connection.init({
        https : Easemob.im.config.https,
        url: Easemob.im.config.xmppURL,
        onOpened: function() {
          self.handleOpened();
        },
        onClosed: function() {
          self.handleClosed();
        },
        onError: function() {
          self.handleError();
        },
        onTextMessage: function(msg) {
          self.handleTextMessage(msg);
        },
        onEmotionMessage: function(msg) {
          self.handleEmotion(msg);
        }
      });
    },

    config: function() {
      if(Easemob.im.Helper.getIEVersion() < 10) {
        Easemob.im.config.https = location.protocol == 'https:' ? true : false;
        if(!Easemob.im.config.https) {
          if(Easemob.im.config.xmppURL.indexOf('https') == 0) {
            Easemob.im.config.xmppURL = Easemob.im.config.xmppURL.replace(/^https/, 'http');
          }
          if(Easemob.im.config.apiURL.indexOf('https') == 0) {
            Easemob.im.config.apiURL = Easemob.im.config.apiURL.replace(/^https/, 'http');
          }
        } else {
          if(Easemob.im.config.xmppURL.indexOf('https') != 0) {
            Easemob.im.config.xmppURL = Easemob.im.config.xmppURL.replace(/^http/, 'https');
          }
          if(Easemob.im.config.apiURL.indexOf('https') != 0) {
            Easemob.im.config.apiURL = Easemob.im.config.apiURL.replace(/^http/, 'https');
          }
        }
      }
    },

    handleOpened: function() {
      var self = this;

      ui.showChat();

      self.curUserId = self.connection.context.userId;

      console.log('uid', self.curUserId);

      self.connection.getRoster({
        success: function(roster) {
          var ros = null;

          console.log('roster', roster);

          for (var i in roster) {
            ros = roster[i];

            if (ros.subscription === 'both' || 
                ros.subscription === 'from') {
              self.bothRoster.push(ros);
            } else if (ros.subscription === 'to') {
              self.toRoster.puth(ros);
            }
          }

          console.log('bothRoster', self.bothRoster);
          console.log('toRoster', self.toRoster);
        }
      });
    },

    handleClosed: function() {
      console.log('connection close');
    },

    handleError: function(message) {
      console.error('error', message);
    },

    handleTextMessage: function(message) {
      console.log('message', message);
    },

    login: function(name, pwd) {
      console.log('name', name);
      console.log('pwd', pwd);

      this.connection.open({
        apiUrl : Easemob.im.config.apiURL,
        user : name,
        pwd : pwd,
        //连接时提供appkey
        appKey : Easemob.im.config.appkey
      });
    },

    sendText: function(msg) {
      var self = this;
      var timerClearSending = null;
      var options = {
        to: self.curChatUserId,
        // to: 'testpk',
        msg: msg,
        type: 'chat'
      };

      if (self.textSending) {
        console.warn('text sending...');

        return;
      }

      if (options.to === '') {
        console.error('to is empty');

        return;
      }

      textSending = true;

      this.connection.sendTextMessage(options);

      // 重置发送状态
      timerClearSending = setTimeout(function() {
        self.textSending = false;
      }, 1000);

    }
  };

  return Chat;

});