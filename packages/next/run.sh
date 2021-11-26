#!/bin/bash
# pm2-runtime start ecosystem.config.js --only statescan-next --watch --env development
pm2-runtime start ecosystem.config.js --only statescan-next-prod --env production
# npm run scan