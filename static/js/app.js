// d3.selectAll('body').on('change', init_page);
// window.on('change', init_page);
// document.addEventListener('DOMContentLoaded', init_page);

init_page();
// d3.select('#selDataset').node().value = '940';
function init_page() {
  d3.json('data/samples.json').then((data) => {
    var selectEl = d3.select('#selDataset');
    data.names.forEach((name) => {
      selectEl.append('option').attr('value', name).text(name);
    });

    // Get initial value
    var init_id = data.names[0];
    var metadata = data.metadata.filter((row) => row.id === parseInt(init_id));
    var selectedSample = data.samples.filter((row) => row.id === init_id);
    var wfreq = metadata[0].wfreq;
    buildDemoInfo(metadata[0]);
    buildBarChart(selectedSample);
    buildBubbleChart(selectedSample);
    buildGaugeChart(wfreq);
  });
}

function optionChanged(value) {
  d3.json('data/samples.json').then((data) => {
    var metadata = data.metadata.filter((row) => row.id === parseInt(value));
    var selectedSample = data.samples.filter((row) => row.id === value);
    var wfreq = metadata[0].wfreq;
    buildDemoInfo(metadata[0]);
    buildBarChart(selectedSample);
    buildBubbleChart(selectedSample);
    buildGaugeChart(wfreq);
  });
}

function buildBarChart(selectedSample) {
  trace = {
    type: 'bar',
    y: selectedSample[0].otu_ids
      .map((id) => 'OTU ' + id)
      .slice(0, 10)
      .reverse(),
    x: selectedSample[0].sample_values
      .sort((a, b) => b - a)
      .slice(0, 10)
      .reverse(),
    orientation: 'h',
  };
  var data = [trace];

  var layout = {
    // title: `Samples ID ${selectedSample}`,
    // yaxis: { title: 'OTU ID' },
    // xaxis: { title: 'Sample Value' },
    showlegend: false,
    height: 400,
    width: 300,
    margin: {
      t: 0,
      b: 0,
    },
  };

  Plotly.newPlot('bar', data, layout);
}

function buildBubbleChart(selectedSample) {
  var trace = {
    type: 'bubble',
    x: selectedSample[0].otu_ids,
    y: selectedSample[0].sample_values,
    mode: 'markers',
    marker: {
      size: selectedSample[0].sample_values,
      color: selectedSample[0].sample_values.map(
        (value) => `rgb(${value}, ${255 - value}, ${Math.random() * 255})`
      ),
    },
    text: selectedSample[0].otu_labels,
  };
  var data = [trace];

  var layout = {
    // title: `Samples ID ${selectedSample[0].id}`,
    xaxis: { title: 'OTU ID' },
    yaxis: { title: 'Sample Value' },
    showlegend: false,
    height: 600,
    width: 1200,
  };

  Plotly.newPlot('bubble', data, layout);
}

function buildIndicatorChart(wfreq) {
  // Create steps
  var numbers = Array.from(Array(10).keys());
  var steps = numbers.map((num) => {
    return {
      range: [num, num + 1],
      color: `rgb(${Math.random() * 255},${Math.random() * 255}, ${
        Math.random() * 255
      } )`,
      text: `${num}-${num + 1}`,
    };
  });
  // Create a gauge chart
  var data = [
    {
      type: 'indicator',
      mode: 'gauge+number',
      value: wfreq,
      title: { text: 'Belly Button Washing Frequency', font: { size: 24 } },
      gauge: {
        axis: { range: [null, 9] },
        steps: steps,
      },
      bar: { color: 'darkblue' },
    },
  ];

  Plotly.newPlot('gauge', data);
}

function buildDemoInfo(metadata) {
  var infoEl = d3.select('#sample-metadata');
  infoEl.html('');
  Object.entries(metadata).forEach(([key, value]) => {
    infoEl.append('p').text(`${key}: ${value}`);
  });
}

function buildGaugeChart(wfreq) {
  // Create an array of number [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  var numbers = Array.from(Array(10).keys());
  let trace = {
    type: 'pie',
    showlegend: false,
    hole: 0.4,
    rotation: 90,
    // create an array of [20, 20, 20, 20, 20, 20, 20, 20, 20, 180]
    values: numbers.map((num) => (num < 9 ? 180 / 9 : 180)),
    // create an array of ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", " "]
    labels: numbers.map((num) => (num === 9 ? ' ' : `${num}-${num + 1}`)),
    direction: 'clockwise',
    textinfo: 'label',
    textposition: 'inside',
    marker: {
      // Create an array, the first 9 are random colors, the last one is white color
      colors: numbers.map((num) =>
        num < 9
          ? `rgb(${Math.random() * 255},${Math.random() * 255}, ${
              Math.random() * 255
            } )`
          : 'rgb(255, 255, 255)'
      ),
      labels: numbers.map((num) => (num === 9 ? ' ' : `${num}-${num + 1}`)),
      hoverinfo: 'label',
    },
    hoverinfo: 'skip',
  };

  var gaugeLayout = {
    title: '<b>Belly Button Washing Frequency</b><br>Scrubs per week',
    shapes: [
      {
        type: 'path',
        path: pathTriangle(0.5, 0.5, 0.25, wfreq * Math.PI * (20 / 180)),
        fillcolor: 'red',
        line: {
          color: 'red',
        },
      },
    ],
    xaxis: {
      zeroline: false,
      showticklabels: false,
      showgrid: false,
      range: [0, 9],
      // fixedrange: true,
    },
    yaxis: {
      zeroline: false,
      showticklabels: false,
      showgrid: false,
      range: [0, 11],
      fixedrange: true,
    },
  };
  let data = [trace];

  Plotly.newPlot('gauge', data, gaugeLayout);
}

// triangle
function pathTriangle(xD, yD, h, rotation) {
  // x, y: the middle point of triangle needle base.
  // h: the hight of triangle, the length of AD.
  // rotation: The degree of needle

  // A,B,C is three points of triangle, the line BC is base, BC = 2w
  // D is the middle point of base. BD = CD = w. The coordinates of D is (x, y)
  // (xA, yB) is point A, (xB, yB) is point B, (xC, yC) is point C

  // To calculate coordinates of A,B,C
  // Assume the angle <BAC = 10 degree
  const pi = Math.PI;
  const degreeBAC = pi / 36;
  let degreeADF = -(rotation <= pi / 2 ? rotation : pi - rotation);
  let degreeCDE = pi / 2 - degreeADF;
  let lengthCD = h * Math.tan(degreeBAC / 2);
  let lengthCE = lengthCD * Math.sin(degreeCDE);
  let lengthDE = lengthCD * Math.cos(degreeCDE);
  let lengthAF = h * Math.sin(degreeADF);
  let lengthDF = h * Math.cos(degreeADF);
  //

  let xA = rotation <= 90 ? xD - lengthDF : xD + lengthDF;
  let yA = yD - lengthAF;
  let xB = xD - lengthDE;
  let yB = rotation <= 90 ? yD + lengthCE : yD - lengthCE;
  let xC = xD + lengthDE;
  let yC = rotation <= 90 ? yD - lengthCE : yD + lengthCE;

  let path = `M ${xB} ${yB} L${xA} ${yA} L${xC} ${yC} Z`;

  return path;
}
