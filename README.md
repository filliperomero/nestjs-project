
# Running Docker Compose

Command: `docker-compose up -d`\
This will run our docker compose file and run in background (detached mode which means we don't need terminal open for that)

Command: `docker ps`\
This will show the list of containers

# Generating Public/Private key for RSA256

### MacOS
- Command to generate private key:\
`openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048`
- Command to generate a public key from private key:\
`openssl rsa -pubout -in private_key.pem -out public_key.pem`
- Command to convert to Base64 (to put in .env file):\
`base64 -i private_key.pem -o private_key-base64.txt`