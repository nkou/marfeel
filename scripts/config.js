require.config({
    baseUrl: 'scripts',
    deps: ['main'],
    enforceDefine: true,
    paths: {
        'd3': 'http://d3js.org/d3.v3.min'
    }
});
define();