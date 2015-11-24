/* eslint-disable no-unused-expressions, no-var, func-names */
/* globals c3 */
!(function() {
  var chart;
  var outlet1;
  var outlet2;
  var reset;

  function get( url ) {
    return fetch(url || '/numbers')
      .then(function( res ) {
        return res.json();
      });
  }

  function put( url ) {
    return fetch(url, { method: 'put' });
  }

  function plot() {
    get().then(function( res ) {
      chart.flow({
        columns: [
          ['x', new Date()],
          ['Outlet 1'].concat(res.outlet1),
          ['Outlet 2'].concat(res.outlet2),
        ],
        duration: 1000,
        length: 0,
      });
    });
  }

  function addRemoveClass( el, add, remove ) {
    el.classList.add(add);
    el.classList.remove(remove);
  }

  function togglePower( el ) {
    if ( el.classList.contains('on') ) {
      return addRemoveClass(el, 'off', 'on');
    }

    addRemoveClass(el, 'on', 'off');
  }

  function getById( id ) {
    return document.getElementById(id);
  }

  function outlets() {
    get('/power')
      .then(function( res ) {
        addRemoveClass(outlet1, res.outlet1);
        addRemoveClass(outlet2, res.outlet2);
      });
  }

  outlet1 = getById('outlet1');
  outlet2 = getById('outlet2');
  reset   = getById('reset');

  outlet1.addEventListener('click', function() {
    put('/power/outlet1')
      .then(function() {
        togglePower(outlet1);
      });
  });

  outlet2.addEventListener('click', function() {
    put('/power/outlet2')
      .then(function() {
        togglePower(outlet2);
      });
  });

  reset.addEventListener('click', function() {
    put('/reset')
      .then(function() {
        chart.load({
          columns: [
            ['x', new Date()],
            ['Outlet 1', 0],
            ['Outlet 2', 0],
          ],
          duration: 1000,
          length: 0,
        });
      });
  });

  chart = c3.generate({
    axis: {
      x: {
        tick: {
          format: function( date ) {
            return date.toLocaleTimeString();
          },
        },
        type: 'timeseries',
      },
      y: {
        label: 'Milliamps',
      },
    },
    bindto: '#chart',
    data: {
      columns: [
        ['x', new Date()],
        ['Outlet 1', 0],
        ['Outlet 2', 0],
      ],
      type: 'spline',
      x: 'x',
    },
  });

  setInterval(plot, 2500);
  setInterval(outlets, 2500);

  plot();
  outlets();
}());
