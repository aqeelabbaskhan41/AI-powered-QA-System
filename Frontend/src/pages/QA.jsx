import React, { useState } from "react";

function QA() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  async function askQuestion() {
    

    try {
      const url = "http://localhost:3000/ask";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();
      const answerText = String(data.answer).charAt(0).toUpperCase() + String(data.answer).slice(1);

      setAnswer(answerText || "No answer provided");
    } catch (err) {
      console.error("Error occurred:", err);
      setAnswer("Error: could not fetch answer");
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      askQuestion();
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Ask Your Question
            </h1>
            <p className="text-gray-600">
              Get one word answers to your questions instantly
            </p>
          </div>

          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="What would you like to know?"
                className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg"
              />
              {question && (
                <button
                  onClick={() => setQuestion("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <button
            onClick={askQuestion}
            className="w-full py-4 px-6 rounded-2xl font-medium text-white transition-all duration-300 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transform hover:-translate-y-1"
          >
            Ask Question
          </button>

          {answer && (
            <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100 transition-all duration-500 animate-fade-in">
              <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-600 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Answer
              </h2>
              <p className="text-gray-700">{answer}</p>
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
          <p className="text-center text-sm text-gray-500">
            Ask anything and get instant answers
          </p>
        </div>
      </div>
    </div>
  );
}

export default QA;
