/* Functions Collection Object Wrapper for SQLite Data */
var DataFn = {
    rvalue: '',
    dataInit: function() {
            this.rvalue = window.cpp.db_exec("CREATE TABLE IF NOT EXISTS contact (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, phone TEXT);");            
            this.displayAlert();
        },
    dataInsert: function() {          
            var name  = $('#inputName').val(),
                phone = $('#inputPhoneNumber').val();
            this.rvalue = window.cpp.db_exec("INSERT INTO contact VALUES(NULL, '" + name + "', '" + phone + "');");
            this.dataShow();
            this.displayAlert();          
        },
    dataUpdate: function() {
            var id    = $('#inputID').val(),
                name  = $('#inputName').val(),
                phone = $('#inputPhoneNumber').val();
            this.rvalue = window.cpp.db_exec("UPDATE contact SET name='" + name + "', phone='" + phone + "' WHERE id=" + id + ";");
            this.dataShow();
            this.displayAlert();            
        },
    dataDrop: function() {
            this.rvalue = window.cpp.db_exec("DROP TABLE IF EXISTS contact;");
            $('#dataBody').html('');
            this.formReset();
            this.displayAlert();
        },
    dataShow: function() {
            this.formReset();
            var str     = '',
                strData = JSON.parse(window.cpp.db_select("SELECT * FROM contact;"));
            if (typeof(strData) === 'object') {
                $.each(strData, function(i, obj) {       
                    str += '<tr>';
                    str += '<td>' + obj.id    + '</td>';
                    str += '<td>' + obj.name  + '</td>';
                    str += '<td>' + obj.phone + '</td>';
                    str += '<td>' +
                              '<a href="#" onclick=DataFn.dataEdit(' + obj.id + ')>edit</a> | '   +
                              '<a href="#" onclick=DataFn.dataDelete(' + obj.id + ')>delete</a> ' +
                           '</td>';
                    str += '</tr>';
                });        
                $('#dataBody').html(str);                
            } else {
                this.displayAlert(strData);
            }
        },
    formReset: function() {
            $('#inputID').val('');
            $('#inputName').val('').focus();
            $('#inputPhoneNumber').val('');    
        },
    dataEdit: function(id) {
            var strData = JSON.parse(window.cpp.db_select("SELECT * FROM contact WHERE id="+id+";"));
            if (typeof(strData) === 'object') {
                $('#inputID').val(strData[0].id);
                $('#inputName').val(strData[0].name).focus();
                $('#inputPhoneNumber').val(strData[0].phone);                    
            } else {
                this.displayAlert(strData);
            }        
        },
    dataDelete: function(id) {
            this.rvalue = window.cpp.db_exec("DELETE FROM contact WHERE id="+id+";");
            this.dataShow();
            this.displayAlert();
        },    
    displayAlert: function(str) {
            this.rvalue = str || this.rvalue;
            if (this.rvalue.indexOf('ERROR') === 0) {
                $('#alertBox').html('<div class="alert alert-error">'+this.rvalue+'</div>');
            } /*else if (this.rvalue.indexOf('SUCCESS') === 0) {
                $('#alertBox').html('<div class="alert alert-success">'+this.rvalue+'</div>');
            }*/
            $('#alertBox .alert').delay(2000).fadeOut('slow', function () { $(this).remove(); });
        }
};

/* JQuery Document Ready */
$(document).ready(function() {
    // init
    DataFn.dataInit();    
    DataFn.dataShow();
            
    // button Insert event handler
    $('#btnInsert').click(function() {
        DataFn.dataInit();
        DataFn.dataInsert();
    });
    
    // button Update event handler
    $('#btnUpdate').click(function() {        
        DataFn.dataUpdate();
    });
    
    // button DropDB event handler
    $('#btnDropDB').click(function() {
        DataFn.dataDrop();
    });
    
    // button Reset event handler
    $('#btnReset').click(function() {
        DataFn.formReset();
    });
});

