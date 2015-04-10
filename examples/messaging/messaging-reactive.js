/**
 * Created by pkhanal on 4/7/15.
 */

(function(global){

    var Kaazing = Kaazing || {};
    var Messaging = {};
    Kaazing.Messaging = Messaging;
    global.Kaazing = Kaazing;

    Messaging.Channel = (function(){
        var channel = function(internalChannel, channelId) {
            this._internalChannel = internalChannel;
            this._channelId = channelId;
        }

        var $prototype = channel.prototype;

        $prototype.createMessageStream = function() {
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
            var session = this._internalChannel;
            var topic = session.createTopic(this._channelId);
            var consumer = session.createConsumer(topic);
            consumer.setMessageListener(function(message) {
                for (var i = 0; i < observers.length; i++) {
                    observers[i].onNext(message);
                }
            });

            // TODO: capture error on connection/channel and notify observer

            return stream;
        }

        $prototype.publish = function(message) {
            // TODO: implement
        }

        return channel;
    })();

    Messaging.Connection = (function(){
        var connection = function(internalConnection) {
            this._internalConnection = internalConnection;
        }

        var $prototype = connection.prototype;

        $prototype.createChannel = function(channelId) {
            var _resolve, _reject;
            var channelPromise = new Promise(function(resolve, reject) {
                _resolve = resolve;
                _reject = reject;
            });

            try {
                var session = this._internalConnection.createSession(false, Session.AUTO_ACKNOWLEDGE);
                var channel = new Messaging.Channel(session, channelId);
                _resolve(channel);

            }
            catch (error) {
                _reject(error);
            }
            finally {
                return channelPromise;
            }
        }

        return connection;

    })();

    Messaging.connectTo = function(providerUrl) {
        var _resolve, _reject;
        var connectPromise = new Promise(function(resolve, reject) {
            _resolve = resolve;
            _reject = reject;
        });
        try {
            var connectionFactory = new JmsConnectionFactory(providerUrl);
            var connectFuture = connectionFactory.createConnection(function() {
                if (!connectFuture.exception) {
                    var internalConnection = connectFuture.getValue();
                    internalConnection.setExceptionListener(function(error) {
                        // TODO: do not percolate - ConnectionDroppedException, ReconnectFailedException & ConnectionRestoredException
                    });
                    internalConnection.start(null);
                    var connection = new Messaging.Connection(internalConnection);
                    _resolve(connection);
                }
                else {
                    _reject(connectFuture.exception);
                }
            });
        }
        catch (error) {
            _reject(error);
        }
        finally {
            return connectPromise;
        }
    }

})(window);