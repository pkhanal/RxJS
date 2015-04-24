/**
 * Created by pkhanal on 4/24/15.
 */

(function() {
    Kaazing.Messaging.createMessagingContext("ws://localhost:8001/jms")
        .then(function(messagingContext) {

            // Create Consumer/Observable on a destination/channel - "demo"
            var observable = messagingContext.newObservable("demo");

            observable.subscribe(
                function(message) {
                    console.log("Message: " + message.getText());
                },
                function(error) {
                    console.log("error - " + error);
                }
            );


            // Create Publisher/Observer on a destination/channel - "demo"
            var observer = messagingContext.newObserver("demo");

            observer.onNext("Hello World");

        })
        .catch(
            function(error) {
                console.log("Error while creating messaging context: " + error);
            }
        )
})();