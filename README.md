Bootstrap-table filter
=======================

This is an extension for [Bootstrap table](http://issues.wenzhixin.net.cn/bootstrap-table/) jquery plugin, based on another extension [Table Filter Control](https://github.com/wenzhixin/bootstrap-table/tree/master/src/extensions/filter-control), which give columns filter controls for **server side** and client side.

References
-----
[Select2](http://select2.github.io/select2/) - v.3 for select filter control
[jQuery UI](https://jqueryui.com/) - v.1.10 for datepicker filter control


Usage
-----
### Step 1
Include jQuery, Bootstrap, Bootstrap-table and then Bootstrap-table filter
```
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap-theme.min.css">
	<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.10.0/bootstrap-table.min.css">
	<link rel="stylesheet" href="../dist/bootstrap-table-filter.min.css">
	
	<script src="https://code.jquery.com/jquery-1.12.0.min.js"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.10.0/bootstrap-table.min.js"></script>
	<script src="../dist/bootstrap-table-filter.min.js"></script>
```

### Step 2
Then u can enable filter via html
```
    <table id="itemsTable" class="table"
		   data-toggle="table"
		   data-url="../json/data.json"
		   data-height="500"
		   data-filter="true">
		<thead>
			<tr>
				<th data-field="ItemId" data-sortable="true" data-align="center">ItemId</th>
				<th data-field="ItemName" data-sortable="true" data-align="left" data-filter-type="input">ItemName</th>
				<th data-field="ItemStatus" data-sortable="true" data-align="left" data-width="320" data-filter-type="select" data-filter-data="var:ItemStatuses">ItemStatus</th>
			</tr>
		</thead>
	</table>
```

or u can enable filter via javascript
```
	<table id="itemsTable" class="table">
	</table>
	
	<script type="javascript">
		var $itemsTable = $('#itemsTable'),
			itemStatuses = [{ id: 1, text: 'Text1' }, { id: 2, text: 'Text2' }];
		
		$(document).ready(function () {
			$itemsTable.bootstrapTable({
				url: '../json/data.json',
				height: 500,
				filter: true,
				columns: [
					[
						{
							title: 'ItemID',
							field: 'ItemID',
							sortable: true,
							align: 'center'
						}, 
						{
							title: 'ItemName',
							field: 'ItemName',
							sortable: true
							align: 'left',
							filterType: 'input'
						},
						{
							title: 'ItemStatus',
							field: 'ItemStatus',
							sortable: true
							align: 'left',
							filterType: 'select',
							filterSelectData: 'var:itemStatuses'
						}
					]
				]
			});
		});
	</script>
```

Table options
-----

### filter

* type: Boolean
* description: Set true to add filters on columns.
* default: `false`
* attribute: `data-filter`



Column options
-----

### filterType

* type: String
* description: Set filter control in column
* values: `input`, `select`, `datepicker`, `input_range`, `select_range`, `datepicker_range`
* default: `undefined`
* attribute: `data-filter-type`

### filterData

* type: String
* description: Set datasource for select filter control
* values: `var:someArrayOfObjects`, `url:someUrlForAjax`
* default: `undefined`
* attribute: `data-filter-data`

### filterSelectSearchable

* type: Boolean
* description: Set searchable option on select2 plugin for select controls 
* default: `false`
* attribute: `data-filter-select-searchable`

### filterDisabled

* type: Boolean
* description: Set disabled on filter control 
* default: `false`
* attribute: `data-filter-disabled`

### filterDatepickerOptions

* type: Object
* description: Set options for initialize datepicker filter control 
* default: `{ dateFormat: 'dd.mm.yy' }`
* attribute: `data-filter-datepicker-options`

### filterStrictSearch

* type: Boolean
* description: Set strict search
* default: `false`
* attribute: `data-filter-strict-search`

Icons
-----

* `filter`: 'fa-filter icon-filter'
* `resetFilter`: 'fa-remove icon-reset-filter'

Locales
-----

By default ['en-US'] locale

* `formatFilterDatepickerPlaceholder`: 'dd.mm.yyyy'
* `formatFilterDatepickerPlaceholderFrom`: 'from dd.mm.yyyy'
* `formatFilterDatepickerPlaceholderTo`: 'to dd.mm.yyyy'
* `formatFilter`: 'Start filter'
* `formatResetFilter`: 'Reset filter'

Events
-----

### onColumnSearch

* event name: `column-search.bs.table`
* description: Fired when we are searching into the column data
