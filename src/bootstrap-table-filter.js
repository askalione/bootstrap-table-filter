﻿/**
 * @author: Alexey Drapash
 * @webSite: http://askalione.github.io/bootstrap-table-filter/
 * @version: v1.0.0
 */

!function ($) {

    'use strict';

    var sprintf = $.fn.bootstrapTable.utils.sprintf;
    var calculateObjectValue = $.fn.bootstrapTable.utils.calculateObjectValue;

    var addSelectOption = function (selectControl, optionObject) {
        var value = '',
            text = '';

        if (optionObject != null) {
            value = $.trim(optionObject.id);
            text = $.trim(optionObject.text);
        }

        selectControl.append($('<option></option>')
            .attr("value", value)
            .text(text));
    }

    var getHeader = function (that) {
        var header = that.$header;
        if (that.options.height) {
            header = that.$tableHeader;
        }

        return header;
    };

    var saveValues = function (that) {
        var header = getHeader(that),
            filters = header.find('table select, table input');

        that.options.filterValues = [];

        filters.each(function () {
            that.options.filterValues.push(
                {
                    field: $(this).attr('name'),
                    value: $(this).val()
                });
        });
    };

    var setValues = function (that) {
        var field = null,
            result = [],
            header = getHeader(that),
            filters =  header.find('table select, table input');

        if (that.options.filterValues.length > 0) {
            filters.each(function (index, ele) {
                field = $(this).attr('name');
                result = $.grep(that.options.filterValues, function (valueObj) {
                    return valueObj.field === field;
                });

                if (result.length > 0) {
                    $(this).val(result[0].value);
                    if ($(this).hasClass('filter-select')) {
                        $(this).select2('val', result[0].value);
                    }
                }
            });
        }
    };

    var getValues = function (that) {
        var param = {},
            filters = getHeader(that).find('select.filter-control, input.filter-control');
        console.log('filters.length', filters.length);
        filters.each(function () {
            var paramName = $(this).attr('name'),
                paramValue = $(this).val();
            param[paramName] = paramValue;
        });
        console.log('param', param);
        return [param];
    }

    var createControls = function (that, header) {
        var isVisible,
            html = [],
            datepickerOptions = [],
            filterRow = $('<tr class="filter"></tr>');

        $.each(that.columns, function (i, column) {
            if (!column.visible) {
                return;
            }

            if (!column.filterType) {
                html[column.field] = '<th></th>';
            } else {
                var nameControl = column.filterType.toLowerCase();
                if (column.searchable && that.options.filterTemplates[nameControl]) {
                    html[column.field] = '<th>' + that.options.filterTemplates[nameControl](that, column) + '</th>';
                    if (nameControl == 'datepicker') {
                        datepickerOptions[column.field] = column.filterDatepickerOptions;
                    }
                }
            }            
        });
        
        $.each(header.children().children(), function (i, tr) {
            tr = $(tr);
            var columnName = tr.data('field');
            if (html[columnName] != null && html[columnName] !== undefined)
            {
                filterRow.append(html[columnName]);
            } else {
                filterRow.append('<th></th>');
            }
        });
        
        filterRow.insertAfter(getHeader(that).find('tr'));
        
        if (getHeader(that).find('select.filter-select').length > 0) {
            getHeader(that).find('select.filter-select').each(function () {
                var searchable = $(this).data('searchable');
                var selectType = $(this).data('selectType');
                switch(selectType)
                {
                    case 'url':
                        var url = $(this).data('url');
                        $(this).select2({
                            width: '100%',
                            minimumResultsForSearch: searchable ? 1 : -1,
                            ajax: {
                                url: url,
                                dataType: 'json',
                                quietMillis: 250,
                                results: function (data, page) {
                                    return { results: data };
                                }
                            },
                            escapeMarkup: function (m) { return m; }
                        });

                        break;
                    case 'var':
                        var variableName = $(this).data('var');
                        var variableValues = window[variableName];
                        addSelectOption($(this), null);
                        for (var key in variableValues) {
                            addSelectOption($(this), variableValues[key]);
                        }
                        $(this).select2({
                            width: '100%',
                            minimumResultsForSearch: searchable ? 1 : -1,
                        });
                        break;
                }
            });
        }

        if (getHeader(that).find('input.filter-datepicker').length > 0) {
            getHeader(that).find('input.filter-datepicker').each(function () {
                $(this).datepicker(datepickerOptions[$(this).data('field')])
                 .on('changeDate', function (e) {
                    $(e.currentTarget).keyup();
                });;
            });
        }
    };

    $.extend($.fn.bootstrapTable.defaults, {
        filter: false,       
        filterValues: [],
        filterTemplates: {
            input: function (that, column) {
                return sprintf('<input type="text" class="form-control filter-control" name="%s_filter" style="width: 100%;" data-field="%s" %s>', column.field, column.field, column.filterDisabled ? 'disabled="disabled"' : '');
            },
            select: function (that, column) {
                if (column.filterData !== undefined) {
                    var selectCore = sprintf('id="%s" class="filter-select filter-control" name="%s_filter"  style="width: 100%;" data-placeholder="%s" data-searchable="%s" data-field="%s" %s',
                    column.field + 'filter' + (getHeader(that).find('.filter-select').length + 1), column.field, column.title, column.filterSelectSearchable !== undefined ? column.filterSelectSearchable : false, column.field, column.filterDisabled ? 'disabled="disabled"' : '');

                    var filterDataType = column.filterData.substring(0, 3);
                    var filterDataSource = column.filterData.substring(4, column.filterData.length);
                    switch (filterDataType) {
                        case 'url':
                            return sprintf('<input type="hidden" value="" data-select-type="%s" data-url="%s" %s>', filterDataType, filterDataSource, selectCore);
                            break;
                        case 'var':
                            return sprintf('<select data-select-type="%s" data-var="%s" %s></select>', filterDataType, filterDataSource, selectCore);
                            break;
                    }
                } else {
                    return '';
                }
            },
            datepicker: function (that, column) {
                return sprintf('<div class="input-group">' +
                               '    <input type="text"  placeholder="%s" class="form-control  filter-control filter-datepicker" name="%s_filter" data-field="%s" %s><span class="input-group-addon"><i class="fa fa-calendar"></i></span>' +
                               '</div>', that.options.formatFilterDatepickerPlaceholder(), column.field, column.field, column.filterDisabled ? 'disabled="disabled"' : '');
            },
            input_range: function (that, column) {
                var inputFrom = sprintf('<input type="text" class="form-control mb5 filter-control" name="%s_from_filter" style="width: 100%;" data-field="%s" %s>', column.field, column.field, column.filterDisabled ? 'disabled="disabled"' : ''),
                    inputTo = sprintf('<input type="text" class="form-control filter-control" name="%s_to_filter" style="width: 100%;" data-field="%s" %s>', column.field, column.field, column.filterDisabled ? 'disabled="disabled"' : '');
                return sprintf('%s%s', inputFrom, inputTo);
            },
            select_range: function (that, column) {
                if (column.filterData !== undefined) {
                    var selectCore = sprintf('id="%s" style="width: 100%;" data-placeholder="-" data-searchable="%s" data-field="%s" %s',
                    column.field + 'filter' + (getHeader(that).find('.filter-select').length + 1), column.filterSelectSearchable !== undefined ? column.filterSelectSearchable : false, column.field, column.filterDisabled ? 'disabled="disabled"' : '');
                    var selectFrom = "",
                        selectTo = "";

                    var filterDataType = column.filterData.substring(0, 3);
                    var filterDataSource = column.filterData.substring(4, column.filterData.length);
                    switch (filterDataType) {
                        case 'url':
                            selectFrom = sprintf('<input type="hidden" value="" class="filter-select mb5 filter-control" data-select-type="%s" name="%s_from_filter" data-url="%s" %s>', filterDataType, column.field, filterDataSource, selectCore);
                            selectTo = sprintf('<input type="hidden" value="" class="filter-select filter-control" data-select-type="%s" name="%s_to_filter" data-url="%s" %s>', filterDataType, column.field, filterDataSource, selectCore);
                            break;
                        case 'var':
                            selectFrom = sprintf('<select class="filter-select mb5 filter-control" data-select-type="%s" name="%s_from_filter" data-var="%s" %s></select>', filterDataType, column.field, filterDataSource, selectCore);
                            selectTo = sprintf('<select class="filter-select mb5 filter-control" data-select-type="%s" name="%s_to_filter" data-var="%s" %s></select>', filterDataType, column.field, filterDataSource, selectCore);
                            break;
                    }
                    return sprintf('%s%s', selectFrom, selectTo);
                } else {
                    return '';
                }
            },
            datepicker_range: function (that, column) {
                var datepickerFrom = sprintf('<div class="input-group mb5">' +
                               '    <input type="text" placeholder="%s" class="form-control  filter-control filter-datepicker" name="%s_from_filter" data-field="%s" %s><span class="input-group-addon"><i class="fa fa-calendar"></i></span>' +
                               '</div>', that.options.formatFilterDatepickerPlaceholderFrom(), column.field, column.field, column.filterDisabled ? 'disabled="disabled"' : ''),
                    datepickerTo = sprintf('<div class="input-group">' +
                               '    <input type="text" placeholder="%s" class="form-control  filter-control filter-datepicker" name="%s_to_filter" data-field="%s" %s><span class="input-group-addon"><i class="fa fa-calendar"></i></span>' +
                               '</div>', that.options.formatFilterDatepickerPlaceholderTo(), column.field, column.field, column.filterDisabled ? 'disabled="disabled"' : '');
                return sprintf('%s%s', datepickerFrom, datepickerTo);
            }
        }
    });

    $.extend($.fn.bootstrapTable.defaults.icons, {
        filter: 'fa-filter icon-filter',
        resetFilter: 'fa-remove icon-reset-filter'
    });

    $.extend($.fn.bootstrapTable.locales['en-US'], {
        formatFilterDatepickerPlaceholder: function(){
            return 'dd.mm.yyyy';
        },
        formatFilterDatepickerPlaceholderFrom: function(){
            return 'from dd.mm.yyyy';
        },
        formatFilterDatepickerPlaceholderTo: function(){
            return 'to dd.mm.yyyy';
        },
        formatFilter: function () {
            return 'Start filter';
        },
        formatResetFilter: function () {
            return 'Reset filter';
        }
    });
    $.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales);

    $.extend($.fn.bootstrapTable.COLUMN_DEFAULTS, {
        filterType: undefined,
        filterData: undefined,
        filterSelectSearchable: false,
        filterDatepickerOptions: { dateFormat: 'dd.mm.yy' },
        filterDisabled: false
    });

    var BootstrapTable = $.fn.bootstrapTable.Constructor,
        _init = BootstrapTable.prototype.init,
        _initToolbar = BootstrapTable.prototype.initToolbar,
        _initHeader = BootstrapTable.prototype.initHeader,
        _fitHeader = BootstrapTable.prototype.fitHeader,
        _refresh = BootstrapTable.prototype.refresh;

    BootstrapTable.prototype.init = function () {
        if (this.options.filter) {
            var that = this;
            this.$el.on('reset-view.bs.table', function () {
                if (!that.options.height) {
                    return;
                }

                setValues(that);
            });
        }
        _init.apply(this, Array.prototype.slice.apply(arguments));
    };

    BootstrapTable.prototype.initHeader = function () {
        _initHeader.apply(this, Array.prototype.slice.apply(arguments));

        if (!this.options.filter) {
            return;
        }
        
        if (!this.options.height) {
            createControls(this, this.$header);
            this.$tableLoading.css('top', this.$header.outerHeight() + 1);
        }
    };

    BootstrapTable.prototype.fitHeader = function () {
        _fitHeader.apply(this, Array.prototype.slice.apply(arguments));    

        if (!this.options.filter) {
            return;
        }

        createControls(this, this.$header);
        setValues(this);
        this.$tableLoading.css('top', this.$tableHeader.outerHeight() + 1);       
    };

    BootstrapTable.prototype.refresh = function (params) {
        if (this.options.filter) {
            var paramsObject = calculateObjectValue(this.options, this.$el.data('queryParams'), getValues(this), []);
            this.options.queryParams = function (paramQuery) {
                $.extend(paramQuery, paramsObject);
                return paramQuery;
            }

            if (this.options.height) {
                saveValues(this);
            }
        }

        _refresh.apply(this, Array.prototype.slice.apply(arguments));
    };

    BootstrapTable.prototype.initToolbar = function () {
        if ((!this.showToolbar) && (this.options.filter)) {
            this.showToolbar = this.options.filter;
        }

        _initToolbar.apply(this, Array.prototype.slice.apply(arguments));

        if (!this.options.filter) {
            return;
        }

        var $btnGroup = $('<div class="columns columns-right btn-group pull-right"></div>');

        var $btnFilter = $([
                    '<button class="btn btn-default" ',
                    sprintf('type="button" title="%s">', this.options.formatFilter()),
                    sprintf('<i class="%s %s"></i> ', this.options.iconsPrefix, this.options.icons.filter),
                    '</button>',
                    '</ul>'].join('')).appendTo($btnGroup);

        var $btnResetFilter = $([
                    '<button class="btn btn-default" ',
                    sprintf('type="button" title="%s">', this.options.formatResetFilter()),
                    sprintf('<i class="%s %s"></i> ', this.options.iconsPrefix, this.options.icons.resetFilter),
                    '</button>',
                    '</ul>'].join('')).appendTo($btnGroup);

        $btnGroup.appendTo(this.$toolbar);

        $btnFilter.off('click').on('click', $.proxy(this.refresh, this));
        $btnResetFilter.off('click').on('click', $.proxy(this.resetFilter, this));      
    };

    BootstrapTable.prototype.resetFilter = function () {
        if (!this.options.filter) {
            return;
        }

        var filters = [];

        $.each(this.options.filterValues, function (i, item) {
            item.value = '';
        });

        setValues(this);
            
        // inputs
        filters = getHeader(this).find('input.filter-control');
        filters.each(function () {
            $(this).val('');
        });

        // select
        filters = getHeader(this).find('select.filter-control');
        filters.each(function () {
            $(this).select2('val', '');
        });
            
        this.refresh();
        
    };

}(jQuery);