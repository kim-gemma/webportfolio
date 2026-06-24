module.exports = {
  apps: [
    {
      name: "pixel-garden-api",
      script: "dist/index.js",
      cwd: "/var/www/pixel-garden/server",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: "4000",
      },
      error_file: "/var/log/pixel-garden/api-error.log",
      out_file: "/var/log/pixel-garden/api-out.log",
      time: true,
    },
  ],
};
