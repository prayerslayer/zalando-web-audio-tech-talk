
function recognizeSpeech() {
    var SpeechRecognition =  getSpeechRecognition();

    if ( !SpeechRecognition ) {
        console.warn( 'No speech recognition for you, sir.' );
        return;
    }

    var recognizer = new SpeechRecognition(),
        emitter = new EventEmitter();
    recognizer.onerror = function( evt ) {
        console.error( 'Speech recognition error', evt.error );
    }
    recognizer.onresult = function( evt ) {
        var result = evt.results[ evt.results.length - 1 ][ 0 ].transcript;
        emitter.emitEvent( 'speech-recognized', [ result.trim() ] );
    }
    recognizer.continuous = true;
    recognizer.start();

    return emitter;
}