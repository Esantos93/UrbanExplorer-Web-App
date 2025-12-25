// src/api/llmSource.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "./apiConfig";

// Initialize the SDK
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" },
    { apiVersion: 'v1' });

/**
 * Fetches a cultural fun fact using the official SDK from Google Generative AI.
 * @param {string} placeName - The name of the place to get a fun fact about.
 * @returns {Promise<string>} - A promise that resolves to the fun fact string.
 */

export function fetchCulturalFact(placeName) {
    if (!placeName) {
        return Promise.resolve("No venue name provided.");
    }

    const prompt = `Provide a very short, unique, and interesting cultural or historical fun fact about ${placeName}. Be concise (max 2 sentences).`;

    // The SDK's generateContent returns a promise
    return model.generateContent(prompt)
        .then(function getResponseACB(result) {

            const response = result.response; // When you call model.generateContent(prompt), an object of type GenerateContentResult is returned that contains a specific property within that "result" object that contains the methods for reading the generated content.
            return response.text(); // The SDK has a helper function .text() which also returns a promise or string
        })
        .then(function returnFactACB(text) {
            return text || "No cultural fact found for this location."; // In case the response is empty
        })
        .catch(function errorACB(error) {
            console.error("Gemini SDK Error:", error);
            throw error;
        });
}