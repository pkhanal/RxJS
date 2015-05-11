/**
 * Created by pkhanal on 4/24/15.
 */

(function() {
    var canvas = document.getElementById('demo');
    var drawingContext = canvas.getContext("2d");
    if (!drawingContext) {
        // Error
        return;
    }

    Kaazing.Messaging.newContext("ws://localhost:8001/jms")
        .then(function(context) {
            context.newSubscriber("canvas.drawing")
                .then(function(subscriber) {
                    subscriber
                        .map(function(message) {
                            return JSON.parse(message);
                        })
                        .subscribe(function(drawingInfo) {
                            drawingContext.moveTo(drawingInfo.first.offsetX, drawingInfo.first.offsetY);
                            drawingContext.lineTo(drawingInfo.second.offsetX, drawingInfo.second.offsetY);
                            drawingContext.stroke();
                        });
                });

            context.newSubscriber("canvas.control")
                .then(function(subscriber) {
                    subscriber.subscribe(function(controlMessage) {
                            if (controlMessage === 'clear') {
                                drawingContext.clearRect(0, 0, canvas.width, canvas.height);
                                drawingContext.beginPath();
                            }
                    });
                });
        });
}());
