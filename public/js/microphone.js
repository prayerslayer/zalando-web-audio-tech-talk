function useMicrophone() {
    var AudioContext = getAudioContext(),
        audioContext,
        source,
        volumeChecker,
        gainNode,
        userMedia = getUserMedia(),
        emitter = new EventEmitter();

    if ( !userMedia ) {
        console.warn( 'Your browser does not support User Media.' );
    } else {
        userMedia({ 'audio': true }, onMicrophoneSuccess, onMicrophoneError);
    }

    function processAudio(e) {
        emitter.emitEvent( 'microphone-levels', [ e ] );
    };

    function onMicrophoneSuccess( stream ) {
        // create audio context
        audioContext = new AudioContext();

        // set its source to be our user media stream
        source = audioContext.createMediaStreamSource( stream );

        // create javascript gate node
        volumeChecker = audioContext.createJavaScriptNode( 1024, 1, 1 );

        // create gain node that silences everything
        gainNode = audioContext.createGain();
        gainNode.gain.value = 0;
        
        // wire audio source --> volume checker --> gain node --> destination
        // destination is necessary otherwise no audio processing happens
        source.connect(volumeChecker);
        volumeChecker.connect(gainNode);
        gainNode.connect(audioContext.destination);

        volumeChecker.onaudioprocess = processAudio;
    };

    function onMicrophoneError() {
        console.warn( 'User cancelled the microphone permission.' );
    };

    return emitter;
}