// 'use strict';

var app = angular.module('tableSett', []);

app.controller('customersCtrl', function($scope, $http) {
    $http.get("/cr_conf/scripts/settings_for_cr.php")
        .then(function (response) {
            $scope.sett_json = {};
            init_sett_json("devs_for_php");
            init_sett_json("ws_rest_hosts");
            $scope.sett_json.selected = {};

            // Добавление специального ident для распознвания таблицы

            function init_sett_json(key) {
                $scope.sett_json[key] = response.data[key];
                $scope.sett_json[key].selected = {};
                angular.forEach($scope.sett_json[key], function(value)
                {
                    value.ident = key;
                });
            }
        });

    $scope.getTemplate = function(inpsett, inptable) {
        var sel_key = $scope.sett_json.selected.key;

        if (inpsett.key === sel_key)
            return 'edit' + "_" + inptable;
        else
            return 'display' + "_" + inptable;
    };

    $scope.editValue = function(value) {
        $scope.sett_json.selected = angular.copy(value);
    };

    $scope.saveValue = function(idendt, idx) {
        $scope.sett_json[idendt][idx] = angular.copy($scope.sett_json.selected);
        var for_save = angular.copy($scope.sett_json);
        delete for_save.selected;
        // отправить в POST запрос обратно в php-скрипт
        // дл сохранения значений в БД
        var jsonout = angular.toJson(for_save);
    };

    $scope.reset = function(value) {
        $scope.sett_json.selected = {};
    }
});


