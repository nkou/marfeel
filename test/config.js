define(function () {
    'use strict';

    var specs = [
        'spec/main'
    ];

    require(['boot'], function () {
        require(specs, function () {
            window.onload();
        });
    });
});