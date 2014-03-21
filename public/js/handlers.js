$( document ).ready( function() {
    var speech = $( '.speech' );
    $( '[data-action=speech]' ).on( 'click', function() {
        recognizeSpeech().addListener( 'speech-recognized', function( result ) {
            speech.text( speech.text() + '\n' + result );
        });
    });
    var microphone = null;
    $( '[data-action=microphone]' ).on( 'click', function() {
        if ( !microphone ) microphone = useMicrophone();

        // setup drawing
        var svg = d3.select( 'svg.equalizer' ),
            y = d3.scale.linear().domain([ 1, -1 ]).range([ 200, 0 ]),
            x = d3.scale.linear().domain([ 0, 1024]).range([ 0, 800 ]),
            line = d3.svg.line()
                        .x( function( d, i ) { return x(i); } )
                        .y( y )
                        .interpolate( 'monotone' ),
            polyline = null;


        function drawLevels( data ) {
            if ( !polyline ) polyline = svg.append('svg:path');
            
            polyline
                .attr( 'd', line( data ) );
        };
        
        microphone.addListener( 'microphone-levels', function( result ) {
            drawLevels( result.inputBuffer.getChannelData( 0 ));
        });
    });
});