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
    function playNote(key) {
        gain.gain.value = 1;
        var $this = $( key );
        oscillator.frequency.value = parseInt( $this.attr('data-freq') );
        // $this.data( 'old-bg', $this.css( 'background-color' ) );
        // $this.css( 'background-color', 'red' );
    }
    function stopNote() {
        if ( gain ) {
            gain.gain.value = 0;
        }
        //$( this ).css( 'background-color', $( this ).data( 'old-bg') );
    }
    function changeWaveType() {
        oscillator.type = parseInt($(this).val(), 10);
    }

    $( 'body' ).on( 'keydown', function(evt) {
        var key = '';
        switch( evt.which ) {
            case 65: key = 'Di0'; break;
            case 83: key = 'G0'; break;
            case 68: key = 'B1'; break;
            case 70: key = 'D1'; break;
            case 71: key = 'Di1'; break;
            default: break;
        }
        if ( !key )
            return;
        playNote( $('.keys' ).find( '.key[data-key=' + key + ']' ).first() );
    });

    $( 'body' ).on( 'keyup', function() {
        stopNote();
    });

    $( '[data-action=keyboard]' ).on( 'click', function() {
        var AudioContext = getAudioContext(),
            ctx;
        $( '.keyboard' ).removeClass('hidden');
        if ( !AudioContext ) {
            console.warn( 'Something went wrong with the audio context.' );
            return;
        }
        ctx = new AudioContext();
        oscillator = ctx.createOscillator();
        oscillator.type = 2;
        oscillator.noteOn( 0 );
        gain = ctx.createGain();
        gain.gain.value = 0;
        oscillator.connect( gain );
        gain.connect( ctx.destination );
    });
    $( '#wave' ).on('change', changeWaveType );
    $( '.key' )
        .on( 'mousedown', function() {
            playNote($(this));
        } )
        .on( 'mouseup', stopNote );
});