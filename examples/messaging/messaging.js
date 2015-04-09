/**
 * Created by pkhanal on 4/6/15.
 */

(function(global){

    var Kaazing = Kaazing || {};
    var Messaging = {};
    Kaazing.Messaging = Messaging;
    global.Kaazing = Kaazing;
    Messaging.createMessageStream = function(url, channel) {
        var observers = [];

        var stream = Rx.Observable.createWithDisposable(function(observer) {
            console.log("observer added");
            observers.push(observer);

            // Note that this is optional, you do not have to return this if you require no cleanup
            return Rx.Disposable.create(function () {
                // TODO: detach observer
                console.log('observer disposed');
            });
        });

        var handleException = function(error) {
            for (var i = 0; i < observers.length; i++) {
                observers[i].onError(error);
            }
        };

        var connectionFactory = new JmsConnectionFactory(url);
        var connectFuture = connectionFactory.createConnection(function() {
            if (!connectFuture.exception) {
                var connection = connectFuture.getValue();
                connection.setExceptionListener(function(error) {
                    // TODO: do not percolate - ConnectionDroppedException, ReconnectFailedException & ConnectionRestoredException
                    handleException(error);
                });
                connection.start(null);
                var session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
                var consumer = session.createConsumer(session.createTopic(channel));
                consumer.setMessageListener(function(message) {
                    for (var i = 0; i < observers.length; i++) {
                        observers[i].onNext(message);
                    }
                });
            }
            else {
                handleException(connectFuture.exception);
            }
        });

        return stream;
    };

})(window);