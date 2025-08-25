from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from main import get_medical_analysis_from_file, continue_medical_chat
import tempfile
import os
import uuid

# Create the FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Pydantic models
class ChatMessage(BaseModel):
    message: str
    session_id: str

# In-memory storage for chat sessions
chat_sessions = {}

# Root GET endpoint
@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI is working!"}

@app.post("/MedicalHistoryPdf")
async def analyze_medical_history(
    file: UploadFile = File(...),
    problem: str = Form(...)
):
    # Validate file type
    if not file.filename.endswith('.pdf'):
        return JSONResponse(
            status_code=400, 
            content={"error": "Only PDF files are allowed"}
        )
    
    try:
        # Create a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            # Read and write file content to temp file
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        # Process the PDF
        analysis = get_medical_analysis_from_file(temp_file_path, problem)
        
        # Generate a session ID for chat context
        session_id = str(uuid.uuid4())
        
        # Store the context for future chat
        chat_sessions[session_id] = {
            "analysis": analysis,
            "original_symptoms": problem,
            "chat_history": []
        }
        
        # Clean up - delete temporary file
        os.unlink(temp_file_path)
        
        print("Analysis Result:", analysis)  # Debugging line
        return {
            "analysis": analysis,
            "session_id": session_id
        }
        
    except Exception as e:
        # Clean up temp file if it exists
        if 'temp_file_path' in locals():
            try:
                os.unlink(temp_file_path)
            except:
                pass
        return JSONResponse(
            status_code=500,
            content={"error": f"Error processing file: {str(e)}"}
        )

@app.post("/chat")
async def chat_with_context(chat_request: ChatMessage):
    session_id = chat_request.session_id
    user_message = chat_request.message
    
    # Check if session exists
    if session_id not in chat_sessions:
        return JSONResponse(
            status_code=404,
            content={"error": "Session not found. Please upload a PDF first."}
        )
    
    try:
        # Get session context
        session = chat_sessions[session_id]
        
        # Generate response using the original AI function
        response = continue_medical_chat(
            user_message,
            session["analysis"],
            session["chat_history"]
        )
        
        # Add to chat history
        session["chat_history"].append({
            "user": user_message,
            "assistant": response
        })
        
        return {"response": response}
        
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Error processing chat: {str(e)}"}
        )