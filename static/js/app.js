d3.select('body').on('change', init_page());

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
    title: `Samples ID ${selectedSample}`,
    yaxis: { title: 'OTU ID' },
    xaxis: { title: 'Sample Value' },
    showlegend: false,
    height: 500,
    width: 300,
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
    title: `Samples ID ${selectedSample[0].id}`,
    xaxis: { title: 'OTU ID' },
    yaxis: { title: 'Sample Value' },
    showlegend: false,
    height: 600,
    width: 1200,
  };

  Plotly.newPlot('bubble', data, layout);
}

function buildGaugeChart(wfreq) {
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
