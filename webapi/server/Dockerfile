# Use the AWS Lambda Node.js 20 base image
FROM public.ecr.aws/lambda/nodejs:20

# Set the working directory in the container
WORKDIR ${LAMBDA_TASK_ROOT}

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install --omit=dev

# Copy the rest of the application code
COPY . ./

# Set the CMD to your handler (lambda.handler in this case)
CMD [ "index.handler" ]