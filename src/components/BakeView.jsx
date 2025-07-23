import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { RotateCcw, RotateCw } from "lucide-react";
import HeaderFooter from "./multipurpose/HeaderFooter.jsx";
import { useAuth } from "../AuthContext";

const BakeView = () => {
  const { recipeid } = useParams();
  const { getToken } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [microphonePermission, setMicrophonePermission] = useState("prompt");
  const [voiceSetupComplete, setVoiceSetupComplete] = useState(false);

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const stepRefs = useRef([]);
  const shouldRestartRef = useRef(false);
  const currentStateRef = useRef({ recipe: null, currentStep: 0 });

  // Keep current state in ref for voice commands
  useEffect(() => {
    currentStateRef.current = { recipe, currentStep };
  }, [recipe, currentStep]);

  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8080/api";

  // Auto-start voice recognition when recipe loads
  const initializeVoiceRecognition = useCallback(async () => {
    if (!recipe || voiceSetupComplete || !recognitionRef.current) return;

    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      setError("Speech recognition not supported in this browser");
      return;
    }

    try {
      // Request microphone permission and start listening automatically
      shouldRestartRef.current = true;
      setIsListening(true);

      await recognitionRef.current.start();
      setVoiceSetupComplete(true);
      // Speak the first instruction after a brief delay
      setTimeout(() => {
        if (recipe && recipe.instructions && recipe.instructions[currentStep]) {
          synthRef.current.cancel();
          const utterance = new SpeechSynthesisUtterance(
            recipe.instructions[currentStep]
          );
          utterance.rate = 0.9;
          utterance.pitch = 1;
          utterance.onstart = () => setIsSpeaking(true);
          utterance.onend = () => setIsSpeaking(false);
          synthRef.current.speak(utterance);
        }
      }, 1000);
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      shouldRestartRef.current = false;
      setIsListening(false);

      if (error.name === "NotAllowedError") {
        setMicrophonePermission("denied");
        setError(null); // Don't show error immediately, let user try manually
      } else if (error.name === "InvalidStateError") {
        // Recognition already started, just update state
        setVoiceSetupComplete(true);
        setTimeout(() => {
          if (
            recipe &&
            recipe.instructions &&
            recipe.instructions[currentStep]
          ) {
            synthRef.current.cancel();
            const utterance = new SpeechSynthesisUtterance(
              recipe.instructions[currentStep]
            );
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            synthRef.current.speak(utterance);
          }
        }, 1000);
      } else {
        setError(
          "Could not start voice recognition. You can still use manual controls."
        );
      }
    }
  }, [recipe, voiceSetupComplete, currentStep]);

  // Fetch recipe data
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const token = getToken();
        const response = await fetch(`${API_BASE_URL}/recipes/${recipeid}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Recipe not found");
        const data = await response.json();
        setRecipe(data);

        // Initialize step refs
        stepRefs.current = new Array(data.instructions?.length || 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (recipeid) {
      fetchRecipe();
    }
  }, [recipeid, getToken]);

  // Initialize speech recognition
  useEffect(() => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      setError("Speech recognition not supported in this browser");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setMicrophonePermission("granted");
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const last = event.results.length - 1;
      const command = event.results[last][0].transcript.toLowerCase().trim();
      handleVoiceCommand(command);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);

      if (event.error === "not-allowed") {
        setMicrophonePermission("denied");
        setIsListening(false);
        shouldRestartRef.current = false;
      } else if (event.error === "no-speech") {
        // This is normal, just restart if we should be listening
        if (shouldRestartRef.current) {
          setTimeout(() => {
            if (shouldRestartRef.current && recognitionRef.current) {
              try {
                recognitionRef.current.start();
              } catch (e) {}
            }
          }, 1000);
        }
      }

      if (event.error !== "no-speech") {
        setIsListening(false);
        shouldRestartRef.current = false;
      }
    };

    recognition.onend = () => {
      if (shouldRestartRef.current) {
        try {
          recognition.start();
        } catch (e) {
          setIsListening(false);
          shouldRestartRef.current = false;
        }
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognition) {
        shouldRestartRef.current = false;
        try {
          recognition.stop();
        } catch (e) {}
      }
    };
  }, []);

  // Auto-start voice recognition when recipe is loaded
  useEffect(() => {
    if (recipe && !voiceSetupComplete && recognitionRef.current) {
      // Small delay to ensure everything is properly initialized
      const timer = setTimeout(() => {
        initializeVoiceRecognition();
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [recipe, voiceSetupComplete, initializeVoiceRecognition]);

  // Navigation functions
  const goToNextStep = useCallback(() => {
    if (
      recipe &&
      recipe.instructions &&
      currentStep < recipe.instructions.length - 1
    ) {
      setCurrentStep((prev) => {
        return prev + 1;
      });
    } else {
    }
  }, [recipe, currentStep]);

  const goToPreviousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => {
        return prev - 1;
      });
    } else {
    }
  }, [currentStep]);

  // Text-to-speech function
  const speakCurrentStep = useCallback(() => {
    if (!recipe || !recipe.instructions[currentStep]) return;

    synthRef.current.cancel(); // Stop any current speech

    const utterance = new SpeechSynthesisUtterance(
      recipe.instructions[currentStep]
    );
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  }, [recipe, currentStep]);

  // Handle voice commands
  const handleVoiceCommand = useCallback((command) => {
    const { recipe: currentRecipe, currentStep: currentStepValue } =
      currentStateRef.current;

    if (command.includes("next")) {
      if (
        currentRecipe &&
        currentRecipe.instructions &&
        currentStepValue < currentRecipe.instructions.length - 1
      ) {
        setCurrentStep((prev) => prev + 1);
      } else {
      }
    } else if (command.includes("back") || command.includes("previous")) {
      if (currentStepValue > 0) {
        setCurrentStep((prev) => prev - 1);
      } else {
      }
    } else if (command.includes("repeat") || command.includes("again")) {
      if (currentRecipe && currentRecipe.instructions[currentStepValue]) {
        synthRef.current.cancel();
        const utterance = new SpeechSynthesisUtterance(
          currentRecipe.instructions[currentStepValue]
        );
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        synthRef.current.speak(utterance);
      }
    } else {
    }
  }, []);

  // Auto-speak when step changes (only if listening)
  useEffect(() => {
    if (recipe && recipe.instructions && isListening) {
      speakCurrentStep();
    }
  }, [currentStep, recipe, isListening, speakCurrentStep]);

  // Auto-scroll to current step
  useEffect(() => {
    if (stepRefs.current[currentStep]) {
      stepRefs.current[currentStep].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentStep]);

  // Manual toggle for when auto-start fails
  const toggleListening = async () => {
    if (isListening) {
      // Stop listening
      shouldRestartRef.current = false;
      try {
        recognitionRef.current?.stop();
      } catch (e) {}
      synthRef.current.cancel();
      setIsListening(false);
      setIsSpeaking(false);
    } else {
      // Start listening
      try {
        shouldRestartRef.current = true;
        await recognitionRef.current?.start();
        // speakCurrentStep will be called by onstart event
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        shouldRestartRef.current = false;
        setIsListening(false);

        if (error.name === "NotAllowedError") {
          setMicrophonePermission("denied");
          setError(
            "Microphone access denied. Please allow microphone access and refresh the page."
          );
        } else if (error.name === "InvalidStateError") {
          // Already running, just update our state
          setIsListening(true);
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <p className="text-base-content/70">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-error text-6xl mb-4">🍳</div>
          <h2 className="text-2xl font-bold text-error mb-2">Oops!</h2>
          <p className="text-base-content/70">{error}</p>
          {microphonePermission === "denied" && (
            <div className="mt-4 p-4 bg-warning/20 rounded-lg">
              <p className="text-sm">
                To use voice commands, please:
                <br />
                1. Refresh this page
                <br />
                2. Click "Allow" when prompted for microphone access
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!recipe) return null;

  return (
    <HeaderFooter>
      <div className="min-h-screen mt-20 mb-24 overflow-scroll bg-gradient-to-br from-primary/5 to-secondary/5">
        {/* Header */}
        <div className="bg-secondary shadow-lg sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-primary">
                  {recipe.title}
                </h1>
                <p className="text-base-content/70">
                  Step {currentStep + 1} of {recipe.instructions?.length || 0}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                {/* Voice status indicators */}
                {isListening && (
                  <div className="flex items-center space-x-2">
                    <div className="badge badge-success">🎤 Voice Active</div>
                    {isSpeaking && (
                      <div className="badge badge-accent animate-pulse">
                        Speaking...
                      </div>
                    )}
                  </div>
                )}

                {microphonePermission === "denied" && (
                  <div
                    className="tooltip tooltip-left"
                    data-tip="Click to retry microphone access"
                  >
                    <button
                      onClick={toggleListening}
                      className="btn btn-circle btn-sm btn-warning"
                    >
                      🚫
                    </button>
                  </div>
                )}

                {!isListening && microphonePermission !== "denied" && (
                  <button
                    onClick={toggleListening}
                    className="btn btn-circle btn-primary"
                    title="Start voice commands"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}

                {isListening && (
                  <button
                    onClick={toggleListening}
                    className="btn btn-circle btn-error"
                    title="Stop voice commands"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <progress
                className="progress progress-primary w-full"
                value={currentStep + 1}
                max={recipe.instructions?.length || 1}
              ></progress>
            </div>
          </div>
        </div>

        {/* Recipe Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Ingredients Sidebar */}
            <div className="lg:col-span-1">
              <div className="card bg-base-100 shadow-xl sticky top-32">
                <div className="card-body rounded-xl bg-secondary">
                  <h3 className="card-title text-primary">Ingredients</h3>
                  <ul className="space-y-2">
                    {recipe.ingredients?.map((ingredient, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-accent rounded-full mr-3 flex-shrink-0"></div>
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {recipe.instructions?.map((instruction, index) => (
                  <div
                    key={index}
                    ref={(el) => (stepRefs.current[index] = el)}
                    className={`card transition-all duration-500 transform ${
                      index === currentStep
                        ? "bg-primary text-primary-content shadow-2xl scale-105 border-2 border-primary"
                        : index < currentStep
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "bg-secondary text-base-content shadow-md hover:shadow-lg"
                    }`}
                  >
                    <div className="card-body">
                      <div className="flex items-start space-x-4">
                        <div
                          className={`badge badge-lg flex-shrink-0 ${
                            index === currentStep
                              ? "badge-primary-content"
                              : index < currentStep
                              ? "badge-primary"
                              : "badge-neutral"
                          }`}
                        >
                          {index < currentStep ? "✓" : index + 1}
                        </div>

                        <div className="flex-1">
                          <p
                            className={`text-lg leading-relaxed ${
                              index === currentStep ? "font-semibold" : ""
                            }`}
                          >
                            {instruction}
                          </p>

                          {index === currentStep && isListening && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              <div className="badge badge-primary-content">
                                🎤 Say "next", "back", or "repeat"
                              </div>
                              {isSpeaking && (
                                <div className="badge badge-accent animate-pulse">
                                  <RotateCw className="w-3 h-3 mr-1" />
                                  Speaking...
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Manual Controls */}
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="flex mb-16 space-x-2 bg-primary rounded-full shadow-xl p-2">
              <button
                onClick={goToPreviousStep}
                disabled={currentStep === 0}
                className="btn btn-circle btn-sm"
              >
                ←
              </button>

              <button
                onClick={speakCurrentStep}
                className="btn btn-circle btn-sm btn-accent"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              <button
                onClick={goToNextStep}
                disabled={
                  !recipe.instructions ||
                  currentStep >= recipe.instructions.length - 1
                }
                className="btn btn-circle btn-sm"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </HeaderFooter>
  );
};

export default BakeView;
