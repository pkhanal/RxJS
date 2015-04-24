/**
 * Created by pkhanal on 4/8/15.
 */

(function() {

    // 1. Fetch google stock quotes only
    //    - Filter message corresponding to google stock quote
    //    - Transform message object to a number representing the stock quote
    // 2. Fetch maximum value of apple stock in 5 seconds interval.
    //    - Filter message corresponding to apple stock
    //    - Transform message object to a number representing the stock quote
    //    - Buffer all the quotes received over 5 seconds
    //    - Find maximum value among the buffered quotes and emit the maximum value

    Kaazing.Messaging.connectTo("ws://localhost:8001/jms")
        .then(
            function(connection) {
                return connection.createChannel("/topic/stock");
            }
        )
        .then(
            function(channel) {
                // Observable (asynchronous data streams)
                var messageStream = channel.createMessageStream();

                messageStream
                    .filter(function(message) {
                        return message.getStringProperty("symbol") == "GOOG";
                    })
                    .map(getQuote)
                    .subscribe(
                        function(message) {
                            console.log("Google Quote: " + message);
                        },
                        function(error) {
                            console.log("error - " + error);
                        }
                    );

                messageStream
                    .filter(function(message) {
                        return message.getStringProperty("symbol") == "AAPL";
                    })
                    .map(getQuote)
                    .bufferWithTime(5000)
                    .flatMap(function(x) {
                        if (x.length == 0) {
                            return Rx.Observable.fromArray([]);
                        }
                        return Rx.Observable.fromArray(x).max(compare);
                    })
                    .subscribe(
                        function(message) {
                            console.log("[" + new Date() + "]Maximum quote of Apple stock in last 5 seconds: " + message);
                        },
                        function(error) {
                            console.log("error - " + error);
                        }
                    );
            }
        )
        .catch(
            function(error) {
                console.log("Error: " + error);
            }
        )

    function compare(x, y) {
        if (x > y) {
            return 1;
        }
        else if (x < y) {
            return -1;
        }
        else {
            0
        }
    }

    function getQuote(message) {
        // transform message object into a number that represents the stock quote
        var messageText = message.getText();
        var messageElements = messageText.split(":");
        return parseInt(messageElements[2]);
    }


})();