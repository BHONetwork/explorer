module.exports = {
  apps: [
    {
      name: "bholdus-dev",
      script: "server.js",
      log_date_format: "YYYY-MM-DD HH:mm Z",
      watch: true,
      watch_delay: 1000,
      watch_options: {
        followSymlinks: false,
      },
      ignore_watch: ["node_modules", ".next"],
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
    {
      name: "bholdus-prod",
      script: "yarn",
      interpreter: "bash",
      args: "start",
      log_date_format: "YYYY-MM-DD HH:mm Z",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
