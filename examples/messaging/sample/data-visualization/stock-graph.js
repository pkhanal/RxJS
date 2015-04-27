/**
 * Created by pkhanal on 4/26/15.
 */

(function(global){
    var StockGraph = function() {
        this.ciscoStockData = [];
        this.intelStockData = [];
        this.kaazingStockData = [];
        this.microsoftStockData = [];
        this.dataCounter = 0;
        init(this);
    };

    function init($this) {
        var palette = new Rickshaw.Color.Palette( { scheme: 'munin' } );
        var graph = new Rickshaw.Graph( {
            element: document.getElementById("chart"),
            width: 900,
            height: 500,
            renderer: 'area',
            interpolation: 'step-after',
            stroke: true,
            preserve: true,
            series: [
                {
                    color: palette.color(),
                    data: $this.ciscoStockData,
                    name: 'Cisco Systems (CSCO)'
                }, {
                    color: palette.color(),
                    data: $this.intelStockData,
                    name: 'Intel (INTC)'
                }, {
                    color: palette.color(),
                    data: $this.kaazingStockData,
                    name: 'Kaazing (KZNG)'
                }, {
                    color: palette.color(),
                    data: $this.microsoftStockData,
                    name: 'Microsoft (MSFT)'
                }
            ]
        });

        $this.graph = graph;

        graph.render();

        var legend = new Rickshaw.Graph.Legend( {
            graph: graph,
            element: document.getElementById('legend')
        } );

        var hoverDetail = new Rickshaw.Graph.HoverDetail( {
            graph: graph,
            xFormatter: function(x) {
                return new Date(x * 1000).toString();
            }
        } );

        var ticksTreatment = 'glow';

        var xAxis = new Rickshaw.Graph.Axis.X({
            graph: graph,
            ticksTreatment: ticksTreatment,
            tickFormat: function(x){
                var date = new Date(x * 1000);
                return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
            }
        })
        xAxis.render();

        var yAxis = new Rickshaw.Graph.Axis.Y( {
            graph: graph,
            tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
            ticksTreatment: ticksTreatment
        } );

        yAxis.render();
    }

    StockGraph.prototype.addStockData = function(csco, intc, kzng, msft) {
        var time = Math.floor(new Date().getTime() / 1000);
        shiftIfNecessaryAndAdd(this.ciscoStockData, {x: time, y: csco}, 50);
        shiftIfNecessaryAndAdd(this.intelStockData, {x: time, y: intc}, 50);
        shiftIfNecessaryAndAdd(this.kaazingStockData, {x: time, y: kzng}, 50);
        shiftIfNecessaryAndAdd(this.microsoftStockData, {x: time, y: msft}, 50);
        this.graph.update();
    }
    global.StockGraph = StockGraph;

    function shiftIfNecessaryAndAdd(dataSource, data, threshold) {
        if (dataSource.length == threshold) {
            dataSource.shift();
        }
        dataSource.push(data);
    }

})(window);

