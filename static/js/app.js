// from data.js
var tableData = data;
// Select submit button
var filter_btn = d3.select("#filter-btn");
// Select the form
var form = d3.select("form");
// Select table body
var tbody = d3.select("#ufo-table > tbody")
// Var to store the current selected filters
var filters = []

// Populates the table with all the data in tableData
function populate_table(table_data){
    table_data.forEach((ufo_event) => {
        var row = tbody.append("tr");
        Object.entries(ufo_event).forEach(([key, value]) => {
          var cell = row.append("td");
          cell.text(value);
        });
      });
}
// Populates dropdown menus
function populate_dropdowns(table_data)
{
    var options = d3.selectAll("select");
    options.each(function(d,i) {
        d3.select(this).html("")
        d3.select(this).append("option").text("Any")
        var category = d3.select(this).attr("id");
        var results = table_data.map(element => element[category]) // obtaining values for each specific key-value pair element in our dataset
        var uniq = [...new Set(results)];  // usit set function to get unique elements in our arrays.
        if (category != "datetime"){
            uniq.sort();
        } // Once our dataset elements are unique and sorted out, we will append those options to its respective select tag
        uniq.forEach((option_select)=>{  
            var selector = d3.select("#"+category)
            var option = selector.append("option")
            option.text(option_select)
        });
        // When we update our dataset we
        var select = this;
        for(var j = 0;j < select.options.length;j++){
            if(select.options[j].value == filters[i] ){
                select.options[j].selected = true;
            }
        }
      });
}

// This function will run when the whole html page completely loads 
window.onload = function() {
    populate_table(tableData);
    populate_dropdowns(tableData);
    console.log("I'm all ready, yeah!!")
};

// This function filters the data based on the applied filters
function filter_events(){
    var filteredData = tableData
    var options = d3.selectAll("select");
    for(var i=0;i<filters.length;i++){
        element_id = options["_groups"][0][i].id // this variable will give us the ID for the current <select> index
        if(filters[i]=="Any"){
            continue
        }
        filteredData = filteredData.filter(event => event[element_id] === filters[i]); // the dataset is overwritten every time we look for newly applied filters
        console.log(filteredData)
    }

    // Prevent the page from refreshing
    d3.event.preventDefault();
    // everytime the user request a new search, we'll empty the html content of tbody
    tbody.html("");
    // populates table with the filtered data
    populate_table(filteredData)
    populate_dropdowns(filteredData);
}
// This section records all the applied filters everytime any of the <select> tag values change
d3.selectAll("select").on("change", function() {
    // obtaining the value that has changed
    // var value = this.options[this.selectedIndex].text;
    // var index = this.options[this.selectedIndex].index;
    var selected_filters = d3.selectAll("select")
    // getting the current value of the options for each Select tag
    selected_filters.each(function(d,i) {
        filters[i] = this.options[this.selectedIndex].text;
      });
    filter_events();
  });
    // This function Resets all the filters and shows us the original dataset
  d3.select("#reset").on("click", function() {
    // Setting our of all options as Any
    filters=["Any","Any","Any","Any","Any"]
    var selected_filters = d3.selectAll("select")
    selected_filters.each(function(d,i) {
        this.selectedIndex = 0;
      });
      populate_table(tableData); // repopulating our table with the original tableData
      populate_dropdowns(tableData); // repopulating our table with the original tableData
  });