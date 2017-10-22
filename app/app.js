// 'use strict';

var app = angular.module('tableSett', []);

app.controller('customersCtrl', function ($scope, $http) {
    get_data();
    for_check_tables();

    $scope.getTemplate = function (inpsett, inptable) {
        var sel_key = $scope.sett_json.selected.key;
        var sel_ident = $scope.sett_json.selected.ident;

        if (inpsett.key === sel_key && inpsett.ident === sel_ident)
            return 'edit' + "_" + inptable;
        else
            return 'display' + "_" + inptable;
    };

    $scope.editValue = function (value) {
        $scope.sett_json.selected = angular.copy(value);
    };

    $scope.saveValue = function (idendt, idx) {
        var for_save = angular.copy($scope.sett_json.selected);
        var jsonout = angular.toJson(for_save);

        $http.get("/cr_conf/scripts/settings_for_cr.php",
            {params: {type_req: "update", json_for_upd: jsonout}})
            .then(
                function (response) {
                    if (response.data.success === true) {
                        get_data();
                    }
                },
                function (response) {
                    errorOut(response);
                }
            );
    };

    $scope.reset = function (value) {
        $scope.sett_json.selected = {};
    };

    function errorOut(response) {
        var out = undefined;
        if (response.data !== undefined) {
            var out = response.data.err_mess;
        }

        if (out === undefined)
            out = "Неизвестная ошибка";

        var wrappedResult = angular.element(document.querySelector('#errorout'));
        var questHeader = wrappedResult.find('h1');
        questHeader.css("color", "#ff0000");
        questHeader.css("text-align", "center");
        questHeader.text(out);
        //wrappedResult.css( "display", "none" );
        //wrappedResult.css( "display", "inline" );
    }

    function get_data() {
        $http.get("/cr_conf/scripts/settings_for_cr.php",
            {params: {type_req: "read_data"}})
            .then(function (response) {
                    $scope.sett_json = {};
                    init_sett_json("devs_for_php");
                    init_sett_json("ws_rest_hosts");
                    $scope.sett_json.selected = {};

                    // Добавление специального ident для распознвания таблицы

                    function init_sett_json(key) {
                        $scope.sett_json[key] = response.data[key];
                        $scope.sett_json[key].selected = {};
                        angular.forEach($scope.sett_json[key], function (value) {
                            value.ident = key;
                        });
                    }
                },
                function (response) {
                    errorOut(response);
                });
    }

    function for_check_tables() {
        $http.get("/cr_conf/scripts/settings_for_cr.php",
            {params: {type_req: "check_tables"}})
            .then(function (response) {
                    $scope.sql_table = [];
                    var data = response.data;

                    angular.forEach(response.data, function(has, tablename) {
                        var inpobj = {};
                        var text = "Таблица ";
                        if (has) {

                            inpobj["class"] = "_y";
                            text+=( tablename + " присутствует в БД" );
                        }
                        else {
                            inpobj["class"] = "_n";
                            text+=( tablename + " не найдена в БД" );
                        }
                        inpobj["text"] = text;
                        $scope.sql_table.push(inpobj);

                    });
                },
                function (response) {
                    errorOut(response);
                });
    }

});


