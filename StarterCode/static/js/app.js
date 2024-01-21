// Declare the data variable globally
let data;

// URL placement
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Get JSON data
d3.json(url).then(function (jsonData) {
    // Assign the data variable
    data = jsonData;
    console.log(data);
    init(data);
});

// Dropdown menu
let dropdownMenu = d3.select("#selDataset");

// Initializes the page with a plot
function init(data) {
    // Assign the value of the dropdown menu to a variable
    let dropdownList = data.names;

    // Grab subject IDs from the name list to populate drop-down data
    dropdownList.forEach(function (id) {
        dropdownMenu.append("option").text(id).property("value", id);
    });

    // Initial sample
    let initialSample = dropdownList[0];
    createPlots(initialSample, data);
}

// Function to create the plots based on the selected sample
function createPlots(sample, data) {
    buildMetadata(sample, data);
    buildBar(sample, data);
    buildBubble(sample, data);
}

// Function to update metadata
function buildMetadata(sample, data) {
    let metadata = data.metadata;
    let value = metadata.filter(result => result.id == sample);
    let valueData = value[0];
    // Select the container where you want to display the metadata
    let sampleMetadata = d3.select("#sample-metadata");

    // Clear existing metadata content
    sampleMetadata.html("");
    
    Object.entries(valueData).forEach(([key, value]) => {
        // Create a paragraph element for each key-value pair
        let paragraph = sampleMetadata.append("p");
        
        // Display the key and value in the paragraph
        paragraph.text(`${key}: ${value}`);
    });
    console.log("Metadata:", valueData);
}

// Function to create a horizontal bar chart
function buildBar(sample, data) {
    // Extract necessary data for the chart
    let sampleIndex = data.names.indexOf(sample);
    let sampleValues = data.samples[sampleIndex]?.sample_values.slice(0, 10).reverse() || [];
    let otuIds = data.samples[sampleIndex]?.otu_ids.slice(0, 10).reverse() || [];
    let otuLabels = data.samples[sampleIndex]?.otu_labels.slice(0, 10).reverse() || [];

    // Create a horizontal bar chart using Plotly
    let trace = {
        type: 'bar',
        x: sampleValues,
        y: otuIds.map(id => `OTU ${id}`),
        text: otuLabels,
        orientation: 'h'
    };

    let layout = {
        title: 'Top 10 OTUs',
        xaxis: { title: 'Sample Values' }
    };

    Plotly.newPlot('bar', [trace], layout);
}

// Function to create a bubble chart
function buildBubble(sample, data) {
    // Extract necessary data for the chart
    let sampleIndex = data.names.indexOf(sample);
    let sampleValues = data.samples[sampleIndex].sample_values;
    let otuIds = data.samples[sampleIndex].otu_ids;
    let otuLabels = data.samples[sampleIndex].otu_labels;

    // Create a bubble chart using Plotly
    let trace = {
        type: 'bubble',
        x: otuIds,
        y: sampleValues,
        text: otuLabels,
        mode: 'markers',
        marker: {
            size: sampleValues,
            color: otuIds,
            colorscale: 'Earth'
        }
    };

    let layout = {
        title: 'Demographics',
        xaxis: { title: 'OTU IDs' },
        yaxis: { title: 'Sample Values' }
    };

    Plotly.newPlot('bubble', [trace], layout);
}

// Event listener for dropdown change
dropdownMenu.on("change", function () {
    let selectedSample = dropdownMenu.property("value");
    createPlots(selectedSample, data);
});



