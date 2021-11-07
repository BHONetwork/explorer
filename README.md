# Bholdus asset explorer
Services:
1. scan: Scan blockchain data and insert into DB (/packages/scan)
2. explorer: UI for Bholdus blockchain explorer (/packages/next)
3. mongodb: database for Bholdus chain data

# Getting started
1. cd e2e
2. docker-compose build
3. docker-compose up -d explorer
4. Open http://localhost:6001/
