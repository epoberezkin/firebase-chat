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

})();