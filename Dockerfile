FROM node:7.10.0

## CREATE APP USER ##

# Create the home directory for the new app user.
RUN mkdir -p /home/app

# Create an app user so our program doesn't run as root.
RUN groupadd -r app &&\
    useradd -r -g app -d /home/app -s /sbin/nologin -c "Docker image user" app

# Set the home directory to our app user's home.
ENV APP_HOME=/home/app/userService

# Prepare app directory
RUN mkdir -p $APP_HOME
WORKDIR $APP_HOME
ADD package.json $APP_HOME
RUN npm install --production

# Chown all the files to the app user.
RUN chown -R app:app $APP_HOME

# Environment variable
ENV NODE_ENV=production

# Add in project files
ADD . $APP_HOME

# Change to the app user.
USER app

# Expose the app port
EXPOSE 3000

# Start the app
CMD ["node", "webapp.js"]
