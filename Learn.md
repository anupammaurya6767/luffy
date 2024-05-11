
# Learn

This document provides instructions on how to set up and build the project locally.

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- Node.js and npm (Node Package Manager)
- Docker (if applicable)
- Google Drive API credentials (`credentials.json`) for uploading files to Google Drive.

## Setup

Follow these steps to set up the project locally:

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/anupammaurya6767/luffy.git
   ```

2. Navigate to the project directory:

   ```bash
   cd luffy
   ```

3. Install project dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory of your project and add the following environment variables:

   ```plaintext
   mongoURL=your-mongodb-url
   dbName=whatsapp_api
   authcollectionName=auth_info
   folderID=your-folder-id
   ALLOWED_ID=your-allowed-id
   LEECH_LIMIT=your-leech-limit # in bytes
   ```

   Replace `your-mongodb-url`, `your-folder-id`, `your-allowed-id`, and `your-leech-limit` with the appropriate values for your project.

5. Place your Google Drive API credentials file (`credentials.json`) in the root directory of the project.

## Using Docker

If you want to run the project using Docker, follow these steps:

1. Build the Docker image:

   ```bash
   docker build -t luffy-image .
   ```

2. Run the Docker container:

   ```bash
   docker run -d -p 9600:9600 --env-file .env -v $(pwd)/credentials.json:/app/credentials.json luffy-image
   ```

## Run Locally

To run the project locally without Docker, follow these steps:

1. Start the project:

   ```bash
   node index.js
   ```

2. The project will run on port 9600 by default.

## Additional Notes

- Ensure that MongoDB is running locally or is accessible at the provided `mongoURL`.
- Modify the port number if necessary by updating the `.env` file or the Docker run command.
- Modify any other configuration settings as needed for your environment.
