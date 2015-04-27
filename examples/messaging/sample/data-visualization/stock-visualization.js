/**
 * Created by pkhanal on 4/26/15.
 */

(function(){
    Kaazing.Messaging.createMessagingContext("ws://localhost:8001/jms")
        .then(function(messagingContext) {
            var stockGraph = new StockGraph();
            var cscoStockObservable = messagingContext.newObservable("ticker.CSCO").map(getQuote);

            var intcStockObservable = messagingContext.newObservable("ticker.INTC").map(getQuote);

            var kzngStockObservable = messagingContext.newObservable("ticker.KZNG").map(getQuote);

            var msftStockObservable = messagingContext.newObservable("ticker.MSFT").map(getQuote);

            Rx.Observable.zip(cscoStockObservable,
                              intcStockObservable,
                              kzngStockObservable,
                              msftStockObservable,
                              function(csco, intc, kzng, msft) {
                                  return [csco, intc, kzng, msft];
                              })
                              .subscribe(function(data) {
                                  stockGraph.addStockData(data[0], data[1], data[2], data[3]);
                              });

        })
        .catch(
            function(error) {
                console.log("Messaging Error: " + error);
            }
        )

    function getQuote(message) {
        // transform message object into a number that represents the stock quote
        return parseInt(message.getStringProperty("price"));
    }
})();
