# Use Python base image
FROM python:3.10-slim

# Set working directory inside the container
WORKDIR /app

# Install OS dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    curl \
 && rm -rf /var/lib/apt/lists/*

# Copy requirements.txt and install Python dependencies
COPY backend/requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy the entire backend folder contents into the container
COPY backend/ .

# Expose FastAPI port
EXPOSE 8000

# Run the FastAPI app using uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]