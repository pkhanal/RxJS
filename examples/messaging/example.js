/**
 * Created by pkhanal on 4/6/15.
 */

(function(){

    // Observable (asynchronous data streams)
    var messageStream = Kaazing.Messaging.createMessageStream("ws://localhost:8001/jms", "/topic/stock");


    var googleStockQuoteSubscription = messageStream.filter(function(message) {
                                                        return message.getStringProperty("symbol") == "GOOG";
                                                    })
                                                    .map(function(message) {
                                                        // transform JMS message into a string that represents the stock quote
                                                        var messageText = message.getText();
                                                        var messageElements = messageText.split(":");
                                                        return messageElements[2];
                                                    })
                                                    .subscribe(
                                                        function(message) {
                                                            console.log("Google Quote: " + message);
                                                        },
                                                        function(error) {
                                                            console.log("error!");
                                                        }
                                                    );

    var appleStockQuoteSubscription = messageStream.filter(function(message) {
                                                        return message.getStringProperty("symbol") == "AAPL";
                                                    })
                                                    .map(function(message) {
                                                        // transform JMS message into a string that represents the stock quote
                                                        var messageText = message.getText();
                                                        var messageElements = messageText.split(":");
                                                        return messageElements[2];
                                                    })
                                                    .subscribe(
                                                    function(message) {
                                                        console.log("Apple Quote: " + message);
                                                    },
                                                    function(error) {
                                                        console.log("error!");
                                                    }
                                                );
})();