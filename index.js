(function() {
'use strict';

var db = new Firebase('https://chattinghere.firebaseio.com/');

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
    for (var prop in channel) {
        $('[data=' + prop + ']', ch).html(channel[prop]);
    }
    $('#channel-list').append(ch);
});

})();