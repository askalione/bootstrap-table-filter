Bootstrap-table filter
=======================

This is an extension for [Bootstrap table](http://issues.wenzhixin.net.cn/bootstrap-table/) jquery plugin, based on another extension [Table Filter Control](https://github.com/wenzhixin/bootstrap-table/tree/master/src/extensions/filter-control), which give powerfull filter controls for columns.

Usage
-----
### Step 1
Include jQuery, Bootstrap, Bootstrap-table and then Bootstrap-table filter
```
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap-theme.min.css">
	<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.10.0/bootstrap-table.min.css">
	
	<script src="https://code.jquery.com/jquery-1.12.0.min.js"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.10.0/bootstrap-table.min.js"></script>
	<script src="../dist/bootstrap-table-filter.min.js"></script>
```

### Step 2
Then u can enable filter via html
```
    <table id="itemsTable" class="table"
		   data-detail-view="true"
		   data-url="../json/data.json"
		   data-method="post"
		   data-detail-formatter="detailFormatter"
		   data-height="500"
		   data-filter="true">
		<thead>
			<tr>
				<th data-field="ItemId" data-sortable="true" data-align="center">ItemId</th>
				<th data-field="ItemName" data-sortable="true" data-align="left" data-filter-type="input">ItemName</th>
				<th data-field="ItemStatus" data-sortable="true" data-align="left" data-width="320" data-filter-type="select" data-filter-select-data="var:ItemStatuses">ItemStatus</th>
			</tr>
		</thead>
	</table>
```

or u can enable filter via javascript
```
	<script type="javascript">
		var $itemsTable = $('#itemsTable');
		
		$(document).ready(function () {
			$itemsTable.bootstrapTable({
				
			});
		});
	</script>
```