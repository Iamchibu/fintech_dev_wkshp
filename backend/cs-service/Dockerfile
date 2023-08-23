# Use an official Python runtime as a parent image
# FROM python:3.9-slim-buster

FROM public.ecr.aws/lambda/python:3.9

# Set the working directory in the container to /app
# WORKDIR /app

# Copy the requirements.txt file into the container at /app
# COPY requirements.txt /app/

COPY requirements.txt ${LAMBDA_TASK_ROOT}

COPY handler.py ${LAMBDA_TASK_ROOT}

RUN pip install -r requirements.txt

CMD [ "handler.process_pdf" ]

# Install any needed packages specified in requirements.txt
# RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the working directory contents into the container at /app
# COPY . /app/

# Run app.py when the container launches
# CMD ["python", "handler.py"]




