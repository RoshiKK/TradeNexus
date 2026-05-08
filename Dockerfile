# Use Node.js base image
FROM node:20

# Install PM2 to manage multiple processes
RUN npm install -g pm2

WORKDIR /app

# Copy all services
COPY api-gateway ./api-gateway
COPY user-service ./user-service
COPY product-service ./product-service
COPY order-service ./order-service
COPY payment-service ./payment-service

# Install dependencies for all services
RUN cd api-gateway && npm install
RUN cd user-service && npm install
RUN cd product-service && npm install
RUN cd order-service && npm install
RUN cd payment-service && npm install

# Expose the API Gateway port (Hugging Face uses 7860)
ENV PORT=7860
EXPOSE 7860

# Create a start script with environment variables
RUN echo '#!/bin/bash\n\
PORT=4001 MONGO_URI=${MONGO_URI}users pm2 start user-service/server.js --name user-service\n\
PORT=4002 MONGO_URI=${MONGO_URI}products pm2 start product-service/server.js --name product-service\n\
PORT=4003 MONGO_URI=${MONGO_URI}orders PRODUCT_SERVICE_URL=http://localhost:4002 PAYMENT_SERVICE_URL=http://localhost:4004 pm2 start order-service/server.js --name order-service\n\
PORT=4004 MONGO_URI=${MONGO_URI}payments pm2 start payment-service/server.js --name payment-service\n\
PORT=7860 USER_SERVICE_URL=http://localhost:4001 PRODUCT_SERVICE_URL=http://localhost:4002 ORDER_SERVICE_URL=http://localhost:4003 PAYMENT_SERVICE_URL=http://localhost:4004 pm2 start api-gateway/server.js --name api-gateway --no-daemon\n\
' > start.sh && chmod +x start.sh


CMD ["./start.sh"]
