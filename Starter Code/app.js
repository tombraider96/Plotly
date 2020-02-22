function buildMetadata(sample) {
  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json("/metadata/"+ sample).then(function(data) {
    // Use d3 to select the panel with id of `#sample-metadata`
    var selector = d3.select("#sample-metadata").html("");
    // Use `.html("") to clear any existing metadata
    selector.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    for (i = 0; i < 5; i++) {
      selector.append("text").html("<font size='1'>" 
        + Object.entries(data)[i][0] + ": " 
        + Object.entries(data)[i][1] + "</font><br>");  
    };

    selector.append("text").html("<font size='1'>SAMPLEID: " + Object.entries(data)[6][1] + "</font><br>");

  });  
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json("/samples/"+ sample).then(function(data) {

    // Grab the values from the json data
    var otu_ids = data.otu_ids;
    var otu_labels = data.otu_labels;
    var sample_values = data.sample_values;

    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids
      },
      text: otu_labels
    };

    var data1 = [trace1];

    var layout = {
      showlegend: false
    };

    Plotly.newPlot('bubble', data1, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    var sample_data = otu_ids.map( (x, i) => {
      return {"otu_ids": x, "otu_labels": otu_labels[i], "sample_values": sample_values[i]}        
    });

    sample_data = sample_data.sort(function(a, b) {
      return b.sample_values - a.sample_values;
    });

    sample_data = sample_data.slice(0, 10);

    var trace2 = {
      labels: sample_data.map(row => row.otu_ids),
      values: sample_data.map(row => row.sample_values),
      hovertext: sample_data.map(row => row.otu_labels),
      type: 'pie'
    };

    var data2 = [trace2];

    Plotly.newPlot("pie", data2);

  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text("BB_" + sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
