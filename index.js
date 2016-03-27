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
    var ch = $('#channel-item-template').clone();
    ch.removeClass('hidden');
    ch.removeAttr('id');
    showData(ch, channel);
    $('#channel-list').append(ch);

    ch.on('click', function() {
        currentChannel = channel;
        messages = db.child('messages/' + channel.key);
        showData($('#channel-info'), channel);
    });
});

$('#send-message').on('click', function() {
    messages.push({
        text: $('#message-text').val(),
        timestamp: Date.now()
    });
});


function showData($el, data) {
    for (var prop in data) {
        $('[data=' + prop + ']', $el).html(data[prop]);
    }
}

})();