// import express from "express";
import "dotenv/config";
// import cors from "cors";

const getOpenAPIResponse = async (message) => {
    const options = {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`, 
            "HTTP-Referer": "http://localhost:8080", 
        },
        body: JSON.stringify({
            model: "openai/gpt-4o-mini", 
            messages: [
                {
                    role: "user",
                    content: message
                }]  
        })
    };

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", options);
        const data = await response.json();

        if (data.error) {
            console.error("API Error:", data.error.message);
            return "Sorry, something went wrong with the API.";
        }

        return data.choices[0].message.content;
    } catch (error) {
        console.error("Fetch Error:", error);
        return "Internal Server Error";
    }
};

export default getOpenAPIResponse;