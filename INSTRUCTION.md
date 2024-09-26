## Setup Instructions

To streamline the local setup of the ArtElevate app on your computer, carefully follow these steps:

1. Navigate to the ArtElevate Solution directory:
   ```zsh
   cd ArtElevate
   ```

2. Ensure that Docker Desktop is installed on your machine. If not, download and install it from Docker ([installation instructions](https://docs.docker.com/desktop/)).

3. Build the services locally (execute this command in the directory containing the docker-compose.yml file):
   ```zsh
   docker compose build
   ```

4. Install 'mkcert' on your computer to provide the app with an SSL certificate. Obtain 'mkcert' from [here](https://github.com/FiloSottile/mkcert), and install the local Certificate Authority:

- On MacOS:
  ```zsh
  brew install mkcert
  ```
- On Windows:
  ```zsh
  choco install mkcert
  ```    

5. Generate the certificate and key files:
   ```zsh
   mkdir devcerts
   cd devcerts
   mkcert -key-file artelevate.com.key -cert-file artelevate.com.crt app.artelevate.com api.artelevate.com id.artelevate.com
   ```

6. Update your host file:
    - Refer to this [guide](https://phoenixnap.com/kb/how-to-edit-hosts-file-in-windows-mac-or-linux) if necessary.
    - Add the following entry:
    ```
   127.0.0.1 id.artelevate.com app.artelevate.com api.artelevate.com
   ```  

7. Launch the services:
   ```zsh
   docker compose up -d
   ```

8. Check the results
 - [Web Application](https://app.artelevate.com)
 - [Identity Server](https://id.artelevate.com)
 - [Monitoring](http://localhost:3000)
 -  [Portainer](http://localhost:9000)
