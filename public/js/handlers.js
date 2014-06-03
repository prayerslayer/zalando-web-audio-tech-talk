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

    var oscillator, gain;

    function playNote( key ) {
        // 100 % volume
        gain.gain.value = 1;
        var $this = $( key );
        // set frequency
        oscillator.frequency.value = parseFloat( $this.attr('data-freq') );
        // highlight keyboard key
        $this.css( 'border', '2px solid red' );
    }

    function stopNote() {
        // mute again
        if ( gain ) {
            gain.gain.value = 0;
        }
        // reset style
        $( '.key' ).css( 'border', '1px solid black' );
    }

    function changeWaveType() {
        oscillator.type = parseInt($(this).val(), 10);
    }

    $( 'body' ).on( 'keydown', function(evt) {
        var key = '';
        switch( evt.which ) {
            case 65: key = 13; break;    // A => A1
            case 66: key = 12; break;    // B => Ab1
            case 67: key = 16; break;    // C => C2 
            case 69: key = 20; break;    // E => E2
            case 70: key =  9; break;    // F => F1
            case 71: key = 21; break;    // G => F2
            default: break;
        }
        if ( !key )
            return;
        playNote( $( '.key[data-key=' + key + ']' ).first() );
    });

    $( 'body' ).on( 'keyup', function() {
        stopNote();
    });

    $( '[data-action=keyboard]' ).on( 'click', function() {
        var AudioContext = getAudioContext(),
            ctx,
            $keyboard = $( '.keyboard' ),
            $keys = $keyboard.find( '.keys' );

        if ( !AudioContext ) {
            console.warn( 'Something went wrong with the audio context.' );
            return;
        }

        // create audiocontext
        ctx = new AudioContext();
        // create oscillator audio source
        oscillator = ctx.createOscillator();
        // set waveform to sawtooth
        oscillator.type = 2;
        // play a note
        oscillator.noteOn( 0 );
        // but mute it
        gain = ctx.createGain();
        gain.gain.value = 0;
        // connect audio nodes
        oscillator.connect( gain );
        gain.connect( ctx.destination );

        // construct keys
        for( var n = 9; n <= 26; n++ ) {
            var f = getFrequencyForKey( n ),
                $domKey = $( document.createElement( 'div' ) );

            $domKey
                .attr( 'class', 'key' )
                .attr( 'data-freq', f )
                .attr( 'data-key', n )
                .on( 'mousedown', function() {
                    playNote( $( this ) );
                })
                .on( 'mouseup', stopNote )
                .text( n );
            $keys.append( $domKey );
        }
    });
    $( '#wave' ).on('change', changeWaveType );
});