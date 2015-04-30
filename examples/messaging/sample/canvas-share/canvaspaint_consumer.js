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

    var contextPromise = Kaazing.Messaging.newContext("ws://localhost:8001/jms");

    contextPromise
        .then(function(context) {
            return context.newSubscriber("canvas.drawing");
        })
        .then(function(subscriber) {
            subscriber
                .map(function(message) {
                    var messageText = message.getText();
                    return JSON.parse(messageText);
                })
                .subscribe(function(drawingInfo) {
                    drawingContext.moveTo(drawingInfo.first.offsetX, drawingInfo.first.offsetY);
                    drawingContext.lineTo(drawingInfo.second.offsetX, drawingInfo.second.offsetY);
                    drawingContext.stroke();
                });
        });

    contextPromise
        .then(function(context) {
           return context.newSubscriber("canvas.control");
        })
        .then(function(subscriber) {
            subscriber
                .map(function(message) {
                    return message.getText();
                })
                .subscribe(function(controlMessage) {
                    if (controlMessage === 'clear') {
                        drawingContext.clearRect(0, 0, canvas.width, canvas.height);
                        drawingContext.beginPath();
                    }
                });
        });
}());
