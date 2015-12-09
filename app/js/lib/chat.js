/**
 * @description 聊天模块：提供登录，发送消息等方法
 * @author Kai
 */

define(['selector', 'ui', 'config'], function(selector, ui) {
// define(['Easemob', 'selector', 'ui', 'config'], function(Easemob, selector, ui) {

  var Chat = function() {
    this.connection = null;
    this.curUserId = '';
    // this.curChatUserId = '';
    this.curChatUserId = 'test2';

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
          console.log('connecion open');
          self.handleOpened(self.connection);
        },
        onClosed: function() {
          self.handleClosed();
        },
        onError: function() {
          self.handleError();
        },
        onRoster: function() {

        },
        //收到文本消息时的回调方法
        onTextMessage : function(msg) {
          var message = msg.data;

          console.log('receive', message);
          self.handleTextMessage(message);
        },
        onEmotionMessage: function(msg) {
          self.handleEmotion(msg);
        },
        onPictureMessage: function(msg) {
          self.handlePictureMessage(msg);
        },
        //收到联系人订阅请求的回调方法
        onPresence : function(msg) {
          console.log('presence');
          // self.handlePresence(message);
        },
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

    handleOpened: function(conn) {
      var self = this;

      ui.showChat();

      self.curUserId = conn.context.userId;

      console.log('uid', self.curUserId);

      conn.getRoster({
        success: function(roster) {
          var ros = null;

          for (var i in roster) {
            ros = roster[i];

            if (ros.subscription === 'both' || 
                ros.subscription === 'from') {
              self.bothRoster.push(ros);
            } else if (ros.subscription === 'to') {
              self.toRoster.puth(ros);
            }
          }

          // console.log('bothRoster', self.bothRoster);
          // console.log('toRoster', self.toRoster);
        }
      });

      // 设置用户上线状态
      conn.setPresence();

      if (conn.isOpened()) {
        console.log('connection is open');
        conn.heartBeat(conn);
      }
    },

    handleClosed: function() {
      console.log('connection close');
    },

    handleError: function(message) {
      console.error('error', message);
    },

    handleTextMessage: function(message) {
      this.appendMsg(false, message);
    },
    
    handleEmotion: function(message) {
      
    },


    handlePictureMessage: function(message) {
      // 带扩展名的文件名称
      var filname = message.filename;
      var from = message.from;
      var msgType = message.type;
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
        // to: 'test2',
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

      this.appendMsg(true, msg);

      // 重置发送状态
      timerClearSending = setTimeout(function() {
        self.textSending = false;
      }, 1000);

    },

    sendPic: function(id) {

      var self = this;
      var to = self.curChatUserId;

      var fileObj = null;
      var fileType = '';
      var fileName = '';

      if (to === '') {
        alert('请选择联系人！');

        return;
      }

      fileObj = Easemob.im.Helper.getFileUrl(id);

      if (fileObj.url === null || fileObj.url === '') {
        alert('请选择发送图片！');

        return;
      }

      fileType = fileObj.filetype;
      fileName = fileObj.filename;

      if (fileType in self.picType) {
        var opt = {
          fileInputId: id,
          to: to,
          onFileUploadError: function(err) {
            console.log('send image error');
            console.error('err', err);
          },
          onFileUploadComplete: function(data) {
            console.log('send image complete');
            console.log('data', data);
          }
        }

        self.connection.sendPicture(opt);

        return;
      }

      alert('不支持的文件类型', fileType);

    },

    appendMsg: function(isSelf, message) {
      var $container = $(selector.messageList);
      var content = '';

      console.log('append message', message);

      if (isSelf) {
        content = '<li class="msg-list-content me">' +
                    '<div class="pic">' + 
                      '<img src="images/avatar.png" alt="">' + 
                    '</div>' + 
                    '<div>' + message + '</div>' + 
                  '</li>';
      } else {
        content = '<li class="msg-list-content guide">' +
                    '<div class="pic">' + 
                      '<img src="images/avatar.png" alt="">' + 
                    '</div>' + 
                    '<div>' + message + '</div>' + 
                  '</li>';
      }

      $container.append(content);

    }
  };

  return Chat;

});