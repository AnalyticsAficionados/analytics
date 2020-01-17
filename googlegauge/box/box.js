(function() {

    let shadowRoot;
    var Ar = [];
    var ArData = [];
    var ArOptions = [];
    var ArChart = [];

    let template = document.createElement("template");
    template.innerHTML = `
		<style>
        body {
            font: 10px arial;
        }
        </style>        
	`;

    let firsttime = 0;

    const loader = "https://www.gstatic.com/charts/loader.js";
    const gaugejs = "https://ferrygun.github.io/proj/googlegauge/box/t.js";

    function loadScript(src, callback) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        script.addEventListener("load", callback);
        shadowRoot.appendChild(script);
    };

    function GoogleChart(divstr, text, value, firsttime) {
        google.setOnLoadCallback(function() {
            drawChart(divstr, text, value, firsttime);
        });
    };


    function drawChart(divstr, text, value, firsttime) {
        if (firsttime === 0) {
            var data = google.visualization.arrayToDataTable([
                ['Label', 'Value'],
                [text, value]
            ]);

            ArData.push({
                'id': text,
                'data': data
            });


            var options = {
                width: 600,
                height: 240,
                redFrom: 80,
                redTo: 100,
                yellowFrom: 55,
                yellowTo: 90,
                minorTicks: 5
            };

            ArOptions.push({
                'id': text,
                'options': options
            });

            var chart = new google.visualization.Gauge(divstr);
            chart.draw(data, options);

            ArChart.push({
                'id': text,
                'chart': chart
            });

        } else {

            var foundIndex = ArData.findIndex(x => x.id == text);
            console.log("foundIndex drawChart: " + foundIndex);

            ArData[foundIndex].data.setValue(0, 1, value);
            ArChart[foundIndex].chart.draw(ArData[foundIndex].data, ArOptions[foundIndex].options);
        }
    };

    function Draw(Ar, firsttime) {
        console.log(Ar);

        for (var i = 0; i < Ar.length; i++) {
            GoogleChart(Ar[i].div, Ar[i].id, 0, firsttime);
        }
    };

    class Box extends HTMLElement {
        constructor() {
            super();
            shadowRoot = this.attachShadow({
                mode: "open"
            });
            shadowRoot.appendChild(template.content.cloneNode(true));

            this.addEventListener("click", event => {
                console.log('click');
                var event = new Event("onClick");
                this.dispatchEvent(event);
            });

            this._props = {};
        }

        connectedCallback() {
            console.log("connectedCallback");
        }

        onCustomWidgetBeforeUpdate(changedProperties) {
            console.log("onCustomWidgetBeforeUpdate");
            this._props = {
                ...this._props,
                ...changedProperties
            };
        }

        onCustomWidgetAfterUpdate(changedProperties) {
            console.log("onCustomWidgetAfterUpdate");
            console.log(changedProperties);

            if ("value" in changedProperties) {
                console.log("value:" + changedProperties["value"]);
                this.$value = changedProperties["value"];
            }

            if ("reference" in changedProperties) {
                console.log("reference:" + changedProperties["reference"]);
                this.$reference = changedProperties["reference"];
            }

            if ("color" in changedProperties) {
                console.log("color:" + changedProperties["color"]);
                this.$color = changedProperties["color"];
            }

            console.log("firsttime: " + firsttime);

            if (firsttime === 0) {
                const div = document.createElement('div');
                let divid = changedProperties.widgetName;
                div.innerHTML = '<div id="chart_div' + divid + '"></div>';
                shadowRoot.appendChild(div);

                var mapcanvas_divstr = shadowRoot.getElementById('chart_div' + divid);
                console.log(mapcanvas_divstr);
                Ar.push({
                    'id': divid,
                    'div': mapcanvas_divstr
                });


                loadScript(loader, function() {
                    console.log("Load:" + loader);
                    loadScript(gaugejs, function() {
                        console.log("Load:" + gaugejs);

                        Draw(Ar, firsttime);
                        firsttime = 1;
                    });
                });

            } else {
                var item = this.$value.split(":")[0];
                console.log("item: " + item);

                var data = this.$value.split(":")[1];
                console.log("data: " + data);
                if (data !== "") {

                    var foundIndex = Ar.findIndex(x => x.id == item);
                    console.log("foundIndex: " + foundIndex);

                    if (foundIndex !== -1) {
                        console.log(Ar[foundIndex].div);
                        drawChart(Ar[foundIndex].div, item, parseInt(data), firsttime);
                    }
                }

            }

        }
    }

    customElements.define("com-fd-googlegauge", Box);
})();
