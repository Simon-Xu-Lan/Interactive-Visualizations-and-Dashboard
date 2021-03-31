d3.json('data/samples.json').then((data) => {
  var selectEl = d3.select('#selDataset');
  data.names.forEach((name) => {
    selectEl.append('option').attr('value', name).text(name);
  });

  // Get initial value
  var init_name = data.names[0];

  buildBarChart(init_name);
  function buildBarChart(selectedID) {
    var selectedSample = data.samples.filter((row) => row.id === selectedID);
    trace1 = {
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
    var data1 = [trace1];

    var layout = {
      title: `Samples ID ${selectedSample}`,
      yaxis: { title: 'OTU ID' },
      xaxis: { title: 'Sample Value' },
      showlegend: false,
      height: 500,
      width: 300,
    };

    Plotly.newPlot('bar', data1, layout);
  }

  // var init_sample = data.samples.filter((row) => row.id === init_name);
  // // Create a horizontal bar chart
  // trace1 = {
  //   type: 'bar',
  //   y: init_sample[0].otu_ids
  //     .map((id) => 'OTU ' + id)
  //     .slice(0, 10)
  //     .reverse(),
  //   x: init_sample[0].sample_values
  //     .sort((a, b) => b - a)
  //     .slice(0, 10)
  //     .reverse(),
  //   orientation: 'h',
  // };
  // var data1 = [trace1];

  // var layout = {
  //   title: `Samples ID ${init_name}`,
  //   yaxis: { title: 'OTU ID' },
  //   xaxis: { title: 'Sample Value' },
  //   showlegend: false,
  //   height: 500,
  //   width: 300,
  // };

  // Plotly.newPlot('bar', data1, layout);

  // Create a bubble chart that displays each sampl
  var trace2 = {
    type: 'bubble',
    x: init_sample[0].otu_ids,
    y: init_sample[0].sample_values,
    mode: 'markers',
    marker: {
      size: init_sample[0].sample_values,
      color: init_sample[0].sample_values.map(
        (value) => `rgb(${value}, ${255 - value}, ${Math.random() * 255})`
      ),
    },
    text: init_sample[0].otu_labels,
  };
  var data2 = [trace2];

  var layout = {
    title: `Samples ID ${init_name}`,
    xaxis: { title: 'OTU ID' },
    yaxis: { title: 'Sample Value' },
    showlegend: false,
    height: 600,
    width: 1200,
  };

  Plotly.newPlot('bubble', data2, layout);
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
  var wfreqs = data.metadata.filter((row) => row.id === 940);
  console.log(wfreqs[0].wfreq);
  var data3 = [
    {
      type: 'indicator',
      mode: 'gauge+number',
      value: data.metadata.filter((row) => row.id === 940)[0].wfreq,
      title: { text: 'Belly Button Washing Frequency', font: { size: 24 } },
      gauge: {
        axis: { range: [null, 9] },
        steps: steps,
      },
      bar: { color: 'darkblue' },
    },
  ];

  Plotly.newPlot('gauge', data3);
});

// function buildBarChart(selectedID) {
//   var selectedSample = data.samples.filter((row) => row.id === selectedID);
//   trace1 = {
//     type: 'bar',
//     y: selectedSample[0].otu_ids
//       .map((id) => 'OTU ' + id)
//       .slice(0, 10)
//       .reverse(),
//     x: selectedSample[0].sample_values
//       .sort((a, b) => b - a)
//       .slice(0, 10)
//       .reverse(),
//     orientation: 'h',
//   };
//   var data1 = [trace1];

//   var layout = {
//     title: `Samples ID ${selectedSample}`,
//     yaxis: { title: 'OTU ID' },
//     xaxis: { title: 'Sample Value' },
//     showlegend: false,
//     height: 500,
//     width: 300,
//   };

//   Plotly.newPlot('bar', data1, layout);
// }
