import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableLambda
import re

# Initialize parser
parser = StrOutputParser()

# function to make AI response appropriate
def remove_markdown(text: str) -> str:
    text = re.sub(r'(\*{1,2}|#{1,6})', '', text)
    text = re.sub(r'\n\s*[-•]\s*', '\n', text)
    text = re.sub(r'\n\s*\d+\.\s*', '\n', text)
    return text.strip()

# Set your Google AI (Gemini) API key (better to set via terminal export)
if "GOOGLE_API_KEY" not in os.environ:
    # For demo purposes, provide a placeholder or use environment variable
    # You need to set your actual Google API key here
    os.environ["GOOGLE_API_KEY"] = "AIzaSyDumIEKhCRv1QvluYxLYptvvMbvlH2SmK0"
    print("Warning: Using placeholder API key. Please set your actual Google API key.")

def load_and_split_document(file_path: str):
    """
    Load a PDF document and split it into chunks using LangChain
    
    Args:
        file_path (str): Path to the PDF file
    
    Returns:
        list: List of document chunks
    """
    loader = PyPDFLoader(file_path)
    pages = loader.load()
    
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )
    splits = text_splitter.split_documents(pages)
    
    return splits

def get_medical_analysis_from_file(pdf_file_path: str, user_symptoms: str) -> dict:
    """
    Analyze medical history from PDF file and provide suggestions based on user symptoms
    
    Args:
        pdf_file_path (str): Path to the temporary PDF file
        user_symptoms (str): Description of current symptoms/problems
    
    Returns:
        dict: Dictionary containing summarized history and AI suggestions
    """
    # Initialize the LLM
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        thinking_budget=10000
    )
    
    # Load and process the document
    documents = load_and_split_document(pdf_file_path)
    history = "\n".join([doc.page_content for doc in documents])

    # 1️⃣ Summarization chain
    summary_prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a helpful medical assistant."),
        ("human", "Summarize the following medical history in paragraph form. Ignore all personal info:\n\n{history}")
    ])

    summary_chain = summary_prompt | llm | parser | RunnableLambda(lambda x: remove_markdown(x))
    history_summarized = summary_chain.invoke({"history": history})

    # 2️⃣ Medical suggestion chain
    suggestion_prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a helpful assistant of a medical student for analyzing patient medical history and giving suggestion."),
        ("human", """You are given a patient's information. 
Use it to provide a clear, structured, and helpful response. 
suggest me medication for all the symptons you think that patient have and specify which medication is for which sympton, And tell me which type of doctor should I approach 

### Patient Medical History
{history_summarized}

### Current Problem
{user_prob}
Format the response clearly with headings and bullet points.

## Important: Give response in concise manner.
""")
    ])

    suggestion_chain = suggestion_prompt | llm | parser | RunnableLambda(lambda x: remove_markdown(x))
    ai_suggestion = suggestion_chain.invoke({
        "history_summarized": history_summarized,
        "user_prob": user_symptoms
    })

    return {
        "summarized_history": history_summarized,
        "ai_suggestion": ai_suggestion,
        "complete_chat": f"=== Summarized Medical History ===\n{history_summarized}\n\n=== AI Suggestion Based on History and Symptoms ===\n{ai_suggestion}"
    }

# Legacy function for backward compatibility
def get_medical_analysis(pdf_file_path: str, user_symptoms: str) -> dict:
    return get_medical_analysis_from_file(pdf_file_path, user_symptoms)

def continue_medical_chat(user_question: str, medical_context: dict, chat_history: list = None) -> str:
    """
    Continue the medical conversation with context
    
    Args:
        user_question (str): The user's follow-up question
        medical_context (dict): The original medical analysis context
        chat_history (list): Previous chat exchanges
    
    Returns:
        str: AI response to the follow-up question
    """
    # Initialize the LLM
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        thinking_budget=10000
    )
    
    # Build conversation context
    context_text = f"""
Medical History Summary: {medical_context.get('summarized_history', '')}
Previous Analysis: {medical_context.get('ai_suggestion', '')}
"""
    
    # Add chat history if exists
    if chat_history:
        context_text += "\nPrevious Conversation:\n"
        for chat in chat_history[-3:]:  # Last 3 exchanges for context
            context_text += f"User: {chat.get('user', '')}\nAssistant: {chat.get('assistant', '')}\n"
    
    # Create chat prompt using the same system message style
    chat_prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a helpful assistant of a medical student for analyzing patient medical history and giving suggestion."),
        ("human", """You have previously analyzed a patient's medical history and provided suggestions. Now the patient has a follow-up question.

### Previous Medical Analysis Context
{context}

### Patient's Follow-up Question
{user_question}

Please provide a helpful response based on the medical context. Maintain consistency with your previous analysis.
Keep your response clear, structured, and helpful. Always remind the patient to consult with healthcare professionals for medical decisions.

## Important: Give response in concise manner.
""")
    ])
    
    chat_chain = chat_prompt | llm | parser | RunnableLambda(lambda x: remove_markdown(x))
    
    response = chat_chain.invoke({
        "context": context_text,
        "user_question": user_question
    })
    
    return response
