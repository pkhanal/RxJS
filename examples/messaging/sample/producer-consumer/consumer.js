/**
 * Created by pkhanal on 4/24/15.
 */

(function() {
    var $logger = document.getElementById("logger");
    Kaazing.Messaging.createMessagingContext("ws://localhost:8001/jms")
        .then(function(messagingContext) {

            // Create Consumer/Observable on a destination/channel - "destination"
            var observable = messagingContext.newObservable("demo");

            observable.subscribe(
                function(message) {
                    var message = "Message Received on channel - demo: " + message.getText();
                    console.log(message);
                    $logger.innerHTML += message + '<BR />';
                },
                function(error) {
                    var message = "error - " + error;
                    console.log(message);
                    $logger.innerHTML += message + '<BR />';
                }
            );

            // 2. Fetch maximum value of apple stock in 5 seconds interval.
            //    - Filter message corresponding to apple stock
            //    - Transform message object to a number representing the stock quote
            //    - Buffer all the quotes received over 5 seconds
            //    - Find maximum value among the buffered quotes and emit the maximum value
            var appleStockObservable = messagingContext.newObservable("stock");

            appleStockObservable
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
                    var message = "[" + new Date() + "]Maximum quote of Apple stock in last 5 seconds: " + message;
                    console.log(message);
                    $logger.innerHTML += message + '<BR />';
                },
                function(error) {
                    var message = "error - " + error;
                    console.log(message);
                    $logger.innerHTML += message + '<BR />';
                }
            );
        })
        .catch(
            function(error) {
                console.log("Error while creating messaging context: " + error);
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