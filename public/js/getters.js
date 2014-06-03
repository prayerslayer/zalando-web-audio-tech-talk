function getAudioContext() {
    return  window.AudioContext ||
            window.webkitAudioContext ||
            window.mozAudioContext ||
            window.msAudioContext;
}

function getUserMedia() {
    return ( 
        function() { 
            return navigator.getUserMedia ||
                    navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia ||
                    navigator.msGetUserMedia;
        }
    )().bind(navigator);
}

function getSpeechRecognition() {
    return window.SpeechRecognition ||
            window.webkitSpeechRecognition ||
            window.mozSpeechRecognition ||
            window.msSpeechRecognition;
}

// source http://en.wikipedia.org/wiki/Piano_key_frequencies
function getFrequencyForKey( key ) {
    return Math.pow( 2, ( key - 49 ) / 12 ) * 440;
}