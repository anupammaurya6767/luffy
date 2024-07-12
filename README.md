<div align="center">

# Luffy: Download torrents directly to your device!📥📀

<i>Luffy is a WhatsApp torrent mirror leech bot designed to download torrents directly to your device. Integrated with various functionalities including a feature for uploading links directly to Google Drive, Luffy is designed to make file sharing easier within WhatsApp groups.</i>

</div>

<div align = "center">
<table align="center">
    <thead align="center">
        <tr border: 1px;>
            <td><b>🌟 Stars</b></td>
            <td><b>🍴 Forks</b></td>
            <td><b>🐛 Issues</b></td>
            <td><b>🔔 Open PRs</b></td>
            <td><b>🔕 Close PRs</b></td>
        </tr>
     </thead>
    <tbody>
         <tr>
            <td><img alt="Stars" src="https://img.shields.io/github/stars/anupammaurya6767/luffy?style=flat&logo=github"/></td>
             <td><img alt="Forks" src="https://img.shields.io/github/forks/anupammaurya6767/luffy?style=flat&logo=github"/></td>
            <td><img alt="Issues" src="https://img.shields.io/github/issues/anupammaurya6767/luffy?style=flat&logo=github"/></td>
            <td><img alt="Open Pull Requests" src="https://img.shields.io/github/issues-pr/anupammaurya6767/luffy?style=flat&logo=github"/></td>
           <td><img alt="Close Pull Requests" src="https://img.shields.io/github/issues-pr-closed/anupammaurya6767/luffy?style=flat&color=critical&logo=github"/></td>
        </tr>
    </tbody>
</table>
</div>

<div align="center">

## 💻Tech Used

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
![Google Drive](https://img.shields.io/badge/Google%20Drive-4285F4?style=for-the-badge&logo=googledrive&logoColor=white)

</div>

## 🎬Demo

**View the functionality here : [Demo Link](https://x.com/anupammaurya981/status/1772310401327231002)**

## ✨Features

- Download torrents directly to your device
- Tools to manage WhatsApp groups effectively
- Upload links directly to Google Drive.
- Additional features to enhance group interactions and management.

## Installation

### Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- Node.js and npm (Node Package Manager)
- Docker (if applicable)
- Google Drive API credentials (`credentials.json`) for uploading files to Google Drive.

### Setup

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

### Using Docker

If you want to run the project using Docker, follow these steps:

1. Build the Docker image:

   ```bash
   docker build -t luffy-image .
   ```

2. Run the Docker container:

   ```bash
   docker run -d -p 9600:9600 --env-file .env -v $(pwd)/credentials.json:/app/credentials.json luffy-image
   ```

### Using Kubernetes

1. Start the kubernetes:

```bash
minikube start
```

2. Create the .env file and credentials.json in root folder

3. Run the multiple Pods of Server:

```bash
 kubectl create configmap node-app-env --from-env-file=.env
 kubectl create secret generic node-app-credentials --from-file=credentials.json
 kubectl apply -f deployment.yaml
 kubectl apply -f service.yaml

```

### Run Locally

To run the project locally without Docker, follow these steps:

1. Start the project:

   ```bash
   node index.js
   ```

2. The project will run on port 9600 by default.

### Additional Notes

- Ensure that MongoDB is running locally or is accessible at the provided `mongoURL`.
- Modify the port number if necessary by updating the `.env` file or the Docker run command.
- Modify any other configuration settings as needed for your environment.

Happy coding!💻✨

## 🤝Contributing

We welcome contributions to Luffy! Please refer to our [Contributing Guidelines](CONTRIBUTING.md) for detailed information on how you can get involved.

## 👥Maintainers

- [**Anupam Maurya**](https://github.com/anupammaurya6767)
- [**Suhani Paliwal**](https://github.com/suhanipaliwal)

<div>
 
<h2 align = "center">Our Contributors ❤️</h2>
<div align = "center">
  
![Contributors](https://contrib.rocks/image?repo=anupammaurya6767/luffy)

### Show some ❤️ by starring this repository!

</div>
