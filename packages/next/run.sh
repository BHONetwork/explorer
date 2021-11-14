#!/bin/bash
pm2-runtime start ecosystem.config.js --only statescan-next --watch --env development
# npm run scan