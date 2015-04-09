/**
 * Created by pkhanal on 4/8/15.
 */

(function(){

    // 1. Fetch google stock quotes only
    //    - Filter message corresponding to google stock quote
    //    - Transform message object to a number representing the stock quote
    // 2. Fetch maximum value of apple stock in 5 seconds interval.
    //    - Filter message corresponding to apple stock
    //    - Transform message object to a number representing the stock quote
    //    - Buffer all the quotes received over 5 seconds
    //    - Find maximum value among the buffered quotes and emit the maximum value

    var connectionFactory = new JmsConnectionFactory("ws://localhost:8001/jms");
    var connectFuture = connectionFactory.createConnection(function() {
        if (!connectFuture.exception) {
            var connection = connectFuture.getValue();
            connection.setExceptionListener(function(error) {
                console.log("Exception: " + error);
            });

            connection.start(function(){
                var session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
                var topic = session.createTopic("/topic/stock");
                var consumer = session.createConsumer(topic);

                consumer.setMessageListener(function(message) {
                    var symbol = message.getStringProperty("symbol");
                    if (symbol === "GOOG") {
                        googleStockTickerReceived(message);
                    }
                    else if (symbol === "AAPL") {
                        appleStockTickerReceived(message);
                    }
                });

            });
        }
        else {
            console.log("Exception: " + error);
        }
    });

    function googleStockTickerReceived(message) {
        var quote = getQuote(message);
        console.log("Google Quote: " + quote);
    }

    var quoteBuffer = [];
    var timer = null;
    function appleStockTickerReceived(message) {
        var quote = getQuote(message);
        quoteBuffer.push(quote);
        if (timer == null) {
            timer = setInterval(function() {
                var intervalBuffer = quoteBuffer;
                quoteBuffer = [];

                // find maximum quote
                var maxQuote = intervalBuffer[0];
                for (var i = 1; i < intervalBuffer.length; i++) {
                    if (intervalBuffer[i] > maxQuote) {
                        maxQuote = intervalBuffer[i];
                    }
                }
                console.log("[" + new Date() + "]Maximum quote of Apple stock in last 5 seconds: " + maxQuote);

            }, 5000);
        }
    }

    function getQuote(message) {
        // transform JMS message into a number that represents the stock quote
        var messageText = message.getText();
        var messageElements = messageText.split(":");
        return parseInt(messageElements[2]);
    }

})();