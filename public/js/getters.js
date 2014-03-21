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