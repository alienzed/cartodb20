
/**
 * menu bar sql module
 * this module is used to perform custom SQL queries on the table (and the map)
 */

cdb.admin.mod = cdb.admin.mod || {};

cdb.admin.mod.SQL = cdb.core.View.extend({

    buttonClass: 'sql_mod',
    type: 'tool',
    className: "sql_panel",

    events: {
      'click button': 'applyQuery'
    },

    initialize: function() {
      this.template = this.getTemplate('table/menu_modules/views/sql');
      this.sqlView = this.options.sqlView;
      this.sqlView.options.bind('change:sql', this._updateSQL, this);
    },

    activated: function() {
      if(this.codeEditor) {
        this.codeEditor.refresh();
        this.codeEditor.focus();
      }

    },

    _updateSQL: function(dummy, sql) {
       if(this.codeEditor) {
        this.codeEditor.setValue(sql || '');
        this.codeEditor.refresh();
       }
    },

    render: function() {
      this.$el.append(this.template({}));

      /*CodeMirror.commands.autocomplete = function(cm) {
        CodeMirror.simpleHint(cm, CodeMirror.postgresHint);
      };*/

      this.codeEditor = CodeMirror.fromTextArea(this.$('textarea')[0], {
        mode: "text/x-postgres",
        tabMode: "indent",
        matchBrackets: true,
        lineNumbers: true,
        lineWrapping: true//,
        //extraKeys: {"Ctrl-Space": "autocomplete"}
      });
      this._updateSQL(null, this.sqlView.options.get('sql'));

      return this;
    },

    _parseError: function(err) {
      // Add error text
      this.$('.error')
        .html(err.errors.join('<br/>'))
        .show();

      // Fit editor with the error
      var h = this.$('.error').outerHeight();
      this.$('.CodeMirror').css({bottom: '+=' + h + 'px'})
    },

    _clearErrors: function() {
      // Remove error text and hide it
      this.$('.error')
        .html('')
        .hide();

      // Fit editor with text

    },

    applyQuery: function() {
      var self = this;
      this._clearErrors();
      var sql = this.codeEditor.getValue();
      this.sqlView.setSQL(sql);
      this.model.useSQLView(this.sqlView);
      this.sqlView.fetch({
        error: function(e, resp) {
          var errors = JSON.parse(resp.responseText);
          self._parseError(errors);
          self.model.useSQLView(null);
        }
      });
      //this.trigger('sqlQuery', sql);
    }

});