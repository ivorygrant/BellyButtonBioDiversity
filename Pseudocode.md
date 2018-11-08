Steps for bellybutton biodiversity

current setup: without any code, dashboard has dropdown menu to select sample
and sample metadata, with header at the top.

only code in app.js and bonus.js needs to be worked on. app.py and index.html
are already completed.

task 1:
use the samples route (`/samples/<sample>`) to display the top 10 samples

* Use `sample_values` as the values for the PIE chart. how many times it shows up?

* Use `otu_ids` as the labels for the pie chart. otu_id is the id of the bacteria?

* Use `otu_labels` as the hovertext for the chart. otu_label is type of bacteria?

pie chart goes into line 35 in index.html

/names shows all the sample numbers, use this to get a list of all the samples
  then have a function that for each sample in the list, go to the /samples routes
  for that specific sample, like url = '/samples/' + 'list[item]'
  on the sample page add the otu_ids and labels and values
/metadata/940 (example) shows the metadata for sample #940
/samples/940 (example) shows otu_ids, otu_labels, and sample_values

A statement is any SQL command such as SELECT, INSERT, UPDATE, DELETE.

A query is a synonym for a SELECT statement.

-----------------
Advanced option:

1) create a new route `/wfreq/<sample>` DONE
2) WFREQ is the wash frequency. get the wash frequency for each sample. put both
   in an object together. I don't need all the frequencies, just one at a time.
   The needle needs to move for each value. DONE
3) 9 groups (0-1,1-2,2-3,3-4,4-5,5-6,6-7,7-8,8-9)
