from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tempfile
import os
import PyPDF2

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

# Pydantic models for request/response
class ChatMessage(BaseModel):
    message: str
    session_id: str

# In-memory storage for chat sessions (in production, use a proper database)
chat_sessions = {}

# Root GET endpoint
@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI is working!"}

def extract_text_from_pdf(file_path: str) -> str:
    """Simple PDF text extraction using PyPDF2"""
    try:
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
        return text
    except Exception as e:
        return f"Error extracting text: {str(e)}"

def mock_analysis(pdf_text: str, symptoms: str) -> dict:
    """Mock analysis function for demonstration"""
    
    # Extract some basic info from PDF (simplified)
    summary = f"Based on the uploaded medical document, the patient's history includes relevant medical information. The document contains {len(pdf_text.split())} words of medical data."
    
    # Mock AI suggestions based on symptoms
    suggestion = f"""Based on your symptoms: "{symptoms}" and medical history analysis:

RECOMMENDATIONS:
• General consultation with a primary care physician is recommended
• Monitor symptoms and maintain a symptom diary
• Consider basic diagnostic tests if symptoms persist
• Follow up with healthcare provider within 1-2 weeks

IMPORTANT NOTES:
• This is a demonstration analysis only
• Always consult with qualified healthcare professionals
• In case of emergency, contact medical services immediately
• Do not use this for actual medical decisions

Please note: This is a demo version. For actual medical analysis, a proper AI model with medical training would be required."""
    
    return {
        "summarized_history": summary,
        "ai_suggestion": suggestion
    }

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
        
        # Extract text from PDF
        pdf_text = extract_text_from_pdf(temp_file_path)
        
        # Generate mock analysis
        analysis = mock_analysis(pdf_text, problem)
        
        # Generate a session ID for chat context
        import uuid
        session_id = str(uuid.uuid4())
        
        # Store the context for future chat
        chat_sessions[session_id] = {
            "pdf_text": pdf_text,
            "original_symptoms": problem,
            "analysis": analysis,
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
    
    # Get session context
    session = chat_sessions[session_id]
    
    # Generate response based on context
    response = generate_chat_response(
        user_message,
        session["pdf_text"],
        session["original_symptoms"],
        session["analysis"],
        session["chat_history"]
    )
    
    # Add to chat history
    session["chat_history"].append({
        "user": user_message,
        "assistant": response
    })
    
    return {"response": response}

def generate_chat_response(user_message: str, pdf_text: str, original_symptoms: str, analysis: dict, chat_history: list) -> str:
    """Generate contextual chat response"""
    
    # Build context from previous chat
    context = f"""
Medical Document Summary: {analysis['summarized_history']}
Original Symptoms: {original_symptoms}
Previous Analysis: {analysis['ai_suggestion']}
"""
    
    if chat_history:
        context += "\nPrevious Conversation:\n"
        for chat in chat_history[-3:]:  # Include last 3 exchanges for context
            context += f"User: {chat['user']}\nAssistant: {chat['assistant']}\n"
    
    # Generate response based on user question and context
    if "medication" in user_message.lower() or "medicine" in user_message.lower():
        response = f"""Based on your medical history and symptoms, here are some general medication considerations:

⚠️ IMPORTANT DISCLAIMER: This is for informational purposes only. Always consult your healthcare provider before taking any medication.

For your symptoms mentioned: "{original_symptoms}"

Common approaches might include:
• Over-the-counter pain relievers for general discomfort
• Consult with a primary care physician for proper prescription
• Specialist referral may be needed based on specific symptoms

Please discuss these options with your doctor who can prescribe appropriate medications based on your complete medical history."""

    elif "doctor" in user_message.lower() or "specialist" in user_message.lower():
        response = f"""Based on your symptoms and medical history, here are specialist recommendations:

For symptoms: "{original_symptoms}"

Recommended healthcare providers:
• Primary Care Physician - For initial evaluation
• Internal Medicine Specialist - For comprehensive assessment
• Relevant specialists based on symptom severity

Next Steps:
1. Schedule appointment with primary care doctor
2. Bring your medical records and this analysis
3. Discuss symptoms in detail
4. Follow specialist referrals if needed"""

    elif "diet" in user_message.lower() or "food" in user_message.lower() or "nutrition" in user_message.lower():
        response = f"""Dietary recommendations based on your medical context:

General Guidelines:
• Maintain a balanced diet with fruits and vegetables
• Stay hydrated with adequate water intake
• Limit processed foods and excessive sugar
• Consider anti-inflammatory foods if appropriate

Specific to your symptoms: "{original_symptoms}"
• Consult with a nutritionist for personalized diet plan
• Keep a food diary to track symptom patterns
• Discuss dietary restrictions with your healthcare provider

Remember: Nutritional needs vary by individual medical condition."""

    else:
        response = f"""I understand your question: "{user_message}"

Based on your medical context:
- Original symptoms: {original_symptoms}
- Medical history analysis shows relevant health information

For specific medical questions, I recommend:
• Consulting with your healthcare provider
• Scheduling a follow-up appointment
• Bringing your medical records for reference

Is there a specific aspect of your health you'd like to discuss further? I can provide general information about symptoms, medications, specialists, or lifestyle recommendations."""

    return response
