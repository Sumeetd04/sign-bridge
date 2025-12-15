// ===== COMPLETE VOICE TO SIGN IMPLEMENTATION =====
// Add this code to your script.js file (replace the existing voice-to-sign section)

// Voice to Sign specific variables
let speechRecognition = null;
let isVoiceToSignListening = false;

// Comprehensive mapping for voice commands to sign language images
const voiceToSignMapping = {
    // Greetings
    "hello": {
        emoji: "👋",
        description: "Hand wave"
    },
    "hi": {
        emoji: "👋",
        description: "Hand wave"
    },
    "goodbye": {
        emoji: "👋",
        description: "Wave goodbye"
    },
    "bye": {
        emoji: "👋",
        description: "Wave goodbye"
    },
    "good morning": {
        emoji: "🌅",
        description: "Sun rising + wave"
    },
    "good afternoon": {
        emoji: "☀️",
        description: "Sun + wave"
    },
    "good evening": {
        emoji: "🌙",
        description: "Moon + wave"
    },
    "good night": {
        emoji: "🌙✨",
        description: "Sleep sign"
    },
    
    // Politeness
    "thank you": {
        emoji: "🙏",
        description: "Hand to chin, move forward"
    },
    "thanks": {
        emoji: "🙏",
        description: "Hand to chin, move forward"
    },
    "please": {
        emoji: "🤲",
        description: "Flat hand circles on chest"
    },
    "sorry": {
        emoji: "😔",
        description: "Fist circles on chest"
    },
    "excuse me": {
        emoji: "👉",
        description: "Tap on shoulder"
    },
    "you're welcome": {
        emoji: "👐",
        description: "Palms up, move outward"
    },
    
    // Basic responses
    "yes": {
        emoji: "👍",
        description: "Nodding fist"
    },
    "no": {
        emoji: "👎",
        description: "Shaking hand"
    },
    "maybe": {
        emoji: "🤷",
        description: "Hands open, shrug"
    },
    "ok": {
        emoji: "👌",
        description: "OK hand shape"
    },
    "okay": {
        emoji: "👌",
        description: "OK hand shape"
    },
    
    // Questions
    "what": {
        emoji: "❓",
        description: "Index fingers outward"
    },
    "where": {
        emoji: "📍",
        description: "Index finger moves"
    },
    "when": {
        emoji: "⌚",
        description: "Tap wrist"
    },
    "why": {
        emoji: "🤔",
        description: "Forehead touch"
    },
    "how": {
        emoji: "❔",
        description: "Palms up"
    },
    "who": {
        emoji: "👤",
        description: "Circle near mouth"
    },
    
    // Common phrases
    "help": {
        emoji: "🆘",
        description: "Thump on palm"
    },
    "help me": {
        emoji: "🆘🙏",
        description: "Thump on palm + point"
    },
    "i love you": {
        emoji: "🤟",
        description: "ILY hand shape"
    },
    "my name is": {
        emoji: "👤",
        description: "Point to self"
    },
    "nice to meet you": {
        emoji: "🤝",
        description: "Handshake motion"
    },
    
    // Family
    "mother": {
        emoji: "👩",
        description: "Thumb to chin"
    },
    "mom": {
        emoji: "👩",
        description: "Thumb to chin"
    },
    "father": {
        emoji: "👨",
        image: "https://images.unsplash.com/photo--cb58502866ab?w=300&h=300&fit=crop",
        description: "Thumb to forehead"
    },
    "dad": {
        emoji: "👨",
        image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=300&h=300&fit=crop",
        description: "Thumb to forehead"
    },
    "brother": {
        emoji: "👦",
        image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=300&h=300&fit=crop",
        description: "Two L-hands"
    },
    "sister": {
        emoji: "👧",
        image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=300&h=300&fit=crop",
        description: "Index to nose"
    },
    "family": {
        emoji: "👨‍👩‍👧‍👦",
        image: "https://images.unsplash.com/photo-1518495978942-83cdb633d7d3?w=300&h=300&fit=crop",
        description: "Two F-hands circle"
    },
    
    // Common words
    "water": {
        emoji: "💧",
        image: "https://images.unsplash.com/photo-1541670315-e5e4b03abfc9?w=300&h=300&fit=crop",
        description: "W-shaped tap chin"
    },
    "food": {
        emoji: "🍎",
        image: "https://images.unsplash.com/photo-1567469371750-fdcb4bbfec87?w=300&h=300&fit=crop",
        description: "Flat hand to mouth"
    },
    "eat": {
        emoji: "🍴",
        description: "Hand to mouth"
    },
    "drink": {
        emoji: "🥤",
        description: "C-shape to mouth"
    },
    "bathroom": {
        emoji: "🚽",
        description: "T-shaped shake"
    },
    "home": {
        emoji: "🏠",
        description: "Flat hands together"
    },
    "school": {
        emoji: "🏫",
        description: "Clapping hands"
    },
    "work": {
        emoji: "💼",
        description: "S-shaped wrists"
    },
    
    // Emotions
    "happy": {
        emoji: "😊",
        description: "Brush chest upward"
    },
    "sad": {
        emoji: "😢",
        description: "Fingers down face"
    },
    "angry": {
        emoji: "😠",
        description: "Claw hands at chest"
    },
    "tired": {
        emoji: "😴",
        description: "Palms drop"
    },
    "sick": {
        emoji: "🤒",
        description: "Middle finger to forehead"
    },
    
    // Add more signs here
    "good luck": {
        emoji: "🍀",
        description: "L-shape forward"
    },
    "how are you": {
        emoji: "👋❓",
        description: "Wave + question"
    }
};

// Initialize Speech Recognition
function initializeSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        console.error('Speech recognition not supported');
        showNotification('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.', 'error');
        
        const startBtn = document.getElementById('startVoiceToSign');
        if (startBtn) {
            startBtn.disabled = true;
            startBtn.innerHTML = '❌ Not Supported';
            startBtn.classList.remove('bg-green-500', 'hover:bg-green-600');
            startBtn.classList.add('bg-gray-400', 'cursor-not-allowed');
        }
        return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    return recognition;
}

// Setup Speech Recognition Event Handlers
function setupSpeechRecognition() {
    if (!speechRecognition) return;

    const startBtn = document.getElementById('startVoiceToSign');
    const voiceStatus = document.getElementById('voiceStatus');
    const voiceInputDisplay = document.getElementById('voiceInputDisplay');
    const signOutputDisplay = document.getElementById('signOutputDisplay');

    speechRecognition.onstart = () => {
        console.log('Speech recognition started');
        isVoiceToSignListening = true;
        
        if (startBtn) {
            startBtn.innerHTML = `
                <svg class="w-6 h-6 mr-2 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"/>
                </svg>
                Stop Listening
            `;
            startBtn.classList.remove('bg-green-500', 'hover:bg-green-600');
            startBtn.classList.add('bg-red-500', 'hover:bg-red-600');
        }
        
        if (voiceStatus) {
            voiceStatus.textContent = '🎤 Listening... Speak now!';
            voiceStatus.className = 'text-lg text-green-600 font-semibold animate-pulse';
        }
        
        if (voiceInputDisplay) {
            voiceInputDisplay.textContent = 'Listening...';
            voiceInputDisplay.style.color = '#059669';
        }
    };

    speechRecognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
            } else {
                interimTranscript += transcript;
            }
        }

        // Display current transcript
        if (voiceInputDisplay) {
            const displayText = (finalTranscript + interimTranscript).trim();
            voiceInputDisplay.textContent = displayText || 'Listening...';
            voiceInputDisplay.style.color = finalTranscript ? '#1f2937' : '#6b7280';
        }

        // Process final transcript
        if (finalTranscript.trim()) {
            processVoiceCommand(finalTranscript.trim().toLowerCase());
        }
    };

    speechRecognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        
        let errorMessage = 'Error with speech recognition. ';
        switch (event.error) {
            case 'no-speech':
                errorMessage = 'No speech detected. Please try speaking again.';
                // Don't stop for no-speech error, just notify
                showNotification(errorMessage, 'info');
                return;
            case 'audio-capture':
                errorMessage = 'No microphone found. Please ensure a microphone is connected.';
                break;
            case 'not-allowed':
                errorMessage = 'Microphone access denied. Please allow microphone permissions in your browser settings.';
                break;
            case 'network':
                errorMessage = 'Network error. Please check your internet connection.';
                break;
            default:
                errorMessage += 'Please try again. Error: ' + event.error;
        }
        
        showNotification(errorMessage, 'error');
        stopVoiceToSign();
    };

    speechRecognition.onend = () => {
        console.log('Speech recognition ended');
        if (isVoiceToSignListening) {
            // Automatically restart if we didn't explicitly stop
            console.log('Restarting speech recognition...');
            try {
                speechRecognition.start();
            } catch (error) {
                console.error('Error restarting recognition:', error);
                stopVoiceToSign();
            }
        }
    };
}
// Process voice commands and display sign language
function processVoiceCommand(transcript) {
    console.log('Processing:', transcript);
    
    const signOutputDisplay = document.getElementById('signOutputDisplay');
    if (!signOutputDisplay) return;

    // Clean the transcript
    const cleanTranscript = transcript.toLowerCase().trim();
    
    // Look for exact matches first
    let signData = voiceToSignMapping[cleanTranscript];
    let matchedPhrase = cleanTranscript;
    
    // If no exact match, look for partial matches (longest first)
    if (!signData) {
        const sortedPhrases = Object.keys(voiceToSignMapping).sort((a, b) => b.length - a.length);
        
        for (const phrase of sortedPhrases) {
            if (cleanTranscript.includes(phrase)) {
                signData = voiceToSignMapping[phrase];
                matchedPhrase = phrase;
                break;
            }
        }
    }
    
    // Display result
    if (signData) {
        signOutputDisplay.innerHTML = `
            <div class="flex flex-col md:flex-row gap-6 animate-fadeIn">
                <!-- Sign Visualization (Left) -->
                <div class="md:w-1/2">
                    <div class="bg-white p-6 rounded-xl shadow-lg border-2 border-blue-200 h-full">
                        <div class="text-center">
                            <!-- Sign Image -->
                            <div class="mb-4">
                                <img src="${signData.image}" 
                                     alt="Sign for ${matchedPhrase}" 
                                     class="w-64 h-64 mx-auto rounded-lg shadow-lg object-cover border-4 border-blue-300"
                                     onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop'">
                                <div class="mt-2 text-sm text-gray-500">${signData.description}</div>
                            </div>
                            
                            <!-- Sign Emoji -->
                            <div class="text-6xl mb-3">${signData.emoji}</div>
                            
                            <!-- Sign Name -->
                            <div class="inline-block bg-blue-50 px-4 py-2 rounded-full">
                                <p class="text-blue-700 font-bold text-xl">"${matchedPhrase}"</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Sign Information (Right) -->
                <div class="md:w-1/2">
                    <div class="bg-green-50 p-6 rounded-xl shadow-lg border-2 border-green-200 h-full">
                        <h3 class="text-xl font-bold text-green-700 mb-4 flex items-center">
                            <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Sign Language Information
                        </h3>
                        
                        <!-- How to Make the Sign -->
                        <div class="mb-6">
                            <h4 class="font-semibold text-gray-700 mb-2">How to make this sign:</h4>
                            <div class="bg-white p-4 rounded-lg">
                                <p class="text-gray-600">${signData.description}</p>
                                <div class="mt-3 flex space-x-2">
                                    <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Hand Shape</span>
                                    <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Movement</span>
                                    <span class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Location</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Practice Tips -->
                        <div class="mb-6">
                            <h4 class="font-semibold text-gray-700 mb-2">Practice Tips:</h4>
                            <ul class="space-y-2 text-sm text-gray-600">
                                <li class="flex items-start">
                                    <span class="text-green-500 mr-2">✓</span>
                                    <span>Keep your movements smooth and clear</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="text-green-500 mr-2">✓</span>
                                    <span>Maintain eye contact while signing</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="text-green-500 mr-2">✓</span>
                                    <span>Practice in front of a mirror</span>
                                </li>
                            </ul>
                        </div>
                        
                        <!-- Voice Button -->
                        <button onclick="speakText('${matchedPhrase}')" class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
                            </svg>
                            🔊 Say "${matchedPhrase}"
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Speak the recognized text
        speakText(matchedPhrase);
        
        // Show success notification
        showNotification(`Found sign for: "${matchedPhrase}"`, 'success');
    } else {
        signOutputDisplay.innerHTML = `
            <div class="text-center p-8">
                <div class="text-7xl mb-4">🤔</div>
                <p class="text-gray-700 font-semibold text-xl mb-2">No sign found for:</p>
                <p class="text-blue-600 text-2xl font-bold mb-6">"${cleanTranscript}"</p>
                
                <div class="bg-blue-50 p-6 rounded-xl border-2 border-blue-200 max-w-md mx-auto">
                    <h4 class="text-lg font-semibold text-blue-800 mb-3">💡 Try saying one of these:</h4>
                    <div class="grid grid-cols-2 gap-3">
                        <div class="bg-white p-3 rounded-lg text-center hover:shadow-md transition duration-200 cursor-pointer" onclick="speakAndShow('hello')">
                            <div class="text-2xl mb-1">👋</div>
                            <p class="font-medium text-blue-700">hello</p>
                        </div>
                        <div class="bg-white p-3 rounded-lg text-center hover:shadow-md transition duration-200 cursor-pointer" onclick="speakAndShow('thank you')">
                            <div class="text-2xl mb-1">🙏</div>
                            <p class="font-medium text-blue-700">thank you</p>
                        </div>
                        <div class="bg-white p-3 rounded-lg text-center hover:shadow-md transition duration-200 cursor-pointer" onclick="speakAndShow('help')">
                            <div class="text-2xl mb-1">🆘</div>
                            <p class="font-medium text-blue-700">help</p>
                        </div>
                        <div class="bg-white p-3 rounded-lg text-center hover:shadow-md transition duration-200 cursor-pointer" onclick="speakAndShow('water')">
                            <div class="text-2xl mb-1">💧</div>
                            <p class="font-medium text-blue-700">water</p>
                        </div>
                        <div class="bg-white p-3 rounded-lg text-center hover:shadow-md transition duration-200 cursor-pointer" onclick="speakAndShow('yes')">
                            <div class="text-2xl mb-1">👍</div>
                            <p class="font-medium text-blue-700">yes</p>
                        </div>
                        <div class="bg-white p-3 rounded-lg text-center hover:shadow-md transition duration-200 cursor-pointer" onclick="speakAndShow('no')">
                            <div class="text-2xl mb-1">👎</div>
                            <p class="font-medium text-blue-700">no</p>
                        </div>
                        <div class="bg-white p-3 rounded-lg text-center hover:shadow-md transition duration-200 cursor-pointer" onclick="speakAndShow('i love you')">
                            <div class="text-2xl mb-1">🤟</div>
                            <p class="font-medium text-blue-700">I love you</p>
                        </div>
                        <div class="bg-white p-3 rounded-lg text-center hover:shadow-md transition duration-200 cursor-pointer" onclick="speakAndShow('how are you')">
                            <div class="text-2xl mb-1">👋❓</div>
                            <p class="font-medium text-blue-700">how are you</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        showNotification('Sign not found. Try another phrase!', 'info');
    }
}

// New function: Speak and show sign
function speakAndShow(text) {
    speakText(text);
    processVoiceCommand(text);
}

// Text to Speech function
function speakText(text) {
    if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        
        utterance.onstart = () => {
            console.log('Speaking:', text);
        };
        
        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
        };
        
        window.speechSynthesis.speak(utterance);
    }
}

// Start Voice to Sign
function startVoiceToSign() {
    if (isVoiceToSignListening) {
        stopVoiceToSign();
        return;
    }

    if (!speechRecognition) {
        speechRecognition = initializeSpeechRecognition();
        if (!speechRecognition) return;
        setupSpeechRecognition();
    }

    try {
        speechRecognition.start();
        showNotification('Voice recognition started! Start speaking...', 'success');
    } catch (error) {
        console.error('Error starting speech recognition:', error);
        if (error.message.includes('already started')) {
            // Already running, just update UI
            isVoiceToSignListening = true;
        } else {
            showNotification('Failed to start voice recognition. Please try again.', 'error');
        }
    }
}

// Stop Voice to Sign
function stopVoiceToSign() {
    if (speechRecognition && isVoiceToSignListening) {
        speechRecognition.stop();
        isVoiceToSignListening = false;
    }
    
    const startBtn = document.getElementById('startVoiceToSign');
    const voiceStatus = document.getElementById('voiceStatus');
    const voiceInputDisplay = document.getElementById('voiceInputDisplay');
    const signOutputDisplay = document.getElementById('signOutputDisplay');
    
    if (startBtn) {
        startBtn.innerHTML = `
            <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
            </svg>
            Start Listening
        `;
        startBtn.classList.remove('bg-red-500', 'hover:bg-red-600');
        startBtn.classList.add('bg-green-500', 'hover:bg-green-600');
    }
    
    if (voiceStatus) {
        voiceStatus.textContent = 'Click "Start Listening" to activate your microphone.';
        voiceStatus.className = 'text-lg text-gray-700';
    }
    
    if (voiceInputDisplay) {
        voiceInputDisplay.textContent = 'Your spoken words will appear here...';
        voiceInputDisplay.style.color = '#6b7280';
    }
    
    if (signOutputDisplay) {
        signOutputDisplay.innerHTML = `
            <div class="text-center p-6">
                <div class="text-6xl mb-4">👋</div>
                <p class="text-gray-700 font-semibold text-lg mb-2">Voice to Sign Converter</p>
                <p class="text-gray-500 text-sm mb-4">Click "Start Listening" and speak to see sign language equivalents</p>
                <div class="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p class="text-blue-800 text-sm font-semibold mb-2">💬 Try saying:</p>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-blue-600">
                        <span class="bg-white px-2 py-1 rounded">hello</span>
                        <span class="bg-white px-2 py-1 rounded">thank you</span>
                        <span class="bg-white px-2 py-1 rounded">please</span>
                        <span class="bg-white px-2 py-1 rounded">help</span>
                        <span class="bg-white px-2 py-1 rounded">water</span>
                        <span class="bg-white px-2 py-1 rounded">yes</span>
                        <span class="bg-white px-2 py-1 rounded">no</span>
                        <span class="bg-white px-2 py-1 rounded">i love you</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    showNotification('Voice recognition stopped', 'info');
}

// ===== MISSING FUNCTIONS - ADD THESE =====

// Show notification function
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    
    // Set colors based on type
    let bgColor, textColor, icon;
    switch (type) {
        case 'success':
            bgColor = 'bg-green-100';
            textColor = 'text-green-800';
            icon = '✅';
            break;
        case 'error':
            bgColor = 'bg-red-100';
            textColor = 'text-red-800';
            icon = '❌';
            break;
        case 'warning':
            bgColor = 'bg-yellow-100';
            textColor = 'text-yellow-800';
            icon = '⚠️';
            break;
        default:
            bgColor = 'bg-blue-100';
            textColor = 'text-blue-800';
            icon = 'ℹ️';
    }
    
    notification.innerHTML = `
        <div class="fixed top-4 right-4 z-50 ${bgColor} ${textColor} px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 animate-fadeIn" style="min-width: 300px;">
            <span class="text-xl">${icon}</span>
            <span class="font-medium">${message}</span>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    }, 3000);
}

// Toggle dropdown function
function toggleDropdown(event, dropdownId) {
    event.preventDefault();
    event.stopPropagation();
    
    const dropdown = document.getElementById(dropdownId);
    const allDropdowns = document.querySelectorAll('.dropdown-menu');
    
    // Close all other dropdowns
    allDropdowns.forEach(d => {
        if (d.id !== dropdownId) {
            d.style.display = 'none';
        }
    });
    
    // Toggle current dropdown
    if (dropdown.style.display === 'block') {
        dropdown.style.display = 'none';
    } else {
        dropdown.style.display = 'block';
    }
}

// Show section function
function showSection(sectionId) {
    // Hide all sections
    const allSections = document.querySelectorAll('.section, .current-section');
    allSections.forEach(section => {
        section.style.display = 'none';
        section.classList.remove('current-section');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
        targetSection.classList.add('current-section');
    }
    
    // Update active nav link
    updateActiveNav(sectionId);
}

// Update active navigation
function updateActiveNav(sectionId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.textContent.toLowerCase().includes(sectionId.toLowerCase())) {
            link.classList.add('active');
        }
    });
}

// Open modal function
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }
}

// Close modal function
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }
}

// Show dictionary category
function showDictionaryCategory(category) {
    showSection('dictionary');
    
    // Update active filter button
    const filterButtons = document.querySelectorAll('.dict-filter-btn');
    filterButtons.forEach(btn => {
        if (btn.dataset.category === category) {
            btn.classList.remove('bg-gray-200', 'hover:bg-gray-300');
            btn.classList.add('bg-blue-500', 'hover:bg-blue-600', 'text-white');
        } else {
            btn.classList.remove('bg-blue-500', 'hover:bg-blue-600', 'text-white');
            btn.classList.add('bg-gray-200', 'hover:bg-gray-300');
        }
    });
    
    // Load dictionary content (placeholder)
    const dictionaryContent = document.getElementById('dictionaryContent');
    if (dictionaryContent) {
        dictionaryContent.innerHTML = `
            <div class="col-span-full text-center py-12">
                <div class="text-6xl mb-4">📚</div>
                <h3 class="text-2xl font-bold text-gray-700 mb-2">${category.charAt(0).toUpperCase() + category.slice(1)} Dictionary</h3>
                <p class="text-gray-500">Loading ${category} signs...</p>
                <div class="mt-6 animate-pulse">
                    <div class="h-64 bg-gray-200 rounded-lg"></div>
                </div>
            </div>
        `;
        
        // Simulate loading
        setTimeout(() => {
            loadDictionaryData(category);
        }, 500);
    }
}

// Load dictionary data
function loadDictionaryData(category) {
    const dictionaryContent = document.getElementById('dictionaryContent');
    const items = [];
    
    // Sample data for each category
    const sampleData = {
        alphabets: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
        numbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        daysMonths: ['Monday', 'Tuesday', 'January', 'February'],
        colors: ['Red', 'Blue', 'Green', 'Yellow'],
        family: ['Mother', 'Father', 'Sister', 'Brother'],
        greetings: ['Hello', 'Goodbye', 'Thank You', 'Please'],
        food: ['Apple', 'Bread', 'Water', 'Milk'],
        animals: ['Dog', 'Cat', 'Bird', 'Fish'],
        emotions: ['Happy', 'Sad', 'Angry', 'Excited']
    };
    
    const categoryItems = sampleData[category] || ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
    
    categoryItems.forEach(item => {
        items.push(`
            <div class="dictionary-item">
                <img src="https://placehold.co/150x150/3b82f6/ffffff?text=${item}" alt="${item}">
                <h4 class="font-semibold text-gray-800">${item}</h4>
            </div>
        `);
    });
    
    dictionaryContent.innerHTML = items.join('');
}

// Initialize quizzes
function initQuizzes() {
    // Alphabet quiz
    const alphabetQuiz = {
        questions: [
            {
                image: 'https://placehold.co/150x150/e0f2fe/60a5fa?text=A',
                options: ['A', 'B', 'C', 'D'],
                correct: 'A'
            },
            {
                image: 'https://placehold.co/150x150/e0f2fe/60a5fa?text=B',
                options: ['A', 'B', 'C', 'D'],
                correct: 'B'
            }
        ]
    };
    
    // Add event listeners for quiz buttons
    const submitAlphaBtn = document.getElementById('alpha-submitQuiz');
    const nextAlphaBtn = document.getElementById('alpha-nextQuiz');
    
    if (submitAlphaBtn) {
        submitAlphaBtn.addEventListener('click', submitQuiz);
    }
    if (nextAlphaBtn) {
        nextAlphaBtn.addEventListener('click', nextQuestion);
    }
}

// Submit quiz function
function submitQuiz() {
    // Quiz logic here
    showNotification('Quiz submitted!', 'success');
}

// Next question function
function nextQuestion() {
    // Next question logic here
    showNotification('Next question loaded!', 'info');
}

// Text to speech handler
function setupTextToSpeech() {
    const speakBtn = document.getElementById('speakText');
    const textArea = document.getElementById('textToSpeak');
    
    if (speakBtn && textArea) {
        speakBtn.addEventListener('click', () => {
            const text = textArea.value.trim();
            if (text) {
                speakText(text);
                showNotification('Speaking text...', 'info');
            } else {
                showNotification('Please enter some text first!', 'warning');
            }
        });
    }
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(event) {
    if (!event.target.matches('.nav-link') && !event.target.closest('.dropdown')) {
        const dropdowns = document.querySelectorAll('.dropdown-menu');
        dropdowns.forEach(dropdown => {
            dropdown.style.display = 'none';
        });
    }
});

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Voice to sign initialization
    const startBtn = document.getElementById('startVoiceToSign');
    if (startBtn) {
        // Remove any existing event listeners
        const newBtn = startBtn.cloneNode(true);
        startBtn.parentNode.replaceChild(newBtn, startBtn);
        
        // Add click event listener
        newBtn.addEventListener('click', startVoiceToSign);
    }
    
    // Initialize speech recognition
    speechRecognition = initializeSpeechRecognition();
    if (speechRecognition) {
        setupSpeechRecognition();
    }
    
    // Initialize quizzes
    initQuizzes();
    
    // Initialize text to speech
    setupTextToSpeech();
    
    // Initialize dictionary search
    const searchInput = document.getElementById('dictionarySearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const items = document.querySelectorAll('.dictionary-item');
            
            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
    
    // Initialize forms
    setupForms();
    
    // Close modals when clicking outside
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });
});

// Setup forms
function setupForms() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // Simple validation
            if (email && password) {
                // For now, simulate login
                showNotification('Login successful! Redirecting...', 'success');
                setTimeout(() => {
                    closeModal('loginModal');
                }, 1500);
            } else {
                showNotification('Please fill in all fields!', 'error');
            }
        });
    }
    
    // Signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validation
            if (!name || !email || !password || !confirmPassword) {
                showNotification('Please fill in all fields!', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showNotification('Passwords do not match!', 'error');
                return;
            }
            
            if (password.length < 8) {
                showNotification('Password must be at least 8 characters!', 'error');
                return;
            }
            
            // For now, simulate registration
            showNotification('Registration successful! Welcome to SignBridge!', 'success');
            setTimeout(() => {
                closeModal('signupModal');
            }, 1500);
        });
    }
}

// Add CSS animation for fade-in effect
if (!document.querySelector('#voiceToSignAnimations')) {
    const style = document.createElement('style');
    style.id = 'voiceToSignAnimations';
    style.textContent = `
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: scale(0.9);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        .animate-fadeIn {
            animation: fadeIn 0.5s ease-out;
        }
    `;
    document.head.appendChild(style);
}
// ===== SIGN TO VOICE - CAMERA & SIGN DETECTION =====

let webcamStream = null;
let isCameraActive = false;
let signDetectionInterval = null;

// Simple sign detection mapping (hand positions to meanings)
const signDetections = {
    'thumbs_up': 'Good job! 👍',
    'thumbs_down': 'Not good 👎',
    'peace_sign': 'Peace ✌️',
    'open_hand': 'Stop ✋',
    'wave': 'Hello 👋',
    'pointing': 'Look there 👉',
    'fist': 'Strong 💪',
    'ok_hand': 'Okay 👌'
};

// Initialize Sign to Voice functionality
function initSignToVoice() {
    // Get all elements
    const startCameraBtn = document.getElementById('startCamera');
    const stopCameraBtn = document.getElementById('stopCamera');
    const captureSignBtn = document.getElementById('captureSign');
    const clearResultsBtn = document.getElementById('clearResults');
    const playVoiceBtn = document.getElementById('playTranslatedVoice');
    
    // Event Listeners
    if (startCameraBtn) {
        startCameraBtn.addEventListener('click', startWebcam);
    }
    
    if (stopCameraBtn) {
        stopCameraBtn.addEventListener('click', stopWebcam);
    }
    
    if (captureSignBtn) {
        captureSignBtn.addEventListener('click', captureAndDetectSign);
    }
    
    if (clearResultsBtn) {
        clearResultsBtn.addEventListener('click', clearSignResults);
    }
    
    if (playVoiceBtn) {
        playVoiceBtn.addEventListener('click', playDetectedVoice);
    }
}

// Request camera permission and start webcam
async function startWebcam() {
    try {
        const cameraStatus = document.getElementById('cameraStatus');
        const cameraPlaceholder = document.getElementById('cameraPlaceholder');
        const webcamFeed = document.getElementById('webcamFeed');
        const startCameraBtn = document.getElementById('startCamera');
        const stopCameraBtn = document.getElementById('stopCamera');
        const captureSignBtn = document.getElementById('captureSign');
        
        // Request camera permission
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 640 },
                height: { ideal: 480 },
                facingMode: 'user'
            },
            audio: false
        });
        
        // Success - got permission
        webcamStream = stream;
        isCameraActive = true;
        
        // Show camera feed
        webcamFeed.srcObject = stream;
        webcamFeed.classList.remove('hidden');
        cameraPlaceholder.classList.add('hidden');
        
        // Update UI
        if (cameraStatus) {
            cameraStatus.textContent = 'Camera active - Make a sign and click "Detect Sign"';
            cameraStatus.className = 'text-lg text-green-600 font-semibold';
        }
        
        if (startCameraBtn) {
            startCameraBtn.disabled = true;
            startCameraBtn.innerHTML = '🎥 Camera Active';
        }
        
        if (stopCameraBtn) {
            stopCameraBtn.disabled = false;
        }
        
        if (captureSignBtn) {
            captureSignBtn.disabled = false;
        }
        
        showNotification('Camera started successfully! Make a sign and click "Detect Sign"', 'success');
        
    } catch (error) {
        console.error('Camera error:', error);
        
        let errorMessage = 'Failed to access camera. ';
        
        if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
            errorMessage = 'No camera found. Please connect a camera.';
        } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
            errorMessage = 'Camera is already in use by another application.';
        } else if (error.name === 'OverconstrainedError' || error.name === 'ConstraintNotSatisfiedError') {
            errorMessage = 'Camera does not support required settings.';
        } else if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
            errorMessage = 'Camera permission denied. Please allow camera access in your browser settings.';
        } else if (error.name === 'TypeError' || error.name === 'TypeError') {
            errorMessage = 'Camera access is not supported in this browser.';
        }
        
        showNotification(errorMessage, 'error');
        
        // Reset UI
        const startCameraBtn = document.getElementById('startCamera');
        if (startCameraBtn) {
            startCameraBtn.disabled = false;
            startCameraBtn.innerHTML = `
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                Start Camera
            `;
        }
    }
}

// Stop the webcam
function stopWebcam() {
    if (webcamStream) {
        // Stop all tracks
        webcamStream.getTracks().forEach(track => {
            track.stop();
        });
        
        webcamStream = null;
        isCameraActive = false;
        
        // Clear any detection interval
        if (signDetectionInterval) {
            clearInterval(signDetectionInterval);
            signDetectionInterval = null;
        }
        
        // Reset UI
        const webcamFeed = document.getElementById('webcamFeed');
        const cameraPlaceholder = document.getElementById('cameraPlaceholder');
        const cameraStatus = document.getElementById('cameraStatus');
        const startCameraBtn = document.getElementById('startCamera');
        const stopCameraBtn = document.getElementById('stopCamera');
        const captureSignBtn = document.getElementById('captureSign');
        const detectionOverlay = document.getElementById('detectionOverlay');
        
        if (webcamFeed) {
            webcamFeed.srcObject = null;
            webcamFeed.classList.add('hidden');
        }
        
        if (cameraPlaceholder) {
            cameraPlaceholder.classList.remove('hidden');
        }
        
        if (cameraStatus) {
            cameraStatus.textContent = 'Click "Start Camera" to begin sign detection';
            cameraStatus.className = 'text-lg text-gray-700';
        }
        
        if (startCameraBtn) {
            startCameraBtn.disabled = false;
            startCameraBtn.innerHTML = `
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                Start Camera
            `;
        }
        
        if (stopCameraBtn) {
            stopCameraBtn.disabled = true;
        }
        
        if (captureSignBtn) {
            captureSignBtn.disabled = true;
        }
        
        if (detectionOverlay) {
            detectionOverlay.classList.add('hidden');
        }
        
        showNotification('Camera stopped', 'info');
    }
}

// Capture image and detect sign
function captureAndDetectSign() {
    if (!isCameraActive || !webcamStream) {
        showNotification('Please start the camera first!', 'warning');
        return;
    }
    
    const webcamFeed = document.getElementById('webcamFeed');
    const canvas = document.getElementById('signCanvas');
    const detectionOverlay = document.getElementById('detectionOverlay');
    const detectedSign = document.getElementById('detectedSign');
    const translatedText = document.getElementById('translatedTextOutput');
    const playVoiceBtn = document.getElementById('playTranslatedVoice');
    
    if (!webcamFeed || !canvas) return;
    
    // Show detection overlay
    if (detectionOverlay) {
        detectionOverlay.classList.remove('hidden');
    }
    
    // Set canvas size to match video
    canvas.width = webcamFeed.videoWidth;
    canvas.height = webcamFeed.videoHeight;
    
    // Draw video frame to canvas
    const ctx = canvas.getContext('2d');
    ctx.drawImage(webcamFeed, 0, 0, canvas.width, canvas.height);
    
    // For now, we'll simulate sign detection
    // In a real app, you would use TensorFlow.js or another ML library here
    simulateSignDetection();
    
    // Hide detection overlay after "processing"
    setTimeout(() => {
        if (detectionOverlay) {
            detectionOverlay.classList.add('hidden');
        }
    }, 1500);
}

// Simulate sign detection (for demo purposes)
function simulateSignDetection() {
    const detectedSign = document.getElementById('detectedSign');
    const translatedText = document.getElementById('translatedTextOutput');
    const playVoiceBtn = document.getElementById('playTranslatedVoice');
    
    // List of possible signs to detect
    const signs = Object.keys(signDetections);
    
    // Randomly pick a sign for demo (in real app, this would be actual detection)
    const randomSign = signs[Math.floor(Math.random() * signs.length)];
    const signMeaning = signDetections[randomSign];
    
    // Update UI with detected sign
    if (detectedSign) {
        detectedSign.innerHTML = `
            <div class="text-center">
                <div class="text-3xl mb-2">${getSignEmoji(randomSign)}</div>
                <p class="font-bold text-lg text-blue-700">${formatSignName(randomSign)}</p>
                <p class="text-sm text-gray-600 mt-1">Confidence: ${Math.floor(Math.random() * 30) + 70}%</p>
            </div>
        `;
    }
    
    // Update translated text
    if (translatedText) {
        translatedText.innerHTML = `
            <div class="text-center">
                <p class="text-xl font-semibold text-purple-700">"${signMeaning}"</p>
                <p class="text-sm text-gray-500 mt-2">Sign detected: ${formatSignName(randomSign)}</p>
            </div>
        `;
    }
    
    // Enable play voice button
    if (playVoiceBtn) {
        playVoiceBtn.disabled = false;
        playVoiceBtn.dataset.textToSpeak = signMeaning;
    }
    
    showNotification(`Sign detected: ${formatSignName(randomSign)}`, 'success');
}

// Get emoji for sign
function getSignEmoji(signType) {
    const emojiMap = {
        'thumbs_up': '👍',
        'thumbs_down': '👎',
        'peace_sign': '✌️',
        'open_hand': '✋',
        'wave': '👋',
        'pointing': '👉',
        'fist': '✊',
        'ok_hand': '👌'
    };
    return emojiMap[signType] || '👐';
}

// Format sign name for display
function formatSignName(signType) {
    return signType.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// Play voice for detected sign
function playDetectedVoice() {
    const playVoiceBtn = document.getElementById('playTranslatedVoice');
    const textToSpeak = playVoiceBtn?.dataset.textToSpeak;
    
    if (textToSpeak) {
        speakText(textToSpeak);
        showNotification('Playing voice translation...', 'info');
    }
}

// Clear all sign detection results
function clearSignResults() {
    const detectedSign = document.getElementById('detectedSign');
    const translatedText = document.getElementById('translatedTextOutput');
    const playVoiceBtn = document.getElementById('playTranslatedVoice');
    
    if (detectedSign) {
        detectedSign.innerHTML = 'No sign detected yet';
        detectedSign.className = 'bg-white p-4 rounded-lg min-h-[60px] flex items-center justify-center text-gray-500 text-lg';
    }
    
    if (translatedText) {
        translatedText.innerHTML = 'Perform a sign and click "Detect Sign"';
        translatedText.className = 'bg-white p-4 rounded-lg min-h-[80px] flex items-center justify-center text-gray-500 text-lg';
    }
    
    if (playVoiceBtn) {
        playVoiceBtn.disabled = true;
        delete playVoiceBtn.dataset.textToSpeak;
    }
    
    showNotification('Results cleared', 'info');
}

// Check if we're in the sign-to-voice section and handle camera
function checkSignToVoiceSection() {
    const signToVoiceSection = document.getElementById('sign-to-voice');
    if (signToVoiceSection && signToVoiceSection.classList.contains('current-section')) {
        // Section is visible
        console.log('Sign to Voice section is active');
    } else if (isCameraActive) {
        // If camera is active but we left the section, stop camera
        stopWebcam();
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    // ... existing code ...
    
    // Initialize sign to voice
    initSignToVoice();
    
    // Check sign to voice section on section changes
    const originalShowSection = window.showSection;
    window.showSection = function(sectionId) {
        // Call original function
        if (typeof originalShowSection === 'function') {
            originalShowSection(sectionId);
        }
        
        // Check if we need to stop camera
        setTimeout(checkSignToVoiceSection, 100);
    };
});
// ===== UPDATED FOR SIDE-BY-SIDE LAYOUT =====

// Store recent detections
let recentDetections = [];

// Update recent detections display
function updateRecentDetections(sign, meaning) {
    // Add to beginning of array
    recentDetections.unshift({
        sign: sign,
        meaning: meaning,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        emoji: getSignEmoji(sign)
    });
    
    // Keep only last 5 detections
    if (recentDetections.length > 5) {
        recentDetections = recentDetections.slice(0, 5);
    }
    
    // Update UI
    const recentContainer = document.getElementById('recentDetections');
    if (recentContainer) {
        if (recentDetections.length === 0) {
            recentContainer.innerHTML = `
                <div class="text-center py-4 text-gray-500">
                    <p>No recent detections</p>
                </div>
            `;
        } else {
            recentContainer.innerHTML = recentDetections.map((detection, index) => `
                <div class="bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition duration-200 ${index === 0 ? 'ring-2 ring-blue-200' : ''}">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <div class="text-2xl mr-3">${detection.emoji}</div>
                            <div>
                                <p class="font-semibold text-gray-800">${formatSignName(detection.sign)}</p>
                                <p class="text-sm text-gray-500">${detection.time}</p>
                            </div>
                        </div>
                        <button onclick="speakRecent('${detection.sign}')" class="text-blue-500 hover:text-blue-700">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }
}

// Speak a recent detection
function speakRecent(signType) {
    const detection = recentDetections.find(d => d.sign === signType);
    if (detection) {
        const meaning = signDetections[signType] || formatSignName(signType);
        speakText(meaning);
        showNotification(`Speaking: ${meaning}`, 'info');
    }
}

// Updated simulateSignDetection function
function simulateSignDetection() {
    const detectedSign = document.getElementById('detectedSign');
    const translatedText = document.getElementById('translatedTextOutput');
    const playVoiceBtn = document.getElementById('playTranslatedVoice');
    
    // List of possible signs to detect
    const signs = Object.keys(signDetections);
    
    // Randomly pick a sign for demo
    const randomSign = signs[Math.floor(Math.random() * signs.length)];
    const signMeaning = signDetections[randomSign];
    
    // Update detected sign display
    if (detectedSign) {
        detectedSign.innerHTML = `
            <div class="text-center">
                <div class="text-5xl mb-3">${getSignEmoji(randomSign)}</div>
                <p class="font-bold text-xl text-blue-700 mb-1">${formatSignName(randomSign)}</p>
                <div class="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    ${Math.floor(Math.random() * 30) + 70}% Confidence
                </div>
            </div>
        `;
    }
    
    // Update translation display
    if (translatedText) {
        translatedText.innerHTML = `
            <div class="text-center">
                <div class="text-3xl mb-2">🗣️</div>
                <p class="text-lg font-semibold text-purple-700 mb-2">"${signMeaning}"</p>
                <p class="text-sm text-gray-500">Detected as: ${formatSignName(randomSign)}</p>
            </div>
        `;
    }
    
    // Enable play voice button
    if (playVoiceBtn) {
        playVoiceBtn.disabled = false;
        playVoiceBtn.dataset.textToSpeak = signMeaning;
    }
    
    // Add to recent detections
    updateRecentDetections(randomSign, signMeaning);
    
    // Show notification
    showNotification(`✓ Sign detected: ${formatSignName(randomSign)} → "${signMeaning}"`, 'success');
}

// Updated clearSignResults function
function clearSignResults() {
    const detectedSign = document.getElementById('detectedSign');
    const translatedText = document.getElementById('translatedTextOutput');
    const playVoiceBtn = document.getElementById('playTranslatedVoice');
    const recentContainer = document.getElementById('recentDetections');
    
    // Clear current detection
    if (detectedSign) {
        detectedSign.innerHTML = `
            <div class="text-center">
                <div class="text-4xl mb-2">-</div>
                <p class="text-gray-600">No sign detected</p>
            </div>
        `;
    }
    
    if (translatedText) {
        translatedText.innerHTML = `
            <p class="text-gray-500 text-center">Make a sign and click "Detect" to see translation</p>
        `;
    }
    
    if (playVoiceBtn) {
        playVoiceBtn.disabled = true;
        delete playVoiceBtn.dataset.textToSpeak;
    }
    
    // Clear recent detections
    recentDetections = [];
    
    if (recentContainer) {
        recentContainer.innerHTML = `
            <div class="text-center py-4 text-gray-500">
                <p>No recent detections</p>
            </div>
        `;
    }
    
    showNotification('Results cleared', 'info');
}

// Updated initSignToVoice function (simplified)
function initSignToVoice() {
    // Get all elements
    const startCameraBtn = document.getElementById('startCamera');
    const stopCameraBtn = document.getElementById('stopCamera');
    const captureSignBtn = document.getElementById('captureSign');
    const clearResultsBtn = document.getElementById('clearResults');
    const playVoiceBtn = document.getElementById('playTranslatedVoice');
    
    // Event Listeners
    if (startCameraBtn) startCameraBtn.addEventListener('click', startWebcam);
    if (stopCameraBtn) stopCameraBtn.addEventListener('click', stopWebcam);
    if (captureSignBtn) captureSignBtn.addEventListener('click', captureAndDetectSign);
    if (clearResultsBtn) clearResultsBtn.addEventListener('click', clearSignResults);
    if (playVoiceBtn) playVoiceBtn.addEventListener('click', playDetectedVoice);
}