import enterView from 'enter-view';
import textBalancer from 'text-balancer';
import dotenv from 'dotenv';
dotenv.config();

// Mapbox code

import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = process.env.MAPBOX_TOKEN;
const map = new mapboxgl.Map({
  container: 'charlotte',
  style: 'mapbox://styles/mapbox/streets-v9'
});

// Mobile navbar hamburger trigger

export function hamburgerTrigger() {
  navbar.classList.toggle('show-nav-links');
}

// Text balance headline and deck

textBalancer.balanceText('.headline, .deck, .image-overlay .image-caption-text');
