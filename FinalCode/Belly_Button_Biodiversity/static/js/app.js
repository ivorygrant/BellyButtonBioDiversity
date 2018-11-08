function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample

  d3.json(`/metadata/${sample}`).then(function(sample){
    // console.log(sample)

    // Use d3 to select the panel with id of `#sample-metadata`
    d3.select('#sample-metadata').html("")

    // Use `Object.entries` to add each key and value pair to the panel

    Object.entries(sample).forEach(([key,value]) => {
      d3.select('#sample-metadata').append('p').text(key + ': ' + value)
    })

  })
}

function buildCharts(sample) {

  // (Gauge Chart)
  d3.json(`/wfreq/${sample}`).then(function(sample){

    var sampleNumber = d3.select("#selDataset").property("value")

    // two key values, sample: number and wfreq: number
    var wfreqNum = sample.WFREQ
    var wfreqID = sample.sample
    // console.log(wfreqNum)
    // console.log(wfreqID)

    // part of data to input
    var traceGauge = {
      type: 'pie',
      showlegend: false,
      hole: 0.4,
      rotation: 90,
      values: [ 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81],
      text: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
      direction: 'clockwise',
      textinfo: 'text',
      textposition: 'inside',
      marker: {
        colors: ['','','','','','','','','','white'],
        labels: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
        hoverinfo: 'label'
      }
    }

    // needle
    var degrees = 50, radius = .9
    var radians = degrees * Math.PI / 180
    var x = -1 * radius * Math.cos(radians) * wfreqNum
    var y = radius * Math.sin(radians)

    var gaugeLayout = {
      shapes: [{
        type: 'line',
        x0: 0.5,
        y0: 0.5,
        x1: 0.6,
        y1: 0.6,
        line: {
          color: 'black',
          width: 3
        }
      }],
      title: `Wash Frequency for Sample #${sampleNumber}` ,
      xaxis: {visible: false, range: [-1, 1]},
      yaxis: {visible: false, range: [-1, 1]}
    }

    var dataGauge = [traceGauge]

    Plotly.plot('gauge', dataGauge, gaugeLayout)

  })

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(sample){

    // the sample number
    var sample_number = d3.select("#selDataset").property("value")

    // extracting the [values] from the object
    var labels = sample.otu_ids
    var values = sample.sample_values
    var hover_text = sample.otu_labels

    // putting all the arrays into an object
    const data = { labels, values, hover_text }

    // making each value it's own object
    const list = data.values.map((value,idx) => {
      return {
        labels: data.labels[idx],
        value: data.values[idx],
        text: data.hover_text[idx]
      }
    })

    // sorting the objects by highest samples
    list.sort((a,b) => {
      return b.value - a.value
    })

    // @TODO: Build a Bubble Chart using the sample data

    const bubble_labels = []
    const bubble_values = []
    const bubble_text = []

    // loop to grab values from list
    for (var i = 0; i < list.length; i++){

      bubble_labels.push(list[i]['labels'])
      bubble_values.push(list[i]['value'])
      bubble_text.push(list[i]['text'])

    }
    // color function
    var colorArray = ['red','blue','green','yellow','orange','purple','pink']

    function buildColor(array, count){
      var length = array.length
      var colors = new Array()
      for (var i = 0; i < count; i++){
        colors.push(array[i%length])
      }
      return colors
    }
    var trace_bubble = {
      x:bubble_labels,
      y:bubble_values,
      text:bubble_text,
      mode: 'markers',

      marker: {
        size: bubble_values,
        color: buildColor(colorArray,bubble_values.length)
      }
    }

    var data_bubble = [trace_bubble]

    var layout_bubble = {
      title: `Bubble Chart for Sample #${sample_number}`,
      showlegend: false,
      xaxis: {
        title: 'Microbe ID',
        titlefont: {
          size:20
        }
      }
    }

    Plotly.newPlot('bubble', data_bubble, layout_bubble)

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    // console.log(Object.keys(list)) // shows 0,1,2,3,...
    // console.log(list['0']['labels']) // access inner key
    const top_10 = list.slice(0,10)

    const top_10_labels = []
    const top_10_values = []
    const top_10_text = []

    // loop to grab values from top_10
    for (var i = 0; i < top_10.length; i++){

      top_10_labels.push(top_10[i]['labels'])
      top_10_values.push(top_10[i]['value'])
      top_10_text.push(top_10[i]['text'])

    }
    // console.log(top_10_values)

    var trace_pie = {
      labels: top_10_labels,
      values: top_10_values,
      text: top_10_text,
      type: 'pie'
    }

    // console.log(trace1)

    var pie_data = [trace_pie]
    var layout = {
      title: `Top 10 Microbes for Sample #${sample_number}`
    }

    Plotly.newPlot('pie', pie_data, layout)

  })

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
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
