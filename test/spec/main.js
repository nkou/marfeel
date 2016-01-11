define(['main'], function (d3) {
    'use strict';

    describe('piechart', function () {
        describe('the drawPieChart() method', function () {
            var testChart;

            beforeEach(function () {
                testChart = drawPieChart.drawPieChart('test task');
            });

            it('should return a new task', function () {
                expect(testTask.constructor.name).toEqual('Task');
                expect(testTask.name).toEqual('test task');
            });
        });
    });
}); 