import os
from flask import Flask, Response, jsonify, request
import google.generativeai as genai
from google.generativeai import types
from flask_cors import CORS
app = Flask(__name__)
CORS(app) 

# Check if API key is available
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("WARNING: No GEMINI_API_KEY environment variable found!")

# Configure the API key for the Gemini SDK
genai.configure(api_key=api_key)

@app.route("/chat", methods=["POST"])
def chat():
    if not api_key:
        return jsonify({"error": "API key not configured"}), 500

    # Get user message from the request JSON
    data = request.get_json()
    user_message = data.get("message", "Hello, who are you?")  # default message if none provided

    return Response(generate_response(user_message), mimetype="text/plain")

def generate_response(user_message):
    try:
        # Read your resume from a text file (ensure the file "resume.txt" exists)
        with open("resume.txt", "r", encoding="utf-8") as f:
            resume_text = f.read()
        
        # Specify the Gemini model to use
        model = "gemini-2.5-pro-exp-03-25"
        
        # Build the prompt that includes your resume and the user's message
        prompt = f"""
You are AbdulGPT, Abdul's friendly assistant. Use the resume data provided below to answer questions about Abdul in a concise and conversational tone.

RESUME:
{resume_text}

User: {user_message}
Assistant:"""
        
        # Set up generation configuration
        generate_content_config = types.GenerationConfig(
            temperature=0.2,
            max_output_tokens=200,  # Adjust as needed
            response_mime_type="text/plain"
        )
        
        # Create a generative model instance using the specified model
        model_instance = genai.GenerativeModel(model)
        
        # Generate content using the prompt; stream the response
        response = model_instance.generate_content(prompt, stream=True)
        
        # Stream each chunk of the response
        for chunk in response:
            if chunk.text:
                yield chunk.text
    except Exception as e:
        yield f"Error: {str(e)}"

@app.route("/")
def index():
    if not api_key:
        return "WARNING: No API key configured! Set the GEMINI_API_KEY environment variable."
    return "AbdulGPT API is running"

if __name__ == "__main__":
    app.run(debug=True)
