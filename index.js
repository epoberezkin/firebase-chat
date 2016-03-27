(function() {
'use strict';

var db = new Firebase('https://chattinghere.firebaseio.com/');
var messages;
var currentChannel;

$('#create-channel-btn').on('click', function() {
    db.child('channels').push({
        title: $('#channel-title').val(),
        description: $('#channel-description').val()
    }, function() {
        window.alert('Channel created!');
        $('#create-channel').modal('hide');
    });
});

db.child('channels').on('child_added', function (snapshot) {
    var channel = snapshot.val();
    channel.key = snapshot.key();
    var ch = addItem($('#channel-list'), $('#channel-item-template'));
    showData(ch, channel);
    if (!currentChannel) selectChannel();
    ch.on('click', selectChannel);

    function selectChannel() {
        if (messages) {
            messages.off('child_added', showMessage);
            $('#channel-messages .message').not('#message-template').remove();
        }

        currentChannel = channel;
        messages = db.child('messages/' + channel.key);
        showData($('#channel-info'), channel);

        messages.on('child_added', showMessage);

        $('#channel-list li').removeClass('selected');
        ch.addClass('selected');
    }
});

$('#send-message').on('click', sendMessage);

$('#message-text').on('keypress', function(e) {
    if (e.keyCode == 13) sendMessage();
})

function sendMessage() {
    var text = $('#message-text');
    messages.push({
        userHandle: getHandle(),
        text: text.val(),
        timestamp: Date.now()
    });
    text.val('');
}

var HANDLE_KEY = '/slack_clone/userHandle';
var userHandle = $('#user-handle');
userHandle.val(getHandle());
userHandle.on('input', function() {
    setHandle(userHandle.val());
});

function getHandle() {
    return window.localStorage.getItem(HANDLE_KEY);
}

function setHandle(text) {
    window.localStorage.setItem(HANDLE_KEY, text);
}

function showMessage(snapshot) {
    var message = snapshot.val();
    var msg = addItem($('#channel-messages'), $('#message-template'));
    showData(msg, message);
}

function showData($el, data) {
    for (var prop in data) {
        $('[data=' + prop + ']', $el).html(data[prop]);
    }
}

function addItem($list, $template) {
    var item = $template.clone();
    item.removeClass('hidden');
    item.removeAttr('id');
    $list.append(item);
    return item;
}

})();