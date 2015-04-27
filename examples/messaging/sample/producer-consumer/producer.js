/**
 * Created by pkhanal on 4/24/15.
 */

(function() {
    var $logger = document.getElementById("logger");
    var $send = document.getElementById("send");
    Kaazing.Messaging.createMessagingContext("ws://localhost:8001/jms")
        .then(function(messagingContext) {
            // Create Publisher/Observer on a destination/channel - "demo"
            var observer = messagingContext.newObserver("demo");

            $logger.innerHTML += 'Observer Created on a channel - demo <BR />';

            /*var sendClickObservable = Rx.Observable.fromEvent($send, 'click');
            sendClickObservable.subscribe(function(event){
                // Publish Message
                observer.onNext("Hello World");
                $logger.innerHTML += 'Message Published<BR />';
            }, function(error) {

            });*/

            setInterval(function(){
                // Publish Message
                observer.onNext("Hello World");
                $logger.innerHTML += 'Message Published<BR />';
            }, 1000);
        })
        .catch(
        function(error) {
            console.log("Error: " + error);
        }
    )
})();
