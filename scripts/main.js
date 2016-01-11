require(['d3'], function(d3) {
    'use strict';
    
    // Mocking the data
    var data = {
        pieChartRevenue  : [
            {
                type        : 'REVENUE',
                title       : 'Tablet',
                color       : 'lightgreen',
                value       : 120000,
                suffix      : '€',
                percent     : 0.6
            },
            {
                type        : 'REVENUE',
                title       : 'Smartphones',
                color       : 'darkgreen',
                value       : 80000,
                suffix      : '€',
                percent     : 0.4
            }
        ],
        pieChartImpresions  : [
            {
                type        : 'IMPRESIONS',
                title       : 'Tablet',
                color       : 'ciel',
                value       : 20000000,
                percent     : 0.4
            },
            {
                type        : 'IMPRESIONS',
                title       : 'Smartphones',
                color       : 'navy',
                value       : 30000000,
                percent     : 0.6
            }
        ],
        pieChartVisits  : [
            {
                type        : 'VISITS',
                title       : 'Tablet',
                color       : 'yellow',
                value       : 480000000,
                percent     : 0.8
            },
            {
                type        : 'VISITS',
                title       : 'Smartphones',
                color       : 'red',
                value       : 120000000,
                percent     : 0.2
            }
        ],
    };
  
    var DURATION = 1500;
    var DELAY    = 500;
  
    /**
    * Draw the pie chart
    *
    * @param {String} elementId elementId
    * @param {Array}  data      data
    */
    function drawPieChart( elementId, data ) {
        
        var containerElement = document.getElementById( elementId ),
            width           = containerElement.clientWidth,
            height          = width * 0.5,
            radius          = Math.min( width, height ) / 2,
            container       = d3.select( containerElement ),
            svg             = container.select( 'svg' )
                                      .attr( 'width', width )
                                      .attr( 'height', height + 30 );
        var pie = svg.append( 'g' )
                    .attr(
                      'transform',
                      'translate(' + width / 2 + ',' + height / 2 + ')'
                    );

        var detailedInfo = svg.append( 'g' )
                              .attr( 'class', 'pieChart--detailedInformation' );

        var twoPi   = 2 * Math.PI;
        var enterClockwise = { startAngle: 0, endAngle: 0 };
        var enterAntiClockwise = { startAngle: twoPi, endAngle: twoPi };
        
        var pieData = d3.layout.pie()
                        .value( function( d ) { return d.percent; } );

        var arc = d3.svg.arc()
                        .outerRadius( radius - 20)
                        .innerRadius( 0 );
        
        var valueTotal = 0;
        var chartName = data.type;
        var pieChartPieces = pie.datum( data )
                                .selectAll( 'path' )
                                .data( pieData )
                                .enter()
                                .append( 'path' )
                                .attr( 'class', function( d ) {
                                    return 'pieChart__' + d.data.color;
                                } )
                                .attr( 'd', arc )
                                .each( function( obj, index ) {
                                    this._current = ( index % 2 == 0 ) ? enterAntiClockwise : enterClockwise;
                                    valueTotal += obj.data.value;
                                } )
                                .transition()
                                .duration( DURATION )
                                .attrTween( 'd', function( d ) {
                                    var interpolate = d3.interpolate( this._current, d );
                                    this._current = interpolate( 0 );

                                    return function( t ) {
                                        return arc( interpolate( t ) );
                                    };
                                } )
                                .each( 'end', function handleAnimationEnd( d ) {
                                    drawDetailedInformation( d.data, this ); 
                                } );

        drawChartCenter( data, valueTotal ); 
    
        function drawChartCenter( data, valueTotal ) {
            var centerContainer = pie.append( 'g' )
                                    .attr( 'class', 'pieChart--center' );

            var circleRadius = radius - 25;
            
            // Draw the chart inner circle
            centerContainer.append( 'circle' )
                            .attr( 'class', 'pieChart--center--innerCircle' )
                            .attr( 'r', 0 )
                            .attr( 'r', circleRadius );

            // Draw the chart inner circle X-Axis and Y-Axis points
            centerContainer.append( 'line' )
                            .attr( 'class', 'pieChart--detail--quarter' )
                            .attr( 'x1', - circleRadius + 1 )
                            .attr( 'x2', - circleRadius + 4 )
                            .attr( 'y1', 0 )
                            .attr( 'y2', 0 );
            centerContainer.append( 'line' )
                            .attr( 'class', 'pieChart--detail--quarter' )
                            .attr( 'x1', circleRadius - 1 )
                            .attr( 'x2', circleRadius - 4 )
                            .attr( 'y1', 0 )
                            .attr( 'y2', 0 );
            centerContainer.append( 'line' )
                            .attr( 'class', 'pieChart--detail--quarter' )
                            .attr( 'x1', 0 )
                            .attr( 'x2', 0 )
                            .attr( 'y1', - circleRadius + 1 )
                            .attr( 'y2', - circleRadius + 4 );
            centerContainer.append( 'line' )
                            .attr( 'class', 'pieChart--detail--quarter' )
                            .attr( 'x1', 0 )
                            .attr( 'x2', 0 )
                            .attr( 'y1', circleRadius - 1 )
                            .attr( 'y2', circleRadius - 4 );
            
            var valueSuffix = '';
            if (typeof data[0].suffix !== 'undefined') {
                valueSuffix = data[0].suffix;
            }
            
            // Draw the data type name
            centerContainer.data( [ data ] )
                            .append( 'text' )
                            .text ( '0' )
                            .attr( 'class', 'pieChart--head--title' )
                            .attr( 'x', 0 )
                            .attr( 'y', -15 )
                            .attr( 'text-anchor', 'middle' )
                            .html( data[0].type );
            
            // Draw the data total value
            centerContainer.data( [ valueTotal ] )
                            .append( 'text' )
                            .text ( '0' )
                            .attr( 'class', 'pieChart--head--value' )
                            .attr( 'x', 0 )
                            .attr( 'y', 5 )
                            .attr( 'text-anchor', 'middle' )
                            .transition()
                            .duration( DURATION )
                            .tween( 'text', function( d ) {
                                var i = d3.interpolateRound( this.textContent.replace( /\s%/ig, '' ), d );
                                return function( t ) {
                                    var format = d3.format('0,000');
                                    this.textContent = i( t );
                                    this.textContent = format(this.textContent) + valueSuffix;
                                };
                            } );
        }
    
        function drawDetailedInformation ( data, element ) {
            var bBox      = element.getBBox(),
                infoWidth = width * 0.5,
                anchor,
                infoContainer,
                position,
                valueSuffix = '';
            
            if (typeof data.suffix !== 'undefined') {
                valueSuffix = data.suffix;
            }
            
            if ( ( bBox.x + bBox.width / 2 ) >= 0 ) {
                infoContainer = detailedInfo.append( 'g' )
                                        .attr( 'width', infoWidth )
                                        .attr(
                                          'transform',
                                          'translate(' + ( width - infoWidth ) + ',' + ( width - infoWidth - 20 ) + ')'
                                        );
                anchor   = 'end';
                position = 'right';
            } else {
                infoContainer = detailedInfo.append( 'g' )
                                        .attr( 'width', infoWidth )
                                        .attr(
                                          'transform',
                                          'translate(' + 0 + ',' + ( width - infoWidth - 20 ) + ')'
                                        );
                anchor   = 'start';
                position = 'left';
            }
            
            // Draw the data title
            infoContainer.data( [ data.title ] ) 
                        .append( 'foreignObject' )
                        .attr( 'width', infoWidth ) 
                        .attr( 'height', 16 )
                        .append( 'xhtml:body' )
                        .attr(
                          'class',
                          'pieChart--detail--textContainer ' + 'pieChart--detail__' + position + ' ' + 'pieChart__' + data.color
                        )
                        .html( data.title );
            
            // Draw the data value percent
            infoContainer.data( [ data.percent * 100 ] )
                        .append( 'text' )
                        .text ( '0 %' )
                        .attr( 'class', 'pieChart--detail--percentage' )
                        .attr( 'x', ( position === 'left' ? 0 : infoWidth ) )
                        .attr( 'y', 25 )
                        .attr( 'text-anchor', anchor )
                        .transition()
                        .tween( 'text', function( d ) {
                            var i = d3.interpolateRound( this.textContent.replace( /\s%/ig, '' ), d );
                            return function( t ) {
                                this.textContent = i( t ) + '%';
                            };
                        } );
            
            // Draw the data value
            infoContainer.data( [ data.value ] )
                        .append( 'text' )
                        .text ( '0' )
                        .attr( 'class', 'pieChart--detail--value' )
                        .attr( 'x', ( position === 'left' ? 0 : infoWidth ) )
                        .attr( 'y', 35 )
                        .attr( 'text-anchor', anchor )
                        .transition()
                        .tween( 'text', function( d ) {
                            var i = d3.interpolateRound( this.textContent.replace( /\s%/ig, '' ), d );
                            return function( t ) {
                                var format = d3.format('0,000');
                                this.textContent = i( t );
                                this.textContent = format(this.textContent) + valueSuffix;
                            };
                        } );

        }
    }
  
    function initDrawCharts() {
        drawPieChart( 'pieChartRevenue', data.pieChartRevenue );
        drawPieChart( 'pieChartImpresions', data.pieChartImpresions );
        drawPieChart( 'pieChartVisits', data.pieChartVisits );
    }
  
    // initialize drawing the charts
    initDrawCharts();
    
});

define();