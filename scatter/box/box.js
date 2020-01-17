(function() {
	let shadowRoot;
	
	var Ar = [];
	var ArChartGauge = [];
	
	let template = document.createElement("template");
	template.innerHTML = `
		<style type="text/css">
		  .highcharts-figure, .highcharts-data-table table {
			  min-width: 310px; 
			  max-width: 800px;
			  margin: 0 auto;
			}
			
			#container {
			  height: 400px; 
			}
			
			.highcharts-data-table table {
			  font-family: Verdana, sans-serif;
			  border-collapse: collapse;
			  border: 1px solid #EBEBEB;
			  margin: 10px auto;
			  text-align: center;
			  width: 100%;
			  max-width: 500px;
			}
			.highcharts-data-table caption {
			  padding: 1em 0;
			  font-size: 1.2em;
			  color: #555;
			}
			.highcharts-data-table th {
			  font-weight: 600;
			  padding: 0.5em;
			}
			.highcharts-data-table td, .highcharts-data-table th, .highcharts-data-table caption {
			  padding: 0.5em;
			}
			.highcharts-data-table thead tr, .highcharts-data-table tr:nth-child(even) {
			  background: #f8f8f8;
			}
			.highcharts-data-table tr:hover {
			  background: #f1f7ff;
			}			
  </style>       
	`;

	let firsttime = 0;
	
	const highcharts_js = "https://ferrygun.github.io/proj/scatter/box/h.js";
	const highcharts_3d_js = "https://ferrygun.github.io/proj/scatter/box/h3d.js";
	
	function loadScript(src, callback) {
	    const script = document.createElement('script');
	    script.type = 'text/javascript';
	    script.src = src;
	    script.addEventListener("load", callback);
		shadowRoot.appendChild(script);		
	};
	
		
	// Create the chart
	function Scatter(id, divid, title, subtitle, min_val, max_val, value, firsttime) {
		console.log("divid");
		console.log(divid);
		console.log("firsttime:" + firsttime); 
		
		var data_res = value.split(';');
		var myArray = [];
		var res = [];

		for(var i=0; i<data_res.length; i++) {	
			res = [];

			for(var j=0; j<data_res[i].split(',').length; j++) {
				res.push(parseInt(data_res[i].split(',')[j]));
			}
			myArray.push(res);
			
		}
		console.log(myArray);
		
		if(firsttime === 0) {
			/*
			// Give the points a 3D feel by adding a radial gradient
			Highcharts.setOptions({
			    colors: Highcharts.getOptions().colors.map(function (color) {
			        return {
			            radialGradient: {
			                cx: 0.4,
			                cy: 0.3,
			                r: 0.5
			            },
			            stops: [
			                [0, color],
			                [1, Highcharts.Color(color).brighten(-0.2).get('rgb')]
			            ]
			        };
			    })
			});
			*/
		
			// Set up the chart
			var chart = new Highcharts.Chart(divid, {
			    chart: {
			        margin: 100,
			        type: 'scatter3d',
			        animation: false,
			        options3d: {
			            enabled: true,
			            alpha: 10,
			            beta: 30,
			            depth: 250,
			            viewDistance: 5,
			            fitToPlot: false,
			            frame: {
			                bottom: { size: 1, color: 'rgba(0,0,0,0.02)' },
			                back: { size: 1, color: 'rgba(0,0,0,0.04)' },
			                side: { size: 1, color: 'rgba(0,0,0,0.06)' }
			            }
			        }
			    },
			    title: {
			        text: title
			    },
			    subtitle: {
			        text: subtitle
			    },
				credits: {
						enabled: false
				},
			    plotOptions: {
			        scatter: {
			            width: 10,
			            height: 10,
			            depth: 10
			        }
			    },
			    yAxis: {
			        min: parseInt(min_val),
			        max: parseInt(max_val),
			        title: null
			    },
			    xAxis: {
			        min: parseInt(min_val),
			        max: parseInt(max_val),
			        gridLineWidth: 1
			    },
			    zAxis: {
			        min: parseInt(min_val),
			        max: parseInt(max_val),
			        showFirstLabel: false
			    },
			    legend: {
			        enabled: false
			    },
			    series: [{
			        //name: 'Data',
			        colorByPoint: true,
			        accessibility: {
			            exposeAsGroupOnly: true
			        },
			        data: myArray
			    	
			    }]
			});
			
			// Add mouse and touch events for rotation
			(function (H) {
			    function dragStart(eStart) {
			        eStart = chart.pointer.normalize(eStart);
	
			        var posX = eStart.chartX,
			            posY = eStart.chartY,
			            alpha = chart.options.chart.options3d.alpha,
			            beta = chart.options.chart.options3d.beta,
			            sensitivity = 5,  // lower is more sensitive
			            handlers = [];
	
			        function drag(e) {
			            // Get e.chartX and e.chartY
			            e = chart.pointer.normalize(e);
	
			            chart.update({
			                chart: {
			                    options3d: {
			                        alpha: alpha + (e.chartY - posY) / sensitivity,
			                        beta: beta + (posX - e.chartX) / sensitivity
			                    }
			                }
			            }, undefined, undefined, false);
			        }
	
			        function unbindAll() {
			            handlers.forEach(function (unbind) {
			                if (unbind) {
			                    unbind();
			                }
			            });
			            handlers.length = 0;
			        }
	
			        handlers.push(H.addEvent(document, 'mousemove', drag));
			        handlers.push(H.addEvent(document, 'touchmove', drag));
	
	
			        handlers.push(H.addEvent(document, 'mouseup', unbindAll));
			        handlers.push(H.addEvent(document, 'touchend', unbindAll));
			    }
			    H.addEvent(chart.container, 'mousedown', dragStart);
			    H.addEvent(chart.container, 'touchstart', dragStart);
			}(Highcharts));
			
			ArChartGauge.push({
				'id': id,
				'chartgauge': chart
			});
			
		} else {
			
			var foundIndex = Ar.findIndex(x => x.id == id);
			console.log("foundIndex drawChart: " + foundIndex);
			
			while(ArChartGauge[foundIndex].chartgauge.series.length > 0) {
				ArChartGauge[foundIndex].chartgauge.series[0].remove(true);
			}
			
			ArChartGauge[foundIndex].chartgauge.addSeries({                        
					//name: 'Data',
					colorByPoint: true,
					accessibility: {
						exposeAsGroupOnly: true
					},
				data: myArray
			});
			
		}
		
	};
	
	function Draw(Ar, firsttime) {
		console.log(" ** Draw **");	
		console.log(Ar);				
		
		for(var i=0; i<Ar.length; i++) {
			Scatter(Ar[i].id, Ar[i].div, Ar[i].title, Ar[i].subtitle, Ar[i].min, Ar[i].max, Ar[i].value, firsttime);			
		}
	};
	
	
	class Box extends HTMLElement {
		constructor() {
			console.log("constructor");
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
			
			if ("title" in changedProperties) {
				console.log("title:" + changedProperties["title"]);
				this.$title = changedProperties["title"];
			}
			
			if ("subtitle" in changedProperties) {
				console.log("subtitle:" + changedProperties["subtitle"]);
				this.$subtitle = changedProperties["subtitle"];
			}
			
			if ("min" in changedProperties) {
				console.log("min:" + changedProperties["min"]);
				this.$min = changedProperties["min"];
			}
			
			if ("max" in changedProperties) {
				console.log("max:" + changedProperties["max"]);
				this.$max = changedProperties["max"];
			}
			
			console.log("firsttime: " + firsttime);

			if(firsttime === 0) {
				const div = document.createElement('div');
				let divid = changedProperties.widgetName;
				div.innerHTML = '<figure class="highcharts-figure"><div id="container_' + divid + '"></div>';
				shadowRoot.appendChild(div);
					
				var mapcanvas_divstr = shadowRoot.getElementById('container_' + divid);
				console.log(mapcanvas_divstr);
				Ar.push({
					'id': divid,
					'div': mapcanvas_divstr,
					'value': this.$value,
					'title': this.$title,
					'subtitle': this.$subtitle,
					'min': this.$min,
					'max': this.$max
				});
				
				loadScript(highcharts_js, function(){
				    console.log("Load:" + highcharts_js);
				    
				    loadScript(highcharts_3d_js, function(){
					    console.log("Load:" + highcharts_3d_js);
					    
					    Draw(Ar, firsttime);
						firsttime = 1;
					});
				});
				
				
			} else {
				var id = this.$value.split("|")[0];
				console.log("id: " + id);
				
				var value = this.$value.split("|")[1];
				console.log("value: " + value);
				
				var title = this.$title;
				console.log("title: " + title);
				
				var subtitle = this.$subtitle;
				console.log("subtitle: " + subtitle);
				
				var min = this.$min;
				console.log("min: " + min);
				
				var max = this.$max;
				console.log("max: " + max);
				
				
				if(value !== "") {
					var foundIndex = Ar.findIndex(x => x.id == id);
					console.log("foundIndex: " + foundIndex);
					
					if(foundIndex !== -1) {
						console.log(Ar[foundIndex].div);
					
						Scatter(Ar[foundIndex].id, Ar[foundIndex].div, title, subtitle, min, max, value, firsttime);
					}
				}
			}
				
			
		}
	}
	customElements.define("com-fd-scatter", Box);
})();
