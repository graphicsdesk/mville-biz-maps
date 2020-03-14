import enterView from 'enter-view';
import textBalancer from 'text-balancer';
import dotenv from 'dotenv';
dotenv.config();

// Mapbox code

import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = process.env.MAPBOX_TOKEN;
makeMap('floridita-map', 'Dino');
makeMap('dino-map', 'Floridita');

function makeMap(mapId, restaurantName) {
  const mapDiv = document.getElementById(mapId)
  const [ x0, y0 ] = mapDiv.getAttribute('data-old-location').split(', ').map(parseFloat);
  const [ xf, yf ] = mapDiv.getAttribute('data-new-location').split(', ').map(parseFloat);

  const map = new mapboxgl.Map({
    container: mapId,
    style: 'mapbox://styles/mapbox/streets-v9',
    zoom: 16,
    center: [(x0+xf)/2, (y0+yf)/2],
    scrollZoom: false,
  });
  map.addControl(new mapboxgl.NavigationControl());

  //adding a dot
  var size = 100;

  // implementation of CustomLayerInterface to draw a pulsing dot icon on the map
  // see https://docs.mapbox.com/mapbox-gl-js/api/#customlayerinterface for more info
  var pulsingDot = {
  	width: size,
  	height: size,
  	data: new Uint8Array(size * size * 4),
   
  // get rendering context for the map canvas when layer is added to the map
  	onAdd: function() {
  		var canvas = document.createElement('canvas');
  		canvas.width = this.width;
  		canvas.height = this.height;
  		this.context = canvas.getContext('2d');
  	},
   
  // called once before every frame where the icon will be used
  	render: function() {
  		var duration = 1000;
  		var t = (performance.now() % duration) / duration;
   
  		var radius = (size / 2) * 0.3;
  		var outerRadius = (size / 2) * 0.7 * t + radius;
  		var context = this.context;
   
  		// draw outer circle
  		context.clearRect(0, 0, this.width, this.height);
  		context.beginPath();
  		context.arc(
  			this.width / 2,
  			this.height / 2,
  			outerRadius,
  			0,
  			Math.PI * 2
  		);
  		context.fillStyle = 'rgba(255, 200, 200,' + (1 - t) + ')';
  		context.fill();
   
  		// draw inner circle
  		context.beginPath();
  		context.arc(
  			this.width / 2,
  			this.height / 2,
  			radius,
  			0,
  			Math.PI * 2
  		);
  		context.fillStyle = 'rgba(255, 100, 100, 1)';
  		context.strokeStyle = 'white';
  		context.lineWidth = 2 + 4 * (1 - t);
  		context.fill();
  		context.stroke();
   
  		// update this image's data with data from the canvas
  		this.data = context.getImageData(
  			0,
  			0,
  			this.width,
  			this.height
  		).data;
   
  		// continuously repaint the map, resulting in the smooth animation of the dot
  		map.triggerRepaint();
  		 
  		// return `true` to let the map know that the image was updated
  		return true;
  	}
  };


  map.on('load', function() {

  	map.addSource('route', {
  		'type': 'geojson',
  		'data': {
  			'type': 'Feature',
  			'properties': {},
  			'geometry': {
  				'type': 'LineString',
  				'coordinates': [
  					[x0,y0],
  					[xf,yf],

  				]
  			}
  		}
  	});

  	map.addLayer({
  		'id': 'route',
  		'type': 'line',
  		'source': 'route',
  		'layout': {
  			'line-cap': 'round',
  			'line-join': 'round'
  		},
  		'paint': {
  			'line-color': '#ed6498',
  			'line-width': 5,
  			'line-opacity': 0.8
  		}
  	});

  	map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });
   
  	map.addSource('points', {
  		'type': 'geojson',
  		'data': {
  			'type': 'FeatureCollection',
  			'features': [
  				{
  					'type': 'Feature',
  					'geometry': {
  						'type': 'Point',
  						'coordinates': [xf, yf]
  					},
  					'properties': {
  						'title': `${restaurantName}'s current location`
  					}
  				}
  			]
  		}
  	});

  	map.addLayer({
  		'id': 'points',
  		'type': 'symbol',
  		'source': 'points',
  		'layout': {
  			'icon-image': 'pulsing-dot',
  			'text-field': ['get', 'title'],
  			'text-font': ['Roboto Regular', 'Arial Unicode MS Bold'],
  			'text-offset': [0, 0.6],
  			'text-anchor': 'top-right'
  		}
  	});

  	map.addSource('staticPoint', {
  		'type': 'geojson',
  		'data': {
  			'type': 'Feature',
  			'properties': {},
  			'geometry': {
  				'type': 'Point',
  				'coordinates': [x0,y0]
  			}
  		}
  	});

  	map.addLayer({
  		'id': 'staticPoint',
  		'type': 'circle',
  		'source': 'staticPoint',
  		'paint': {
  			'circle-color': '#939393',
  			'circle-radius': 7,
  			'circle-stroke-width' : 1.5,
  			'circle-stroke-color': '#FFFFFF'
  		}
  	});
  });
}