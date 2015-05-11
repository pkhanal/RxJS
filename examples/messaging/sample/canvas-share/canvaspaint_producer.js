/**
 * Created by pkhanal on 4/24/15.
 */

(function(){
    var clear = document.getElementById("clear");
    var canvas = document.getElementById("demo");
    var drawingContext = canvas.getContext("2d");

    if (!drawingContext) {
        // Error
        return;
    }

    drawingContext.beginPath();

    var mouseMoveStream = Rx.Observable.fromEvent(canvas, 'mousemove');
    var mouseUpStream = Rx.Observable.fromEvent(canvas, 'mouseup');
    var mouseDownStream = Rx.Observable.fromEvent(canvas, 'mousedown');

    // Calculate difference between two mouse moves
    var mouseMoveDiffStream = Rx.Observable.zip(mouseMoveStream,
                                                mouseMoveStream.skip(1),
                                                function(first, second) {
                                                    return {first: getOffset(first), second: getOffset(second)};
                                                });

    // Paint stream will emit drawing info only if mouse is down
    var paintStream = mouseDownStream
                        .map(function() {
                            return true;
                        })
                        .merge(mouseUpStream.map(function() { return false;}))
                        .flatMapLatest(function(down) {
                            return down ? mouseMoveDiffStream : mouseMoveDiffStream.take(0);
                        });

    paintStream.subscribe(function(drawingInfo) {
        drawingContext.moveTo(drawingInfo.first.offsetX, drawingInfo.first.offsetY);
        drawingContext.lineTo(drawingInfo.second.offsetX, drawingInfo.second.offsetY);
        drawingContext.stroke();
    });

    var clearEventStream = Rx.Observable.fromEvent(clear, 'click');
    clearEventStream
        .subscribe(function() {
            drawingContext.clearRect(0, 0, canvas.width, canvas.height);
            drawingContext.beginPath();
        });

    Kaazing.Messaging.newContext("ws://localhost:8001/jms")
        .then(function(context) {
           context.newPublisher("canvas.drawing")
               .then(function(publisher) {
                   paintStream
                       .map(function(paintInfo) {
                           return JSON.stringify(paintInfo);
                       })
                       .subscribe(publisher);
               });

            context.newPublisher("canvas.control")
                .then(function(publisher) {
                    clearEventStream.map(function() { return "clear"; }).subscribe(publisher);
                });
        });

    // Calculate offset either layerX/Y or offsetX/Y
    function getOffset(event) {
        return {
            offsetX: event.offsetX === undefined ? event.layerX : event.offsetX,
            offsetY: event.offsetY === undefined ? event.layerY : event.offsetY
        };
    }
})();