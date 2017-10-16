// 'use strict';

var app = angular.module('tableSett', []);

app.controller('customersCtrl', function($scope, $http) {
    get_data();

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
        var for_save = angular.copy($scope.sett_json.selected);
        var jsonout = angular.toJson(for_save);

        $http.get("/cr_conf/scripts/settings_for_cr.php",
            {params: {type_req: "update",json_for_upd: jsonout}})
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

    $scope.reset = function(value) {
        $scope.sett_json.selected = {};
    };

    function errorOut(response) {
        out = undefined;
        if (response.data !== undefined)
        {
            var out = response.data.err_mess;
        }

        if (out === undefined)
            out = "Неизвестная ошибка";

        var wrappedResult = angular.element(document.querySelector('#errorout'));
        var questHeader = wrappedResult.find('h1');
        questHeader.css("color","#ff0000");
        questHeader.css("text-align","center");
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
                        angular.forEach($scope.sett_json[key], function(value)
                        {
                            value.ident = key;
                        });
                    }
                },
                function (response) {
                    errorOut(response);
                });
    }
});


