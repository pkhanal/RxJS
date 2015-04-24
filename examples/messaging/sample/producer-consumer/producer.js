/**
 * Created by pkhanal on 4/24/15.
 */

/**
 * Created by pkhanal on 4/24/15.
 */

(function() {
    var $logger = document.getElementById("logger");
    Kaazing.Messaging.createMessagingContext("ws://localhost:8001/jms")
        .then(function(messagingContext) {
            // Create Publisher/Observer on a destination/channel - "demo"
            var observer = messagingContext.newObserver("demo");

            $logger.innerHTML += 'Observer Created on a channel - demo <BR />';

            // Publish Message
            observer.onNext("Hello World");
            $logger.innerHTML += 'Message Published<BR />';

            observer.onNext("Hello World");
            $logger.innerHTML += 'Message Published<BR />';

            observer.onNext("Hello World");
            $logger.innerHTML += 'Message Published<BR />';

            observer.onNext("Hello World");
            $logger.innerHTML += 'Message Published<BR />';
        })
        .catch(
        function(error) {
            console.log("Error: " + error);
        }
    )
})();
