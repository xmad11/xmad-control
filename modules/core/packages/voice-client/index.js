#!/bin/bash
# Voice API Client - Uses external APIs only
# No local microservices

class VoiceClient {
  constructor() {
    this.providers = {
      stt: 'https://api.openai.com/v1/audio/transcriptions',
      tts: 'https://api.openai.com/v1/audio/speech'
    };
  }

  // Speech-to-Text (use OpenAI Whisper API)
  async transcribe(audioBuffer, apiKey) {
    const response = await fetch(this.providers.stt, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      body: audioBuffer
    });
    return response.json();
  }

  // Text-to-Speech (use OpenAI TTS API)
  async synthesize(text, apiKey, voice = 'alloy') {
    const response = await fetch(this.providers.tts, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: voice
      })
    });
    return response.arrayBuffer();
  }

  // Browser Web Speech API (fallback)
  browserSTT(callback) {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.onresult = (event) => {
        callback(event.results[0][0].transcript);
      };
      recognition.start();
    }
  }

  browserTTS(text) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    }
  }
}

module.exports = VoiceClient;
